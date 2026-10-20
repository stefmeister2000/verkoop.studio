import { Link } from 'react-router-dom'
import { persistentCta, persistentCtaHref } from '../data/nav'
import { trackEvent } from '../lib/analytics'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    title: 'Klaar om van marketing meer omzet te maken?',
    body: 'Ontdek waar jullie advertenties, website, ecommerce of opvolging vandaag omzet verliezen.',
    ctaSecondary: 'Bekijk ons werk',
  },
  en: {
    title: 'Ready to turn marketing into more revenue?',
    body: 'Find out where your ads, website, ecommerce or follow-up are losing revenue today.',
    ctaSecondary: 'See our work',
  },
}

export default function FinalCTA() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section ref={ref} className="closing-cta reveal">
      <div className="closing-cta-inner">
        <h2 className="font-display text-balance">{t.title}</h2>
        <p>{t.body}</p>

        <div className="hero-actions">
          <Link
            to={persistentCtaHref}
            onClick={() => trackEvent('audit_cta_clicked', { placement: 'final_cta' })}
            className="button-dark"
          >
            {persistentCta[lang]}
          </Link>
          <Link to="/cases" className="button-light">
            {t.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  )
}
