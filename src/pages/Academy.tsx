import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AcademySignup from '../components/AcademySignup'
import BrandMark from '../components/BrandMark'
import ResponsiveImage from '../components/ResponsiveImage'
import Seo from '../components/Seo'
import { academyFaq, academyModules, academyTests } from '../data/academy'
import { trackNewsletterConversion } from '../lib/analytics'
import stefDeskSmall from '../assets/stef-desk-640.webp'
import stefNooms from '../assets/stef.webp'
import studioTeam from '../assets/studio-team.webp'
import stefPortrait from '../assets/hero-portrait.webp'
// Loaded only on this page, so the homepage's inlined stylesheet stays within its size budget.
import academyStylesheet from './Academy.css?url'

const number = (index: number) => String(index + 1).padStart(2, '0')
const euro = (value: number) => {
  const [whole, cents] = value.toFixed(2).split('.')
  return `€${whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${cents === '00' ? '' : `,${cents}`}`
}
const ratio = (value: number) => value.toFixed(2).replace('.', ',')
const contactAcademy = '/contact?interesse=academy'
const practice = ['Pinacello', 'Nooms', 'O’Learys', 'E-Kart']
const whyMeta = ['Je bereikt kopers nog vóór ze actief zoeken', 'Je toont je product met beeld en video, waar je doelgroep al scrolt', 'Catalogus-ads tonen automatisch het juiste product aan de juiste persoon', 'Je kan opschalen zolang je cijfers het toelaten']
const pitfalls = ['Sturen op de ROAS in Ads Manager zonder die naast je webshopomzet te leggen', 'Geen break-even ROAS kennen, en dus niet weten of je winst maakt', 'Het budget verdubbelen na twee goede dagen', 'Retargeting die vooral mensen bereikt die toch al zouden kopen', 'Eén winnende creative opbranden tot de resultaten instorten']
const stages = [
  ['BOUWEN', 'Tracking met pixel en Conversions API, je break-even ROAS en een account dat kan groeien.'],
  ['LANCEREN', 'Je prospecting- en retargetingcampagnes live, met feedback van Stef voor je publiceert.'],
  ['OPTIMALISEREN', 'Elke week creatives testen en bijsturen op MER, nieuwe klanten en LTV.'],
  ['SCHALEN', 'Budget, doelgroepen en landen opschalen met vaste beslisregels.'],
] as const
const afterwards = ['Je kent je break-even ROAS en je maximale kost per nieuwe klant', 'Je tracking klopt, van Meta tot in je webshop', 'Je hebt elke week nieuwe creatives om te testen', 'Je weet wanneer je opschaalt, en wanneer niet']
const included = ['Tracking, pixel en Conversions API samen nalopen', 'Je break-even ROAS, MER-doel en maximale CAC', 'Een accountstructuur die kan groeien', 'Een testritme voor creatives', 'Retargeting en retentie die je LTV verhogen', 'Een schaalplan met beslisregels', 'Je vragen rechtstreeks aan Stef']

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
  return <div className="ac-concepts">{[['UGC', 'Een klant toont het product'], ['Demo', 'Het product in gebruik'], ['Aanbod', 'Bundel of tijdelijke actie']].map(([name, text], index) => <div key={name} className={`ac-concept ac-concept-${index}`}><span className="ac-concept-art"><i /><i /></span><strong>{name}</strong><small>{text}</small></div>)}</div>
}

const spendBars = [30, 36, 40, 48, 55, 62, 70, 80]
const merLine = [34, 31, 33, 30, 32, 29, 31, 30]

/** The hero shows where the academy leads: a webshop that grows its budget while its MER holds. Example figures. */
function HeroVisual() {
  return <div className="ac-hv" aria-hidden="true">
    <div className="ac-hv-dash">
      <div className="ac-hv-bar"><span><i /><i /><i /></span><em>schaalplan · voorbeeld</em></div>
      <div className="ac-hv-body">
        <span className="ac-mock-label">LAATSTE 8 WEKEN</span>
        <div className="ac-hv-kpis">
          <div><small>Ad spend</small><strong>€12.400</strong><em>+38%</em></div>
          <div><small>Omzet</small><strong>€41.200</strong><em>+31%</em></div>
          <div><small>MER</small><strong>3,3</strong><em>doel 2,8</em></div>
          <div><small>Nieuwe klanten</small><strong>612</strong><em>+27%</em></div>
        </div>
        <svg className="ac-hv-chart" viewBox="0 0 300 84">
          {spendBars.map((height, index) => <rect key={index} x={10 + index * 36} y={82 - height * .85} width="22" height={height * .85} rx="4" />)}
          <polyline points={merLine.map((y, index) => `${21 + index * 36},${y}`).join(' ')} />
        </svg>
        <p className="ac-hv-legend"><span><i className="is-bar" />Budget</span><span><i className="is-line" />MER</span><b>Schalen</b></p>
      </div>
    </div>
    <div className="ac-hv-ad">
      <div className="ac-hv-ad-top"><span className="ac-hv-avatar">v.</span><span>jouw webshop<small>Gesponsord</small></span><b>···</b></div>
      <div className="ac-hv-ad-art"><span className="ac-hv-ring" /><span className="ac-hv-ring ac-hv-ring-two" /><span className="ac-hv-product" /><strong>Bestseller.<br />Nu met gratis levering.</strong></div>
      <div className="ac-hv-ad-cta"><span>jouwwebshop.be</span><b>Shop nu</b></div>
    </div>
    <div className="ac-hv-stat ac-hv-ltv">
      <span className="ac-mock-label">KLANTWAARDE (LTV)</span>
      <div><span>1e aankoop</span><i style={{ width: '48%' }} /><b>€58</b></div>
      <div><span>90 dagen</span><i style={{ width: '80%' }} /><b>€96</b></div>
      <div><span>180 dagen</span><i style={{ width: '100%' }} /><b>€121</b></div>
    </div>
    <div className="ac-hv-file"><span>Retargeting · catalogus<small>Winkelwagen · 7 dagen</small></span><b>Actief</b></div>
  </div>
}

/** A small, illustrative mock-up per topic: what you look at in Ads Manager or your webshop. */
function ModuleVisual({ id }: { id: string }) {
  if (id === 'tracking') return <div className="ac-mock">
    <span className="ac-mock-label">AANKOOPDATA · VOORBEELD</span>
    <ul className="ac-events">{[['PageView', 'Pixel + CAPI'], ['AddToCart', 'Pixel + CAPI'], ['InitiateCheckout', 'Pixel + CAPI'], ['Purchase', '1× geteld, ontdubbeld']].map(([event, text]) => <li key={event}><span>{event}</span><small>{text}</small></li>)}</ul>
    <p className="ac-mock-foot">Ads Manager naast Shopify <strong>afwijking 4%</strong></p>
  </div>
  if (id === 'rendement') return <div className="ac-mock">
    <span className="ac-mock-label">REKENVOORBEELD</span>
    <dl className="ac-calc">
      <div><dt>Gemiddelde orderwaarde</dt><dd>€60</dd></div>
      <div><dt>Marge na product, verzending en kosten</dt><dd>50%</dd></div>
      <div className="is-key"><dt>Break-even ROAS</dt><dd>2,0</dd></div>
      <div><dt>Klantwaarde na 90 dagen</dt><dd>€96</dd></div>
      <div className="is-key"><dt>Max. kost per nieuwe klant</dt><dd>€48</dd></div>
    </dl>
  </div>
  if (id === 'structuur') return <div className="ac-mock">
    <span className="ac-mock-label">BUDGETVERDELING · VOORBEELD</span>
    <ul className="ac-stack">{[['Prospecting', 'Advantage+ · brede doelgroep', 75], ['Retargeting', 'Catalogus · bezoekers en winkelwagens', 15], ['Testing', 'Nieuwe creatives tegen de winnaar', 10]].map(([name, text, share]) => <li key={name}><div><strong>{name}</strong><small>{text}</small></div><b>{share}%</b><i style={{ width: `${share}%` }} /></li>)}</ul>
  </div>
  if (id === 'creatives') return <div className="ac-mock">
    <span className="ac-mock-label">DRIE INVALSHOEKEN, GEEN DRIE KLEUREN</span>
    <ConceptTiles />
    <p className="ac-mock-foot">Testritme <strong>elke week nieuwe hooks</strong></p>
  </div>
  if (id === 'retargeting') return <div className="ac-mock">
    <span className="ac-mock-label">VAN BEZOEKER NAAR VASTE KLANT</span>
    <ol className="ac-route">{[['Product bekeken', 'Catalogus-ads · 14 dagen'], ['In winkelwagen', 'Herinnering · 7 dagen'], ['Gekocht', 'Cross-sell · 30 dagen'], ['Vaste klant', 'E-mail en ads · herhaalaankoop']].map(([name, text]) => <li key={name}><span className="ac-route-dot" /><span>{name}<small>{text}</small></span></li>)}</ol>
  </div>
  return <div className="ac-mock">
    <span className="ac-mock-label">BUDGET EN MER PER WEEK · VOORBEELD</span>
    <svg className="ac-scale-chart" viewBox="0 0 300 110" aria-hidden="true">
      {spendBars.map((height, index) => <rect key={index} x={10 + index * 36} y={104 - height} width="22" height={height} rx="4" />)}
      <polyline points={merLine.map((y, index) => `${21 + index * 36},${y + 4}`).join(' ')} />
    </svg>
    <p className="ac-mock-foot">Beslisregel <strong>+20% budget zolang MER ≥ 2,8</strong></p>
  </div>
}

function TestChart({ selected }: { selected: string }) {
  const x = (day: number) => 24 + day * (556 / 13)
  const y = (value: number) => 168 - value * (150 / 32)
  return <svg className="ac-chart" viewBox="0 0 640 190" role="img" aria-label="Fictief voorbeeld: cumulatief aantal nieuwe klanten per creative over 14 dagen">
    {[0, 8, 16, 24, 32].map(value => <g key={value}><line x1="24" x2="580" y1={y(value)} y2={y(value)} className="ac-chart-grid" /><text x="592" y={y(value) + 4} className="ac-chart-axis">{value}</text></g>)}
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
  if (status === 'success') return <p className="ac-newsletter-done" role="status"> Je bent ingeschreven. Nieuwe tips komen in je inbox.</p>
  return <form className="ac-newsletter" onSubmit={submit} data-clarity-mask="true">
    <label htmlFor="academy-newsletter-email">Meta-adstips in je inbox</label>
    <p>Praktische tips over Meta ads, ROAS en opschalen van verkoop.studio.</p>
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
  const topic = academyModules[slide]
  const test = academyTests.find(item => item.id === testId) ?? academyTests[0]
  const testModule = academyModules.find(item => item.id === test.module)
  const totals = academyTests.reduce((sum, item) => ({ spend: sum.spend + item.spend, purchases: sum.purchases + item.purchases, newCustomers: sum.newCustomers + item.newCustomers }), { spend: 0, purchases: 0, newCustomers: 0 })
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

  const swipeStart = useRef<number | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // On phones the topic tabs scroll sideways; keep the active one in view without moving the page.
    const tabs = tabsRef.current
    const active = tabs?.querySelector<HTMLElement>('.is-active')
    if (tabs && active && tabs.scrollWidth > tabs.clientWidth) tabs.scrollTo({ left: active.offsetLeft - 16, behavior: 'smooth' })
  }, [slide])
  const lastModule = academyModules.length - 1
  const wrap = (index: number) => index < 0 ? lastModule : index > lastModule ? 0 : index
  const showSlide = (index: number) => setSlide(wrap(index))
  const step = (delta: number) => setSlide(current => wrap(current + delta))
  function endSwipe(x: number) {
    if (swipeStart.current === null) return
    const distance = x - swipeStart.current
    swipeStart.current = null
    if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1)
  }

  return <div className="academy-page" lang="nl" ref={pageRef}>
    <link rel="stylesheet" href={academyStylesheet} precedence="academy" />
    <Seo title="Meta Ads Academy — schaal je webshop met Meta ads" description="Leer Meta ads voor ecommerce met verkoop.studio: tracking en Conversions API, break-even ROAS, MER en LTV, retargeting en opschalen zonder je marge te verbranden. Meld je aan en Stef neemt persoonlijk contact op." path="/academy" language="nl" />
    <a className="ac-skip" href="#academy-main">Naar de inhoud</a>

    <header className="ac-header">
      <div className="ac-wrap ac-header-inner">
        <div className="ac-identity"><Link to="/" aria-label="verkoop.studio — naar de homepage"><BrandMark /></Link><span className="ac-identity-line" /><a href="#academy-main" className="ac-identity-label">academy</a></div>
        <nav className="ac-pill-nav" aria-label="Academy navigatie"><a href="#aanpak">Aanpak</a><a href="#programma">Programma</a><a href="#testlog">Testlog</a><a href="#zo-werkt-het">Zo werkt het</a><a href="#faq">FAQ</a></nav>
        <button className="ac-header-cta" onClick={goToSignup}>Meld je aan</button>
      </div>
    </header>

    <main id="academy-main">
      <section className="ac-hero ac-wrap" aria-labelledby="academy-title">
        <div className="ac-hero-copy">
          <p className="ac-hero-eyebrow"><span className="ac-live-dot" /> Meta Ads Academy <i /> voor webshops</p>
          <h1 id="academy-title">Schaal je webshop met Meta ads <span>naar je volgende omzetmijlpaal.</span></h1>
          <p className="ac-hero-lead">Van tracking die klopt en een break-even ROAS tot retargeting, LTV en opschalen in stappen. Je leert het in je eigen account, met Stef die meekijkt.</p>
          <div id="academy-hero-signup" className="ac-hero-signup">
            {signedUp ? <div className="ac-welcome-card" role="status">
              
              <div><strong>{thanks} Je aanmelding is binnen.</strong><small>Stef neemt persoonlijk contact met je op. Je krijgt ook een bevestiging per mail.</small></div>
            </div> : <AcademySignup formId="academy-hero" onSuccess={joined('academy-hero')} />}
          </div>
          {!signedUp && <ul className="ac-hero-note"><li> Schalen op winst, niet op gevoel</li><li> ROAS, MER en LTV die kloppen</li><li> In je eigen account</li></ul>}
          <div className="ac-trust">
            <img src={stefDeskSmall} alt="" width="44" height="44" loading="eager" />
            <p><strong>Door Stef Keppens</strong>, verkoop.studio<span>Uit de praktijk bij {practice.map((name, index) => <b key={name}>{name}{index < practice.length - 1 && <i aria-hidden="true">·</i>}</b>)}</span></p>
          </div>
        </div>
        <HeroVisual />
      </section>

      <section id="aanpak" className="ac-focus ac-wrap" aria-labelledby="focus-title">
        <article className="ac-focus-article">
          <p className="ac-dot-kicker"><span /> Over de academy</p>
          <h2 id="focus-title">Schaal je webshop met Meta ads, <span>op winst.</span></h2>
          <p className="ac-focus-lead">Veel webshops lopen vast op hetzelfde punt: zodra het budget omhoog gaat, zakt de ROAS en weet niemand waarom. Meestal ligt het niet aan Meta, maar aan de meting, de marges of de creatives. In de academy krijg je die drie op orde, zodat je met vertrouwen kan opschalen.</p>

          <h3>Waarom Meta ads voor je webshop?</h3>
          <ul className="ac-check-list is-yes">{whyMeta.map(item => <li key={item}>{item}</li>)}</ul>

          <h3>Waar het vaak misloopt</h3>
          <ul className="ac-check-list is-no">{pitfalls.map(item => <li key={item}>{item}</li>)}</ul>

          <h3>Jouw traject in de academy</h3>
          <ol className="ac-stages">{stages.map(([label, text], index) => <li key={label}><span className="ac-stage-number">{number(index)}</span><div><strong>{label}</strong><p>{text}</p></div></li>)}</ol>

          <h3>Wat je na het traject kan</h3>
          <ul className="ac-plain-list">{afterwards.map(item => <li key={item}>{item}</li>)}</ul>

          <h3>Van wie je leert</h3>
          <div className="ac-focus-author">
            <img src={stefDeskSmall} alt="" width="56" height="56" loading="lazy" />
            <p><strong>Stef Keppens</strong> werkt vanuit verkoop.studio aan de ecommerce- en groeikant van merken als Pinacello, en bouwt met Nooms zijn eigen webshopmerk op. In de academy leer je de werkwijze die hij daar gebruikt: eerst je tracking en marges op orde, dan pas het budget omhoog.</p>
          </div>

          <div className="ac-focus-join">
            <p><strong>Meld je aan voor de academy.</strong></p>
            <p>Prijs op maat, na een kennismaking met Stef.</p>
            <p>Meld je nu aan en bouw aan je volgende mijlpaal.</p>
            {!signedUp && <button className="ac-button" onClick={goToSignup}>Meld je aan</button>}
          </div>
        </article>

        <aside className="ac-focus-card" aria-label="Meta Ads Academy in het kort">
          <figure><ResponsiveImage src={stefNooms} alt="Stef Keppens van verkoop.studio" sizes="340px" loading="lazy" /><figcaption>META ADS ACADEMY</figcaption></figure>
          <div className="ac-focus-card-body">
            <h3>Meta Ads Academy</h3>
            <span className="ac-focus-url">verkoop.studio/academy</span>
            <p>Leer je webshop schalen met Meta ads.</p>
            <dl><div><dt>Voor</dt><dd>Webshops</dd></div><div><dt>Begeleiding</dt><dd>1-op-1</dd></div><div><dt>Account</dt><dd>Eigen</dd></div></dl>
            {signedUp ? <p className="ac-focus-done"> Je aanmelding is binnen.</p> : <button className="ac-button ac-focus-join-button" onClick={goToSignup}>Meld je aan</button>}
            <small>Prijs op maat, na een kennismaking met Stef.</small>
          </div>
        </aside>
      </section>

      <section id="programma" className="ac-curriculum ac-wrap" aria-labelledby="curriculum-title">
        <div className="ac-curriculum-top">
          <div><p className="ac-kicker">WAAR WE DIEP OP INGAAN</p><h2 id="curriculum-title">Meta ads die schalen. <span>Onderdeel per onderdeel.</span></h2></div>
          <div className="ac-slider-buttons"><button onClick={() => step(-1)}>Vorige</button><button onClick={() => step(1)}>Volgende</button></div>
        </div>
        <div className="ac-progress-tabs" ref={tabsRef}>{academyModules.map((item, index) => <button key={item.id} className={index === slide ? 'is-active' : index < slide ? 'is-past' : ''} onClick={() => setSlide(index)} aria-label={item.shortTitle} aria-current={index === slide ? 'true' : undefined}><span>{number(index)}</span><em>{item.shortTitle}</em></button>)}</div>
        <div className="ac-slide" key={topic.id} onTouchStart={event => { swipeStart.current = event.touches[0].clientX }} onTouchEnd={event => endSwipe(event.changedTouches[0].clientX)}>
          <div className="ac-slide-visual"><ModuleVisual id={topic.id} /></div>
          <div className="ac-slide-copy">
            <span className="ac-slide-number">{topic.tag}</span>
            <h3>{topic.title}.</h3>
            <p>{topic.summary}</p>
            <ul>{topic.points.map(point => <li key={point}>{point}</li>)}</ul>
            <p className="ac-slide-outcome"><span>WAT JE EROVER HEBT</span>{topic.outcome}</p>
            <div className="ac-slide-actions"><button className="ac-button" onClick={goToSignup}>Meld je aan</button></div>
          </div>
        </div>
      </section>

      <section id="testlog" className="ac-testlog-section ac-wrap" aria-labelledby="testlog-title">
        <p className="ac-dot-kicker"><span /> Webshop-account · fictief voorbeeld</p>
        <h2 id="testlog-title">Leer kijken voorbij<br /><span>de hoogste ROAS.</span></h2>
        <p className="ac-section-intro">Drie creatives, veertien dagen, dezelfde webshop. In Ads Manager lijkt de kortingsactie de winnaar. Kijk je naar nieuwe klanten en marge, dan wijst een andere creative de weg. Klik op een test en zie welke beslissing je neemt.</p>
        <div className="ac-stats-row"><div><span>UITGAVEN · 14 DAGEN</span><strong>{euro(totals.spend)}</strong></div><div><span>NIEUWE KLANTEN</span><strong className="ac-positive">{totals.newCustomers} <small>van {totals.purchases} aankopen</small></strong></div></div>
        <div className="ac-testlog ac-reveal">
          <aside className="ac-testlog-side">
            <span className="ac-testlog-badge">Testlog</span>
            {academyTests.map(item => <button key={item.id} className={item.id === test.id ? 'is-active' : ''} onClick={() => setTestId(item.id)} aria-pressed={item.id === test.id}><span className={`ac-swatch ac-swatch-${item.id}`} /><span>{item.name}<small>{item.newCustomers} nieuwe klanten</small></span></button>)}
            <span className="ac-testlog-system"><span className="ac-live-dot" /> verkoop.studio werkplaats</span>
          </aside>
          <div className="ac-testlog-main">
            <div className="ac-testlog-head"><div><strong>Webshop · aankopen</strong><span>3 creatives</span></div><code>Nieuwe klanten, cumulatief</code></div>
            <TestChart selected={test.id} />
            <div className="ac-testlog-decision" aria-live="polite"><span className="ac-mock-label">BESLISSING · {test.name.toUpperCase()}</span><strong>{test.verdict}.</strong><p>{test.decision}</p>{testModule && <button className="ac-text-link" onClick={() => { showSlide(academyModules.indexOf(testModule)); scrollToId('programma') }}>Hierover gaat: {testModule.shortTitle}</button>}</div>
          </div>
          <div className="ac-testlog-table">
            <div className="ac-table-caption"><span>TESTS</span><span>Klik op een test om de beslissing te zien</span></div>
            <div className="ac-row ac-row-head" aria-hidden="true"><span>STATUS</span><span>CREATIVE</span><span>UITGAVEN</span><span>AANKOPEN</span><span>ROAS</span><span>NIEUWE KLANTEN</span><span>PER NIEUWE KLANT</span><span /></div>
            {academyTests.map(item => <button key={item.id} className={`ac-row ${item.id === test.id ? 'is-active' : ''}`} onClick={() => setTestId(item.id)} aria-pressed={item.id === test.id} aria-label={`${item.name}: ${euro(item.spend)} uitgegeven, ROAS ${ratio(item.revenue / item.spend)}, ${item.newCustomers} nieuwe klanten`}>
              <span><em className={item.status === 'LOPEND' ? 'ac-status' : 'ac-status ac-status-wait'}>{item.status}</em></span>
              <span className="ac-row-name"><i className={`ac-swatch ac-swatch-${item.id}`} />{item.name}</span>
              <span className="ac-mono">{euro(item.spend)}</span>
              <span className="ac-mono">{item.purchases}</span>
              <span className="ac-mono">{ratio(item.revenue / item.spend)}</span>
              <span className="ac-mono">{item.newCustomers}</span>
              <span className={`ac-mono ac-strong ${item.id === 'demo' ? 'ac-positive' : item.id === 'situatie' ? 'ac-negative' : ''}`}>{euro(Math.round(item.spend / item.newCustomers * 100) / 100)}</span>
              <span className="ac-row-arrow"></span>
            </button>)}
          </div>
        </div>
        <p className="ac-fine">Fictieve cijfers om te oefenen. Geen klantgegevens en geen voorspelling van je eigen resultaat.</p>
      </section>

      <section className="ac-not ac-wrap" aria-labelledby="not-title">
        <h2 id="not-title" className="ac-reveal">Dit is niet voor wie<span className="ac-not-words"><s>de boost-knop</s> <s>snelle trucs</s><br /><s>een winning-product-hack</s></span>zoekt. Maar voor wie<br /><span className="ac-blue">rendabel wil</span><br /><span className="ac-grey">opschalen.</span></h2>
        <figure className="ac-stat-card ac-reveal">
          <ResponsiveImage src={studioTeam} alt="Samen aan het werk in de studio van verkoop.studio" sizes="(max-width: 900px) 100vw, 520px" loading="lazy" />
          <dl><div><dt>Totaal rendement</dt><dd>MER</dd></div><div><dt>Klantwaarde</dt><dd>LTV</dd></div><div><dt>Server-tracking</dt><dd>CAPI</dd></div></dl>
        </figure>
        <ul className="ac-pillars ac-reveal">
          <li><strong>Meten</strong><span>Weten wat klopt</span></li>
          <li><strong>Rendement</strong><span>Sturen op winst</span></li>
          <li><strong>Creatives</strong><span>Altijd nieuwe winnaars</span></li>
          <li><strong>Schalen</strong><span>Met beslisregels</span></li>
        </ul>
      </section>

      <section id="zo-werkt-het" className="ac-plans ac-wrap" aria-labelledby="plans-title">
        <div className="ac-section-heading ac-section-heading-center"><div><p className="ac-dot-kicker"><span /> Zo werkt het</p><h2 id="plans-title">Geen cursus om door te klikken.<br /><span>Je leert het in je eigen account.</span></h2></div></div>
        <div className="ac-plan-grid">
          <article className="ac-plan ac-reveal">
            <div className="ac-plan-top"><span>01–03</span><span>Van aanmelding tot start</span></div>
            <ol className="ac-next-steps ac-how-steps">
              <li><span>1</span><div><strong>Je meldt je aan</strong><small>Laat je gegevens en je webshop achter. Meer hoeft niet.</small></div></li>
              <li><span>2</span><div><strong>Kennismaking met Stef</strong><small>Stef bekijkt je webshop en cijfers en bespreekt je doelen en budget.</small></div></li>
              <li><span>3</span><div><strong>Voorstel en start</strong><small>Je krijgt een voorstel op maat. Daarna start je traject in je eigen account.</small></div></li>
            </ol>
            <button className="ac-button ac-button-outline" onClick={goToSignup}>Meld je aan</button>
            <small>Eerst je doelen bespreken, dan een voorstel.</small>
          </article>
          <article className="ac-plan ac-plan-featured ac-reveal">
            <div className="ac-plan-top"><span>META ADS ACADEMY</span><span>Met Stef aan je zijde</span></div>
            <h3>Wat je krijgt</h3>
            <p className="ac-plan-price">Op maat</p>
            <p>Je leert het in je eigen Ads Manager en webshop, met iemand die meekijkt.</p>
            <ul>{included.map(item => <li key={item}>{item}</li>)}</ul>
            <button className="ac-button ac-button-light" onClick={goToSignup}>Meld je aan</button>
            <small>Prijs en ritme na een kennismakingsgesprek. Advertentiebudget is niet inbegrepen.</small>
          </article>
        </div>
      </section>

      <section id="aanmelden" className="ac-signup-section ac-wrap" aria-labelledby="signup-title">
        <div className="ac-signup-intro">
          <p className="ac-dot-kicker"><span /> Aanmelden</p>
          <h2 id="signup-title">Meld je aan.<br /><span>Stef neemt contact op.</span></h2>
          <p>Vul het formulier in. Stef bekijkt je webshop en neemt persoonlijk contact met je op om je cijfers, je doelen en de opzet van je traject te bespreken.</p>
          <ol className="ac-next-steps">
            <li><span>1</span><div><strong>Vul het formulier in</strong><small>Je contactgegevens, je webshop en, als je wil, je budget.</small></div></li>
            <li><span>2</span><div><strong>Stef neemt contact op</strong><small>Telefonisch of per e-mail, om te bekijken waar je staat.</small></div></li>
            <li><span>3</span><div><strong>Je krijgt een voorstel</strong><small>Op maat van je doelen. Daarna beslis je.</small></div></li>
          </ol>
          <p className="ac-privacy">We gebruiken je gegevens alleen om contact met je op te nemen over de academy. Nieuwsbrieven krijg je enkel als je dat aanvinkt.</p>
        </div>
        <div className="ac-signup-card">
          {signedUp ? <div className="ac-signup-done" role="status">
                        <h3>{thanks}</h3>
            <p>Je aanmelding is binnen. Stef bekijkt je webshop en neemt persoonlijk contact met je op. Je krijgt ook een bevestiging per mail.</p>
            <div><Link className="ac-button" to="/cases">Bekijk intussen onze cases</Link></div>
          </div> : <AcademySignup formId="academy-signup" variant="full" onSuccess={joined('academy-signup')} />}
        </div>
      </section>

      <section className="ac-honest ac-wrap" aria-labelledby="honest-title">
        <div className="ac-honest-copy ac-reveal">
          <h2 id="honest-title">Geen beloftes.<br /><span>Wel cijfers die kloppen.</span></h2>
          <p>Geen gegarandeerde ROAS. Geen losse dashboardscreenshots.<br />Alleen beslissingen die je begrijpt, kan uitleggen en kan herhalen.</p>
          <p className="ac-strong-line">Je leert de werkwijze die we ook voor onze klanten en ons eigen merk gebruiken.</p>
          <p className="ac-small">Benieuwd hoe dat in de praktijk loopt?</p>
          <div className="ac-hero-actions"><Link className="ac-button" to="/cases">Bekijk onze cases</Link><Link className="ac-text-link" to="/meta-ads">Liever uitbesteden?</Link></div>
        </div>
        <figure className="ac-honest-photo ac-reveal"><ResponsiveImage src={stefPortrait} alt="Stef Keppens van verkoop.studio" sizes="(max-width: 900px) 100vw, 520px" loading="lazy" /></figure>
      </section>

      <section id="faq" className="ac-faq ac-wrap" aria-labelledby="faq-title">
        <div><p className="ac-dot-kicker"><span /> Goed om te weten</p><h2 id="faq-title">Nog even dit.</h2><p>Staat je vraag er niet bij? <Link to={contactAcademy}>Stel ze rechtstreeks.</Link></p></div>
        <div className="ac-glass ac-faq-list">{academyFaq.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="ac-final ac-wrap" aria-labelledby="final-title">
        <div className="ac-final-inner ac-reveal"><div><p className="ac-kicker">KLAAR OM TE SCHALEN?</p><h2 id="final-title">Bouw aan je volgende mijlpaal.</h2><p>Meld je aan. Stef bekijkt je webshop en neemt persoonlijk contact met je op.</p></div><div className="ac-final-actions"><button className="ac-button ac-button-light" onClick={goToSignup}>Meld je aan</button><Link className="ac-text-link ac-text-link-light" to={contactAcademy}>Of stel eerst een vraag</Link></div></div>
      </section>
    </main>

    {!signedUp && stickyArmed && <div className={`ac-sticky ${sticky ? 'is-visible' : ''}`} aria-hidden={!sticky}>
      <p><strong>Meta Ads Academy</strong><span>Schaal je webshop met Meta ads</span></p>
      <button className="ac-button" tabIndex={sticky ? 0 : -1} onClick={goToSignup}>Meld je aan</button>
    </div>}

    <footer className="ac-footer">
      <div className="ac-wrap">
        <div className="ac-footer-top">
          <div><div className="ac-identity"><Link to="/" aria-label="verkoop.studio — naar de homepage"><BrandMark /></Link><span className="ac-identity-line" /><span className="ac-identity-label">academy</span></div><p>Schaal je webshop met Meta ads, op basis van cijfers die kloppen. Een leertraject van verkoop.studio.</p></div>
          <NewsletterForm />
        </div>
        <div className="ac-footer-columns">
          <div><h3>Academy</h3><a href="#programma">Programma</a><a href="#testlog">Testlog</a><a href="#zo-werkt-het">Zo werkt het</a><a href="#aanmelden">Aanmelden</a></div>
          <div><h3>verkoop.studio</h3><Link to="/">Home</Link><Link to="/meta-ads">Meta Ads</Link><Link to="/cases">Cases</Link><Link to="/agency">Agency</Link></div>
          <div><h3>Contact</h3><a href="mailto:stefkeppens@gmail.com">stefkeppens@gmail.com</a><Link to={contactAcademy}>Plan een gesprek</Link><span>Lochristi, België</span></div>
          <div><h3>Goed om te weten</h3><span>Niet verbonden aan of gecertificeerd door Meta.</span><span>Geen garantie op resultaten.</span></div>
        </div>
        <p className="ac-copyright">© {new Date().getFullYear()} verkoop.studio. Alle rechten voorbehouden.</p>
      </div>
    </footer>
  </div>
}
