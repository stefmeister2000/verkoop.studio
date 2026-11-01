import { Link } from 'react-router-dom'
import { useState } from 'react'
import { pricingTiers, featureRows, addOns } from '../data/pricing'
import type { TierKey } from '../data/pricing'
import { useLang } from '../i18n/LanguageContext'

const positioning = {
  foundation: {
    label: ['Volledige aanpak', 'The full scope'],
    outcome: ['Alles, behalve videoshoots.', 'Everything except video shoots.'],
    points: [['Strategie, campagnes en rapportage', 'Landingspagina’s, e-mail en SEO', 'Geen videoshoots'], ['Strategy, campaigns and reporting', 'Landing pages, email and SEO', 'No video shoots']],
    cta: ['Bespreek Foundation', 'Discuss Foundation'],
  },
  partner: {
    label: ['Met videoshoots', 'With video shoots'],
    outcome: ['Dezelfde aanpak, inclusief videoshoots.', 'The same scope, including video shoots.'],
    points: [['Alles uit Foundation', 'Videoshoots inbegrepen'], ['Everything in Foundation', 'Video shoots included']],
    cta: ['Bespreek Partner', 'Discuss Partner'],
  },
  department: {
    label: ['Met wekelijks overleg', 'With a weekly meeting'],
    outcome: ['Alles, inclusief videoshoots en een wekelijks overleg.', 'Everything, including video shoots and a weekly meeting.'],
    points: [['Alles uit Partner', 'Videoshoots inbegrepen', 'Wekelijks overleg'], ['Everything in Partner', 'Video shoots included', 'Weekly meeting']],
    cta: ['Bespreek Department', 'Discuss Department'],
  },
}

export default function PricingSection() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const i = nl ? 0 : 1
  const [expandedPlans, setExpandedPlans] = useState<TierKey[]>([])
  return (
    <section id="groeipakketten" className="growth-pricing" aria-labelledby="pricing-title">
      <div className="pricing-wrap">
        <header className="pricing-intro">
          <h2 id="pricing-title">{nl ? 'Kies je groeipakket.' : 'Choose your growth plan.'}</h2>
          <p>{nl ? 'Het verschil zit in videoshoots en het wekelijkse overleg.' : 'The difference is video shoots and the weekly meeting.'}</p>
        </header>
        <div className="pricing-grid">
          {pricingTiers.map((tier, index) => {
            const copy = positioning[tier.key]
            const expanded = expandedPlans.includes(tier.key)
            return <article key={tier.key} className={`growth-plan ${tier.key === 'partner' ? 'growth-plan-featured' : ''}`} aria-labelledby={`plan-${tier.key}`}>
              <div className="plan-topline"><span>0{index + 1}</span><span>{copy.label[i]}</span></div>
              <div className="plan-signal" aria-hidden="true">{[0, 1, 2].map(n => <span key={n} className={n <= index ? 'signal-active' : ''} />)}</div>
              <h3 id={`plan-${tier.key}`}>{tier.name[lang]}</h3>
              <p className="plan-outcome">{copy.outcome[i]}</p>
              <p className="plan-price">{tier.price[lang]}</p>
              <button className="plan-details-toggle" type="button" aria-expanded={expanded} aria-controls={`plan-details-${tier.key}`} aria-label={`${nl ? (expanded ? 'Verberg details van' : 'Bekijk wat je krijgt bij') : (expanded ? 'Hide details of' : 'See what’s included in')} ${tier.name[lang]}`} onClick={() => setExpandedPlans(plans => expanded ? plans.filter(key => key !== tier.key) : [...plans, tier.key])}>
                {nl ? (expanded ? 'Verberg details' : 'Bekijk wat je krijgt') : (expanded ? 'Hide details' : 'See what’s included')}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              <div id={`plan-details-${tier.key}`} className={`plan-details-content${expanded ? ' is-expanded' : ''}`}>
                <div className="plan-includes"><p>{nl ? 'Dit pakken we aan' : 'What we work on'}</p><ul>{copy.points[i].map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div>
              </div>
              <Link to={`/contact?pakket=${tier.key}`} className="plan-cta">{copy.cta[i]}<span aria-hidden="true">↗</span></Link>
            </article>
          })}
        </div>
        <details className="pricing-comparison">
          <summary>{nl ? 'Vergelijk wat er in elk pakket zit' : 'Compare what each package includes'}<span aria-hidden="true">+</span></summary>
          <div className="pricing-table-scroll" role="region" aria-label={nl ? 'Pakketvergelijking, horizontaal scrollbaar' : 'Package comparison, scroll horizontally'} tabIndex={0}>
            <table><caption className="sr-only">{nl ? 'Volledige vergelijking van de groeipakketten' : 'Full growth package comparison'}</caption><thead><tr><th scope="col">{nl ? 'Inbegrepen' : 'Included'}</th>{pricingTiers.map(tier => <th scope="col" key={tier.key}>{tier.name[lang]}</th>)}</tr></thead><tbody>{featureRows.map(row => <tr key={row.label[lang]}><th scope="row">{row.label[lang]}</th>{row.values.map((cell, index) => <td key={index}>{cell.type === 'text' ? cell.label[lang] : <><span aria-hidden="true">{cell.type === 'check' ? '✓' : (nl ? 'Nee' : 'No')}</span><span className="sr-only">{cell.type === 'check' ? (nl ? 'Inbegrepen' : 'Included') : (nl ? 'Niet inbegrepen' : 'Not included')}</span></>}</td>)}</tr>)}</tbody></table>
          </div>
          <div className="pricing-mobile-comparison">
            {pricingTiers.map((tier, tierIndex) => <details key={tier.key}>
              <summary><span>{tier.name[lang]}</span><span aria-hidden="true">+</span></summary>
              <dl>{featureRows.map(row => {
                const cell = row.values[tierIndex]
                return <div key={row.label[lang]}><dt>{row.label[lang]}</dt><dd>{cell.type === 'text' ? cell.label[lang] : cell.type === 'check' ? (nl ? 'Inbegrepen' : 'Included') : (nl ? 'Niet inbegrepen' : 'Not included')}</dd></div>
              })}</dl>
            </details>)}
          </div>
        </details>
        <div className="pricing-first-step">
          <div><h3>{nl ? 'Hulp nodig bij je keuze?' : 'Need help choosing?'}</h3><p>{nl ? 'Samen bekijken we wat je bedrijf nodig heeft.' : 'Let’s look at what your business needs.'}</p><Link className="button-dark" to="/contact">{nl ? 'Help me kiezen' : 'Help me choose'} <span aria-hidden="true">↗</span></Link></div>
          <div className="pricing-alternatives">{addOns.map(addOn => {
            const content = <><h4>{addOn.name[lang]}</h4><strong>{addOn.price?.[lang] ?? (nl ? 'Op aanvraag' : 'On request')}</strong><p>{addOn.description[lang]}</p></>
            return addOn.href ? <Link key={addOn.key} to={addOn.href} className="pricing-alternative-link">{content}<span aria-hidden="true">↗</span></Link> : <div key={addOn.key}>{content}</div>
          })}</div>
        </div>
      </div>
    </section>
  )
}
