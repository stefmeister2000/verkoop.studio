import ResponsiveImage from '../components/ResponsiveImage'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import studioPhoto from '../assets/hero-portrait.webp'
import studioPhotoSmall from '../assets/hero-portrait-640.webp'
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
      <div className="hero-art hero-studio-photo">
        <picture>
          <source media="(max-width: 600px)" srcSet={studioPhotoSmall} />
          <ResponsiveImage src={studioPhoto} alt={nl ? 'Een man drinkt koffie op een terras' : 'A man having coffee on a terrace'} sizes="(max-width: 800px) 100vw, 50vw" loading="eager" fetchPriority="high" decoding="async" />
        </picture>
        <Link
          to="/cases/pinacello"
          className="floating-strategy"
          aria-label={nl ? 'Pinacello, +120% online omzet. Bekijk de case.' : 'Pinacello, +120% online revenue. Explore the case.'}
        >
          <span className="strategy-stat">+120% <span>{nl ? 'online omzet' : 'online revenue'}</span></span>
          <span className="strategy-name">Pinacello <span className="strategy-go" aria-hidden="true">↗</span></span>
        </Link>
      </div>
    </section>
  )
}
