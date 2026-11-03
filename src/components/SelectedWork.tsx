import { useEffect, useRef, useState } from 'react'
import ResponsiveImage from '../components/ResponsiveImage'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { cases } from '../data/cases'

const cardLine: Record<string, { nl: string; en: string }> = {
  healthfactor: {
    nl: '50+ aanvragen in 30 dagen',
    en: '50+ enquiries in 30 days',
  },
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
  const selected = ['pinacello', 'nooms', 'e-kart', 'healthfactor'].flatMap((slug) => cases.filter((c) => c.slug === slug))
  const track = useRef<HTMLDivElement>(null)
  const [reach, setReach] = useState({ start: true, end: false })

  /* Both arrows dim once the track fits, so the row keeps its height instead of shifting after hydration. */
  useEffect(() => {
    const node = track.current
    if (!node) return
    const measure = () => {
      const room = node.scrollWidth - node.clientWidth
      setReach({ start: node.scrollLeft <= 1, end: node.scrollLeft >= room - 1 })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const scrollByCard = (direction: -1 | 1) => {
    const node = track.current
    const first = node?.children[0] as HTMLElement | undefined
    const second = node?.children[1] as HTMLElement | undefined
    if (!node || !first) return
    const stride = second ? second.offsetLeft - first.offsetLeft : node.clientWidth
    node.scrollBy({
      left: stride * direction,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  return (
    <section className="selected-work" id="selected-work">
      <div className="work-intro">
        <div className="work-intro-copy">
          <h2>
            {nl ? 'Sterke campagnes.' : 'Strong campaigns.'}
            <br />
            {nl ? 'Slimme websites.' : 'Smart websites.'}
            <br />
            <span>{nl ? 'Meetbare groei.' : 'Measurable growth.'}</span>
          </h2>
          <p>{nl ? 'Ontdek de projecten achter ons team.' : 'Explore the projects behind our team.'}</p>
        </div>
        <div className="work-intro-actions">
          <Link className="button-dark" to="/cases">
            {nl ? 'Alle projecten' : 'All projects'} <span>↗</span>
          </Link>
          <div className="work-controls">
            <button
              type="button"
              aria-label={nl ? 'Vorig project' : 'Previous project'}
              aria-controls="work-track"
              disabled={reach.start}
              onClick={() => scrollByCard(-1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label={nl ? 'Volgend project' : 'Next project'}
              aria-controls="work-track"
              disabled={reach.end}
              onClick={() => scrollByCard(1)}
            >
              →
            </button>
          </div>
        </div>
      </div>
      <div
        className="work-track"
        id="work-track"
        ref={track}
        role="region"
        aria-label={nl ? 'Projecten' : 'Projects'}
        tabIndex={0}
        onScroll={(event) => {
          const node = event.currentTarget
          const room = node.scrollWidth - node.clientWidth
          setReach({ start: node.scrollLeft <= 1, end: node.scrollLeft >= room - 1 })
        }}
      >
        {selected.map((c) => (
          <Link
            className={'project-tile project-' + c.slug}
            key={c.slug}
            to={'/cases/' + c.slug}
          >
            <div className="project-image">
              <ResponsiveImage src={c.image} alt={c.name} loading="lazy" sizes="(max-width: 600px) 86vw, (max-width: 1024px) 44vw, 420px" />
              <span className="project-arrow" aria-hidden="true">↗</span>
            </div>
            <div className="project-caption">
              <h3>{c.name}</h3>
              {c.slug === 'pinacello' ? (
                <strong className="project-result">+120% {nl ? 'online omzet' : 'online revenue'}</strong>
              ) : c.slug === 'healthfactor' ? (
                <strong className="project-result">{cardLine[c.slug][lang]}</strong>
              ) : (
                <p>{cardLine[c.slug][lang]}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
