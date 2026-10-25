import { createHash } from 'node:crypto'
import { Router } from 'express'
import { resendRequest } from './server-lead.js'

export const NEWSLETTER_SEGMENT = '77506f2d-d387-4e75-97aa-bbaa003e7e0f'
export const CONSENT_VERSION = 'website-newsletter-v1'
const CONSENT = {
  nl: 'Ja, ik ontvang graag marketingtips en nieuws van verkoop.studio per e-mail.',
  en: 'Yes, I would like to receive marketing tips and news from verkoop.studio by email.',
}

export async function subscribeNewsletter({ resend, email, lang, source = 'website_popup', request = resendRequest, now = new Date() }) {
  const properties = {
    newsletter_consent: JSON.stringify({
      at: now.toISOString(), source, version: CONSENT_VERSION, lang, text: CONSENT[lang],
    }),
  }
  let contact
  let created = false
  try {
    contact = await request(() => resend.contacts.get({ email }))
  } catch (error) {
    if (error.statusCode !== 404 && error.name !== 'not_found') throw error
    try {
      contact = await request(() => resend.contacts.create({ email, properties }))
      created = true
    } catch (createError) {
      if (createError.statusCode !== 409) throw createError
      contact = await request(() => resend.contacts.get({ email }))
    }
  }
  // An unauthenticated form must never override a previous unsubscribe.
  if (contact.unsubscribed) return { ok: false, error: 'subscription_preferences', status: 409 }
  if (!created && !contact.properties?.newsletter_consent) {
    await request(() => resend.contacts.update({ id: contact.id, properties }))
  }
  await request(() => resend.contacts.segments.add({ contactId: contact.id, segmentId: NEWSLETTER_SEGMENT }))
  return { ok: true, status: 200 }
}

export function newsletterRouter(resend) {
  const router = Router()
  const attempts = new Map()
  function allow(key, limit) {
    const now = Date.now()
    for (const [entry, value] of attempts) if (value.until <= now) attempts.delete(entry)
    const value = attempts.get(key) || { count: 0, until: now + 10 * 60_000 }
    if (value.count >= limit || (!attempts.has(key) && attempts.size >= 10_000)) return false
    value.count++
    attempts.set(key, value)
    return true
  }
  router.post('/', async (req, res) => {
    res.set('Cache-Control', 'no-store')
    const body = req.body || {}
    if (body.company_website) return res.json({ ok: true })
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'invalid_email' })
    }
    if (body.consent !== true || body.consent_version !== CONSENT_VERSION || !['nl', 'en'].includes(body.lang)) {
      return res.status(400).json({ error: 'consent_required' })
    }
    if (!resend) return res.status(503).json({ error: 'not_configured' })
    const hash = createHash('sha256').update(email).digest('hex')
    if (!allow(`ip:${req.ip}`, 10) || !allow(`email:${hash}`, 3)) {
      res.set('Retry-After', '600')
      return res.status(429).json({ error: 'rate_limited' })
    }
    try {
      const result = await subscribeNewsletter({ resend, email, lang: body.lang })
      return res.status(result.status).json(result.ok ? { ok: true, captured: ['newsletter_segment'] } : { error: result.error })
    } catch {
      console.error('[newsletter] Resend capture failed')
      return res.status(502).json({ error: 'capture_failed' })
    }
  })
  return router
}
