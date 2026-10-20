import ResponsiveImage from '../components/ResponsiveImage'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import pinacello from '../assets/cases/pinacello.webp'

export default function PerformanceAds() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const [channel, setChannel] = useState<'meta' | 'google'>('meta')
  const meta = channel === 'meta'
  return (
    <section className="performance-section" id="performance">
      <div className="performance-heading">
        <div>
          <h2>
            {nl ? 'Aandacht inkopen.' : 'Buy attention.'}
            <br />
            <span>{nl ? 'Omzet opbouwen.' : 'Build revenue.'}</span>
          </h2>
        </div>
        <p>
          {nl
            ? 'Meta Ads creëert vraag. Google Ads vangt koopintentie op. We koppelen beide aan een aanbod, een sterke pagina en meting tot aan de verkoop.'
            : 'Meta Ads creates demand. Google Ads captures buying intent. We connect both to an offer, a strong landing page and measurement through to the sale.'}
        </p>
      </div>
      <div
        className="channel-selector"
        role="group"
        aria-label={nl ? 'Kies advertentiekanaal' : 'Choose ad channel'}
      >
        <button
          type="button"
          aria-pressed={meta}
          onClick={() => setChannel('meta')}
        >
          <span className="meta-mark" aria-hidden="true">
            ∞
          </span>{' '}
          Meta Ads
        </button>
        <button
          type="button"
          aria-pressed={!meta}
          onClick={() => setChannel('google')}
        >
          <span className="google-mark" aria-hidden="true">
            G
          </span>{' '}
          Google Ads
        </button>
      </div>
      <div className={'channel-stage ' + channel} key={channel}>
        <div
          className="campaign-preview"
          aria-label={
            nl
              ? 'Illustratief campagneconcept'
              : 'Illustrative campaign concept'
          }
        >
          <span className="concept-label">
            {nl ? 'Campagneconcept' : 'Campaign concept'} /{' '}
            {meta ? 'Meta Ads' : 'Google Ads'}
          </span>
          {meta ? (
            <div className="social-ad">
              <div className="social-ad-header">
                <span className="ad-avatar">P.</span>
                <div>
                  <strong>Pinacello</strong>
                  <small>{nl ? 'Advertentieconcept' : 'Ad concept'}</small>
                </div>
                <span>•••</span>
              </div>
              <div className="social-creative">
                <ResponsiveImage
                  src={pinacello}
                  alt="Campagnevisual van Pinacello"
                  loading="lazy"
                />
              </div>
              <div className="ad-footer">
                <span>
                  {nl
                    ? 'Ontdek je nieuwe aperitief.'
                    : 'Meet your new aperitif.'}
                </span>
                <span className="ad-mock-button">
                  {nl ? 'Shop nu' : 'Shop now'} ↗
                </span>
              </div>
            </div>
          ) : (
            <div className="search-preview">
              <div className="search-bar">
                <span className="google-mark">G</span>
                <span>
                  {nl ? 'origineel aperitief kopen' : 'buy a unique aperitif'}
                </span>
                <span>⌕</span>
              </div>
              <div className="search-ad">
                <small>
                  {nl
                    ? 'Gesponsord · Advertentieconcept'
                    : 'Sponsored · Ad concept'}
                </small>
                <div className="search-brand">
                  <span className="ad-avatar">P.</span>
                  <span>
                    Pinacello
                    <br />
                    <small>pinacello.com</small>
                  </span>
                </div>
                <h3>
                  {nl
                    ? 'Een nieuwe favoriet voor je aperitief.'
                    : 'A new favourite for your aperitif.'}
                </h3>
                <p>
                  {nl
                    ? 'Ontdek Pinacello. Van een gezellige avond tot een bijzonder cadeau: vind jouw moment.'
                    : 'Discover Pinacello. From a relaxed evening to a thoughtful gift: find your moment.'}
                </p>
                <div className="search-sitelinks">
                  <span>
                    {nl ? 'Ontdek de collectie' : 'Explore the collection'}
                  </span>
                  <span>{nl ? 'Het verhaal' : 'Our story'}</span>
                </div>
              </div>
            </div>
          )}
          <div className="campaign-flow" aria-hidden="true">
            <span>{meta ? 'Creative' : 'Search intent'}</span>
            <i>→</i>
            <span>Landing page</span>
            <i>→</i>
            <strong>Sale ↗</strong>
          </div>
        </div>
        <div className="channel-copy">
          <span className="channel-kicker">
            {meta ? '01 / Demand creation' : '02 / Demand capture'}
          </span>
          <h3>
            {meta
              ? nl
                ? 'Creatives die stoppen met scrollen. Funnels die verkopen.'
                : 'Creatives that stop the scroll. Funnels that sell.'
              : nl
                ? 'Gevonden worden op het moment dat iemand wil kopen.'
                : 'Be found when someone is ready to buy.'}
          </h3>
          <p>
            {meta
              ? nl
                ? 'We testen invalshoeken, beelden en aanbiedingen. De klik komt op een pagina die dezelfde belofte verder vertelt, met een heldere volgende stap.'
                : 'We test angles, visuals and offers. Each click lands on a page that continues the same promise, with a clear next step.'
              : nl
                ? 'We stemmen zoekintentie, advertentie en landingspagina op elkaar af. Zo richten we het budget op relevante aanvragen en aankopen.'
                : 'We align search intent, ad and landing page, focusing the budget on relevant enquiries and purchases.'}
          </p>
          <ul>
            {(meta
              ? nl
                ? [
                    'Creative strategie & varianten',
                    'Prospecting & retargeting',
                    'Conversietracking & optimalisatie',
                  ]
                : [
                    'Creative strategy & variants',
                    'Prospecting & retargeting',
                    'Conversion tracking & optimisation',
                  ]
              : nl
                ? [
                    'Zoekwoorden & koopintentie',
                    'Search-campagnes & landingspagina’s',
                    'Budgetsturing op conversiewaarde',
                  ]
                : [
                    'Keywords & buying intent',
                    'Search campaigns & landing pages',
                    'Budget decisions based on conversion value',
                  ]
            ).map((item) => (
              <li key={item}>
                <span>↗</span>
                {item}
              </li>
            ))}
          </ul>
          <Link to={meta ? '/meta-ads' : '/google-ads'} className="button-dark">
            {nl ? 'Ontdek de aanpak' : 'Explore the approach'} ↗
          </Link>
        </div>
      </div>
    </section>
  )
}
