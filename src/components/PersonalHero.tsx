import ResponsiveImage from '../components/ResponsiveImage'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import studioPhoto from '../assets/studio-team.webp'
export default function PersonalHero() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section className="studio-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">Performance marketing · Lochristi</p>
        <h1 id="hero-title">
          {nl ? 'Meer aanvragen.' : 'More enquiries.'}
          <br />
          {nl ? 'Meer verkoop.' : 'More sales.'}
          <br />
          <span>{nl ? 'Grip op je groei.' : 'Clarity on growth.'}</span>
        </h1>
        <p className="hero-description">
          {nl
            ? 'We helpen bedrijven groeien met Google Ads, Meta Ads, e-mailmarketing en heldere data-analyse. Zo zie je welke campagnes klanten opleveren en waar je budget beter rendeert.'
            : 'We help businesses grow with Google Ads, Meta Ads, email marketing and clear data analysis. See which campaigns bring customers and where your budget works harder.'}
        </p>
        <div className="hero-actions">
          <Link className="button-dark" to="/contact" onClick={() => trackEvent('audit_cta_clicked', { placement: 'hero' })}>
            {nl ? 'Bespreek je groeikansen' : 'Discuss your growth'} <span>↗</span>
          </Link>
          <a className="button-light" href="#resultaten">
            {nl ? 'Bekijk resultaten' : 'See results'}{' '}
            <span className="button-play">↗</span>
          </a>
        </div>
        <p className="hero-reassurance">{nl ? 'Een eerste gesprek over je doelen, huidige aanpak en volgende stap. Vanuit Lochristi.' : 'A first conversation about your goals, current approach and next step. Based in Lochristi.'}</p>
        <div className="hero-disciplines" aria-label={nl ? 'Onze diensten' : 'Our services'}>
          {[
            ['Google Ads', '/google-ads'],
            ['Meta Ads', '/meta-ads'],
            ['Data & analytics', '/data-analytics'],
            [nl ? 'E-mailmarketing' : 'Email marketing', '/email-marketing'],
          ].map(([label, href], i) => (
            <Link key={href} to={href}><span>0{i + 1}</span><strong>{label}</strong></Link>
          ))}
        </div>
      </div>
      <div className="hero-art hero-studio-photo">
        <ResponsiveImage src={studioPhoto} alt={nl ? 'Samen aan het werk in ons bureau in Lochristi' : 'Working together in our office in Lochristi'} sizes="(max-width: 800px) 100vw, 50vw" loading="eager" fetchPriority="high" decoding="async" />
        <Link to="/cases/pinacello" className="floating-strategy">
          <div>
            <span>+120%</span>
            <span className="strategy-icon">✳</span>
          </div>
          <strong>Pinacello</strong>
          <p>
            {nl
              ? 'Groei in online omzet. Van aandacht naar aankoop.'
              : 'Growth in online revenue. From attention to purchase.'}
          </p>
          <span className="strategy-link">
            {nl ? 'Bekijk de case' : 'Explore the case'} ↗
          </span>
        </Link>
      </div>
    </section>
  )
}
