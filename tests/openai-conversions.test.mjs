import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import { sendOpenAiLead } from '../server-openai-conversions.js'

const receipt = { ok: true, captured: ['resend_contact'], key: 'saved-lead-key' }
const input = { receipt, submissionId: 'submission-1', sourceUrl: 'https://verkoop.studio/contact?email=private@example.com#form' }
const time = 1793529000000
function fixture(statuses = [200]) {
  const calls = [], pauses = []
  return { calls, pauses, options: {
    apiKey: 'test-only-key', now: () => time, sleep: async ms => pauses.push(ms),
    fetchImpl: async (url, options) => {
      calls.push({ url, options })
      const status = statuses[Math.min(calls.length - 1, statuses.length - 1)]
      if (status === 'network') throw Error('network failure containing secret')
      return { ok: status >= 200 && status < 300, status }
    },
  } }
}

test('server sends the specified event only to the fixed OpenAI pixel endpoint', async () => {
  const f = fixture()
  const result = await sendOpenAiLead(input, f.options)
  assert.deepEqual(result, { sent: true, eventId: 'website_lead_submission-1' })
  assert.equal(f.calls[0].url, 'https://bzr.openai.com/v1/events?pid=RVGNA5NGiGauDpbp33VAqq')
  assert.equal(f.calls[0].options.headers.Authorization, 'Bearer test-only-key')
  assert.equal(f.calls[0].options.redirect, 'error')
  assert.ok(f.calls[0].options.signal instanceof AbortSignal)
  assert.deepEqual(JSON.parse(f.calls[0].options.body), { validate_only: false, events: [{
    id: result.eventId, type: 'lead_created', timestamp_ms: time,
    source_url: 'https://verkoop.studio/contact', action_source: 'web', data: { type: 'customer_action' },
  }] })
})

test('disabled, failed, honeypot and missing-ID submissions make no API request', async () => {
  const f = fixture()
  assert.equal((await sendOpenAiLead(input, { ...f.options, apiKey: '' })).reason, 'not_configured')
  for (const r of [{}, { ok: true }, { ok: false, captured: ['resend_contact'] }, { ok: true, captured: ['crm'] }]) {
    assert.equal((await sendOpenAiLead({ ...input, receipt: r }, f.options)).reason, 'unconfirmed')
  }
  const invalid = { receipt: { ...receipt, key: undefined }, submissionId: '', sourceUrl: input.sourceUrl }
  assert.equal((await sendOpenAiLead(invalid, f.options)).reason, 'missing_id')
  assert.equal(f.calls.length, 0)
})

test('transient failures retry the identical event; rejection never fails the saved form', async () => {
  for (const statuses of [[429, 200], [503, 200], ['network', 200]]) {
    const f = fixture(statuses)
    assert.equal((await sendOpenAiLead(input, f.options)).sent, true)
    assert.equal(f.calls.length, 2)
    assert.equal(f.calls[0].options.body, f.calls[1].options.body)
    assert.deepEqual(f.pauses, [200])
  }
  for (const status of [400, 401, 403]) {
    const f = fixture([status])
    assert.deepEqual(await sendOpenAiLead(input, f.options), { sent: false, eventId: 'website_lead_submission-1', reason: 'rejected', status })
    assert.equal(f.calls.length, 1)
  }
  const f = fixture(['network'])
  assert.equal((await sendOpenAiLead(input, f.options)).reason, 'unavailable')
  assert.equal(f.calls.length, 2)
})

test('invalid source URLs use a trusted fallback; legacy submissions get a stable receipt ID', async () => {
  for (const sourceUrl of [undefined, 'garbage', 'https://unrelated.example/private', 'http://verkoop.studio/contact']) {
    const f = fixture()
    const result = await sendOpenAiLead({ ...input, submissionId: undefined, sourceUrl }, f.options)
    assert.equal(result.eventId, 'website_lead_saved-lead-key')
    assert.equal(JSON.parse(f.calls[0].options.body).events[0].source_url, 'https://verkoop.studio/contact')
  }
})

test('browser and server share the exact event identity for deduplication', async () => {
  const source = readFileSync(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8')
  const code = ts.transpileModule(source.replace('import.meta.env.DEV', 'false'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
  const calls = [], storage = new Map()
  const context = { exports: {}, window: { oaiq: (...args) => calls.push(args) }, sessionStorage: {
    getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value),
  } }
  vm.runInNewContext(code, context)
  const f = fixture()
  const result = await sendOpenAiLead({ ...input, submissionId: undefined }, f.options)
  context.exports.trackLeadConversion({ ...receipt, openai_event_id: result.eventId }, 'browser-submission', 'contact')
  assert.equal(calls[0][3].event_id, JSON.parse(f.calls[0].options.body).events[0].id)
  assert.equal(calls[0][1], 'lead_created')
})
