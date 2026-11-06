import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import GiveawayEntryForm from '../components/GiveawayEntryForm'
import ResponsiveImage from '../components/ResponsiveImage'
import CaseVisual from '../components/CaseVisual'
import CheckList from '../components/CheckList'
import { giveaway } from '../data/giveaway'
import { getCase } from '../data/cases'
import { trackEvent } from '../lib/analytics'
import { useLang } from '../i18n/LanguageContext'
import pinacelloSite from '../assets/pinacello-site.webp'
import healthfactorSite from '../assets/cases/healthfactor-website.webp'
import studioFlyers from '../assets/studio-flyers.webp'
import studioFlyersSmall from '../assets/studio-flyers-640.webp'
import stefDesk from '../assets/stef-desk.webp'
import stefDeskSmall from '../assets/stef-desk-640.webp'

/** One content rail for the whole page, so every heading starts on the same line.
 *  max-w-6xl is the width the rest of the site uses. */
const RAIL = 'mx-auto w-full max-w-6xl px-5 sm:px-8'

export default function GratisWebsite() {
  const { lang } = useLang()
  const g = giveaway
  const proofCases = g.proof.cases.map(slug => getCase(slug)).filter(Boolean)

  return (
    <div>
      <Seo title={g.seo.title[lang]} description={g.seo.description[lang]} path={g.path} />

      {/* On a phone the screenshot sits between the lead and the facts, so the
          thing being given away is on screen without scrolling. On desktop the
          left column keeps its reading order and the screenshot spans it. */}
      <section className="bg-surface/40">
        <div className={`${RAIL} reveal grid items-center gap-x-16 gap-y-8 py-12 sm:py-20 lg:grid-cols-[1fr_1.1fr]`}>
          <div className="order-1 lg:col-start-1 lg:row-start-1">
            <h1 className="font-display text-4xl text-paper text-balance sm:text-5xl">{g.hero.title[lang]}</h1>
            <p className="mt-4 max-w-xl text-lg text-bone">{g.hero.lead[lang]}</p>
          </div>

          <figure className="order-2 m-0 lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-center">
            <ResponsiveImage
              src={pinacelloSite}
              alt={g.hero.figureAlt[lang]}
              sizes="(max-width: 1024px) 100vw, 600px"
              loading="eager"
              fetchPriority="high"
              className="w-full rounded-2xl border border-line object-cover object-top"
            />
            <figcaption className="mt-3 text-sm text-mute">{g.hero.figureCaption[lang]}</figcaption>
          </figure>

          <div className="order-3 lg:col-start-1 lg:row-start-2">
            <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-3">
              {g.hero.facts[lang].map(fact => (
                <div key={fact.label} className="border-t border-line pt-3">
                  <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mute">{fact.label}</dt>
                  <dd className="mt-1 text-sm font-medium text-paper">{fact.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <a href="#deelnemen" className="button-dark"
                onClick={() => trackEvent('audit_cta_clicked', { placement: 'giveaway_hero' })}>
                {g.hero.cta[lang]} <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="prijs-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="prijs-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.prize.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{g.prize.intro[lang]}</p>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
            <div>
              <CheckList items={[...g.prize.items[lang]]} columns={1} />
              <p className="mt-8 border-t border-line pt-5 text-sm text-mute">{g.prize.excluded[lang]}</p>
            </div>
            <figure className="m-0">
              <ResponsiveImage
                src={healthfactorSite}
                alt={g.prize.figureAlt[lang]}
                sizes="(max-width: 1024px) 100vw, 460px"
                loading="lazy"
                className="w-full rounded-2xl border border-line object-cover object-top"
              />
              <figcaption className="mt-3 text-sm text-mute">{g.prize.figureCaption[lang]}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Three true peers. This card is the page's one card treatment. */}
      <section className="border-t border-line bg-surface/40" aria-labelledby="werk-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="werk-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.proof.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{g.proof.body[lang]}</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {proofCases.map(item => (
              <Link
                key={item!.slug}
                to={`/cases/${item!.slug}`}
                className="group block rounded-2xl border border-line bg-surface-2 p-3 transition hover:border-accent"
                onClick={() => trackEvent('case_viewed', { case: item!.slug, placement: 'giveaway_page' })}
              >
                <CaseVisual case={item!} lang={lang} ratio="aspect-[16/10]" />
                <div className="px-2 pb-1 pt-4">
                  <h3 className="text-base font-semibold text-paper">{item!.name}</h3>
                  <p className="mt-1 text-sm text-mute">{item!.sector[lang]}</p>
                  <span className="mt-3 inline-block text-sm font-medium text-accent-2 group-hover:text-accent">
                    {g.proof.view[lang]} <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* A real sequence, so a numbered list. No card chrome: these are not peers to the cases. */}
      <section className="border-t border-line" aria-labelledby="stappen-titel">
        <div className={`${RAIL} reveal py-16 sm:py-20`}>
          <h2 id="stappen-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.steps.title[lang]}</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {g.steps.items[lang].map((step, index) => (
              <li key={step.title} className="border-t-2 border-accent pt-5">
                <span className="font-display text-sm font-semibold text-accent">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-base font-semibold text-paper">{step.title}</h3>
                <p className="mt-2 text-sm text-bone">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line" aria-labelledby="waarom-titel">
        <div className={`${RAIL} reveal grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1fr_0.7fr]`}>
          <div>
            <h2 id="waarom-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.why.title[lang]}</h2>
            <p className="mt-4 text-bone">{g.why.body[lang]}</p>
          </div>
          <figure className="m-0">
            <picture>
              <source media="(max-width: 640px)" srcSet={studioFlyersSmall} />
              <ResponsiveImage
                src={studioFlyers}
                alt={g.why.photoAlt[lang]}
                sizes="(max-width: 1024px) 100vw, 320px"
                loading="lazy"
                className="w-full rounded-2xl border border-line object-cover"
              />
            </picture>
          </figure>
        </div>
      </section>

      {/* The page ends on the action. */}
      <section id="deelnemen" className="border-t border-line bg-surface/40" aria-labelledby="formulier-titel">
        <div className={`${RAIL} py-16 sm:py-20`}>
          <h2 id="formulier-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.form.title[lang]}</h2>
          <p className="mt-3 max-w-2xl text-bone">{g.form.body[lang]}</p>
          <div className="mt-6 flex items-center gap-4">
            <figure className="m-0 shrink-0">
              <picture>
                <source media="(max-width: 640px)" srcSet={stefDeskSmall} />
                <ResponsiveImage
                  src={stefDesk}
                  alt={g.form.photoAlt[lang]}
                  sizes="64px"
                  loading="lazy"
                  className="size-14 rounded-full border border-line object-cover"
                />
              </picture>
            </figure>
            <p className="text-sm text-mute">
              <strong className="block font-medium text-paper">{g.form.who[lang]}</strong>
              {g.form.where[lang]}
            </p>
          </div>
          <div className="mt-10">
            <GiveawayEntryForm />
          </div>
        </div>
      </section>

      {/* Quieter than the offer above it, but fully readable: a contest needs its rules in plain sight. */}
      <section id="voorwaarden" className="border-t border-line" aria-labelledby="voorwaarden-titel">
        <div className={`${RAIL} py-14 sm:py-16`}>
          <h2 id="voorwaarden-titel" className="font-display text-xl text-paper sm:text-2xl">{g.rules.title[lang]}</h2>
          <p className="mt-2 text-sm text-mute">{g.rules.notice[lang]}</p>
          <ol className="mt-7 grid gap-x-10 gap-y-4 text-sm leading-relaxed text-bone sm:grid-cols-2">
            {g.rules.items[lang].map((rule, index) => (
              <li key={rule} className="flex gap-2.5">
                <span className="shrink-0 tabular-nums text-mute">{index + 1}.</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  )
}
