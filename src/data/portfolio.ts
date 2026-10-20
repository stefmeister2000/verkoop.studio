import type { Bi, PortfolioItem } from './types'

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'olearys-b2c-booking',
    project: "O'Learys: B2C booking landing page",
    caseSlug: 'olearys',
    liveUrl: 'https://olearys.com/nl-be/',
    category: 'B2C',
    audience: {
      nl: 'Consumenten die een activiteit of avondje uit boeken',
      en: 'Consumers booking an activity or a night out',
    },
    objective: { nl: 'Meer voltooide boekingen per activiteit', en: 'More completed bookings per activity' },
    conversion: { nl: 'Boeking starten', en: 'Start a booking' },
    description: {
      nl: 'Landingspagina per activiteit, opgebouwd rond één duidelijke boekingsstap in plaats van een breed activiteitenoverzicht.',
      en: 'A landing page per activity, built around one clear booking step instead of a broad activity overview.',
    },
  },
  {
    id: 'olearys-b2b-events',
    project: "O'Learys: B2B company-event page",
    caseSlug: 'olearys',
    liveUrl: 'https://olearys.com/nl-be/',
    category: 'B2B',
    audience: {
      nl: 'Bedrijven die een teamevent of bedrijfsfeest organiseren',
      en: 'Companies organising a team event or company party',
    },
    objective: { nl: 'Meer gekwalificeerde B2B-aanvragen', en: 'More qualified B2B enquiries' },
    conversion: { nl: 'Offerte aanvragen', en: 'Request a quote' },
    description: {
      nl: 'Aparte pagina met een zakelijk beslistraject: arrangementen, capaciteit en een directe offerte-aanvraag.',
      en: 'A separate page with a business decision path: packages, capacity and a direct quote request.',
    },
  },
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
