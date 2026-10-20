import CaseEvidence from '../components/CaseEvidence'
import PinacelloCase from './PinacelloCase'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import CaseVisual from '../components/CaseVisual'
import CheckList from '../components/CheckList'
import Breadcrumbs from '../components/Breadcrumbs'
import { getCase } from '../data/cases'
import type { CaseSlug } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import { persistentCta, persistentCtaHref } from '../data/nav'

const COPY = {
  nl: {
    casesCrumb: 'Cases',
    ongoing: 'Lopend project',
    caseLabel: 'Case',
    situation: 'Situatie',
    challenge: 'Commerciële uitdaging',
    role: 'Bijdrage van Stef Keppens',
    built: 'Wat er gebouwd werd',
    measurement: 'Hoe succes gemeten wordt',
    ongoingNote: 'Dit project loopt nog. Cijfers volgen zodra ze beschikbaar zijn.',
    visitSite: 'Bezoek de website',
    closingTitle: 'Herkenbaar? Laten we jullie klantreis bekijken',
  },
  en: {
    casesCrumb: 'Cases',
    ongoing: 'Ongoing project',
    caseLabel: 'Case',
    situation: 'Situation',
    challenge: 'Commercial challenge',
    role: 'Stef Keppens’ contribution',
    built: 'What was built',
    measurement: 'How success is measured',
    ongoingNote: 'This project is still ongoing. Numbers will follow once they are available.',
    visitSite: 'Visit the website',
    closingTitle: 'Sound familiar? Let’s look at your customer journey',
  },
}

export default function CaseStudyPage({ slug }: { slug: CaseSlug }) {
  const c = getCase(slug)
  const { lang } = useLang()
  const t = COPY[lang]
  const { ref } = useInView<HTMLDivElement>(() => trackEvent('case_viewed', { case: slug, placement: 'page' }))

  if (!c) return null
  if (slug === 'pinacello') return <div ref={ref}><PinacelloCase project={c} /></div>

  return (
    <div ref={ref}>
      <Seo title={`${t.caseLabel}: ${c.name}`} description={c.summary[lang]} path={`/cases/${c.slug}`} />

      <section className="page-hero border-b border-line">
        <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="case-hero-top">
            <div>
              <Breadcrumbs items={[{ label: t.casesCrumb, href: '/cases' }, { label: c.name }]} />

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <h1 className="font-display text-balance">{c.name}</h1>
                {c.status === 'ongoing' && <span className="text-sm italic text-accent-2">{t.ongoing}</span>}
              </div>
              <p className="mt-6 max-w-2xl text-lg text-bone">{c.summary[lang]}</p>

              {c.liveUrl && (
                <a
                  href={c.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm font-medium text-accent-2 hover:text-accent"
                >
                  {t.visitSite} ↗
                </a>
              )}
            </div>
            <aside className="case-proof" aria-label={t.measurement}>
              <p>{c.measurement[lang]}</p>
            </aside>
          </div>

          {c.video ? (
            <figure className="mt-10">
              <CaseVisual case={c} lang={lang} video />
              {c.videoCaption && (
                <figcaption className="mt-4 max-w-2xl font-display text-lg text-paper text-balance">
                  {c.videoCaption[lang]}
                </figcaption>
              )}
            </figure>
          ) : (
            <CaseVisual case={c} lang={lang} ratio="aspect-[16/9]" className="mt-10" />
          )}
        </div>
      </section>

      <section className="page-section">
        <div className="page-panel grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="section-title">{t.situation}</h2>
            <p className="mt-4">{c.situation[lang]}</p>
          </div>
          <div>
            <h2 className="section-title">{t.challenge}</h2>
            <p className="mt-4">{c.challenge[lang]}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="section-title">{t.role}</h2>
          <p className="mt-4 max-w-2xl text-bone">{c.role[lang]}</p>
        </div>
      </section>

      <section className="border-b border-line bg-surface/30">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="section-title">{c.builtLabel?.[lang] ?? t.built}</h2>
          <CheckList items={c.built[lang]} className="mt-5" />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <h2 className="section-title">{t.measurement}</h2>
          <p className="mt-4 max-w-2xl font-display text-2xl text-paper text-balance">{c.measurement[lang]}</p>
          {c.status === 'ongoing' && c.slug !== 'pinacello' && <p className="mt-4 text-sm text-mute">{t.ongoingNote}</p>}
        </div>
      </section>

      <CaseEvidence project={c} />
      <section className="closing-cta">
        <div className="closing-cta-inner">
          <h2 className="font-display text-balance">{t.closingTitle}</h2>
          <div className="hero-actions">
            <Link
              to={persistentCtaHref}
              onClick={() => trackEvent('audit_cta_clicked', { placement: `case_${c.slug}` })}
              className="button-dark"
            >
              {persistentCta[lang]}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
