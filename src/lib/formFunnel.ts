/**
 * How far a visitor gets in a form, not just whether they finished it.
 *
 * A form declares its fields in the order a visitor meets them. The furthest
 * one reached is the drop-off point, reported on every step and once more when
 * the visitor leaves. An email address typed before leaving is still a lead, so
 * it is handed to the caller for capture.
 *
 * Dependency-free on purpose: the React wrapper in useFormFunnel.ts supplies
 * tracking and sending, so this logic stays testable without a DOM.
 */

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Kept from an unfinished form. Free text and goals are not contact details. */
export const PARTIAL_FIELDS = ['naam', 'email', 'telefoon', 'bedrijf', 'website'] as const

export interface FunnelProgress {
  form_id: string
  /** Field the visitor got to, or 'none' when they only looked at the form. */
  furthest_step: string
  steps_completed: number
  step_count: number
  progress_pct: number
  /** Matches the tracking payloads these events are pushed into. */
  [key: string]: unknown
}

export interface PartialLead extends FunnelProgress {
  email: string
  naam: string
  telefoon: string
  bedrijf: string
  website: string
  lang: string
  /** Honeypot value, so the server can drop bot submissions. */
  company_website: string
}

export interface FormFunnelOptions {
  formId: string
  /** Field names in the order the visitor meets them. */
  steps: readonly string[]
  lang: string
  track: (event: 'form_started' | 'form_step' | 'form_email_captured' | 'form_abandoned', payload: Record<string, unknown>) => void
  /** Called at most once, with the email of a visitor who left without sending. */
  sendPartial: (lead: PartialLead) => void
}

export interface FormFunnel {
  /** Call on every field change. Records progress and what was typed. */
  observe: (field: string, value: string) => void
  /** Call once the submission succeeded. Leaving then counts as finished, not abandoned. */
  markSubmitted: () => void
  /**
   * Call when the page is hidden or unloaded. Reports the drop-off point and
   * captures a typed email. A visitor who returns and sends the form still
   * fires form_submitted, so count an abandonment only where that is missing.
   */
  leave: () => void
  progress: () => FunnelProgress
}

export function createFormFunnel({ formId, steps, lang, track, sendPartial }: FormFunnelOptions): FormFunnel {
  const values: Record<string, string> = {}
  let furthest = -1
  let started = false
  let submitted = false
  let reported = false
  let sent = false
  let emailTracked = false

  const progress = (): FunnelProgress => ({
    form_id: formId,
    furthest_step: furthest >= 0 ? steps[furthest] : 'none',
    steps_completed: furthest + 1,
    step_count: steps.length,
    progress_pct: steps.length ? Math.round(((furthest + 1) / steps.length) * 100) : 0,
  })

  const email = () => {
    const value = (values.email ?? '').trim().toLowerCase()
    return EMAIL_PATTERN.test(value) ? value : ''
  }

  return {
    progress,

    observe(field, value) {
      values[field] = value
      // The honeypot is hidden from visitors: a bot filling it never started a form.
      if (!started && field !== 'company_website') {
        started = true
        track('form_started', { form_id: formId })
      }
      const index = steps.indexOf(field)
      // An email address only counts as a step once it could actually be mailed.
      const filled = field === 'email' ? Boolean(email()) : Boolean(value.trim())
      if (index > furthest && filled) {
        furthest = index
        track('form_step', progress())
      }
      // Worth its own event: these are the visitors a follow-up can still reach.
      if (field === 'email' && email() && !emailTracked) {
        emailTracked = true
        track('form_email_captured', progress())
      }
    },

    markSubmitted() {
      submitted = true
    },

    leave() {
      if (submitted) return
      if (started && !reported) {
        reported = true
        track('form_abandoned', { ...progress(), email_captured: Boolean(email()) })
      }
      const address = email()
      if (!address || sent) return
      sent = true
      sendPartial({
        ...progress(),
        ...Object.fromEntries(PARTIAL_FIELDS.map(field => [field, (values[field] ?? '').trim()])) as Record<typeof PARTIAL_FIELDS[number], string>,
        email: address,
        lang,
        company_website: values.company_website ?? '',
      })
    },
  }
}
