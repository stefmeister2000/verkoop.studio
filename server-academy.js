import { createHash } from 'node:crypto'
import { Router } from 'express'
import { resendRequest, saveLeadContact } from './server-lead.js'
import { crmPayload, sendToCrm } from './server-crm.js'
import { subscribeNewsletter } from './server-newsletter.js'

export const ACADEMY_TRACKS = { gratis: 'Gratis startleerpad', begeleid: 'Begeleid leertraject' }
export const ACADEMY_LEVELS = { start: 'Nog nooit geadverteerd', basis: 'Al wat zelf geprobeerd', actief: 'Draait al campagnes' }
export const ACADEMY_CAMPAIGN = 'verkoop.studio academy'

const text = (value, limit) => typeof value === 'string' ? value.trim().slice(0, limit) : ''
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const oneLine = value => value.replace(/[\r\n]+/g, ' ')

/** Normalises a signup; returns null when a required field is missing or invalid. */
export function academyFields(body = {}) {
  const fields = {
    naam: text(body.naam, 200), email: text(body.email, 200).toLowerCase(), telefoon: text(body.telefoon, 60),
    bedrijf: text(body.bedrijf, 200), website: text(body.website, 300), vraag: text(body.vraag, 2000),
    track: Object.hasOwn(ACADEMY_TRACKS, body.track) ? body.track : '',
    niveau: Object.hasOwn(ACADEMY_LEVELS, body.niveau) ? body.niveau : '',
    form_id: text(body.form_id, 60) || 'academy', submission_id: text(body.submission_id, 80),
    nieuwsbrief: body.nieuwsbrief === true, lang: 'nl',
    attribution: body.attribution && typeof body.attribution === 'object' ? body.attribution : {},
    ga4: body.ga4,
  }
  if (!fields.naam || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email) || !fields.track) return null
  // A guided track starts with a conversation, so it needs a way to call back.
  if (fields.track === 'begeleid' && !fields.telefoon) return null
  return fields
}

export function academyKey(fields) {
  return createHash('sha256').update(JSON.stringify([fields.submission_id, fields.email, fields.track, fields.form_id])).digest('hex')
}

export function academyCrmPayload(fields) {
  return crmPayload({
    naam: fields.naam, email: fields.email, telefoon: fields.telefoon, bedrijf: fields.bedrijf, website: fields.website,
    doel: `Meta Ads Academy: ${ACADEMY_TRACKS[fields.track]}`,
    uitdaging: fields.vraag,
    extra: [fields.niveau && `Ervaring: ${ACADEMY_LEVELS[fields.niveau]}`, fields.nieuwsbrief && 'Nieuwsbrief: ja'].filter(Boolean).join('\n'),
    form_id: fields.form_id, lang: fields.lang, attribution: fields.attribution, ga4: fields.ga4,
  }, { campaign: ACADEMY_CAMPAIGN })
}

export function academyNotification(fields) {
  const track = ACADEMY_TRACKS[fields.track]
  const rows = [
    ['Traject', track], ['Naam', fields.naam], ['E-mail', fields.email], ['Telefoon', fields.telefoon], ['Bedrijf', fields.bedrijf],
    ['Website', fields.website], ['Ervaring', ACADEMY_LEVELS[fields.niveau] ?? ''], ['Vraag', fields.vraag],
    ['Nieuwsbrief', fields.nieuwsbrief ? 'ja' : 'nee'], ['Formulier', fields.form_id],
    ['Bron', Object.entries(fields.attribution).filter(([, value]) => typeof value === 'string' && value).map(([key, value]) => `${key}: ${value}`).join(' · ')],
  ].filter(([, value]) => value)
  return {
    subject: oneLine(`Academy-aanmelding (${track}): ${fields.bedrijf || fields.naam}`).slice(0, 120),
    text: [`Nieuwe aanmelding voor de Meta Ads Academy.`, '', ...rows.map(([label, value]) => `${label}: ${value}`)].join('\n'),
    html: `<div style="font-family:Inter,Arial,sans-serif;color:#181c3d;max-width:560px"><p style="font-size:13px;color:#254bfa;font-weight:700;letter-spacing:.08em;margin:0 0 6px">META ADS ACADEMY</p><h1 style="font-size:22px;margin:0 0 18px">${escape(track)}: ${escape(fields.naam)}</h1><table style="border-collapse:collapse;width:100%;font-size:14px">${rows.map(([label, value]) => `<tr><td style="padding:8px 12px 8px 0;color:#8a90a8;vertical-align:top;white-space:nowrap">${escape(label)}</td><td style="padding:8px 0;border-bottom:1px solid #eceef6;white-space:pre-wrap">${escape(value)}</td></tr>`).join('')}</table></div>`,
  }
}

export function academyWelcome(fields, siteUrl) {
  const firstName = fields.naam.split(/\s+/)[0]
  const link = `${siteUrl}/academy?toegang=1#werkplaats`
  const guided = fields.track === 'begeleid'
  const lines = [
    `Hoi ${firstName},`, '',
    'Welkom in de Meta Ads Academy van verkoop.studio. Je hebt nu toegang tot alle zes lessen en je eigen campagneplan.',
    guided ? 'Je koos voor het begeleide leertraject. Stef neemt persoonlijk contact met je op om je doel en de opzet te bespreken.' : 'Stef neemt persoonlijk contact met je op om te bekijken waar je staat en wat je volgende stap is. Een vraag? Antwoord gewoon op deze mail.',
    '', `Start hier: ${link}`, '', 'Tot snel,', 'Stef — verkoop.studio',
  ]
  return {
    subject: 'Welkom in de Meta Ads Academy',
    text: lines.join('\n'),
    html: `<div style="font-family:Inter,Arial,sans-serif;color:#181c3d;max-width:520px;font-size:15px;line-height:1.6"><p style="font-size:13px;color:#254bfa;font-weight:700;letter-spacing:.08em;margin:0 0 6px">META ADS ACADEMY</p><h1 style="font-size:24px;line-height:1.2;margin:0 0 16px">Welkom, ${escape(firstName)}.</h1><p>Je hebt nu toegang tot alle zes lessen en je eigen campagneplan.</p><p>${escape(lines[3])}</p><p style="margin:26px 0"><a href="${escape(link)}" style="display:inline-block;background:#254bfa;color:#fff;text-decoration:none;padding:13px 22px;border-radius:10px;font-weight:600">Open de academy</a></p><p style="color:#8a90a8;font-size:13px">Tot snel,<br>Stef — verkoop.studio</p></div>`,
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

export function academyRouter({ resend, from, to, replyFrom, siteUrl = 'https://verkoop.studio', crmUrl, crmToken, sendCrm = sendToCrm }) {
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
      const welcome = academyWelcome(fields, siteUrl)
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
