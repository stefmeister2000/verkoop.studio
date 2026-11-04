import { Link } from 'react-router-dom'
import { useState } from 'react'
import { pricingTiers, featureRows } from '../data/pricing'
import type { TierKey } from '../data/pricing'
import { useLang } from '../i18n/LanguageContext'

const positioning = {
  foundation: {
    label: ['Volledige aanpak', 'The full scope'],
    outcome: ['Alles, behalve videoshoots.', 'Everything except video shoots.'],
    cta: ['Bespreek Foundation', 'Discuss Foundation'],
  },
  partner: {
    label: ['Met videoshoots', 'With video shoots'],
    outcome: ['Dezelfde aanpak, inclusief videoshoots.', 'The same scope, including video shoots.'],
    cta: ['Bespreek Partner', 'Discuss Partner'],
  },
  department: {
    label: ['Met social media', 'With social media'],
    outcome: ['Alles, inclusief videoshoots en volledig social media management.', 'Everything, including video shoots and full social media management.'],
    cta: ['Bespreek Department', 'Discuss Department'],
  },
}

export default function PricingSection() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const i = nl ? 0 : 1
  const [collapsedPlans, setCollapsedPlans] = useState<TierKey[]>([])
  return (
    <section id="groeipakketten" className="growth-pricing" aria-labelledby="pricing-title">
      <div className="pricing-wrap">
        <header className="pricing-intro">
          <h2 id="pricing-title">{nl ? 'Kies je groeipakket.' : 'Choose your growth plan.'}</h2>
          <p>{nl ? 'Elk pakket bevat de volledige aanpak. Het verschil zit in videoshoots en social media management.' : 'Every package covers the full scope. The difference is video shoots and social media management.'}</p>
        </header>
        <div className="pricing-grid">
          {pricingTiers.map((tier, index) => {
            const copy = positioning[tier.key]
            const expanded = !collapsedPlans.includes(tier.key)
            return <article key={tier.key} className={`growth-plan ${tier.key === 'partner' ? 'growth-plan-featured' : ''}`} aria-labelledby={`plan-${tier.key}`}>
              <div className="plan-topline"><span>0{index + 1}</span><span>{copy.label[i]}</span></div>
              <div className="plan-signal" aria-hidden="true">{[0, 1, 2].map(n => <span key={n} className={n <= index ? 'signal-active' : ''} />)}</div>
              <h3 id={`plan-${tier.key}`}>{tier.name[lang]}</h3>
              <p className="plan-outcome">{copy.outcome[i]}</p>
              <p className="plan-price">{tier.price[lang]}</p>
              <button className="plan-details-toggle" type="button" aria-expanded={expanded} aria-controls={`plan-details-${tier.key}`} aria-label={`${nl ? (expanded ? 'Verberg wat je krijgt bij' : 'Bekijk wat je krijgt bij') : (expanded ? 'Hide what’s included in' : 'See what’s included in')} ${tier.name[lang]}`} onClick={() => setCollapsedPlans(plans => expanded ? [...plans, tier.key] : plans.filter(key => key !== tier.key))}>
                {nl ? (expanded ? 'Verberg wat je krijgt' : 'Bekijk wat je krijgt') : (expanded ? 'Hide what’s included' : 'See what’s included')}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              <div id={`plan-details-${tier.key}`} className={`plan-details-content${expanded ? ' is-expanded' : ''}`}>
                <div className="plan-includes">
                  <p>{nl ? 'Wat je krijgt' : 'What you get'}</p>
                  <ul>{featureRows.map(row => {
                    const cell = row.values[index]
                    const included = cell.type !== 'dash'
                    return <li key={row.label[lang]} className={included ? undefined : 'plan-feature-off'}>
                      <span aria-hidden="true">{included ? '✓' : '–'}</span>
                      <span className="sr-only">{included ? (nl ? 'Inbegrepen: ' : 'Included: ') : (nl ? 'Niet inbegrepen: ' : 'Not included: ')}</span>
                      {cell.type === 'text' ? `${row.label[lang]}: ${cell.label[lang]}` : row.label[lang]}
                    </li>
                  })}</ul>
                </div>
              </div>
              <Link to={`/contact?pakket=${tier.key}`} className="plan-cta">{copy.cta[i]}<span aria-hidden="true">↗</span></Link>
            </article>
          })}
        </div>
        <div className="pricing-first-step">
          <div><h3>{nl ? 'Hulp nodig bij je keuze?' : 'Need help choosing?'}</h3><p>{nl ? 'Samen bekijken we wat je bedrijf nodig heeft.' : 'Let’s look at what your business needs.'}</p><Link className="button-dark" to="/contact">{nl ? 'Help me kiezen' : 'Help me choose'} <span aria-hidden="true">↗</span></Link></div>
        </div>
      </div>
    </section>
  )
}
