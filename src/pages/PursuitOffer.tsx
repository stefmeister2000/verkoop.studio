import { useEffect, useState } from 'react'
import './PursuitOffer.css'

const CHAPTERS = [
  { id: 'open', label: 'Open' },
  { id: 'route', label: 'De route' },
  { id: 'webshop', label: 'Webshop' },
  { id: 'configurator', label: 'Configurator' },
  { id: 'investering', label: 'Investering' },
]

const BEATS = [
  {
    n: '01',
    title: 'Zij zoekt een pak.',
    body: 'Meta of Google. De advertentie en de pagina zeggen hetzelfde. We kijken niet alleen naar de klik. We kijken of ze een afspraak maakt, of ze klant wordt, en wat dat aan omzet doet.',
  },
  {
    n: '02',
    title: 'De pagina na de klik.',
    body: 'Een landingspagina per boodschap. Werk, een bruiloft, of een eerste pak. Eén volgende stap: een afspraak in Antwerpen, Gent of Brussel.',
  },
  {
    n: '03',
    title: 'Als ze nog niet boekt.',
    body: 'Een korte mailflow en retargeting. Geen lange reeks. Eén herinnering, dan nog een, en dan is het klaar.',
  },
  {
    n: '04',
    title: 'Als ze zelf zoekt.',
    body: 'SEO en lokale vindbaarheid, zodat een zoektocht naar een maatpak in Antwerpen niet alleen via een advertentie bij jullie uitkomt.',
  },
]

const INCLUDED = [
  'Strategie en prioriteiten',
  'Meta en Google',
  'Tracking en data',
  'Landingspagina’s en conversie',
  'E-mailflows, retargeting en automatisering',
  'SEO en lokale vindbaarheid',
  'Maatwerkdashboards en advertentietests',
  'Wekelijkse opvolging',
  'CRM en marketingdashboard',
  'Documentatie en instructievideo’s',
]

const PIECES = [
  { id: 'pak', label: 'Pak' },
  { id: 'blazer', label: 'Blazer' },
  { id: 'broek', label: 'Broek' },
] as const

const FABRICS = [
  { id: 'marine', label: 'Marine wol', cloth: '#1c2740', lining: '#c4b59a', ink: '#f6f5f1', striped: false },
  { id: 'krijt', label: 'Krijtstreep', cloth: '#2c3136', lining: '#d9d0c4', ink: '#f4efe6', striped: true },
  { id: 'ivoor', label: 'Ivoor', cloth: '#e6dccb', lining: '#973d24', ink: '#191919', striped: false },
  { id: 'terracotta', label: 'Terracotta', cloth: '#973d24', lining: '#f2eadf', ink: '#f6f5f1', striped: false },
  { id: 'zwart', label: 'Zwart', cloth: '#141414', lining: '#c9a27a', ink: '#f6f5f1', striped: false },
] as const

const CUTS = [
  { id: 'recht', label: 'Recht' },
  { id: 'tail', label: 'Getailleerd' },
  { id: 'wijd', label: 'Wijd' },
] as const

const BUTTONS = [
  { id: 'hoorn', label: 'Hoorn', color: '#2a2118' },
  { id: 'goud', label: 'Goud', color: '#c6a15b' },
  { id: 'bedekt', label: 'Bedekt', color: 'current' },
] as const

const eur = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

function money(amount: number) {
  return eur.format(amount).replace(/\s/g, ' ')
}

export default function PursuitOffer() {
  const [active, setActive] = useState(CHAPTERS[0].id)
  const [onInk, setOnInk] = useState(false)
  const [progress, setProgress] = useState(0)
  const [piece, setPiece] = useState<(typeof PIECES)[number]['id']>('pak')
  const [fabricId, setFabricId] = useState<(typeof FABRICS)[number]['id']>('marine')
  const [cut, setCut] = useState<(typeof CUTS)[number]['id']>('tail')
  const [buttonId, setButtonId] = useState<(typeof BUTTONS)[number]['id']>('hoorn')

  const fabric = FABRICS.find((item) => item.id === fabricId) ?? FABRICS[0]
  const button = BUTTONS.find((item) => item.id === buttonId) ?? BUTTONS[0]
  const buttonColor = button.color === 'current' ? fabric.cloth : button.color

  useEffect(() => {
    const previousTitle = document.title
    const previousBg = document.body.style.background
    const previousColor = document.body.style.color
    document.title = 'Voorstel voor Pursuit Femmes'
    document.body.style.background = '#f6f5f1'
    document.body.style.color = '#191919'

    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const createdRobots = !robots
    const previousRobots = robots?.content ?? ''
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex, nofollow'

    const font = document.createElement('link')
    font.rel = 'stylesheet'
    font.href = 'https://fonts.googleapis.com/css2?family=Darker+Grotesque:wght@400;500;600;700&display=swap'
    document.head.appendChild(font)

    return () => {
      document.title = previousTitle
      document.body.style.background = previousBg
      document.body.style.color = previousColor
      if (createdRobots) robots?.remove()
      else if (robots) robots.content = previousRobots
      font.remove()
    }
  }, [])

  useEffect(() => {
    const nodes = CHAPTERS.map((chapter) => document.getElementById(chapter.id)).filter((node): node is HTMLElement => Boolean(node))
    const onScroll = () => {
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(1, scrolled / height) : 0)
      const marker = window.innerHeight * 0.35
      let current = CHAPTERS[0].id
      for (const node of nodes) {
        if (node.getBoundingClientRect().top <= marker) current = node.id
      }
      setActive(current)
      const ink = document.querySelector('.pf-scene-ink')
      if (ink) {
        const box = ink.getBoundingClientRect()
        const mid = window.innerHeight * 0.5
        setOnInk(box.top < mid && box.bottom > mid)
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="pf">
      <div className="pf-progress" style={{ transform: `scaleX(${progress})` }} />
      <header className="pf-bar">
        <a href="#open"><img src="/pursuit-femmes/logo.png" alt="Pursuit Femmes" /></a>
        <a className="pf-bar-link" href="#investering">Investering</a>
      </header>
      <nav className={onInk ? 'pf-index is-ink' : 'pf-index'} aria-label="Hoofdstukken">
        {CHAPTERS.map((chapter, index) => (
          <a key={chapter.id} href={`#${chapter.id}`} className={active === chapter.id ? 'is-on' : ''} aria-current={active === chapter.id ? 'true' : undefined}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            {chapter.label}
          </a>
        ))}
      </nav>

      <section className="pf-hero" id="open">
        <p className="pf-kicker">Voorstel · Antwerpen</p>
        <h1>Van de eerste klik tot het volgende pak.</h1>
        <p className="pf-lede">Voor Pursuit Femmes. Eerst wat we bouwen en bijhouden. Daarna wat het kost.</p>
        <a className="pf-down" href="#route">Begin bij de route</a>
      </section>

      <section className="pf-scene" id="route">
        <p className="pf-kicker">01 · De route</p>
        <h2>Wat er gebeurt voor ze in de Sint-Michielstraat staat.</h2>
      </section>

      {BEATS.map((beat, index) => (
        <section className={index % 2 === 0 ? 'pf-scene pf-scene-cream' : 'pf-scene'} key={beat.n}>
          <p className="pf-scene-num">{beat.n}</p>
          <h3>{beat.title}</h3>
          <p>{beat.body}</p>
        </section>
      ))}

      <section className="pf-scene pf-scene-ink">
        <p className="pf-scene-num">05</p>
        <h3>Wat jullie elke week zien.</h3>
        <p>Een dashboard op maat. Afspraken, klanten en omzet, en welk kanaal dat bracht. Eén vast moment om de volgende stap te kiezen. Jullie blijven eigenaar van de accounts, het domein en de data. Het advertentiebudget loopt rechtstreeks via het platform.</p>
      </section>

      <section className="pf-inventory">
        <p className="pf-kicker">Elke maand inbegrepen</p>
        <ul>
          {INCLUDED.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="pf-chapter" id="webshop">
        <p className="pf-kicker">02 · De webshop</p>
        <h2>Een plek om te kijken en te kopen, in jullie huis.</h2>
        <div className="pf-split">
          <p>We ontwerpen de shop zodat ze klopt met de winkel. We bouwen haar, voor desktop en voor de telefoon. We testen, dragen over, en spreken af hoe ze live gaat.</p>
          <ul>
            <li>Structuur, vorm en navigatie</li>
            <li>De shop zelf, zodat een klant een stuk kan kiezen</li>
            <li>Oplevering en een plan voor de lancering</li>
            <li>Jullie blijven eigenaar van de shop</li>
          </ul>
        </div>
        <p className="pf-note">Foto’s en teksten die er nog niet zijn, spreken we apart af. Advertenties en de maandelijkse begeleiding zitten hier niet in.</p>
      </section>

      <section className="pf-chapter" id="configurator">
        <p className="pf-kicker">03 · Optie bij de webshop</p>
        <h2>Het volgende pak begint bij de maten die jullie al hebben.</h2>
        <p className="pf-lede pf-lede-left">De eerste keer is het passen in de zaak. Daarna hoeft een volgend stuk niet opnieuw bij nul te beginnen. Zij opent haar dossier, kiest stof, snit en details, en legt de bestelling vast. Jullie blijven de laatste controle. Het blijft maatwerk.</p>

        <div className="pf-config">
          <div className="pf-controls">
            <Choice label="Stuk" options={PIECES} value={piece} onChange={setPiece} />
            <div className="pf-choice">
              <p>Stof</p>
              <div className="pf-swatches" role="group" aria-label="Stof">
                {FABRICS.map((item) => (
                  <button key={item.id} type="button" className={fabricId === item.id ? 'is-on' : ''} aria-pressed={fabricId === item.id} onClick={() => setFabricId(item.id)}>
                    <i style={{ background: item.cloth }} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <Choice label="Snit" options={CUTS} value={cut} onChange={setCut} />
            {piece !== 'broek' && <Choice label="Knopen" options={BUTTONS} value={buttonId} onChange={setButtonId} />}
          </div>

          <article className="pf-ticket" style={{ background: fabric.cloth, color: fabric.ink }} aria-live="polite">
            <p className="pf-ticket-label">Pasdossier</p>
            <Suit
              piece={piece}
              cut={cut}
              cloth={fabric.cloth}
              lining={fabric.lining}
              ink={fabric.ink}
              button={buttonColor}
              covered={button.color === 'current'}
              striped={fabric.striped}
            />
            <dl>
              <div><dt>Stuk</dt><dd>{PIECES.find((item) => item.id === piece)?.label}</dd></div>
              <div><dt>Stof</dt><dd>{fabric.label}</dd></div>
              <div><dt>Snit</dt><dd>{CUTS.find((item) => item.id === cut)?.label}</dd></div>
              {piece !== 'broek' && <div><dt>Knopen</dt><dd>{button.label}</dd></div>}
              <div><dt>Voering</dt><dd style={{ color: fabric.lining }}>Uit de collectie</dd></div>
              <div><dt>Maten</dt><dd>Uit het pasdossier</dd></div>
            </dl>
            <p className="pf-ticket-status">Klaar voor jullie controle.</p>
          </article>
        </div>
        <p className="pf-note">Dit is een schets, met voorbeeldstoffen. De echte stoffen, snitten en knopen komen uit jullie collectie. De prijs staat bij de investering. Het is een optie. De webshop kan zonder.</p>
      </section>

      <section className="pf-chapter" id="investering">
        <p className="pf-kicker">04 · Investering</p>
        <h2>Drie bedragen. Twee opdrachten, en één optie.</h2>
        <div className="pf-prices">
          <article>
            <p className="pf-kicker">Growth Partner</p>
            <h3>Per maand</h3>
            <p className="pf-list"><s>{money(2500)}</s> <span>/ maand</span></p>
            <p className="pf-off">Korting {money(1000)}</p>
            <p className="pf-pay">{money(1500)} <small>excl. btw</small></p>
            <p className="pf-vat">{money(1815)} incl. btw</p>
            <ul>
              <li>Alles uit de route hierboven</li>
              <li>Opzeg van één maand</li>
              <li>Advertentiebudget via het platform</li>
            </ul>
          </article>
          <article>
            <p className="pf-kicker">Webshop</p>
            <h3>Eenmalig</h3>
            <p className="pf-pay">{money(4000)} <small>excl. btw</small></p>
            <p className="pf-vat">{money(4840)} incl. btw</p>
            <ul>
              <li>Ontwerp, bouw en oplevering</li>
              <li>Helft bij de start, helft bij oplevering</li>
              <li>Los van de maandelijkse begeleiding</li>
            </ul>
          </article>
          <article className="is-option">
            <p className="pf-kicker">Optie · bij de webshop</p>
            <h3>Configurator</h3>
            <p className="pf-pay">{money(12000)} <small>excl. btw</small></p>
            <p className="pf-vat">{money(14520)} incl. btw</p>
            <ul>
              <li>Bestellen vanuit het pasdossier</li>
              <li>Stof, snit en details, met jullie controle</li>
              <li>Niet nodig om de webshop te doen</li>
            </ul>
          </article>
        </div>
        <p className="pf-note">Dit voorstel is 30 dagen geldig, tot 18 november 2026. We starten na een schriftelijk akkoord. Alle bedragen zijn exclusief btw.</p>
        <div className="pf-sign">
          <div>
            <p>Aan</p>
            <strong>PURSUIT BV</strong>
            <span>Pursuit Femmes · BTW BE 0762.904.307</span>
            <span>Sint-Michielstraat 21, 2000 Antwerpen</span>
            <span>Zetel Epicealaan 4, 2910 Essen</span>
          </div>
          <div>
            <p>Van</p>
            <strong>verkoop.studio</strong>
            <span>TanguyDeBee BV · BTW BE 1002.613.972</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function Choice<T extends string>({ label, options, value, onChange }: { label: string, options: readonly { id: T, label: string }[], value: T, onChange: (id: T) => void }) {
  return (
    <div className="pf-choice">
      <p>{label}</p>
      <div role="group" aria-label={label}>
        {options.map((option) => (
          <button key={option.id} type="button" className={value === option.id ? 'is-on' : ''} aria-pressed={value === option.id} onClick={() => onChange(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function Suit({ piece, cut, cloth, lining, ink, button, covered, striped }: { piece: string, cut: string, cloth: string, lining: string, ink: string, button: string, covered: boolean, striped: boolean }) {
  const showJacket = piece !== 'broek'
  const showTrousers = piece !== 'blazer'
  const sx = cut === 'tail' ? 0.86 : cut === 'wijd' ? 1.12 : 1
  const body = 'M78 108 L100 108 C106 108 112 120 120 132 C128 120 134 108 140 108 L162 108 L156 176 C154 214 150 246 154 292 L86 292 C90 246 86 214 84 176 Z'
  const sleeveL = 'M78 112 L44 138 L36 206 L62 196 L76 150 L84 176 Z'
  const sleeveR = 'M162 112 L196 138 L204 206 L178 196 L164 150 L156 176 Z'
  const collar = 'M98 108 C108 92 132 92 142 108 C132 116 108 116 98 108 Z'
  const lapelL = 'M114 124 L100 198 L82 172 L104 154 Z'
  const lapelR = 'M126 124 L140 198 L158 172 L136 154 Z'
  const trousers = 'M94 268 H146 V286 L156 292 L168 470 H136 L128 320 L120 304 L112 320 L104 470 H72 L84 292 L94 286 Z'
  const clothPaths = [showTrousers ? trousers : '', showJacket ? body : '', showJacket ? sleeveL : '', showJacket ? sleeveR : ''].filter(Boolean)
  const viewBox = !showJacket ? '20 230 200 270' : !showTrousers ? '8 70 224 250' : '8 70 224 420'
  return (
    <svg className="pf-suit" viewBox={viewBox} aria-hidden="true">
      <defs>
        <clipPath id="pf-cloth">
          {clothPaths.map((d) => <path key={d} d={d} />)}
        </clipPath>
      </defs>
      <g transform={`translate(120 0) scale(${sx} 1) translate(-120 0)`} fill={cloth} stroke={ink} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round">
        {showTrousers && <path d={trousers} />}
        {showJacket && <path d={sleeveL} />}
        {showJacket && <path d={sleeveR} />}
        {showJacket && <path d={body} />}
        {showJacket && <path d={collar} />}
        {striped && (
          <g clipPath="url(#pf-cloth)" fill="none" stroke={ink} strokeWidth="0.7" opacity="0.5">
            {Array.from({ length: 34 }, (_, index) => {
              const x = 16 + index * 6
              return <line key={x} x1={x} y1="80" x2={x} y2="480" />
            })}
          </g>
        )}
        {showTrousers && <path d="M98 300 L92 458 M142 300 L148 458" fill="none" />}
        {showJacket && <path d={lapelL} fill={lining} />}
        {showJacket && <path d={lapelR} fill={lining} />}
        {showJacket && <path d="M146 186 H170" fill="none" />}
        {showJacket && [214, 242].map((y) => (
          <circle key={y} cx="120" cy={y} r="4.4" fill={covered ? cloth : button} stroke={ink} strokeWidth={covered ? 1.4 : 0.7} />
        ))}
      </g>
    </svg>
  )
}
