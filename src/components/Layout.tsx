import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import StickyMobileCTA from './StickyMobileCTA'
import BackToTop from './BackToTop'
import EmailCapture from './EmailCapture'
import MonthlyCoachingPopup from './MonthlyCoachingPopup'
import WhatsAppSupport from './WhatsAppSupport'
import { usePageMotion } from '../lib/usePageMotion'
import { usePrimaryButtonMotion } from '../lib/usePrimaryButtonMotion'
import { captureAttribution } from '../lib/analytics'

export default function Layout() {
  const location = useLocation()
  const [newsletterRequest, setNewsletterRequest] = useState(0)
  const motionRef = usePageMotion(location.pathname)
  usePrimaryButtonMotion()

  useEffect(() => {
    captureAttribution()
  }, [])

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      if (el) {
        const instant = window.matchMedia('(max-width: 1023px), (prefers-reduced-motion: reduce)').matches
        el.scrollIntoView({ behavior: instant ? 'instant' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [location.pathname, location.hash, location.key])

  return (
    <div ref={motionRef} className="site-shell min-h-screen pb-28 lg:pb-0">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer onNewsletterOpen={() => setNewsletterRequest(value => value + 1)} />
      <BackToTop />
      <WhatsAppSupport />
      <StickyMobileCTA />
      <EmailCapture openRequest={newsletterRequest} automatic={location.pathname !== '/'} />
      {location.pathname === '/' && <MonthlyCoachingPopup source="agency" suppressed={newsletterRequest > 0} />}
    </div>
  )
}
