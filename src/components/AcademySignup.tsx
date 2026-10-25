import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { captureAttribution, getGa4Context, trackAcademyConversion, trackEvent } from '../lib/analytics'

export type AcademyTrack = 'gratis' | 'begeleid'
export interface AcademyMember { naam: string; track: AcademyTrack }

const levels = [['start', 'Nog nooit geadverteerd'], ['basis', 'Al wat zelf geprobeerd'], ['actief', 'Draait al campagnes']] as const

interface AcademySignupProps {
  formId: string
  /** "compact" asks only name and email; "full" also asks track, phone and context. */
  variant?: 'compact' | 'full'
  track?: AcademyTrack
  onTrackChange?: (track: AcademyTrack) => void
  submitLabel?: string
  onSuccess: (member: AcademyMember) => void
}

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function AcademySignup({ formId, variant = 'compact', track = 'gratis', onTrackChange, submitLabel, onSuccess }: AcademySignupProps) {
  const full = variant === 'full'
  const [status, setStatus] = useState<'idle' | 'pending'>('idle')
  const [error, setError] = useState('')
  const [niveau, setNiveau] = useState('')
  const submissionId = useRef('')
  const started = useRef(false)
  const guided = full && track === 'begeleid'

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
    if (guided && !telefoon) return setError('Laat een telefoonnummer achter, zodat Stef je kan bereiken.')
    setStatus('pending')
    setError('')
    try {
      submissionId.current ||= crypto.randomUUID()
      const attribution = captureAttribution()
      const ga4 = await getGa4Context()
      const response = await fetch('/api/academy', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({
          naam, email, telefoon, bedrijf: data.get('bedrijf') ?? '', vraag: data.get('vraag') ?? '', niveau,
          track: full ? track : 'gratis', nieuwsbrief: data.get('nieuwsbrief') === 'on',
          form_id: formId, submission_id: submissionId.current, company_website: data.get('company_website'), attribution, ga4,
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) {
        setError(response.status === 400 ? 'Controleer je gegevens en probeer opnieuw.' : response.status === 429 ? 'Even te veel pogingen. Probeer het over enkele minuten opnieuw.' : 'Aanmelden lukte niet. Probeer opnieuw of mail stefkeppens@gmail.com.')
        setStatus('idle')
        return
      }
      trackEvent('form_submitted', { form_id: formId, track: full ? track : 'gratis', ...attribution })
      trackAcademyConversion(receipt, submissionId.current, formId, full ? track : 'gratis')
      onSuccess({ naam: naam.split(/\s+/)[0], track: full ? track : 'gratis' })
    } catch {
      setError('Aanmelden lukte niet. Probeer opnieuw of mail stefkeppens@gmail.com.')
      setStatus('idle')
    }
  }

  const label = submitLabel ?? (guided ? 'Vraag je leertraject aan' : 'Krijg gratis toegang')
  return <form className={`ac-signup ${full ? 'ac-signup-full' : 'ac-signup-compact'}`} onSubmit={submit} onInput={start} noValidate data-clarity-mask="true">
    {full && <fieldset className="ac-track-picker"><legend className="sr-only">Kies je traject</legend>
      {([['gratis', 'Gratis startleerpad', 'Zelf leren, op je eigen tempo', 'Gratis'], ['begeleid', 'Begeleid leertraject', 'Samen in je eigen account', 'Op maat']] as const).map(([value, name, text, price]) => <label key={value} className={track === value ? 'is-active' : ''}>
        <input type="radio" name="track" value={value} checked={track === value} onChange={() => onTrackChange?.(value)} />
        <span className="ac-track-radio" /><span><strong>{name}</strong><small>{text}</small></span><b>{price}</b>
      </label>)}
    </fieldset>}
    <div className="ac-signup-fields">
      <label className="ac-field"><span className={full ? '' : 'sr-only'}>Naam</span><input name="naam" autoComplete="name" required maxLength={200} placeholder={full ? '' : 'Je naam'} /></label>
      <label className="ac-field"><span className={full ? '' : 'sr-only'}>E-mailadres</span><input name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={200} placeholder={full ? '' : 'Je e-mailadres'} /></label>
      {full && <label className="ac-field"><span>Telefoon {guided ? '' : <em>optioneel</em>}</span><input name="telefoon" type="tel" autoComplete="tel" required={guided} maxLength={60} /></label>}
      {full && <label className="ac-field"><span>Bedrijf <em>optioneel</em></span><input name="bedrijf" autoComplete="organization" maxLength={200} /></label>}
    </div>
    {full && <fieldset className="ac-level-picker"><legend>Ervaring met Meta ads <em>optioneel</em></legend><div>{levels.map(([value, text]) => <button type="button" key={value} className={niveau === value ? 'is-active' : ''} aria-pressed={niveau === value} onClick={() => { start(); setNiveau(niveau === value ? '' : value) }}>{text}</button>)}</div></fieldset>}
    {full && <label className="ac-field ac-field-wide"><span>Waar wil je vooral beter in worden? <em>optioneel</em></span><textarea name="vraag" rows={3} maxLength={2000} placeholder="Bijvoorbeeld: mijn eerste campagne opzetten, creatives testen of mijn cijfers begrijpen." /></label>}
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    {full && <label className="ac-consent"><input type="checkbox" name="nieuwsbrief" /><span>Ja, ik ontvang graag marketingtips en nieuws van verkoop.studio per e-mail.</span></label>}
    <button type="submit" className="ac-button ac-signup-submit" disabled={status === 'pending'}>{status === 'pending' ? 'Even geduld…' : label}{status !== 'pending' && <Arrow />}</button>
    {error && <p className="ac-form-error" role="alert">{error}</p>}
  </form>
}
