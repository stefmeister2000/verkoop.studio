import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import GiveawayEntryForm from '../components/GiveawayEntryForm'
import ResponsiveImage from '../components/ResponsiveImage'
import CaseVisual from '../components/CaseVisual'
import { giveaway } from '../data/giveaway'
import { getCase } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import pinacello from '../assets/cases/pinacello.webp'
import studioTeam from '../assets/studio-team.webp'
import studioTeamSmall from '../assets/studio-team-640.webp'
import stefDesk from '../assets/stef-desk.webp'
import stefDeskSmall from '../assets/stef-desk-640.webp'

export default function GratisWebsite() {
  const { lang } = useLang()
  const g = giveaway
  const proofCases = g.proof.cases.map(slug => getCase(slug)).filter(Boolean)

  return (
    <div>
      <Seo title={g.seo.title[lang]} description={g.seo.description[lang]} path={g.path} />

      <section className="border-b border-line">
        <div className="reveal mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent-2">{g.hero.eyebrow[lang]}</p>
            <h1 className="mt-4 font-display text-4xl text-paper text-balance sm:text-5xl">{g.hero.title[lang]}</h1>
            <p className="mt-5 text-lg text-bone">{g.hero.lead[lang]}</p>
            <p className="mt-6 text-sm font-medium text-paper">{g.hero.deadline[lang]}</p>
            <p className="mt-8">
              <a href={`#${g.formId}`} className="button-dark"
                onClick={() => trackEvent('audit_cta_clicked', { placement: 'giveaway_hero' })}>
                {g.hero.cta[lang]} <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
          <figure className="m-0">
            <ResponsiveImage
              src={pinacello}
              alt={g.hero.figureAlt[lang]}
              sizes="(max-width: 1024px) 100vw, 520px"
              loading="eager"
              fetchPriority="high"
              className="w-full rounded-2xl border border-line object-cover object-top shadow-[0_18px_50px_#10131c1a]"
            />
            <figcaption className="mt-3 text-sm text-mute">{g.hero.figureCaption[lang]}</figcaption>
          </figure>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="prijs-titel">
        <div className="reveal mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="prijs-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.prize.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{g.prize.intro[lang]}</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {g.prize.items[lang].map(item => (
              <li key={item} className="rounded-2xl border border-line bg-surface-2 p-5 text-paper">{item}</li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-sm text-mute">{g.prize.excluded[lang]}</p>
        </div>
      </section>

      <section className="border-b border-line bg-surface/30" aria-labelledby="werk-titel">
        <div className="reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="werk-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.proof.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{g.proof.body[lang]}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proofCases.map(item => (
              <Link
                key={item!.slug}
                to={`/cases/${item!.slug}`}
                className="group rounded-2xl border border-line bg-surface-2 p-4 transition hover:border-accent"
                onClick={() => trackEvent('case_viewed', { case: item!.slug, placement: 'giveaway_page' })}
              >
                <CaseVisual case={item!} lang={lang} ratio="aspect-[16/10]" />
                <h3 className="mt-4 text-base font-semibold text-paper">{item!.name}</h3>
                <p className="mt-1 text-sm text-mute">{item!.sector[lang]}</p>
                <span className="mt-3 inline-block text-sm font-medium text-accent-2 group-hover:text-accent">
                  {g.proof.view[lang]} <span aria-hidden="true">↗</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="stappen-titel">
        <div className="reveal mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="stappen-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.steps.title[lang]}</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-3">
            {g.steps.items[lang].map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-surface-2 p-6">
                <span className="font-display text-2xl text-accent">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-base font-semibold text-paper">{step.title}</h3>
                <p className="mt-2 text-sm text-bone">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="waarom-titel">
        <div className="reveal mx-auto grid max-w-5xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 id="waarom-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.why.title[lang]}</h2>
            <p className="mt-4 text-bone">{g.why.body[lang]}</p>
          </div>
          <figure className="m-0">
            <picture>
              <source media="(max-width: 640px)" srcSet={studioTeamSmall} />
              <ResponsiveImage
                src={studioTeam}
                alt={g.why.photoAlt[lang]}
                sizes="(max-width: 1024px) 100vw, 380px"
                loading="lazy"
                className="w-full rounded-2xl border border-line object-cover"
              />
            </picture>
          </figure>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="formulier-titel">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <figure className="m-0 shrink-0">
              <picture>
                <source media="(max-width: 640px)" srcSet={stefDeskSmall} />
                <ResponsiveImage
                  src={stefDesk}
                  alt={g.form.photoAlt[lang]}
                  sizes="140px"
                  loading="lazy"
                  className="size-28 rounded-2xl border border-line object-cover sm:size-36"
                />
              </picture>
            </figure>
            <div>
              <h2 id="formulier-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.form.title[lang]}</h2>
              <p className="mt-3 text-bone">{g.form.body[lang]}</p>
              <p className="mt-3 text-sm text-mute">
                <strong className="text-paper">{g.form.who[lang]}</strong> · {g.form.where[lang]}
              </p>
            </div>
          </div>
          <div className="mt-10">
            <GiveawayEntryForm />
          </div>
        </div>
      </section>

      <section id="voorwaarden" className="border-b border-line" aria-labelledby="voorwaarden-titel">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="voorwaarden-titel" className="font-display text-2xl text-paper text-balance sm:text-3xl">{g.rules.title[lang]}</h2>
          <p className="mt-3 text-sm text-mute">{g.rules.notice[lang]}</p>
          <ol className="mt-8 grid gap-4 text-sm text-bone">
            {g.rules.items[lang].map((rule, index) => (
              <li key={rule} className="flex gap-3">
                <span className="shrink-0 font-medium text-mute">{index + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
