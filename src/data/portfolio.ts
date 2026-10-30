import type { Bi, PortfolioItem } from './types'

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'pinacello-campaign',
    project: 'Pinacello: ecommerce campagnepagina',
    caseSlug: 'pinacello',
    liveUrl: 'https://promo.pinacello.com/',
    category: 'ecommerce',
    audience: { nl: 'Consumenten die instromen via Meta-campagnes', en: 'Consumers arriving via Meta campaigns' },
    objective: { nl: 'Meer online aankopen uit campagneverkeer', en: 'More online purchases from campaign traffic' },
    conversion: { nl: 'Bestelling plaatsen', en: 'Place an order' },
    description: {
      nl: 'Campagnepagina afgestemd op één aanbod, gebouwd om direct van advertentie naar aankoopbeslissing te leiden.',
      en: 'A campaign page built around one offer, designed to lead directly from ad to buying decision.',
    },
  },
  {
    id: 'nooms-launch',
    project: 'Nooms: productlancering',
    caseSlug: 'nooms',
    liveUrl: 'https://noomsdaily.com/',
    category: 'launch',
    audience: { nl: 'Vroege kopers en influencer-doelgroep', en: 'Early buyers and influencer audience' },
    objective: { nl: 'Eerste aankopen bij productlancering', en: 'First purchases at product launch' },
    conversion: { nl: 'Pre-order of aankoop', en: 'Pre-order or purchase' },
    description: {
      nl: 'Lanceringspagina gebouwd rond het pre-sale-moment, afgestemd op verkeer vanuit influencer- en social-campagnes.',
      en: 'A launch page built around the pre-sale moment, matched to traffic from influencer and social campaigns.',
    },
  },
]

export const portfolioCategories: { value: PortfolioItem['category'] | 'alle'; label: Bi<string> }[] = [
  { value: 'alle', label: { nl: 'Alle', en: 'All' } },
  { value: 'B2B', label: { nl: 'B2B leadgeneratie', en: 'B2B lead generation' } },
  { value: 'B2C', label: { nl: 'B2C booking', en: 'B2C booking' } },
  { value: 'ecommerce', label: { nl: 'Ecommerce', en: 'Ecommerce' } },
  { value: 'lokaal', label: { nl: 'Lokale campagnes', en: 'Local campaigns' } },
  { value: 'launch', label: { nl: 'Productlanceringen', en: 'Product launches' } },
]
