import { useEffect, useRef } from 'react'
import { captureAttribution, readAttribution, trackEvent } from './analytics'
import { createFormFunnel, type FormFunnel, type PartialLead } from './formFunnel'

/** Survives the page closing; a keepalive request covers browsers without it. */
function sendPartialLead(lead: PartialLead) {
  const body = JSON.stringify({ ...lead, attribution: readAttribution() ?? captureAttribution() })
  try {
    const blob = new Blob([body], { type: 'application/json' })
    if (navigator.sendBeacon?.('/api/lead/partial', blob)) return
  } catch { /* Falls through to the request below. */ }
  try {
    // A lost partial lead must never surface as a form error.
    void fetch('/api/lead/partial', {
      method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body,
    }).catch(() => {})
  } catch { /* Same. */ }
}

/**
 * Tracks how far a visitor gets in a form and keeps the email address of
 * someone who leaves before sending it. See formFunnel.ts for the rules.
 */
export function useFormFunnel({ formId, steps, lang }: { formId: string; steps: readonly string[]; lang: string }): FormFunnel {
  const langRef = useRef(lang)
  langRef.current = lang
  const funnel = useRef<FormFunnel | null>(null)
  // One funnel per mounted form, so progress survives a language switch.
  funnel.current ??= createFormFunnel({
    formId, steps, lang,
    track: trackEvent,
    sendPartial: lead => sendPartialLead({ ...lead, lang: langRef.current }),
  })

  useEffect(() => {
    const current = funnel.current!
    const leave = () => current.leave()
    // pagehide alone is unreliable on phones: a visitor who switches app never
    // unloads the page. Hiding it is the last moment an email can still be sent.
    const onHidden = () => { if (document.visibilityState === 'hidden') leave() }
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', leave)
    return () => {
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', leave)
    }
  }, [])

  return funnel.current
}
