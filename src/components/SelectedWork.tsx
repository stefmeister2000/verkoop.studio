import ResponsiveImage from '../components/ResponsiveImage'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { cases } from '../data/cases'
import { lyteCases } from '../data/lyteCases'

const cardLine: Record<string, { nl: string; en: string }> = {
  nooms: {
    nl: 'Pre-sale via influencer marketing volledig uitverkocht.',
    en: 'Pre-sale sold out completely via influencer marketing.',
  },
  'e-kart': {
    nl: 'Van zin in een race naar een boeking.',
    en: 'From the thrill of racing to a booking.',
  },
}

export default function SelectedWork() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const selected = ['pinacello', 'nooms', 'e-kart'].flatMap((slug) => cases.filter((c) => c.slug === slug))
  const featuredPartners = ['WERKR'].flatMap(name => {
    const project = lyteCases.find(c => c.name === name)
    return project ? [project] : []
  })
  return (
    <section className="selected-work" id="selected-work">
      <div className="work-intro">
        <h2>
          {nl ? 'Sterke campagnes.' : 'Strong campaigns.'}
          <br />
          {nl ? 'Slimme websites.' : 'Smart websites.'}
          <br />
          <span>{nl ? 'Meetbare groei.' : 'Measurable growth.'}</span>
        </h2>
        <p>{nl ? 'Ontdek de projecten achter ons team.' : 'Explore the projects behind our team.'}</p>
        <Link className="button-dark" to="/cases">
          {nl ? 'Alle projecten' : 'All projects'} <span>↗</span>
        </Link>
      </div>
      {selected.map((c) => (
        <Link
          className={'project-tile project-' + c.slug}
          key={c.slug}
          to={'/cases/' + c.slug}
        >
          <div className="project-image">
            <ResponsiveImage src={c.image} alt={c.name} loading="lazy" sizes="(max-width: 600px) 88px, (max-width: 640px) 100vw, (max-width: 1024px) 70vw, 960px" />
            <span className="project-arrow" aria-hidden="true">↗</span>
          </div>
          <div className="project-caption">
            <h3>{c.name}</h3>
            {c.slug === 'pinacello' ? (
              <strong className="project-result">+120% {nl ? 'online omzet' : 'online revenue'}</strong>
            ) : (
              <p>{cardLine[c.slug][lang]}</p>
            )}
          </div>
        </Link>
      ))}
      {featuredPartners.map((c) => (
        <a
          className="project-tile partner-project"
          key={c.url}
          href={c.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="project-image">
            <ResponsiveImage src={c.image} alt={c.name} loading="lazy" sizes="(max-width: 600px) 88px, (max-width: 640px) 100vw, (max-width: 1024px) 70vw, 960px" />
            <span className="project-arrow" aria-hidden="true">↗</span>
          </div>
          <div className="project-caption">
            <div className="partner-project-heading">
              <h3>{c.name}</h3>
              {c.logo && <ResponsiveImage src={c.logo} alt="" loading="lazy" className="lyte-client-logo" />}
            </div>
            <p>{cardLine[c.name]?.[lang] ?? c.description[lang]}</p>
          </div>
        </a>
      ))}
    </section>
  )
}
