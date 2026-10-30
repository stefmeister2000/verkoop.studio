export type Lang = 'nl' | 'en'
export type Bi<T> = Record<Lang, T>

export type ServiceSlug =
  | 'email-marketing'
  | 'data-analytics'
  | 'websites'
  | 'software'
  | 'landing-pages'
  | 'funnels'
  | 'meta-ads'
  | 'google-ads'
  | 'ecommerce-conversie'
  | 'ai-automatiseringen'
  | 'distributie'

export interface Service {
  slug: ServiceSlug
  number: string
  title: Bi<string>
  summary: Bi<string>
  includes: Bi<string[]>
  problem: Bi<string>
  process: Bi<string[]>
  deliverables: Bi<string[]>
  relatedCase?: CaseSlug
  partnerCase?: { name: string; url: string; description: Bi<string> }
}

export type CaseSlug = 'pinacello' | 'e-kart' | 'nooms'

export interface CaseStudy {
  slug: CaseSlug
  name: string
  sector: Bi<string>
  status: 'ongoing' | 'afgerond'
  summary: Bi<string>
  situation: Bi<string>
  challenge: Bi<string>
  role: Bi<string>
  builtLabel?: Bi<string>
  built: Bi<string[]>
  measurement: Bi<string>
  objective: Bi<string>
  image?: string
  video?: string
  videoCaption?: Bi<string>
  comingSoon?: boolean
  unavailable?: boolean
  liveUrl?: string
}

export interface Client {
  name: string
  description: Bi<string>
  image?: string
}

export interface PortfolioItem {
  id: string
  project: string
  caseSlug: CaseSlug
  category: 'B2B' | 'B2C' | 'ecommerce' | 'lokaal' | 'launch'
  audience: Bi<string>
  objective: Bi<string>
  conversion: Bi<string>
  description: Bi<string>
  liveUrl?: string
}

export interface AIFlow {
  title: Bi<string>
  steps: Bi<string[]>
}

export interface ProcessStep {
  number: string
  title: Bi<string>
  description: Bi<string>
}

export interface FaqItem {
  question: Bi<string>
  answer: Bi<string>
}
