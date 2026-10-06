import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { pricingTiers } from '../data/pricing'
import Seo from '../components/Seo'
import QualificationForm from '../components/QualificationForm'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    seoTitle: 'Contact',
    seoDescription: 'Bespreek je website, software, app of groeiplan met verkoop.studio in Lochristi.',
    title: 'Waar wil je bedrijf naartoe?',
    body: 'Vertel ons je doel en wat vandaag vastloopt. We bespreken je huidige aanpak, bepalen waar de grootste kans zit en bekijken welke samenwerking past.',
    meeting: 'Plan een groeigesprek',
    meetingTooltip: 'Agenda-koppeling volgt — vul ondertussen het formulier in.',
  },
  en: {
    seoTitle: 'Contact',
    seoDescription: 'Discuss your website, software, app or growth plan with verkoop.studio in Lochristi.',
    title: 'Where do you want your business to go?',
    body: 'Tell us your goal and what is holding you back. We discuss your current approach, identify the biggest opportunity and explore how we can help.',
    meeting: 'Schedule a growth call',
    meetingTooltip: 'Calendar link coming soon — fill in the form below in the meantime.',
  },
}

export default function Contact() {
  const { lang } = useLang()
  const t = COPY[lang]
  const [params] = useSearchParams()
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  const selectedPackage = ready ? pricingTiers.find(tier => tier.key === params.get('pakket')) : undefined
  const platformNames = { overview: lang === 'nl' ? 'onze klantenplatforms' : 'our client platforms', crm: 'Sales CRM', dashboard: lang === 'nl' ? 'het marketingdashboard' : 'the marketing dashboard', affiliates: lang === 'nl' ? 'het affiliateplatform' : 'the affiliate platform' }
  const platformKey = ready ? params.get('platform') : null
  const selectedPlatform = platformKey && Object.hasOwn(platformNames, platformKey) ? platformNames[platformKey as keyof typeof platformNames] : undefined

  return (
    <div>
      <Seo title={t.seoTitle} description={t.seoDescription} path="/contact" />

      <section className="border-b border-line">
        <div className="reveal mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
          <h1 className="font-display text-4xl text-paper text-balance sm:text-5xl">{selectedPlatform ? (lang === 'nl' ? 'Toegang tot onze platforms' : 'Access our platforms') : t.title}</h1>
          <p className="mt-5 text-lg text-bone">{selectedPlatform ? (lang === 'nl' ? `Je wilt meer weten over ${selectedPlatform}. Deze platforms zijn gratis voor klanten van verkoop.studio. Laat je gegevens achter en vertel ons waarvoor je het platform wilt gebruiken.` : `You’re interested in ${selectedPlatform}. These platforms are free for verkoop.studio clients. Leave your details and tell us how you would like to use the platform.`) : t.body}</p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a href="mailto:stefkeppens@gmail.com" className="text-sm text-accent-2 hover:text-accent">
              stefkeppens@gmail.com
            </a>

          </div>

          {selectedPackage && <div className="selected-package">{lang === 'nl' ? 'Je wilt meer weten over' : 'You’re interested in'} <strong>{selectedPackage.name[lang]}</strong>.<Link to="/#groeipakketten">{lang === 'nl' ? 'Pakketten bekijken' : 'View packages'}</Link></div>}
          {!selectedPlatform && <ol className="contact-next-steps">
            <li>{lang === 'nl' ? '01 · Jij deelt je doel en uitdaging.' : '01 · You share your goal and challenge.'}</li>
            <li>{lang === 'nl' ? '02 · We bespreken de kansen en prioriteiten.' : '02 · We discuss opportunities and priorities.'}</li>
            <li>{lang === 'nl' ? '03 · Je krijgt een voorstel met scope en budget.' : '03 · You receive a proposal with scope and budget.'}</li>
          </ol>}
          <div className="mt-10">
            <h2 className="mb-6 font-display text-2xl text-paper">{selectedPlatform ? (lang === 'nl' ? 'Vraag toegang aan' : 'Request access') : (lang === 'nl' ? 'Vertel ons over je project' : 'Tell us about your project')}</h2>
            <QualificationForm id="audit-formulier-contact" inquiryContext={selectedPlatform ? `Platform: ${selectedPlatform}` : selectedPackage ? `Pakket: ${selectedPackage.name[lang]}` : undefined} />
          </div>
        </div>
      </section>
    </div>
  )
}
