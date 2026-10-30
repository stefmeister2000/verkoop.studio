import ResponsiveImage from './ResponsiveImage'
import { clients } from '../data/clients'
import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const COPY = {
  nl: {
    title: 'Actief in ecommerce, hospitality en consumer brands',
    body: 'We werken aan digitale groei in verschillende commerciële omgevingen: van ecommerce en lokale leadgeneratie tot boekingsfunnels en B2B-events.',
  },
  en: {
    title: 'Active in ecommerce, hospitality and consumer brands',
    body: 'We work on digital growth across different commercial environments: from ecommerce and local lead generation to booking funnels and B2B events.',
  },
}

export default function ClientWorkBar() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section className="border-b border-line">
      <div ref={ref} className="reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="max-w-2xl font-display text-2xl text-paper text-balance sm:text-3xl">{t.title}</h2>
        <p className="mt-4 max-w-2xl text-bone">{t.body}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <div key={client.name} className="overflow-hidden rounded-2xl border border-line bg-surface">
              {client.image ? (
                <ResponsiveImage
                  src={client.image}
                  alt={client.name}
                  loading="lazy"
                  className="aspect-[16/9] w-full border-b border-line object-cover object-top"
                />
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center border-b border-line bg-surface-2">
                  <span className="font-display text-2xl text-accent-2">{client.name}</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex h-12 items-center">
                  <span className="font-display text-xl text-paper">{client.name}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-mute">{client.description[lang]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
