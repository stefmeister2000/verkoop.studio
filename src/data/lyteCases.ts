import type { Bi } from './types'
export interface LyteCase {
  name: string
  category: string
  image: string
  logo?: string
  url: string
  description: Bi<string>
}
export const lyteCases: LyteCase[] = [
  {
    name: 'EONLOG',
    category: 'Website',
    url: 'https://lytestudios.be/projects/eonlog-website/',
    image: '/partners/eonlog-website.webp',
    description: {
      nl: 'Een website die de investeringsaanpak van een family office uitlegt.',
      en: 'A website explaining the investment approach of a family office.',
    },
  },
]
