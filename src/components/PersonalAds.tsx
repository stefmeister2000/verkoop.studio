import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { getCase } from '../data/cases'
import './PersonalAds.css'

export default function PersonalAds() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section className="personal-ads" aria-labelledby="personal-ads-title" id="persoonlijke-ads">
      <div className="personal-ads-copy">
        <span className="personal-ads-eyebrow">{nl ? 'Persoonlijke videoadvertenties' : 'Personal video ads'}</span>
        <h2 id="personal-ads-title">{nl ? 'Een gezicht bij je merk.' : 'A face behind your brand.'}</h2>
        <p>{nl
          ? 'Laat de mensen achter je zaak aan het woord. Bij Pinacello vertellen de makers hun productverhaal. Bij Healthfactor krijg je een kijkje in de gym, met iemand die je rechtstreeks aanspreekt.'
          : 'Let the people behind your business tell the story. At Pinacello, the makers share their product story. At Healthfactor, you get a look inside the gym with someone speaking directly to you.'}</p>
        <p>{nl
          ? 'Zo maken we persoonlijke ads: een herkenbaar gezicht, beelden uit je eigen zaak en een boodschap die je ook zonder geluid kunt volgen. Van het eerste idee tot de opname en montage.'
          : 'That is how we approach personal ads: a recognisable face, footage from your own business and a message viewers can follow without sound. From the first idea to filming and editing.'}</p>
        <Link className="button-dark" to="/contact">{nl ? 'Bespreek jouw video' : 'Discuss your video'} <span aria-hidden="true">↗</span></Link>
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
