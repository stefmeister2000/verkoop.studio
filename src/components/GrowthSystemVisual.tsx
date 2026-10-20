import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    title: 'Eén meetbare route van aandacht naar omzet',
    body: 'We kijken niet naar advertenties, websites en automatiseringen als losse onderdelen. We verbinden ze tot één systeem waarin elke stap een duidelijke commerciële functie heeft.',
    stages: [
      { label: 'Aandacht', items: ['Meta Ads', 'Google Ads', 'Content', 'PR', 'Referrals', 'Outreach'] },
      { label: 'Conversiepunt', items: ['Gerichte landingspagina'] },
      { label: 'Actie', items: ['Lead', 'Boeking', 'Aankoop'] },
      { label: 'Opvolging', items: ['E-mail', 'CRM', 'Retargeting', 'AI-opvolging'] },
      { label: 'Resultaat', items: ['Klant'] },
      { label: 'Groei', items: ['Omzet-tracking', 'Retentie', 'Herhaalaankoop'] },
    ],
  },
  en: {
    title: 'One measurable route from attention to revenue',
    body: 'We don’t treat ads, websites and automations as separate pieces. We connect them into one system where every step has a clear commercial function.',
    stages: [
      { label: 'Attention', items: ['Meta Ads', 'Google Ads', 'Content', 'PR', 'Referrals', 'Outreach'] },
      { label: 'Conversion point', items: ['Focused landing page'] },
      { label: 'Action', items: ['Lead', 'Booking', 'Purchase'] },
      { label: 'Follow-up', items: ['Email', 'CRM', 'Retargeting', 'AI follow-up'] },
      { label: 'Result', items: ['Customer'] },
      { label: 'Growth', items: ['Revenue tracking', 'Retention', 'Repeat purchase'] },
    ],
  },
}

export default function GrowthSystemVisual() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section id="aanpak" className="border-b border-line">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <h2 className="max-w-2xl font-display text-3xl text-paper text-balance sm:text-4xl">{t.title}</h2>
        <p className="mt-5 max-w-2xl text-bone">{t.body}</p>

        <div className="mt-12 divide-y divide-line border-y border-line">
          {t.stages.map((stage) => (
            <div key={stage.label} className="flex flex-col gap-1.5 py-5 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="w-40 shrink-0 text-sm font-semibold text-paper">
                {stage.label}
              </span>
              <p className="text-bone">{stage.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
