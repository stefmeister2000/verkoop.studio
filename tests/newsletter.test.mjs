import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { newsletterRouter, subscribeNewsletter, NEWSLETTER_SEGMENT, CONSENT_VERSION } from '../server-newsletter.js'

function fixture(existing) {
  const calls = []
  const ok = { data: { id: 'contact-1' } }
  return {
    calls,
    resend: { contacts: {
      get: async () => existing ? { data: existing } : { error: { statusCode: 404 } },
      create: async body => { calls.push(['create', body]); return ok },
      update: async body => { calls.push(['update', body]); return ok },
      segments: { add: async body => { calls.push(['segment', body]); return ok } },
    } },
  }
}

test('signup stores explicit consent and adds only the newsletter segment', async () => {
  const f = fixture()
  assert.deepEqual(await subscribeNewsletter({ resend: f.resend, email: 'signup@example.com', lang: 'nl' }), { ok: true, status: 200 })
  const consent = JSON.parse(f.calls[0][1].properties.newsletter_consent)
  assert.equal(consent.version, CONSENT_VERSION)
  assert.equal(consent.source, 'website_popup')
  assert.match(consent.text, /marketingtips/)
  assert.ok(Date.parse(consent.at))
  assert.equal(f.calls.at(-1)[1].segmentId, NEWSLETTER_SEGMENT)
})

test('existing unsubscribed contacts are never reactivated or added to the list', async () => {
  const f = fixture({ id: 'existing', unsubscribed: true })
  const result = await subscribeNewsletter({ resend: f.resend, email: 'signup@example.com', lang: 'nl' })
  assert.equal(result.status, 409)
  assert.deepEqual(f.calls, [])
})

test('existing consent and profile survive repeat submissions', async () => {
  const f = fixture({ id: 'existing', unsubscribed: false, properties: { newsletter_consent: { value: 'original' } } })
  await subscribeNewsletter({ resend: f.resend, email: 'signup@example.com', lang: 'en' })
  assert.deepEqual(f.calls, [['segment', { contactId: 'existing', segmentId: NEWSLETTER_SEGMENT }]])
})

test('concurrent creation checks subscription preferences again after a conflict', async () => {
  const f = fixture()
  let gets = 0
  f.resend.contacts.get = async () => ++gets === 1
    ? { error: { statusCode: 404 } } : { data: { id: 'existing', unsubscribed: true } }
  f.resend.contacts.create = async () => ({ error: { statusCode: 409 } })
  const result = await subscribeNewsletter({ resend: f.resend, email: 'signup@example.com', lang: 'nl' })
  assert.equal(result.status, 409)
  assert.deepEqual(f.calls, [])
})

async function server(t, resend) {
  const app = express()
  app.use(express.json())
  app.use('/api/newsletter', newsletterRouter(resend))
  const instance = app.listen(0, '127.0.0.1')
  await new Promise(resolve => instance.once('listening', resolve))
  t.after(() => new Promise(resolve => instance.close(resolve)))
  return async body => {
    const response = await fetch(`http://127.0.0.1:${instance.address().port}/api/newsletter`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    })
    return { status: response.status, body: await response.json() }
  }
}
const valid = { email: ' signup@example.com ', consent: true, consent_version: CONSENT_VERSION, lang: 'nl' }

test('HTTP validation, honeypot, normalization and repeated-attempt protection', async t => {
  const f = fixture()
  const post = await server(t, f.resend)
  assert.equal((await post({ ...valid, consent: false })).status, 400)
  assert.equal((await post({ ...valid, consent_version: 'wrong' })).status, 400)
  assert.equal((await post({ ...valid, email: 'not-an-email' })).status, 400)
  assert.equal((await post({ ...valid, email: 'a'.repeat(260) + '@example.com' })).status, 400)
  assert.equal((await post({ company_website: 'bot' })).status, 200)
  assert.equal(f.calls.length, 0)
  assert.equal((await post(valid)).status, 200)
  assert.equal(f.calls[0][1].email, 'signup@example.com')
  await post(valid)
  await post(valid)
  assert.equal((await post(valid)).status, 429)
})

test('missing configuration and failed contact/segment storage never report success', async t => {
  const unconfigured = await server(t, null)
  assert.equal((await unconfigured(valid)).status, 503)
  for (const target of ['create', 'segment']) {
    const f = fixture()
    const fail = async () => ({ error: { statusCode: 403 } })
    if (target === 'create') f.resend.contacts.create = fail
    else f.resend.contacts.segments.add = fail
    const post = await server(t, f.resend)
    assert.deepEqual(await post(valid), { status: 502, body: { error: 'capture_failed' } })
  }
})
