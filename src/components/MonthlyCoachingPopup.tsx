import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { canShowAcademyPopup, readAcademyPopupHistory, recordAcademyPopup } from '../lib/academy-popup'
import './MonthlyCoachingPopup.css'

const COPY = {
  nl: {
    kicker: 'Elke maand · 1 plek', title: '2 weken gratis begeleiding.',
    description: 'Ontvang onze marketingtips. Elke maand kiezen we één inschrijver voor twee weken gratis begeleiding.',
    email: 'Je e-mailadres', placeholder: 'jij@bedrijf.be',
    submit: 'Meld me aan', busy: 'Even opslaan…', close: 'Sluiten',
    note: 'Uitschrijven kan altijd. We mailen je als je geselecteerd bent.', privacy: 'Privacy',
    success: 'Je bent ingeschreven.', successText: 'Je ontvangt onze marketingtips en bent kandidaat voor de maandselectie. We mailen je als we jou kiezen.',
    consent: 'Ja, ik ontvang graag marketingtips en nieuws van Verkoop Studio per e-mail.',
    preferences: 'Je bent eerder uitgeschreven. Mail stef@verkoop.studio om je voorkeuren aan te passen.',
    error: 'Aanmelden lukt even niet. Probeer opnieuw.', limited: 'Probeer het over 10 minuten opnieuw.',
  },
  en: {
    kicker: 'Every month · 1 spot', title: '2 weeks of free guidance.',
    description: 'Get our marketing tips. Each month, we select one subscriber for two weeks of free guidance.',
    email: 'Your email address', placeholder: 'you@company.com',
    submit: 'Sign me up', busy: 'Saving…', close: 'Close',
    note: 'Unsubscribe anytime. We’ll email you if you’re selected.', privacy: 'Privacy',
    success: 'You’re subscribed.', successText: 'You’ll receive our marketing tips and enter the monthly selection. We’ll email you if we choose you.',
    consent: 'Yes, I would like to receive marketing tips and news from Verkoop Studio by email.',
    preferences: 'You previously unsubscribed. Email stef@verkoop.studio to update your preferences.',
    error: 'We couldn’t save your entry. Please try again.', limited: 'Please try again in 10 minutes.',
  },
}

export default function MonthlyCoachingPopup({ source, completed = false, suppressed = false, onVisibilityChange }: {
  source: 'agency' | 'academy'; completed?: boolean; suppressed?: boolean; onVisibilityChange?: (visible: boolean) => void
}) {
  const { lang } = useLang()
  const t = COPY[lang]
  const [stage, setStage] = useState<'form' | 'success' | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const panel = useRef<HTMLElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const submitting = useRef(false)
  const close = useCallback(() => {
    const restore = panel.current?.contains(document.activeElement)
    recordAcademyPopup()
    setStage(null)
    if (restore) previousFocus.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => { onVisibilityChange?.(stage !== null) }, [stage, onVisibilityChange])
  useEffect(() => () => { onVisibilityChange?.(false) }, [onVisibilityChange])
  useEffect(() => {
    if (completed || suppressed) { setStage(null); return }
    const startedAt = Date.now()
    let shown = false
    let interacting = false
    const visible = (selector: string) => [...document.querySelectorAll(selector)].some(el => {
      const box = el.getBoundingClientRect()
      return box.width > 0 && box.top < innerHeight && box.bottom > 0
    })
    const check = () => {
      if (shown || interacting) return
      const blocked = document.hidden || innerHeight < 440
        || !!document.activeElement?.closest('form, input, textarea, select, iframe')
        || visible('.mobile-navigation, .whatsapp-support-panel, .email-capture, #aanmelden, .ac-footer')
        || visible('.hero-video:has(.hero-video-sound[aria-pressed="true"])')
      if (!canShowAcademyPopup({ now: Date.now(), startedAt, scrollProgress: 0, history: readAcademyPopupHistory(), blocked })) return
      shown = true
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      recordAcademyPopup()
      setStage('form')
    }
    const input = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('form') || panel.current?.contains(event.target)) return
      interacting = true
      setStage(null)
    }
    const timer = setInterval(check, 1000)
    document.addEventListener('input', input)
    return () => { clearInterval(timer); document.removeEventListener('input', input) }
  }, [completed, suppressed])
  useEffect(() => {
    if (!stage) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [stage, close])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setPending(true); setError('')
    const data = new FormData(event.currentTarget)
    try {
      const response = await fetch('/api/coaching-entry', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ email: data.get('email'), company_website: data.get('company_website'), source, lang, consent: data.get('consent') === 'on', consent_version: 'website-newsletter-v1' }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) { setError(response.status === 409 ? t.preferences : response.status === 429 ? t.limited : t.error); return }
      recordAcademyPopup(true)
      if (panel.current) setStage('success')
      panel.current?.focus({ preventScroll: true })
    } catch { setError(t.error) }
    finally { submitting.current = false; setPending(false) }
  }

  if (!stage) return null
  return <aside className="coaching-popup" ref={panel} tabIndex={-1} role="dialog" aria-modal="false" aria-labelledby="coaching-popup-title" aria-describedby="coaching-popup-description">
    <button className="coaching-popup-close" type="button" onClick={close} aria-label={t.close}>×</button>
    <p className="coaching-popup-kicker">{t.kicker}</p>
    <h2 id="coaching-popup-title">{stage === 'success' ? t.success : t.title}</h2>
    <p id="coaching-popup-description" role={stage === 'success' ? 'status' : undefined}>{stage === 'success' ? t.successText : t.description}</p>
    {stage === 'form' && <form onSubmit={submit} aria-busy={pending} data-clarity-mask="true">
      <label htmlFor="coaching-email">{t.email}</label>
      <input id="coaching-email" name="email" type="email" autoComplete="email" required maxLength={200} placeholder={t.placeholder} disabled={pending} />
      <div className="coaching-popup-trap" aria-hidden="true"><label>Website<input name="company_website" tabIndex={-1} autoComplete="off" /></label></div>
      <label className="coaching-popup-consent"><input type="checkbox" name="consent" required disabled={pending} /><span>{t.consent}</span></label>
      {error && <p className="coaching-popup-error" role="alert">{error}</p>}
      <button className="coaching-popup-submit" disabled={pending}>{pending ? t.busy : t.submit} <span aria-hidden="true">↗</span></button>
      <p className="coaching-popup-note">{t.note} <Link to="/privacy">{t.privacy}</Link></p>
    </form>}
    {stage === 'success' && <button className="coaching-popup-later" onClick={close}>{t.close}</button>}
  </aside>
}
