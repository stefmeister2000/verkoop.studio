import { createHash } from 'node:crypto'
import { Router } from 'express'
import { resendRequest, saveLeadContact } from './server-lead.js'

/** Records how far the visitor got, so an unfinished form is still a usable lead. */
export const PARTIAL_PROPERTY = 'form_unfinished'

const text = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : ''

/** Returns null when the beacon carries nothing worth storing. */
export function partialFields(body = {}) {
  const fields = {
    email: text(body.email, 200).toLowerCase(),
    naam: text(body.naam, 200), telefoon: text(body.telefoon, 60),
    bedrijf: text(body.bedrijf, 200), website: text(body.website, 300),
    form_id: text(body.form_id, 60) || 'unknown',
    furthest_step: text(body.furthest_step, 40) || 'none',
    progress_pct: Number.isFinite(body.progress_pct) ? Math.min(100, Math.max(0, Math.round(body.progress_pct))) : 0,
    lang: body.lang === 'en' ? 'en' : 'nl',
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return null
  return fields
}

/**
 * Stores the email address of a visitor who started a form and left before
 * sending it. Deliberately not a subscription: no newsletter consent is given
 * here, so this never joins the enquiry segment and never starts the enquiry
 * follow-up flow. It is a note for Stef that someone was halfway.
 */
export async function capturePartialLead({ resend, fields, segmentId, request = resendRequest, now = new Date() }) {
  const captured = []
  const contact = await saveLeadContact(resend, fields, request)
  captured.push('resend_contact')
  await request(() => resend.contacts.update({
    id: contact.id,
    properties: {
      [PARTIAL_PROPERTY]: JSON.stringify({
        at: now.toISOString(), form_id: fields.form_id,
        furthest_step: fields.furthest_step, progress_pct: fields.progress_pct,
        telefoon: fields.telefoon, bedrijf: fields.bedrijf, website: fields.website, lang: fields.lang,
      }),
    },
  }))
  captured.push('resend_properties')
  // An earlier unsubscribe outranks a form the visitor never sent.
  if (segmentId && !contact.unsubscribed) {
    await request(() => resend.contacts.segments.add({ contactId: contact.id, segmentId }))
    captured.push('resend_segment')
  }
  return { ok: true, captured }
}

export function partialLeadRouter({ resend, segmentId, request = resendRequest }) {
  const router = Router()
  const attempts = new Map()
  const allow = (key, limit) => {
    const now = Date.now()
    for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry)
    const value = attempts.get(key) || { count: 0, until: now + 600_000 }
    if (value.count >= limit || (!attempts.has(key) && attempts.size >= 10_000)) return false
    value.count++; attempts.set(key, value); return true
  }
  router.post('/', async (req, res) => {
    res.set('Cache-Control', 'no-store')
    const body = req.body || {}
    // Honeypot: real visitors never fill this hidden field.
    if (body.company_website) return res.json({ ok: true })
    const fields = partialFields(body)
    if (!fields) return res.status(400).json({ error: 'invalid_fields' })
    if (!resend) return res.status(503).json({ error: 'not_configured' })
    const hash = createHash('sha256').update(fields.email).digest('hex')
    // One page visit can fire the beacon on every tab switch; the first one wins.
    if (!allow(`ip:${req.ip}`, 20) || !allow(`email:${hash}`, 3)) return res.set('Retry-After', '600').status(429).json({ error: 'rate_limited' })
    try {
      return res.json(await capturePartialLead({ resend, fields, segmentId, request }))
    } catch {
      console.error('[partial-lead] capture failed')
      return res.status(502).json({ ok: false, error: 'capture_failed' })
    }
  })
  return router
}
