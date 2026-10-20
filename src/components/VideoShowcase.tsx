import { useInView } from '../lib/useInView'
import { useLang } from '../i18n/LanguageContext'

const CHANNEL_URL = 'https://www.youtube.com/@StefmeisterBE/videos'
const VIDEO_EMBED = 'https://www.youtube-nocookie.com/embed/G4jEwA_Znz4?start=120&rel=0'

const COPY = {
  nl: {
    title: 'Inzichten uit de praktijk: van AI-ads tot funnels',
    body: 'Op zijn YouTube-kanaal deelt Stef nieuwe vormen van adverteren en digitale groei, zoals AI-gegenereerde advertenties. Concreet, met echte voorbeelden.',
    caption: 'Uitgelicht: een nieuwe vorm van AI-advertenties.',
    cta: 'Bekijk het YouTube-kanaal van Stef',
    videoTitle: 'Nieuwe vorm van AI-advertenties, door Stefmeister',
  },
  en: {
    title: 'Insights from practice: from AI ads to funnels',
    body: 'On his YouTube channel, Stef breaks down new forms of advertising and digital growth, like AI-generated ads. Practical, with real examples.',
    caption: 'Featured: a new form of AI-generated ads.',
    cta: 'Visit Stef’s YouTube channel',
    videoTitle: 'A new form of AI ads, by Stefmeister',
  },
}

export default function VideoShowcase() {
  const { ref } = useInView<HTMLDivElement>()
  const { lang } = useLang()
  const t = COPY[lang]

  return (
    <section id="youtube" className="border-b border-line">
      <div
        ref={ref}
        className="reveal mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <div>
          <h2 className="font-display text-3xl text-paper text-balance sm:text-4xl">{t.title}</h2>
          <p className="mt-5 max-w-xl text-bone">{t.body}</p>
          <a
            href={CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-ink transition hover:bg-accent-2"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.4 31.4 0 0 0 24 12a31.4 31.4 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
            </svg>
            {t.cta}
          </a>
        </div>

        <figure>
          <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-black">
            <iframe
              src={VIDEO_EMBED}
              title={t.videoTitle}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <figcaption className="mt-3 text-sm text-mute">{t.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
