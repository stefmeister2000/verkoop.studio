import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { captureAttribution, getGa4Context, trackEvent, trackLeadConversion } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import { giveaway } from '../data/giveaway'

const COPY = {
  nl: {
    naam: 'Naam',
    bedrijf: 'Bedrijf',
    email: 'Zakelijk e-mailadres',
    telefoon: 'Telefoonnummer',
    website: 'Huidige website',
    websiteHint: 'Optioneel. Laat leeg als je er nog geen hebt.',
    motivatie: 'Waarom zou een nieuwe site bij jullie het verschil maken?',
    motivatieHint: 'Een paar lijnen is genoeg. Dit is waar we op kiezen.',
    consent: 'Ik ga akkoord met de actievoorwaarden en met contact over deze actie en de diensten van Verkoop Studio.',
    rulesLink: 'Lees de actievoorwaarden',
    privacy: 'Privacybeleid',
    submit: 'Verstuur mijn deelname',
    submitting: 'Even geduld…',
    doneTitle: 'Je deelname is binnen.',
    doneBody: `We lezen elke inzending zelf. Na ${giveaway.closes.nl} kiezen we één bedrijf en contacteren we de winnaar persoonlijk. Ook als je niet gekozen wordt, laten we van ons horen.`,
    errors: {
      naam: 'Vul je naam in.',
      bedrijf: 'Vul de naam van je bedrijf in.',
      email: 'Vul een geldig zakelijk e-mailadres in.',
      telefoon: 'Vul je telefoonnummer in.',
      motivatie: 'Vertel kort waarom een nieuwe site het verschil zou maken.',
      consent: 'Je kan alleen meedoen als je akkoord gaat met de actievoorwaarden.',
    },
    sendError: 'Versturen lukt even niet. Probeer opnieuw of mail stef@verkoop.studio.',
  },
  en: {
    naam: 'Name',
    bedrijf: 'Company',
    email: 'Business email',
    telefoon: 'Phone number',
    website: 'Current website',
    websiteHint: 'Optional. Leave it empty if you do not have one yet.',
    motivatie: 'Why would a new site make the difference for you?',
    motivatieHint: 'A few lines is enough. This is what we choose on.',
    consent: 'I agree to the campaign rules and to being contacted about this campaign and the services of Verkoop Studio.',
    rulesLink: 'Read the campaign rules',
    privacy: 'Privacy policy',
    submit: 'Send my entry',
    submitting: 'One moment…',
    doneTitle: 'Your entry is in.',
    doneBody: `We read every entry ourselves. After ${giveaway.closes.en} we pick one business and contact the winner personally. Even if you are not picked, you will hear from us.`,
    errors: {
      naam: 'Please enter your name.',
      bedrijf: 'Please enter your company name.',
      email: 'Please enter a valid business email address.',
      telefoon: 'Please enter your phone number.',
      motivatie: 'Briefly tell us why a new site would make the difference.',
      consent: 'You can only enter if you agree to the campaign rules.',
    },
    sendError: 'We couldn’t send your entry. Try again or email stef@verkoop.studio.',
  },
}

interface FormState {
  naam: string
  bedrijf: string
  email: string
  telefoon: string
  website: string
  motivatie: string
}

const initialState: FormState = { naam: '', bedrijf: '', email: '', telefoon: '', website: '', motivatie: '' }

export default function GiveawayEntryForm({ id = giveaway.formId }: { id?: string }) {
  const { lang } = useLang()
  const t = COPY[lang]
  const [values, setValues] = useState<FormState>(initialState)
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'consent', string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [sendError, setSendError] = useState(false)
  const submissionRef = useRef('')
  const honeypotRef = useRef('')
  const startedRef = useRef(false)

  const { ref } = useInView<HTMLDivElement>(() => trackEvent('form_viewed', { form_id: id }))

  function update<K extends keyof FormState>(key: K, value: string) {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent('form_started', { form_id: id })
    }
    setValues(prev => ({ ...prev, [key]: value }))
  }

  function validate() {
    const next: Partial<Record<keyof FormState | 'consent', string>> = {}
    if (!values.naam.trim()) next.naam = t.errors.naam
    if (!values.bedrijf.trim()) next.bedrijf = t.errors.bedrijf
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.errors.email
    if (!values.telefoon.trim()) next.telefoon = t.errors.telefoon
    if (!values.motivatie.trim()) next.motivatie = t.errors.motivatie
    if (!consent) next.consent = t.errors.consent
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'submitting' || !validate()) return
    submissionRef.current ||= crypto.randomUUID()
    setStatus('submitting')
    setSendError(false)
    const attribution = captureAttribution()

    try {
      const ga4 = await getGa4Context()
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({
          naam: values.naam,
          bedrijf: values.bedrijf,
          email: values.email,
          telefoon: values.telefoon,
          website: values.website,
          // The server reads form_id to tag the CRM campaign; these two lines
          // are what the studio reads in the lead notification and the CRM note.
          doel: lang === 'nl' ? 'Gratis website actie: deelname' : 'Free website campaign: entry',
          uitdaging: values.motivatie,
          extra: `Actievoorwaarden aanvaard: ja (${giveaway.campaign})`,
          form_id: id,
          submission_id: submissionRef.current,
          lang,
          company_website: honeypotRef.current, // Honeypot. Bots fill this.
          attribution,
          ga4,
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) throw new Error('capture_failed')
      trackEvent('form_submitted', { form_id: id, ...attribution })
      trackLeadConversion(receipt, submissionRef.current, id)
      setStatus('done')
    } catch {
      setSendError(true)
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div ref={ref} className="rounded-2xl border border-line bg-surface p-8 text-center reveal sm:p-12">
        <p className="font-display text-2xl text-paper text-balance">{t.doneTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-bone" role="status">{t.doneBody}</p>
      </div>
    )
  }

  const busy = status === 'submitting'

  return (
    <div ref={ref} id={id} className="rounded-2xl border border-line bg-surface p-6 reveal sm:p-10">
      <form onSubmit={handleSubmit} noValidate aria-busy={busy} data-clarity-mask="true" className="grid gap-5 sm:grid-cols-2">
        <Field label={t.naam} htmlFor={`${id}-naam`} error={errors.naam}>
          <input id={`${id}-naam`} className="input" autoComplete="name" maxLength={200} disabled={busy}
            value={values.naam} onChange={e => update('naam', e.target.value)} aria-invalid={Boolean(errors.naam)} />
        </Field>
        <Field label={t.bedrijf} htmlFor={`${id}-bedrijf`} error={errors.bedrijf}>
          <input id={`${id}-bedrijf`} className="input" autoComplete="organization" maxLength={200} disabled={busy}
            value={values.bedrijf} onChange={e => update('bedrijf', e.target.value)} aria-invalid={Boolean(errors.bedrijf)} />
        </Field>
        <Field label={t.email} htmlFor={`${id}-email`} error={errors.email}>
          <input id={`${id}-email`} className="input" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
            maxLength={200} disabled={busy} placeholder={lang === 'nl' ? 'jij@bedrijf.be' : 'you@company.com'}
            value={values.email} onChange={e => update('email', e.target.value)} aria-invalid={Boolean(errors.email)} />
        </Field>
        <Field label={t.telefoon} htmlFor={`${id}-telefoon`} error={errors.telefoon}>
          <input id={`${id}-telefoon`} className="input" type="tel" autoComplete="tel" maxLength={60} disabled={busy}
            placeholder="+32 …" value={values.telefoon} onChange={e => update('telefoon', e.target.value)} aria-invalid={Boolean(errors.telefoon)} />
        </Field>
        <Field label={t.website} htmlFor={`${id}-website`} hint={t.websiteHint} full>
          <input id={`${id}-website`} className="input" inputMode="url" autoCapitalize="none" spellCheck={false}
            maxLength={300} disabled={busy} placeholder="https://"
            value={values.website} onChange={e => update('website', e.target.value)} />
        </Field>
        <Field label={t.motivatie} htmlFor={`${id}-motivatie`} hint={t.motivatieHint} error={errors.motivatie} full>
          <textarea id={`${id}-motivatie`} className="input" rows={4} maxLength={2000} disabled={busy}
            value={values.motivatie} onChange={e => update('motivatie', e.target.value)} aria-invalid={Boolean(errors.motivatie)} />
        </Field>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm text-bone">
            <input type="checkbox" className="mt-1 size-4 shrink-0 accent-accent" checked={consent} disabled={busy}
              onChange={e => setConsent(e.target.checked)} aria-invalid={Boolean(errors.consent)} />
            <span>{t.consent}</span>
          </label>
          {errors.consent && <p className="mt-2 text-sm text-accent-2" role="alert">{errors.consent}</p>}
          <p className="mt-3 text-xs text-mute">
            <a href="#voorwaarden">{t.rulesLink}</a>
            {' · '}
            <Link to="/privacy">{t.privacy}</Link>
          </p>
        </div>

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hidden">
          <label htmlFor={`${id}-company_website`}>Company website</label>
          <input id={`${id}-company_website`} type="text" tabIndex={-1} autoComplete="off"
            onChange={e => { honeypotRef.current = e.target.value }} />
        </div>

        <div className="sm:col-span-2 pt-2">
          <button type="submit" className="button-dark" disabled={busy}>
            {busy ? t.submitting : <>{t.submit} <span aria-hidden="true">↗</span></>}
          </button>
          {sendError && <p className="mt-3 text-sm text-rose-400" role="alert">{t.sendError}</p>}
        </div>
      </form>
    </div>
  )
}

function Field({ label, htmlFor, hint, error, full, children }: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-bone">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-mute">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-sm text-accent-2" role="alert">{error}</p>}
    </div>
  )
}
