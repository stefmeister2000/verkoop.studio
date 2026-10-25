import { createHash } from 'node:crypto'
import { Router } from 'express'
import { resendRequest, saveLeadContact } from './server-lead.js'
import { crmPayload, sendToCrm } from './server-crm.js'
import { subscribeNewsletter } from './server-newsletter.js'

export const ACADEMY_LEVELS = { start: 'Nog niet gestart met Meta ads', basis: 'Draait al campagnes', actief: 'Wil opschalen' }
export const ACADEMY_BUDGETS = { klein: 'Tot €1.000 per maand', middel: '€1.000 – €5.000 per maand', groot: '€5.000 – €20.000 per maand', schaal: 'Meer dan €20.000 per maand' }
export const ACADEMY_CAMPAIGN = 'verkoop.studio academy'

const text = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : ''
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const oneLine = value => value.replace(/[\r\n]+/g, ' ')

/** Normalises a signup; returns null when a required field is missing or invalid. Stef calls every signup back, so a phone number is required. */
export function academyFields(body = {}) {
  const fields = {
    naam: text(body.naam, 200), email: text(body.email, 200).toLowerCase(), telefoon: text(body.telefoon, 60),
    bedrijf: text(body.bedrijf, 200), website: text(body.website, 300), vraag: text(body.vraag, 2000),
    niveau: Object.hasOwn(ACADEMY_LEVELS, body.niveau) ? body.niveau : '',
    budget: Object.hasOwn(ACADEMY_BUDGETS, body.budget) ? body.budget : '',
    form_id: text(body.form_id, 60) || 'academy', submission_id: text(body.submission_id, 80),
    nieuwsbrief: body.nieuwsbrief === true, lang: 'nl',
    attribution: body.attribution && typeof body.attribution === 'object' ? body.attribution : {},
    ga4: body.ga4,
  }
  if (!fields.naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || !fields.telefoon) return null
  return fields
}

export function academyKey(fields) {
  return createHash('sha256').update(JSON.stringify([fields.submission_id, fields.email, fields.form_id])).digest('hex')
}

/** Same CRM shape as website enquiries, so academy signups land as ordinary website leads. */
export function academyCrmPayload(fields) {
  return crmPayload({
    naam: fields.naam, email: fields.email, telefoon: fields.telefoon, bedrijf: fields.bedrijf, website: fields.website,
    doel: 'Meta Ads Academy: aanmelding',
    uitdaging: fields.vraag,
    investering: ACADEMY_BUDGETS[fields.budget] ?? '',
    extra: [fields.niveau && `Stand van zaken: ${ACADEMY_LEVELS[fields.niveau]}`, fields.nieuwsbrief && 'Nieuwsbrief: ja'].filter(Boolean).join('\n'),
    form_id: fields.form_id, lang: fields.lang, attribution: fields.attribution, ga4: fields.ga4,
  }, { campaign: ACADEMY_CAMPAIGN })
}

// Mirrors the layout of emails/website-enquiry.html so every lead notification looks the same.
const block = (title, rows) => `<tr><td bgcolor="#ffffff" style="background-color:#ffffff;padding:28px 24px;border-bottom:1px solid #e7eaf0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:19px;line-height:26px;color:#172343;font-weight:700;">${escape(title)}</td></tr>${rows.map(([label, value]) => `<tr><td style="padding-top:18px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#62708a;">${escape(label)}</td></tr><tr><td style="padding-top:4px;overflow-wrap:anywhere;white-space:pre-line;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#172343;">${escape(value || 'niet ingevuld')}</td></tr>`).join('')}</table></td></tr>`

export function academyNotification(fields) {
  const title = fields.bedrijf || fields.naam
  const attribution = Object.entries(fields.attribution).filter(([, value]) => typeof value === 'string' && value).map(([key, value]) => `${key}: ${value}`).join(' · ') || 'niet ingevuld'
  const contact = [['Naam', fields.naam], ['E-mailadres', fields.email], ['Telefoon', fields.telefoon], ['Bedrijf', fields.bedrijf], ...(fields.website ? [['Website', fields.website]] : [])]
  const academy = [['Waar staat de webshop met Meta ads?', ACADEMY_LEVELS[fields.niveau]], ['Maandelijks advertentiebudget', ACADEMY_BUDGETS[fields.budget]], ['Waar wil je vooral beter in worden?', fields.vraag], ['Nieuwsbrief', fields.nieuwsbrief ? 'ja' : 'nee']]
  return {
    subject: oneLine(`Nieuwe academy-aanmelding van ${title}`).slice(0, 120),
    text: [`Nieuwe academy-aanmelding van ${title}`, `Aanmelding van ${fields.naam}`, '', 'Beantwoord deze e-mail rechtstreeks om de aanvrager te contacteren.', '',
      'CONTACTGEGEVENS', ...contact.map(([label, value]) => `${label}: ${value || 'niet ingevuld'}`), '',
      'META ADS ACADEMY', ...academy.map(([label, value]) => `${label}: ${value || 'niet ingevuld'}`), '',
      'HERKOMST', `Formulier: ${fields.form_id}`, attribution, '', 'verkoop.studio · Interne aanmeldingsmelding'].join('\n'),
    html: `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Nieuwe academy-aanmelding</title></head><body style="margin:0;background-color:#f0f2f7;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#172343;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" bgcolor="#f0f2f7" style="background-color:#f0f2f7;padding:24px 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">`
      + `<tr><td bgcolor="#172343" style="background-color:#172343;padding:28px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:24px;color:#ffffff;font-weight:700;">verkoop.studio</td></tr><tr><td style="padding-top:28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#c5cdfd;letter-spacing:1px;">NIEUWE ACADEMY-AANMELDING</td></tr><tr><td style="padding-top:10px;overflow-wrap:anywhere;font-family:Arial,Helvetica,sans-serif;font-size:28px;line-height:36px;color:#ffffff;font-weight:700;">${escape(title)}</td></tr><tr><td style="padding-top:8px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:24px;color:#e0e5f4;">Aanmelding van ${escape(fields.naam)}</td></tr></table></td></tr>`
      + `<tr><td bgcolor="#e5e9ff" style="background-color:#e5e9ff;padding:16px 24px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#263861;">Je kunt deze e-mail rechtstreeks beantwoorden om de aanvrager te contacteren.</td></tr>`
      + block('Contactgegevens', contact) + block('Meta Ads Academy', academy)
      + `<tr><td bgcolor="#f8f9fc" style="background-color:#f8f9fc;padding:22px 24px 24px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:22px;color:#495978;font-weight:700;">Herkomst van de aanmelding</td></tr><tr><td style="padding-top:10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#62708a;">Formulier: ${escape(fields.form_id)}</td></tr><tr><td style="padding-top:6px;overflow-wrap:anywhere;word-break:break-word;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#62708a;">${escape(attribution)}</td></tr></table></td></tr>`
      + `<tr><td align="center" style="padding-top:20px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#62708a;">verkoop.studio · Interne aanmeldingsmelding</td></tr></table></td></tr></table></body></html>`,
  }
}

export function academyWelcome(fields) {
  const firstName = fields.naam.split(/\s+/)[0]
  const lines = [
    `Hoi ${firstName},`, '',
    'Bedankt voor je aanmelding voor de Meta Ads Academy van verkoop.studio.',
    'Stef neemt persoonlijk contact met je op om je doel, je ervaring en de opzet van je traject te bespreken. Daarna krijg je een voorstel.',
    'Een vraag in de tussentijd? Antwoord gewoon op deze mail.', '', 'Tot snel,', 'Stef — verkoop.studio',
  ]
  return {
    subject: 'Je aanmelding voor de Meta Ads Academy',
    text: lines.join('\n'),
    html: `<div style="font-family:Arial,Helvetica,sans-serif;color:#172343;max-width:520px;font-size:15px;line-height:1.6"><p style="font-size:12px;color:#254bfa;font-weight:700;letter-spacing:1px;margin:0 0 6px">META ADS ACADEMY</p><h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">Bedankt, ${escape(firstName)}.</h1><p>${escape(lines[2])}</p><p>${escape(lines[3])}</p><p>${escape(lines[4])}</p><p style="color:#62708a;font-size:13px;margin-top:24px">Tot snel,<br>Stef — verkoop.studio</p></div>`,
  }
}

/** Stores the contact, notifies Stef and creates the CRM lead. Any failure is reported, never hidden. */
export async function captureAcademySignup({ resend, fields, from, to, crm, request = resendRequest }) {
  if (!resend) return { ok: false, status: 503, captured: [], failed: ['resend_not_configured'] }
  const key = academyKey(fields)
  const notification = academyNotification(fields)
  const tasks = [
    ['resend_contact', () => saveLeadContact(resend, fields, request)],
    ['resend_email', () => request(() => resend.emails.send({
      from, to: [...new Set(['stefkeppens@gmail.com', to].filter(Boolean))], replyTo: fields.email, ...notification,
    }, { idempotencyKey: `academy-notification/${key}` }))],
  ]
  if (crm) tasks.push(['crm', crm])
  // Sequential calls keep rate-limit pressure low; one failure never skips another destination.
  const captured = [], failed = []
  for (const [label, run] of tasks) {
    try { await run(); captured.push(label) }
    catch { failed.push(label) }
  }
  const ok = !failed.length
  return { ok, status: ok ? 200 : 502, captured, failed, key }
}

export function academyRouter({ resend, from, to, replyFrom, crmUrl, crmToken, sendCrm = sendToCrm }) {
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
    // Honeypot: real visitors never fill this hidden field.
    if (body.company_website) return res.json({ ok: true })
    const fields = academyFields(body)
    if (!fields) return res.status(400).json({ error: 'invalid_fields' })
    if (!resend) return res.status(503).json({ error: 'not_configured' })
    const hash = createHash('sha256').update(fields.email).digest('hex')
    if (!allow(`ip:${req.ip}`, 10) || !allow(`email:${hash}`, 5)) {
      res.set('Retry-After', '600')
      return res.status(429).json({ error: 'rate_limited' })
    }
    let payload
    try { payload = academyCrmPayload(fields) }
    catch { return res.status(400).json({ error: 'invalid_fields' }) }
    const result = await captureAcademySignup({
      resend, fields, from, to,
      crm: crmUrl || crmToken ? () => sendCrm(payload, { url: crmUrl, token: crmToken }) : undefined,
    })
    if (!result.ok) {
      console.error('[academy] capture incomplete:', result.failed.join(', '))
      return res.status(result.status).json({ ok: false, error: 'capture_incomplete' })
    }
    const captured = result.captured
    // Welcome mail and newsletter are extras: the signup itself is already safe.
    try {
      const welcome = academyWelcome(fields)
      await resendRequest(() => resend.emails.send({ from: replyFrom || from, to: [fields.email], replyTo: to, ...welcome }, { idempotencyKey: `academy-welcome/${result.key}` }))
      captured.push('resend_welcome')
    } catch (error) { console.error('[academy] welcome email failed:', error.message) }
    if (fields.nieuwsbrief) {
      try {
        const subscription = await subscribeNewsletter({ resend, email: fields.email, lang: 'nl', source: 'academy' })
        if (subscription.ok) captured.push('newsletter_segment')
      } catch { console.error('[academy] newsletter signup failed') }
    }
    return res.json({ ok: true, captured })
  })
  return router
}
