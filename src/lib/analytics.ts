/**
 * Existing site events remain available in dataLayer for GTM integrations.
 * Confirmed website leads are also sent explicitly to the requested GA4
 * property; plain dataLayer objects are not gtag event commands.
 */

export type TrackingEvent =
  | 'traffic_source_captured'
  | 'referral_source_captured'
  | 'linkedin_campaign_captured'
  | 'case_viewed'
  | 'portfolio_item_viewed'
  | 'service_viewed'
  | 'audit_cta_clicked'
  | 'form_viewed'
  | 'form_started'
  | 'form_abandoned'
  | 'form_submitted'
  | 'calendar_opened'
  | 'meeting_booked'
  | 'proposal_sent'
  | 'project_won'
  | 'project_value'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    fbq?: (command: 'trackSingle', pixelId: string, event: 'Lead', params: Record<string, unknown>, options: { eventID: string }) => void
    current?: (command: 'lead', data: Record<string, unknown>) => void
    gtag?: {
      (command: 'event', event: string, params: Record<string, unknown>): void
      (command: 'get', target: string, field: string, callback: (value: unknown) => void): void
    }
  }
}

export function trackEvent(event: TrackingEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...payload })
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[track]', event, payload)
  }
}

const trackedLeads = new Set<string>()

/** Keep destinations independent: a blocked or broken tag must not block the other. */
function trackLeadOnce(key: string, send: () => void) {
  if (trackedLeads.has(key)) return
  try {
    if (sessionStorage.getItem(key)) return
  } catch { /* Tracking still works when storage is unavailable. */ }
  try {
    send()
    trackedLeads.add(key)
    try { sessionStorage.setItem(key, '1') } catch { /* In-memory deduplication remains. */ }
  } catch { /* Analytics must never turn a saved lead into a failed form. */ }
}

/** Call only after /api/lead succeeds. Never send contact details or free text. */
export function trackLeadConversion(receipt: { ok?: boolean; captured?: unknown }, submissionId: string, formId: string) {
  if (typeof window === 'undefined' || !submissionId) return
  // The bot honeypot returns ok without storing a lead or returning capture receipts.
  if (receipt.ok !== true || !Array.isArray(receipt.captured) || !receipt.captured.includes('resend_contact')) return
  sendLeadConversion(submissionId, formId, 'website_form', 'Website enquiry')
}

/** Academy signups are leads Stef follows up; they get their own label so ads can be judged separately. */
export function trackAcademyConversion(receipt: { ok?: boolean; captured?: unknown }, submissionId: string, formId: string, track: 'gratis' | 'begeleid') {
  if (typeof window === 'undefined' || !submissionId) return
  if (receipt.ok !== true || !Array.isArray(receipt.captured) || !receipt.captured.includes('resend_contact')) return
  sendLeadConversion(`academy_${submissionId}`, formId, 'academy_signup', track === 'begeleid' ? 'Meta Ads Academy: begeleid leertraject' : 'Meta Ads Academy: gratis')
}

/** Newsletter success needs a segment receipt; a honeypot acknowledgement is not a lead. */
export function trackNewsletterConversion(receipt: { ok?: boolean; captured?: unknown }, submissionId: string) {
  if (typeof window === 'undefined' || !submissionId) return
  if (receipt.ok !== true || !Array.isArray(receipt.captured) || !receipt.captured.includes('newsletter_segment')) return
  sendLeadConversion(`newsletter_${submissionId}`, 'newsletter-popup', 'newsletter_signup', 'Newsletter signup')
}

function sendLeadConversion(submissionId: string, formId: string, method: string, contentName: string) {
  if (typeof window.gtag === 'function') {
    trackLeadOnce(`sk_ga4_lead_${submissionId}`, () => {
      window.gtag!('event', 'generate_lead', {
        send_to: 'G-VRKJP8K3SD',
        method,
        form_id: formId,
      })
    })
  }
  if (typeof window.current === 'function') {
    // Current links the lead to the visitor's ad clicks; no contact details are sent with it.
    trackLeadOnce(`sk_current_lead_${submissionId}`, () => {
      window.current!('lead', { form_id: formId, method })
    })
  }
  if (typeof window.fbq === 'function') {
    trackLeadOnce(`sk_meta_lead_${submissionId}`, () => {
      window.fbq!('trackSingle', '29297541076513579', 'Lead', {
        content_name: contentName,
        form_id: formId,
      }, { eventID: `website_lead_${submissionId}` })
    })
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const STORAGE_KEY = 'sk_attribution'

export interface Attribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  referrer?: string
  li_fat_id?: string
  landing_path?: string
  captured_at?: string
  [key: string]: unknown
}

/** Captures UTM params, referrer and the LinkedIn click id on first visit and persists them for the session. */
export function captureAttribution(): Attribution {
  if (typeof window === 'undefined') return {}

  const existing = readAttribution()
  if (existing) return existing

  const params = new URLSearchParams(window.location.search)
  const attribution: Attribution = {
    referrer: document.referrer || undefined,
    landing_path: window.location.pathname,
    captured_at: new Date().toISOString(),
  }

  for (const key of UTM_KEYS) {
    const value = params.get(key)
    if (value) attribution[key] = value
  }

  const liFatId = params.get('li_fat_id')
  if (liFatId) attribution.li_fat_id = liFatId

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution))
  } catch {
    // If storage is unavailable, attribution is still returned for this page view.
  }

  if (attribution.utm_source) trackEvent('traffic_source_captured', attribution)
  if (attribution.referrer && !attribution.utm_source) trackEvent('referral_source_captured', attribution)
  if (attribution.li_fat_id) trackEvent('linkedin_campaign_captured', attribution)

  return attribution
}

export function readAttribution(): Attribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Attribution) : null
  } catch {
    return null
  }
}

/** Use the visitor's real GA identifier; never invent one for blocked analytics. */
export async function getGa4Context(): Promise<{ clientId: string; sessionId?: string } | undefined> {
  if (typeof window === 'undefined' || !window.gtag) return undefined
  const get = (field: string): Promise<unknown> => new Promise(resolve => {
    const timeout = setTimeout(() => resolve(undefined), 700)
    try {
      window.gtag!('get', 'G-VRKJP8K3SD', field, value => { clearTimeout(timeout); resolve(value) })
    } catch { clearTimeout(timeout); resolve(undefined) }
  })
  const [client, session] = await Promise.all([get('client_id'), get('session_id')])
  if (typeof client !== 'string' || !/^\d{1,20}\.\d{1,20}$/.test(client)) return undefined
  const sessionId = typeof session === 'number' || typeof session === 'string' ? String(session) : ''
  return { clientId: client, ...(/^\d{1,20}$/.test(sessionId) ? { sessionId } : {}) }
}
