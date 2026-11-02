import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import './WhatsAppSupport.css'

export default function WhatsAppSupport() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const label = lang === 'nl' ? 'Chat via WhatsApp' : 'Chat on WhatsApp'
  const message = lang === 'nl'
    ? 'Hallo Verkoop Studio, ik heb een vraag.'
    : 'Hi Verkoop Studio, I have a question.'

  useEffect(() => {
    if (!open) return
    const dismiss = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', dismiss)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', dismiss)
      document.removeEventListener('keydown', escape)
    }
  }, [open])

  return (
    <div className="whatsapp-support" ref={container}>
      <button
        className="whatsapp-support-trigger"
        ref={trigger}
        type="button"
        aria-label={lang === 'nl' ? 'WhatsApp en contactopties' : 'WhatsApp and contact options'}
        aria-expanded={open}
        aria-controls="whatsapp-support-panel"
        onClick={() => setOpen(value => !value)}
      >
        <img src="/platforms/whatsapp.svg" alt="" width="28" height="28" />
      </button>
      <section id="whatsapp-support-panel" className="whatsapp-support-panel" hidden={!open} aria-label="Contact">
        <button className="whatsapp-support-close" type="button" aria-label={lang === 'nl' ? 'Sluiten' : 'Close'} onClick={() => { setOpen(false); trigger.current?.focus() }}>×</button>
        <h2>{lang === 'nl' ? 'Hoe kunnen we je helpen?' : 'How can we help?'}</h2>
        <a
          className="whatsapp-support-chat"
          href={`https://wa.me/32478731138?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_clicked', { placement: 'floating_support' })}
        >{label} <span aria-hidden="true">↗</span></a>
        <p>{lang === 'nl' ? 'Meer ondersteuning nodig? Bel of mail ons gerust.' : 'Need more support? Feel free to call or email us.'}</p>
        <a className="whatsapp-support-contact" href="tel:+32478731138">+32 478 73 11 38</a>
        <a className="whatsapp-support-contact" href="mailto:stef@verkoop.studio">stef@verkoop.studio</a>
      </section>
    </div>
  )
}
import { useEffect, useRef, useState } from 'react'
