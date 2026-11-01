import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const text = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8')

test('llms.txt is a plain-text site summary an assistant can read in one request', () => {
  assert.match(text, /^# Verkoop Studio\n/)
  assert.match(text, /^> Verkoop Studio is a studio in Lochristi/m)
  assert.equal(text.split('\n').filter(line => line.startsWith('# ') && !line.startsWith('## ')).length, 1)
  assert.doesNotMatch(text.slice(0, 500), /<html/i)
  assert.ok(Buffer.byteLength(text) > 4000)
  assert.ok(Buffer.byteLength(text) <= 20_000)
  for (const fact of ['€1.500', '€2.500', '€4.000', 'stef@verkoop.studio', 'Lochristi', 'https://verkoop.studio/google-ads', 'https://verkoop.studio/academy', 'https://verkoop.studio/cases/pinacello']) {
    assert.ok(text.includes(fact), fact)
  }
  assert.doesNotMatch(text, /pursuit/i)
  assert.doesNotMatch(text, /gmail\.com/i)
})
