import BrandMark from './BrandMark'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navItems, persistentCta, persistentCtaHref } from '../data/nav'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

export default function Nav() {
  const menuButton = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { lang, toggleLang } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location])

  useEffect(() => {
    if (!open) return
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const resize = () => { if (desktop.matches) setOpen(false) }
    window.addEventListener('keydown', close)
    desktop.addEventListener('change', resize)
    return () => { window.removeEventListener('keydown', close); desktop.removeEventListener('change', resize) }
  }, [open])

  function isActive(href: string) {
    if (href.startsWith('/#')) return false
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    )
  }

  return (
    <header
      className={`studio-nav sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? 'border-line bg-ink/90 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="studio-brand"
          aria-label="verkoop.studio — Home"
        >
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-sm transition hover:text-paper ${
                isActive(item.href) ? 'text-paper' : 'text-bone'
              }`}
            >
              {item.label[lang]}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LangSwitch lang={lang} onToggle={toggleLang} />
          <Link
            to={persistentCtaHref}
            onClick={() =>
              trackEvent('audit_cta_clicked', { placement: 'nav' })
            }
            className="button-dark nav-cta"
          >
            {persistentCta[lang]}
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LangSwitch lang={lang} onToggle={toggleLang} />
          <button
            ref={menuButton}
            aria-controls="mobile-navigation"
            aria-label={open ? (lang === 'nl' ? 'Menu sluiten' : 'Close menu') : (lang === 'nl' ? 'Menu openen' : 'Open menu')}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper"
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M1 1L17 17M17 1L1 17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            ) : (
              <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                <path
                  d="M0 1H18M0 7H18M0 13H18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="mobile-navigation border-t border-line bg-ink px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-1">
            <Link to="/#groeipakketten" onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-semibold text-paper">
              {lang === 'nl' ? 'Aanbod & prijzen' : 'Plans & pricing'}
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-lg px-3 py-3 text-base transition hover:bg-surface hover:text-paper ${
                  isActive(item.href) ? 'bg-surface text-paper' : 'text-bone'
                }`}
              >
                {item.label[lang]}
              </Link>
            ))}
          </nav>
          <Link
            to={persistentCtaHref}
            onClick={() =>
              trackEvent('audit_cta_clicked', { placement: 'nav_mobile' })
            }
            className="mt-4 block rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-accent-ink"
          >
            {persistentCta[lang]}
          </Link>
        </div>
      )}
    </header>
  )
}

function LangSwitch({
  lang,
  onToggle,
}: {
  lang: 'nl' | 'en'
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Switch language"
      className="flex h-11 items-center gap-1 rounded-full border border-line px-3 text-xs font-semibold text-bone transition hover:border-accent hover:text-paper lg:h-9"
    >
      <span className={lang === 'nl' ? 'text-paper' : ''}>NL</span>
      <span className="text-line">/</span>
      <span className={lang === 'en' ? 'text-paper' : ''}>EN</span>
    </button>
  )
}
