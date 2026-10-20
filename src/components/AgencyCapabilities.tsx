import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import ServiceVisual from './ServiceVisual'
import type { VisualService } from '../data/visualServices'
const items: { slug: VisualService; title: string; outcome: [string, string]; text: [string, string]; tags: string }[] = [
  { slug: 'google-ads', title: 'Google Ads', outcome: ['Bereik wie vandaag naar jou zoekt.', 'Reach people looking for you today.'], text: ['Maak van koopintentie geschikte aanvragen en verkopen. We stemmen zoekwoorden, advertenties en landingspagina’s op elkaar af.', 'Turn buying intent into qualified enquiries and sales. We align keywords, ads and landing pages.'], tags: 'Search · Shopping · Conversietracking' },
  { slug: 'meta-ads', title: 'Meta Ads', outcome: ['Maak van aandacht nieuwe klanten.', 'Turn attention into new customers.'], text: ['Laat de juiste mensen je aanbod ontdekken op Facebook en Instagram. We testen beelden, boodschappen en doelgroepen en volgen geïnteresseerde bezoekers opnieuw op.', 'Help the right people discover your offer on Facebook and Instagram. We test visuals, messages and audiences and reconnect with interested visitors.'], tags: 'Facebook · Instagram · Creative testing' },
  { slug: 'data-analytics', title: 'Data & analytics', outcome: ['Weet wat werkt. Beslis met inzicht.', 'Know what works. Decide with clarity.'], text: ['Verbind campagnekosten, aanvragen en verkoop. Met betrouwbare tracking en begrijpelijke dashboards zie je waar je moet bijsturen.', 'Connect campaign costs, enquiries and sales. Reliable tracking and clear dashboards show where to make adjustments.'], tags: 'GA4 · Tag Manager · Looker Studio' },
  { slug: 'email-marketing', title: 'E-mailmarketing', outcome: ['Haal meer uit elke klantrelatie.', 'Get more from every customer relationship.'], text: ['Van eerste inschrijving tot herhaalaankoop: relevante campagnes en automatische e-mailflows houden je merk dichtbij op het juiste moment.', 'From first sign-up to repeat purchase: relevant campaigns and automated email flows keep your brand close at the right moment.'], tags: 'Welcome · Retention · Automation' },
]
export default function AgencyCapabilities() {
  const { lang } = useLang()
  const i = lang === 'nl' ? 0 : 1
  return <section id="expertise" className="marketing-services">
    <div className="marketing-intro">
      <h2>{i === 0 ? 'De juiste mensen bereiken. Meer klanten behouden.' : 'Reach the right people. Keep more customers.'}</h2>
      <p>{i === 0 ? 'Google Ads vangt vraag op. Meta Ads maakt je merk zichtbaar. Data laat zien wat rendeert. E-mailmarketing bouwt de relatie verder uit.' : 'Google Ads captures demand. Meta Ads builds visibility. Data shows what delivers. Email marketing develops the relationship.'}</p>
    </div>
    <div className="marketing-grid">{items.map((item) => <Link key={item.slug} to={`/${item.slug}`} className="marketing-card">
      <ServiceVisual service={item.slug} />
      <div className="marketing-card-copy"><span className="service-name">{item.slug === 'email-marketing' && i === 1 ? 'Email marketing' : item.title}</span><h3>{item.outcome[i]}</h3><p>{item.text[i]}</p><div className="service-tags">{item.tags.split(' · ').map(tag => <span key={tag}>{tag}</span>)}</div><span className="service-more">{i === 0 ? 'Ontdek de aanpak' : 'Explore the approach'} <span>↗</span></span></div>
    </Link>)}</div>
    <div className="marketing-support"><p>{i === 0 ? 'Ook de techniek achter je groei.' : 'The technology behind your growth, too.'}</p><div><Link to="/websites">Websites & ecommerce ↗</Link><Link to="/ai-automatiseringen">CRM & {i === 0 ? 'automatisering' : 'automation'} ↗</Link><Link to="/software">Software & apps ↗</Link></div></div>
  </section>
}
