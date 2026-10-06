import { faqItems } from '../data/faq'
import { services } from '../data/services'
import { cases } from '../data/cases'
import { pricingTiers } from '../data/pricing'
import { processSteps } from '../data/process'
import type { Lang } from '../data/types'

export type ChatArticle = { id: string; title: string; text: string; bullets?: string[]; href: string; keywords: string; followups?: string[] }
const aliases: Record<string, string> = {
  'email-marketing': 'email e-mail mail nieuwsbrief nieuwsbrieven newsletter flows retention',
  'data-analytics': 'tracking meten analytics data ga4 dashboard dashboards rapportage',
  websites: 'website websites webshop webshops site webdesign ecommerce',
  software: 'software app apps applicatie platform development',
  'landing-pages': 'landing landingspagina landingspaginas landingpage',
  funnels: 'funnel funnels klantreis salesfunnel leads aanvragen',
  'meta-ads': 'meta facebook instagram social advertenties',
  'google-ads': 'google zoekmachine search shopping zoekwoorden adwords',
  'ecommerce-conversie': 'conversie conversion optimaliseren checkout upsell',
  'ai-automatiseringen': 'ai automatisering automatiseringen automation crm chatbot',
  distributie: 'distributie outreach b2b navigator',
}
const normalise = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/e-mail/g, 'email').replace(/[^a-z0-9]+/g, ' ').trim()
const stop = new Set('de het een jullie jij je ik we wij en of is kan kunnen wat hoe dat dit voor met van in op om te aan er ook mijn the a an you your i we and or is can what how that this for with of in on to me about more meer graag wil want weten know vertel tell'.split(' '))
const tokens = (value: string) => normalise(value).split(' ').filter(word => word && !stop.has(word))
export function getChatArticles(lang: Lang): ChatArticle[] {
  const nl = lang === 'nl'
  return [
    { id: 'pricing', title: nl ? 'Pakketten & prijzen' : 'Plans & pricing', text: nl ? 'Drie manieren om samen te groeien. Onze klanttools, zoals het CRM en marketingdashboard, zijn inbegrepen, net als documentatie en instructievideo’s. Dit zijn richtprijzen voor doorlopende marketing. Scope, advertentiebudget en eventuele externe licenties spreken we vooraf af; websites en software op maat begroten we apart.' : 'Three ways to grow together. Our client tools, including the CRM and marketing dashboard, are included, along with documentation and video guides. These are guide prices for ongoing marketing. Scope, ad spend and any third-party licences are agreed upfront; websites and custom software are quoted separately.', bullets: pricingTiers.map(t => `${t.name[lang]} — ${t.price[lang]}`), href: '/#groeipakketten', keywords: 'prijs prijzen pricing price kost kosten cost budget tarieven pakketten packages plans hoeveel', followups: pricingTiers.map(t => `plan-${t.key}`) },
    ...pricingTiers.map(t => ({ id: `plan-${t.key}`, title: t.name[lang], text: `${t.price[lang]}. ${t.audience[lang]}`, bullets: t.highlights[lang], href: ` /contact?pakket=${t.key}`.trim(), keywords: t.key, followups: ['pricing', 'start'] })),
    { id: 'process', title: nl ? 'Van eerste gesprek tot uitvoering' : 'From first conversation to delivery', text: nl ? 'We beginnen bij je doelen en huidige situatie. Daarna bouwen en verbeteren we de klantreis in vijf stappen.' : 'We start with your goals and current situation, then build and improve the customer journey in five steps.', bullets: processSteps.map(step => `${step.title[lang]} — ${step.description[lang]}`), href: '/agency', keywords: 'werkwijze aanpak proces process stappen samenwerking collaboration', followups: ['start', 'pricing'] },
    { id: 'start', title: nl ? 'Kennismaken met de studio' : 'Meet the studio', text: faqItems[11].answer[lang], href: '/contact', keywords: 'contact kennismaken kennismaking starten beginnen start afspraak meeting gesprek', followups: ['pricing', 'process'] },
    { id: 'cases', title: nl ? 'Werk uit de praktijk' : 'Selected work', text: nl ? 'Bekijk hoe strategie, design en marketing samenkomen bij deze projecten.' : 'See how strategy, design and marketing come together in these projects.', bullets: cases.map(c => `${c.name} — ${c.sector[lang]}`), href: '/cases', keywords: 'cases case voorbeelden voorbeeld portfolio projecten results resultaten', followups: cases.map(c => `case-${c.slug}`) },
    ...services.map(s => ({ id: `service-${s.slug}`, title: s.title[lang], text: s.summary[lang], bullets: s.includes[lang], href: `/${s.slug}`, keywords: aliases[s.slug] ?? s.slug, followups: [`process-${s.slug}`, ...(s.relatedCase ? [`case-${s.relatedCase}`] : []), 'start'] })),
    ...services.map(s => ({ id: `process-${s.slug}`, title: nl ? `${s.title[lang]}: onze aanpak` : `${s.title[lang]}: our approach`, text: s.problem[lang], bullets: s.process[lang], href: `/${s.slug}`, keywords: '', followups: ['start', 'pricing'] })),
    ...cases.map(c => ({ id: `case-${c.slug}`, title: c.name, text: c.summary[lang], bullets: c.built[lang], href: `/cases/${c.slug}`, keywords: `${c.name} ${c.slug}`, followups: ['cases', 'start'] })),
    ...faqItems.map((f, i) => ({ id: `faq-${i}`, title: f.question[lang], text: f.answer[lang], href: '/contact', keywords: i === 0 ? 'wie who locatie location lochristi studio' : i === 13 ? 'consulting consultancy advies uur hour leertraject learning' : '', followups: ['start'] })),
  ]
}
export function findChatAnswers(query: string, lang: Lang, context?: string): ChatArticle[] {
  const articles = getChatArticles(lang)
  const words = tokens(query)
  const cost = /\b(prijs|prijzen|kost|kosten|cost|price|pricing|budget|hoeveel)\b/.test(normalise(query))
  const selected = articles.find(a => a.id === context)
  if (cost && selected?.id.startsWith('service-') && !words.some(w => ['google', 'meta', 'email', 'website', 'software'].includes(w))) {
    return [{ ...articles[0], id: 'custom-price', title: `${selected.title} · ${lang === 'nl' ? 'prijs' : 'price'}`, text: lang === 'nl' ? 'Voor deze dienst bepalen we de prijs op basis van de scope. Bespreek je doelen met ons voor een concreet voorstel.' : 'Pricing for this service depends on the scope. Discuss your goals with us for a specific proposal.', bullets: undefined, href: '/contact', followups: ['pricing', 'start'] }]
  }
  if (/^(en )?(hoe werkt dat|hoe pakken jullie dat aan|vertel meer|meer info|tell me more|how does that work|how do you do that)[?!. ]*$/i.test(query.trim()) && selected) {
    return [articles.find(a => a.id === selected.followups?.[0]) ?? selected]
  }
  if (!words.length) return []
  if (/\b(duurt|duur|deadline|wanneer|timeline|long|weeks|weken)\b/.test(normalise(query))) return [{ id: 'timeline', title: lang === 'nl' ? 'Planning op maat' : 'A tailored timeline', text: lang === 'nl' ? 'Een concrete planning hangt af van de scope en beschikbaarheid. We leggen de stappen en timing samen vast na het eerste gesprek.' : 'A specific timeline depends on scope and availability. We agree on the steps and timing together after the first conversation.', href: '/contact', keywords: '', followups: ['process', 'start'] }]
  const ranked = articles.filter(a => !a.id.startsWith('process-')).map(a => {
    const keys = new Set(tokens(a.keywords))
    const title = new Set(tokens(a.title))
    const body = new Set(tokens(a.text))
    const score = words.reduce((sum, word) => sum + (keys.has(word) ? 6 : title.has(word) ? 3 : body.has(word) ? 1 : 0), 0)
    return { a, score }
  }).filter(x => x.score >= 5).sort((a,b) => b.score - a.score)
  // Don't quote a marketing retainer as the cost of an individual website or service.
  if (cost && ranked.some(x => x.a.id.startsWith('service-'))) {
    const service = ranked.find(x => x.a.id.startsWith('service-'))!.a
    return [{ ...service, id: 'custom-price', title: `${service.title} · ${lang === 'nl' ? 'prijs op maat' : 'custom pricing'}`, text: lang === 'nl' ? 'De prijs hangt af van de omvang en uitvoering. We bespreken eerst je doelen en bepalen daarna de scope en begroting. De maandpakketten zijn richtprijzen voor doorlopende marketing.' : 'The price depends on scope and delivery. We first discuss your goals, then define scope and budget. Monthly plans are guide prices for ongoing marketing.', bullets: undefined, href: '/contact', followups: ['pricing', 'start'] }]
  }
  return ranked.slice(0, 2).filter((x,i) => i === 0 || x.score === ranked[0].score).map(x => x.a)
}
