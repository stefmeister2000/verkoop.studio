import BrandMark from './BrandMark'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navItems, persistentCta, persistentCtaHref } from '../data/nav'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

const HOME_SECTIONS = ['resultaten', 'expertise'] as const
type HomeSection = '' | (typeof HOME_SECTIONS)[number]
/** Section top has reached the sticky bar. Matches the hash scroll-margin. */
const SECTION_LINE = 120

function sectionInView(): HomeSection {
  let current: HomeSection = ''
  for (const id of HOME_SECTIONS) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= SECTION_LINE) current = id
  }
  return current
}

export default function Nav() {
  const menuButton = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const lockRef = useRef<HomeSection | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [section, setSection] = useState<HomeSection>('')
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null)
  const location = useLocation()
  const { lang } = useLang()

  useEffect(() => {
    const home = location.pathname === '/'
    const hash = location.hash.replace(/^#/, '')
    const tracked = HOME_SECTIONS.find((id) => id === hash) ?? ''
    lockRef.current = home && tracked ? tracked : null

    let frame = 0
    const update = () => {
      setScrolled(window.scrollY > 8)
      if (!home) {
        setSection('')
        return
      }
      const lock = lockRef.current
      if (lock) {
        const el = document.getElementById(lock)
        if (el && el.getBoundingClientRect().top > SECTION_LINE) {
          setSection(lock)
          return
        }
        lockRef.current = null
      }
      const next = sectionInView()
      setSection((prev) => (prev === next ? prev : next))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.pathname, location.hash, location.key])

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

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const place = () => {
      const current = nav.querySelector<HTMLElement>('a[aria-current="page"]')
      if (!current) {
        setIndicator(null)
        return
      }
      const navBox = nav.getBoundingClientRect()
      const box = current.getBoundingClientRect()
      if (navBox.width === 0 || box.width === 0) return
      const next = {
        x: Math.round(box.left - navBox.left),
        w: Math.round(box.width),
      }
      setIndicator((prev) => (prev && prev.x === next.x && prev.w === next.w ? prev : next))
    }
    place()
    const observer = new ResizeObserver(place)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [section, location.pathname, location.hash, lang, scrolled])

  function isActive(href: string) {
    if (href === '/') return location.pathname === '/' && section === ''
    if (href.startsWith('/#')) {
      return location.pathname === '/' && section === href.slice(2)
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  return (
    <header
      className={`studio-nav sticky top-0 z-50 border-b${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          to="/"
          className="studio-brand"
          aria-label="verkoop.studio, home"
        >
          <BrandMark />
        </Link>

        <nav
          ref={navRef}
          className={`hidden items-center gap-8 lg:flex${indicator ? ' is-measured' : ''}`}
        >
          {indicator && (
            <span
              className="nav-indicator"
              style={{ transform: `translateX(${indicator.x}px)`, width: indicator.w }}
              aria-hidden="true"
            />
          )}
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`text-sm transition hover:text-paper ${
                isActive(item.href) ? 'text-paper' : 'text-bone'
              }`}
            >
              <span data-label={item.label[lang]}>{item.label[lang]}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
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

        <button
          ref={menuButton}
          aria-controls="mobile-navigation"
          aria-label={open ? (lang === 'nl' ? 'Menu sluiten' : 'Close menu') : (lang === 'nl' ? 'Menu openen' : 'Open menu')}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper lg:hidden"
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
