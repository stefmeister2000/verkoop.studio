import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile(new URL('../src/lib/academy-popup.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { canShowAcademyPopup, ACADEMY_POPUP_DELAY, ACADEMY_POPUP_COOLDOWN } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)
const base = { now: 1_000_000, startedAt: 900_000, scrollProgress: .3, history: {}, blocked: false }

test('invitation needs both reading time and scroll engagement', () => {
  assert.equal(canShowAcademyPopup({ ...base, startedAt: base.now - ACADEMY_POPUP_DELAY + 1 }), false)
  assert.equal(canShowAcademyPopup({ ...base, scrollProgress: .24 }), false)
  assert.equal(canShowAcademyPopup({ ...base, startedAt: base.now - ACADEMY_POPUP_DELAY, scrollProgress: .25 }), true)
})

test('recently shown invitations and captured leads are suppressed', () => {
  assert.equal(canShowAcademyPopup({ ...base, history: { shownAt: base.now - ACADEMY_POPUP_COOLDOWN + 1 } }), false)
  assert.equal(canShowAcademyPopup({ ...base, history: { shownAt: base.now - ACADEMY_POPUP_COOLDOWN } }), true)
  assert.equal(canShowAcademyPopup({ ...base, history: { converted: true } }), false)
  assert.equal(canShowAcademyPopup({ ...base, history: { shownAt: base.now + 1 } }), false)
})

test('hidden pages, active forms, videos and signup areas prevent interruption', () => {
  assert.equal(canShowAcademyPopup({ ...base, blocked: true }), false)
})
