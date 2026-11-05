import Seo from '../components/Seo'
import GiveawayEntryForm from '../components/GiveawayEntryForm'
import { giveaway } from '../data/giveaway'
import { useLang } from '../i18n/LanguageContext'

export default function GratisWebsite() {
  const { lang } = useLang()
  const g = giveaway

  return (
    <div>
      <Seo title={g.seo.title[lang]} description={g.seo.description[lang]} path={g.path} />

      <section className="border-b border-line">
        <div className="reveal mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-accent-2">{g.hero.eyebrow[lang]}</p>
          <h1 className="mt-4 font-display text-4xl text-paper text-balance sm:text-5xl">{g.hero.title[lang]}</h1>
          <p className="mt-5 max-w-2xl text-lg text-bone">{g.hero.lead[lang]}</p>
          <p className="mt-6 text-sm font-medium text-paper">{g.hero.deadline[lang]}</p>
          <p className="mt-8">
            <a href={`#${g.formId}`} className="button-dark">
              {g.hero.cta[lang]} <span aria-hidden="true">↗</span>
            </a>
          </p>
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
        <div className="reveal mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="waarom-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.why.title[lang]}</h2>
          <p className="mt-4 max-w-2xl text-bone">{g.why.body[lang]}</p>
        </div>
      </section>

      <section className="border-b border-line" aria-labelledby="formulier-titel">
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <h2 id="formulier-titel" className="font-display text-3xl text-paper text-balance sm:text-4xl">{g.form.title[lang]}</h2>
          <p className="mt-4 text-bone">{g.form.body[lang]}</p>
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
