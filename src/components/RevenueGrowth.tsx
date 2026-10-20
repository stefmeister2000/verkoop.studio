import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'

export default function RevenueGrowth() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section className="revenue-case" id="resultaten">
      <div className="revenue-copy">
        <h2>
          {nl ? 'Mooi is het begin.' : 'Great design is the start.'}
          <br />
          <span>{nl ? 'Groei is het doel.' : 'Growth is the goal.'}</span>
        </h2>
        <p>
          {nl
            ? 'We verbinden je aanbod, advertenties en webshop. Zo krijgt aandacht een duidelijke route naar een aankoop, en kunnen we verbeteren op wat er echt verkoopt.'
            : 'We connect your offer, ads and online store. Attention then has a clear path to purchase, and we can optimise for what actually sells.'}
        </p>
        <Link to="/cases/pinacello" className="button-dark">
          {nl ? 'Bekijk Pinacello' : 'Explore Pinacello'} ↗
        </Link>
      </div>
      <div className="revenue-proof">
        <iframe
          className="revenue-video"
          src="https://www.youtube-nocookie.com/embed/Yy8j3y5s4jU?rel=0"
          title={nl ? 'Bekijk de Pinacello-video' : 'Watch the Pinacello video'}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <Link to="/cases/pinacello" className="revenue-stat">
          <strong>
            +120<span>%</span>
          </strong>
          <p>
            {nl ? 'online omzetgroei' : 'online revenue growth'}{' '}
            <span aria-hidden="true">↗</span>
          </p>
        </Link>
      </div>
      <div className="revenue-principles">
        {(nl
          ? [
              [
                '01',
                'Meer relevante kopers',
                'Een scherp aanbod voor de juiste doelgroep.',
              ],
              [
                '02',
                'Meer conversie',
                'Ads en landingspagina’s die elkaar versterken.',
              ],
              [
                '03',
                'Zicht op rendement',
                'Sturen op omzet, acquisitiekosten en marge.',
              ],
            ]
          : [
              [
                '01',
                'More relevant buyers',
                'A clear offer for the right audience.',
              ],
              [
                '02',
                'More conversions',
                'Ads and landing pages that work together.',
              ],
              [
                '03',
                'A view of profitability',
                'Revenue, acquisition cost and margin guide decisions.',
              ],
            ]
        ).map(([n, title, body]) => (
          <div key={n}>
            <span>{n}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
