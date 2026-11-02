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
          <span>{nl ? 'Wij helpen kmo’s groeien' : 'We help small businesses grow'}</span>{' '}
          {nl
            ? 'met advertenties, overtuigende websites en automatische opvolging'
            : 'with ads, persuasive websites and automated follow-up'}
        </h1>
        <p className="hero-description">
          {nl
            ? 'Vanuit Lochristi bouwen we je campagnes, website en opvolging. In je dashboard zie je welke campagnes aanvragen en verkopen opleveren.'
            : 'From Lochristi, we build your campaigns, website and follow-up. Your dashboard shows which campaigns bring enquiries and sales.'}
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
        <HeroVideo lang={lang} videoId="VPaGW0vW-X0" title="Verkoop Studio — VSL website" />
      </div>
    </section>
  )
}
