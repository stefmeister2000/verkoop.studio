import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { pricingTiers } from '../data/pricing'
import Seo from '../components/Seo'
import QualificationForm from '../components/QualificationForm'
import ResponsiveImage from '../components/ResponsiveImage'
import { useLang } from '../i18n/LanguageContext'
import stefDesk from '../assets/stef-desk.webp'
import stefDeskSmall from '../assets/stef-desk-640.webp'

const COPY = {
  nl: {
    seoTitle: 'Contact',
    seoDescription: 'Bespreek je website, software, app of groeiplan met verkoop.studio in Lochristi.',
    title: 'Waar wil je bedrijf naartoe?',
    body: 'Vertel ons je doel en wat vandaag vastloopt. We bespreken je huidige aanpak, bepalen waar de grootste kans zit en bekijken welke samenwerking past.',
    meeting: 'Plan een groeigesprek',
    meetingTooltip: 'De agenda-koppeling volgt. Vul ondertussen het formulier in.',
  },
  en: {
    seoTitle: 'Contact',
    seoDescription: 'Discuss your website, software, app or growth plan with verkoop.studio in Lochristi.',
    title: 'Where do you want your business to go?',
    body: 'Tell us your goal and what is holding you back. We discuss your current approach, identify the biggest opportunity and explore how we can help.',
    meeting: 'Schedule a growth call',
    meetingTooltip: 'The calendar link is coming soon. Fill in the form below in the meantime.',
  },
}

export default function Contact() {
  const { lang } = useLang()
  const t = COPY[lang]
  const [params] = useSearchParams()
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const selectedPackage = ready ? pricingTiers.find(tier => tier.key === params.get('pakket')) : undefined
  const platformNames = { overview: lang === 'nl' ? 'onze klantenplatforms' : 'our client platforms', crm: 'Sales CRM', dashboard: lang === 'nl' ? 'het marketingdashboard' : 'the marketing dashboard' }
  const platformKey = ready ? params.get('platform') : null
  const selectedPlatform = platformKey && Object.hasOwn(platformNames, platformKey) ? platformNames[platformKey as keyof typeof platformNames] : undefined

  const steps = lang === 'nl'
    ? ['Jij deelt je doel en uitdaging.', 'We bespreken de kansen en prioriteiten.', 'Je krijgt een voorstel met scope en budget.']
    : ['You share your goal and challenge.', 'We discuss opportunities and priorities.', 'You receive a proposal with scope and budget.']

  return (
    <div>
      <Seo title={t.seoTitle} description={t.seoDescription} path="/contact" />

      <section className="contact-studio" aria-labelledby="contact-title">
        <aside className="contact-aside">
          <figure className="contact-portrait">
            <picture>
              <source media="(max-width: 600px)" srcSet={stefDeskSmall} />
              <ResponsiveImage
                src={stefDesk}
                alt={lang === 'nl' ? 'Stef Keppens aan zijn laptop' : 'Stef Keppens at his laptop'}
                sizes="(max-width: 800px) 100vw, 420px"
                loading="eager"
                fetchPriority="high"
              />
            </picture>
          </figure>
          <div className="contact-note">
            <p className="contact-who">
              <strong>Stef Keppens</strong>
              <span>Lochristi</span>
            </p>
            <a className="contact-mail" href="mailto:stefkeppens@gmail.com">stefkeppens@gmail.com</a>
            {!selectedPlatform && (
              <ol className="contact-steps">
                {steps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            )}
          </div>
        </aside>

        <div className="panel contact-form-panel">
          <h1 id="contact-title" className="font-display text-balance">
            {selectedPlatform ? (lang === 'nl' ? 'Toegang tot onze platforms' : 'Access our platforms') : t.title}
          </h1>
          <p className="contact-lead">
            {selectedPlatform
              ? (lang === 'nl'
                ? `Je wilt meer weten over ${selectedPlatform}. Deze platforms zijn gratis voor klanten van verkoop.studio. Laat je gegevens achter en vertel ons waarvoor je het platform wilt gebruiken.`
                : `You’re interested in ${selectedPlatform}. These platforms are free for verkoop.studio clients. Leave your details and tell us how you would like to use the platform.`)
              : t.body}
          </p>
          {selectedPackage && (
            <div className="selected-package">
              {lang === 'nl' ? 'Je wilt meer weten over' : 'You’re interested in'} <strong>{selectedPackage.name[lang]}</strong>.
              <Link to="/#groeipakketten">{lang === 'nl' ? 'Pakketten bekijken' : 'View packages'}</Link>
            </div>
          )}
          <h2 className="font-display">
            {selectedPlatform ? (lang === 'nl' ? 'Vraag toegang aan' : 'Request access') : (lang === 'nl' ? 'Vertel ons over je project' : 'Tell us about your project')}
          </h2>
          <QualificationForm id="audit-formulier-contact" inquiryContext={selectedPlatform ? `Platform: ${selectedPlatform}` : selectedPackage ? `Pakket: ${selectedPackage.name[lang]}` : undefined} />
        </div>
      </section>
    </div>
  )
}
