import type { Bi } from './types'

export type TierKey = 'foundation' | 'partner' | 'department'

export interface PricingTier {
  key: TierKey
  name: Bi<string>
  price: Bi<string>
  audience: Bi<string>
  highlights: Bi<string[]>
}

export interface AddOn {
  key: string
  name: Bi<string>
  price?: Bi<string>
  description: Bi<string>
  href?: string
}

export const addOns: AddOn[] = [
  {
    key: 'learning-track',
    name: { nl: 'Meta Ads Academy', en: 'Meta Ads Academy' },
    price: { nl: 'Bekijk de lessen', en: 'Explore the lessons' },
    description: {
      nl: 'Leer zelf Meta ads beheren, 1-op-1 met Stef.',
      en: 'Learn to manage Meta ads yourself, one-to-one with Stef.',
    },
    href: '/academy',
  },
]

export const pricingTiers: PricingTier[] = [
  {
    key: 'foundation',
    name: { nl: 'Growth Foundation', en: 'Growth Foundation' },
    price: { nl: '€1.500 / maand', en: '€1,500 / month' },
    audience: {
      nl: 'Voor bedrijven die de volledige aanpak willen, zonder videoshoots.',
      en: 'For businesses that want the full scope, without video shoots.',
    },
    highlights: {
      nl: [
        'Strategie, campagnes en rapportage',
        'Landingspagina’s, e-mail en SEO',
        'CRM, dashboard en documentatie',
        'Geen videoshoots',
      ],
      en: [
        'Strategy, campaigns and reporting',
        'Landing pages, email and SEO',
        'CRM, dashboard and documentation',
        'No video shoots',
      ],
    },
  },
  {
    key: 'partner',
    name: { nl: 'Growth Partner', en: 'Growth Partner' },
    price: { nl: '€2.500 / maand', en: '€2,500 / month' },
    audience: {
      nl: 'Voor bedrijven die dezelfde aanpak willen, inclusief videoshoots.',
      en: 'For businesses that want the same scope, including video shoots.',
    },
    highlights: {
      nl: [
        'Alles uit Foundation',
        'Videoshoots inbegrepen',
      ],
      en: [
        'Everything in Foundation',
        'Video shoots included',
      ],
    },
  },
  {
    key: 'department',
    name: { nl: 'Growth Department', en: 'Growth Department' },
    price: { nl: '€4.000 / maand', en: '€4,000 / month' },
    audience: {
      nl: 'Voor bedrijven die daarbij ook een wekelijks overleg willen.',
      en: 'For businesses that also want a weekly meeting.',
    },
    highlights: {
      nl: [
        'Alles uit Partner',
        'Wekelijks overleg',
      ],
      en: [
        'Everything in Partner',
        'Weekly meeting',
      ],
    },
  },
]

type Cell = { type: 'check' } | { type: 'dash' } | { type: 'text'; label: Bi<string> }

export interface FeatureRow {
  label: Bi<string>
  values: [Cell, Cell, Cell]
}

const check: Cell = { type: 'check' }
const dash: Cell = { type: 'dash' }

export const featureRows: FeatureRow[] = [
  { label: { nl: 'Growth-strategie', en: 'Growth strategy' }, values: [check, check, check] },
  { label: { nl: 'Meta Ads-beheer', en: 'Meta Ads management' }, values: [check, check, check] },
  { label: { nl: 'Google Ads-beheer', en: 'Google Ads management' }, values: [check, check, check] },
  { label: { nl: 'Tracking & analytics', en: 'Tracking & analytics' }, values: [check, check, check] },
  { label: { nl: 'Maandelijkse rapportage', en: 'Monthly reporting' }, values: [check, check, check] },
  { label: { nl: 'Landingspagina’s', en: 'Landing pages' }, values: [check, check, check] },
  { label: { nl: 'E-mailmarketing', en: 'Email marketing' }, values: [check, check, check] },
  { label: { nl: 'SEO', en: 'SEO' }, values: [check, check, check] },
  { label: { nl: 'CRM en marketingdashboard', en: 'CRM and marketing dashboard' }, values: [check, check, check] },
  { label: { nl: 'Documentatie en instructievideo’s', en: 'Documentation and video guides' }, values: [check, check, check] },
  { label: { nl: 'Videoshoots', en: 'Video shoots' }, values: [dash, check, check] },
  { label: { nl: 'Wekelijks overleg', en: 'Weekly meeting' }, values: [dash, dash, check] },
]
