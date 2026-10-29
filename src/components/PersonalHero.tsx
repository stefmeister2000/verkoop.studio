import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import HeroVideo from './HeroVideo'
import './PersonalHero.css'

export default function PersonalHero() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section className="studio-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          {nl ? 'Meer aanvragen.' : 'More enquiries.'}
          <br />
          {nl ? 'Meer verkoop.' : 'More sales.'}
          <br />
          <span>{nl ? 'Grip op je groei.' : 'Clarity on growth.'}</span>
        </h1>
        <p className="hero-description">
          {nl
            ? 'Je ziet welke campagnes klanten opleveren, en waar je budget beter rendeert.'
            : 'See which campaigns bring customers, and where your budget works harder.'}
        </p>
        <div className="hero-actions">
          <Link className="button-dark" to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'hero' })}>
            {nl ? 'Bespreek je groeikansen' : 'Discuss your growth'} <span>↗</span>
          </Link>
          <a className="button-light" href="#resultaten">
            {nl ? 'Bekijk resultaten' : 'See results'}
          </a>
        </div>
      </div>
      <div className="hero-video-area">
        <HeroVideo lang={lang} />
      </div>
    </section>
  )
}
