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
    summary: 'Meta stuurt je budget naar de mensen die volgens zijn data kopen. Kloppen die aankopen niet, dan optimaliseert het algoritme op ruis. Je zet pixel en Conversions API correct op en legt Ads Manager naast je eigen cijfers.',
    points: ['Pixel en Conversions API samen laten werken', 'Aankopen ontdubbelen met event-ID’s', 'Ads Manager naast Shopify en GA4 leggen'],
    outcome: 'Een meetopzet waarop je durft te beslissen.',
  },
  {
    id: 'rendement',
    tag: 'ROAS, MER & LTV',
    shortTitle: 'ROAS & LTV',
    title: 'Sturen op winst, niet op omzet',
    summary: 'Een ROAS van 2 kan winst zijn of verlies. Dat hangt af van je marge. Je berekent je break-even ROAS, kijkt naar je totale rendement (MER) en weet met je LTV hoeveel een nieuwe klant mag kosten.',
    points: ['Break-even ROAS op basis van je echte marge', 'MER: totale omzet gedeeld door totale advertentiekost', 'LTV per cohort en je maximale kost per nieuwe klant'],
    outcome: 'Een doel-ROAS en maximale CAC voor je webshop.',
  },
  {
    id: 'structuur',
    tag: 'ACCOUNTSTRUCTUUR',
    shortTitle: 'Structuur',
    title: 'Een account dat kan groeien',
    summary: 'Hoe meer je je budget versnippert, hoe minder Meta kan leren. Je bouwt een eenvoudige structuur met een duidelijke rol voor prospecting, retargeting en testen, en een productcatalogus die klopt.',
    points: ['Prospecting, retargeting en testen gescheiden', 'Advantage+ en brede doelgroepen bewust inzetten', 'Catalogus en productsets op orde'],
    outcome: 'Een structuur die je kan opschalen.',
  },
  {
    id: 'creatives',
    tag: 'CREATIVES',
    shortTitle: 'Creatives',
    title: 'Een constante stroom winnaars',
    summary: 'Bij brede doelgroepen zijn je creatives je belangrijkste hefboom: zij bepalen wie Meta bereikt. Je bouwt een testritme met verschillende invalshoeken, zodat je nieuwe winnaars hebt voor de vorige opbranden.',
    points: ['Hooks die stoppen met scrollen', 'UGC, productdemo’s en aanbiedingen testen', 'Creative fatigue op tijd herkennen'],
    outcome: 'Een testritme met elke week nieuwe kandidaten.',
  },
  {
    id: 'retargeting',
    tag: 'RETARGETING & RETENTIE',
    shortTitle: 'Retargeting',
    title: 'Meer halen uit elke bezoeker en klant',
    summary: 'De meeste bezoekers kopen niet bij hun eerste bezoek. Met catalogus-ads en duidelijke vensters breng je twijfelaars terug, en met cross-sell en e-mail laat je klanten opnieuw kopen. Zonder budget te verspillen aan wie toch al zou kopen.',
    points: ['Catalogus-ads voor productbekijkers en winkelwagens', 'Vensters en frequentie bewaken', 'Cross-sell, bundels en e-mail die je LTV verhogen'],
    outcome: 'Een retargeting- en retentieplan per fase.',
  },
  {
    id: 'schalen',
    tag: 'SCHALEN',
    shortTitle: 'Opschalen',
    title: 'Schalen zonder in te storten',
    summary: 'Opschalen is meer dan je budget verdubbelen. Je verhoogt in stappen, zoekt nieuwe doelgroepen, landen en invalshoeken, en beslist op je MER en marge in plaats van op één goede of slechte dag.',
    points: ['Verticaal schalen: budget in stappen verhogen', 'Horizontaal schalen: nieuwe doelgroepen, landen en creatives', 'Beslisregels op MER en marge'],
    outcome: 'Een schaalplan met duidelijke beslisregels.',
  },
]

export const academyFaq = [
  { question: 'Voor wie is de academy?', answer: 'Voor webshops en ecommerce-merken die met Meta ads willen groeien, of al adverteren en rendabel willen opschalen. Je hoeft geen expert te zijn, maar je hebt wel een webshop of een concreet plan.' },
  { question: 'Hoe werkt de academy?', answer: 'Je meldt je aan via het formulier. Stef bekijkt je webshop en neemt contact met je op voor een kennismaking over je doelen, je cijfers en je budget. Daarna krijg je een voorstel. In het traject werk je in je eigen advertentieaccount: tracking en Conversions API nalopen, je break-even ROAS en LTV bepalen, creatives testen, retargeting opzetten en stap voor stap opschalen.' },
  { question: 'Wat kost het?', answer: 'Dat hangt af van je doel, je ervaring en de begeleiding die je nodig hebt. Na je aanmelding bespreekt Stef dat met je en krijg je een voorstel op maat. Advertentiebudget is nooit inbegrepen.' },
  { question: 'Heb ik een minimumbudget nodig?', answer: 'Er is geen vast minimum. Wat zinvol is, hangt af van je marge, je productprijs en hoe snel je wil testen. Dat bekijken we samen in de kennismaking. Je advertentiebudget betaal je altijd zelf, rechtstreeks aan Meta.' },
  { question: 'Werkt dit ook voor Shopify, WooCommerce of andere platformen?', answer: 'Ja. De aanpak is dezelfde; alleen de technische koppeling van pixel en Conversions API verschilt per platform. Die lopen we samen na voor jouw webshop.' },
  { question: 'Wat gebeurt er met mijn gegevens?', answer: 'Bij je aanmelding ontvangen we je naam, e-mailadres, telefoonnummer en wat je zelf invult. Daarmee neemt Stef contact met je op en bewaren we je aanmelding in ons klantenbestand. Nieuwsbrieven krijg je alleen als je dat aanvinkt.' },
  { question: 'Garanderen jullie een ROAS of resultaat?', answer: 'Nee. Wat haalbaar is, hangt af van je product, marge, aanbod en meting. De academy helpt je betere beslissingen nemen en zorgvuldig opschalen. Ze geeft geen garantie op omzet, ROAS of winst.' },
  { question: 'Is dit een officiële Meta-opleiding?', answer: 'Dit is een onafhankelijk leertraject van verkoop.studio. Je ontvangt hier geen Meta-certificering. Instellingen en mogelijkheden kunnen verschillen per account en veranderen in de tijd.' },
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
    id: 'demo', name: 'UGC-review', status: 'LOPEND', spend: 1200, purchases: 38, revenue: 2580, newCustomers: 30,
    daily: [1, 3, 5, 7, 9, 11, 13, 15, 18, 20, 23, 25, 28, 30],
    verdict: 'Schalen',
    decision: 'Lagere ROAS dan de kortingsactie, maar de meeste nieuwe klanten tegen de laagste kost per klant. Verhoog het budget in stappen en maak nieuwe varianten van deze hook.',
    module: 'schalen',
  },
  {
    id: 'situatie', name: 'Kortingsactie −20%', status: 'LOPEND', spend: 1150, purchases: 52, revenue: 2860, newCustomers: 17,
    daily: [2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    verdict: 'Bijsturen',
    decision: 'De hoogste ROAS in Ads Manager, maar vooral bestaande klanten en 20% minder marge. Op winst en nieuwe klanten verlies je hier geld. Zet de actie in voor retentie, niet om te schalen.',
    module: 'rendement',
  },
  {
    id: 'klant', name: 'Productdemo', status: 'TE VROEG', spend: 300, purchases: 6, revenue: 390, newCustomers: 5,
    daily: [null, null, null, null, null, null, null, null, 0, 1, 2, 3, 4, 5],
    verdict: 'Nog geen oordeel',
    decision: 'Zes aankopen zeggen te weinig. Laat de test lopen tot het beslismoment dat je vooraf hebt gekozen.',
    module: 'creatives',
  },
]
