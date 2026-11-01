const PIXEL_ID = 'RVGNA5NGiGauDpbp33VAqq'
const ENDPOINT = `https://bzr.openai.com/v1/events?pid=${PIXEL_ID}`
const ORIGIN = 'https://verkoop.studio'

function conversionUrl(value) {
  try {
    const url = new URL(value)
    if (url.origin === ORIGIN) return `${ORIGIN}${url.pathname}`
  } catch { /* Use the contact page if no same-origin referrer is available. */ }
  return `${ORIGIN}/contact`
}

/** Confirmed enquiries only; no form answers or customer identifiers leave the server. */
export async function sendOpenAiLead({ receipt, submissionId, sourceUrl }, {
  apiKey = process.env.OPENAI_CONVERSIONS_API_KEY,
  fetchImpl = fetch,
  now = Date.now,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  if (receipt?.ok !== true || !Array.isArray(receipt.captured) || !receipt.captured.includes('resend_contact')) {
    return { sent: false, reason: 'unconfirmed' }
  }
  const id = typeof submissionId === 'string' && /^[a-zA-Z0-9_-]{1,128}$/.test(submissionId)
    ? submissionId : receipt.key
  if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(id)) return { sent: false, reason: 'missing_id' }
  const eventId = `website_lead_${id}`
  if (!apiKey?.trim()) return { sent: false, reason: 'not_configured', eventId }

  // Freeze ID and timestamp for both attempts. OpenAI deduplicates against the browser ID.
  const body = JSON.stringify({ validate_only: false, events: [{
    id: eventId,
    type: 'lead_created',
    timestamp_ms: now(),
    source_url: conversionUrl(sourceUrl),
    action_source: 'web',
    data: { type: 'customer_action' },
  }] })
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetchImpl(ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body,
        redirect: 'error',
        signal: AbortSignal.timeout(2000),
      })
      // Never log response bodies, credentials, or submitted customer information.
      await response.body?.cancel()
      if (response.ok) return { sent: true, eventId }
      if (response.status !== 429 && response.status < 500) {
        return { sent: false, eventId, reason: 'rejected', status: response.status }
      }
    } catch { /* A timeout or unavailable API must never fail the form. */ }
    if (attempt === 0) await sleep(200)
  }
  return { sent: false, eventId, reason: 'unavailable' }
}
