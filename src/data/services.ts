import type { Service } from './types'

export const services: Service[] = [
  {
    slug: 'email-marketing', number: '11',
    title: { nl: 'E-mailmarketing', en: 'Email marketing' },
    summary: { nl: 'Bouw een relatie die verder gaat dan de eerste klik. Met relevante campagnes en automatische flows begeleid je contacten van interesse naar aankoop en herhaalaankoop.', en: 'Build a relationship beyond the first click. Relevant campaigns and automated flows guide contacts from interest to purchase and repeat purchase.' },
    includes: { nl: ['E-mailstrategie', 'Campagnes & nieuwsbrieven', 'Automatische flows', 'Segmentatie & analyse'], en: ['Email strategy', 'Campaigns & newsletters', 'Automated flows', 'Segmentation & analysis'] },
    problem: { nl: 'Je investeert in bezoekers en nieuwe klanten, maar na een inschrijving of aankoop blijft het stil. Losse nieuwsbrieven missen vaak de timing en relevantie die een klant naar de volgende stap helpen.', en: 'You invest in visitors and new customers, but things go quiet after a sign-up or purchase. Occasional newsletters often miss the timing and relevance that help customers take the next step.' },
    process: { nl: ['We brengen je doelgroepen, toestemming, klantreis en beschikbare data in kaart.', 'We bepalen welke flows prioriteit krijgen: welkom, opvolging, verlaten winkelmand of herhaalaankoop.', 'We ontwerpen herkenbare e-mails met één duidelijke boodschap en volgende stap.', 'We testen inhoud, weergave, links en triggers voordat een flow live gaat.', 'We evalueren kliks, conversies, uitschrijvingen en beschikbare omzetdata en verbeteren gericht.'], en: ['We map audiences, consent, the customer journey and available data.', 'We prioritise flows: welcome, follow-up, abandoned cart or repeat purchase.', 'We design recognisable emails with one clear message and next step.', 'We test content, rendering, links and triggers before launching a flow.', 'We review clicks, conversions, unsubscribes and available revenue data to improve.'] },
    deliverables: { nl: ['E-mailplan met prioriteiten per doelgroep', 'Herbruikbaar e-maildesign voor desktop en mobiel', 'Afgesproken campagnes en automatische flows', 'Segmentatie, testplan en rapportage'], en: ['Email plan with priorities for each audience', 'Reusable email design for desktop and mobile', 'Agreed campaigns and automated flows', 'Segmentation, testing plan and reporting'] },
  },
  {
    slug: 'data-analytics', number: '10',
    title: { nl: 'Data & analytics', en: 'Data & analytics' },
    summary: { nl: 'Van verspreide cijfers naar duidelijke beslissingen. We verbinden websitegedrag, campagnes en conversies zodat je ziet waar je groei vandaan komt.', en: 'From scattered numbers to clear decisions. We connect website behaviour, campaigns and conversions so you can see what drives growth.' },
    includes: { nl: ['GA4', 'Google Tag Manager', 'Conversietracking', 'Looker Studio dashboards'], en: ['GA4', 'Google Tag Manager', 'Conversion tracking', 'Looker Studio dashboards'] },
    problem: { nl: 'Je investeert in marketing, maar weet niet welke campagnes goede aanvragen opleveren. Of je dashboard toont verkeer, terwijl je wilt weten wat klanten en omzet brengt.', en: 'You invest in marketing but cannot see which campaigns bring qualified enquiries. Or your dashboard shows traffic when you need to understand customers and revenue.' },
    process: { nl: ['We bepalen welke acties waardevol zijn: aanvragen, boekingen, aankopen en gekwalificeerde leads.', 'We controleren je meetplan, GA4, tags en conversies op fouten en dubbele registraties.', 'We richten rapportage in rond de afgesproken KPI’s en beschikbare databronnen.', 'We vertalen de inzichten naar prioriteiten voor campagnes en conversie.'], en: ['We define valuable actions: enquiries, bookings, purchases and qualified leads.', 'We review your measurement plan, GA4, tags and conversions for errors and duplication.', 'We build reporting around agreed KPIs and available data sources.', 'We turn insights into priorities for campaigns and conversion.'] },
    deliverables: { nl: ['Meetplan met duidelijke conversiedefinities', 'Trackingcontrole en afgesproken implementaties', 'Dashboard met kosten, conversies en beschikbare omzetdata', 'Uitleg bij datakwaliteit, meetbeperkingen en concrete vervolgstappen'], en: ['Measurement plan with clear conversion definitions', 'Tracking review and agreed implementations', 'Dashboard covering cost, conversions and available revenue data', 'Explanation of data quality, measurement limits and next actions'] },
  },
  {
    slug: 'websites',
    number: '01',
    title: { nl: 'Websites & ecommerce', en: 'Websites & ecommerce' },
    summary: {
      nl: 'Een site of webshop met één volgende stap: een aanvraag, een reservatie of een aankoop.',
      en: 'A site or online store with one next step: an enquiry, a booking or a purchase.',
    },
    includes: {
      nl: ['Webdesign', 'Webdevelopment', 'Ecommerce', 'Contentstructuur'],
      en: ['Web design', 'Web development', 'Ecommerce', 'Content structure'],
    },
    problem: {
      nl: 'De pagina zegt te veel tegelijk. Bezoekers moeten zelf de knop zoeken, en in een webshop haken ze af vóór ze betalen.',
      en: 'The page tries to say everything at once. Visitors have to hunt for the button, and in an online store they drop off before they pay.',
    },
    process: {
      nl: [
        'We bepalen wie de site bezoekt en welke ene actie telt.',
        'We zetten structuur en ontwerp op rond die actie.',
        'LYTE Studios bouwt en test. Samen leveren we de site op.',
      ],
      en: [
        'We decide who visits and which single action matters.',
        'We shape the structure and design around that action.',
        'LYTE Studios builds and tests. Together we hand the site over.',
      ],
    },
    deliverables: {
      nl: [
        'Site of webshop die op telefoon en desktop klopt',
        'Structuur met één actie per pagina',
        'Afgesproken koppeling, zoals een formulier, reservatie of betaling',
        'Overdracht en een plan voor de lancering',
      ],
      en: [
        'A site or store that holds up on phone and desktop',
        'A structure with one action per page',
        'An agreed connection, such as a form, booking or payment',
        'Handover and a launch plan',
      ],
    },
    partnerCase: {
      name: 'Jobr website',
      url: 'https://lytestudios.be/projects/jobr-website/',
      description: {
        nl: 'Door LYTE Studios: een website die de Jobr-app introduceert en bezoekers naar downloads en werkgeversregistraties leidt.',
        en: 'By LYTE Studios: a website introducing the Jobr app and guiding visitors to downloads and employer registration.',
      },
    },
  },
  {
    slug: 'software',
    number: '02',
    title: { nl: 'Software & apps', en: 'Software & apps' },
    summary: {
      nl: 'Van productidee tot werkende applicatie. Samen met LYTE Studios bouwen we platformen, mobiele apps en software op maat.',
      en: 'From product idea to working application. Together with LYTE Studios, we build platforms, mobile apps and custom software.',
    },
    includes: {
      nl: [
        'Productstrategie',
        'Webplatformen',
        'iOS & Android',
        'API-integraties',
      ],
      en: [
        'Product strategy',
        'Web platforms',
        'iOS & Android',
        'API integrations',
      ],
    },
    problem: {
      nl: 'Je product vraagt meer dan een website, of je team verliest tijd aan tools en processen die niet goed samenwerken.',
      en: 'Your product needs more than a website, or your team loses time to tools and processes that do not work well together.',
    },
    process: {
      nl: [
        'We brengen gebruikers, processen en technische vereisten in kaart.',
        'We bepalen de eerste versie en werken de gebruikerservaring uit.',
        'LYTE Studios ontwikkelt de applicatie; samen stemmen we product en marktintroductie af.',
      ],
      en: [
        'We map users, workflows and technical requirements.',
        'We scope the first release and design the user experience.',
        'LYTE Studios develops the application; together we align the product and its launch.',
      ],
    },
    deliverables: {
      nl: [
        'Afgebakende productscope',
        'UX- en UI-design',
        'Geteste applicatie',
        'Integraties en overdracht',
      ],
      en: [
        'Defined product scope',
        'UX and UI design',
        'Tested application',
        'Integrations and handover',
      ],
    },
    partnerCase: {
      name: 'WERKR',
      url: 'https://lytestudios.be/projects/werkr/',
      description: {
        nl: 'Door LYTE Studios: een softwareplatform voor flexibele personeelsplanning en uitvoering van opdrachten.',
        en: 'By LYTE Studios: a software platform for flexible workforce planning and job delivery.',
      },
    },
  },
  {
    slug: 'landing-pages',
    number: '03',
    title: { nl: 'Landing pages', en: 'Landing pages' },
    summary: {
      nl: 'Gerichte pagina’s die aansluiten op één doelgroep, campagne en conversiedoel.',
      en: 'Focused pages built around one audience, one campaign and one conversion goal.',
    },
    includes: {
      nl: [
        'B2B lead-generation pages',
        'B2C booking pages',
        'ecommerce product pages',
        'campaign landing pages',
        'local landing pages',
        'event pages',
      ],
      en: [
        'B2B lead-generation pages',
        'B2C booking pages',
        'ecommerce product pages',
        'campaign landing pages',
        'local landing pages',
        'event pages',
      ],
    },
    problem: {
      nl: 'Advertenties sturen vaak naar een algemene website of homepage. De bezoeker moet zelf de vertaalslag maken tussen wat hij zag in de advertentie en wat hij op de pagina vindt. Dat kost conversie.',
      en: 'Ads often send people to a general website or homepage. The visitor has to bridge the gap between what they saw in the ad and what they find on the page themselves. That costs conversion.',
    },
    process: {
      nl: [
        'We bekijken de campagne, de doelgroep en het conversiedoel voor er één regel copy geschreven wordt.',
        'De pagina krijgt één boodschap en één actie, zonder concurrerende keuzes.',
        'Structuur, copy en design worden afgestemd op hoe de bezoeker binnenkomt: via Meta, Google, e-mail of referral.',
        'Tracking wordt ingebouwd zodat gedrag op de pagina meetbaar is, niet enkel het bezoek.',
      ],
      en: [
        'We look at the campaign, the audience and the conversion goal before a single line of copy is written.',
        'The page gets one message and one action, with no competing choices.',
        'Structure, copy and design are matched to how the visitor arrives: via Meta, Google, email or referral.',
        'Tracking is built in so behaviour on the page is measurable, not just the visit.',
      ],
    },
    deliverables: {
      nl: [
        'Pagina-structuur afgestemd op doelgroep en campagne',
        'Copy gericht op één conversiedoel',
        'Responsive design (desktop en mobiel)',
        'Ingebouwde tracking en conversiemeting',
      ],
      en: [
        'Page structure matched to audience and campaign',
        'Copy focused on one conversion goal',
        'Responsive design (desktop and mobile)',
        'Built-in tracking and conversion measurement',
      ],
    },
  },
  {
    slug: 'funnels',
    number: '04',
    title: { nl: 'Funnels', en: 'Funnels' },
    summary: {
      nl: 'De volledige klantreis van eerste contact tot lead, boeking of aankoop.',
      en: 'The full customer journey from first contact to lead, booking or purchase.',
    },
    includes: {
      nl: [
        'B2B lead funnels',
        'B2C booking funnels',
        'email funnels & segmentatie',
        'ecommerce funnels',
        'retargeting flows',
        'post-purchase flows',
      ],
      en: [
        'B2B lead funnels',
        'B2C booking funnels',
        'email funnels & segmentation',
        'ecommerce funnels',
        'retargeting flows',
        'post-purchase flows',
      ],
    },
    problem: {
      nl: 'Een goede landingspagina is niet genoeg als wat erna komt niet klopt. Leads die niet snel worden opgevolgd, boekingen zonder bevestiging, of kopers die na aankoop niets meer horen. Dat is omzet die op tafel blijft liggen.',
      en: 'A good landing page isn’t enough if what comes after it doesn’t work. Leads that aren’t followed up quickly, bookings without confirmation, or buyers who hear nothing after purchase. That’s revenue left on the table.',
    },
    process: {
      nl: [
        'We brengen de volledige klantreis in kaart: van eerste klik tot klant en herhaalaankoop.',
        'Elke stap krijgt een duidelijke commerciële functie. Geen stap blijft zonder doel.',
        'Opvolging via e-mail, CRM of AI-automatisering wordt gekoppeld aan de funnel.',
        'De funnel wordt gebouwd zodat elke stap meetbaar is.',
      ],
      en: [
        'We map out the full customer journey: from first click to customer and repeat purchase.',
        'Every step gets a clear commercial function. No step is left without a purpose.',
        'Follow-up via email, CRM or AI automation is connected to the funnel.',
        'The funnel is built so every step is measurable.',
      ],
    },
    deliverables: {
      nl: [
        'Volledig funnel-ontwerp van klik tot klant',
        'Gekoppelde opvolging (e-mail, CRM, retargeting)',
        'Duidelijke meetpunten per funnelstap',
        'Implementatie of begeleiding bij implementatie',
      ],
      en: [
        'Full funnel design from click to customer',
        'Connected follow-up (email, CRM, retargeting)',
        'Clear measurement points per funnel step',
        'Implementation, or guidance during implementation',
      ],
    },
    relatedCase: 'nooms',
  },
  {
    slug: 'meta-ads',
    number: '05',
    title: { nl: 'Meta Ads', en: 'Meta Ads' },
    summary: {
      nl: 'Campagnes die niet alleen bereik kopen, maar mensen naar de juiste commerciële route sturen.',
      en: 'Campaigns that don’t just buy reach, but send people down the right commercial route.',
    },
    includes: {
      nl: [
        'campaign strategy',
        'creative concepts',
        'audience structure',
        'retargeting',
        'conversion campaigns',
        'performance analysis',
      ],
      en: [
        'campaign strategy',
        'creative concepts',
        'audience structure',
        'retargeting',
        'conversion campaigns',
        'performance analysis',
      ],
    },
    problem: {
      nl: 'Meta Ads worden vaak gemeten op klikken en bereik, terwijl het doel leads, boekingen of omzet is. Zonder een heldere structuur tussen campagne, landingspagina en opvolging blijft het resultaat oppervlakkig.',
      en: 'Meta Ads are often measured on clicks and reach, while the actual goal is leads, bookings or revenue. Without a clear structure between campaign, landing page and follow-up, results stay superficial.',
    },
    process: {
      nl: [
        'Campagnestructuur en doelgroepen worden opgebouwd rond het commerciële doel, niet enkel bereik.',
        'Creatives worden afgestemd op de fase van de funnel: koud, warm of retargeting.',
        'Elke campagne verwijst naar een landingspagina die bij de boodschap past.',
        'Resultaten worden geanalyseerd op leads, boekingen of omzet, niet enkel op klikken.',
      ],
      en: [
        'Campaign structure and audiences are built around the commercial goal, not just reach.',
        'Creatives are matched to the funnel stage: cold, warm or retargeting.',
        'Every campaign points to a landing page that matches the message.',
        'Results are analysed on leads, bookings or revenue, not just on clicks.',
      ],
    },
    deliverables: {
      nl: [
        'Campagne- en doelgroepstructuur',
        'Creative concepten per funnelfase',
        'Koppeling met bijhorende landingspagina’s',
        'Rapportage op commerciële resultaten',
      ],
      en: [
        'Campaign and audience structure',
        'Creative concepts per funnel stage',
        'Connection to matching landing pages',
        'Reporting on commercial results',
      ],
    },
    relatedCase: 'pinacello',
  },
  {
    slug: 'google-ads',
    number: '06',
    title: { nl: 'Google Ads', en: 'Google Ads' },
    summary: {
      nl: 'Zoekcampagnes die aansluiten op de intentie van de gebruiker.',
      en: 'Search campaigns that match the user’s intent.',
    },
    includes: {
      nl: [
        'search campaigns',
        'local campaigns',
        'brand and non-brand structure',
        'conversion tracking',
        'landing-page alignment',
        'remarketing',
      ],
      en: [
        'search campaigns',
        'local campaigns',
        'brand and non-brand structure',
        'conversion tracking',
        'landing-page alignment',
        'remarketing',
      ],
    },
    problem: {
      nl: 'Zoekverkeer heeft al een intentie. Wanneer de landingspagina die intentie niet direct beantwoordt, verliest de campagne rendement die er eigenlijk al lag.',
      en: 'Search traffic already carries intent. When the landing page doesn’t answer that intent directly, the campaign loses return that was already there for the taking.',
    },
    process: {
      nl: [
        'Campagnestructuur wordt opgebouwd rond zoekintentie: brand, non-brand en lokaal apart.',
        'Conversietracking wordt correct ingesteld zodat elke actie meetbaar is.',
        'Landingspagina’s worden afgestemd op de zoekterm en de intentie erachter.',
        'Remarketing haalt bezoekers terug die nog niet converteerden.',
      ],
      en: [
        'Campaign structure is built around search intent: brand, non-brand and local kept separate.',
        'Conversion tracking is set up correctly so every action is measurable.',
        'Landing pages are matched to the search term and the intent behind it.',
        'Remarketing brings back visitors who haven’t converted yet.',
      ],
    },
    deliverables: {
      nl: [
        'Campagnestructuur per intentie en doelgroep',
        'Conversietracking-opzet',
        'Afstemming tussen zoekterm en landingspagina',
        'Remarketing-opzet',
      ],
      en: [
        'Campaign structure per intent and audience',
        'Conversion tracking setup',
        'Alignment between search term and landing page',
        'Remarketing setup',
      ],
    },
    relatedCase: 'e-kart',
  },
  {
    slug: 'ecommerce-conversie',
    number: '07',
    title: { nl: 'Ecommerce conversie', en: 'Ecommerce conversion' },
    summary: {
      nl: 'Verbeteringen die meer bezoekers richting productkeuze, checkout en herhaalaankoop sturen.',
      en: 'Improvements that push more visitors toward product choice, checkout and repeat purchase.',
    },
    includes: {
      nl: [
        'product-page optimisation',
        'offers and bundles',
        'checkout flow',
        'upsells',
        'email flows',
        'subscription strategy',
        'abandoned-cart flows',
      ],
      en: [
        'product-page optimisation',
        'offers and bundles',
        'checkout flow',
        'upsells',
        'email flows',
        'subscription strategy',
        'abandoned-cart flows',
      ],
    },
    problem: {
      nl: 'Veel ecommerce-websites verliezen bezoekers vóór checkout: onduidelijke productpagina’s, een omslachtig afrekenproces of geen opvolging bij een verlaten winkelmandje.',
      en: 'Many ecommerce sites lose visitors before checkout: unclear product pages, a clunky checkout process, or no follow-up on an abandoned cart.',
    },
    process: {
      nl: [
        'We analyseren de volledige aankoopreis: van productpagina tot bevestiging.',
        'Productpagina’s, aanbiedingen en bundels worden scherper afgestemd op de koopbeslissing.',
        'Checkout-flow en upsells worden herzien waar wrijving zit.',
        'E-mailflows vangen verlaten winkelmandjes op en stimuleren herhaalaankoop.',
      ],
      en: [
        'We analyse the full purchase journey: from product page to confirmation.',
        'Product pages, offers and bundles are sharpened around the buying decision.',
        'Checkout flow and upsells are reviewed wherever there’s friction.',
        'Email flows catch abandoned carts and encourage repeat purchase.',
      ],
    },
    deliverables: {
      nl: [
        'Analyse van de volledige aankoopreis',
        'Concrete aanbevelingen per stap (product, checkout, upsell)',
        'E-mailflows voor herstel en herhaalaankoop',
        'Aanbevelingen voor abonnements- of herhaalstrategie',
      ],
      en: [
        'Analysis of the full purchase journey',
        'Concrete recommendations per step (product, checkout, upsell)',
        'Email flows for recovery and repeat purchase',
        'Recommendations for a subscription or repeat-purchase strategy',
      ],
    },
    relatedCase: 'nooms',
  },
  {
    slug: 'ai-automatiseringen',
    number: '08',
    title: { nl: 'AI-automatiseringen', en: 'AI automations' },
    summary: {
      nl: 'Automatiseringen die repetitieve marketing- en salesprocessen sneller en slimmer maken.',
      en: 'Automations that make repetitive marketing and sales processes faster and smarter.',
    },
    includes: {
      nl: [
        'lead qualification',
        'automatic follow-up',
        'personalised email workflows',
        'reporting summaries',
        'internal content workflows',
        'proposal preparation',
        'CRM updates',
        'customer-support routing',
      ],
      en: [
        'lead qualification',
        'automatic follow-up',
        'personalised email workflows',
        'reporting summaries',
        'internal content workflows',
        'proposal preparation',
        'CRM updates',
        'customer-support routing',
      ],
    },
    problem: {
      nl: 'Veel bedrijven verliezen tijd aan repetitieve taken tussen marketing, sales en opvolging: leads handmatig beoordelen, data handmatig samenvatten, CRM handmatig bijwerken.',
      en: 'Many companies lose time on repetitive tasks between marketing, sales and follow-up: reviewing leads by hand, summarising data by hand, updating the CRM by hand.',
    },
    process: {
      nl: [
        'We brengen in kaart welke terugkerende taken het meeste tijd kosten.',
        'Workflows worden ontworpen rond bestaande tools: CRM, e-mail, formulieren, agenda.',
        'AI wordt ingezet om te kwalificeren, samen te vatten en voor te bereiden. Een mens blijft eindverantwoordelijk.',
        'De workflow wordt getest en verfijnd op basis van echte gevallen.',
      ],
      en: [
        'We map out which recurring tasks cost the most time.',
        'Workflows are designed around existing tools: CRM, email, forms, calendar.',
        'AI is used to qualify, summarise and prepare. A human stays in charge.',
        'The workflow is tested and refined on real cases.',
      ],
    },
    deliverables: {
      nl: [
        'Overzicht van automatiseringskansen',
        'Ontwerp van de workflow(s)',
        'Implementatie en koppeling met bestaande tools',
        'Testen en bijsturen na livegang',
      ],
      en: [
        'Overview of automation opportunities',
        'Workflow design',
        'Implementation and connection to existing tools',
        'Testing and refinement after go-live',
      ],
    },
  },
  {
    slug: 'distributie',
    number: '09',
    title: { nl: 'Offer & distributie', en: 'Offer & distribution' },
    summary: {
      nl: 'Een scherp aanbod en de juiste distributiekanalen, zoals B2B-outreach, B2C-advertenties en offline campagnes, zodat de juiste mensen je zien, op meer dan één manier.',
      en: 'A sharp offer and the right distribution channels, such as B2B outreach, B2C ads and offline campaigns, so the right people see you in more than one way.',
    },
    includes: {
      nl: [
        'aanbod- en positioneringsstrategie',
        'B2B-outreach: e-mail en Sales Navigator-campagnes',
        'B2C-advertenties (Meta, Google, social)',
        'offline campagnes en lokale zichtbaarheid',
        'SEO en GEO (zichtbaarheid in AI-zoekresultaten)',
        'distributiekanalen opzetten',
        'trackbare campagnestructuur',
        'koppeling met landingspagina en funnel',
      ],
      en: [
        'offer and positioning strategy',
        'B2B outreach: email and Sales Navigator campaigns',
        'B2C ads (Meta, Google, social)',
        'offline campaigns and local visibility',
        'SEO and GEO (visibility in AI search results)',
        'setting up distribution channels',
        'trackable campaign structure',
        'connection to landing page and funnel',
      ],
    },
    problem: {
      nl: 'Veel bedrijven zetten wel content of campagnes op, maar leunen op één kanaal en missen een scherp aanbod. Of het nu B2B-outreach, B2C-advertenties of offline campagnes is: zonder een direct, trackbaar kanaal blijft distributie vaak een gok.',
      en: 'Many companies run content or campaigns, but lean on a single channel and lack a sharp offer. Whether it’s B2B outreach, B2C ads or offline campaigns: without a direct, trackable channel, distribution often stays a guess.',
    },
    process: {
      nl: [
        'We bekijken het huidige aanbod en waar de aandacht nu vandaan komt.',
        'Het aanbod wordt scherper gepositioneerd rond één duidelijke actie.',
        'De juiste mix van kanalen wordt opgezet als trackbare campagne: B2B-outreach, B2C-advertenties, offline campagnes en SEO/GEO.',
        'Resultaten per kanaal worden gemeten, zodat duidelijk wordt wat wél werkt.',
      ],
      en: [
        'We look at the current offer and where attention is coming from today.',
        'The offer is positioned more sharply around one clear action.',
        'The right channel mix is set up as a trackable campaign: B2B outreach, B2C ads, offline campaigns and SEO/GEO.',
        'Results per channel are measured, so it becomes clear what actually works.',
      ],
    },
    deliverables: {
      nl: [
        'Scherpere aanbod- en positioneringsstrategie',
        'Opgezette outreach- of distributiecampagne',
        'Trackbare koppeling met landingspagina en funnel',
        'Overzicht van wat per kanaal wel en niet werkt',
      ],
      en: [
        'A sharper offer and positioning strategy',
        'A live outreach or distribution campaign',
        'Trackable connection to landing page and funnel',
        'Overview of what does and doesn’t work per channel',
      ],
    },
  },
]

export const getService = (slug: string) =>
  services.find((service) => service.slug === slug)
