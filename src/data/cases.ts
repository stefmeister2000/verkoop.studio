import type { CaseStudy } from './types'
import olearys from '../assets/cases/olearys.webp'
import nooms from '../assets/cases/nooms.webp'
import pinacello from '../assets/cases/pinacello.webp'
import ekart from '../assets/cases/ekart.webp'

export const cases: CaseStudy[] = [
  {
    slug: 'olearys',
    name: "O'Learys",
    sector: { nl: 'Hospitality en entertainment', en: 'Hospitality and entertainment' },
    status: 'ongoing',
    image: olearys,
    liveUrl: 'https://olearys.com/nl-be/',
    summary: {
      nl: 'Van één website voor iedereen naar aparte, duidelijke beslistrajecten voor B2C-bezoekers en B2B-organisatoren.',
      en: 'From one website for everyone to separate, clear decision paths for B2C visitors and B2B organisers.',
    },
    situation: {
      nl: 'O’Learys biedt een breed aanbod aan activiteiten, arrangementen en doelgroepen, van een avondje bowling met vrienden tot een volledig bedrijfsevent. Die breedte is een sterkte, maar maakt het ook lastig voor een bezoeker om snel de juiste keuze te maken.',
      en: 'O’Learys offers a wide range of activities, packages and audiences, from a night of bowling with friends to a full corporate event. That breadth is a strength, but it also makes it harder for a visitor to quickly find the right choice.',
    },
    challenge: {
      nl: 'De website bevat veel activiteiten, arrangementen en doelgroepen, maar B2C-bezoekers en zakelijke organisatoren hebben elk een ander beslistraject nodig.',
      en: 'The website contains many activities, packages and audiences, but B2C visitors and business organisers each need a different decision journey.',
    },
    role: {
      nl: 'Ik werk aan de online digitale kant van O’Learys: B2C- en B2B-landingspagina’s, funnels, campagnes, tracking en conversie.',
      en: 'I work on the digital side of O’Learys: B2C and B2B landing pages, funnels, campaigns, tracking and conversion.',
    },
    built: {
      nl: [
        'B2C landingpagina-structuur',
        'B2B-pagina voor bedrijfsevents',
        'Arrangement- en occasion-flows',
        'Booking- en offerte-CTA’s',
        'Vertrouwenselementen en sociale bewijskracht in de structuur',
        'Afstemming van Meta- en Google-campagnes op de juiste pagina',
        'Trackingstructuur',
        'Strategie voor e-mailflows',
      ],
      en: [
        'B2C landing-page structure',
        'B2B page for company events',
        'Package and occasion flows',
        'Booking and proposal CTAs',
        'Trust elements and social proof built into the structure',
        'Alignment of Meta and Google campaigns to the right page',
        'Tracking structure',
        'Email-flow strategy',
      ],
    },
    measurement: {
      nl: 'Meer voltooide boekingen, meer gekwalificeerde B2B-aanvragen en duidelijkere meting van campagne tot omzet.',
      en: 'More completed bookings, more qualified B2B enquiries, and clearer measurement from campaign to revenue.',
    },
    objective: {
      nl: 'Meer voltooide boekingen, meer gekwalificeerde B2B-aanvragen en duidelijkere meting van campagne tot omzet.',
      en: 'More completed bookings, more qualified B2B enquiries, and clearer measurement from campaign to revenue.',
    },
  },
  {
    slug: 'pinacello',
    name: 'Pinacello',
    sector: { nl: 'Consumer ecommerce', en: 'Consumer ecommerce' },
    status: 'ongoing',
    liveUrl: 'https://promo.pinacello.com/',
    image: pinacello,
    video: '/videos/pinacello.mp4',
    videoCaption: {
      nl: '20 verkopen uit één organische video. We focussen op zelfgemaakte producten.',
      en: '20 sales from one organic video. We focus on self-made products.',
    },
    summary: {
      nl: '+120% online omzet bij Pinacello. Campagnes, landingspagina’s en conversie verbonden tot een ecommerce-verkoopmotor.',
      en: '+120% online revenue at Pinacello. Campaigns, landing pages and conversion connected into an ecommerce sales engine.',
    },
    situation: {
      nl: 'Pinacello bouwt merkbekendheid op in een consumentenmarkt. De uitdaging is om die aandacht consequent te vertalen naar online verkoop, niet enkel naar bereik.',
      en: 'Pinacello is building brand awareness in a consumer market. The challenge is turning that attention consistently into online sales, not just reach.',
    },
    challenge: {
      nl: 'Bezoekers die via campagnes binnenkomen, hebben een directe, overtuigende route naar aankoop nodig, inclusief het juiste aanbod op het juiste moment.',
      en: 'Visitors arriving through campaigns need a direct, convincing route to purchase, including the right offer at the right moment.',
    },
    role: {
      nl: 'Ik werk aan de ecommerce en digitale groeikant van Pinacello, waaronder campagnes, landingspagina’s, conversie en online verkoop.',
      en: 'I work on the ecommerce and digital growth side of Pinacello, including campaigns, landing pages, conversion and online sales.',
    },
    built: {
      nl: [
        'Ecommerce-strategie',
        'Campagne-landingspagina’s',
        'Meta Ads',
        'Conversiegerichte content',
        'Aanbiedingen en bundels',
        'Retargeting',
        'Online verkoopflow',
      ],
      en: [
        'Ecommerce strategy',
        'Campaign landing pages',
        'Meta Ads',
        'Conversion-focused content',
        'Offers and bundles',
        'Retargeting',
        'Online sales flow',
      ],
    },
    measurement: {
      nl: 'Pinacello behaalde 120% groei in online omzet.',
      en: 'Pinacello achieved 120% growth in online revenue.',
    },
    objective: {
      nl: 'Aandacht voor het merk omzetten in meetbare ecommerce-omzet.',
      en: 'Turning brand attention into measurable ecommerce revenue.',
    },
  },
  {
    slug: 'e-kart',
    name: 'E-Kart',
    sector: { nl: 'Indoor karting · B2C & B2B', en: 'Indoor karting · B2C & B2B' },
    status: 'ongoing',
    image: ekart,
    summary: {
      nl: 'Van zin in een race naar een boeking. Digitale groei voor E-Kart in Gent, met aandacht voor particuliere rijders én zakelijke groepen.',
      en: 'From the thrill of racing to a booking. Digital growth for E-Kart in Ghent, focused on individual drivers and business groups.',
    },
    situation: {
      nl: 'E-Kart brengt indoor karting naar Gent. De digitale groeivraag speelt op twee fronten: consumenten bereiken die willen rijden en bedrijven aanspreken die een groepsactiviteit zoeken.',
      en: 'E-Kart brings indoor karting to Ghent. Digital growth involves two audiences: consumers looking to race and businesses looking for a group activity.',
    },
    challenge: {
      nl: 'Een individuele rijder en een organisator beslissen anders. De ene wil snel weten hoe hij kan rijden; de andere zoekt houvast om een activiteit voor een groep te organiseren. Beide routes moeten naar een duidelijke volgende stap leiden.',
      en: 'An individual driver and an event organiser make different decisions. One wants to know how to race; the other needs clarity to organise a group activity. Both journeys need a clear next step.',
    },
    role: {
      nl: 'Stef werkt aan de digitale groei van E-Kart, aan zowel de B2C- als de B2B-kant. De focus ligt op meer klanten en boekingen.',
      en: 'Stef works on digital growth for E-Kart across B2C and B2B, with a focus on attracting more customers and bookings.',
    },
    builtLabel: { nl: 'Focus van de aanpak', en: 'Focus of the approach' },
    built: {
      nl: ['B2C: de stap van interesse naar een boeking verduidelijken', 'B2B: inspelen op de vragen van groepsorganisatoren', 'Digitale groei verbinden aan klanten en boekingen'],
      en: ['B2C: clarify the path from interest to booking', 'B2B: address the needs of group organisers', 'Connect digital growth to customers and bookings'],
    },
    measurement: {
      nl: 'Het doel is meer klanten en boekingen, met afzonderlijke aandacht voor B2C en B2B. Er zijn voor deze case nog geen gevalideerde resultaatcijfers opgenomen.',
      en: 'The goal is more customers and bookings, with separate attention to B2C and B2B. No validated performance figures are included for this case yet.',
    },
    objective: {
      nl: 'Meer klanten en boekingen voor indoor karting in Gent.',
      en: 'More customers and bookings for indoor karting in Ghent.',
    },
  },
  {
    slug: 'nooms',
    name: 'Nooms',
    sector: { nl: 'Supplementen en ecommerce', en: 'Supplements and ecommerce' },
    status: 'ongoing',
    liveUrl: 'https://noomsdaily.com/',
    image: nooms,
    summary: {
      nl: 'Pre-sale via influencer marketing volledig uitverkocht. We werken verder aan een schaalbare digitale route van productontdekking tot herhaalaankoop.',
      en: 'Pre-sale sold out completely via influencer marketing. We are building a scalable digital route from product discovery to repeat purchase.',
    },
    situation: {
      nl: 'Nooms is een opbouwend ecommerce-merk in de supplementenmarkt, met zowel directe verkoop als retail- en B2B-ambities.',
      en: 'Nooms is a growing ecommerce brand in the supplements market, with both direct sales and retail/B2B ambitions.',
    },
    challenge: {
      nl: 'De volledige route, van productontdekking via influencers en campagnes tot eerste aankoop, herhaalaankoop en zakelijke kanalen, moet als één geheel functioneren.',
      en: 'The full route, from product discovery through influencers and campaigns to first purchase, repeat purchase and business channels, needs to function as one whole.',
    },
    role: {
      nl: 'Nooms is mijn eigen bedrijf. Ik bouw het zelf op, met focus op ecommerce, funnels, branding, verkoop en digitale groei.',
      en: 'Nooms is my own company. I’m building it myself, focused on ecommerce, funnels, branding, sales and digital growth.',
    },
    built: {
      nl: [
        'Ecommerce-opzet',
        'Productpositionering',
        'Landingspagina’s',
        'Pre-sale flow',
        'Influencer-funnel',
        'Denkwerk rond abonnementen',
        'Retail- en B2B-strategie',
        'E-mail- en acquisitiestructuur',
      ],
      en: [
        'Ecommerce setup',
        'Product positioning',
        'Landing pages',
        'Pre-sale flow',
        'Influencer funnel',
        'Subscription strategy thinking',
        'Retail and B2B strategy',
        'Email and acquisition structure',
      ],
    },
    measurement: {
      nl: 'De pre-sale, aangedreven door influencer marketing, was volledig uitverkocht. Groei in eerste aankopen en herhaalaankopen wordt gemeten van productontdekking tot klant.',
      en: 'The pre-sale, driven by influencer marketing, sold out completely. Growth in first purchases and repeat purchases is measured from product discovery to customer.',
    },
    objective: {
      nl: 'Een schaalbare digitale route bouwen van productontdekking tot eerste aankoop en herhaalaankoop.',
      en: 'Building a scalable digital route from product discovery to first purchase and repeat purchase.',
    },
  },

]

export const getCase = (slug: string) =>
  cases.find((c) => c.slug === slug)
