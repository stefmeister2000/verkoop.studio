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
    name: 'Jobr',
    category: 'Mobile app',
    url: 'https://lytestudios.be/projects/jobr/',
    image: '/partners/jobr.webp',
    description: {
      nl: 'Een mobiele app die kandidaten en werkgevers verbindt via matching, sollicitaties en chat.',
      en: 'A mobile app connecting candidates and employers through matching, applications and chat.',
    },
  },
  {
    name: 'WERKR',
    category: 'Software platform',
    url: 'https://lytestudios.be/projects/werkr/',
    image: '/partners/werkr.webp',
    logo: '/partners/werkr-logo.svg',
    description: {
      nl: 'Software voor de planning en uitvoering van opdrachten door flexibele medewerkers.',
      en: 'Software for scheduling and delivering assignments with a flexible workforce.',
    },
  },
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
  {
    name: 'Jobr',
    category: 'Website',
    url: 'https://lytestudios.be/projects/jobr-website/',
    image: '/partners/jobr-website.webp',
    description: {
      nl: 'Een marketingwebsite gericht op app-downloads en nieuwe werkgevers.',
      en: 'A marketing website focused on app downloads and employer sign-ups.',
    },
  },
]
