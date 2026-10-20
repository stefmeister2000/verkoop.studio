import { Link } from 'react-router-dom'
import { cases } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import CaseVisual from './CaseVisual'

const COPY = {
  nl: {
    title: 'Groei begint bij het werk.',
    all: 'Alle cases',
    ongoing: 'Lopend project',
    view: 'Bekijk de case',
  },
  en: {
    title: 'Growth starts with the work.',
    all: 'All cases',
    ongoing: 'Ongoing project',
    view: 'View the case',
  },
}

export default function CaseStudyGrid() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section id="cases" className="border-b border-line">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-2xl font-display text-3xl text-paper text-balance sm:text-4xl">{t.title}</h2>
          <Link to="/cases" className="text-sm font-medium text-accent-2 hover:text-accent">
            {t.all}
          </Link>
        </div>

        <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0">
          {cases.slice(0, 4).map((c) => (
            <Link
              key={c.slug}
              to={`/cases/${c.slug}`}
              onClick={() => trackEvent('case_viewed', { case: c.slug, placement: 'grid' })}
              className="group w-[82%] shrink-0 snap-center rounded-2xl border border-line bg-surface p-6 transition hover:border-accent sm:w-auto sm:shrink"
            >
              <CaseVisual case={c} lang={lang} ratio="aspect-[16/10]" />
              <div className="mt-5 flex items-center gap-3">
                <h3 className="font-display text-xl text-paper">{c.name}</h3>
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
      </div>
    </section>
  )
}
