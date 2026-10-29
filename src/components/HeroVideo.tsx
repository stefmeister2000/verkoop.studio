import { useState } from 'react'
import './HeroVideo.css'

const videoId = 'tSjPY9J6ynk'

export default function HeroVideo({ lang = 'nl' }: { lang?: 'nl' | 'en' }) {
  const videoTitle = lang === 'nl' ? 'Waarom je Meta Ads geld VERBRANDEN (en hoe je het fixt)' : 'Why your Meta Ads BURN money (and how to fix it) — video in Dutch'
  const [playing, setPlaying] = useState(false)
  return (
    <div className="hero-video">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
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
          />
          <span className="hero-video-icon" aria-hidden="true">▶</span>
        </button>
      )}
      <noscript><a href={`https://www.youtube.com/watch?v=${videoId}`}>{videoTitle}</a></noscript>
    </div>
  )
}
