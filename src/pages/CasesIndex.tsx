import { Link } from 'react-router-dom'
import LyteWork from '../components/LyteWork'
import Seo from '../components/Seo'
import CaseVisual from '../components/CaseVisual'
import { cases } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    seoTitle: 'Cases',
    seoDescription:
      "Ecommerce, hospitality en consumer brands: cases van Pinacello, E-Kart en Nooms.",
    title: 'Werk dat ideeën verder brengt',
    body: 'Van groeicampagnes en ecommerce tot apps en platformen. Ontdek de ervaring achter verkoop.studio, met de oorspronkelijke uitvoerder bij elk project.',
    ongoing: 'Lopend project',
    view: 'Bekijk de case',
  },
  en: {
    seoTitle: 'Cases',
    seoDescription:
      "Ecommerce, hospitality and consumer brands: cases from Pinacello, E-Kart and Nooms.",
    title: 'Work that takes ideas further',
    body: 'From growth campaigns and ecommerce to apps and platforms. Explore the experience behind verkoop.studio, with the original team credited on each project.',
    ongoing: 'Ongoing project',
    view: 'View the case',
  },
}

export default function CasesIndex() {
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <div>
      <Seo title={t.seoTitle} description={t.seoDescription} path="/cases" />

      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <h1 className="font-display text-4xl text-paper text-balance sm:text-5xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone">{t.body}</p>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:grid-cols-2 sm:px-8 sm:py-20">
          {cases.map((c) => (
            <Link
              key={c.slug}
              to={`/cases/${c.slug}`}
              onClick={() => trackEvent('case_viewed', { case: c.slug, placement: 'cases_index' })}
              className="group rounded-2xl border border-line bg-surface p-6 transition hover:border-accent"
            >
              <CaseVisual case={c} lang={lang} ratio="aspect-[16/10]" />
              <div className="mt-5 flex items-center gap-3">
                <h2 className="font-display text-xl text-paper">{c.name}</h2>
                {c.status === 'ongoing' && <span className="text-xs italic text-accent-2">{t.ongoing}</span>}
              </div>
              <p className="mt-2 text-xs text-accent-2">Stef Keppens · Growth & strategy</p>
              <p className="mt-3 text-sm leading-relaxed text-bone">{c.summary[lang]}</p>
              <span className="mt-5 text-sm font-medium text-accent-2 underline decoration-transparent underline-offset-4 transition group-hover:decoration-accent-2">
                {t.view}
              </span>
            </Link>
          ))}
        </div>
      </section>
      <LyteWork />
    </div>
  )
}
