import { useLang } from '../i18n/LanguageContext'
import HeroVideo from './HeroVideo'
import HeroRequestForm from './HeroRequestForm'
import './PersonalHero.css'

export default function PersonalHero() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  return (
    <section className="studio-hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>{nl ? 'Wij helpen kmo’s groeien' : 'We help small businesses grow'}</span>{' '}
          {nl
            ? 'met advertenties, overtuigende websites en automatische opvolging'
            : 'with ads, persuasive websites and automated follow-up'}
        </h1>
        <HeroRequestForm kind="plan" />
      </div>
      <div className="hero-video-area">
        <HeroVideo lang={lang} videoId="VPaGW0vW-X0" title="Verkoop Studio — VSL website" autoPlay />
      </div>
    </section>
  )
}
