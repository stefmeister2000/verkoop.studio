import type { Bi } from './types'

/**
 * The running "gratis website" campaign, in one place.
 *
 * DRAFT. The run is decided: fourteen days, 6 to 19 November 2026. The scope
 * of the prize and who may enter are still assumptions. Change them here and
 * the landing page, the action rules and the entry form all follow.
 */
export const giveaway = {
  /** Also the CRM campaign name. Keep it in step with GIVEAWAY_CAMPAIGN in server-crm.js. */
  campaign: 'Verkoop Studio gratis website',
  /** Posted with every entry, so the server can tag the lead. Keep it in step with GIVEAWAY_FORM_ID. */
  formId: 'gratis-website-actie',
  path: '/gratis-website',
  /** Fourteen days. Machine-readable, for the rules and any ad copy that needs it. */
  opensOn: '2026-11-06',
  closesOn: '2026-11-19',
  runs: { nl: '6 tot en met 19 november 2026', en: '6 to 19 November 2026' } satisfies Bi<string>,
  closes: { nl: '19 november 2026', en: '19 November 2026' } satisfies Bi<string>,
  winnerAnnounced: { nl: 'binnen een week na 19 november', en: 'within a week of 19 November' } satisfies Bi<string>,

  seo: {
    title: { nl: 'Gratis website voor één bedrijf', en: 'A free website for one business' },
    description: {
      nl: 'Verkoop Studio bouwt één bedrijf gratis een nieuwe website. Doe mee tot 19 november 2026 en maak kans.',
      en: 'Verkoop Studio is building one business a new website for free. Enter before 19 November 2026.',
    },
  },

  hero: {
    eyebrow: { nl: 'Actie', en: 'Campaign' },
    title: { nl: 'We bouwen één bedrijf gratis een nieuwe website.', en: 'We’re building one business a new website, free.' },
    lead: {
      nl: 'Niet een template met een ander logo. Dezelfde aanpak als bij onze betalende klanten: we bekijken wat je verkoopt, voor wie, en bouwen daar een site rond die aanvragen oplevert. Eén deelnemer krijgt dat volledig gratis.',
      en: 'Not a template with a different logo. The same approach as for our paying clients: we look at what you sell and to whom, then build a site around that which brings in enquiries. One entrant gets it entirely free.',
    },
    cta: { nl: 'Doe mee', en: 'Enter now' },
    deadline: {
      nl: 'De actie loopt veertien dagen. Deelnemen kan tot en met 19 november 2026.',
      en: 'The campaign runs for fourteen days. You can enter until 19 November 2026.',
    },
    figureAlt: { nl: 'De webshop die we voor Pinacello bouwden', en: 'The online store we built for Pinacello' },
    figureCaption: {
      nl: 'Pinacello. Een van de sites die we dit jaar bouwden.',
      en: 'Pinacello. One of the sites we built this year.',
    },
  },

  /** What the winner gets. The scope of the prize, so keep this exact. */
  prize: {
    title: { nl: 'Wat de winnaar krijgt', en: 'What the winner gets' },
    intro: {
      nl: 'Een compacte, snelle site die één ding goed doet: bezoekers laten contact opnemen.',
      en: 'A compact, fast site that does one thing well: get visitors to make contact.',
    },
    items: {
      nl: [
        'Een strategiegesprek over je aanbod, je klanten en wat de site moet opleveren.',
        'Design en bouw van de site: een sterke homepagina met de secties die je nodig hebt.',
        'De teksten, geschreven voor jouw klant in plaats van voor jou.',
        'Basis-SEO, zodat je vindbaar bent op wat je verkoopt.',
        'Meting en formulieropvolging, zodat je ziet waar een aanvraag vandaan komt.',
      ],
      en: [
        'A strategy call about your offer, your customers and what the site has to deliver.',
        'Design and build: a strong homepage with the sections you need.',
        'The copy, written for your customer instead of for you.',
        'Basic SEO, so you are found for what you sell.',
        'Measurement and form follow-up, so you see where an enquiry came from.',
      ],
    },
    excluded: {
      nl: 'Hosting en domeinnaam blijven voor eigen rekening. Een webshop, een app of maatwerksoftware valt buiten deze actie.',
      en: 'Hosting and the domain name stay your own cost. A webshop, an app or custom software falls outside this campaign.',
    },
  },

  /** Real work, so an entrant can see what the prize looks like. Slugs come from cases.ts. */
  proof: {
    title: { nl: 'Dit is wat we bouwen', en: 'This is what we build' },
    body: {
      nl: 'Geen mockups. Deze sites staan online voor klanten die ervoor betaalden. De winnaar krijgt hetzelfde werk, zonder de factuur.',
      en: 'No mockups. These are live, for clients who paid for them. The winner gets the same work, without the invoice.',
    },
    cases: ['pinacello', 'nooms', 'healthfactor'] as const,
    view: { nl: 'Bekijk de case', en: 'View the case' },
  },

  steps: {
    title: { nl: 'Hoe het werkt', en: 'How it works' },
    items: {
      nl: [
        { title: 'Je doet mee', body: 'Vul het formulier in. Een paar velden over je bedrijf en één vraag waarom een nieuwe site bij jullie het verschil zou maken. Je hebt tot 19 november.' },
        { title: 'Wij kiezen', body: 'Na 19 november kiezen we één deelnemer. We kijken naar wat we voor dat bedrijf kunnen betekenen, niet naar wie het meest stemmen ophaalt.' },
        { title: 'Wij bouwen', body: 'De winnaar hoort het persoonlijk, binnen een week na de sluiting. Daarna starten we met het strategiegesprek en bouwen we de site.' },
      ],
      en: [
        { title: 'You enter', body: 'Fill in the form. A few fields about your business and one question on why a new site would make the difference for you. You have until 19 November.' },
        { title: 'We choose', body: 'After 19 November we pick one entrant. We look at what we can do for that business, not at who collects the most votes.' },
        { title: 'We build', body: 'The winner hears from us personally, within a week of closing. Then we start with the strategy call and build the site.' },
      ],
    },
  },

  /** Why the studio runs this. Said plainly, because entrants can tell. */
  why: {
    title: { nl: 'Waarom we dit doen', en: 'Why we do this' },
    photoAlt: { nl: 'Het team van Verkoop Studio', en: 'The Verkoop Studio team' },
    body: {
      nl: 'Een site die werkt, overtuigt beter dan een verkooppraatje. We bouwen deze site gratis omdat we er een case van willen maken: we vragen de winnaar om het resultaat met ons te mogen tonen. En we spreken graag met de bedrijven die meedoen, ook met wie niet gekozen wordt.',
      en: 'A site that works convinces better than a sales pitch. We build this one for free because we want to turn it into a case: we ask the winner for permission to show the result. And we are glad to speak with every business that enters, including the ones we do not pick.',
    },
  },

  form: {
    title: { nl: 'Doe mee aan de actie', en: 'Enter the campaign' },
    body: {
      nl: 'Vijf velden, plus je huidige site als je er een hebt. We lezen elke inzending zelf.',
      en: 'Five fields, plus your current site if you have one. We read every entry ourselves.',
    },
    photoAlt: { nl: 'Stef Keppens aan zijn laptop', en: 'Stef Keppens at his laptop' },
    who: { nl: 'Stef leest de inzendingen', en: 'Stef reads the entries' },
    where: { nl: 'Lochristi', en: 'Lochristi' },
  },

  /** The action rules. A contest in Belgium needs them written down and reachable. */
  rules: {
    title: { nl: 'Actievoorwaarden', en: 'Campaign rules' },
    notice: {
      nl: 'Deze voorwaarden zijn een eerste versie en nog niet juridisch nagekeken.',
      en: 'These rules are a first draft and have not been reviewed by a lawyer yet.',
    },
    items: {
      nl: [
        'De actie wordt georganiseerd door TanguyDeBee BV, Zilverbergstraat 176, 8800 Roeselare, ondernemingsnummer 1002.613.972, dat op deze site handelt onder de naam Verkoop Studio.',
        'De actie loopt veertien dagen: van 6 tot en met 19 november 2026. Deelnemen kan tot en met 19 november 2026 om 23.59 uur via het formulier op deze pagina. Een inzending na dat uur doet niet mee.',
        'Deelnemen is gratis en staat open voor elk bedrijf met een Belgisch ondernemingsnummer. Eén inzending per bedrijf. Medewerkers van Verkoop Studio en hun gezinsleden kunnen niet meedoen.',
        'Eén deelnemer wint. Verkoop Studio kiest de winnaar op inhoud: wat het bedrijf verkoopt, wat een nieuwe site daar kan veranderen en of de studio dat kan waarmaken. Dit is geen loterij en geen stemming.',
        'De winnaar wordt binnen een week na 19 november 2026 persoonlijk gecontacteerd op het opgegeven e-mailadres of telefoonnummer. Reageert de winnaar niet binnen zeven dagen, dan kiest de studio een andere deelnemer.',
        'De prijs is de website die hierboven beschreven staat. De prijs wordt niet in geld uitgekeerd en is niet overdraagbaar. Hosting, domeinnaam en materiaal dat de winnaar zelf aanlevert, vallen erbuiten.',
        'De winnaar werkt mee aan het strategiegesprek en levert tijdig teksten, beeldmateriaal en toegangen aan. Zonder die medewerking kan de studio de site niet opleveren.',
        'Verkoop Studio vraagt de winnaar om het resultaat als case te mogen tonen. De winnaar mag dat weigeren; dat kost hem de prijs niet.',
        'Wie meedoet, geeft Verkoop Studio toestemming om contact op te nemen over deze actie en over de diensten van de studio. Je gegevens worden behandeld zoals in het privacybeleid staat, en je kan je op elk moment afmelden.',
        'Verkoop Studio kan de actie stoppen of de voorwaarden wijzigen als dat nodig is. Dat wordt dan op deze pagina gezet.',
        'Op deze voorwaarden is het Belgisch recht van toepassing. Vragen gaan naar stef@verkoop.studio.',
      ],
      en: [
        'This campaign is run by TanguyDeBee BV, Zilverbergstraat 176, 8800 Roeselare, Belgium, enterprise number 1002.613.972, trading on this site as Verkoop Studio.',
        'The campaign runs for fourteen days: 6 to 19 November 2026. You can enter until 23:59 on 19 November 2026 through the form on this page. An entry after that moment does not take part.',
        'Entering is free and open to any business with a Belgian enterprise number. One entry per business. Verkoop Studio staff and their family members cannot enter.',
        'One entrant wins. Verkoop Studio picks the winner on substance: what the business sells, what a new site could change, and whether the studio can deliver that. This is not a lottery and not a vote.',
        'The winner is contacted personally within a week of 19 November 2026, on the email address or phone number given. If the winner does not respond within seven days, the studio picks another entrant.',
        'The prize is the website described above. It is not paid out in money and cannot be transferred. Hosting, the domain name and material the winner supplies fall outside it.',
        'The winner takes part in the strategy call and supplies copy, images and access in time. Without that the studio cannot deliver the site.',
        'Verkoop Studio asks the winner for permission to show the result as a case. The winner may refuse; that does not cost them the prize.',
        'By entering you allow Verkoop Studio to contact you about this campaign and about the studio’s services. Your data is handled as set out in the privacy policy, and you can opt out at any time.',
        'Verkoop Studio may end the campaign or change these rules if needed. Any change is published on this page.',
        'Belgian law applies to these rules. Questions go to stef@verkoop.studio.',
      ],
    },
  },
} as const
