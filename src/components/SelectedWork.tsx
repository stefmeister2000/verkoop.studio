import ResponsiveImage from '../components/ResponsiveImage'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { cases } from '../data/cases'
import { lyteCases } from '../data/lyteCases'
export default function SelectedWork() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const selected = ['pinacello', 'nooms', 'olearys', 'e-kart'].flatMap((slug) => cases.filter((c) => c.slug === slug))
  const featuredPartners = ['Tinrate', 'WERKR'].flatMap(name => {
    const project = lyteCases.find(c => c.name === name)
    return project ? [project] : []
  })
  return (
    <section className="selected-work" id="selected-work">
      <div className="work-intro">
        <p className="eyebrow">{nl ? 'Onze projecten' : 'Our projects'}</p>
        <h2>
          {nl ? 'Sterke campagnes.' : 'Strong campaigns.'}
          <br />
          {nl ? 'Slimme websites.' : 'Smart websites.'}
          <br />
          <span>{nl ? 'Meetbare groei.' : 'Measurable growth.'}</span>
        </h2>
        <p>
          {nl
            ? 'Van eerste indruk tot dagelijkse interactie. Ontdek de projecten achter ons team.'
            : 'From first impression to everyday interaction. Explore the projects behind our team.'}
        </p>
        <Link className="button-dark" to="/cases">
          {nl ? 'Alle projecten' : 'All projects'} <span>↗</span>
        </Link>
        <div className="work-signoff">
          <span>✳</span>
          <p>
            {nl
              ? 'Van idee naar iets dat het verschil maakt.'
              : 'From an idea to something that makes a difference.'}
          </p>
        </div>
      </div>
      {selected.map((c) => (
        <Link
          className={'project-tile project-' + c.slug}
          key={c.slug}
          to={'/cases/' + c.slug}
        >
          <div className="project-image">
            <ResponsiveImage src={c.image} alt={c.name} loading="lazy" />
            <span className="project-arrow">↗</span>
          </div>
          <div className="project-caption">
            <h3>{c.name}</h3>
            {c.slug === 'pinacello' && (
              <strong className="project-result">
                +120% {nl ? 'online omzet' : 'online revenue'}
              </strong>
            )}
            <p>{c.summary[lang]}</p>
            <span>{nl ? 'Bekijk de case' : 'Explore the case'} ↗ · Stef Keppens</span>
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
            <ResponsiveImage src={c.image} alt={c.name} loading="lazy" />
            <span className="project-arrow">↗</span>
          </div>
          <div className="project-caption">
            <div className="partner-project-heading">
              <h3>{c.name}</h3>
              {c.logo && <ResponsiveImage src={c.logo} alt="" loading="lazy" className="lyte-client-logo" />}
            </div>
            <p>{c.description[lang]}</p>
            <span>{nl ? 'Bekijk de case' : 'Explore the case'} ↗ · LYTE Studios</span>
          </div>
        </a>
      ))}
    </section>
  )
}
