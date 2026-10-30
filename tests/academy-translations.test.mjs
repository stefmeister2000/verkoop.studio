import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const translations = JSON.parse(await readFile(new URL('../src/i18n/academy.en.json', import.meta.url), 'utf8'))
const source = await readFile(new URL('../src/data/academy.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
const { academyModules, academyFaq, academyTests } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

test('every lesson, FAQ and test explanation has English copy', () => {
  const shared = new Set(['TRACKING', 'Tracking & data', 'ROAS, MER & LTV', 'ROAS & LTV', 'CREATIVES', 'Creatives', 'Retargeting'])
  const copy = [
    ...academyModules.flatMap(({ tag, shortTitle, title, summary, points, outcome }) => [tag, shortTitle, title, summary, ...points, outcome]),
    ...academyFaq.flatMap(({ question, answer }) => [question, answer]),
    ...academyTests.flatMap(({ name, status, verdict, decision }) => [name, status, verdict, decision]),
  ]
  for (const text of copy) assert.ok(shared.has(text) || translations[text]?.trim(), `Missing English translation: ${text}`)
})

test('all explicit translation keys resolve and Dutch remains in prerendered HTML', async () => {
  for (const filename of ['../src/pages/Academy.tsx', '../src/components/AcademySignup.tsx', '../src/components/AcademyCapturePopup.tsx', '../src/components/AcademyInfoSignup.tsx']) {
    const source = await readFile(new URL(filename, import.meta.url), 'utf8')
    const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    function walk(node) {
      if (ts.isCallExpression(node) && node.expression.getText(ast) === 't' && ts.isStringLiteral(node.arguments[0])) {
        assert.ok(translations[node.arguments[0].text], `Missing UI translation: ${node.arguments[0].text}`)
      }
      ts.forEachChild(node, walk)
    }
    walk(ast)
  }
  const html = await readFile(new URL('../dist/academy/index.html', import.meta.url), 'utf8')
  assert.match(html, /Start en schaal je webshop/)
  assert.match(html, /aria-label="English"/)
  assert.match(html, /href="https:\/\/verkoop\.studio\/"[^>]*>Wil je dat wij jouw ads overnemen\?/)
})
