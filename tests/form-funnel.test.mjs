import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Objects built inside the sandbox carry its own prototypes; compare their data.
const plain = value => JSON.parse(JSON.stringify(value))

const source = readFileSync(new URL('../src/lib/formFunnel.ts', import.meta.url), 'utf8')
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText

function fixture(steps = ['naam', 'email', 'telefoon', 'doel']) {
  const context = { exports: {} }
  vm.runInNewContext(code, context)
  const tracked = [], partials = []
  const funnel = context.exports.createFormFunnel({
    formId: 'audit-formulier', steps, lang: 'nl',
    track: (event, payload) => tracked.push([event, payload]),
    sendPartial: lead => partials.push(lead),
  })
  return { funnel, tracked, partials, events: () => tracked.map(([event]) => event) }
}

test('reports the furthest field reached, once per step', () => {
  const f = fixture()
  f.funnel.observe('naam', 'Alex')
  f.funnel.observe('naam', 'Alex Example')
  f.funnel.observe('telefoon', '0470 00 00 00')
  assert.deepEqual(f.events(), ['form_started', 'form_step', 'form_step'])
  assert.equal(f.tracked[2][1].furthest_step, 'telefoon')
  assert.equal(f.tracked[2][1].steps_completed, 3)
  assert.equal(f.tracked[2][1].progress_pct, 75)
  // Going back to an earlier field does not undo how far they got.
  f.funnel.observe('naam', 'Alex Example BV')
  assert.equal(f.events().filter(event => event === 'form_step').length, 2)
})

test('a visitor who only looked at the form reports no progress and no partial lead', () => {
  const f = fixture()
  f.funnel.leave()
  assert.deepEqual(f.events(), [])
  assert.deepEqual(f.partials, [])
})

test('leaving halfway reports the drop-off point', () => {
  const f = fixture()
  f.funnel.observe('naam', 'Alex')
  f.funnel.leave()
  f.funnel.leave()
  const abandoned = f.tracked.filter(([event]) => event === 'form_abandoned')
  assert.equal(abandoned.length, 1)
  assert.deepEqual(plain(abandoned[0][1]), {
    form_id: 'audit-formulier', furthest_step: 'naam', steps_completed: 1,
    step_count: 4, progress_pct: 25, email_captured: false,
  })
})

test('an email address is only a step, and only captured, once it could be mailed', () => {
  const f = fixture()
  f.funnel.observe('naam', 'Alex')
  f.funnel.observe('email', 'alex@')
  assert.equal(f.events().filter(event => event === 'form_step').length, 1)
  f.funnel.observe('email', 'Alex@Example.com ')
  f.funnel.observe('email', 'Alex@Example.com')
  assert.deepEqual(f.events().slice(-2), ['form_step', 'form_email_captured'])
  f.funnel.leave()
  assert.equal(f.partials.length, 1)
  assert.deepEqual(plain(f.partials[0]), {
    form_id: 'audit-formulier', furthest_step: 'email', steps_completed: 2, step_count: 4, progress_pct: 50,
    email: 'alex@example.com', naam: 'Alex', telefoon: '', bedrijf: '', website: '',
    lang: 'nl', company_website: '',
  })
  f.funnel.leave()
  assert.equal(f.partials.length, 1)
})

test('a sent form is never abandoned and never captured a second time', () => {
  const f = fixture()
  f.funnel.observe('naam', 'Alex')
  f.funnel.observe('email', 'alex@example.com')
  f.funnel.markSubmitted()
  f.funnel.leave()
  assert.equal(f.events().includes('form_abandoned'), false)
  assert.deepEqual(f.partials, [])
})

test('a filled honeypot travels with the partial lead so the server can drop it', () => {
  const f = fixture()
  f.funnel.observe('company_website', 'https://bot.example')
  // The field is hidden, so filling it is not a visitor starting the form.
  assert.deepEqual(f.events(), [])
  f.funnel.observe('email', 'bot@example.com')
  f.funnel.leave()
  assert.equal(f.partials[0].company_website, 'https://bot.example')
})
