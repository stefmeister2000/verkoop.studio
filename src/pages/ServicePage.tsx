import { Link } from 'react-router-dom'
import ServiceVisual from '../components/ServiceVisual'
import { hasServiceVisual } from '../data/visualServices'
import Seo from '../components/Seo'
import CaseVisual from '../components/CaseVisual'
import CheckList from '../components/CheckList'
import QualificationForm from '../components/QualificationForm'
import Breadcrumbs from '../components/Breadcrumbs'
import ResponsiveImage from '../components/ResponsiveImage'
import { getService } from '../data/services'
import { getCase } from '../data/cases'
import type { ServiceSlug } from '../data/types'
import { trackEvent } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'
import stefDesk from '../assets/stef-desk.webp'
import stefDeskSmall from '../assets/stef-desk-640.webp'

const COPY = {
  nl: {
    servicesCrumb: 'Diensten',
    problemLabel: 'Waar het vastloopt',
    approachLabel: 'Zo werken we',
    deliverablesLabel: 'Wat je krijgt',
    visualLabel: 'Zo werkt het',
    view: 'Bekijk de case',
    partnerLabel: 'Samen met LYTE Studios',
    formTitle: 'Vertel ons over je project',
    cta: 'Bespreek jouw aanpak',
    reply: 'Je hoort binnen 24 uur van ons.',
    nextLabel: 'Wat er daarna gebeurt',
    proofStat: '+120% online omzet',
    steps: ['Jij deelt je doel en uitdaging.', 'We bespreken de kansen en prioriteiten.', 'Je krijgt een voorstel met scope en budget.'],
  },
  en: {
    servicesCrumb: 'Services',
    problemLabel: 'Where it gets stuck',
    approachLabel: 'How we work',
    deliverablesLabel: 'What you get',
    visualLabel: 'How it works',
    view: 'View the case',
    partnerLabel: 'Together with LYTE Studios',
    formTitle: 'Tell us about your project',
    cta: 'Discuss your approach',
    reply: 'You’ll hear from us within 24 hours.',
    nextLabel: 'What happens next',
    proofStat: '+120% online revenue',
    steps: ['You share your goal and challenge.', 'We discuss opportunities and priorities.', 'You receive a proposal with scope and budget.'],
  },
}

function leadIn(title: string, lang: 'nl' | 'en') {
  return lang === 'nl'
    ? `Je bent hier voor ${title}. Vertel ons waar je nu staat. We bekijken je situatie en zeggen welke aanpak past.`
    : `You’re here for ${title}. Tell us where you stand. We’ll look at your situation and say which approach fits.`
}

export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  const service = getService(slug)
  const { lang } = useLang()
  const t = COPY[lang]
  const { ref } = useInView<HTMLDivElement>(() =>
    trackEvent('service_viewed', { service: slug, placement: 'page' }),
  )

  if (!service) return null
  const relatedCase = service.relatedCase ? getCase(service.relatedCase) : undefined
  const showVisual = hasServiceVisual(slug)

  return (
    <div ref={ref} className="service-landing">
      <Seo title={service.title[lang]} description={service.summary[lang]} path={`/${service.slug}`} />

      <section className="service-hero">
        <div className="service-hero-copy reveal">
          <Breadcrumbs items={[{ label: t.servicesCrumb, href: '/#expertise' }, { label: service.title[lang] }]} />
          <h1>{service.title[lang]}</h1>
          <p className="service-hero-lead">{service.summary[lang]}</p>
          <ul className="service-includes">
            {service.includes[lang].map((item) => (
              <li key={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
            ))}
          </ul>
          <a
            className="button-dark"
            href="#audit-formulier-section"
            onClick={() => trackEvent('audit_cta_clicked', { placement: 'service_hero', service: slug })}
          >
            {t.cta} <span aria-hidden="true">↗</span>
          </a>
          <p className="service-reply">{t.reply}</p>
        </div>
        <aside className="service-next">
          <h2>{t.nextLabel}</h2>
          <ol className="contact-steps">
            {t.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </aside>
      </section>

      <section className="service-middle">
        <div className="service-problem">
          <h2>{t.problemLabel}</h2>
          <p>{service.problem[lang]}</p>
        </div>
        <div className="service-offer">
          <h2>{t.deliverablesLabel}</h2>
          <CheckList items={service.deliverables[lang]} columns={1} />
        </div>
        {showVisual && (
          <div className="service-visual-panel">
            <h2>{t.visualLabel}</h2>
            <ServiceVisual service={slug} />
          </div>
        )}
        <div className="service-steps">
          <h2>{t.approachLabel}</h2>
          <ol className="contact-steps">
            {service.process[lang].map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>

      {relatedCase && (
        <Link
          to={`/cases/${relatedCase.slug}`}
          className="service-proof"
          onClick={() => trackEvent('case_viewed', { case: relatedCase.slug, placement: 'service_page' })}
        >
          <CaseVisual case={relatedCase} lang={lang} ratio="aspect-[16/10]" />
          <div>
            <h2>{relatedCase.name}</h2>
            {relatedCase.slug === 'pinacello' && <p className="service-proof-stat">{t.proofStat}</p>}
            <p>{relatedCase.slug === 'pinacello' ? relatedCase.summary[lang].split('. ').slice(1).join('. ') : relatedCase.summary[lang]}</p>
            <span>{t.view} <span aria-hidden="true">↗</span></span>
          </div>
        </Link>
      )}

      {service.partnerCase && (
        <a className="service-proof service-proof-partner" href={service.partnerCase.url} target="_blank" rel="noopener noreferrer">
          <div>
            <p className="service-proof-kicker">{t.partnerLabel}</p>
            <h2>{service.partnerCase.name} <span aria-hidden="true">↗</span></h2>
            <p>{service.partnerCase.description[lang]}</p>
          </div>
        </a>
      )}

      <section id="audit-formulier-section" className="service-close">
        <div className="service-close-head">
          <figure className="service-close-photo">
            <picture>
              <source media="(max-width: 600px)" srcSet={stefDeskSmall} />
              <ResponsiveImage
                src={stefDesk}
                alt={lang === 'nl' ? 'Stef Keppens aan zijn laptop' : 'Stef Keppens at his laptop'}
                sizes="(max-width: 900px) 100vw, 460px"
                loading="lazy"
              />
            </picture>
          </figure>
          <div className="service-close-intro">
            <h2 className="font-display text-balance">{t.formTitle}</h2>
            <p className="contact-lead">{leadIn(service.title[lang], lang)}</p>
            <p className="service-close-who">
              <strong>Stef Keppens</strong>
              <span>Lochristi</span>
              <a href="mailto:stefkeppens@gmail.com">stefkeppens@gmail.com</a>
            </p>
          </div>
        </div>
        <div className="service-close-form">
          <QualificationForm
            id={`audit-formulier-${service.slug}`}
            inquiryContext={lang === 'nl' ? `Dienst: ${service.title[lang]}` : `Service: ${service.title[lang]}`}
          />
        </div>
      </section>
    </div>
  )
}
