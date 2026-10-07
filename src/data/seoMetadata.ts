import editorial from './editorial.json' with { type: 'json' }

// Search titles can be more concise than the visible page headings.
type Metadata = { title?: string; description?: string }
export const seoMetadata: Record<string, Partial<Record<'nl' | 'en', Metadata>>> = {
  '/': { nl: { title: 'Marketingbureau in Lochristi' } },
  '/blog': { nl: { title: 'Marketinginzichten voor Gent' } },
  '/blog/marketingbureau-gent-kiezen': { nl: { title: 'Marketingbureau in Gent kiezen' } },
  '/blog/google-ads-gent-budget-aanvragen': { nl: { title: 'Google Ads in Gent: budget en leads' } },
  '/blog/website-gent-meer-aanvragen': { nl: { title: 'Website laten maken in Gent' } },
  '/cases': {
    nl: { title: 'Cases in marketing en ecommerce' },
    en: { title: 'Marketing and ecommerce case studies' },
  },
  '/agency': {
    nl: { title: 'Studio voor marketing en development', description: 'Ontmoet de mensen achter verkoop.studio in Lochristi. Strategie, marketing, design en ontwikkeling voor je volgende groeistap.' },
    en: { title: 'Our marketing and development studio' },
  },
  '/contact': { nl: { title: 'Contact en projectaanvraag' }, en: { title: 'Contact us about your project' } },
  '/funnel-audit': { nl: { title: 'Groeianalyse voor je bedrijf' }, en: { title: 'Growth analysis for your business' } },
  '/funnels': { nl: { title: 'Salesfunnels en klantopvolging' }, en: { title: 'Sales funnels and lead nurturing' } },
  '/meta-ads': { nl: { title: 'Meta Ads voor leads en verkoop' }, en: { title: 'Meta Ads for leads and sales' } },
  '/google-ads': {
    nl: { title: 'Google Ads voor meer aanvragen', description: 'Bereik klanten die actief zoeken. Verkoop.studio uit Lochristi bouwt Google Ads-campagnes met gerichte landingspagina’s en conversiemeting.' },
    en: { title: 'Google Ads for qualified enquiries' },
  },
  '/email-marketing': { nl: { description: 'E-mailmarketing die klanten opvolgt: nieuwsbrieven, segmentatie en geautomatiseerde flows. Van strategie tot uitvoering door verkoop.studio.' } },
  '/distributie': { nl: { description: 'Bouw je distributie uit met verkoop.studio: heldere positionering, geschikte verkoopkanalen en een aanpak voor nieuwe verkooppunten.' } },
  '/cases/nooms': { nl: { title: 'Nooms: merk en ecommerce' }, en: { title: 'Nooms: brand and ecommerce' } },
}

const editorialMetadata: Record<string, Metadata> = editorial.metadata
for (const [path, metadata] of Object.entries(editorialMetadata)) {
  seoMetadata[path] = { ...seoMetadata[path], nl: { ...seoMetadata[path]?.nl, ...metadata } }
}
