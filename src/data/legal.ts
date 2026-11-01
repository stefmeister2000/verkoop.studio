import type { Bi } from './types'

/**
 * Placeholder legal copy. Replace `notice` and `sections` with the policy
 * you want to publish. Routes, footer links and the page layout can stay.
 */
export interface LegalSection {
  title: Bi<string>
  paragraphs: Bi<string[]>
}

export interface LegalDocument {
  path: '/privacy' | '/voorwaarden'
  title: Bi<string>
  description: Bi<string>
  updated: Bi<string>
  notice: Bi<string>
  sections: LegalSection[]
}

export const legalDocuments = {
  privacy: {
    path: '/privacy',
    title: { nl: 'Privacybeleid', en: 'Privacy policy' },
    description: {
      nl: 'Voorlopige privacytekst van Verkoop Studio in Lochristi. De definitieve privacyverklaring volgt.',
      en: 'Draft privacy text for Verkoop Studio in Lochristi. The final privacy policy will replace this page.',
    },
    updated: { nl: 'Voorlopige versie · 1 november 2026', en: 'Draft · 1 November 2026' },
    notice: {
      nl: 'Dit is een voorlopige tekst. Hij legt nog niet vast welke gegevens Verkoop Studio verwerkt. Het definitieve privacybeleid volgt.',
      en: 'This is a draft. It does not yet say which data Verkoop Studio processes. The final privacy policy will replace it.',
    },
    sections: [
      {
        title: { nl: 'Voor wie deze tekst is', en: 'Who this text is for' },
        paragraphs: {
          nl: ['Deze plaatsaanduiding hoort bij de site verkoop.studio van Verkoop Studio in Lochristi. Ze gaat over bezoekers van deze site. Ze is niet het privacybeleid van een klantproject.'],
          en: ['This placeholder belongs to verkoop.studio, the site of Verkoop Studio in Lochristi. It is about visitors to this site. It is not the privacy policy of a client project.'],
        },
      },
      {
        title: { nl: 'Welke gegevens', en: 'Which data' },
        paragraphs: {
          nl: ['De definitieve tekst somt de gegevens op die formulieren, de nieuwsbrief en de meting van de site verzamelen. Deze versie doet dat nog niet.'],
          en: ['The final text will list the data that forms, the newsletter and site measurement collect. This version does not.'],
        },
      },
      {
        title: { nl: 'Waarvoor', en: 'Why' },
        paragraphs: {
          nl: ['De definitieve tekst zegt waarvoor elk gegeven dient, bijvoorbeeld om een aanvraag te beantwoorden of om het gebruik van de site te begrijpen. Deze versie legt geen doel vast.'],
          en: ['The final text will say what each piece of data is for, such as answering an enquiry or understanding how the site is used. This version sets no purpose.'],
        },
      },
      {
        title: { nl: 'Wie ze ontvangt', en: 'Who receives it' },
        paragraphs: {
          nl: ['De definitieve tekst noemt de diensten die gegevens voor de site verwerken, zoals hosting, e-mail en meting. Deze versie noemt geen verwerkers.'],
          en: ['The final text will name the services that process data for the site, such as hosting, email and measurement. This version names no processors.'],
        },
      },
      {
        title: { nl: 'Hoe lang', en: 'How long' },
        paragraphs: {
          nl: ['Bewaartermijnen staan in de definitieve tekst. Deze versie legt geen termijn vast.'],
          en: ['Retention periods belong in the final text. This version sets no period.'],
        },
      },
      {
        title: { nl: 'Jouw vragen', en: 'Your questions' },
        paragraphs: {
          nl: ['Een vraag over je gegevens kan je sturen naar stef@verkoop.studio. Hoe een vraag om inzage, verbetering of verwijdering wordt behandeld, staat in de definitieve tekst.'],
          en: ['You can send a question about your data to stef@verkoop.studio. How a request for access, correction or deletion is handled belongs in the final text.'],
        },
      },
    ],
  },
  terms: {
    path: '/voorwaarden',
    title: { nl: 'Algemene voorwaarden', en: 'Terms of service' },
    description: {
      nl: 'Voorlopige voorwaarden van Verkoop Studio. Een opdracht staat in een voorstel, niet in deze tekst.',
      en: 'Draft terms for Verkoop Studio. A project is agreed in a proposal, not on this page.',
    },
    updated: { nl: 'Voorlopige versie · 1 november 2026', en: 'Draft · 1 November 2026' },
    notice: {
      nl: 'Dit is een voorlopige tekst. Ze is geen contract. Een opdracht wordt vastgelegd in een voorstel dat je aanvaardt.',
      en: 'This is a draft. It is not a contract. A project is set out in a proposal you accept.',
    },
    sections: [
      {
        title: { nl: 'Voor wie', en: 'Who this is for' },
        paragraphs: {
          nl: ['Deze plaatsaanduiding hoort bij verkoop.studio. Ze vervangt geen voorstel en geldt niet als de voorwaarden van een klantproject.'],
          en: ['This placeholder belongs to verkoop.studio. It does not replace a proposal and it is not the terms of a client project.'],
        },
      },
      {
        title: { nl: 'Een opdracht', en: 'A project' },
        paragraphs: {
          nl: ['Een prijs of pakket op de site is geen aanvaarde opdracht. De samenwerking start wanneer jij en Verkoop Studio het voorstel aanvaarden.'],
          en: ['A price or plan on the site is not an accepted project. The work starts when you and Verkoop Studio accept the proposal.'],
        },
      },
      {
        title: { nl: 'Wat we doen', en: 'What we do' },
        paragraphs: {
          nl: ['Wat er gebeurt, wanneer, en wat jij aanlevert, staat in dat voorstel. Deze pagina voegt daar niets aan toe.'],
          en: ['What happens, when, and what you provide is set out in that proposal. This page adds nothing to it.'],
        },
      },
      {
        title: { nl: 'Betaling', en: 'Payment' },
        paragraphs: {
          nl: ['Facturen en betalingstermijnen staan in het voorstel. Deze tekst legt geen termijn, voorschot of rente vast.'],
          en: ['Invoices and payment terms are in the proposal. This text sets no due date, deposit or interest.'],
        },
      },
      {
        title: { nl: 'Aansprakelijkheid', en: 'Liability' },
        paragraphs: {
          nl: ['Deze plaatsaanduiding beperkt of verruimt geen aansprakelijkheid. Dat hoort in de definitieve voorwaarden en in het voorstel.'],
          en: ['This placeholder does not limit or expand liability. That belongs in the final terms and in the proposal.'],
        },
      },
      {
        title: { nl: 'Einde', en: 'Ending the work' },
        paragraphs: {
          nl: ['Hoe een opdracht stopt, staat in het voorstel. Deze tekst legt geen opzegtermijn vast.'],
          en: ['How a project ends is set out in the proposal. This text sets no notice period.'],
        },
      },
      {
        title: { nl: 'Contact', en: 'Contact' },
        paragraphs: {
          nl: ['Vragen over deze tekst kan je sturen naar stef@verkoop.studio.'],
          en: ['Questions about this text can go to stef@verkoop.studio.'],
        },
      },
    ],
  },
} satisfies Record<string, LegalDocument>

export type LegalSlug = keyof typeof legalDocuments

export const legalPaths = Object.values(legalDocuments).map((document) => document.path)

export function isLegalPath(pathname: string) {
  return (legalPaths as readonly string[]).includes(pathname)
}
