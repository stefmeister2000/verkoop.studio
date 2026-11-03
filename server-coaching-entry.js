import { createHash } from 'node:crypto'
import { Router } from 'express'
import { resendRequest, saveLeadContact } from './server-lead.js'

export function coachingEntryRouter({ resend, from, to, request = resendRequest, now = () => new Date() }) {
  const router = Router()
  const attempts = new Map()
  const allow = (key, limit) => {
    const time = Date.now()
    for (const [entry, value] of attempts) if (value.until <= time) attempts.delete(entry)
    const value = attempts.get(key) || { count: 0, until: time + 600_000 }
    if (value.count >= limit || (!attempts.has(key) && attempts.size >= 10_000)) return false
    value.count++; attempts.set(key, value); return true
  }
  router.post('/', async (req, res) => {
    res.set('Cache-Control', 'no-store')
    const body = req.body || {}
    if (body.company_website) return res.json({ ok: true })
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || !['nl', 'en'].includes(body.lang) || !['agency', 'academy'].includes(body.source)) return res.status(400).json({ error: 'invalid_fields' })
    if (!resend || !from || !to) return res.status(503).json({ error: 'not_configured' })
    const hash = createHash('sha256').update(email).digest('hex')
    if (!allow(`ip:${req.ip}`, 10) || !allow(`email:${hash}`, 3)) return res.set('Retry-After', '600').status(429).json({ error: 'rate_limited' })
    const parts = new Intl.DateTimeFormat('en', { timeZone: 'Europe/Brussels', year: 'numeric', month: '2-digit' }).formatToParts(now())
    const month = `${parts.find(p => p.type === 'year').value}-${parts.find(p => p.type === 'month').value}`
    const key = createHash('sha256').update(`${email}:${month}`).digest('hex')
    try {
      // Separate from newsletter subscriptions, paid leads and their follow-up automations.
      await saveLeadContact(resend, { email, naam: '' }, request)
      // Stable payload across both pages so retries share the same provider idempotency key.
      // Resend retains idempotency keys for 24h; select unique emails per month from these notifications.
      await request(() => resend.emails.send({
        from, to: [to], replyTo: email,
        subject: `Maandselectie ${month}: 2 weken gratis begeleiding`,
        text: `Nieuwe kandidaat voor de maandselectie.\n\nE-mailadres: ${email}\nSelectiemaand: ${month}\nAanbod: twee weken gratis begeleiding voor één persoon per maand, gezamenlijk voor de website en Academy.\n\nTel ieder e-mailadres één keer per maand. Neem persoonlijk contact op als deze kandidaat geselecteerd wordt.\nGeen nieuwsbriefinschrijving, kennismakingsaanvraag of betaalde klantconversie.`,
      }, { idempotencyKey: `coaching-entry/${key}` }))
      return res.json({ ok: true })
    } catch {
      console.error('[coaching-entry] registration failed')
      return res.status(502).json({ ok: false, error: 'registration_failed' })
    }
  })
  return router
}
