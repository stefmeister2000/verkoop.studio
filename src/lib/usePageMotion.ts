import { useEffect, useRef } from 'react'

/** Progressive enhancement: content remains visible without JS or animation support. */
export function usePageMotion(route = '/') {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root || !('IntersectionObserver' in window)) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const pointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mobile = window.matchMedia('(max-width: 1023px)')
    // Keep touch scrolling immediate: no entrance animations or pointer listeners.
    if (mobile.matches || !pointer.matches || preference.matches) return
    const animations = new Set<Animation>()
    const cleanups: (() => void)[] = []
    const play = (el: Element, frames: Keyframe[], delay = 0, duration = 750) => {
      if (preference.matches || mobile.matches || !pointer.matches || !el.animate) return
      const animation = el.animate(frames, { duration, delay, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' })
      animations.add(animation)
      animation.onfinish = () => { animations.delete(animation); animation.cancel() }
    }
    const observer = new IntersectionObserver(entries => {
      let index = 0
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (preference.matches || mobile.matches || !pointer.matches) return
        const delay = Math.min(index++ * 65, 195)
        play(entry.target, [{ opacity: 0, translate: '0 30px' }, { opacity: 1, translate: '0 0' }], delay)
        // Each service illustration tells its story in a short, ordered sequence.
        entry.target.querySelectorAll('.concept-search, .concept-search-result, .concept-creative, .concept-tag, .data-sources, .data-connector, .concept-dashboard, .email-event, .flow-line, .concept-mail, .email-branches').forEach((part, i) => {
          play(part, [{ opacity: 0, translate: '0 15px', scale: '.94' }, { opacity: 1, translate: '0 0', scale: '1' }], delay + 120 + i * 90, 650)
        })
      })
    }, { threshold: 0.12 })
    root.querySelectorAll('.pina-context, .pina-section-heading, .pina-step, .pina-video-copy, .pina-result-summary > span, .pricing-intro, .growth-plan, .work-intro, .growth-goal, .project-tile, .revenue-copy, .revenue-proof, .revenue-principles > div, .marketing-intro, .marketing-card, .lyte-case-card, .service-page-visual, #agency > div > p, #agency h2, #agency .rounded-2xl').forEach(el => observer.observe(el))

    // No perpetual render loop: update only while a mouse moves over an artwork.
    root.querySelectorAll<HTMLElement>('.hero-art, .project-tile, .lyte-case-card').forEach(el => {
      let frame = 0
      let clientX = 0
      let clientY = 0
      const reset = () => {
        if (!frame && !el.style.getPropertyValue('--motion-x')) return
        cancelAnimationFrame(frame)
        frame = 0
        ;['--motion-x', '--motion-y', '--motion-rx', '--motion-ry', '--light-x', '--light-y'].forEach(name => el.style.removeProperty(name))
      }
      const move = (event: PointerEvent) => {
        if (preference.matches || mobile.matches || !pointer.matches || event.pointerType !== 'mouse') return
        clientX = event.clientX
        clientY = event.clientY
        if (frame) return
        frame = requestAnimationFrame(() => {
          frame = 0
          const bounds = el.getBoundingClientRect()
          const x = Math.max(-.5, Math.min(.5, (clientX - bounds.left) / bounds.width - .5))
          const y = Math.max(-.5, Math.min(.5, (clientY - bounds.top) / bounds.height - .5))
          el.style.setProperty('--motion-x', `${x * 22}px`)
          el.style.setProperty('--motion-y', `${y * 16}px`)
          el.style.setProperty('--motion-rx', `${-y * 5}deg`)
          el.style.setProperty('--motion-ry', `${x * 5}deg`)
          el.style.setProperty('--light-x', `${(x + .5) * 100}%`)
          el.style.setProperty('--light-y', `${(y + .5) * 100}%`)
        })
      }
      // Clear stale pointer offsets when scrolling moves the artwork beneath the mouse.
      window.addEventListener('scroll', reset, { passive: true })
      el.addEventListener('pointermove', move, { passive: true })
      el.addEventListener('pointerleave', reset)
      preference.addEventListener('change', reset)
      pointer.addEventListener('change', reset)
      cleanups.push(() => {
        reset()
        window.removeEventListener('scroll', reset)
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', reset)
        preference.removeEventListener('change', reset)
        pointer.removeEventListener('change', reset)
      })
    })
    const stop = () => {
      if (preference.matches || mobile.matches || !pointer.matches) { animations.forEach(animation => animation.cancel()); animations.clear() }
    }
    preference.addEventListener('change', stop)
    mobile.addEventListener('change', stop)
    pointer.addEventListener('change', stop)
    return () => {
      observer.disconnect()
      animations.forEach(animation => animation.cancel())
      cleanups.forEach(cleanup => cleanup())
      preference.removeEventListener('change', stop)
      mobile.removeEventListener('change', stop)
      pointer.removeEventListener('change', stop)
    }
  }, [route])
  return ref
}
