import { useLayoutEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { persistentCta, persistentCtaHref } from '../data/nav'
import { services } from '../data/services'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

/** Opening and closing actions. The bar stays hidden while one of these is already on screen. */
const PRIMARY_ACTION = [
  '.studio-hero .hero-actions .button-dark',
  '.service-hero .button-dark',
  '.closing-cta .hero-actions .button-dark',
  '.pina-case-cta .button-dark',
].join(', ')

export default function StickyMobileCTA() {
  const { lang } = useLang()
  const { pathname } = useLocation()
  const [suppressed, setSuppressed] = useState(false)
  const onService = services.some((service) => pathname === `/${service.slug}`)

  useLayoutEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    let frame = 0
    const update = () => {
      if (desktop.matches) {
        setSuppressed(false)
        return
      }
      const visible = [...document.querySelectorAll<HTMLElement>(PRIMARY_ACTION)].some((el) => {
        const box = el.getBoundingClientRect()
        return box.width > 0 && box.bottom > 72 && box.top < window.innerHeight - 88
      })
      setSuppressed((current) => (current === visible ? current : visible))
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    desktop.addEventListener('change', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      desktop.removeEventListener('change', onScroll)
    }
  }, [pathname])

  if (pathname === '/contact' || pathname === '/funnel-audit') return null

  return (
    <div className={`mobile-contact-bar pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ink/95 p-3 backdrop-blur lg:hidden${suppressed ? ' is-suppressed' : ''}`}>
      <Link
        to={onService ? `${pathname}#audit-formulier-section` : persistentCtaHref}
        onClick={() => trackEvent('audit_cta_clicked', { placement: 'sticky_mobile' })}
        className="block rounded-full bg-accent px-5 py-3.5 text-center text-[15px] font-semibold text-accent-ink"
      >
        {persistentCta[lang]}
      </Link>
    </div>
  )
}
