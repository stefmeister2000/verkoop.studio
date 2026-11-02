import { useState } from 'react'
import './HeroVideo.css'
import AutoplayVideo from './AutoplayVideo'

export default function HeroVideo({ lang = 'nl', videoId = 'tSjPY9J6ynk', title, autoPlay = false }: { lang?: 'nl' | 'en'; videoId?: string; title?: string; autoPlay?: boolean }) {
  const videoTitle = title ?? (lang === 'nl' ? 'Waarom je Meta Ads geld VERBRANDEN (en hoe je het fixt)' : 'Why your Meta Ads BURN money (and how to fix it) — video in Dutch')
  const [playing, setPlaying] = useState(autoPlay)
  return (
    <div className="hero-video">
      {autoPlay ? <AutoplayVideo videoId={videoId} title={videoTitle} lang={lang} /> : playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0${autoPlay ? '&mute=1' : ''}`}
          title={videoTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="hero-video-play"
          aria-label={`${lang === 'nl' ? 'Speel video af' : 'Play video'}: ${videoTitle}`}
          onClick={() => setPlaying(true)}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            alt=""
            width="1280"
            height="720"
            decoding="async"
            fetchPriority="high"
          />
          <span className="hero-video-icon" aria-hidden="true">▶</span>
        </button>
      )}
      <noscript><a href={`https://www.youtube.com/watch?v=${videoId}`}>{videoTitle}</a></noscript>
    </div>
  )
}
