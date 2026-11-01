import type { Bi } from './types'

// Matches the public site as of 1 November 2026. Not a substitute for advice on a client project.
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
      nl: 'Privacybeleid van Verkoop Studio voor bezoekers en aanvragen op verkoop.studio.',
      en: 'Privacy policy of Verkoop Studio for visitors and enquiries on verkoop.studio.',
    },
    updated: { nl: '1 november 2026', en: '1 November 2026' },
    notice: {
      nl: 'Dit beleid gaat over bezoekers van verkoop.studio en over mensen die de studio schrijven. Het is niet het privacybeleid van de klanten van een klant.',
      en: 'This policy covers visitors to verkoop.studio and people who write to the studio. It is not the privacy policy of a client’s own customers.',
    },
    sections: [
      {
        title: { nl: 'Verantwoordelijke', en: 'Who is responsible' },
        paragraphs: {
          nl: [
            'Verkoop Studio in Lochristi, België, is verantwoordelijk voor deze site. Je bereikt de studio via stef@verkoop.studio. Een straatadres staat niet op de site.',
            'Het beleid gaat over deze website en over aanvragen aan de studio. Het is niet het privacybeleid van de webshop, het advertentieaccount of het CRM van een klant.',
          ],
          en: [
            'Verkoop Studio in Lochristi, Belgium, is responsible for this site. You reach the studio at stef@verkoop.studio. No street address is published.',
            'The policy is about this website and about enquiries to the studio. It is not the privacy policy of a customer’s shop, ads account or CRM.',
          ],
        },
      },
      {
        title: { nl: 'Contactformulier', en: 'Contact form' },
        paragraphs: {
          nl: [
            'Op /contact zijn naam, e-mailadres, telefoon, doel en uitdaging verplicht. Bedrijf, website, beschikbaar budget, kanalen, timing en een extra notitie zijn optioneel. Meegestuurd worden een inzending-id, een formulier-id, de taal en de campagneherkomst: UTM, de verwijzer, en een LinkedIn-klik-id als die er is. Wanneer ze beschikbaar zijn, gaan ook de client-id en de sessie-id van Google Analytics mee. Een verborgen spamveld telt niet als persoonsgegeven.',
            'Je vraagt zelf om een antwoord en om opvolging van een mogelijke opdracht, vóór een contract. De site zegt dat de studio binnen 24 uur antwoordt per e-mail of telefoon. Resend bewaart het contact in een segment, stuurt een melding aan de studio en een bevestiging aan jou, en start een opvolging tenzij je uitgeschreven bent. Dezelfde aanvraag gaat ook naar het CRM van de studio wanneer die koppeling aanstaat.',
          ],
          en: [
            'On /contact, name, email address, phone, goal and challenge are required. Company, website, available budget, channels, timing and an extra note are optional. A submission id, a form id, the language and the campaign source are sent too: UTM, the referrer, and a LinkedIn click id when there is one. When they are available, the Google Analytics client id and session id go with the enquiry. A hidden spam field does not count as a person’s data.',
            'You ask for an answer and for follow-up on a possible project, before a contract. The site says the studio replies within 24 hours by email or phone. Resend stores the contact in a segment, sends a notification to the studio and a confirmation to you, and starts a follow-up unless you have unsubscribed. The same enquiry also goes to the studio’s CRM when that connection is on.',
          ],
        },
      },
      {
        title: { nl: 'Nieuwsbrief', en: 'Newsletter' },
        paragraphs: {
          nl: [
            'De nieuwsbrief op de site en in de footer van de academy vraagt je e-mailadres, een expliciet vak voor toestemming, en je taal. Resend bewaart dat adres met die toestemming, in een segment.',
            'Dit steunt op je toestemming. Je trekt ze in via stef@verkoop.studio. Via dat adres, en via deze pagina, vraag je ook inzage of verwijdering.',
          ],
          en: [
            'The newsletter on the site and in the academy footer asks for your email address, an explicit consent tick, and your language. Resend stores that address with that consent, in a segment.',
            'This relies on your consent. You withdraw it by emailing stef@verkoop.studio. You use that address, and this page, to ask for access or deletion too.',
          ],
        },
      },
      {
        title: { nl: 'Academy', en: 'Academy' },
        paragraphs: {
          nl: [
            'Voor de academy zijn naam, e-mailadres en telefoon verplicht. Waar het formulier erom vraagt, zijn bedrijf, website, je niveau met Meta ads, het maandelijkse advertentiebudget, een vraag en een apart nieuwsbriefvak optioneel. Het doel is de kennismaking die je vroeg, en de opvolging daarvan. Er gaat een welkomstmail uit. De aanmelding kan in het CRM staan wanneer die koppeling aanstaat.',
            'Het infovenster van de academy vraagt alleen een e-mailadres en stuurt één informatiemail. Dat is geen nieuwsbrief en het maakt geen belafspraak.',
          ],
          en: [
            'For the academy, name, email address and phone are required. Where the form asks for them, company, website, your level with Meta ads, the monthly ad budget, a question and a separate newsletter tick are optional. The purpose is the introductory call you asked for, and follow-up on that request. A welcome email is sent. The signup can be stored in the CRM when that connection is on.',
            'The academy information popup asks for an email address only and sends one information email. It is not a newsletter and it does not book a call.',
          ],
        },
      },
      {
        title: { nl: 'Meting', en: 'Measurement' },
        paragraphs: {
          nl: [
            'De site vraagt geen cookietoestemming voordat deze tools starten. Ze dienen om bezoeken, advertenties en paginagebruik te begrijpen. Meta Pixel stuurt een PageView bij het laden, en een Lead-event pas na een bevestigde formulierinzending, zonder contactgegevens. Google Analytics 4 draait op twee properties. Microsoft Clarity start nadat de pagina geladen is. Clarity schermt de chat, de nieuwsbrief en de academyformulieren af. Het contactformulier niet. Current, het eigen meetscript van de studio op perfomance.verkoop.studio, stuurt bij een lead alleen een formulier-id en de methode.',
            'De FAQ-chat antwoordt in de browser vanuit de pagina’s van de site. Het gesprek wordt niet op de server van de studio bewaard. YouTube-video’s gebruiken het domein youtube-nocookie. De speler in de hero laadt pas als je op afspelen drukt. De andere video’s op de homepage laden met de pagina. De browser onthoudt de gekozen taal, de campagneherkomst voor een aanvraag, of het nieuwsbriefpaneel is weggeklikt, de staat van het academy-venster, en een sessievlag zodat dezelfde lead niet twee keer telt.',
          ],
          en: [
            'The site does not ask for cookie consent before these tools run. They are there to understand visits, ads and how pages are used. Meta Pixel sends a PageView on load, and a Lead event only after a confirmed form capture, without contact details. Google Analytics 4 runs on two properties. Microsoft Clarity starts after the page has loaded. Clarity masks the chat, the newsletter and the academy forms. It does not mask the contact form. Current, the studio’s own measurement script at perfomance.verkoop.studio, sends only a form id and the method with a lead.',
            'The FAQ chat answers in the browser from the site’s own pages. The conversation is not stored on the studio’s server. YouTube videos use the youtube-nocookie domain. The hero player loads only after you press play. The other videos on the homepage load with the page. The browser stores the chosen language, the campaign source for an enquiry, whether the newsletter panel was dismissed, the academy popup state, and a session flag so the same lead is not counted twice.',
          ],
        },
      },
      {
        title: { nl: 'Bewaren en jouw rechten', en: 'Keeping data and your rights' },
        paragraphs: {
          nl: [
            'Gegevens van een aanvraag of van de academy blijven bewaard zolang de studio nog opvolgt, en zolang dat nodig is om later een vraag over die aanvraag te beantwoorden. Nieuwsbriefgegevens blijven tot je uitschrijft of om verwijdering vraagt. Meetgegevens blijven volgens de instellingen van die tools.',
            'Verkoop Studio deelt gegevens met Resend voor e-mail en contacten, met het eigen CRM wanneer een formulier gekoppeld is, met Meta, Google, Microsoft en Current voor de meting, en met YouTube wanneer een video laadt. Voor inzage, verbetering, verwijdering of bezwaar mail je stef@verkoop.studio. De studio antwoordt op dat verzoek. Je kunt ook een klacht indienen bij de Gegevensbeschermingsautoriteit in België.',
          ],
          en: [
            'Enquiry and academy details are kept while the studio is still following up, and for as long as needed to answer a later question about that request. Newsletter details are kept until you unsubscribe or ask for deletion. Measurement data is kept under the settings of those tools.',
            'Verkoop Studio shares data with Resend for email and contacts, with its own CRM when a form is connected, with Meta, Google, Microsoft and Current for measurement, and with YouTube when a video loads. For access, correction, deletion or objection you email stef@verkoop.studio. The studio replies to that request. You can also complain to the Gegevensbeschermingsautoriteit in Belgium.',
          ],
        },
      },
    ],
  },
  terms: {
    path: '/voorwaarden',
    title: { nl: 'Algemene voorwaarden', en: 'Terms of service' },
    description: {
      nl: 'Algemene voorwaarden van Verkoop Studio voor werk dat start via verkoop.studio.',
      en: 'Terms of service of Verkoop Studio for work that starts on verkoop.studio.',
    },
    updated: { nl: '1 november 2026', en: '1 November 2026' },
    notice: {
      nl: 'Prijzen op deze site zijn geen contract. Een opdracht start wanneer jij en Verkoop Studio een voorstel allebei aanvaarden.',
      en: 'Prices on this site are not a contract. A job starts when you and Verkoop Studio both accept a proposal.',
    },
    sections: [
      {
        title: { nl: 'Deze pagina', en: 'This page' },
        paragraphs: {
          nl: [
            'Dit zijn de voorwaarden voor werk met Verkoop Studio. Ze zijn niet de voorwaarden van de klanten van een klant, en ze zijn niet het privacybeleid op /privacy.',
            'De site beschrijft het werk van de studio. Een pagina, een prijs of een pakket is geen bindend aanbod en geen aanvaarde opdracht.',
          ],
          en: [
            'These are the terms for working with Verkoop Studio. They are not the terms of a client’s own customers, and they are not the privacy policy at /privacy.',
            'The site describes the studio’s work. A page, a price or a plan is not a binding offer and not an accepted job.',
          ],
        },
      },
      {
        title: { nl: 'Prijzen', en: 'Prices' },
        paragraphs: {
          nl: [
            'Growth Foundation kost €1.500 per maand voor de volledige aanpak zonder videoshoots. Growth Partner kost €2.500 per maand en voegt videoshoots toe. Growth Department kost €4.000 per maand en voegt een wekelijks overleg toe.',
            'De site zegt niet of btw in die bedragen zit. Advertentiebudget betaal je aan het advertentieplatform, niet aan Verkoop Studio als deel van dat bedrag. Websites, webshops, apps en software op maat kunnen aparte projecten zijn. Het sales CRM en het marketingdashboard zitten in een pakket, zonder aparte publieke abonnementsprijs. Scope, advertentiebudget en licenties van derden staan in het voorstel.',
          ],
          en: [
            'Growth Foundation costs €1,500 per month for the full approach without video shoots. Growth Partner costs €2,500 per month and adds video shoots. Growth Department costs €4,000 per month and adds a weekly meeting.',
            'The site does not say whether VAT is included in those amounts. Ad spend is paid to the ad platform, not to Verkoop Studio as part of that fee. Websites, webshops, apps and custom software can be separate projects. The sales CRM and the marketing dashboard are included in a plan, with no separate public subscription price. Scope, ad budget and third-party licences are set in the proposal.',
          ],
        },
      },
      {
        title: { nl: 'Een opdracht', en: 'A job' },
        paragraphs: {
          nl: [
            'Een opdracht bestaat alleen wanneer jij en Verkoop Studio het voorstel allebei aanvaarden. Het voorstel bepaalt de scope, de prijs, de betaling, de licenties en hoe het werk stopt.',
            'Deze pagina legt geen vervaldag, geen voorschot, geen rente en geen opzegtermijn vast.',
          ],
          en: [
            'A job exists only when you and Verkoop Studio both accept the proposal. The proposal sets the scope, the fee, the payment, the licences and how the work stops.',
            'This page does not set a due date, a deposit, interest or a notice period.',
          ],
        },
      },
      {
        title: { nl: 'Wat jij aanlevert', en: 'What you provide' },
        paragraphs: {
          nl: [
            'Je geeft juiste informatie en de toegang die het werk nodig heeft, zoals advertentieaccounts, de site en tracking, wanneer het voorstel dat zegt.',
            'Werk dat voor jou gemaakt is, wordt overgedragen zoals het voorstel beschrijft. Tot de afgesproken facturen voor dat werk betaald zijn, houdt Verkoop Studio de rechten op dat werk.',
          ],
          en: [
            'You give accurate information and the access the work needs, such as ad accounts, the site and tracking, when the proposal says so.',
            'Work made for you is handed over as the proposal describes. Until the agreed invoices for that work are paid, Verkoop Studio keeps the rights in that work.',
          ],
        },
      },
      {
        title: { nl: 'Aansprakelijkheid', en: 'Liability' },
        paragraphs: {
          nl: [
            'Verkoop Studio is niet aansprakelijk voor het resultaat van een advertentieplatform, voor jouw eigen cijfers, of voor een beslissing die jij neemt uit een rapport.',
            'Belgisch recht geldt. Een geschil gaat naar de rechtbanken van Oost-Vlaanderen.',
          ],
          en: [
            'Verkoop Studio is not liable for the result of an ad platform, for your own numbers, or for a decision you make from a report.',
            'Belgian law applies. A dispute goes to the courts of East Flanders.',
          ],
        },
      },
      {
        title: { nl: 'Taal en contact', en: 'Language and contact' },
        paragraphs: {
          nl: [
            'Bij een verschil geldt de Nederlandse tekst boven de Engelse vertaling. Vragen over deze pagina stuur je naar stef@verkoop.studio.',
          ],
          en: [
            'Where they differ, the Dutch text prevails over the English translation. Questions about this page go to stef@verkoop.studio.',
          ],
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
