import { Link } from 'react-router-dom'
import { useInView } from '../lib/useInView'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import { persistentCta } from '../data/nav'

const COPY = {
  nl: {
    title: 'Waar verliest jullie huidige digitale klantreis conversie?',
    body: 'Geen algemene template. We bekijken jullie huidige situatie, doelgroep en commerciële proces.',
    scopeLabel: 'De analyse bekijkt',
    scope: [
      'Website structuur',
      'Campagne-landingspagina’s',
      'Meta Ads',
      'Google Ads',
      'Ecommerce-klantreis',
      'Checkout-flow',
      'Leadflow',
      'Boekingsflow',
      'E-mailopvolging',
      'Tracking',
      'Kansen voor AI-automatisering',
    ],
    deliverablesLabel: 'Mogelijke opleverpunten',
    deliverables: [
      'Belangrijkste conversieproblemen',
      'Screenshots en observaties',
      'Geprioriteerde aanbevelingen',
      'Voorgestelde nieuwe funnel',
      'Voorgestelde landingspagina’s',
      'Trackinghiaten',
      'Automatiseringskansen',
      'Aanbevolen vervolgstappen',
    ],
    packagesNote: 'De opstart die hieruit volgt zit altijd inbegrepen in een groeipakket.',
    packagesLink: 'Bekijk de groeipakketten',
  },
  en: {
    title: 'Where is your current digital customer journey losing conversion?',
    body: 'No generic template. We look at your current situation, audience and commercial process.',
    scopeLabel: 'The analysis reviews',
    scope: [
      'Website structure',
      'Campaign landing pages',
      'Meta Ads',
      'Google Ads',
      'Ecommerce journey',
      'Checkout flow',
      'Lead flow',
      'Booking flow',
      'Email follow-up',
      'Tracking',
      'Opportunities for AI automation',
    ],
    deliverablesLabel: 'Possible deliverables',
    deliverables: [
      'Key conversion problems',
      'Screenshots and observations',
      'Prioritised recommendations',
      'Proposed new funnel',
      'Suggested landing pages',
      'Tracking gaps',
      'Automation opportunities',
      'Recommended next steps',
    ],
    packagesNote: 'The setup that follows from this is always included in a growth package.',
    packagesLink: 'See the growth packages',
  },
}

export default function FunnelAuditOffer() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section id="funnel-audit-offer" className="border-b border-line bg-surface/30">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="max-w-2xl font-display text-3xl text-paper text-balance sm:text-4xl">{t.title}</h2>
        <p className="mt-5 max-w-2xl text-bone">{t.body}</p>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="section-title">{t.scopeLabel}</h3>
            <p className="mt-3 text-sm leading-relaxed text-bone">{t.scope.join(' · ')}</p>
          </div>
          <div>
            <h3 className="section-title">{t.deliverablesLabel}</h3>
            <p className="mt-3 text-sm leading-relaxed text-bone">{t.deliverables.join(' · ')}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 rounded-2xl border border-line bg-surface/50 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="text-sm text-bone">{t.packagesNote}</p>
          <Link
            to="/#groeipakketten"
            className="shrink-0 text-sm font-medium text-accent-2 hover:text-accent"
          >
            {t.packagesLink}
          </Link>
        </div>

        <div className="mt-8">
          <a
            href="#audit-formulier"
            onClick={() => trackEvent('audit_cta_clicked', { placement: 'audit_offer' })}
            className="inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-2"
          >
            {persistentCta[lang]}
          </a>
        </div>
      </div>
    </section>
  )
}
