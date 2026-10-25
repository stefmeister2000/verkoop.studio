import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { trackEvent } from '../lib/analytics'
import './PersonalHero.css'

const growth = [88, 84, 86, 76, 72, 64, 66, 52, 46, 36, 24]
const line = growth.map((y, index) => `${index * 32},${y}`).join(' ')
const channels = [['Meta Ads', 21, '100%'], ['Google Ads', 14, '67%'], ['E-mail', 9, '43%'], ['Organisch', 4, '19%']] as const

/** An example growth overview: what clients see once campaigns, site and tracking work together. Not client data. */
function GrowthBoard({ nl }: { nl: boolean }) {
  return <div className="hd-board" aria-hidden="true">
    <div className="hd-head"><strong>{nl ? 'Groei-overzicht' : 'Growth overview'}</strong><em>{nl ? 'voorbeeld · 30 dagen' : 'example · 30 days'}</em></div>
    <div className="hd-kpis">
      <div><small>{nl ? 'Aanvragen' : 'Enquiries'}</small><strong>48</strong><b>+32%</b></div>
      <div><small>{nl ? 'Omzet' : 'Revenue'}</small><strong>{nl ? '€38.400' : '€38,400'}</strong><b>+27%</b></div>
      <div><small>ROAS</small><strong>{nl ? '3,6' : '3.6'}</strong><b>+0,8</b></div>
    </div>
    <svg className="hd-chart" viewBox="0 0 320 110">
      <defs><linearGradient id="hd-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#254bfa" stopOpacity=".22" /><stop offset="1" stopColor="#254bfa" stopOpacity="0" /></linearGradient></defs>
      {[30, 60, 90].map(y => <line key={y} x1="0" x2="320" y1={y} y2={y} />)}
      <path d={`M${line.replaceAll(' ', ' L')} L320,110 L0,110 Z`} fill="url(#hd-fill)" />
      <polyline className="hd-line" points={line} />
      <circle cx="320" cy="24" r="4.5" />
    </svg>
    <p className="hd-label">{nl ? 'Klanten per kanaal' : 'Customers by channel'}</p>
    <ul className="hd-channels">{channels.map(([name, value, width]) => <li key={name}><span>{nl || name !== 'Organisch' ? name : 'Organic'}</span><i style={{ width }} /><b>{value}</b></li>)}</ul>
  </div>
}

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
      <div className="hero-art hero-dash">
        <div className="hd-toast" aria-hidden="true"><span className="hd-dot" /><span>{nl ? 'Nieuwe aanvraag' : 'New enquiry'}<small>{nl ? 'via Meta Ads · zojuist' : 'via Meta Ads · just now'}</small></span></div>
        <GrowthBoard nl={nl} />
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
