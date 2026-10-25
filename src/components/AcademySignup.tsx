import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { captureAttribution, getGa4Context, trackAcademyConversion, trackEvent } from '../lib/analytics'

const levels = [['start', 'Nog niet gestart'], ['basis', 'Draait al campagnes'], ['actief', 'Wil opschalen']] as const
const budgets = [['klein', 'Tot €1.000 / maand'], ['middel', '€1.000 – €5.000 / maand'], ['groot', '€5.000 – €20.000 / maand'], ['schaal', 'Meer dan €20.000 / maand']] as const

interface AcademySignupProps {
  formId: string
  /** "compact" asks name, email and phone; "full" also asks company, webshop, experience, ad budget and a question. */
  variant?: 'compact' | 'full'
  submitLabel?: string
  onSuccess: (firstName: string) => void
}

function Choices({ legend, options, value, onChange }: { legend: string; options: readonly (readonly [string, string])[]; value: string; onChange: (value: string) => void }) {
  return <fieldset className="ac-level-picker"><legend>{legend} <em>optioneel</em></legend><div>{options.map(([key, text]) => <button type="button" key={key} className={value === key ? 'is-active' : ''} aria-pressed={value === key} onClick={() => onChange(value === key ? '' : key)}>{text}</button>)}</div></fieldset>
}

export default function AcademySignup({ formId, variant = 'compact', submitLabel = 'Meld je aan', onSuccess }: AcademySignupProps) {
  const full = variant === 'full'
  const [status, setStatus] = useState<'idle' | 'pending'>('idle')
  const [error, setError] = useState('')
  const [niveau, setNiveau] = useState('')
  const [budget, setBudget] = useState('')
  const submissionId = useRef('')
  const started = useRef(false)

  function start() {
    if (started.current) return
    started.current = true
    trackEvent('form_started', { form_id: formId })
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    const data = new FormData(event.currentTarget)
    const naam = String(data.get('naam') ?? '').trim()
    const email = String(data.get('email') ?? '').trim()
    const telefoon = String(data.get('telefoon') ?? '').trim()
    if (!naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Vul je naam en een geldig e-mailadres in.')
    if (!telefoon) return setError('Laat je telefoonnummer achter, zodat Stef je kan bereiken.')
    setStatus('pending')
    setError('')
    try {
      submissionId.current ||= crypto.randomUUID()
      const attribution = captureAttribution()
      const ga4 = await getGa4Context()
      const response = await fetch('/api/academy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({
          naam, email, telefoon, bedrijf: data.get('bedrijf') ?? '', website: data.get('website') ?? '', vraag: data.get('vraag') ?? '', niveau, budget,
          nieuwsbrief: data.get('nieuwsbrief') === 'on', form_id: formId, submission_id: submissionId.current,
          company_website: data.get('company_website'), attribution, ga4,
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) {
        setError(response.status === 400 ? 'Controleer je gegevens en probeer opnieuw.' : response.status === 429 ? 'Even te veel pogingen. Probeer het over enkele minuten opnieuw.' : 'Aanmelden lukte niet. Probeer opnieuw of mail stefkeppens@gmail.com.')
        setStatus('idle')
        return
      }
      trackEvent('form_submitted', { form_id: formId, ...attribution })
      trackAcademyConversion(receipt, submissionId.current, formId)
      onSuccess(naam.split(/\s+/)[0])
    } catch {
      setError('Aanmelden lukte niet. Probeer opnieuw of mail stefkeppens@gmail.com.')
      setStatus('idle')
    }
  }

  return <form className={`ac-signup ${full ? 'ac-signup-full' : 'ac-signup-compact'}`} onSubmit={submit} onInput={start} noValidate data-clarity-mask="true">
    <div className="ac-signup-fields">
      <label className={`ac-field ${full ? '' : 'ac-field-wide'}`}><span className={full ? '' : 'sr-only'}>Naam</span><input name="naam" autoComplete="name" required maxLength={200} placeholder={full ? '' : 'Je naam'} /></label>
      <label className="ac-field"><span className={full ? '' : 'sr-only'}>E-mailadres</span><input name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={200} placeholder={full ? '' : 'Je e-mailadres'} /></label>
      <label className="ac-field"><span className={full ? '' : 'sr-only'}>Telefoon</span><input name="telefoon" type="tel" autoComplete="tel" required maxLength={60} placeholder={full ? '' : 'Je telefoonnummer'} /></label>
      {full && <label className="ac-field"><span>Bedrijf <em>optioneel</em></span><input name="bedrijf" autoComplete="organization" maxLength={200} /></label>}
      {full && <label className="ac-field ac-field-wide"><span>Webshop <em>optioneel</em></span><input name="website" type="url" inputMode="url" autoCapitalize="none" spellCheck={false} maxLength={300} placeholder="https://" /></label>}
    </div>
    {full && <Choices legend="Waar sta je met Meta ads?" options={levels} value={niveau} onChange={value => { start(); setNiveau(value) }} />}
    {full && <Choices legend="Maandelijks advertentiebudget" options={budgets} value={budget} onChange={value => { start(); setBudget(value) }} />}
    {full && <label className="ac-field ac-field-wide"><span>Waar wil je vooral beter in worden? <em>optioneel</em></span><textarea name="vraag" rows={3} maxLength={2000} placeholder="Bijvoorbeeld: opschalen zonder dat mijn ROAS zakt, mijn tracking op orde krijgen of retargeting opzetten." /></label>}
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {full && <label className="ac-consent"><input type="checkbox" name="nieuwsbrief" /><span>Ja, ik ontvang graag marketingtips en nieuws van verkoop.studio per e-mail.</span></label>}
    <button type="submit" className="ac-button ac-signup-submit" disabled={status === 'pending'}>{status === 'pending' ? 'Even geduld…' : submitLabel}</button>
    {error && <p className="ac-form-error" role="alert">{error}</p>}
  </form>
}
