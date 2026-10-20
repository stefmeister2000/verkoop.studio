import { faqItems } from '../data/faq'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

export default function FAQ() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  return (
    <section className="studio-faq" aria-labelledby="faq-title">
      <div ref={ref} className="reveal studio-faq-inner">
        <h2 id="faq-title" className="font-display text-balance">{lang === 'nl' ? 'Veelgestelde vragen' : 'Frequently asked questions'}</h2>
        <div className="faq-list">
          {faqItems.map((item, i) => (
            <details key={item.question[lang]} name="studio-faq" open={i === 0} className="faq-item">
              <summary>
                <span>{item.question[lang]}</span>
                <span aria-hidden="true">+</span>
              </summary>
              <p>{item.answer[lang]}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
