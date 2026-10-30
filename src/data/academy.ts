export interface AcademyModule {
  id: string
  tag: string
  shortTitle: string
  title: string
  summary: string
  points: string[]
  outcome: string
}

/** The topics the academy goes deep on, in the order you build them up in a webshop account. */
export const academyModules: AcademyModule[] = [
  {
    id: 'tracking',
    tag: 'TRACKING',
    shortTitle: 'Tracking & data',
    title: 'Data waarop Meta kan optimaliseren',
    summary: 'Kloppen je aankopen niet in Meta, dan optimaliseert het algoritme op ruis. Je zet pixel en Conversions API correct op en checkt Ads Manager tegen je echte omzet.',
    points: ['Pixel en Conversions API samen', 'Elke aankoop één keer geteld', 'Ads Manager naast Shopify en GA4'],
    outcome: 'Cijfers waarop je durft te beslissen.',
  },
  {
    id: 'rendement',
    tag: 'ROAS, MER & LTV',
    shortTitle: 'ROAS & LTV',
    title: 'Sturen op winst, niet op omzet',
    summary: 'Een ROAS van 2 kan winst of verlies zijn. Je berekent bij welke ROAS je winst maakt en wat een nieuwe klant mag kosten, zodat je doel van 3 tot 4 klopt voor jouw marge.',
    points: ['Je break-even ROAS', 'MER: je totale rendement', 'LTV en je maximale kost per klant'],
    outcome: 'Een doel-ROAS en maximale CAC voor je webshop.',
  },
  {
    id: 'structuur',
    tag: 'ACCOUNTSTRUCTUUR',
    shortTitle: 'Structuur',
    title: 'Een account dat kan groeien',
    summary: 'Versnipperd budget betekent dat Meta minder leert. Je bouwt een eenvoudige structuur voor nieuwe klanten, retargeting en testen.',
    points: ['Prospecting, retargeting en testen apart', 'Advantage+ en brede doelgroepen', 'Een productcatalogus die klopt'],
    outcome: 'Een structuur die je kan opschalen.',
  },
  {
    id: 'creatives',
    tag: 'CREATIVES',
    shortTitle: 'Creatives',
    title: 'Een constante stroom winnaars',
    summary: 'Je creatives bepalen wie Meta bereikt. Met een vast testritme heb je nieuwe winnaars klaar voor de vorige opbranden.',
    points: ['Hooks die stoppen met scrollen', 'UGC, demo’s en aanbiedingen testen', 'Opbranden op tijd zien'],
    outcome: 'Elke week nieuwe ads om te testen.',
  },
  {
    id: 'retargeting',
    tag: 'RETARGETING & RETENTIE',
    shortTitle: 'Retargeting',
    title: 'Meer uit elke bezoeker en klant',
    summary: 'De meeste bezoekers kopen niet meteen. Met catalogus-ads haal je twijfelaars terug, met cross-sell en e-mail laat je klanten opnieuw kopen.',
    points: ['Catalogus-ads voor bekijkers en winkelwagens', 'Frequentie onder controle', 'Cross-sell, bundels en e-mail'],
    outcome: 'Een retargeting- en retentieplan.',
  },
  {
    id: 'schalen',
    tag: 'SCHALEN',
    shortTitle: 'Opschalen',
    title: 'Schalen zonder in te storten',
    summary: 'Werkt het? Dan verhoog je in stappen en zoek je nieuwe doelgroepen, landen en creatives, zolang je ROAS tussen 3 en 4 blijft.',
    points: ['Budget in stappen omhoog', 'Nieuwe doelgroepen, landen en creatives', 'Vaste beslisregels op ROAS en marge'],
    outcome: 'Een schaalplan met duidelijke beslisregels.',
  },
]

export const academyFaq = [
  { question: 'Voor wie zijn de lessen?', answer: 'Voor webshops die met Meta ads willen starten of meer uit hun ads willen halen. Nog nooit geadverteerd? Dan beginnen we bij de basis.' },
  { question: 'Hoe werken de 1-op-1 lessen?', answer: 'Je meldt je aan, Stef neemt contact op voor een kennismaking en daarna start je lessen. Alles gebeurt 1-op-1, in je eigen advertentieaccount en webshop.' },
  { question: 'Wat betekent een ROAS van 3 tot 4?', answer: 'Dat elke euro in Meta ads €3 tot €4 omzet oplevert. Met €1.000 advertentiebudget is dat €3.000 tot €4.000 omzet. Dat is het doel van elk traject.' },
  { question: 'Hoe zeker is die ROAS van 3 tot 4?', answer: 'Het is de belofte waar elke les naartoe werkt. Hoe snel je er bent, hangt af van je product, je marge en je budget. Stef zegt je in de kennismaking eerlijk wat haalbaar is, nog voor je start.' },
  { question: 'Wat kost het?', answer: 'Een prijs op maat, afhankelijk van je doel en hoeveel begeleiding je nodig hebt. Je hoort hem na de kennismaking. Je advertentiebudget betaal je zelf aan Meta.' },
  { question: 'Heb ik een minimumbudget nodig?', answer: 'Geen vast minimum. Wat zinvol is, hangt af van je marge en je productprijs. Dat bekijken we samen in de kennismaking.' },
  { question: 'Werkt dit voor Shopify, WooCommerce of andere platformen?', answer: 'Ja. Alleen de koppeling van pixel en Conversions API verschilt per platform, en die lopen we samen na.' },
  { question: 'Wat gebeurt er met mijn gegevens?', answer: 'Stef gebruikt je naam, e-mail, telefoon en wat je invult om contact met je op te nemen, en we bewaren je aanmelding in ons klantenbestand. Nieuwsbrieven krijg je alleen als je dat aanvinkt.' },
  { question: 'Is dit een officiële Meta-opleiding?', answer: 'Nee. Dit zijn onafhankelijke lessen van verkoop.studio, zonder Meta-certificering.' },
]

export interface AcademyTest {
  id: string
  name: string
  status: string
  spend: number
  purchases: number
  revenue: number
  newCustomers: number
  /** Cumulative new customers per day of the 14-day example; null before the test started. */
  daily: (number | null)[]
  verdict: string
  decision: string
  module: string
}

/** A fictional webshop account: it teaches how to read results, it is not client data. */
export const academyTests: AcademyTest[] = [
  {
    id: 'demo', name: 'UGC-review', status: 'LOPEND', spend: 1200, purchases: 56, revenue: 4200, newCustomers: 30,
    daily: [1, 3, 5, 7, 9, 11, 13, 15, 18, 20, 23, 25, 28, 30],
    verdict: 'Schalen',
    decision: 'Meeste nieuwe klanten, laagste kost per klant. Verhoog het budget stap voor stap.',
    module: 'schalen',
  },
  {
    id: 'situatie', name: 'Kortingsactie −20%', status: 'LOPEND', spend: 1150, purchases: 82, revenue: 4920, newCustomers: 17,
    daily: [2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    verdict: 'Bijsturen',
    decision: 'Hoge ROAS, maar vooral bestaande klanten en minder marge. Gebruik deze ad voor retentie.',
    module: 'rendement',
  },
  {
    id: 'klant', name: 'Productdemo', status: 'TE VROEG', spend: 300, purchases: 6, revenue: 450, newCustomers: 5,
    daily: [null, null, null, null, null, null, null, null, 0, 1, 2, 3, 4, 5],
    verdict: 'Nog geen oordeel',
    decision: 'Pas zes aankopen. Laat de test langer lopen voordat je beslist.',
    module: 'creatives',
  },
]
