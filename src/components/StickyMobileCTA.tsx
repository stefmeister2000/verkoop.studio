import { Link, useLocation } from 'react-router-dom'
import { persistentCta, persistentCtaHref } from '../data/nav'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

export default function StickyMobileCTA() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  if (pathname === '/contact' || pathname === '/funnel-audit') return null

  return (
    <div className={`mobile-contact-bar${pathname === '/' ? ' mobile-contact-bar-with-offer' : ''} pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-3 backdrop-blur lg:hidden`}>
      {pathname === '/' && <Link to="/#groeipakketten" className="mobile-offer-link">{lang === 'nl' ? 'Aanbod & prijzen' : 'Plans & pricing'}</Link>}
      <Link
        to={persistentCtaHref}
        onClick={() => trackEvent('audit_cta_clicked', { placement: 'sticky_mobile' })}
        className="block rounded-full bg-accent px-5 py-3.5 text-center text-sm font-semibold text-accent-ink"
      >
        {persistentCta[lang]}
      </Link>
    </div>
  )
}
