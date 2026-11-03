import { useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { captureAttribution, getGa4Context, trackAcademyConversion, trackEvent, trackLeadConversion } from '../lib/analytics'
import { recordAcademyPopup } from '../lib/academy-popup'
import './HeroRequestForm.css'

export default function HeroRequestForm({ kind, onSuccess }: { kind: 'plan' | 'lesson'; onSuccess?: (name: string) => void }) {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const lesson = kind === 'lesson'
  const formId = lesson ? 'academy-free-lesson' : 'home-free-plan'
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [error, setError] = useState('')
  const submissionId = useRef('')
  const pending = useRef(false)
  const started = useRef(false)
  const title = lesson ? (nl ? 'Vraag je gratis les aan.' : 'Request your free lesson.') : (nl ? 'Krijg je gratis groeiplan.' : 'Get your free growth plan.')
  const success = lesson ? (nl ? 'Stef neemt contact op om je gratis les in te plannen.' : 'Stef will contact you to schedule your free lesson.') : (nl ? 'We nemen contact op om jouw bedrijf te bespreken en je gratis groeiplan uit te werken.' : 'We’ll contact you to discuss your business and prepare your free growth plan.')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    const data = new FormData(event.currentTarget)
    const naam = String(data.get('naam') || '').trim()
    const email = String(data.get('email') || '').trim()
    const telefoon = String(data.get('telefoon') || '').trim()
    if (!naam || !telefoon || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(nl ? 'Vul je naam, een geldig e-mailadres en je telefoonnummer in.' : 'Enter your name, a valid email address and your phone number.'); return
    }
    pending.current = true; setStatus('pending'); setError('')
    try {
      submissionId.current ||= crypto.randomUUID()
      const attribution = captureAttribution()
      const ga4 = await getGa4Context()
      const response = await fetch(lesson ? '/api/academy' : '/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({ naam, email, telefoon, form_id: formId, submission_id: submissionId.current,
          company_website: data.get('company_website'), lang, attribution, ga4,
          ...(lesson ? { request_type: 'free_lesson' } : {
            doel: 'Gratis groeiplan', uitdaging: 'Aanvraag voor een gratis groeiplan; bedrijfsdoelen te bespreken tijdens de opvolging.',
          }),
        }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) throw new Error('capture_failed')
      trackEvent('form_submitted', { form_id: formId, ...attribution })
      if (lesson) trackAcademyConversion(receipt, submissionId.current, formId)
      else trackLeadConversion(receipt, submissionId.current, formId)
      recordAcademyPopup(true)
      setStatus('success'); onSuccess?.(naam.split(/\s+/)[0])
    } catch {
      setError(nl ? 'Versturen lukt even niet. Probeer opnieuw of mail stef@verkoop.studio.' : 'We couldn’t send your request. Try again or email stef@verkoop.studio.')
      setStatus('idle')
    } finally { pending.current = false }
  }
  return <section className="hero-request" aria-labelledby={`${formId}-title`}>
    <h2 id={`${formId}-title`}>{status === 'success' ? (nl ? 'Je aanvraag is binnen.' : 'Your request is in.') : title}</h2>
    {status === 'success' ? <p role="status">{success}</p> : <>
      <form onSubmit={submit} aria-busy={status === 'pending'} data-clarity-mask="true" onInput={() => {
        if (!started.current) { started.current = true; trackEvent('form_started', { form_id: formId }) }
      }}>
        <div className="hero-request-fields">
          <label className="hero-request-name"><span>{nl ? 'Naam' : 'Name'}</span><input name="naam" autoComplete="name" required maxLength={200} placeholder={nl ? 'Je naam' : 'Your name'} disabled={status === 'pending'} /></label>
          <label><span>{nl ? 'E-mailadres' : 'Email address'}</span><input name="email" type="email" autoComplete="email" autoCapitalize="none" required maxLength={200} placeholder={nl ? 'jij@bedrijf.be' : 'you@company.com'} disabled={status === 'pending'} /></label>
          <label><span>{nl ? 'Telefoonnummer' : 'Phone number'}</span><input name="telefoon" type="tel" autoComplete="tel" required maxLength={60} placeholder="+32 …" disabled={status === 'pending'} /></label>
        </div>
        <div className="hero-request-trap" aria-hidden="true"><label>Website<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
        {error && <p className="hero-request-error" role="alert">{error}</p>}
        <button className="hero-request-submit" type="submit" disabled={status === 'pending'}>{status === 'pending' ? (nl ? 'Even geduld…' : 'Sending…') : lesson ? (nl ? 'Vraag mijn gratis les aan' : 'Request my free lesson') : (nl ? 'Vraag mijn gratis plan aan' : 'Request my free plan')} <span aria-hidden="true">↗</span></button>
      </form>
      <p className="hero-request-note">{lesson ? (nl ? 'Stef contacteert je om je gratis les te plannen.' : 'Stef will contact you to schedule your free lesson.') : (nl ? 'We contacteren je om je gratis groeiplan uit te werken.' : 'We’ll contact you to prepare your free growth plan.')} <Link to="/privacy">{nl ? 'Privacybeleid' : 'Privacy policy'}</Link></p>
    </>}
  </section>
}
