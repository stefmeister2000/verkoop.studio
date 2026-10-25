export interface AcademyLesson {
  id: string
  title: string
  shortTitle: string
  summary: string
  outcome: string
  sections: { title: string; text: string }[]
  example: string
  exercise: string
  prompt: string
  question: string
  answers: string[]
  correctAnswer: number
  explanation: string
  source: { label: string; url: string }
}

const performanceSource = {
  label: 'Meta Blueprint · Performance 5',
  url: 'https://www.facebookblueprint.com/student/path/253157-performance-5',
}

export const academyLessons: AcademyLesson[] = [
  {
    id: 'doel',
    title: 'Een helder doel voor je campagne',
    shortTitle: 'Doel & aanbod',
    summary: 'Bepaal wat een goed resultaat voor jouw bedrijf betekent.',
    outcome: 'Een concreet campagnedoel en een aanbod voor één doelgroep.',
    sections: [
      { title: 'Begin bij de actie die je wilt uitlokken', text: 'Wil je een aankoop, een demo-aanvraag of een afspraak? Kies één hoofdactie. Beschrijf ook wie je wilt bereiken en waarom die persoon nu zou reageren. Zo geef je je campagne een duidelijke richting.' },
      { title: 'Laat je instellingen dat doel volgen', text: 'Stem in Ads Manager het campagnedoel, de conversielocatie en het prestatiedoel af op die hoofdactie. Voor aanvragen ligt Leads voor de hand; voor online aankopen Sales. Controleer welke opties voor jouw account en situatie beschikbaar zijn. Verkeer naar een pagina is op zichzelf nog geen aanvraag.' },
      { title: 'Maak succes meetbaar', text: 'Bepaal vooraf wat je kunt besteden aan een waardevolle aanvraag of aankoop. Neem bij leads ook de kwaliteit en uiteindelijke verkoop mee. Gebruik je eigen marge en verkoopcijfers als uitgangspunt. Heb je nog geen cijfers? Noteer een voorlopige aanname die je met een begrensde test kunt onderzoeken.' },
    ],
    example: 'Voorbeeld: een softwarebedrijf wil demo-aanvragen voor zijn planningstool. De campagne richt zich op operationele teams met een planningsvraag. Naast de kosten per aanvraag volgt het bedrijf hoeveel demo’s werkelijk plaatsvinden.',
    exercise: 'Schrijf je campagne in één zin',
    prompt: 'Wie wil je bereiken, met welk aanbod en welke concrete actie wil je dat die persoon neemt?',
    question: 'Je wilt relevante demo-aanvragen. Welke uitkomst vertelt je het meest?',
    answers: ['Hoeveel likes de advertentie krijgt', 'Hoeveel relevante aanvragen tot een demo leiden', 'Hoe vaak de advertentie is vertoond'],
    correctAnswer: 1,
    explanation: 'Een relevante aanvraag en de daaropvolgende demo liggen dicht bij je bedrijfsdoel. Likes en vertoningen kunnen context geven, maar bewijzen geen verkoopinteresse.',
    source: { label: 'Meta Blueprint · Campagnedoelen en conversie-instellingen', url: 'https://www.facebookblueprint.com/student/path/253165-selecting-objectives-course' },
  },
  {
    id: 'structuur',
    title: 'Een campagne met een duidelijke structuur',
    shortTitle: 'Campagne-opzet',
    summary: 'Breng structuur aan in doelen, advertentiesets en budget.',
    outcome: 'Een eenvoudige opzet met een bewust testbudget.',
    sections: [
      { title: 'Begrijp de drie niveaus', text: 'De campagne bepaalt het doel. In de advertentieset regel je onder meer de conversielocatie, het publiek, de planning en de plaatsingen. De advertentie bevat het beeld, de tekst en de bestemming. Waar je het budget instelt, hangt af van de gekozen campagne-instellingen.' },
      { title: 'Geef elke splitsing een reden', text: 'Verdeel een klein budget niet zonder duidelijke reden over veel vergelijkbare advertentiesets. Splits wanneer je bijvoorbeeld een andere markt, taal of een gecontroleerde vergelijking nodig hebt. Meta’s Performance 5 benadrukt een eenvoudige accountstructuur. Bekijk ook welke automatisering past bij je doel en welke grenzen je zelf moet bewaken.' },
      { title: 'Bepaal je grenzen vóór de start', text: 'Kies een bedrag dat je verantwoord kunt testen, een evaluatiemoment en een maximale totale uitgave. Controleer planning, valuta en budgetinstellingen. Er bestaat geen universeel dagbudget dat voor elk bedrijf werkt. Start pas als je aanbod, bestemming en meting klaar zijn.' },
    ],
    example: 'Voorbeeld: één aanbod voor Nederlandstalige klanten in België. Je begint met één heldere campagne-opzet en meerdere creatieve invalshoeken. Een tweede markt voeg je alleen toe als je daar een aparte reden en budget voor hebt.',
    exercise: 'Teken je eerste campagne-opzet',
    prompt: 'Noteer je campagnedoel, markt, aanbod, maximaal testbudget en het moment waarop je evalueert.',
    question: 'Wanneer is een extra advertentieset zinvol?',
    answers: ['Wanneer je een duidelijke aparte markt of test nodig hebt', 'Altijd: meer advertentiesets geven vanzelf betere resultaten', 'Voor elke kleine wijziging in een koptekst'],
    correctAnswer: 0,
    explanation: 'Een splitsing moet een zakelijke of experimentele reden hebben. Onnodige versnippering maakt het moeilijker om budget en resultaten te beoordelen.',
    source: performanceSource,
  },
  {
    id: 'creatief',
    title: 'Advertenties met verschillende invalshoeken',
    shortTitle: 'Creatieve ideeën',
    summary: 'Vertaal je aanbod naar een demo, een herkenbare situatie en bewijs.',
    outcome: 'Drie inhoudelijk verschillende advertentieconcepten.',
    sections: [
      { title: 'Kies een reden om aandacht te geven', text: 'Begin met een situatie die je doelgroep herkent, een duidelijke productdemonstratie of een vraag die echt speelt. Maak snel zichtbaar wat je aanbiedt en voor wie het relevant is. Houd de belofte concreet en zorg dat je haar kunt waarmaken.' },
      { title: 'Varieer het idee achter je advertentie', text: 'Werk meerdere invalshoeken uit: laat het product in gebruik zien, leg een veelgestelde vraag uit of toon een echte klantervaring waarvoor je toestemming hebt. Een andere achtergrondkleur alleen is geen nieuw concept. Meta adviseert creatieve diversificatie; de beste mix voor jouw aanbod moet je zelf onderzoeken.' },
      { title: 'Maak elke versie begrijpelijk', text: 'Gebruik leesbare tekst, een duidelijke vervolgstap en materiaal dat past bij de gekozen plaatsingen. Controleer de previews in Ads Manager op uitsnijdingen en interface-elementen. Geef gesproken uitleg ook ondertitels. Gebruik alleen beeld, claims en ervaringen die je mag gebruiken.' },
    ],
    example: 'Voorbeeld voor een planningstool: 1. een korte schermdemo van een planning; 2. een herkenbare situatie met lastminute wijzigingen; 3. een echte klant die uitlegt hoe het team de tool gebruikt. Elk concept geeft een andere reden om een demo aan te vragen.',
    exercise: 'Werk drie creatieve invalshoeken uit',
    prompt: 'Schrijf per concept de opening, wat je laat zien en de vervolgstap. Gebruik nog geen onbewezen resultaatclaims.',
    question: 'Welke test onderzoekt echt verschillende creatieve ideeën?',
    answers: ['Dezelfde advertentie met drie lettertypes', 'Dezelfde video met drie achtergrondkleuren', 'Een productdemo, een herkenbare situatie en een echte klantervaring'],
    correctAnswer: 2,
    explanation: 'Deze concepten geven elk een andere reden om te reageren. Dat levert meer inzicht in wat mensen aanspreekt dan alleen een cosmetische wijziging.',
    source: { label: 'Meta Blueprint · Creatieve diversificatie', url: 'https://www.facebookblueprint.com/student/activity/708366-ad-creative-that-converts-how-to-diversify-your-ads-for-better-results' },
  },
  {
    id: 'bestemming',
    title: 'Van advertentie naar een logische volgende stap',
    shortTitle: 'Landingspagina',
    summary: 'Laat je pagina, formulier en opvolging op je advertentie aansluiten.',
    outcome: 'Een gecontroleerde route van klik tot aanvraag of aankoop.',
    sections: [
      { title: 'Houd dezelfde belofte vast', text: 'Als je advertentie een productdemo aanbiedt, moet de bestemming daar meteen over gaan. Herhaal het relevante aanbod en maak duidelijk wat iemand krijgt. Houd één primaire actie zichtbaar en beantwoord vragen die nodig zijn om die stap te nemen.' },
      { title: 'Doorloop de route op je telefoon', text: 'Open de advertentiebestemming, lees de tekst en voltooi zelf de actie. Controleer laadtijd, leesbaarheid, formulierfouten en de bevestiging. Vraag alleen informatie die je werkelijk nodig hebt. Bij een formulier binnen Meta test je ook de overdracht naar je eigen opvolging.' },
      { title: 'Spreek af wat er daarna gebeurt', text: 'Bepaal wie een aanvraag ontvangt, welke informatie wordt opgeslagen en hoe de aanvrager wordt geholpen. Leg uit wat de volgende stap is en kom die verwachting na. Een campagne beoordelen lukt beter als je ook zicht hebt op de kwaliteit van de aanvragen.' },
    ],
    example: 'Voorbeeld: de advertentie nodigt uit voor een demo. De pagina legt uit voor wie de tool geschikt is, toont het product en heeft één demoformulier. Na inzending krijgt de bezoeker een heldere bevestiging met de vervolgstap.',
    exercise: 'Controleer je volledige klantreis',
    prompt: 'Noteer de belofte in je advertentie, de primaire actie op de bestemming en wie de aanvraag opvolgt. Welke drempel kun je wegnemen?',
    question: 'Waar moet iemand na een klik op “Vraag een demo aan” terechtkomen?',
    answers: ['Op een pagina waar die demo duidelijk wordt uitgelegd en aangevraagd', 'Altijd op de algemene homepage', 'Op een pagina met zo veel mogelijk andere aanbiedingen'],
    correctAnswer: 0,
    explanation: 'Een bestemming die aansluit op de advertentie helpt de bezoeker begrijpen wat er wordt aangeboden en welke stap volgt.',
    source: { label: 'Meta Blueprint · Conversielocaties en doelen', url: 'https://www.facebookblueprint.com/student/path/253165-selecting-objectives-course' },
  },
  {
    id: 'meting',
    title: 'Meten wat er werkelijk gebeurt',
    shortTitle: 'Meting & kwaliteit',
    summary: 'Controleer je gebeurtenissen en verbind ze met je bedrijfsresultaat.',
    outcome: 'Een meetplan dat verder kijkt dan klikken.',
    sections: [
      { title: 'Kies je belangrijkste gebeurtenis', text: 'Bepaal welke gebeurtenis je hoofdactie vertegenwoordigt, zoals een verzonden aanvraag of een afgeronde aankoop. Controleer dat je die gebeurtenis op het juiste moment registreert. Een bezoek aan een formulier is nog geen verzonden aanvraag.' },
      { title: 'Test de registratie van begin tot eind', text: 'Doorloop een testactie en controleer de registratie in de diagnostiek van je gebruikte meetoplossing en in je eigen systeem. Gebruik je meerdere meetbronnen, controleer dan of dezelfde actie niet dubbel wordt geteld. Stem je meetinrichting af op de geldende toestemmings- en privacyvereisten.' },
      { title: 'Vergelijk met je eigen administratie', text: 'Lees de resultaten in Ads Manager naast je webshop of CRM. Attributie, rapportagevertraging en verschillende definities kunnen afwijkingen geven. Noteer welke meetperiode en instellingen je gebruikt. De toegeschreven omzet in een platform bewijst op zichzelf niet hoeveel extra omzet de advertenties hebben veroorzaakt.' },
    ],
    example: 'Voorbeeld: een demoformulier is verzonden. Je controleert of de aanvraag één keer in het CRM staat en of de bijbehorende meetgebeurtenis correct wordt geregistreerd. Later voeg je toe of de aanvraag relevant was en of de demo doorging.',
    exercise: 'Maak je meetplan concreet',
    prompt: 'Wat is je hoofdgebeurtenis, waar controleer je die en hoe volg je de uiteindelijke kwaliteit of verkoop op?',
    question: 'Ads Manager rapporteert aanvragen. Wat controleer je daarnaast?',
    answers: ['Alleen de kleur van de best presterende advertentie', 'Of de aanvragen werkelijk bestaan, correct zijn geteld en relevant zijn', 'Niets: platformcijfers vertellen altijd het volledige verhaal'],
    correctAnswer: 1,
    explanation: 'Je eigen gegevens helpen om registratie, dubbeltellingen en kwaliteit te beoordelen. Combineer bronnen en houd rekening met verschillen in definities en attributie.',
    source: performanceSource,
  },
  {
    id: 'verbeteren',
    title: 'Testen, leren en onderbouwd verbeteren',
    shortTitle: 'Testen & groeien',
    summary: 'Maak van resultaten een volgende, gerichte beslissing.',
    outcome: 'Een testhypothese met een vooraf gekozen beslismoment.',
    sections: [
      { title: 'Stel één duidelijke onderzoeksvraag', text: 'Schrijf op wat je wilt leren. Bijvoorbeeld: begrijpt onze doelgroep het aanbod beter met een productdemo of met een uitleg van de toepassing? Bepaal vooraf welk resultaat je beoordeelt. Voor een zuivere vergelijking houd je andere belangrijke omstandigheden zo veel mogelijk gelijk.' },
      { title: 'Geef je waarneming context', text: 'Noteer periode, uitgaven, aantal resultaten en kwaliteit. Trek geen harde conclusie uit één aankoop of een paar klikken. De benodigde looptijd hangt af van je volume en aankoopcyclus. Ongelijke uitlevering aan advertenties is bovendien geen gecontroleerde A/B-test.' },
      { title: 'Kies de volgende actie op basis van bewijs', text: 'Klopt de meting? Begrijpt de bezoeker het aanbod? Zijn de aanvragen waardevol? Gebruik die vragen om een gerichte vervolgstap te kiezen. Verhoog een budget pas als de uitkomsten, marges en beschikbare capaciteit dat toelaten. Leg bij iedere wijziging vast wat je verwacht en wanneer je opnieuw kijkt.' },
    ],
    example: 'Voorbeeld: twee creatieve concepten leveren aanvragen op, maar bij één concept verschijnen meer geschikte bedrijven op de demo. Dat is aanleiding om verder te onderzoeken. Controleer aantallen en vergelijkbaarheid voordat je het concept een winnaar noemt.',
    exercise: 'Formuleer je eerste test',
    prompt: 'Welke twee ideeën vergelijk je, wat blijft gelijk, welke uitkomst beoordeel je en wanneer neem je een beslissing?',
    question: 'Eén advertentie heeft na twee klikken één verkoop. Wat concludeer je?',
    answers: ['Dit is definitief de winnaar', 'Het budget moet onmiddellijk maximaal omhoog', 'Dit is een eerste signaal; er is meer vergelijkbare informatie nodig'],
    correctAnswer: 2,
    explanation: 'Een klein aantal waarnemingen is kwetsbaar voor toeval. Bekijk volume, periode, kwaliteit en vergelijkbaarheid voordat je een grote beslissing neemt.',
    source: performanceSource,
  },
]

export const academyFaq = [
  { question: 'Voor wie is de academy?', answer: 'Voor ondernemers en marketeers die Meta-advertenties zelf willen leren opzetten, testen en beoordelen. We beginnen bij de basis. Je hoeft nog geen advertentieaccount te hebben om je aan te melden.' },
  { question: 'Hoe werkt de academy?', answer: 'Je meldt je aan via het formulier. Stef neemt contact met je op voor een kennismaking over je doel, je ervaring en je budget. Daarna krijg je een voorstel. In het traject werk je aan je eigen aanbod en advertentieaccount: je loopt je meting na, zet je campagne op met feedback, leest je resultaten en kiest onderbouwd je volgende test.' },
  { question: 'Wat kost het?', answer: 'Dat hangt af van je doel, je ervaring en de begeleiding die je nodig hebt. Na je aanmelding bespreekt Stef dat met je en krijg je een voorstel op maat. Advertentiebudget is nooit inbegrepen.' },
  { question: 'Wat gebeurt er met mijn gegevens?', answer: 'Bij je aanmelding ontvangen we je naam, e-mailadres, telefoonnummer en wat je zelf invult. Daarmee neemt Stef contact met je op en bewaren we je aanmelding in ons klantenbestand. Nieuwsbrieven krijg je alleen als je dat aanvinkt.' },
  { question: 'Is dit een officiële Meta-opleiding?', answer: 'Dit is een onafhankelijk leertraject van verkoop.studio. We verwijzen naar Meta Blueprint voor verdere verdieping. Je ontvangt hier geen Meta-certificering. Instellingen en mogelijkheden kunnen verschillen per account en veranderen in de tijd.' },
  { question: 'Garanderen jullie resultaat?', answer: 'Nee. Een goede aanpak hangt af van je aanbod, doelgroep, budget en meting. De academy helpt je betere keuzes maken en zorgvuldig testen. Ze geeft geen garantie op aanvragen, omzet of rendement.' },
]

export interface AcademyTest {
  id: string
  name: string
  angle: string
  status: string
  spend: number
  leads: number
  relevant: number
  /** Cumulative relevant enquiries per day of the 14-day example; null before the test started. */
  daily: (number | null)[]
  verdict: string
  decision: string
  lesson: string
}

/** A fictional practice account: it teaches how to read results, it is not client data. */
export const academyTests: AcademyTest[] = [
  {
    id: 'demo', name: 'Productdemo', angle: 'Laat zien hoe het werkt', status: 'LOPEND', spend: 210, leads: 12, relevant: 7,
    daily: [0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 6, 7],
    verdict: 'Doorgaan en verdiepen',
    decision: 'Duurder per aanvraag, maar de meeste relevante gesprekken. Test een nieuwe variant van dezelfde invalshoek voor je het budget verhoogt.',
    lesson: 'verbeteren',
  },
  {
    id: 'situatie', name: 'Herkenbare situatie', angle: 'Het probleem van je klant', status: 'LOPEND', spend: 205, leads: 19, relevant: 4,
    daily: [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4],
    verdict: 'Bijsturen',
    decision: 'De goedkoopste aanvraag, maar de duurste relevante. Ads Manager oogt goed, je CRM vertelt iets anders. Maak je aanbod en formulier duidelijker.',
    lesson: 'meting',
  },
  {
    id: 'klant', name: 'Klantervaring', angle: 'Een echte klant vertelt', status: 'TE VROEG', spend: 60, leads: 2, relevant: 1,
    daily: [null, null, null, null, null, null, null, null, null, null, 0, 0, 1, 1],
    verdict: 'Nog geen oordeel',
    decision: 'Twee aanvragen zeggen te weinig. Laat de test lopen tot het beslismoment dat je vooraf hebt gekozen.',
    lesson: 'verbeteren',
  },
]
