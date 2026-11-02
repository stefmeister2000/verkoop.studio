import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { partialLeadRouter, capturePartialLead, partialFields, PARTIAL_PROPERTY } from '../server-partial.js'

const beacon = {
  email: 'Halfway@Example.com', naam: 'Alex Example', telefoon: '0470 00 00 00',
  form_id: 'audit-formulier-contact', furthest_step: 'telefoon', progress_pct: 75, lang: 'nl',
}

function fixture({ existing = null } = {}) {
  const created = [], updated = [], segments = []
  const resend = {
    contacts: {
      get: async () => existing ? { data: existing } : { error: { statusCode: 404 } },
      create: async value => { created.push(value); return { data: { id: 'contact' } } },
      update: async value => { updated.push(value); return { data: { id: value.id } } },
      segments: { add: async value => { segments.push(value); return { data: { id: 'segment' } } } },
    },
  }
  return { resend, created, updated, segments }
}

async function withServer({ resend, segmentId }, action) {
  const app = express(); app.use(express.json())
  app.use('/api/lead/partial', partialLeadRouter({ resend, segmentId }))
  const server = app.listen(0)
  const post = async body => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/lead/partial`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    return { status: response.status, body: await response.json() }
  }
  try { await action(post) } finally { server.close() }
}

test('an unfinished form stores the email address with how far the visitor got', async () => {
  const f = fixture()
  await withServer({ ...f, segmentId: 'unfinished-segment' }, async post => {
    const result = await post(beacon)
    assert.equal(result.status, 200)
    assert.deepEqual(result.body, { ok: true, captured: ['resend_contact', 'resend_properties', 'resend_segment'] })
  })
  assert.equal(f.created[0].email, 'halfway@example.com')
  assert.equal(f.created[0].firstName, 'Alex')
  const note = JSON.parse(f.updated[0].properties[PARTIAL_PROPERTY])
  assert.equal(note.form_id, 'audit-formulier-contact')
  assert.equal(note.furthest_step, 'telefoon')
  assert.equal(note.progress_pct, 75)
  assert.equal(note.telefoon, '0470 00 00 00')
  assert.deepEqual(f.segments, [{ contactId: 'contact', segmentId: 'unfinished-segment' }])
})

test('an unfinished form is no subscription: no segment without one configured, never for an unsubscribed contact', async () => {
  const withoutSegment = fixture()
  await withServer(withoutSegment, async post => {
    const result = await post(beacon)
    assert.deepEqual(result.body.captured, ['resend_contact', 'resend_properties'])
  })
  assert.deepEqual(withoutSegment.segments, [])

  const unsubscribed = fixture({ existing: { id: 'known', unsubscribed: true } })
  await withServer({ ...unsubscribed, segmentId: 'unfinished-segment' }, async post => {
    const result = await post(beacon)
    assert.deepEqual(result.body.captured, ['resend_contact', 'resend_properties'])
  })
  assert.deepEqual(unsubscribed.segments, [])
  assert.deepEqual(unsubscribed.created, [])
})

test('a filled honeypot is acknowledged without storing anything', async () => {
  const f = fixture()
  await withServer(f, async post => {
    const result = await post({ ...beacon, company_website: 'https://bot.example' })
    assert.deepEqual(result.body, { ok: true })
  })
  assert.deepEqual(f.created, [])
  assert.deepEqual(f.updated, [])
})

test('a beacon without a usable email address is rejected', async () => {
  const f = fixture()
  await withServer(f, async post => {
    for (const body of [{}, { email: '' }, { email: 'not-an-address' }, { email: 42 }]) {
      assert.equal((await post(body)).status, 400)
    }
  })
  assert.deepEqual(f.created, [])
})

test('repeated beacons for the same address stop after three', async () => {
  const f = fixture()
  await withServer(f, async post => {
    for (let attempt = 0; attempt < 3; attempt++) assert.equal((await post(beacon)).status, 200)
    const limited = await post(beacon)
    assert.equal(limited.status, 429)
    assert.deepEqual(limited.body, { error: 'rate_limited' })
  })
})

test('a configured site reports the capture failure instead of a silent success', async () => {
  const f = fixture()
  f.resend.contacts.create = async () => ({ error: { name: 'validation_error', statusCode: 422 } })
  await withServer(f, async post => {
    const result = await post(beacon)
    assert.equal(result.status, 502)
    assert.deepEqual(result.body, { ok: false, error: 'capture_failed' })
  })
})

test('a site without Resend configured never pretends to have stored the address', async () => {
  await withServer({ resend: null }, async post => {
    assert.equal((await post(beacon)).status, 503)
  })
})

test('fields are trimmed, lowercased and bounded', () => {
  const fields = partialFields({
    email: '  MiXeD@Example.COM ', naam: ' Alex ', telefoon: ' 0470 ', bedrijf: 'B'.repeat(300),
    website: 'https://example.com', form_id: '', furthest_step: '', progress_pct: 420, lang: 'de',
  })
  assert.equal(fields.email, 'mixed@example.com')
  assert.equal(fields.naam, 'Alex')
  assert.equal(fields.bedrijf.length, 200)
  assert.equal(fields.form_id, 'unknown')
  assert.equal(fields.furthest_step, 'none')
  assert.equal(fields.progress_pct, 100)
  assert.equal(fields.lang, 'nl')
})

test('capture never starts the enquiry follow-up flow', async () => {
  const f = fixture()
  // A flow send would throw: an unfinished form has no consent behind it.
  f.resend.events = { send: async () => { throw new Error('no follow-up for an unfinished form') } }
  const result = await capturePartialLead({ resend: f.resend, fields: partialFields(beacon), segmentId: 'unfinished-segment' })
  assert.equal(result.ok, true)
})
