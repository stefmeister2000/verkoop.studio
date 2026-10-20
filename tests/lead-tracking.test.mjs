import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = readFileSync(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8')
const code = ts.transpileModule(source.replace('import.meta.env.DEV', 'false'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText
const receipt = { ok: true, captured: ['resend_contact'] }
function fixture({ ga = true, meta = true, storage = new Map(), brokenStorage = false } = {}) {
  const calls = { ga: [], meta: [] }
  const window = {}
  if (ga) window.gtag = (...args) => calls.ga.push(args)
  if (meta) window.fbq = (...args) => calls.meta.push(args)
  const context = { exports: {}, window, sessionStorage: {
    getItem: key => { if (brokenStorage) throw Error('blocked'); return storage.get(key) },
    setItem: (key, value) => { if (brokenStorage) throw Error('blocked'); storage.set(key, value) },
  } }
  vm.runInNewContext(code, context)
  return { ...context, calls, track: context.exports.trackLeadConversion, newsletter: context.exports.trackNewsletterConversion, storage }
}
test('confirmed enquiry emits the correct Meta Lead once, without contact data', () => {
  const f = fixture()
  f.track(receipt, 'submission-1', 'contact')
  f.track(receipt, 'submission-1', 'contact')
  assert.equal(f.calls.ga.length, 1)
  assert.deepEqual(JSON.parse(JSON.stringify(f.calls.meta)), [
    ['trackSingle', '29297541076513579', 'Lead', { content_name: 'Website enquiry', form_id: 'contact' }, { eventID: 'website_lead_submission-1' }],
  ])
  f.track(receipt, 'submission-2', 'contact')
  assert.equal(f.calls.meta.length, 2)
})
test('failed, honeypot and incomplete receipts never emit conversions', () => {
  const f = fixture()
  for (const r of [{}, {ok:true}, {ok:false,captured:['resend_contact']}, {ok:true,captured:'resend_contact'}, {ok:true,captured:[]}]) f.track(r,'x','contact')
  f.track(receipt,'','contact')
  assert.equal(f.calls.ga.length + f.calls.meta.length, 0)
})
test('Meta works without GA; GA works without Meta', () => {
  const m = fixture({ga:false}); m.track(receipt,'x','contact'); assert.equal(m.calls.meta.length,1)
  const g = fixture({meta:false}); g.track(receipt,'x','contact'); assert.equal(g.calls.ga.length,1)
})
test('throwing tags do not block the other destination or fail the form', () => {
  const a = fixture(); a.window.gtag = () => {throw Error('blocked')}
  a.track(receipt,'x','contact'); assert.equal(a.calls.meta.length,1)
  const b = fixture(); b.window.fbq = () => {throw Error('blocked')}
  assert.doesNotThrow(() => b.track(receipt,'x','contact')); assert.equal(b.calls.ga.length,1)
})
test('dedup survives module reload and unavailable storage', () => {
  const a = fixture(); a.track(receipt,'x','contact')
  const b = fixture({storage:a.storage}); b.track(receipt,'x','contact')
  assert.equal(b.calls.meta.length + b.calls.ga.length,0)
  const c = fixture({brokenStorage:true}); c.track(receipt,'x','contact'); c.track(receipt,'x','contact')
  assert.equal(c.calls.meta.length,1)
})
test('previous GA receipt does not suppress a new Meta delivery', () => {
  const f = fixture({storage:new Map([['sk_ga4_lead_x','1']])})
  f.track(receipt,'x','contact')
  assert.equal(f.calls.ga.length,0); assert.equal(f.calls.meta.length,1)
})

test('newsletter signup emits distinguishable GA and Meta leads once without personal data', () => {
  const f = fixture()
  const signup = { ok: true, captured: ['newsletter_segment'], email: 'private@example.com', consent: 'private' }
  f.newsletter(signup, 'signup-1')
  f.newsletter(signup, 'signup-1')
  assert.deepEqual(JSON.parse(JSON.stringify(f.calls)), {
    ga: [['event', 'generate_lead', {
      send_to: 'G-VRKJP8K3SD', method: 'newsletter_signup', form_id: 'newsletter-popup',
    }]],
    meta: [['trackSingle', '29297541076513579', 'Lead', {
      content_name: 'Newsletter signup', form_id: 'newsletter-popup',
    }, { eventID: 'website_lead_newsletter_signup-1' }]],
  })
  f.track(receipt, 'signup-1', 'contact')
  assert.equal(f.calls.ga.length, 2)
})

test('newsletter honeypots, failures and unrelated capture receipts never count as leads', () => {
  const f = fixture()
  for (const r of [{}, { ok: true }, receipt, { ok: false, captured: ['newsletter_segment'] },
    { ok: true, captured: 'newsletter_segment' }]) f.newsletter(r, 'signup-1')
  f.newsletter({ ok: true, captured: ['newsletter_segment'] }, '')
  assert.equal(f.calls.ga.length + f.calls.meta.length, 0)
})

test('newsletter destinations stay independent and repeat receipts survive reload', () => {
  const signup = { ok: true, captured: ['newsletter_segment'] }
  const a = fixture()
  a.window.gtag = () => { throw Error('blocked') }
  assert.doesNotThrow(() => a.newsletter(signup, 'signup-1'))
  assert.equal(a.calls.meta.length, 1)
  const b = fixture({ storage: a.storage })
  b.newsletter(signup, 'signup-1')
  assert.equal(b.calls.ga.length, 1)
  assert.equal(b.calls.meta.length, 0)
})
