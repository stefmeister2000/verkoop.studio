import type { Client } from './types'
import pinacello from '../assets/cases/pinacello.webp'
import nooms from '../assets/cases/nooms.webp'
import ekart from '../assets/cases/ekart.webp'

export const clients: Client[] = [
  {
    name: 'Pinacello',
    image: pinacello,
    description: {
      nl: 'Ik werk aan de ecommerce en digitale groeikant van Pinacello, waaronder campagnes, landingspagina’s, conversie en online verkoop.',
      en: 'I work on the ecommerce and digital growth side of Pinacello, including campaigns, landing pages, conversion and online sales.',
    },
  },
  {
    name: 'Nooms',
    image: nooms,
    description: {
      nl: 'Nooms is mijn eigen bedrijf. Ik bouw het zelf op, met focus op ecommerce, funnels, branding, verkoop en digitale groei.',
      en: 'Nooms is my own company. I’m building it myself, focused on ecommerce, funnels, branding, sales and digital growth.',
    },
  },
  {
    name: 'E-Kart',
    image: ekart,
    description: {
      nl: 'Ik werk aan de digitale groei van E-Kart, de snelste indoor karting in Gent, zowel aan de B2C- als de B2B-kant, om meer klanten en boekingen te behalen.',
      en: 'I work on the digital growth of E-Kart, the fastest indoor karting in Ghent, on both the B2C and B2B side, to win more customers and bookings.',
    },
  },
]
