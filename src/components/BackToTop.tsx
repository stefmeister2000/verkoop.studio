import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'

const LABEL = { nl: 'Terug naar boven', en: 'Back to top' }

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const { lang } = useLang()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}
      aria-label={LABEL[lang]}
      title={LABEL[lang]}
      className="back-to-top fixed bottom-24 left-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-ink/90 text-paper shadow-lg backdrop-blur transition hover:border-accent lg:bottom-6 lg:left-6"
    >
      <span aria-hidden className="text-lg leading-none">
        ↑
      </span>
    </button>
  )
}
