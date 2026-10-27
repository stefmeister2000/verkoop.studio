import ResponsiveImage from './ResponsiveImage'
import pinacello from '../assets/cases/pinacello.webp'
import type { Lang } from '../data/types'

export default function WebsiteStage({ lang }: { lang: Lang }) {
  return (
    <figure className="website-stage">
      <ResponsiveImage
        src={pinacello}
        alt={lang === 'nl' ? 'De Pinacello-webshop' : 'The Pinacello online store'}
        sizes="(max-width: 900px) 100vw, 640px"
      />
      <figcaption>
        <strong>Pinacello</strong>
        <span>{lang === 'nl' ? '+120% online omzet' : '+120% online revenue'}</span>
      </figcaption>
    </figure>
  )
}
