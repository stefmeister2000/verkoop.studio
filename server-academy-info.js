import { createHash } from 'node:crypto'
import { Router } from 'express'
import { resendRequest, saveLeadContact } from './server-lead.js'

export function academyInfoMail(lang) {
  const en = lang === 'en'
  const title = en ? 'Your guide to the Meta Ads Academy' : 'Je informatie over de Meta Ads Academy'
  const intro = en ? 'Here is a short overview of the lessons. No call or booking is needed.' : 'Hier vind je een kort overzicht van de lessen. Je hoeft hiervoor geen gesprek te plannen.'
  const items = en ? [
    'For online stores and B2B businesses, whether you are starting out or already running ads.',
    'One-to-one lessons with Stef in your own ad account. You work on your own campaigns.',
    'Topics: Meta ads, custom landing pages, GA4, Meta Pixel, server-side tracking and email follow-up.',
    'You learn to compare ad spend, new customers and revenue in a customised dashboard.',
    'The programme and price are tailored to your starting point and goals. Ad spend is separate.',
  ] : [
    'Voor webshops en B2B-bedrijven, zowel starters als ondernemers die al adverteren.',
    'Je volgt 1-op-1 lessen met Stef in je eigen advertentieaccount en werkt aan je eigen campagnes.',
    'Onderwerpen: Meta ads, landingspagina’s op maat, GA4, Meta Pixel, server-side tracking en e-mailopvolging.',
    'Je leert advertentiekosten, nieuwe klanten en omzet vergelijken in een dashboard op maat.',
    'Het traject en de prijs stemmen we af op je startpunt en doelen. Advertentiebudget staat hier los van.',
  ]
  const question = en ? 'Have a question? Reply to this email and Stef will help you.' : 'Heb je een vraag? Antwoord op deze mail, dan helpt Stef je verder.'
  const privacy = en ? 'You requested this information on Verkoop Studio. This is a one-off email, not a newsletter subscription.' : 'Je vroeg deze informatie aan op Verkoop Studio. Dit is een eenmalige mail, geen nieuwsbriefinschrijving.'
  return {
    subject: title,
    text: [title, '', intro, '', ...items.map(item => `• ${item}`), '', question, 'https://verkoop.studio/academy', '', 'Stef — Verkoop Studio', '', privacy].join('\n'),
    html: `<html lang="${en ? 'en' : 'nl'}"><body style="margin:0;padding:24px;font-family:Arial,sans-serif;color:#181c3d"><div style="max-width:560px;margin:auto;font-size:16px;line-height:1.6"><h1 style="font-size:24px;line-height:1.3">${title}</h1><p>${intro}</p><ul style="padding-left:22px">${items.map(item => `<li style="margin:14px 0">${item}</li>`).join('')}</ul><p>${question}</p><p><a href="https://verkoop.studio/academy" style="color:#254bfa">Meta Ads Academy</a></p><p>Stef — Verkoop Studio</p><p style="font-size:12px;color:#687089">${privacy}</p></div></body></html>`,
  }
}

export function academyInfoRouter({ resend, from, to, request = resendRequest }) {
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
    if (body.company_website) return res.json({ ok: true })
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !['nl', 'en'].includes(body.lang)) return res.status(400).json({ error: 'invalid_fields' })
    if (!resend) return res.status(503).json({ error: 'not_configured' })
    const hash = createHash('sha256').update(email).digest('hex')
    if (!allow(`ip:${req.ip}`, 10) || !allow(`email:${hash}`, 3)) return res.set('Retry-After', '600').status(429).json({ error: 'rate_limited' })
    // A daily key avoids duplicate deliveries on retries, even after a page reload.
    const key = createHash('sha256').update(`${email}:${body.lang}:${new Date().toISOString().slice(0, 10)}`).digest('hex')
    try {
      await saveLeadContact(resend, { email, naam: '' }, request)
      await request(() => resend.emails.send({ from, to: [email], replyTo: 'stef@verkoop.studio', ...academyInfoMail(body.lang) }, { idempotencyKey: `academy-info/${key}` }))
      await request(() => resend.emails.send({ from, to: [to], replyTo: email, subject: 'Academy: gratis informatie aangevraagd', text: `E-mailadres: ${email}\nTaal: ${body.lang}\nFormulier: academy-info-popup\nDe informatie is automatisch verstuurd. Geen kennismakingsaanvraag en geen nieuwsbriefinschrijving.` }, { idempotencyKey: `academy-info-notification/${key}` }))
      return res.json({ ok: true, captured: ['resend_contact', 'resend_info', 'resend_notification'] })
    } catch {
      console.error('[academy-info] capture or delivery failed')
      return res.status(502).json({ ok: false, error: 'delivery_failed' })
    }
  })
  return router
}
