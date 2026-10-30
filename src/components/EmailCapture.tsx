import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { trackNewsletterConversion } from '../lib/analytics'
import './EmailCapture.css'

const STORAGE_KEY = 'verkoop_newsletter_until'
const COPY = {
  nl: {
    eyebrow: 'Een frisse blik in je inbox', title: 'Kleine tips. Meer groei.',
    description: 'Praktische ideeën over marketing, websites en automatisering. Rechtstreeks van onze studio.',
    email: 'Je e-mailadres', placeholder: 'jij@bedrijf.be',
    consent: 'Ja, ik ontvang graag marketingtips en nieuws van verkoop.studio per e-mail.',
    action: 'Hou me op de hoogte', busy: 'Even opslaan…', close: 'Sluiten',
    teaser: 'Tips in je inbox',
    note: 'Uitschrijven kan altijd.',
    privacy: 'Je e-mailadres en toestemming worden via Resend bewaard voor deze nieuwsbrief. Inzage of verwijdering aanvragen:',
    privacyLabel: 'Privacy',
    success: 'Je staat op de lijst.', successText: 'Bedankt! Je ontvangt voortaan onze tips en nieuws in je inbox.',
    error: 'Opslaan lukt even niet. Probeer het opnieuw.',
    limited: 'Te veel pogingen. Probeer het over 10 minuten opnieuw.',
    preferences: 'Dit adres is eerder uitgeschreven. Mail ons om je voorkeuren aan te passen.',
  },
  en: {
    eyebrow: 'A fresh perspective in your inbox', title: 'Small tips. More growth.',
    description: 'Practical ideas on marketing, websites and automation. Straight from our studio.',
    email: 'Your email address', placeholder: 'you@company.com',
    consent: 'Yes, I would like to receive marketing tips and news from verkoop.studio by email.',
    action: 'Keep me posted', busy: 'Saving…', close: 'Close',
    teaser: 'Tips in your inbox',
    note: 'Unsubscribe at any time.',
    privacy: 'Your email and consent are stored through Resend for this newsletter. To request access or deletion:',
    privacyLabel: 'Privacy',
    success: "You're on the list.", successText: "Thank you! You'll receive our tips and news in your inbox.",
    error: "We couldn't save your subscription. Please try again.",
    limited: 'Too many attempts. Please try again in 10 minutes.',
    preferences: 'This address was previously unsubscribed. Email us to update your preferences.',
  },
}

function remember(days: number) {
  try { localStorage.setItem(STORAGE_KEY, String(Date.now() + days * 86_400_000)) } catch { /* Optional storage. */ }
}

export default function EmailCapture({ openRequest = 0 }: { openRequest?: number }) {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const t = COPY[lang]
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [manuallyOpened, setManuallyOpened] = useState(false)
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [error, setError] = useState('')
  const dismissed = useRef(false)
  const pending = useRef(false)
  const submissionId = useRef('')
  const panel = useRef<HTMLElement>(null)
  const excluded = pathname === '/contact' || pathname === '/funnel-audit'

  useEffect(() => {
    if (!openRequest) return
    dismissed.current = true
    setManuallyOpened(true)
    setExpanded(true)
    setVisible(true)
    const frame = requestAnimationFrame(() => panel.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [openRequest])

  useEffect(() => {
    if (excluded || dismissed.current) return
    try { if (Number(localStorage.getItem(STORAGE_KEY)) > Date.now()) return } catch { /* Optional storage. */ }
    let timer: ReturnType<typeof setTimeout>
    function showWhenIdle() {
      if (dismissed.current) return
      if (document.hidden || document.activeElement?.closest('form, input, textarea, select') ||
          document.querySelector('.has-open-chat, .mobile-navigation')) {
        timer = setTimeout(showWhenIdle, 3000)
        return
      }
      setVisible(true)
    }
    timer = setTimeout(showWhenIdle, 12_000)
    return () => clearTimeout(timer)
  }, [excluded])

  function close() {
    dismissed.current = true
    remember(status === 'success' ? 365 : 30)
    setVisible(false)
    setManuallyOpened(false)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    pending.current = true
    setStatus('pending')
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      submissionId.current ||= crypto.randomUUID()
      const response = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({
          email: data.get('email'), company_website: data.get('company_website'),
          consent: data.get('consent') === 'on', consent_version: 'website-newsletter-v1', lang,
        }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) {
        setError(result.error === 'subscription_preferences' ? t.preferences : response.status === 429 ? t.limited : t.error)
        setStatus('idle')
        return
      }
      trackNewsletterConversion(result, submissionId.current)
      setStatus('success')
      remember(365)
      dismissed.current = true
      panel.current?.focus()
    } catch {
      setError(t.error)
      setStatus('idle')
    } finally { pending.current = false }
  }

  if (!visible || (excluded && !manuallyOpened)) return null
  return (
    <aside ref={panel} className={`email-capture${expanded ? ' is-expanded' : ''}`} aria-label={t.title} tabIndex={-1} data-clarity-mask="true"
      onKeyDown={event => { if (event.key === 'Escape') close() }}>
      <button className="email-capture-teaser" type="button" aria-expanded={expanded} aria-controls="email-capture-content"
        onClick={() => { setExpanded(true); requestAnimationFrame(() => panel.current?.focus()) }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        {t.teaser}<span aria-hidden="true">↗</span>
      </button>
      <button className="email-capture-close" type="button" aria-label={t.close} onClick={close}>×</button>
      <div className="email-capture-content" id="email-capture-content">
      <div className="email-capture-mark" aria-hidden="true">{status === 'success' ? '✓' : '↗'}</div>
      <p className="email-capture-eyebrow">{t.eyebrow}</p>
      <h2 id="email-capture-title">{status === 'success' ? t.success : t.title}</h2>
      <p className="email-capture-description" role={status === 'success' ? 'status' : undefined}>
        {status === 'success' ? t.successText : t.description}
      </p>
      {status !== 'success' && <form onSubmit={submit} aria-busy={status === 'pending'}>
        <label className="sr-only" htmlFor="newsletter-email">{t.email}</label>
        <input id="newsletter-email" name="email" type="email" autoComplete="email" placeholder={t.placeholder}
          required maxLength={254} disabled={status === 'pending'} />
        <div className="email-capture-trap" aria-hidden="true">
          <label>Website<input name="company_website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <label className="email-capture-consent">
          <input name="consent" type="checkbox" required disabled={status === 'pending'} />
          <span>{t.consent}</span>
        </label>
        {error && <p className="email-capture-error" role="alert">{error} {error === t.preferences &&
          <a href="mailto:stef@verkoop.studio">stef@verkoop.studio</a>}</p>}
        <button className="email-capture-submit" type="submit" disabled={status === 'pending'}>
          {status === 'pending' ? t.busy : t.action}<span aria-hidden="true">↗</span>
        </button>
        <div className="email-capture-footnote">
          <span>{t.note}</span>
          <details><summary>{t.privacyLabel}</summary><p>{t.privacy} <a href="mailto:stef@verkoop.studio">stef@verkoop.studio</a>.</p></details>
        </div>
      </form>}
      </div>
    </aside>
  )
}
