import { useEffect, useRef, useState, type FormEvent } from 'react'
import { captureAttribution, trackEvent, trackLeadConversion, getGa4Context } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const GOALS = [
  { key: 'customers', nl: ['Meer klanten', 'Meer aanvragen of boekingen.'], en: ['More customers', 'More enquiries or bookings.'] },
  { key: 'sales', nl: ['Meer online verkopen', 'Je webshop laten groeien.'], en: ['More online sales', 'Grow your online store.'] },
  { key: 'build', nl: ['Een website of app', 'Iets nieuws bouwen of verbeteren.'], en: ['A website or app', 'Build something new or improve it.'] },
  { key: 'efficiency', nl: ['Slimmer werken', 'Meer inzicht met data en automatisering.'], en: ['Work smarter', 'Clarity through data and automation.'] },
  { key: 'explore', nl: ['Ik weet het nog niet', 'Denk samen met ons na over je volgende stap.'], en: ['I’m not sure yet', 'Let’s work out your next step together.'] },
]

const COPY = {
  nl: {
    labels: {
      naam: 'Naam',
      bedrijf: 'Bedrijf (optioneel)',
      email: 'Zakelijk e-mailadres',
      telefoon: 'Telefoonnummer',
      website: 'Website (optioneel)',
      doel: 'Waar kunnen we je mee helpen?',
      uitdaging: 'Grootste uitdaging',
      investering: 'Beschikbaar project- of marketingbudget',
      kanalen: 'Huidige kanalen',
      timing: 'Gewenste timing',
      extra: 'Extra informatie',
    },
    errors: {
      naam: 'Vul je naam in.',
      email: 'Vul een geldig zakelijk e-mailadres in.',
      telefoon: 'Vul je telefoonnummer in.',
      doel: 'Kies je belangrijkste doel.',
      uitdaging: 'Beschrijf kort je grootste uitdaging.',
    },
    optioneel: 'Optioneel',
    addOptional: '+ Extra info toevoegen (optioneel)',
    submitting: 'Even geduld…',
    submit: 'Verstuur je aanvraag',
    doneTitle: 'Bedankt.',
    doneBody:
      'Je aanvraag is goed ontvangen. We contacteren je binnen 24 uur via e-mail of telefoon om je doelen en de volgende stap te bespreken.',
    errorNote:
      'Er ging iets mis bij het versturen. Probeer het opnieuw of mail rechtstreeks naar stefkeppens@gmail.com.',
  },
  en: {
    labels: {
      naam: 'Name',
      bedrijf: 'Company (optional)',
      email: 'Business email',
      telefoon: 'Phone number',
      website: 'Website (optional)',
      doel: 'What can we help you with?',
      uitdaging: 'Biggest challenge',
      investering: 'Available project or marketing budget',
      kanalen: 'Current channels',
      timing: 'Desired timing',
      extra: 'Additional information',
    },
    errors: {
      naam: 'Please enter your name.',
      email: 'Please enter a valid business email address.',
      telefoon: 'Please enter your phone number.',
      doel: 'Please choose your main goal.',
      uitdaging: 'Briefly describe your biggest challenge.',
    },
    optioneel: 'Optional',
    addOptional: '+ Add more info (optional)',
    submitting: 'One moment…',
    submit: 'Send your enquiry',
    doneTitle: 'Thank you.',
    doneBody: 'Your request has been received. We’ll contact you within 24 hours by email or phone to discuss your goals and the next step.',
    errorNote:
      'Something went wrong while sending. Please try again or email directly at stefkeppens@gmail.com.',
  },
}

interface FormState {
  naam: string
  bedrijf: string
  email: string
  telefoon: string
  website: string
  doel: string
  uitdaging: string
  investering: string
  kanalen: string
  timing: string
  extra: string
}

const initialState: FormState = {
  naam: '',
  bedrijf: '',
  email: '',
  telefoon: '',
  website: '',
  doel: '',
  uitdaging: '',
  investering: '',
  kanalen: '',
  timing: '',
  extra: '',
}

interface QualificationFormProps {
  id?: string
  compact?: boolean
  inquiryContext?: string
}

export default function QualificationForm({ id = 'audit-formulier', compact = false, inquiryContext }: QualificationFormProps) {
  const { lang } = useLang()
  const t = COPY[lang]
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done'>('idle')
  const [submitError, setSubmitError] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const submissionRef = useRef('')
  const honeypotRef = useRef('')
  const startedRef = useRef(false)
  const abandonedRef = useRef(false)

  const { ref } = useInView<HTMLDivElement>(() => trackEvent('form_viewed', { form_id: id }))

  useEffect(() => {
    const handleLeave = () => {
      if (startedRef.current && status !== 'done' && !abandonedRef.current) {
        abandonedRef.current = true
        trackEvent('form_abandoned', { form_id: id })
      }
    }
    window.addEventListener('beforeunload', handleLeave)
    return () => window.removeEventListener('beforeunload', handleLeave)
  }, [id, status])

  function update<K extends keyof FormState>(key: K, value: string) {
    if (!startedRef.current) {
      startedRef.current = true
      trackEvent('form_started', { form_id: id })
    }
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!values.naam.trim()) next.naam = t.errors.naam
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t.errors.email
    if (!values.telefoon.trim()) next.telefoon = t.errors.telefoon
    if (!values.doel) next.doel = t.errors.doel
    if (!values.uitdaging.trim()) next.uitdaging = t.errors.uitdaging
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (status === 'submitting' || !validate()) return
    submissionRef.current ||= crypto.randomUUID()

    setStatus('submitting')
    setSubmitError(false)
    const attribution = captureAttribution()

    try {
      const ga4 = await getGa4Context()
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          submission_id: submissionRef.current,
          doel: GOALS.find(goal => goal.key === values.doel)?.[lang][0] ?? values.doel,
          extra: [inquiryContext, values.extra].filter(Boolean).join('\n'),
          form_id: id,
          lang,
          company_website: honeypotRef.current, // Honeypot. Bots fill this.
          attribution,
          ga4,
        }),
      })
      const receipt = await res.json()
      if (!res.ok || receipt.ok !== true) throw new Error(`Request failed: ${res.status}`)
      trackEvent('form_submitted', { form_id: id, doel: values.doel, ...attribution })
      trackLeadConversion(receipt, submissionRef.current, id)
      setStatus('done')
    } catch {
      setSubmitError(true)
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return (
      <div ref={ref} className="rounded-2xl border border-line bg-surface p-8 text-center reveal sm:p-12">
        <p className="font-display text-2xl text-paper text-balance">{t.doneTitle}</p>
        <p className="mx-auto mt-3 max-w-md text-bone">{t.doneBody}</p>
      </div>
    )
  }

  return (
    <div ref={ref} id={id} className="rounded-2xl border border-line bg-surface p-6 reveal sm:p-10">
      <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        <Field label={t.labels.naam} error={errors.naam ? t.errors.naam : undefined} htmlFor="naam">
          <input
            id="naam"
            autoComplete="name"
            className="input"
            value={values.naam}
            onChange={(e) => update('naam', e.target.value)}
          />
        </Field>
        <Field label={t.labels.bedrijf} error={errors.bedrijf} htmlFor="bedrijf">
          <input
            id="bedrijf"
            autoComplete="organization"
            className="input"
            value={values.bedrijf}
            onChange={(e) => update('bedrijf', e.target.value)}
          />
        </Field>
        <Field label={t.labels.email} error={errors.email ? t.errors.email : undefined} htmlFor="email">
          <input
            id="email"
            type="email"
            autoCapitalize="none"
            spellCheck={false}
            autoComplete="email"
            className="input"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </Field>
        <Field label={t.labels.telefoon} error={errors.telefoon ? t.errors.telefoon : undefined} htmlFor="telefoon">
          <input
            id="telefoon"
            type="tel"
            autoComplete="tel"
            className="input"
            value={values.telefoon}
            onChange={(e) => update('telefoon', e.target.value)}
          />
        </Field>
        <Field label={t.labels.website} error={errors.website} htmlFor="website">
          <input
            id="website"
            inputMode="url"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="https://"
            className="input"
            value={values.website}
            onChange={(e) => update('website', e.target.value)}
          />
        </Field>
        <fieldset className="goal-picker sm:col-span-2" aria-describedby={`${id}-goal-hint${errors.doel ? ` ${id}-goal-error` : ''}`} disabled={status === 'submitting'}>
          <legend>{t.labels.doel}</legend>
          <p id={`${id}-goal-hint`} className="goal-picker-hint">{lang === 'nl' ? 'Kies wat het best past. De details bekijken we samen.' : 'Choose the closest fit. We’ll work out the details together.'}</p>
          <div className="goal-options">
            {GOALS.map(goal => (
              <label key={goal.key} className={`goal-option ${goal.key === 'explore' ? 'goal-option-explore' : ''}`}>
                <input type="radio" name={`${id}-goal`} value={goal.key} checked={values.doel === goal.key} onChange={() => update('doel', goal.key)} className="sr-only" required aria-invalid={Boolean(errors.doel)} />
                <span className="goal-option-body"><span className="goal-option-dot" aria-hidden="true" /><span><strong>{goal[lang][0]}</strong><span className="goal-option-description">{goal[lang][1]}</span></span></span>
              </label>
            ))}
          </div>
          {errors.doel && <p id={`${id}-goal-error`} className="mt-2 text-sm text-accent-2" role="alert">{t.errors.doel}</p>}
        </fieldset>
        <Field label={t.labels.uitdaging} error={errors.uitdaging ? t.errors.uitdaging : undefined} htmlFor="uitdaging" full>
          <textarea
            id="uitdaging"
            rows={3}
            className="input resize-none"
            value={values.uitdaging}
            onChange={(e) => update('uitdaging', e.target.value)}
          />
        </Field>

        {!compact && !showOptional && (
          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => setShowOptional(true)}
              className="text-sm font-medium text-accent-2 hover:text-accent"
            >
              {t.addOptional}
            </button>
          </div>
        )}

        {!compact && showOptional && (
          <>
            <div className="sm:col-span-2 pt-2 text-xs uppercase tracking-widest text-mute">{t.optioneel}</div>
            <Field label={t.labels.investering} htmlFor="investering">
              <input
                id="investering"
                className="input"
                value={values.investering}
                onChange={(e) => update('investering', e.target.value)}
              />
            </Field>
            <Field label={t.labels.kanalen} htmlFor="kanalen">
              <input
                id="kanalen"
                className="input"
                value={values.kanalen}
                onChange={(e) => update('kanalen', e.target.value)}
              />
            </Field>
            <Field label={t.labels.timing} htmlFor="timing">
              <input
                id="timing"
                className="input"
                value={values.timing}
                onChange={(e) => update('timing', e.target.value)}
              />
            </Field>
            <Field label={t.labels.extra} htmlFor="extra">
              <input
                id="extra"
                className="input"
                value={values.extra}
                onChange={(e) => update('extra', e.target.value)}
              />
            </Field>
          </>
        )}

        {/* Honeypot: hidden from users, visible to bots. */}
        <div aria-hidden className="hidden">
          <label htmlFor="company_website">Company website</label>
          <input
            id="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            onChange={(e) => {
              honeypotRef.current = e.target.value
            }}
          />
        </div>

        <div className="sm:col-span-2 pt-2">
          <button type="submit" disabled={status === 'submitting'} className="button-dark">
            {status === 'submitting' ? t.submitting : <>{t.submit} <span aria-hidden="true">↗</span></>}
          </button>
          {submitError && <p className="mt-3 text-sm text-rose-400">{t.errorNote}</p>}
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  full,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  full?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={full ? 'sm:col-span-2' : undefined}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-bone">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-accent-2">{error}</p>}
    </div>
  )
}
