import { useEffect } from 'react'

function buttonFrom(target: EventTarget | null) {
  return target instanceof Element ? target.closest<HTMLElement>('.button-dark, .button-light') : null
}

/** Light follows the pointer, and the burst starts where the button is pressed. */
export function usePrimaryButtonMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const pop = (button: HTMLElement, clientX?: number, clientY?: number) => {
      if (reduce.matches) return
      const box = button.getBoundingClientRect()
      const x = clientX == null ? box.width / 2 : clientX - box.left
      const y = clientY == null ? box.height / 2 : clientY - box.top
      button.style.setProperty('--press-x', `${x}px`)
      button.style.setProperty('--press-y', `${y}px`)
      button.classList.remove('is-popping')
      void button.offsetWidth
      button.classList.add('is-popping')
    }

    const onMove = (event: PointerEvent) => {
      if (reduce.matches || event.pointerType !== 'mouse') return
      const button = buttonFrom(event.target)
      if (!button) return
      const box = button.getBoundingClientRect()
      button.style.setProperty('--press-x', `${event.clientX - box.left}px`)
      button.style.setProperty('--press-y', `${event.clientY - box.top}px`)
    }
    const onDown = (event: PointerEvent) => {
      const button = buttonFrom(event.target)
      if (button) pop(button, event.clientX, event.clientY)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const button = buttonFrom(event.target)
      if (!button) return
      if (event.key === ' ' && button.tagName !== 'BUTTON') return
      pop(button)
    }
    const onDone = (event: AnimationEvent) => {
      if (event.animationName !== 'button-burst' && event.animationName !== 'button-ink') return
      buttonFrom(event.target)?.classList.remove('is-popping')
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    document.addEventListener('animationend', onDone)
    return () => {
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('animationend', onDone)
    }
  }, [])
}
