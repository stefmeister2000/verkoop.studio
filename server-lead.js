import { enquiryTemplate } from './server-templates.js'
import { createHash } from 'node:crypto'

export const WEBSITE_ENQUIRY_SEGMENT = 'd6c1a8b8-b0a0-4ea8-af19-e93f4b07800d'
export const WEBSITE_ENQUIRY_EVENT = 'website.enquiry_received'

const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

// SDK errors are returned as values. Retry only temporary failures.
export async function resendRequest(run, sleep = pause, valid = data => Boolean(data?.id)) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await run()
      if (result.error) throw Object.assign(new Error('Resend request failed'), result.error)
      if (!valid(result.data)) throw Object.assign(new Error('Missing Resend receipt'), { statusCode: 502 })
      return result.data
    } catch (error) {
      const temporary = error.statusCode === 429 || error.statusCode >= 500 || error instanceof TypeError || error.name === 'application_error'
      if (!temporary || attempt === 2) throw error
      await sleep(1000 * 2 ** attempt)
    }
  }
}

export function leadKey(body) {
  // Excludes attribution, which can change when the visitor retries.
  const fields = ['submission_id', 'naam', 'email', 'telefoon', 'bedrijf', 'website', 'doel', 'uitdaging', 'investering', 'kanalen', 'timing', 'extra', 'form_id', 'lang']
  return createHash('sha256').update(JSON.stringify(fields.map(key => body[key] ?? ''))).digest('hex')
}

export async function saveLeadContact(resend, body, request = resendRequest) {
  const email = body.email.trim().toLowerCase()
  try {
    // Existing contacts keep their subscription preferences and profile.
    return await request(() => resend.contacts.get({ email }))
  } catch (error) {
    if (error.statusCode !== 404 && error.name !== 'not_found') throw error
  }
  const [firstName, ...rest] = body.naam.trim().split(/\s+/)
  try {
    // Segment assignment is handled separately after contact storage succeeds.
    return await request(() => resend.contacts.create({ email, firstName, lastName: rest.join(' ') }))
  } catch (error) {
    // Another simultaneous submission may have created this email already.
    if (error.statusCode !== 409) throw error
    return request(() => resend.contacts.get({ email }))
  }
}

export async function captureLead({ resend, body, from, to = 'stefkeppens@gmail.com', crm, request = resendRequest, segmentId = WEBSITE_ENQUIRY_SEGMENT }) {
  if (!resend) return { ok: false, status: 503, captured: [], failed: ['resend_not_configured'] }
  const key = leadKey(body)
  let contact
  const tasks = [
    ['resend_contact', async () => { contact = await saveLeadContact(resend, body, request) }],
    ['resend_segment', async () => {
      if (!contact?.id) throw new Error('Contact must be stored before segment assignment')
      return request(() => resend.contacts.segments.add({ contactId: contact.id, segmentId }))
    }],
    ['resend_email', () => request(() => resend.emails.send({
      from, to: [...new Set(['stefkeppens@gmail.com', to].filter(Boolean))], replyTo: body.email,
      subject: `Nieuwe groeianalyse-aanvraag van ${String(body.bedrijf || body.naam).replace(/[\r\n]/g, ' ').slice(0, 80)}`,
      template: enquiryTemplate(body),
    }, { idempotencyKey: `lead-notification/${key}` }))],
  ]
  if (crm) tasks.push(['crm', crm])
  // Sequential API calls reduce rate-limit pressure; failure never skips another destination.
  const captured = [], failed = []
  for (const [label, run] of tasks) {
    try { await run(); captured.push(label) }
    catch { failed.push(label) }
  }
  // Start follow-up only after the enquiry is safely captured. The automation
  // also checks this persistent marker and subscription state before sending.
  if (!failed.length && !contact.unsubscribed && contact.properties?.website_flow_started !== 1) {
    try {
      await resendRequest(() => resend.events.send({
        event: WEBSITE_ENQUIRY_EVENT, contactId: contact.id,
        payload: { submission_id: key, source: 'website' },
      }), pause, data => data?.object === 'event' && data.event === WEBSITE_ENQUIRY_EVENT)
      captured.push('resend_flow')
    } catch { failed.push('resend_flow') }
  }
  const ok = captured.includes('resend_contact') && captured.includes('resend_segment') && captured.includes('resend_email') && !failed.length
  return { ok, status: ok ? 200 : 502, captured, failed, key }
}
