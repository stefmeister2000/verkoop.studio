import ResponsiveImage from '../components/ResponsiveImage'
import type { CaseStudy, Lang } from '../data/types'
import Placeholder from './Placeholder'

const COMING_SOON = { nl: 'Binnenkort beschikbaar', en: 'Coming soon' }
const UNAVAILABLE = {
  nl: 'Geen beeldmateriaal beschikbaar voor dit afgeronde project.',
  en: 'No visual material available for this completed project.',
}

interface CaseVisualProps {
  case: CaseStudy
  lang: Lang
  ratio?: string
  className?: string
  video?: boolean
}

export default function CaseVisual({ case: c, lang, ratio = 'aspect-[16/10]', className = '', video = false }: CaseVisualProps) {
  if (video && c.video) {
    return (
      <div className={`mx-auto flex w-fit max-w-full justify-center rounded-2xl border border-line bg-black ${className}`}>
        <video
          src={c.video}
          controls
          playsInline
          preload="metadata"
          className="max-h-[70vh] w-auto max-w-full rounded-2xl"
        />
      </div>
    )
  }

  if (c.image) {
    return (
      <ResponsiveImage
        src={c.image}
        alt={c.name}
        loading="lazy"
        className={`${ratio} w-full rounded-2xl border border-line object-cover object-top ${className}`}
      />
    )
  }

  if (c.comingSoon) {
    return <Placeholder label={`${c.name}, ${COMING_SOON[lang]}`} ratio={ratio} className={className} />
  }

  if (c.unavailable) {
    return <p className={`text-sm text-mute ${className}`}>{UNAVAILABLE[lang]}</p>
  }

  return <Placeholder label={c.name} ratio={ratio} className={className} />
}
