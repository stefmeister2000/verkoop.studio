import { BrowserRouter, StaticRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Blog from './pages/Blog'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import ServicePage from './pages/ServicePage'
import CasesIndex from './pages/CasesIndex'
import CaseStudyPage from './pages/CaseStudyPage'
import FunnelAudit from './pages/FunnelAudit'
import OverStef from './pages/OverStef'
import Contact from './pages/Contact'
import PursuitOffer from './pages/PursuitOffer'

export default function App({ location }: { location?: string }) {
  const Router = location ? StaticRouter : BrowserRouter
  return (
    <Router location={location ?? "/"}>
      <Routes>
        <Route path="offerte/pursuit-femmes" element={<PursuitOffer />} />
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<Blog />} />

          <Route path="landing-pages" element={<ServicePage slug="landing-pages" />} />
          <Route path="funnels" element={<ServicePage slug="funnels" />} />
          <Route path="meta-ads" element={<ServicePage slug="meta-ads" />} />
          <Route path="google-ads" element={<ServicePage slug="google-ads" />} />
          <Route path="ecommerce-conversie" element={<ServicePage slug="ecommerce-conversie" />} />
          <Route path="ai-automatiseringen" element={<ServicePage slug="ai-automatiseringen" />} />
          <Route path="distributie" element={<ServicePage slug="distributie" />} />

          <Route path="cases" element={<CasesIndex />} />
          <Route path="cases/olearys" element={<CaseStudyPage slug="olearys" />} />
          <Route path="cases/pinacello" element={<CaseStudyPage slug="pinacello" />} />
          <Route path="cases/e-kart" element={<CaseStudyPage slug="e-kart" />} />
          <Route path="cases/nooms" element={<CaseStudyPage slug="nooms" />} />

          <Route path="funnel-audit" element={<FunnelAudit />} />
          <Route path="agency" element={<OverStef />} />
          <Route path="email-marketing" element={<ServicePage slug="email-marketing" />} />
          <Route path="data-analytics" element={<ServicePage slug="data-analytics" />} />
          <Route path="websites" element={<ServicePage slug="websites" />} />
          <Route path="software" element={<ServicePage slug="software" />} />
          <Route path="over-stef" element={<OverStef />} />
          <Route path="contact" element={<Contact />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
