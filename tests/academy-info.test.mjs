import test from 'node:test'
import assert from 'node:assert/strict'
import express from 'express'
import { academyInfoRouter } from '../server-academy-info.js'

function fixture(failInfo = false) {
  const sent = [], created = []
  const resend = {
    contacts: { get: async () => ({ error: { statusCode: 404 } }), create: async value => { created.push(value); return { data: { id: 'contact' } } } },
    emails: { send: async (message, options) => { sent.push({ message, options }); return failInfo && message.to.includes('reader@example.com') ? { error: { statusCode: 422 } } : { data: { id: 'email' } } } },
  }
  return { resend, sent, created }
}
async function withServer(resend, action) {
  const app = express(); app.use(express.json())
  app.use('/api/academy-info', academyInfoRouter({ resend, from: 'noreply@example.com', to: 'owner@example.com' }))
  const server = app.listen(0)
  const post = async body => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/academy-info`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    return { status: response.status, body: await response.json() }
  }
  try { await action(post) } finally { server.close() }
}

test('email-only request stores contact and delivers actual information plus internal notification', async () => {
  const f = fixture()
  await withServer(f.resend, async post => {
    assert.equal((await post({ email: ' Reader@Example.com ', lang: 'nl' })).status, 200)
    assert.equal(f.created[0].email, 'reader@example.com')
    assert.equal(f.sent.length, 2)
    const mail = f.sent[0]
    assert.deepEqual(mail.message.to, ['reader@example.com'])
    assert.equal(mail.message.replyTo, 'stef@verkoop.studio')
    assert.match(mail.message.text, /GA4.*server-side tracking/)
    assert.match(mail.message.text, /geen nieuwsbriefinschrijving/)
    assert.doesNotMatch(mail.message.text, /neemt.*contact.*plannen/)
    assert.match(f.sent[1].message.text, /academy-info-popup/)
    await post({ email: 'reader@example.com', lang: 'nl' })
    assert.equal(f.sent[2].options.idempotencyKey, mail.options.idempotencyKey)
  })
})

test('English information contains the lesson overview in English', async () => {
  const f = fixture()
  await withServer(f.resend, async post => {
    assert.equal((await post({ email: 'reader@example.com', lang: 'en' })).status, 200)
    assert.match(f.sent[0].message.html, /lang="en"/)
    assert.match(f.sent[0].message.text, /For online stores and B2B businesses/)
    assert.doesNotMatch(f.sent[0].message.text, /Hier vind je|Je volgt/)
  })
})

test('invalid requests and bots send nothing; valid repeated requests are rate-limited', async () => {
  const f = fixture()
  await withServer(f.resend, async post => {
    assert.equal((await post({ email: 'invalid', lang: 'nl' })).status, 400)
    assert.equal((await post({ email: 'reader@example.com', lang: 'fr' })).status, 400)
    assert.equal((await post({ company_website: 'bot' })).status, 200)
    assert.equal(f.sent.length, 0)
    for (let i = 0; i < 3; i++) assert.equal((await post({ email: 'reader@example.com', lang: 'nl' })).status, 200)
    assert.equal((await post({ email: 'reader@example.com', lang: 'nl' })).status, 429)
  })
  await withServer(null, async post => assert.equal((await post({ email: 'reader@example.com', lang: 'nl' })).status, 503))
})

test('delivery failure does not report success', async () => {
  const f = fixture(true)
  await withServer(f.resend, async post => {
    const result = await post({ email: 'reader@example.com', lang: 'nl' })
    assert.equal(result.status, 502)
    assert.equal(result.body.ok, false)
  })
})
