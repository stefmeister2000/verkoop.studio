import ResponsiveImage from './ResponsiveImage'
import { lyteCases } from '../data/lyteCases'
import { useLang } from '../i18n/LanguageContext'
export default function LyteWork() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section id="lyte-projects" className="border-b border-line bg-surface/30">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="font-display text-3xl text-paper sm:text-4xl">
          {nl
            ? 'Eerder werk. In de praktijk.'
            : 'Earlier work. Out in the world.'}
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-bone">
          {nl
            ? 'Werk van LYTE Studios binnen de ervaring achter ons team. Bekijk het originele werk voor hun aanpak en uitvoering.'
            : 'Work by LYTE Studios within the experience behind our team. Explore the original work for their approach and execution.'}
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {lyteCases.map((c) => (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="lyte-case-card"
            >
              <div className="lyte-case-cover">
                <ResponsiveImage src={c.image} alt={`${c.name}, ${c.category}`} loading="lazy" />
                <span className="lyte-case-category">{c.category}</span>
                <span className="lyte-case-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="lyte-case-copy">
                <div className="lyte-case-heading"><h3>{c.name}</h3>{c.logo && <ResponsiveImage src={c.logo} alt="" className="lyte-client-logo" loading="lazy" />}</div>
                <p className="text-sm leading-relaxed text-bone">
                  {c.description[lang]}
                </p>
                <p className="mt-5 text-xs text-accent-2">
                  {nl ? 'Bekijk de case' : 'Explore the case'} ↗
                </p>
                <div className="lyte-credit"><span>{nl ? 'Design & development door' : 'Design & development by'}</span><ResponsiveImage src="/partners/lyte-logo.png" alt="LYTE Studios" loading="lazy" /></div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
