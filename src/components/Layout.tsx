import FaqChat from './FaqChat'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import StickyMobileCTA from './StickyMobileCTA'
import BackToTop from './BackToTop'
import { usePageMotion } from '../lib/usePageMotion'
import { captureAttribution } from '../lib/analytics'

export default function Layout() {
  const location = useLocation()
  const motionRef = usePageMotion(location.pathname)

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
      <Footer />
      <BackToTop />
      <FaqChat />
      <StickyMobileCTA />
    </div>
  )
}
