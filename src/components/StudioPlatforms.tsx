import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import './StudioPlatforms.css'

type Tool = { name: string; icon: string; format?: 'svg' | 'ico'; wide?: boolean }
const groups: { title: [string, string]; description: [string, string]; tools: Tool[] }[] = [
  {
    title: ['Advertenties & bereik', 'Advertising & reach'],
    description: ['Je doelgroep bereiken via de kanalen die bij je aanbod passen.', 'Reach your audience through the channels that fit your offer.'],
    tools: [{ name: 'Meta', icon: 'meta' }, { name: 'Google', icon: 'google' }, { name: 'TikTok', icon: 'tiktok' }, { name: 'Instagram', icon: 'instagram' }, { name: 'YouTube', icon: 'youtube' }],
  },
  {
    title: ['Data & inzicht', 'Data & insights'],
    description: ['Zien waar bezoekers vandaan komen, wat ze doen en waar ze afhaken.', 'See where visitors come from, what they do and where they drop off.'],
    tools: [{ name: 'Google Analytics', icon: 'googleanalytics' }, { name: 'Tag Manager', icon: 'googletagmanager' }, { name: 'Looker Studio', icon: 'lookerstudio' }, { name: 'Microsoft Clarity', icon: 'clarity', format: 'ico' }, { name: 'Supabase', icon: 'supabase' }],
  },
  {
    title: ['E-mail & ecommerce', 'Email & ecommerce'],
    description: ['Je webshop en e-mailmarketing verbinden, van eerste aankoop tot terugkerende klant.', 'Connect your store and email marketing, from the first purchase to returning customers.'],
    tools: [{ name: 'Mailchimp', icon: 'mailchimp' }, { name: 'Klaviyo', icon: 'klaviyo', wide: true }, { name: 'Resend', icon: 'resend' }, { name: 'Shopify', icon: 'shopify' }, { name: 'Wix', icon: 'wix' }, { name: 'WhatsApp Business', icon: 'whatsapp' }],
  },
  {
    title: ['AI & automatisering', 'AI & automation'],
    description: ['AI inzetten om tools te bouwen, processen te verbinden en terugkerend werk te automatiseren.', 'Use AI to build tools, connect processes and automate recurring work.'],
    tools: [{ name: 'Lovable', icon: 'lovable' }, { name: 'Codex', icon: 'codex' }, { name: 'Claude', icon: 'claude' }, { name: 'OpenAI', icon: 'openai' }],
  },
]

export function StudioTools() {
  const { lang } = useLang()
  const i = lang === 'nl' ? 0 : 1
  return <section className="studio-tools" aria-labelledby="studio-tools-title">
    <div className="marketing-intro">
      <p className="eyebrow">{i === 0 ? 'De tools achter ons werk' : 'The tools behind our work'}</p>
      <h2 id="studio-tools-title">{i === 0 ? 'De juiste platforms. Eén verbonden aanpak.' : 'The right platforms. One connected approach.'}</h2>
      <p>{i === 0 ? 'We werken met deze platforms om je marketing, data en opvolging op elkaar af te stemmen. We kiezen wat jouw bedrijf nodig heeft.' : 'We use these platforms to connect your marketing, data and follow-up. We choose what your business needs.'}</p>
    </div>
    <div className="studio-tools-grid">{groups.map(group => <article className="studio-tool-group" key={group.title[0]}>
      <h3>{group.title[i]}</h3><p>{group.description[i]}</p>
      <ul className="studio-tool-logos">{group.tools.map(tool => <li key={tool.icon}>
        <img src={`/platforms/${tool.icon}.${tool.format ?? 'svg'}`} className={tool.wide ? 'studio-tool-wordmark' : undefined} width={tool.wide ? 101 : 30} height="30" alt="" loading="lazy" />
        <span>{tool.name}</span>
      </li>)}</ul>
    </article>)}</div>
  </section>
}

export function OwnPlatforms() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return <section className="studio-own-platforms" aria-labelledby="own-platforms-title">
    <div className="own-platforms-intro">
      <p className="eyebrow">{nl ? 'Gebouwd door verkoop.studio' : 'Built by verkoop.studio'}</p>
      <h2 id="own-platforms-title">{nl ? 'Onze eigen platforms. Inbegrepen voor klanten.' : 'Our own platforms. Included for clients.'}</h2>
      <p>{nl ? 'Als klant van verkoop.studio krijg je toegang tot ons sales-CRM, marketingdashboard en affiliateplatform. Die programma’s hoef je niet meer apart aan te schaffen. Bij alles wat we opleveren krijg je documentatie en instructievideo’s, zodat jij en je team weten hoe het werkt.' : 'As a verkoop.studio client, you get access to our sales CRM, marketing dashboard and affiliate platform, with no separate purchase or subscription needed. Everything we deliver comes with documentation and video guides, so you and your team know how it works.'}</p>
      <Link className="own-platforms-cta" to="/contact?platform=overview">{nl ? 'Vraag toegang aan' : 'Request access'} <span aria-hidden="true">↗</span></Link>
    </div>
    <div className="own-platforms-products">
      <article><span className="own-product-label">01 / {nl ? 'Sales & opvolging' : 'Sales & follow-up'}</span><h3>Sales CRM</h3><span className="own-product-included">{nl ? 'Gratis voor onze klanten' : 'Free for our clients'}</span><p>{nl ? 'Houd overzicht over je contacten, verkoopkansen en volgende stappen. Zo weet je wie je nog moet opvolgen.' : 'Keep an overview of your contacts, sales opportunities and next steps, so you know who to follow up with.'}</p><Link to="/contact?platform=crm">{nl ? 'Meer over ons CRM' : 'Explore our CRM'} <span aria-hidden="true">↗</span></Link></article>
      <article><span className="own-product-label">02 / {nl ? 'Marketing & inzicht' : 'Marketing & insights'}</span><h3>{nl ? 'Marketingdashboard' : 'Marketing dashboard'}</h3><span className="own-product-included">{nl ? 'Gratis voor onze klanten' : 'Free for our clients'}</span><p>{nl ? 'Je campagnes, resultaten en marketingcijfers op één plek. Zo volg je eenvoudig wat je marketing oplevert.' : 'Your campaigns, results and marketing figures in one place. See what your marketing delivers.'}</p><Link to="/contact?platform=dashboard">{nl ? 'Meer over het marketingdashboard' : 'Explore the marketing dashboard'} <span aria-hidden="true">↗</span></Link></article>
      <article><span className="own-product-label">03 / {nl ? 'Partners & affiliates' : 'Partners & affiliates'}</span><h3>{nl ? 'Affiliateplatform' : 'Affiliate platform'}</h3><span className="own-product-included">{nl ? 'Gratis voor onze klanten' : 'Free for our clients'}</span><p>{nl ? 'Breng je affiliates en samenwerkingen samen op één plek. Een eigen platform voor je partnernetwerk.' : 'Bring your affiliates and partnerships together in one place. Our own platform for your partner network.'}</p><Link to="/contact?platform=affiliates">{nl ? 'Meer over het affiliateplatform' : 'Explore the affiliate platform'} <span aria-hidden="true">↗</span></Link></article>
    </div>
  </section>
}
