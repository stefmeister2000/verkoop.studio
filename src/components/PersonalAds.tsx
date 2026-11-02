import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getCase } from '../data/cases'
import './PersonalAds.css'

export default function PersonalAds() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section className="personal-ads" aria-labelledby="personal-ads-title" id="resultaten">
      <div className="personal-ads-copy" id="persoonlijke-ads">
        <span className="personal-ads-eyebrow">{nl ? 'Advertenties, websites en resultaat' : 'Ads, websites and results'}</span>
        <h2 id="personal-ads-title">{nl ? 'Van persoonlijk verhaal naar aanvraag of verkoop.' : 'From a personal story to an enquiry or sale.'}</h2>
        <p>{nl
          ? 'Bij Pinacello vertellen de makers over hun product. Bij Healthfactor maak je kennis met de mensen en de gym. We filmen op locatie en maken advertenties met hun eigen verhaal.'
          : 'At Pinacello, the makers talk about their product. At Healthfactor, you meet the people and see the gym. We film on location and turn their stories into ads.'}</p>
        <p>{nl
          ? 'De advertentie leidt naar een website met een helder aanbod en een eenvoudige volgende stap. We volgen aanvragen en verkopen op om de campagne te verbeteren.'
          : 'The ad leads to a website with a clear offer and a simple next step. We track enquiries and sales to improve the campaign.'}</p>
        <Link className="button-dark" to="/contact">{nl ? 'Bespreek jouw campagne' : 'Discuss your campaign'} <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="personal-ads-examples">
        {(['pinacello', 'healthfactor'] as const).map(slug => {
          const project = getCase(slug)!
          return (
            <figure className="personal-ad" key={slug}>
              <video
                controls
                playsInline
                preload="none"
                width="720"
                height="1280"
                poster={project.videoPoster}
                src={project.video}
                aria-label={`${project.name}: ${nl ? 'persoonlijke videoadvertentie' : 'personal video ad'}`}
                onPlay={event => {
                  const current = event.currentTarget
                  current.closest('.personal-ads-examples')?.querySelectorAll('video').forEach(video => {
                    if (video !== current) video.pause()
                  })
                }}
              />
              <figcaption>
                <h3>{project.name}</h3>
                <strong className="personal-ad-result">{slug === 'pinacello'
                  ? (nl ? '+120% online omzet' : '+120% online revenue')
                  : (nl ? '50+ aanvragen in 30 dagen' : '50+ enquiries in 30 days')}</strong>
                <p>{slug === 'pinacello'
                  ? (nl ? 'De makers en het verhaal achter het product.' : 'The makers and the story behind the product.')
                  : (nl ? 'Een persoonlijke kennismaking in de gym.' : 'A personal introduction inside the gym.')}</p>
                <Link to={`/cases/${slug}`}>{nl ? 'Bekijk de case' : 'View the case'} <span aria-hidden="true">↗</span></Link>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </section>
  )
}
