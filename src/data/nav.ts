import type { Bi } from './types'

export interface NavItem {
  label: Bi<string>
  href: string
}

const academy: NavItem = { label: { nl: 'Academy', en: 'Academy' }, href: '/academy' }

export const navItems: NavItem[] = [
  { label: { nl: 'Home', en: 'Home' }, href: '/' },
  { label: { nl: 'Resultaten', en: 'Results' }, href: '/#resultaten' },
  { label: { nl: 'Diensten', en: 'Services' }, href: '/#expertise' },
  { label: { nl: 'Cases', en: 'Cases' }, href: '/cases' },
  { label: { nl: 'Agency', en: 'Agency' }, href: '/agency' },
  { label: { nl: 'Contact', en: 'Contact' }, href: '/contact' },
]

/** Academy stays reachable from the footer. It is not a top-bar item. */
const agencyIndex = navItems.findIndex((item) => item.href === '/agency')
export const footerNavItems: NavItem[] = [
  ...navItems.slice(0, agencyIndex),
  academy,
  ...navItems.slice(agencyIndex),
]

export const persistentCta: Bi<string> = { nl: 'Bespreek je project', en: 'Discuss your project' }
export const persistentCtaHref = '/contact'
