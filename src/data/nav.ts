import type { Bi } from './types'

export interface NavItem {
  label: Bi<string>
  href: string
}

export const navItems: NavItem[] = [
  { label: { nl: 'Home', en: 'Home' }, href: '/' },
  { label: { nl: 'Resultaten', en: 'Results' }, href: '/#resultaten' },
  { label: { nl: 'Diensten', en: 'Services' }, href: '/#expertise' },
  { label: { nl: 'Cases', en: 'Cases' }, href: '/cases' },
  { label: { nl: 'Academy', en: 'Academy' }, href: '/academy' },
  { label: { nl: 'Agency', en: 'Agency' }, href: '/agency' },
  { label: { nl: 'Contact', en: 'Contact' }, href: '/contact' },
]

export const persistentCta: Bi<string> = { nl: 'Bespreek je project', en: 'Discuss your project' }
export const persistentCtaHref = '/contact'
