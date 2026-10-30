import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { academyFields, academyCrmPayload, academyNotification, academyRouter, captureAcademySignup, ACADEMY_CAMPAIGN } from '../server-academy.js'

const ok = { data: { id: 'receipt' }, error: null }
const failure = { data: null, error: { name: 'validation_error', statusCode: 422 } }
const signup = { naam: 'Lies Peeters', email: 'Lies@Example.com', telefoon: '0470 00 00 00', niveau: 'basis', budget: 'middel', submission_id: 'sub-1', form_id: 'academy-hero' }

function fixture() {
  const sent = [], created = [], segments = []
  const resend = {
    contacts: { get: async () => ({ error: { statusCode: 404 } }), create: async p => { created.push(p); return ok }, update: async () => ok, segments: { add: async p => { segments.push(p); return ok } } },
    emails: { send: async (p, o) => { sent.push({ p, o }); return ok } },
  }
  return { resend, sent, created, segments }
}

async function post(router, body) {
  const app = express()
  app.use(express.json())
  app.use('/api/academy', router)
  const server = app.listen(0)
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/academy`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    return { status: response.status, body: await response.json() }
  } finally { server.close() }
}

test('requires name, valid email and a phone number so Stef can call back', () => {
  assert.equal(academyFields(signup).email, 'lies@example.com')
  assert.equal(academyFields({ ...signup, naam: ' ' }), null)
  assert.equal(academyFields({ ...signup, email: 'geen-mail' }), null)
  assert.equal(academyFields({ ...signup, telefoon: '' }), null)
  assert.equal(academyFields({ ...signup, niveau: 'expert', budget: 'enorm' }).niveau, '')
})

test('CRM lead has the same shape as a website enquiry, labelled as academy', () => {
  const payload = academyCrmPayload(academyFields({ ...signup, vraag: 'Hoe test ik creatives?', attribution: { utm_source: 'meta' } }))
  assert.equal(payload.campaign, ACADEMY_CAMPAIGN)
  assert.equal(payload.company, 'Lies Peeters')
  assert.equal(payload.phone, '0470 00 00 00')
  assert.match(payload.notes, /Doel: Meta Ads Academy: kennismaking/)
  assert.match(payload.notes, /Uitdaging: Hoe test ik creatives\?/)
  assert.match(payload.notes, /Maandelijkse investering: €1\.000 – €5\.000 per maand/)
  assert.match(payload.notes, /Stand van zaken: Draait al campagnes/)
  assert.match(payload.notes, /utm_source: meta/)
})

test('notification uses the branded lead layout and escapes visitor input', () => {
  const mail = academyNotification(academyFields({ ...signup, bedrijf: '<b>Acme</b>' }))
  assert.equal(mail.subject, 'Nieuwe academy-aanmelding van <b>Acme</b>')
  assert.match(mail.html, /NIEUWE ACADEMY-AANMELDING/)
  assert.match(mail.html, /&lt;b&gt;Acme&lt;\/b&gt;/)
  assert.doesNotMatch(mail.html, /<b>Acme/)
  assert.match(mail.html, /Je kunt deze e-mail rechtstreeks beantwoorden/)
  assert.match(mail.text, /Telefoon: 0470 00 00 00/)
})

test('signup stores the contact, emails Stef and creates the CRM lead', async () => {
  const f = fixture()
  let crmCalls = 0
  const result = await captureAcademySignup({ resend: f.resend, fields: academyFields(signup), from: 'noreply@example.com', to: 'stefkeppens@gmail.com', crm: async () => { crmCalls++ } })
  assert.equal(result.ok, true)
  assert.deepEqual(result.captured, ['resend_contact', 'resend_email', 'crm'])
  assert.equal(f.created[0].email, 'lies@example.com')
  assert.deepEqual(f.sent[0].p.to, ['stefkeppens@gmail.com'])
  assert.equal(f.sent[0].p.replyTo, 'lies@example.com')
  assert.match(f.sent[0].o.idempotencyKey, /^academy-notification\//)
  assert.equal(crmCalls, 1)
})

test('a failed CRM or email is reported instead of a silent success', async () => {
  const f = fixture()
  const crmDown = await captureAcademySignup({ resend: f.resend, fields: academyFields(signup), from: 'x', to: 'y', crm: async () => { throw Error('down') } })
  assert.equal(crmDown.ok, false)
  assert.deepEqual(crmDown.failed, ['crm'])
  f.resend.emails.send = async () => failure
  const mailDown = await captureAcademySignup({ resend: f.resend, fields: academyFields(signup), from: 'x', to: 'y' })
  assert.equal(mailDown.ok, false)
  assert.deepEqual(mailDown.captured, ['resend_contact'])
})

test('endpoint confirms the signup by mail, forwards the CRM payload and only subscribes with consent', async () => {
  const f = fixture()
  const crmPayloads = []
  const router = academyRouter({ resend: f.resend, from: 'noreply@example.com', to: 'stefkeppens@gmail.com', crmUrl: 'https://crm.example.com/api', crmToken: 'test', sendCrm: async payload => { crmPayloads.push(payload); return { status: 'created', leadId: 'lead-1' } } })
  const first = await post(router, signup)
  assert.equal(first.status, 200)
  assert.deepEqual(first.body.captured, ['resend_contact', 'resend_email', 'crm', 'resend_welcome'])
  assert.equal(crmPayloads[0].campaign, ACADEMY_CAMPAIGN)
  const confirmation = f.sent.find(item => item.p.subject === 'Je kennismakingsaanvraag voor de Meta Ads Academy')
  assert.deepEqual(confirmation.p.to, ['lies@example.com'])
  assert.match(confirmation.p.text, /Stef neemt persoonlijk contact met je op/)
  assert.doesNotMatch(confirmation.p.text, /toegang/)
  assert.equal(f.segments.length, 0)
  const second = await post(router, { ...signup, submission_id: 'sub-2', nieuwsbrief: true })
  assert.ok(second.body.captured.includes('newsletter_segment'))
  assert.equal(JSON.parse(f.created.at(-1).properties.newsletter_consent).source, 'academy')
})

test('endpoint rejects invalid input, ignores bots and needs Resend', async () => {
  const f = fixture()
  const router = academyRouter({ resend: f.resend, from: 'x', to: 'y' })
  assert.equal((await post(router, { ...signup, telefoon: '' })).status, 400)
  const bot = await post(router, { ...signup, company_website: 'spam.example' })
  assert.deepEqual(bot.body, { ok: true })
  assert.equal(f.sent.length, 0)
  assert.equal((await post(academyRouter({ resend: null, from: 'x', to: 'y' }), signup)).status, 503)
})

test('English signups retain their language for CRM, confirmation and newsletter consent', async () => {
  const f = fixture()
  const payloads = []
  const router = academyRouter({ resend: f.resend, from: 'noreply@example.com', to: 'stefkeppens@gmail.com', crmUrl: 'https://crm.example.com/api', sendCrm: async payload => { payloads.push(payload); return { status: 'created' } } })
  assert.equal(academyFields({ ...signup, lang: 'en' }).lang, 'en')
  assert.equal(academyFields({ ...signup, lang: 'invalid' }).lang, 'nl')
  const response = await post(router, { ...signup, lang: 'en', nieuwsbrief: true })
  assert.equal(response.status, 200)
  const confirmation = f.sent.find(item => item.p.subject === 'Your Meta Ads Academy introductory call request')
  assert.ok(confirmation)
  assert.match(confirmation.p.text, /Stef will contact you personally/)
  assert.match(confirmation.p.html, /lang="en"/)
  assert.doesNotMatch(confirmation.p.html, /Bedankt|Tot snel/)
  assert.equal(JSON.parse(f.created.at(-1).properties.newsletter_consent).lang, 'en')
  assert.equal(payloads.length, 1)
})
