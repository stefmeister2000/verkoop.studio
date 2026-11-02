import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import './WhatsAppSupport.css'

export default function WhatsAppSupport() {
  const { lang } = useLang()
  const label = lang === 'nl' ? 'Chat via WhatsApp' : 'Chat on WhatsApp'
  const message = lang === 'nl'
    ? 'Hallo Verkoop Studio, ik heb een vraag.'
    : 'Hi Verkoop Studio, I have a question.'

  return (
    <a
      className="whatsapp-support"
      href={`https://wa.me/32478731138?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      onClick={() => trackEvent('whatsapp_clicked', { placement: 'floating_support' })}
    >
      <img src="/platforms/whatsapp.svg" alt="" width="28" height="28" />
    </a>
  )
}
