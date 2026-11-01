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

// Reuse only the pixel's own first-party references; never collect form answers or raw customer details.
function pixelCookie(header, name, maxLength = 4096) {
  if (typeof header !== 'string') return undefined
  const part = header.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))
  if (!part) return undefined
  try {
    const value = decodeURIComponent(part.slice(name.length + 1))
    return value.trim() && value.length <= maxLength && !/[\x00-\x1f\x7f]/.test(value) ? value : undefined
  } catch { return undefined }
}

/** Confirmed enquiries only; attribution references come from the existing OpenAI pixel. */
export async function sendOpenAiLead({ receipt, submissionId, sourceUrl, cookieHeader }, {
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
  if (pixelCookie(cookieHeader, '__oaiq_consent', 5) === 'false') {
    return { sent: false, reason: 'consent_denied', eventId }
  }
  if (!apiKey?.trim()) return { sent: false, reason: 'not_configured', eventId }

  const oppref = pixelCookie(cookieHeader, '__oppref')
  const obref = pixelCookie(cookieHeader, '__obref', 512)

  // Freeze ID and timestamp for both attempts. OpenAI deduplicates against the browser ID.
  const body = JSON.stringify({ validate_only: false, events: [{
    id: eventId,
    type: 'lead_created',
    timestamp_ms: now(),
    ...(oppref ? { oppref } : {}),
    ...(obref ? { user: { obref } } : {}),
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

