import Seo from '../components/Seo'
import FunnelAuditOffer from '../components/FunnelAuditOffer'
import QualificationFormSection from '../components/QualificationFormSection'
import ProcessSection from '../components/ProcessSection'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    seoTitle: 'Groeianalyse',
    seoDescription:
      'Vraag een persoonlijke groeianalyse aan: een gerichte analyse van website, campagnes, ecommerce, tracking en opvolging.',
    title: 'Vraag een groeianalyse aan',
    body: 'Geen algemene template. We bekijken jullie huidige situatie, doelgroep en commerciële proces. Daarna zien we waar in de klantreis conversie verloren gaat.',
  },
  en: {
    seoTitle: 'Growth analysis',
    seoDescription:
      'Request a personal growth analysis: a focused analysis of website, campaigns, ecommerce, tracking and follow-up.',
    title: 'Request a growth analysis',
    body: 'No generic template. We look at your current situation, audience and commercial process. Then we see where conversion is lost in the journey.',
  },
}

export default function FunnelAudit() {
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <div>
      <Seo title={t.seoTitle} description={t.seoDescription} path="/funnel-audit" />

      <section className="border-b border-line">
        <div className="reveal mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <h1 className="font-display text-4xl text-paper text-balance sm:text-5xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone">{t.body}</p>
        </div>
      </section>

      <FunnelAuditOffer />
      <ProcessSection />
      <QualificationFormSection />
    </div>
  )
}
