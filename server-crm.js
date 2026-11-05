// Server-only bridge. Never import this module into the browser bundle.

/** The campaign every ordinary website enquiry is tagged with in the CRM. */
export const WEBSITE_CAMPAIGN = 'Verkoop Studio website'
/** The entry form on /gratis-website posts this form_id. */
export const GIVEAWAY_FORM_ID = 'gratis-website-actie'
/** Campaign for the free-website giveaway. The CRM reads this name to badge the lead. */
export const GIVEAWAY_CAMPAIGN = 'Verkoop Studio gratis website'

/**
 * The CRM campaign a lead is filed under, derived from the form it came from.
 * The visitor never sends a campaign name, so a running campaign cannot be
 * renamed from the browser; only the form_id the page itself posts is read.
 */
export function campaignForForm(formId) {
  return (typeof formId === 'string' ? formId.trim() : '') === GIVEAWAY_FORM_ID
    ? GIVEAWAY_CAMPAIGN
    : WEBSITE_CAMPAIGN
}

export function crmPayload(body, { campaign = campaignForForm(body?.form_id) } = {}) {
  const text = (value) => typeof value === 'string' ? value.trim() : ''
  const fields = [
    ['Doel', body.doel], ['Uitdaging', body.uitdaging],
    ['Maandelijkse investering', body.investering], ['Huidige kanalen', body.kanalen],
    ['Timing', body.timing], ['Extra informatie', body.extra],
    ['Formulier', body.form_id], ['Taal', body.lang],
  ]
  const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'landing_path', 'referrer']) {
    if (text(attribution[key])) fields.push([key, attribution[key]])
  }
  const payload = {
    company: text(body.bedrijf) || text(body.naam),
    contactName: text(body.naam),
    email: text(body.email).toLowerCase(),
    phone: text(body.telefoon),
    campaign,
    notes: fields.filter(([, value]) => text(value)).map(([label, value]) => `${label}: ${text(value)}`).join('\n'),
  }
  // Only structured, Google-generated identifiers cross the server bridge.
  if (typeof body.ga4?.clientId === 'string' && /^\d{1,20}\.\d{1,20}$/.test(body.ga4.clientId)) {
    payload.ga4 = { clientId: body.ga4.clientId }
    if (typeof body.ga4.sessionId === 'string' && /^\d{1,20}$/.test(body.ga4.sessionId)) payload.ga4.sessionId = body.ga4.sessionId
  }
  if (text(body.website)) payload.website = text(body.website)
  // Fail visibly instead of silently losing part of the enquiry.
  for (const [key, limit] of Object.entries({company:200,contactName:200,email:200,phone:60,website:300,notes:4000})) {
    if ((payload[key]?.length ?? 0) > limit) throw new Error(`field_too_long:${key}`)
  }
  return payload
}

export async function sendToCrm(payload, { url, token, fetchImpl = fetch }) {
  if (!url || !token) throw new Error('crm_not_configured')
  const endpoint = new URL(url)
  if (endpoint.protocol !== 'https:' && !(endpoint.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(endpoint.hostname))) {
    throw new Error('crm_requires_https')
  }
  const response = await fetchImpl(endpoint, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(15000),
    headers: {'Content-Type':'application/json','x-inbound-token':token},
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`crm_http_${response.status}`)
  const result = await response.json()
  if (!['created','matched'].includes(result.status) || !result.leadId) throw new Error('crm_invalid_response')
  return result
}
