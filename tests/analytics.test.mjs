import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = readFileSync(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source.replace('import.meta.env.DEV', 'false'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const receipt = { ok: true, captured: ['resend_contact', 'resend_email'] }
function fixture({ blockedStorage = false, brokenTag = false, noTag = false } = {}) {
  const calls = [], storage = new Map(), window = {}
  if (!noTag) window.gtag = (...args) => { if (brokenTag) throw Error('tag unavailable'); calls.push(args) }
  const context = vm.createContext({ exports: {}, window, sessionStorage: {
    getItem: key => { if (blockedStorage) throw Error('blocked'); return storage.get(key) },
    setItem: (key, value) => { if (blockedStorage) throw Error('blocked'); storage.set(key, value) },
  } })
  vm.runInContext(compiled, context)
  return { calls, storage, window, track: context.exports.trackLeadConversion }
}

test('sends a successful lead once to the requested property without personal data', () => {
  const f = fixture()
  f.track({ ...receipt, email: 'private@example.com', naam: 'Private', uitdaging: 'Private message' }, 'submission-1', 'audit-formulier-contact')
  f.track(receipt, 'submission-1', 'audit-formulier-contact')
  assert.deepEqual(JSON.parse(JSON.stringify(f.calls)), [['event', 'generate_lead', {
    send_to: 'G-VRKJP8K3SD', method: 'website_form', form_id: 'audit-formulier-contact',
  }]])
  f.track(receipt, 'submission-2', 'audit-formulier-contact')
  assert.equal(f.calls.length, 2)
})
test('failed, partial and honeypot responses cannot become conversions', () => {
  const f = fixture()
  for (const invalid of [{ ok: false }, { ok: true }, { ok: false, captured: ['resend_contact'] }, { ok: true, captured: ['crm'] }]) {
    f.track(invalid, 'submission-1', 'contact')
  }
  assert.equal(f.calls.length, 0)
})
test('session receipts prevent repeat events after module reload', () => {
  const f = fixture()
  f.storage.set('sk_ga4_lead_submission-1', '1')
  f.track(receipt, 'submission-1', 'contact')
  assert.equal(f.calls.length, 0)
})
test('storage restrictions and missing or broken analytics do not break the form', () => {
  const f = fixture({ blockedStorage: true })
  f.track(receipt, 'submission-1', 'contact')
  f.track(receipt, 'submission-1', 'contact')
  assert.equal(f.calls.length, 1)
  for (const options of [{ noTag: true }, { brokenTag: true }]) {
    assert.doesNotThrow(() => fixture(options).track(receipt, 'submission-1', 'contact'))
  }
  const context = vm.createContext({ exports: {} })
  vm.runInContext(compiled, context)
  assert.doesNotThrow(() => context.exports.trackLeadConversion(receipt, 'submission-1', 'contact'))
})

test('collects actual Google client/session IDs without inventing attribution', async () => {
  for (const [client, session, expected] of [
    ['12345.67890', 1234, {clientId:'12345.67890',sessionId:'1234'}],
    ['private@example.com', 1234, undefined],
    [undefined, undefined, undefined],
  ]) {
    const context = vm.createContext({exports:{},setTimeout,clearTimeout,window:{gtag:(_cmd,_target,field,callback)=>callback(field==='client_id'?client:session)}})
    vm.runInContext(compiled, context)
    const result=await context.exports.getGa4Context()
    assert.deepEqual(result && JSON.parse(JSON.stringify(result)),expected)
  }
  const context=vm.createContext({exports:{},setTimeout,clearTimeout,window:{gtag:()=>{}}})
  vm.runInContext(compiled,context)
  assert.equal(await context.exports.getGa4Context(),undefined)
})
