import { processSteps, workModes } from '../data/process'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: { title: 'Van probleem naar werkend systeem', iWork: 'We werken: ' },
  en: { title: 'From problem to working system', iWork: 'We work: ' },
}

export default function ProcessSection() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section className="studio-process">
      <div ref={ref} className="reveal studio-process-inner">
        <h2 className="font-display text-balance">{t.title}</h2>

        <div className="process-steps">
          {processSteps.map((step) => (
            <div key={step.number} className="process-step">
              <span className="font-display">{step.number}</span>
              <h3 className="font-display">{step.title[lang]}</h3>
              <p>{step.description[lang]}</p>
            </div>
          ))}
        </div>

        <p className="process-modes">
          <span>{t.iWork}</span>
          {workModes[lang].join(' · ')}
        </p>
      </div>
    </section>
  )
}
