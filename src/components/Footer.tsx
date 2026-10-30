import BrandMark from './BrandMark'
import { Link } from 'react-router-dom'
import { navItems, persistentCta, persistentCtaHref } from '../data/nav'
import { services } from '../data/services'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    tagline: 'We bouwen de complete digitale route van eerste klik tot conversie.',
    nav: 'Navigatie',
    services: 'Diensten',
    contact: 'Contact',
    disclaimer: 'Growth, design & development.',
  },
  en: {
    tagline: 'We build the complete digital route from first click to conversion.',
    nav: 'Navigation',
    services: 'Services',
    contact: 'Contact',
    disclaimer: 'Growth, design & development.',
  },
}

export default function Footer({ onNewsletterOpen }: { onNewsletterOpen: () => void }) {
  const { lang, toggleLang } = useLang()
  const t = COPY[lang]

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="studio-brand" aria-label="verkoop.studio, home"><BrandMark /></Link>
            <p className="mt-3 max-w-xs text-sm text-mute">{t.tagline}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-paper">{t.nav}</p>
            <ul className="mt-3 space-y-2 footer-link-grid">
              <li><Link to="/blog" className="text-sm text-mute transition hover:text-paper">Blog · Gent & omgeving</Link></li>
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link to={item.href} className="text-sm text-mute transition hover:text-paper">
                    {item.label[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-paper">{t.services}</p>
            <ul className="mt-3 space-y-2 footer-link-grid">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link to={`/${service.slug}`} className="text-sm text-mute transition hover:text-paper">
                    {service.title[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-paper">{t.contact}</p>
            <ul className="mt-3 space-y-2 text-sm text-mute">
              <li>
                <a href="mailto:stef@verkoop.studio" className="transition hover:text-paper">
                  stef@verkoop.studio
                </a>
              </li>
              <li>
                <Link to={persistentCtaHref} className="transition hover:text-paper">
                  {persistentCta[lang]}
                </Link>
              </li>
              <li>
                <button type="button" onClick={onNewsletterOpen} className="min-h-11 cursor-pointer text-left transition hover:text-paper">
                  {lang === 'nl' ? 'Nieuwsbrief openen ↗' : 'Open newsletter signup ↗'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} verkoop.studio</p>
          <button type="button" className="lang-switch" onClick={toggleLang} aria-label="Switch language">
            <span className={lang === 'nl' ? 'is-active' : undefined}>NL</span>
            <span aria-hidden="true">/</span>
            <span className={lang === 'en' ? 'is-active' : undefined}>EN</span>
          </button>
          <p>{t.disclaimer}</p>
        </div>
      </div>
    </footer>
  )
}
