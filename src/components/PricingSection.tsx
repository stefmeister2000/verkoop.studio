import { Link } from 'react-router-dom'
import { pricingTiers, featureRows, addOns } from '../data/pricing'
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
  return (
    <section id="groeipakketten" className="growth-pricing" aria-labelledby="pricing-title">
      <div className="pricing-wrap">
        <header className="pricing-intro">
          <p className="eyebrow">{nl ? 'Samenwerken met verkoop.studio' : 'Working with verkoop.studio'}</p>
          <h2 id="pricing-title">{nl ? 'De juiste basis.' : 'The right foundation.'}<br /><span>{nl ? 'De ruimte om te groeien.' : 'Room to grow.'}</span></h2>
          <p>{nl ? 'Meer grip op je marketing of een team dat mee de uitvoering draagt? Kies de samenwerking die past bij je doelen en wat je intern al kunt.' : 'More clarity in your marketing, or a team to help deliver it? Choose the collaboration that fits your goals and in-house capabilities.'}</p>
        </header>
        <section className="pricing-included" aria-labelledby="included-title">
          <div className="pricing-included-intro">
            <p className="eyebrow">{nl ? 'Bij elk groeipakket inbegrepen' : 'Included in every growth package'}</p>
            <h3 id="included-title">{nl ? 'Je tools én de uitleg erbij.' : 'Your tools, with the guidance to use them.'}</h3>
            <p>{nl ? 'Je krijgt toegang tot onze programma’s, zoals een CRM en marketingdashboard. Die hoef je dus niet meer apart aan te schaffen.' : 'You get access to our software, including a CRM and marketing dashboard. No separate purchase or subscription needed for these tools.'}</p>
          </div>
          <div className="pricing-included-grid">
            <div><h4>{nl ? 'CRM voor je klantopvolging' : 'CRM for customer follow-up'}</h4><p>{nl ? 'Je contacten, verkoopkansen en volgende stappen overzichtelijk op één plek.' : 'Your contacts, sales opportunities and next steps, organised in one place.'}</p></div>
            <div><h4>{nl ? 'Je eigen marketingdashboard' : 'Your marketing dashboard'}</h4><p>{nl ? 'Inzicht in je campagnes en resultaten, zonder een extra abonnement op ons dashboard.' : 'A clear view of your campaigns and results, without an extra subscription to our dashboard.'}</p></div>
            <div><h4>{nl ? 'Documentatie & instructievideo’s' : 'Documentation & video guides'}</h4><p>{nl ? 'Bij alles wat we opleveren krijg je duidelijke documentatie en instructievideo’s. Zo weten jij en je team hoe alles werkt en kun je het altijd terugkijken.' : 'Everything we deliver comes with clear documentation and video guides, so you and your team know how it works and can revisit the steps whenever you need.'}</p></div>
          </div>
        </section>
        <div className="pricing-grid">
          {pricingTiers.map((tier, index) => {
            const copy = positioning[tier.key]
            return <article key={tier.key} className={`growth-plan ${tier.key === 'partner' ? 'growth-plan-featured' : ''}`} aria-labelledby={`plan-${tier.key}`}>
              <div className="plan-topline"><span>0{index + 1}</span><span>{copy.label[i]}</span></div>
              <div className="plan-signal" aria-hidden="true">{[0, 1, 2].map(n => <span key={n} className={n <= index ? 'signal-active' : ''} />)}</div>
              <h3 id={`plan-${tier.key}`}>{tier.name[lang]}</h3>
              <p className="plan-outcome">{copy.outcome[i]}</p>
              <p className="plan-price">{tier.price[lang]}</p>
              <p className="plan-audience">{tier.audience[lang]}</p>
              <div className="plan-includes"><p>{nl ? 'Dit pakken we aan' : 'What we work on'}</p><ul>{tier.highlights[lang].map(item => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div>
              <Link to={`/contact?pakket=${tier.key}`} className="plan-cta">{copy.cta[i]}<span aria-hidden="true">↗</span></Link>
              <p className="plan-cta-note">{nl ? 'Eerst je doelen bespreken, dan een voorstel.' : 'Your goals first. A proposal comes next.'}</p>
            </article>
          })}
        </div>
        <div className="pricing-scope"><span aria-hidden="true">↗</span><p><strong>{nl ? 'Duidelijke afspraken vooraf.' : 'Clear agreements upfront.'}</strong> {nl ? 'Dit zijn richtprijzen voor doorlopende marketing. Onze klanttools, documentatie en instructievideo’s zijn inbegrepen. In je voorstel leggen we de scope, prioriteiten, het advertentiebudget, eventuele externe licenties en btw vast. Websites, apps en software op maat begroten we apart.' : 'These are indicative rates for ongoing marketing. Our client tools, documentation and video guides are included. Your proposal specifies scope, priorities, advertising budget, any third-party licences and VAT. Websites, apps and custom software are quoted separately.'}</p></div>
        <details className="pricing-comparison">
          <summary>{nl ? 'Vergelijk wat er in elk pakket zit' : 'Compare what each package includes'}<span aria-hidden="true">+</span></summary>
          <div className="pricing-table-scroll" role="region" aria-label={nl ? 'Pakketvergelijking, horizontaal scrollbaar' : 'Package comparison, scroll horizontally'} tabIndex={0}>
            <table><caption className="sr-only">{nl ? 'Volledige vergelijking van de groeipakketten' : 'Full growth package comparison'}</caption><thead><tr><th scope="col">{nl ? 'Inbegrepen' : 'Included'}</th>{pricingTiers.map(tier => <th scope="col" key={tier.key}>{tier.name[lang]}</th>)}</tr></thead><tbody>{featureRows.map(row => <tr key={row.label[lang]}><th scope="row">{row.label[lang]}</th>{row.values.map((cell, index) => <td key={index}>{cell.type === 'text' ? cell.label[lang] : <><span aria-hidden="true">{cell.type === 'check' ? '✓' : '—'}</span><span className="sr-only">{cell.type === 'check' ? (nl ? 'Inbegrepen' : 'Included') : (nl ? 'Niet inbegrepen' : 'Not included')}</span></>}</td>)}</tr>)}</tbody></table>
          </div>
        </details>
        <div className="pricing-first-step">
          <div><p className="eyebrow">{nl ? 'Liever klein beginnen?' : 'Prefer to start small?'}</p><h3>{nl ? 'Je hoeft het nog niet te weten.' : 'You don’t have to know yet.'}</h3><p>{nl ? 'We bekijken eerst waar je staat. Een gericht gesprek of leertraject kan ook, zonder meteen voor een maandpakket te kiezen.' : 'Let’s look at where you are first. A focused session or learning track is also an option, without choosing a monthly package.'}</p><Link className="button-dark" to="/contact">{nl ? 'Help me kiezen' : 'Help me choose'} <span aria-hidden="true">↗</span></Link></div>
          <div className="pricing-alternatives">{addOns.map(addOn => <div key={addOn.key}><h4>{addOn.name[lang]}</h4><strong>{addOn.price?.[lang] ?? (nl ? 'Op aanvraag' : 'On request')}</strong><p>{addOn.description[lang]}</p></div>)}</div>
        </div>
      </div>
    </section>
  )
}
