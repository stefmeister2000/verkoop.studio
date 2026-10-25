import { Link } from 'react-router-dom'
import { useState } from 'react'
import { pricingTiers, featureRows, addOns } from '../data/pricing'
import type { TierKey } from '../data/pricing'
import { useLang } from '../i18n/LanguageContext'

const positioning = {
  foundation: {
    label: ['Een sterke basis', 'A strong foundation'],
    outcome: ['Van losse acties naar een meetbare aanpak.', 'From scattered activity to a measurable plan.'],
    cta: ['Bespreek Foundation', 'Discuss Foundation'],
  },
  partner: {
    label: ['Campagnes + conversie', 'Campaigns + conversion'],
    outcome: ['Laat je campagnes, website en opvolging samenwerken.', 'Connect your campaigns, website and follow-up.'],
    cta: ['Bespreek Partner', 'Discuss Partner'],
  },
  department: {
    label: ['Een team naast je team', 'An extension of your team'],
    outcome: ['Eén partner voor je volledige groeiaanpak.', 'One partner for your complete growth approach.'],
    cta: ['Bespreek maatwerk', 'Discuss your needs'],
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
          <h2 id="pricing-title">{nl ? 'De juiste basis.' : 'The right foundation.'}<br /><span>{nl ? 'De ruimte om te groeien.' : 'Room to grow.'}</span></h2>
          <p>{nl ? 'Van een sterke marketingbasis tot een team dat mee uitvoert. Kies wat past bij je bedrijf.' : 'From a strong marketing foundation to a team that helps deliver it. Choose what fits your business.'}</p>
        </header>
        <section className="pricing-included" aria-labelledby="included-title">
          <div className="pricing-included-intro">
            <h3 id="included-title">{nl ? 'Je tools én de uitleg erbij.' : 'Your tools, with the guidance to use them.'}</h3>
            <p>{nl ? 'Ons CRM en marketingdashboard zijn inbegrepen. Je hoeft er geen apart abonnement voor te nemen.' : 'Our CRM and marketing dashboard are included. No separate subscription needed.'}</p>
          </div>
          <div className="pricing-included-grid">
            <div><h4>{nl ? 'CRM voor je klantopvolging' : 'CRM for customer follow-up'}</h4><p>{nl ? 'Contacten, verkoopkansen en opvolging op één plek.' : 'Contacts, sales opportunities and follow-up in one place.'}</p></div>
            <div><h4>{nl ? 'Je eigen marketingdashboard' : 'Your marketing dashboard'}</h4><p>{nl ? 'Zie hoe je campagnes presteren en wat ze opleveren.' : 'See how your campaigns perform and what they deliver.'}</p></div>
            <div><h4>{nl ? 'Documentatie & instructievideo’s' : 'Documentation & video guides'}</h4><p>{nl ? 'Bij alles wat we opleveren. Duidelijk voor je hele team, altijd opnieuw te bekijken.' : 'With everything we deliver. Clear for your whole team, ready to revisit anytime.'}</p></div>
          </div>
        </section>
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
              <p className="plan-software"><span aria-hidden="true">✓</span>{nl ? 'Inclusief gratis software voor je bedrijf' : 'Includes free software for your business'}</p>
              <button className="plan-details-toggle" type="button" aria-expanded={expanded} aria-controls={`plan-details-${tier.key}`} aria-label={`${nl ? (expanded ? 'Verberg details van' : 'Bekijk wat je krijgt bij') : (expanded ? 'Hide details of' : 'See what’s included in')} ${tier.name[lang]}`} onClick={() => setExpandedPlans(plans => expanded ? plans.filter(key => key !== tier.key) : [...plans, tier.key])}>
                {nl ? (expanded ? 'Verberg details' : 'Bekijk wat je krijgt') : (expanded ? 'Hide details' : 'See what’s included')}<span aria-hidden="true">{expanded ? '−' : '+'}</span>
              </button>
              <div id={`plan-details-${tier.key}`} className={`plan-details-content${expanded ? ' is-expanded' : ''}`}>
                <p className="plan-audience">{tier.audience[lang]}</p>
                <div className="plan-includes"><p>{nl ? 'Dit pakken we aan' : 'What we work on'}</p><ul>{tier.highlights[lang].map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div>
              </div>
              <Link to={`/contact?pakket=${tier.key}`} className="plan-cta">{copy.cta[i]}<span aria-hidden="true">↗</span></Link>
              <p className="plan-cta-note">{nl ? 'Eerst je doelen bespreken, dan een voorstel.' : 'Your goals first. A proposal comes next.'}</p>
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
          <div><h3>{nl ? 'Je hoeft het nog niet te weten.' : 'You don’t have to know yet.'}</h3><p>{nl ? 'We bekijken eerst waar je staat. Wil je liever zelf leren adverteren? Dat kan ook, zonder meteen voor een maandpakket te kiezen.' : 'Let’s look at where you are first. Prefer to learn advertising yourself? That’s an option too, without choosing a monthly package.'}</p><Link className="button-dark" to="/contact">{nl ? 'Help me kiezen' : 'Help me choose'} <span aria-hidden="true">↗</span></Link></div>
          <div className="pricing-alternatives">{addOns.map(addOn => {
            const content = <><h4>{addOn.name[lang]}</h4><strong>{addOn.price?.[lang] ?? (nl ? 'Op aanvraag' : 'On request')}</strong><p>{addOn.description[lang]}</p></>
            return addOn.href ? <Link key={addOn.key} to={addOn.href} className="pricing-alternative-link">{content}<span aria-hidden="true">↗</span></Link> : <div key={addOn.key}>{content}</div>
          })}</div>
        </div>
      </div>
    </section>
  )
}
