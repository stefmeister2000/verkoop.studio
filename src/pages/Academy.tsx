import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AcademySignup from '../components/AcademySignup'
import BrandMark from '../components/BrandMark'
import ResponsiveImage from '../components/ResponsiveImage'
import Seo from '../components/Seo'
import { academyFaq, academyLessons, academyTests } from '../data/academy'
import { trackNewsletterConversion } from '../lib/analytics'
import stefDeskSmall from '../assets/stef-desk-640.webp'
import stefNooms from '../assets/stef.webp'
import studioTeam from '../assets/studio-team.webp'
import stefPortrait from '../assets/hero-portrait.webp'
// Loaded only on this page, so the homepage's inlined stylesheet stays within its size budget.
import academyStylesheet from './Academy.css?url'

const number = (index: number) => String(index + 1).padStart(2, '0')
const euro = (value: number) => `€${Number.isInteger(value) ? value : value.toFixed(2).replace('.', ',')}`
const sectionCount = academyLessons.reduce((total, item) => total + item.sections.length, 0)
const contactAcademy = '/contact?interesse=academy'
const practice = ['Pinacello', 'Nooms', 'O’Learys', 'E-Kart']
const whyMeta = ['Je bereikt je klant nog vóór die actief zoekt', 'Je toont je aanbod met beeld en video, waar je doelgroep al scrolt', 'Je test snel welke boodschap aanslaat', 'Je stuurt op aanvragen of verkoop, niet op likes']
const pitfalls = ['Boosten zonder duidelijk doel', 'Budget versnipperd over te veel advertentiesets', 'Drie keer dezelfde advertentie in een andere kleur', 'Cijfers in Ads Manager die niet kloppen met je CRM', 'Opschalen na twee goede dagen']
const path = [
  ['BASIS', 'Doel, aanbod en meting op orde', 'Je weet welke actie telt voor je bedrijf en of je die correct meet, tot in je CRM.'],
  ['LANCEREN', 'Je eerste campagne live', 'Een eenvoudige opzet met een bewust testbudget, met feedback van Stef voor je publiceert.'],
  ['TESTEN', 'Creatives die echt verschillen', 'Drie invalshoeken en een testlog, zodat je ziet wat aanslaat en waarom.'],
  ['VERBETEREN', 'Beslissen op je cijfers', 'Samen je resultaten lezen, je volgende test kiezen en pas opschalen als de cijfers het toelaten.'],
] as const
const included = ['Zes praktische lessen met oefeningen', 'Samen je account, pixel en meting nalopen', 'Feedback op je campagne-opzet en creatives', 'Je resultaten samen lezen en de volgende test kiezen', 'Je eigen campagneplan', 'Je vragen rechtstreeks aan Stef']

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M7 17 17 7M8 7h9v9' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Cross() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
}

function Check() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function Chevron({ back = false }: { back?: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={back ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

/** Elements below the fold fade in once; everything stays visible without JS, on touch screens or with reduced motion. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    const motion = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    if (!root || !('IntersectionObserver' in window) || !motion.matches) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-in')
      observer.unobserve(entry.target)
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    root.querySelectorAll('.ac-reveal').forEach(element => {
      if (element.getBoundingClientRect().top < innerHeight) return
      element.classList.add('is-waiting')
      observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])
  return ref
}

function ConceptTiles() {
  return <div className="ac-concepts">{[['Demo', 'Laat zien hoe het werkt'], ['Situatie', 'Het probleem van je klant'], ['Ervaring', 'Een echte klant vertelt']].map(([name, text], index) => <div key={name} className={`ac-concept ac-concept-${index}`}><span className="ac-concept-art"><i /><i /></span><strong>{name}</strong><small>{text}</small></div>)}</div>
}

/** The hero shows the product itself: a lesson, an ad concept, a test result and the plan you take home. */
function HeroVisual() {
  return <div className="ac-hv" aria-hidden="true">
    <div className="ac-hv-player">
      <div className="ac-hv-bar"><span><i /><i /><i /></span><em>verkoop.studio / academy</em></div>
      <div className="ac-hv-body">
        <span className="ac-mock-label">LES 03 / 06 · CREATIEVE IDEEËN</span>
        <strong>Drie ideeën, geen drie kleuren.</strong>
        <ConceptTiles />
        <div className="ac-hv-task"><span>NU JIJ</span><p>Werk drie invalshoeken uit voor je eigen aanbod.</p><i /></div>
      </div>
    </div>
    <div className="ac-hv-ad">
      <div className="ac-hv-ad-top"><span className="ac-hv-avatar">v.</span><span>jouw merk<small>Gesponsord</small></span><b>···</b></div>
      <div className="ac-hv-ad-art"><span className="ac-hv-ring" /><span className="ac-hv-ring ac-hv-ring-two" /><strong>Laat zien<br />hoe het werkt.</strong></div>
      <div className="ac-hv-ad-cta"><span>Vraag een demo aan</span><b>Meer info</b></div>
    </div>
    <div className="ac-hv-stat">
      <span className="ac-mock-label">RELEVANTE AANVRAGEN</span>
      <svg viewBox="0 0 180 56"><polyline points="4,50 30,46 56,40 82,38 108,28 134,22 160,12 176,8" /><polyline className="ac-hv-stat-b" points="4,50 30,44 56,42 82,40 108,38 134,36 160,34 176,33" /></svg>
      <p><span className="ac-swatch ac-swatch-demo" />Concept A <b>Doorgaan</b></p>
    </div>
    <div className="ac-hv-file"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 3h8l4 4v14H6V3ZM14 3v5h4M9 12h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg><span>mijn-campagneplan.txt<small>Klaar om te downloaden</small></span><span className="ac-tick"><Check /></span></div>
  </div>
}

/** A small, illustrative mock-up per lesson: what you will look at in Ads Manager or your own systems. */
function LessonVisual({ id }: { id: string }) {
  if (id === 'doel') return <div className="ac-mock">
    <span className="ac-mock-label">KIES JE CAMPAGNEDOEL</span>
    <ul className="ac-objectives">{['Bekendheid', 'Verkeer', 'Interactie', 'Leads', 'App-promotie', 'Verkoop'].map(item => <li key={item} className={item === 'Leads' ? 'is-picked' : ''}><span className="ac-radio" />{item}{item === 'Leads' && <b>Past bij je hoofdactie</b>}</li>)}</ul>
    <p className="ac-mock-foot">Hoofdactie <strong>demo-aanvraag</strong></p>
  </div>
  if (id === 'structuur') return <div className="ac-mock">
    <span className="ac-mock-label">DRIE NIVEAUS</span>
    <ol className="ac-tree">
      <li><span>Campagne</span><small>Doel: Leads</small></li>
      <li><span>Advertentieset</span><small>België · Nederlandstalig · testbudget</small></li>
      <li><span>Advertenties</span><small>Drie creatieve invalshoeken</small><div className="ac-tree-ads"><i /><i /><i /></div></li>
    </ol>
  </div>
  if (id === 'creatief') return <div className="ac-mock">
    <span className="ac-mock-label">DRIE IDEEËN, GEEN DRIE KLEUREN</span>
    <ConceptTiles />
  </div>
  if (id === 'bestemming') return <div className="ac-mock">
    <span className="ac-mock-label">DE ROUTE NA EEN KLIK</span>
    <ol className="ac-route">{[['Advertentie', '“Vraag een demo aan”'], ['Landingspagina', 'Zelfde belofte, één actie'], ['Formulier', 'Alleen wat je nodig hebt'], ['Bevestiging', 'Duidelijke volgende stap']].map(([name, text]) => <li key={name}><span className="ac-route-dot"><Check /></span><span>{name}<small>{text}</small></span></li>)}</ol>
  </div>
  if (id === 'meting') return <div className="ac-mock">
    <span className="ac-mock-label">GEMETEN ÉN GECONTROLEERD</span>
    <ul className="ac-events">
      <li className="is-muted"><span>Formulier bekeken</span><small>Nog geen aanvraag</small></li>
      <li><span>Lead</span><small>1× geregistreerd</small><Check /></li>
      <li><span>Aanvraag in CRM</span><small>Zelfde persoon, zelfde moment</small><Check /></li>
      <li><span>Demo gepland</span><small>De uitkomst die telt</small><Check /></li>
    </ul>
  </div>
  return <div className="ac-mock">
    <span className="ac-mock-label">RELEVANTE AANVRAGEN · DAG 14</span>
    <div className="ac-bars">
      <div><span>Concept A</span><i style={{ width: '88%' }} /><b>7</b></div>
      <div><span>Concept B</span><i style={{ width: '50%' }} /><b>4</b></div>
    </div>
    <p className="ac-mock-foot"><span className="ac-live-dot" /> Eerste signaal: <strong>nog geen winnaar</strong></p>
  </div>
}

function TestChart({ selected }: { selected: string }) {
  const x = (day: number) => 24 + day * (556 / 13)
  const y = (value: number) => 168 - value * 19
  return <svg className="ac-chart" viewBox="0 0 640 190" role="img" aria-label="Fictief voorbeeld: cumulatief aantal relevante aanvragen per concept over 14 dagen">
    {[0, 2, 4, 6, 8].map(value => <g key={value}><line x1="24" x2="580" y1={y(value)} y2={y(value)} className="ac-chart-grid" /><text x="596" y={y(value) + 4} className="ac-chart-axis">{value}</text></g>)}
    {academyTests.map(test => {
      const points = test.daily.flatMap((value, day) => value === null ? [] : [`${x(day)},${y(value)}`])
      const last = points[points.length - 1]?.split(',').map(Number)
      return <g key={test.id} className={`ac-chart-line ac-chart-${test.id} ${selected === test.id ? 'is-selected' : ''}`}>
        <polyline points={points.join(' ')} fill="none" />
        {last && <circle cx={last[0]} cy={last[1]} r="4.5" />}
      </g>
    })}
    <text x="24" y="186" className="ac-chart-axis">dag 1</text><text x="580" y="186" textAnchor="end" className="ac-chart-axis">dag 14</text>
  </svg>
}

function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success'>('idle')
  const [error, setError] = useState('')
  const submissionId = useRef('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    setStatus('pending')
    setError('')
    const data = new FormData(event.currentTarget)
    try {
      submissionId.current ||= crypto.randomUUID()
      const response = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(20_000),
        body: JSON.stringify({ email: data.get('email'), company_website: data.get('company_website'), consent: data.get('consent') === 'on', consent_version: 'website-newsletter-v1', lang: 'nl' }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) {
        setError(result.error === 'subscription_preferences' ? 'Je hebt je eerder uitgeschreven. Mail ons als je weer berichten wilt ontvangen.' : response.status === 429 ? 'Even te veel pogingen. Probeer het over enkele minuten opnieuw.' : 'Inschrijven lukte niet. Probeer het later opnieuw.')
        setStatus('idle')
        return
      }
      trackNewsletterConversion(result, submissionId.current)
      setStatus('success')
    } catch {
      setError('Inschrijven lukte niet. Probeer het later opnieuw.')
      setStatus('idle')
    }
  }
  if (status === 'success') return <p className="ac-newsletter-done" role="status"><Check /> Je bent ingeschreven. Nieuwe lessen en tips komen in je inbox.</p>
  return <form className="ac-newsletter" onSubmit={submit} data-clarity-mask="true">
    <label htmlFor="academy-newsletter-email">Nieuwe lessen in je inbox</label>
    <p>Praktische Meta-adstips en nieuwe lessen van verkoop.studio.</p>
    <div className="ac-newsletter-row"><input id="academy-newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="naam@bedrijf.be" /><button type="submit" className="ac-button" disabled={status === 'pending'}>{status === 'pending' ? 'Bezig…' : 'Inschrijven'}</button></div>
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <label className="ac-consent"><input type="checkbox" name="consent" required /><span>Ja, ik ontvang graag marketingtips en nieuws van verkoop.studio per e-mail.</span></label>
    {error && <p className="ac-form-error" role="alert">{error}</p>}
  </form>
}

export default function Academy() {
  const pageRef = useReveal()
  const [slide, setSlide] = useState(0)
  const [testId, setTestId] = useState(academyTests[0].id)
  const [signedUp, setSignedUp] = useState<{ naam: string; via: string } | null>(null)
  const [sticky, setSticky] = useState(false)
  const [stickyArmed, setStickyArmed] = useState(false)
  const slideLesson = academyLessons[slide]
  const test = academyTests.find(item => item.id === testId) ?? academyTests[0]
  const testLesson = academyLessons.findIndex(item => item.id === test.lesson)
  const totals = academyTests.reduce((sum, item) => ({ spend: sum.spend + item.spend, leads: sum.leads + item.leads, relevant: sum.relevant + item.relevant }), { spend: 0, leads: 0, relevant: 0 })
  const thanks = signedUp?.naam ? `Bedankt, ${signedUp.naam}!` : 'Bedankt!'

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('academy-hero-signup')?.getBoundingClientRect()
      const signup = document.getElementById('aanmelden')?.getBoundingClientRect()
      const footer = document.querySelector('.ac-footer')?.getBoundingClientRect()
      const card = document.querySelector('.ac-focus-card')?.getBoundingClientRect()
      const visible = (rect?: DOMRect) => !!rect && rect.top < innerHeight && rect.bottom > 0
      // Hide the bar wherever another join button is already on screen.
      setSticky(!!hero && hero.bottom < 0 && !visible(signup) && !visible(footer) && !visible(card))
      // Mount the bar only once the visitor scrolls, so it never animates while the stylesheet is still loading.
      if (scrollY > 40) setStickyArmed(true)
    }
    update()
    addEventListener('scroll', update, { passive: true })
    addEventListener('resize', update)
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update) }
  }, [])

  function scrollToId(id: string, focus?: string) {
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
      if (focus) setTimeout(() => document.querySelector<HTMLInputElement>(focus)?.focus({ preventScroll: true }), 450)
    })
  }

  function goToSignup() {
    scrollToId('aanmelden', signedUp ? undefined : '#aanmelden input[name="naam"]')
  }

  const joined = (via: string) => (naam: string) => setSignedUp({ naam, via })

  return <div className="academy-page" lang="nl" ref={pageRef}>
    <link rel="stylesheet" href={academyStylesheet} precedence="academy" />
    <Seo title="Meta Ads Academy — leer adverteren met verkoop.studio" description="Leer Meta ads met verkoop.studio. Zes praktische lessen over doel, campagne-opzet, creatief testen en meting, met begeleiding in je eigen account. Meld je aan en Stef neemt persoonlijk contact op." path="/academy" language="nl" />
    <a className="ac-skip" href="#academy-main">Naar de inhoud</a>

    <header className="ac-header">
      <div className="ac-wrap ac-header-inner">
        <div className="ac-identity"><Link to="/" aria-label="verkoop.studio — naar de homepage"><BrandMark /></Link><span className="ac-identity-line" /><a href="#academy-main" className="ac-identity-label">academy</a></div>
        <nav className="ac-pill-nav" aria-label="Academy navigatie"><a href="#aanpak">Aanpak</a><a href="#leerpad">Programma</a><a href="#testlog">Testlog</a><a href="#zo-werkt-het">Zo werkt het</a><a href="#faq">FAQ</a></nav>
        <button className="ac-header-cta" onClick={goToSignup}>Meld je aan</button>
      </div>
    </header>

    <main id="academy-main">
      <section className="ac-hero ac-wrap" aria-labelledby="academy-title">
        <div className="ac-hero-copy">
          <p className="ac-hero-eyebrow"><span className="ac-live-dot" /> Meta Ads Academy <i /> {academyLessons.length} lessen met begeleiding</p>
          <h1 id="academy-title">Leer Meta ads zonder je budget <span>op goed geluk in te zetten.</span></h1>
          <p className="ac-hero-lead">Zes praktische lessen, oefeningen op je eigen aanbod en begeleiding in je eigen account. Meld je aan en Stef neemt persoonlijk contact met je op.</p>
          <div id="academy-hero-signup" className="ac-hero-signup">
            {signedUp ? <div className="ac-welcome-card" role="status">
              <span className="ac-tick"><Check /></span>
              <div><strong>{thanks} Je aanmelding is binnen.</strong><small>Stef neemt persoonlijk contact met je op. Je krijgt ook een bevestiging per mail.</small></div>
            </div> : <AcademySignup formId="academy-hero" onSuccess={joined('academy-hero')} />}
          </div>
          {!signedUp && <ul className="ac-hero-note"><li><Check /> Persoonlijk contact met Stef</li><li><Check /> Leren in je eigen account</li><li><Check /> Voorstel op maat</li></ul>}
          <div className="ac-trust">
            <img src={stefDeskSmall} alt="" width="44" height="44" loading="eager" />
            <p><strong>Door Stef Keppens</strong>, verkoop.studio<span>Uit de praktijk bij {practice.map((name, index) => <b key={name}>{name}{index < practice.length - 1 && <i aria-hidden="true">·</i>}</b>)}</span></p>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section className="ac-wrap ac-outcomes" aria-labelledby="outcomes-title">
        <h2 id="outcomes-title" className="sr-only">Wat je na de academy kunt</h2>
        <ul>
          <li><span>01</span><strong>Een campagne met één helder doel</strong><small>Geen bereik kopen, maar sturen op aanvragen of verkoop.</small></li>
          <li><span>02</span><strong>Drie creatives die echt verschillen</strong><small>Demo, herkenbare situatie en bewijs in plaats van drie kleuren.</small></li>
          <li><span>03</span><strong>Cijfers die je zelf kan controleren</strong><small>Van Ads Manager tot in je CRM, zonder dubbeltellingen.</small></li>
          <li><span>04</span><strong>Een plan voor je volgende test</strong><small>Met een beslismoment, zodat je niet op gevoel bijstuurt.</small></li>
        </ul>
      </section>

      <section id="aanpak" className="ac-focus ac-wrap" aria-labelledby="focus-title">
        <article className="ac-focus-article">
          <p className="ac-dot-kicker"><span /> Over de academy</p>
          <h2 id="focus-title">Leer Meta ads die <span>aanvragen en verkoop opleveren.</span></h2>
          <p className="ac-focus-lead">Veel ondernemers starten met Meta ads zonder plan: de boost-knop, budget verspreid over te veel advertentiesets en beslissingen op basis van een paar klikken. In de Meta Ads Academy pak je het anders aan. Stap voor stap, in je eigen account, met Stef die meekijkt.</p>

          <h3>Waarom Meta ads?</h3>
          <ul className="ac-check-list">{whyMeta.map(item => <li key={item}><span className="ac-list-icon is-yes"><Check /></span>{item}</li>)}</ul>

          <h3>Waar het vaak misloopt</h3>
          <ul className="ac-check-list">{pitfalls.map(item => <li key={item}><span className="ac-list-icon is-no"><Cross /></span>{item}</li>)}</ul>

          <h3>Je traject in de academy</h3>
          <ol className="ac-path">{path.map(([label, title, text], index) => <li key={label}><span className="ac-path-label"><b>{number(index)}</b>{label}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>

          <h3>Van wie je leert</h3>
          <div className="ac-focus-author">
            <img src={stefDeskSmall} alt="" width="56" height="56" loading="lazy" />
            <p><strong>Stef Keppens</strong> werkt vanuit verkoop.studio in Lochristi aan campagnes, landingspagina’s, tracking en conversie voor onder meer Pinacello, O’Learys en E-Kart, en bouwt met Nooms zijn eigen merk op. In de academy leer je de werkwijze die hij daar gebruikt: eerst het doel en de meting, dan pas het budget.</p>
          </div>

          <p className="ac-focus-cta"><Arrow /> Meld je aan en Stef neemt persoonlijk contact met je op om te bekijken waar je staat.</p>
        </article>

        <aside className="ac-focus-card" aria-label="Meta Ads Academy in het kort">
          <figure><ResponsiveImage src={stefNooms} alt="Stef Keppens van verkoop.studio" sizes="340px" loading="lazy" /><figcaption>META ADS ACADEMY</figcaption></figure>
          <div className="ac-focus-card-body">
            <h3>Meta Ads Academy</h3>
            <span className="ac-focus-url">verkoop.studio/academy</span>
            <p>Leer Meta ads die aanvragen en verkoop opleveren, in je eigen account.</p>
            <dl><div><dt>Lessen</dt><dd>{number(academyLessons.length - 1)}</dd></div><div><dt>Begeleiding</dt><dd>1-op-1</dd></div><div><dt>Account</dt><dd>Eigen</dd></div></dl>
            {signedUp ? <p className="ac-focus-done"><Check /> Je aanmelding is binnen.</p> : <button className="ac-button ac-focus-join" onClick={goToSignup}>Meld je aan<Arrow /></button>}
            <small>Prijs op maat, na een kennismaking met Stef.</small>
          </div>
        </aside>
      </section>

      <section className="ac-not ac-wrap" aria-labelledby="not-title">
        <h2 id="not-title" className="ac-reveal">Dit is niet voor wie<span className="ac-not-words"><s>de boost-knop</s> <s>snelle trucs</s><br /><s>een gouden doelgroep</s></span>zoekt. Maar voor wie<br /><span className="ac-blue">zelf wil leren</span><br /><span className="ac-grey">beslissen.</span></h2>
        <figure className="ac-stat-card ac-reveal">
          <ResponsiveImage src={studioTeam} alt="Samen aan het werk in de studio van verkoop.studio" sizes="(max-width: 900px) 100vw, 520px" loading="lazy" />
          <dl><div><dt>Lessen</dt><dd>{number(academyLessons.length - 1)}</dd></div><div><dt>Kennisblokken</dt><dd>{sectionCount}</dd></div><div><dt>Campagneplan</dt><dd>01</dd></div></dl>
        </figure>
        <ul className="ac-pillars ac-reveal">
          <li><strong>Doel</strong><span>Weten wat je wil</span></li>
          <li><strong>Structuur</strong><span>Eenvoud bewaken</span></li>
          <li><strong>Creatief</strong><span>Bewust variëren</span></li>
          <li><strong>Meting</strong><span>Echt controleren</span></li>
        </ul>
      </section>

      <section id="leerpad" className="ac-curriculum ac-wrap" aria-labelledby="curriculum-title">
        <div className="ac-curriculum-top">
          <p className="ac-kicker" id="curriculum-title">WAT JE LEERT · HET PROGRAMMA</p>
          <div className="ac-slider-buttons"><button onClick={() => setSlide(slide === 0 ? academyLessons.length - 1 : slide - 1)} aria-label="Vorige les"><Chevron back /></button><button onClick={() => setSlide(slide === academyLessons.length - 1 ? 0 : slide + 1)} aria-label="Volgende les"><Chevron /></button></div>
        </div>
        <div className="ac-progress-tabs">{academyLessons.map((item, index) => <button key={item.id} className={index === slide ? 'is-active' : index < slide ? 'is-past' : ''} onClick={() => setSlide(index)} aria-label={`Les ${number(index)}: ${item.shortTitle}`} aria-current={index === slide ? 'true' : undefined}><span>{number(index)}</span><em>{item.shortTitle}</em></button>)}</div>
        <div className="ac-slide" key={slideLesson.id}>
          <div className="ac-slide-visual"><LessonVisual id={slideLesson.id} /></div>
          <div className="ac-slide-copy">
            <span className="ac-slide-number">({number(slide)})</span>
            <h3>{slideLesson.title}.</h3>
            <p>{slideLesson.summary}</p>
            <ul>{slideLesson.sections.map(section => <li key={section.title}><Check />{section.title}</li>)}</ul>
            <p className="ac-slide-outcome"><span>NA DEZE LES</span>{slideLesson.outcome}</p>
            <div className="ac-slide-actions"><button className="ac-button" onClick={goToSignup}>Meld je aan<Arrow /></button><span className="ac-slide-hint">Les {number(slide)} van {number(academyLessons.length - 1)}</span></div>
          </div>
        </div>
      </section>

      <section id="testlog" className="ac-testlog-section ac-wrap" aria-labelledby="testlog-title">
        <p className="ac-dot-kicker"><span /> Oefenaccount · fictief voorbeeld</p>
        <h2 id="testlog-title">Leer kijken voorbij<br /><span>de goedkoopste klik.</span></h2>
        <p className="ac-section-intro">Drie advertentieconcepten, veertien dagen. Op kost per aanvraag lijkt één concept de winnaar, je eigen cijfers wijzen een andere aan. Klik op een test en zie welke beslissing je neemt.</p>
        <div className="ac-stats-row"><div><span>UITGAVEN · 14 DAGEN</span><strong>{euro(totals.spend)}</strong></div><div><span>RELEVANTE AANVRAGEN</span><strong className="ac-positive">{totals.relevant} <small>van {totals.leads}</small></strong></div></div>
        <div className="ac-testlog ac-reveal">
          <aside className="ac-testlog-side">
            <span className="ac-testlog-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20V10m6 10V4m6 16v-7m4 7H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>Testlog</span>
            {academyTests.map(item => <button key={item.id} className={item.id === test.id ? 'is-active' : ''} onClick={() => setTestId(item.id)} aria-pressed={item.id === test.id}><span className={`ac-swatch ac-swatch-${item.id}`} /><span>{item.name}<small>{item.relevant} relevant</small></span></button>)}
            <span className="ac-testlog-system"><span className="ac-live-dot" /> verkoop.studio werkplaats</span>
          </aside>
          <div className="ac-testlog-main">
            <div className="ac-testlog-head"><div><strong>Demo-aanvragen</strong><span>Leads · 3 concepten</span></div><code>Relevante aanvragen, cumulatief</code></div>
            <TestChart selected={test.id} />
            <div className="ac-testlog-decision" aria-live="polite"><span className="ac-mock-label">BESLISSING · {test.name.toUpperCase()}</span><strong>{test.verdict}.</strong><p>{test.decision}</p>{testLesson >= 0 && <button className="ac-text-link" onClick={goToSignup}>Dit leer je in les {number(testLesson)}: {academyLessons[testLesson].shortTitle}<Arrow /></button>}</div>
          </div>
          <div className="ac-testlog-table">
            <div className="ac-table-caption"><span>TESTS</span><span>Klik op een test om de beslissing te zien</span></div>
            <div className="ac-row ac-row-head" aria-hidden="true"><span>STATUS</span><span>CONCEPT</span><span>UITGAVEN</span><span>AANVRAGEN</span><span>PER AANVRAAG</span><span>RELEVANT</span><span>PER RELEVANTE</span><span /></div>
            {academyTests.map(item => <button key={item.id} className={`ac-row ${item.id === test.id ? 'is-active' : ''}`} onClick={() => setTestId(item.id)} aria-pressed={item.id === test.id} aria-label={`${item.name}: ${euro(item.spend)} uitgegeven, ${item.leads} aanvragen, waarvan ${item.relevant} relevant`}>
              <span><em className={item.status === 'LOPEND' ? 'ac-status' : 'ac-status ac-status-wait'}>{item.status}</em></span>
              <span className="ac-row-name"><i className={`ac-swatch ac-swatch-${item.id}`} />{item.name}</span>
              <span className="ac-mono">{euro(item.spend)}</span>
              <span className="ac-mono">{item.leads}</span>
              <span className="ac-mono">{euro(Math.round(item.spend / item.leads * 100) / 100)}</span>
              <span className="ac-mono">{item.relevant}</span>
              <span className={`ac-mono ac-strong ${item.id === 'demo' ? 'ac-positive' : item.id === 'situatie' ? 'ac-negative' : ''}`}>{euro(Math.round(item.spend / item.relevant * 100) / 100)}</span>
              <span className="ac-row-arrow"><Arrow /></span>
            </button>)}
          </div>
        </div>
        <p className="ac-fine">Fictieve cijfers om te oefenen. Geen klantgegevens en geen voorspelling van je eigen resultaat.</p>
      </section>

      <section className="ac-process" aria-labelledby="process-title">
        <div className="ac-wrap ac-process-inner">
          <span className="ac-pill-label">HET LEERPROCES</span>
          <h2 id="process-title" className="ac-reveal">Je begrijpt zelf.<br /><span>Je beslist zelf.</span></h2>
          <p className="ac-reveal">Niet door trucs van anderen te kopiëren,<br />maar door elke keuze te kunnen uitleggen.</p>
          <ol className="ac-timeline ac-reveal"><li>Door je doel scherp<br />te stellen</li><li>Door bewust<br />te testen</li><li>Door je cijfers<br />zelf te controleren</li></ol>
          <p className="ac-no-quick"><span>DIT IS GEEN BOOST-KNOP.</span>Dit is leren adverteren met een plan, meting en geduld.</p>
        </div>
      </section>

      <section id="zo-werkt-het" className="ac-plans ac-wrap" aria-labelledby="plans-title">
        <div className="ac-section-heading ac-section-heading-center"><div><p className="ac-dot-kicker"><span /> Zo werkt het</p><h2 id="plans-title">Geen cursus om door te klikken.<br /><span>Je leert het in je eigen account.</span></h2></div></div>
        <div className="ac-plan-grid">
          <article className="ac-plan ac-reveal">
            <div className="ac-plan-top"><span>01–03</span><span>Van aanmelding tot start</span></div>
            <ol className="ac-next-steps ac-how-steps">
              <li><span>1</span><div><strong>Je meldt je aan</strong><small>Laat je naam, e-mailadres en telefoonnummer achter. Meer hoeft niet.</small></div></li>
              <li><span>2</span><div><strong>Kennismaking met Stef</strong><small>Stef neemt contact met je op en bespreekt je doel, je ervaring en je budget.</small></div></li>
              <li><span>3</span><div><strong>Voorstel en start</strong><small>Je krijgt een voorstel op maat. Daarna beslis je, en start je traject in je eigen account.</small></div></li>
            </ol>
            <button className="ac-button ac-button-outline" onClick={goToSignup}>Meld je aan<Arrow /></button>
            <small>Eerst je doel bespreken, dan een voorstel.</small>
          </article>
          <article className="ac-plan ac-plan-featured ac-reveal">
            <div className="ac-plan-top"><span>META ADS ACADEMY</span><span>Met Stef aan je zijde</span></div>
            <h3>Wat je krijgt</h3>
            <p className="ac-plan-price">Op maat</p>
            <p>Je leert het in je eigen Ads Manager, aan je eigen aanbod, met iemand die meekijkt.</p>
            <ul>{included.map(item => <li key={item}><Check />{item}</li>)}</ul>
            <button className="ac-button ac-button-light" onClick={goToSignup}>Meld je aan<Arrow /></button>
            <small>Prijs en ritme na een kennismakingsgesprek. Advertentiebudget is niet inbegrepen.</small>
          </article>
        </div>
      </section>

      <section id="aanmelden" className="ac-signup-section ac-wrap" aria-labelledby="signup-title">
        <div className="ac-signup-intro">
          <p className="ac-dot-kicker"><span /> Aanmelden</p>
          <h2 id="signup-title">Meld je aan.<br /><span>Stef neemt contact op.</span></h2>
          <p>Vul het formulier in. Stef bekijkt je aanmelding en neemt persoonlijk contact met je op om je doel en de opzet van je traject te bespreken.</p>
          <ol className="ac-next-steps">
            <li><span>1</span><div><strong>Vul het formulier in</strong><small>Je contactgegevens en, als je wil, je ervaring en budget.</small></div></li>
            <li><span>2</span><div><strong>Stef neemt contact op</strong><small>Telefonisch of per e-mail, om te bekijken waar je staat.</small></div></li>
            <li><span>3</span><div><strong>Je krijgt een voorstel</strong><small>Op maat van je doel. Daarna beslis je.</small></div></li>
          </ol>
          <p className="ac-privacy">We gebruiken je gegevens alleen om contact met je op te nemen over de academy. Nieuwsbrieven krijg je enkel als je dat aanvinkt.</p>
        </div>
        <div className="ac-signup-card">
          {signedUp ? <div className="ac-signup-done" role="status">
            <span className="ac-tick ac-tick-large"><Check /></span>
            <h3>{thanks}</h3>
            <p>Je aanmelding is binnen. Stef neemt persoonlijk contact met je op om je doel en de opzet te bespreken. Je krijgt ook een bevestiging per mail.</p>
            <div><Link className="ac-button" to="/cases">Bekijk intussen onze cases<Arrow /></Link></div>
          </div> : <AcademySignup formId="academy-signup" variant="full" onSuccess={joined('academy-signup')} />}
        </div>
      </section>

      <section className="ac-honest ac-wrap" aria-labelledby="honest-title">
        <div className="ac-honest-copy ac-reveal">
          <h2 id="honest-title">We beloven geen ROAS.<br /><span>Je leert keuzes maken.</span></h2>
          <p>Geen gegarandeerde resultaten. Geen losse dashboardscreenshots.<br />Alleen een aanpak die je begrijpt, kan uitleggen en kan herhalen.</p>
          <p className="ac-strong-line">Je leert de werkwijze die we ook voor onze klanten gebruiken.</p>
          <p className="ac-small">Benieuwd hoe dat in de praktijk loopt?</p>
          <div className="ac-hero-actions"><Link className="ac-button" to="/cases">Bekijk onze cases<Arrow /></Link><Link className="ac-text-link" to="/meta-ads">Liever uitbesteden?<Arrow diagonal /></Link></div>
        </div>
        <figure className="ac-honest-photo ac-reveal"><ResponsiveImage src={stefPortrait} alt="Stef Keppens van verkoop.studio" sizes="(max-width: 900px) 100vw, 520px" loading="lazy" /></figure>
      </section>

      <section id="faq" className="ac-faq ac-wrap" aria-labelledby="faq-title">
        <div><p className="ac-dot-kicker"><span /> Goed om te weten</p><h2 id="faq-title">Nog even dit.</h2><p>Staat je vraag er niet bij? <Link to={contactAcademy}>Stel ze rechtstreeks.</Link></p></div>
        <div className="ac-glass ac-faq-list">{academyFaq.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="ac-final ac-wrap" aria-labelledby="final-title">
        <div className="ac-final-inner ac-reveal"><div><p className="ac-kicker">JE HOEFT NIET ALLES AL TE WETEN</p><h2 id="final-title">Begin met één goede stap.</h2><p>Meld je aan. Stef neemt contact op en samen bekijken we waar je staat.</p></div><div className="ac-final-actions"><button className="ac-button ac-button-light" onClick={goToSignup}>Meld je aan<Arrow /></button><Link className="ac-text-link ac-text-link-light" to={contactAcademy}>Of stel eerst een vraag<Arrow diagonal /></Link></div></div>
      </section>
    </main>

    {!signedUp && stickyArmed && <div className={`ac-sticky ${sticky ? 'is-visible' : ''}`} aria-hidden={!sticky}>
      <p><strong>Meta Ads Academy</strong><span>Leer Meta ads met Stef, in je eigen account</span></p>
      <button className="ac-button" tabIndex={sticky ? 0 : -1} onClick={goToSignup}>Meld je aan<Arrow /></button>
    </div>}

    <footer className="ac-footer">
      <div className="ac-wrap">
        <div className="ac-footer-top">
          <div><div className="ac-identity"><Link to="/" aria-label="verkoop.studio — naar de homepage"><BrandMark /></Link><span className="ac-identity-line" /><span className="ac-identity-label">academy</span></div><p>Leer Meta ads met een plan. Een praktisch leertraject van verkoop.studio voor ondernemers en marketeers.</p></div>
          <NewsletterForm />
        </div>
        <div className="ac-footer-columns">
          <div><h3>Academy</h3><a href="#leerpad">Programma</a><a href="#testlog">Testlog</a><a href="#zo-werkt-het">Zo werkt het</a><a href="#aanmelden">Aanmelden</a></div>
          <div><h3>verkoop.studio</h3><Link to="/">Home</Link><Link to="/meta-ads">Meta Ads</Link><Link to="/cases">Cases</Link><Link to="/agency">Agency</Link></div>
          <div><h3>Contact</h3><a href="mailto:stefkeppens@gmail.com">stefkeppens@gmail.com</a><Link to={contactAcademy}>Plan een gesprek</Link><span>Lochristi, België</span></div>
          <div><h3>Goed om te weten</h3><span>Niet verbonden aan of gecertificeerd door Meta.</span><span>Geen garantie op resultaten.</span></div>
        </div>
        <p className="ac-copyright">© {new Date().getFullYear()} verkoop.studio. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  </div>
}
