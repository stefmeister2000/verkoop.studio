import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import AcademySignup from '../components/AcademySignup'
import BrandMark from '../components/BrandMark'
import ResponsiveImage from '../components/ResponsiveImage'
import Seo from '../components/Seo'
import HeroVideo from '../components/HeroVideo'
import { academyFaq as sourceFaq, academyModules as sourceModules, academyTests as sourceTests } from '../data/academy'
import { useAcademyTranslation } from '../i18n/academy'
import { trackNewsletterConversion } from '../lib/analytics'
import stefDeskSmall from '../assets/stef-desk-640.webp'
import stefNooms from '../assets/stef.webp'
import studioTeam from '../assets/studio-team.webp'
import stefPortrait from '../assets/hero-portrait.webp'
import pinacelloPage from '../assets/cases/pinacello.webp'
// Loaded only on this page, so the homepage's inlined stylesheet stays within its size budget.
import academyStylesheet from './Academy.css?url'

const number = (index: number) => String(index + 1).padStart(2, '0')
const contactAcademy = '/contact?interesse=academy'
const practice = ['Pinacello', 'Nooms', 'O’Learys', 'E-Kart']
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
  const { t } = useAcademyTranslation()
  return <div className="ac-concepts">{[['UGC', t("Een klant toont het product")], ['Demo', t("Het product in gebruik")], [t("Aanbod"), t("Bundel of tijdelijke actie")]].map(([name, text], index) => <div key={name} className={`ac-concept ac-concept-${index}`}><span className="ac-concept-art"><i /><i /></span><strong>{name}</strong><small>{text}</small></div>)}</div>
}

const spendBars = [30, 36, 40, 48, 55, 62, 70, 80]
const merLine = [34, 31, 33, 30, 32, 29, 31, 30]

/** A small, illustrative mock-up per topic: what you look at in Ads Manager or your webshop. */
function ModuleVisual({ id }: { id: string }) {
  const { t } = useAcademyTranslation()
  if (id === 'tracking') return <div className="ac-mock">
    <span className="ac-mock-label">{t("AANKOOPDATA · VOORBEELD")}</span>
    <ul className="ac-events">{[['PageView', 'Pixel + CAPI'], ['AddToCart', 'Pixel + CAPI'], ['InitiateCheckout', 'Pixel + CAPI'], ['Purchase', t("1× geteld, ontdubbeld")]].map(([event, text]) => <li key={event}><span>{event}</span><small>{text}</small></li>)}</ul>
    <p className="ac-mock-foot">{t("Ads Manager naast Shopify") + " "}<strong>{t("afwijking 4%")}</strong></p>
  </div>
  if (id === 'rendement') return <div className="ac-mock">
    <span className="ac-mock-label">{t("REKENVOORBEELD")}</span>
    <dl className="ac-calc">
      <div><dt>{t("Gemiddelde orderwaarde")}</dt><dd>€60</dd></div>
      <div><dt>{t("Marge na product, verzending en kosten")}</dt><dd>50%</dd></div>
      <div className="is-key"><dt>Break-even ROAS</dt><dd>{t("2,0")}</dd></div>
      <div><dt>{t("Klantwaarde na 90 dagen")}</dt><dd>€96</dd></div>
      <div className="is-key"><dt>{t("Max. kost per nieuwe klant")}</dt><dd>€48</dd></div>
    </dl>
  </div>
  if (id === 'structuur') return <div className="ac-mock">
    <span className="ac-mock-label">{t("BUDGETVERDELING · VOORBEELD")}</span>
    <ul className="ac-stack">{[['Prospecting', t("Advantage+ · brede doelgroep"), 75], ['Retargeting', t("Catalogus · bezoekers en winkelwagens"), 15], ['Testing', t("Nieuwe creatives tegen de winnaar"), 10]].map(([name, text, share]) => <li key={name}><div><strong>{name}</strong><small>{text}</small></div><b>{share}%</b><i style={{ width: `${share}%` }} /></li>)}</ul>
  </div>
  if (id === 'creatives') return <div className="ac-mock">
    <span className="ac-mock-label">{t("DRIE INVALSHOEKEN, GEEN DRIE KLEUREN")}</span>
    <ConceptTiles />
    <p className="ac-mock-foot">{t("Testritme") + " "}<strong>{t("elke week nieuwe hooks")}</strong></p>
  </div>
  if (id === 'retargeting') return <div className="ac-mock">
    <span className="ac-mock-label">{t("VAN BEZOEKER NAAR VASTE KLANT")}</span>
    <ol className="ac-route">{[[t("Product bekeken"), t("Catalogus-ads · 14 dagen")], [t("In winkelwagen"), t("Herinnering · 7 dagen")], [t("Gekocht"), t("Cross-sell · 30 dagen")], [t("Vaste klant"), t("E-mail en ads · herhaalaankoop")]].map(([name, text]) => <li key={name}><span className="ac-route-dot" /><span>{name}<small>{text}</small></span></li>)}</ol>
  </div>
  return <div className="ac-mock">
    <span className="ac-mock-label">{t("BUDGET EN ROAS PER WEEK · VOORBEELD")}</span>
    <svg className="ac-scale-chart" viewBox="0 0 300 110" aria-hidden="true">
      {spendBars.map((height, index) => <rect key={index} x={10 + index * 36} y={104 - height} width="22" height={height} rx="4" />)}
      <polyline points={merLine.map((y, index) => `${21 + index * 36},${y + 4}`).join(' ')} />
    </svg>
    <p className="ac-mock-foot">{t("Beslisregel") + " "}<strong>{t("+20% budget zolang ROAS ≥ 3")}</strong></p>
  </div>
}

function TestChart({ selected }: { selected: string }) {
  const { t } = useAcademyTranslation()
  const x = (day: number) => 24 + day * (556 / 13)
  const y = (value: number) => 168 - value * (150 / 32)
  return <svg className="ac-chart" viewBox="0 0 640 190" role="img" aria-label={t("Fictief voorbeeld: cumulatief aantal nieuwe klanten per creative over 14 dagen")}>
    {[0, 8, 16, 24, 32].map(value => <g key={value}><line x1="24" x2="580" y1={y(value)} y2={y(value)} className="ac-chart-grid" /><text x="592" y={y(value) + 4} className="ac-chart-axis">{value}</text></g>)}
    {sourceTests.map(test => {
      const points = test.daily.flatMap((value, day) => value === null ? [] : [`${x(day)},${y(value)}`])
      const last = points[points.length - 1]?.split(',').map(Number)
      return <g key={test.id} className={`ac-chart-line ac-chart-${test.id} ${selected === test.id ? 'is-selected' : ''}`}>
        <polyline points={points.join(' ')} fill="none" />
        {last && <circle cx={last[0]} cy={last[1]} r="4.5" />}
      </g>
    })}
    <text x="24" y="186" className="ac-chart-axis">{t("dag 1")}</text><text x="580" y="186" textAnchor="end" className="ac-chart-axis">{t("dag 14")}</text>
  </svg>
}

function NewsletterForm() {
  const { lang, t } = useAcademyTranslation()
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
        body: JSON.stringify({ email: data.get('email'), company_website: data.get('company_website'), consent: data.get('consent') === 'on', consent_version: 'website-newsletter-v1', lang }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) {
        setError(result.error === 'subscription_preferences' ? "Je hebt je eerder uitgeschreven. Mail ons als je weer berichten wilt ontvangen." : response.status === 429 ? "Even te veel pogingen. Probeer het over enkele minuten opnieuw." : "Inschrijven lukte niet. Probeer het later opnieuw.")
        setStatus('idle')
        return
      }
      trackNewsletterConversion(result, submissionId.current)
      setStatus('success')
    } catch {
      setError("Inschrijven lukte niet. Probeer het later opnieuw.")
      setStatus('idle')
    }
  }
  if (status === 'success') return <p className="ac-newsletter-done" role="status">{" " + t("Je bent ingeschreven. Nieuwe tips komen in je inbox.")}</p>
  return <form className="ac-newsletter" onSubmit={submit} data-clarity-mask="true">
    <label htmlFor="academy-newsletter-email">{t("Meta-adstips in je inbox")}</label>
    <p>{t("Praktische tips over Meta ads, ROAS en opschalen van verkoop.studio.")}</p>
    <div className="ac-newsletter-row"><input id="academy-newsletter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder={t("naam@bedrijf.be")} /><button type="submit" className="ac-button" disabled={status === 'pending'}>{status === 'pending' ? t("Bezig…") : t("Inschrijven")}</button></div>
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <label className="ac-consent"><input type="checkbox" name="consent" required /><span>{t("Ja, ik ontvang graag marketingtips en nieuws van verkoop.studio per e-mail.")}</span></label>
    {error && <p className="ac-form-error" role="alert">{t(error)}</p>}
  </form>
}

export default function Academy() {
  const { lang, setLang, t } = useAcademyTranslation()
  const euro = (value: number) => new Intl.NumberFormat(lang === 'nl' ? 'nl-BE' : 'en-GB', { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(value) ? 0 : 2, maximumFractionDigits: 2 }).format(value)
  const ratio = (value: number) => value.toFixed(2).replace('.', lang === 'nl' ? ',' : '.')
  const academyModules = sourceModules.map(item => ({ ...item, tag: t(item.tag), shortTitle: t(item.shortTitle), title: t(item.title), summary: t(item.summary), points: item.points.map(t), outcome: t(item.outcome) }))
  const academyFaq = sourceFaq.map(item => ({ question: t(item.question), answer: t(item.answer) }))
  const academyTests = sourceTests.map(item => ({ ...item, name: t(item.name), verdict: t(item.verdict), decision: t(item.decision) }))
  const offer = [t('1-op-1 begeleiding'), t('Starten vanaf nul'), 'Meta ads', t('Landingspagina’s'), 'Tracking', t('E-mailmarketing')]
  const pinacelloSteps = [
    [t("Aandacht"), t("Meta ads en content rond het product en het aanbod.")],
    [t("Pagina"), t("Een campagnepagina met aanbod, bundels en een directe bestelknop.")],
    ['Retargeting', t("Wie interesse toonde, komt terug tot de aankoop.")],
  ]
  const stages = [
    [t('OPZETTEN'), t('Je account en tracking op orde.')],
    [t('STARTEN'), t('Je eerste campagnes live.')],
    [t('VERBETEREN'), t('Ads testen en resultaten bekijken.')],
    [t('SCHALEN'), t('Meer budget voor wat werkt.')],
  ] as const

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
  const thanks = signedUp?.naam ? `${t('Bedankt')}, ${signedUp.naam}!` : t("Bedankt!")

  useEffect(() => {
    const update = () => {
      const hero = document.getElementById('academy-hero-signup')?.getBoundingClientRect()
      const signup = document.getElementById('aanmelden')?.getBoundingClientRect()
      const footer = document.querySelector('.ac-footer')?.getBoundingClientRect()
      const card = document.querySelector('.ac-focus-card')?.getBoundingClientRect()
      const promise = document.querySelector('.ac-promise')?.getBoundingClientRect()
      const visible = (rect?: DOMRect) => !!rect && rect.top < innerHeight && rect.bottom > 0
      // Hide the bar wherever another join button is already on screen.
      setSticky(!!hero && hero.bottom < 0 && !visible(signup) && !visible(footer) && !visible(card) && !visible(promise))
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

  return <div className="academy-page" lang={lang} ref={pageRef}>
    <link rel="stylesheet" href={academyStylesheet} precedence="academy" />
    <Seo title={t("Meta Ads Academy — 1-op-1 Meta ads lessen voor webshops")} description={t("Volledig 1-op-1 Meta ads lessen voor webshops, met Stef van verkoop.studio. Eén belofte: een ROAS van 3 tot 4. Ook als je nog nooit hebt geadverteerd.")} path="/academy" language={lang} />
    <a className="ac-skip" href="#academy-main">{t("Naar de inhoud")}</a>

    <header className="ac-header">
      <div className="ac-wrap ac-header-inner">
        <div className="ac-identity"><Link to="/" aria-label={t("verkoop.studio — naar de homepage")}><BrandMark /></Link><span className="ac-identity-line" /><a href="#academy-main" className="ac-identity-label">academy</a></div>
        <nav className="ac-pill-nav" aria-label={t("Academy navigatie")}><a href="#aanbod">{t("Aanbod")}</a><a href="#resultaten">{t("Resultaten")}</a><a href="#aanpak">{t("Aanpak")}</a><a href="#programma">{t("Programma")}</a><a href="#testlog">{t("Testlog")}</a><a href="#faq">FAQ</a></nav>
        <div className="ac-header-actions">
          <div className="ac-language" role="group" aria-label={t('Taal kiezen')}>
            <button type="button" lang="nl" aria-label="Nederlands" aria-pressed={lang === 'nl'} onClick={() => setLang('nl')}>NL</button>
            <button type="button" lang="en" aria-label="English" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>EN</button>
          </div>
          <button className="ac-header-cta" onClick={goToSignup}>{t("Meld je aan")}</button>
        </div>
      </div>
    </header>

    <main id="academy-main">
      <section className="ac-hero ac-wrap" aria-labelledby="academy-title">
        <div className="ac-hero-copy">
          <h1 id="academy-title">{t("Start en schaal je webshop") + " "}<span>{t("met Meta ads.")}</span></h1>
          <p className="ac-hero-lead">{t("Volledig 1-op-1 lessen met Stef, in je eigen account. Ook als je nog nooit hebt geadverteerd. Onze belofte: een ROAS van 3 tot 4.")}</p>
          <div id="academy-hero-signup" className="ac-hero-signup">
            {signedUp ? <div className="ac-welcome-card" role="status">
              
              <div><strong>{thanks}{" " + t("Je aanmelding is binnen.")}</strong><small>{t("Stef neemt persoonlijk contact met je op. Je krijgt ook een bevestiging per mail.")}</small></div>
            </div> : <AcademySignup formId="academy-hero" onSuccess={joined('academy-hero')} />}
          </div>
          {!signedUp && <ul className="ac-hero-note"><li>{t("Volledig 1-op-1")}</li><li>{t("Starters welkom")}</li><li>{t("Doel: ROAS 3 tot 4")}</li></ul>}
          <a className="ac-manage-link" href="https://verkoop.studio/">{t('Wil je dat wij jouw ads overnemen?')} <span aria-hidden="true">↗</span></a>
          <div className="ac-trust">
            <img src={stefDeskSmall} alt="" width="44" height="44" loading="eager" />
            <p><strong>{t("Door Stef Keppens")}</strong>, verkoop.studio<span>{t("Uit de praktijk bij") + " "}{practice.map((name, index) => <b key={name}>{name}{index < practice.length - 1 && <i aria-hidden="true">·</i>}</b>)}</span></p>
          </div>
        </div>
        <HeroVideo lang={lang} />
      </section>

      <section id="aanbod" className="ac-offer ac-wrap" aria-labelledby="offer-title">
        <div className="ac-offer-main">
          <p className="ac-dot-kicker"><span />{" " + t("Het aanbod")}</p>
          <h2 id="offer-title">{t('Dit zit erin.')}</h2>
          <ul className="ac-offer-list">{offer.map(title => <li key={title}><strong>{title}</strong></li>)}</ul>
        </div>
        <aside className="ac-promise" aria-label={t("Onze belofte")}>
          <p className="ac-kicker">{t("ONZE BELOFTE")}</p>
          <p className="ac-promise-figure"><strong>3–4</strong><span>{t("ROAS op je Meta ads")}</span></p>
          <p>{t("Elke euro die je in Meta ads steekt, levert") + " "}<b>{t("€3 tot €4 omzet")}</b>{(lang === 'nl' ? ' ' : '') + t("op. Daar werkt elke les naartoe.")}</p>
          <ol className="ac-promise-steps"><li><span>1</span>{t("Meld je aan in 1 minuut")}</li><li><span>2</span>{t("Kennismaking met Stef")}</li><li><span>3</span>{t("Start je 1-op-1 lessen")}</li></ol>
          {signedUp ? <p className="ac-promise-done">{t("Je aanmelding is binnen.")}</p> : <button className="ac-button ac-button-light" onClick={goToSignup}>{t("Meld je aan")}</button>}
          <small>{t("Prijs op maat na de kennismaking. Advertentiebudget niet inbegrepen.")}</small>
        </aside>
      </section>

      <section id="resultaten" className="ac-proof ac-wrap" aria-labelledby="proof-title">
        <div className="ac-proof-top">
          <div><p className="ac-dot-kicker"><span />{" " + t("Uit de praktijk · Pinacello")}</p><h2 id="proof-title">{t("Geen theorie.") + " "}<span>{t("Zo werkt het bij Pinacello.")}</span></h2></div>
          <p className="ac-section-intro">{t("Stef werkt doorlopend aan de groei van Pinacello. Wat je in de lessen leert, komt rechtstreeks uit dat werk.")}</p>
        </div>
        <article className="ac-case ac-case-main ac-reveal">
          <div className="ac-case-copy">
            <span className="ac-case-tag">{t("VAN KLIK TOT AANKOOP")}</span>
            <p className="ac-case-figure"><strong>+120%</strong><span>{t("online omzet bij Pinacello")}</span></p>
            <p>{t("Ads, landingspagina en retargeting werken samen als één verkoopmotor.")}</p>
            <ol className="ac-case-steps">{pinacelloSteps.map(([label, text], index) => <li key={label}><span>{number(index)}</span><div><strong>{label}</strong>{text}</div></li>)}</ol>
            <Link className="ac-text-link" to="/cases/pinacello">{t("Lees de volledige case")}</Link>
          </div>
          <figure className="ac-case-shot">
            <a href="https://promo.pinacello.com/" target="_blank" rel="noopener noreferrer" aria-label={t("Bekijk de campagnepagina van Pinacello in een nieuw tabblad")}><ResponsiveImage src={pinacelloPage} width="1900" height="1024" alt={t("Campagnepagina van Pinacello met productbeelden, aanbod en een bestelknop")} sizes="(max-width: 900px) 100vw, 620px" loading="lazy" /></a>
            <figcaption>promo.pinacello.com</figcaption>
          </figure>
        </article>
        <p className="ac-fine">{t("Gepubliceerde resultaten van Pinacello, waar Stef aan de ecommerce- en groeikant werkt. Elke webshop is anders.")}</p>
      </section>

      <section id="aanpak" className="ac-focus ac-wrap" aria-labelledby="focus-title">
        <article className="ac-focus-article">
          <p className="ac-dot-kicker"><span />{" " + t("De aanpak")}</p>
          <h2 id="focus-title">{t('Zo werken we.')}</h2>
          <p className="ac-focus-lead">{t('Samen met Stef, in je eigen advertentieaccount.')}</p>

          <ol className="ac-stages">{stages.map(([label, text], index) => <li key={label}><span className="ac-stage-number">{number(index)}</span><div><strong>{label}</strong><p>{text}</p></div></li>)}</ol>

          <div className="ac-focus-author">
            <img src={stefDeskSmall} alt="" width="56" height="56" loading="lazy" />
            <p><strong>Stef Keppens</strong><br />{t('Je vaste begeleider.')}</p>
          </div>

          <div className="ac-focus-join">
            <p><strong>{t("Klaar om te starten?")}</strong></p>
            <p>{t("Prijs op maat, na een kennismaking met Stef.")}</p>
            {!signedUp && <button className="ac-button" onClick={goToSignup}>{t("Meld je aan")}</button>}
          </div>
        </article>

        <aside className="ac-focus-card" aria-label={t("Meta Ads Academy in het kort")}>
          <figure><ResponsiveImage src={stefNooms} alt={t("Stef Keppens van verkoop.studio")} sizes="340px" loading="lazy" /><figcaption>META ADS ACADEMY</figcaption></figure>
          <div className="ac-focus-card-body">
            <h3>Meta Ads Academy</h3>
            <span className="ac-focus-url">verkoop.studio/academy</span>
            <p>{t("1-op-1 Meta ads lessen voor webshops.")}</p>
            <dl><div><dt>{t("Lessen")}</dt><dd>{t("1-op-1")}</dd></div><div><dt>{t("ROAS-doel")}</dt><dd>3–4</dd></div><div><dt>Account</dt><dd>{t("Eigen")}</dd></div></dl>
            {signedUp ? <p className="ac-focus-done">{" " + t("Je aanmelding is binnen.")}</p> : <button className="ac-button ac-focus-join-button" onClick={goToSignup}>{t("Meld je aan")}</button>}
            <small>{t("Prijs op maat, na een kennismaking met Stef.")}</small>
          </div>
        </aside>
      </section>

      <section id="programma" className="ac-curriculum ac-wrap" aria-labelledby="curriculum-title">
        <div className="ac-curriculum-top">
          <div><p className="ac-kicker">{t("WAT JE LEERT")}</p><h2 id="curriculum-title">{t("Alles voor ROAS 3 tot 4.") + " "}<span>{t("Onderdeel per onderdeel.")}</span></h2></div>
          <div className="ac-slider-buttons"><button onClick={() => step(-1)}>{t("Vorige")}</button><button onClick={() => step(1)}>{t("Volgende")}</button></div>
        </div>
        <div className="ac-progress-tabs" ref={tabsRef}>{academyModules.map((item, index) => <button key={item.id} className={index === slide ? 'is-active' : index < slide ? 'is-past' : ''} onClick={() => setSlide(index)} aria-label={item.shortTitle} aria-current={index === slide ? 'true' : undefined}><span>{number(index)}</span><em>{item.shortTitle}</em></button>)}</div>
        <div className="ac-slide" key={topic.id} onTouchStart={event => { swipeStart.current = event.touches[0].clientX }} onTouchEnd={event => endSwipe(event.changedTouches[0].clientX)}>
          <div className="ac-slide-visual"><ModuleVisual id={topic.id} /></div>
          <div className="ac-slide-copy">
            <span className="ac-slide-number">{topic.tag}</span>
            <h3>{topic.title}.</h3>
            <p>{topic.summary}</p>
            <ul>{topic.points.map(point => <li key={point}>{point}</li>)}</ul>
            <p className="ac-slide-outcome"><span>{t("WAT JE EROVER HEBT")}</span>{topic.outcome}</p>
            <div className="ac-slide-actions"><button className="ac-button" onClick={goToSignup}>{t("Meld je aan")}</button></div>
          </div>
        </div>
      </section>

      <section id="testlog" className="ac-testlog-section ac-wrap" aria-labelledby="testlog-title">
        <p className="ac-dot-kicker"><span />{" " + t("Webshop-account · fictief voorbeeld")}</p>
        <h2 id="testlog-title">{t("Leer kijken voorbij")}<br /><span>{t("de hoogste ROAS.")}</span></h2>
        <p className="ac-section-intro">{t("Drie creatives, veertien dagen. Ads Manager kiest de kortingsactie als winnaar. Kijk je naar nieuwe klanten en marge, dan wint een andere. Klik op een test.")}</p>
        <div className="ac-stats-row"><div><span>{t("UITGAVEN · 14 DAGEN")}</span><strong>{euro(totals.spend)}</strong></div><div><span>{t("NIEUWE KLANTEN")}</span><strong className="ac-positive">{totals.newCustomers} <small>{t("van") + " "}{totals.purchases}{" " + t("aankopen")}</small></strong></div></div>
        <div className="ac-testlog ac-reveal">
          <aside className="ac-testlog-side">
            <span className="ac-testlog-badge">{t("Testlog")}</span>
            {academyTests.map(item => <button key={item.id} className={item.id === test.id ? 'is-active' : ''} onClick={() => setTestId(item.id)} aria-pressed={item.id === test.id}><span className={`ac-swatch ac-swatch-${item.id}`} /><span>{item.name}<small>{item.newCustomers}{" " + t("nieuwe klanten")}</small></span></button>)}
            <span className="ac-testlog-system"><span className="ac-live-dot" />{" " + t("verkoop.studio werkplaats")}</span>
          </aside>
          <div className="ac-testlog-main">
            <div className="ac-testlog-head"><div><strong>{t("Webshop · aankopen")}</strong><span>3 creatives</span></div><code>{t("Nieuwe klanten, cumulatief")}</code></div>
            <TestChart selected={test.id} />
            <div className="ac-testlog-decision" aria-live="polite"><span className="ac-mock-label">{t("BESLISSING ·") + " "}{test.name.toUpperCase()}</span><strong>{test.verdict}.</strong><p>{test.decision}</p>{testModule && <button className="ac-text-link" onClick={() => { showSlide(academyModules.indexOf(testModule)); scrollToId('programma') }}>{t("Hierover gaat:") + " "}{testModule.shortTitle}</button>}</div>
          </div>
          <div className="ac-testlog-table">
            <div className="ac-table-caption"><span>TESTS</span><span>{t("Klik op een test om de beslissing te zien")}</span></div>
            <div className="ac-row ac-row-head" aria-hidden="true"><span>STATUS</span><span>CREATIVE</span><span>{t("UITGAVEN")}</span><span>{t("AANKOPEN")}</span><span>ROAS</span><span>{t("NIEUWE KLANTEN")}</span><span>{t("PER NIEUWE KLANT")}</span><span /></div>
            {academyTests.map(item => <button key={item.id} className={`ac-row ${item.id === test.id ? 'is-active' : ''}`} onClick={() => setTestId(item.id)} aria-pressed={item.id === test.id} aria-label={`${item.name}: ${euro(item.spend)} ${lang === 'nl' ? 'uitgegeven' : 'spent'}, ROAS ${ratio(item.revenue / item.spend)}, ${item.newCustomers} ${t('nieuwe klanten')}`}>
              <span><em className={item.status === 'LOPEND' ? 'ac-status' : 'ac-status ac-status-wait'}>{t(item.status)}</em></span>
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
        <p className="ac-fine">{t("Fictieve cijfers om te oefenen. Geen klantgegevens en geen voorspelling van je eigen resultaat.")}</p>
      </section>

      <section className="ac-not ac-wrap" aria-labelledby="not-title">
        <h2 id="not-title" className="ac-reveal">{t("Dit is niet voor wie")}<span className="ac-not-words"><s>{t("de boost-knop")}</s> <s>{t("snelle trucs")}</s><br /><s>{t("een winning-product-hack")}</s></span>{t("zoekt. Maar voor wie")}<br /><span className="ac-blue">{t("rendabel wil")}</span><br /><span className="ac-grey">{t("opschalen.")}</span></h2>
        <figure className="ac-stat-card ac-reveal">
          <ResponsiveImage src={studioTeam} alt={t("Samen aan het werk in de studio van verkoop.studio")} sizes="(max-width: 900px) 100vw, 520px" loading="lazy" />
          <dl><div><dt>{t("Totaal rendement")}</dt><dd>MER</dd></div><div><dt>{t("Klantwaarde")}</dt><dd>LTV</dd></div><div><dt>{t("Server-tracking")}</dt><dd>CAPI</dd></div></dl>
        </figure>
        <ul className="ac-pillars ac-reveal">
          <li><strong>{t("Meten")}</strong><span>{t("Weten wat klopt")}</span></li>
          <li><strong>{t("Rendement")}</strong><span>{t("Sturen op winst")}</span></li>
          <li><strong>Creatives</strong><span>{t("Altijd nieuwe winnaars")}</span></li>
          <li><strong>{t("Schalen")}</strong><span>{t("Met beslisregels")}</span></li>
        </ul>
      </section>

      <section id="aanmelden" className="ac-signup-section ac-wrap" aria-labelledby="signup-title">
        <div className="ac-signup-intro">
          <p className="ac-dot-kicker"><span />{" " + t("Aanmelden")}</p>
          <h2 id="signup-title">{t("Start je 1-op-1 lessen.")}<br /><span>{t("Meld je aan.")}</span></h2>
          <p>{t("Vul het formulier in. Stef bekijkt je webshop en neemt persoonlijk contact met je op.")}</p>
          <ol className="ac-next-steps">
            <li><span>1</span><div><strong>{t("Vul het formulier in")}</strong><small>{t("Een minuut werk. Webshop en budget zijn optioneel.")}</small></div></li>
            <li><span>2</span><div><strong>{t("Kennismaking met Stef")}</strong><small>{t("Telefonisch of per e-mail: waar sta je en wat wil je bereiken?")}</small></div></li>
            <li><span>3</span><div><strong>{t("Start je lessen")}</strong><small>{t("Je krijgt een voorstel op maat. Daarna beslis je.")}</small></div></li>
          </ol>
          <p className="ac-privacy">{t("We gebruiken je gegevens alleen om contact met je op te nemen over de academy. Nieuwsbrieven krijg je enkel als je dat aanvinkt.")}</p>
        </div>
        <div className="ac-signup-card">
          {signedUp ? <div className="ac-signup-done" role="status">
                        <h3>{thanks}</h3>
            <p>{t("Je aanmelding is binnen. Stef bekijkt je webshop en neemt persoonlijk contact met je op. Je krijgt ook een bevestiging per mail.")}</p>
            <div><Link className="ac-button" to="/cases">{t("Bekijk intussen onze cases")}</Link></div>
          </div> : <AcademySignup formId="academy-signup" variant="full" onSuccess={joined('academy-signup')} />}
        </div>
      </section>

      <section className="ac-honest ac-wrap" aria-labelledby="honest-title">
        <div className="ac-honest-copy ac-reveal">
          <h2 id="honest-title">{t("Eén belofte.")}<br /><span>{t("ROAS 3 tot 4.")}</span></h2>
          <p>{t("Geen snelle trucs of vage beloftes over viraal gaan. Eén duidelijk doel waar elke les naartoe werkt: €3 tot €4 omzet per euro advertentiebudget.")}</p>
          <p className="ac-strong-line">{t("Met de werkwijze die Stef ook voor klanten als Pinacello en zijn eigen merk gebruikt.")}</p>
          <p className="ac-small">{t("Benieuwd hoe dat in de praktijk loopt?")}</p>
          <div className="ac-hero-actions"><Link className="ac-button" to="/cases">{t("Bekijk onze cases")}</Link><a className="ac-text-link" href="https://verkoop.studio/">{t("Wil je dat wij jouw ads overnemen?")}</a></div>
        </div>
        <figure className="ac-honest-photo ac-reveal"><ResponsiveImage src={stefPortrait} alt={t("Stef Keppens van verkoop.studio")} sizes="(max-width: 900px) 100vw, 520px" loading="lazy" /></figure>
      </section>

      <section id="faq" className="ac-faq ac-wrap" aria-labelledby="faq-title">
        <div><p className="ac-dot-kicker"><span />{" " + t("Goed om te weten")}</p><h2 id="faq-title">{t("Nog even dit.")}</h2><p>{t("Staat je vraag er niet bij?") + " "}<Link to={contactAcademy}>{t("Stel ze rechtstreeks.")}</Link></p></div>
        <div className="ac-glass ac-faq-list">{academyFaq.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="ac-final ac-wrap" aria-labelledby="final-title">
        <div className="ac-final-inner ac-reveal"><div><p className="ac-kicker">{t("KLAAR VOOR ROAS 3 TOT 4?")}</p><h2 id="final-title">{t("Start je 1-op-1 lessen.")}</h2><p>{t("Meld je aan in een minuut. Stef neemt persoonlijk contact met je op.")}</p></div><div className="ac-final-actions"><button className="ac-button ac-button-light" onClick={goToSignup}>{t("Meld je aan")}</button><Link className="ac-text-link ac-text-link-light" to={contactAcademy}>{t("Of stel eerst een vraag")}</Link></div></div>
      </section>
    </main>

    {!signedUp && stickyArmed && <div className={`ac-sticky ${sticky ? 'is-visible' : ''}`} aria-hidden={!sticky}>
      <p><strong>Meta Ads Academy</strong><span>{t("1-op-1 lessen · doel ROAS 3 tot 4")}</span></p>
      <button className="ac-button" tabIndex={sticky ? 0 : -1} onClick={goToSignup}>{t("Meld je aan")}</button>
    </div>}

    <footer className="ac-footer">
      <div className="ac-wrap">
        <div className="ac-footer-top">
          <div><div className="ac-identity"><Link to="/" aria-label={t("verkoop.studio — naar de homepage")}><BrandMark /></Link><span className="ac-identity-line" /><span className="ac-identity-label">academy</span></div><p>{t("Volledig 1-op-1 Meta ads lessen voor webshops, met één doel: een ROAS van 3 tot 4. Van verkoop.studio.")}</p></div>
          <NewsletterForm />
        </div>
        <div className="ac-footer-columns">
          <div><h3>Academy</h3><a href="#aanbod">{t("Aanbod")}</a><a href="#programma">{t("Programma")}</a><a href="#testlog">{t("Testlog")}</a><a href="#aanmelden">{t("Aanmelden")}</a></div>
          <div><h3>verkoop.studio</h3><Link to="/">Home</Link><Link to="/meta-ads">Meta Ads</Link><Link to="/cases">Cases</Link><Link to="/agency">Agency</Link></div>
          <div><h3>Contact</h3><a href="mailto:stefkeppens@gmail.com">stefkeppens@gmail.com</a><Link to={contactAcademy}>{t("Plan een gesprek")}</Link><span>{t("Lochristi, België")}</span></div>
          <div><h3>{t("Goed om te weten")}</h3><span>{t("Niet verbonden aan of gecertificeerd door Meta.")}</span><span>{t("Resultaten hangen af van je product, marge en budget.")}</span></div>
        </div>
        <p className="ac-copyright">© {new Date().getFullYear()}{" " + t("verkoop.studio. Alle rechten voorbehouden.")}</p>
      </div>
    </footer>
  </div>
}
