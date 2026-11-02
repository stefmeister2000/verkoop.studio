import { useEffect, useRef, useState } from 'react'

type Player = {
  unMute: () => void
  mute: () => void
  isMuted: () => boolean
  setVolume: (volume: number) => void
  getVolume: () => number
  playVideo: () => void
  destroy: () => void
  getIframe: () => HTMLIFrameElement
}
type PlayerEvent = { target: Player }
type YouTubeAPI = { Player: new (element: HTMLElement, options: {
  host: string
  videoId: string
  playerVars: Record<string, string | number>
  events: { onReady: (event: PlayerEvent) => void }
}) => Player }
type YouTubeWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void }
let apiPromise: Promise<YouTubeAPI> | undefined

function loadYouTubeAPI() {
  const win = window as YouTubeWindow
  if (win.YT?.Player) return Promise.resolve(win.YT)
  if (apiPromise) return apiPromise
  apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const previous = win.onYouTubeIframeAPIReady
    const script = document.createElement('script')
    const timeout = window.setTimeout(() => { script.remove(); reject(new Error('YouTube API timed out')) }, 15000)
    win.onYouTubeIframeAPIReady = () => {
      window.clearTimeout(timeout)
      previous?.()
      if (win.YT?.Player) resolve(win.YT)
      else reject(new Error('YouTube API unavailable'))
    }
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    script.onerror = () => { window.clearTimeout(timeout); script.remove(); reject(new Error('YouTube API unavailable')) }
    document.head.append(script)
  }).catch(error => { apiPromise = undefined; throw error })
  return apiPromise
}

export default function AutoplayVideo({ videoId, title, lang }: { videoId: string; title: string; lang: 'nl' | 'en' }) {
  const container = useRef<HTMLDivElement>(null)
  const player = useRef<Player | null>(null)
  const [ready, setReady] = useState(false)
  const [sound, setSound] = useState(false)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let active = true, instance: Player | undefined, timer: number | undefined, readyTimeout: number | undefined
    if (!container.current) return
    const mount = document.createElement('iframe')
    mount.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`
    mount.title = title
    mount.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    mount.referrerPolicy = 'strict-origin-when-cross-origin'
    mount.allowFullscreen = true
    container.current.replaceChildren(mount)
    loadYouTubeAPI().then(api => {
      if (!active) return
      readyTimeout = window.setTimeout(() => { if (active) { instance?.destroy(); setFailed(true) } }, 15000)
      instance = new api.Player(mount, {
        host: 'https://www.youtube-nocookie.com', videoId,
        playerVars: { autoplay: 1, mute: 1, playsinline: 1, rel: 0, origin: window.location.origin },
        events: { onReady: ({ target }) => {
          if (!active) return
          target.getIframe().title = title
          window.clearTimeout(readyTimeout)
          player.current = target
          setReady(true)
          const syncSound = () => setSound(!target.isMuted() && target.getVolume() > 0)
          syncSound()
          timer = window.setInterval(syncSound, 500)
        } },
      })
    }).catch(() => { if (active) setFailed(true) })
    return () => {
      active = false
      window.clearInterval(timer)
      window.clearTimeout(readyTimeout)
      player.current = null
      instance?.destroy()
    }
  }, [videoId, title])
  function toggleSound() {
    const current = player.current
    if (!current) return
    if (!current.isMuted() && current.getVolume() > 0) {
      current.mute()
      setSound(false)
    } else {
      // Run synchronously in the visitor's click so audible playback has a user gesture.
      current.unMute()
      current.setVolume(100)
      current.playVideo()
      setSound(true)
    }
  }
  return <>
    {failed ? <iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&mute=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <div className="hero-video-player" ref={container} />}
    {!failed && <button type="button" className="hero-video-sound" onClick={toggleSound} disabled={!ready} aria-pressed={sound} aria-label={lang === 'nl' ? (sound ? 'Geluid uit' : 'Geluid aan') : (sound ? 'Sound off' : 'Sound on')}>
      <span aria-hidden="true">{sound ? '🔊' : '🔇'}</span> {lang === 'nl' ? (sound ? 'Geluid uit' : 'Geluid aan') : (sound ? 'Sound off' : 'Sound on')}
    </button>}
  </>
}
