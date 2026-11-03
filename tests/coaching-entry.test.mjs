import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { coachingEntryRouter } from '../server-coaching-entry.js'

async function fixture(run, { fail = false, configured = true } = {}) {
  const sent = [], created = []
  const resend = {
    contacts: { get: async () => ({ error: { statusCode: 404 } }), create: async data => { created.push(data); return { data: { id: 'contact' } } } },
    emails: { send: async (data, options) => { sent.push({ data, options }); return fail ? { error: { statusCode: 422 } } : { data: { id: 'notification' } } } },
  }
  const app = express(); app.use(express.json())
  app.use('/entry', coachingEntryRouter({ resend: configured ? resend : null, from: 'sender@example.com', to: 'owner@example.com', now: () => new Date('2026-10-31T23:30:00Z') }))
  const server = app.listen(0)
  const post = async (body = {}) => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/entry`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'Candidate@Example.com', source: 'agency', lang: 'nl', ...body }) })
    return { status: response.status, body: await response.json() }
  }
  try { await run({ post, sent, created }) } finally { server.close() }
}

test('registration is retained and owner notified, without sending a marketing email to the entrant', async () => {
  await fixture(async ({ post, sent, created }) => {
    assert.equal((await post()).body.ok, true)
    assert.equal(created[0].email, 'candidate@example.com')
    assert.equal(sent.length, 1)
    assert.deepEqual(sent[0].data.to, ['owner@example.com'])
    assert.match(sent[0].data.subject, /2026-11/)
    assert.match(sent[0].data.text, /Geen nieuwsbriefinschrijving/)
    await post({ source: 'academy', lang: 'en' })
    assert.deepEqual(sent[0], sent[1], 'cross-page retries use the same key and payload')
  })
})
test('invalid data, bots and rapid repeat entries are handled without extra messages', async () => {
  await fixture(async ({ post, sent }) => {
    for (const body of [{ email: 'bad' }, { source: 'other' }, { lang: 'fr' }]) assert.equal((await post(body)).status, 400)
    assert.equal((await post({ company_website: 'bot' })).status, 200)
    assert.equal(sent.length, 0)
    for (let i = 0; i < 3; i++) assert.equal((await post()).status, 200)
    assert.equal((await post()).status, 429)
  })
})
test('missing configuration and notification failure cannot report a registered entry', async () => {
  await fixture(async ({ post }) => assert.equal((await post()).status, 503), { configured: false })
  await fixture(async ({ post }) => { const r = await post(); assert.equal(r.status, 502); assert.equal(r.body.ok, false) }, { fail: true })
})
