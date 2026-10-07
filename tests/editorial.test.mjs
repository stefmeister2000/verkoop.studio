import test from 'node:test'
import assert from 'node:assert/strict'
import { validateEditorial, validatePublicationReport, validateChangedPaths } from '../scripts/check-editorial.mjs'

const source = { version: 1, metadata: {}, articles: [{ slug: 'website-gent-meer-aanvragen', title: 'Een praktische websitebriefing voor ondernemers', description: 'Een controleerbare briefing over informatie, inhoud en het testen van de belangrijkste bezoekersroute.', category: 'Websites', publishedAt: '2026-10-02', modifiedAt: '2026-10-07', sections: [1, 2, 3].map(i => ({ title: `Praktische stap nummer ${i}`, paragraphs: [('Bepaal welke informatie de bezoeker nodig heeft en welke vervolgstap bij de pagina hoort. Controleer de werking op een telefoon en schrijf de bevindingen op. ').repeat(3)] })), links: [{ href: '/websites', label: 'Onze websiteaanpak' }, { href: '/contact', label: 'Bespreek je vraag' }] }] }
const today = new Date('2026-10-07T14:00:00Z')
const empty = () => ({ version: 1, articles: [], metadata: {} })
const fixture = () => structuredClone(source)
const opts = { previous: empty(), now: today }
test('current article enrichment has valid data and preserves the publication date', () => assert.equal(validateEditorial(fixture(), opts).status, 'ok'))
test('unsafe links, embedded HTML and unfinished templates are blocked', () => {
  for (const href of ['javascript:alert(1)', '//evil.test/', 'https://user:pass@evil.test/', '/api/lead']) { const doc = fixture(); doc.articles[0].links[0].href = href; assert.throws(() => validateEditorial(doc, opts)) }
  for (const text of ['<script>alert(1)</script>', '[TODO]', 'Wij leveren dit vanaf €500.']) { const doc = fixture(); doc.articles[0].sections[0].paragraphs[0] = text; assert.throws(() => validateEditorial(doc, opts)) }
})
test('dates cannot be falsified and slug duplication is rejected', () => {
  for (const value of ['2026-02-30', '2026-10-08', 'not-a-date', '2026-10-06']) { const doc = fixture(); doc.articles[0].publishedAt = value; assert.throws(() => validateEditorial(doc, opts)) }
  const doc = fixture(); doc.articles.push(structuredClone(doc.articles[0])); assert.throws(() => validateEditorial(doc, opts))
})
test('deletion, code-like fields and excessive changes require review', () => {
  assert.throws(() => validateEditorial(empty(), { previous: fixture(), now: today }), /verwijderen/)
  const doc = fixture(); doc.articles[0].script = 'danger'; assert.throws(() => validateEditorial(doc, opts), /onbekend veld/)
  const batch = fixture(); batch.articles.push({ ...structuredClone(batch.articles[0]), slug: 'second-article', title: 'Een tweede relevante titel', publishedAt: '2026-10-07' }); assert.throws(() => validateEditorial(batch, opts), /Maximaal één/)
})
test('new articles require real publication dates and a maximum of two per week', () => {
  const doc = fixture(); const old = empty()
  doc.articles = Array.from({ length: 3 }, (_, i) => ({ ...structuredClone(doc.articles[0]), slug: `new-${i}`, title: `Een nieuw artikel nummer ${i}`, publishedAt: `2026-10-0${5+i}` }))
  old.articles = structuredClone(doc.articles.slice(0, 2))
  assert.throws(() => validateEditorial(doc, { previous: old, now: today }), /twee nieuwe blogs/)
  const wrongDate = fixture(); wrongDate.articles[0].slug = 'new-blog'; assert.throws(() => validateEditorial(wrongDate, opts), /werkelijke publicatiedag/)
})
test('metadata must refer to real routes and contain only title and description', () => {
  const doc = empty(); doc.metadata['/websites'] = { title: 'Websites voor ondernemers' }
  assert.equal(validateEditorial(doc, { routes: ['/websites'], now: today }).status, 'ok')
  assert.throws(() => validateEditorial(doc, { routes: ['/'], now: today }), /onbekende pagina/)
  doc.metadata['/websites'].canonical = 'https://evil.test'; assert.throws(() => validateEditorial(doc), /onbekend veld/)
})
test('publishing gate requires fresh complete data for the correct site', () => {
  const r = { version: 2, property: 'sc-domain:verkoop.studio', origin: 'https://verkoop.studio', generatedAt: '2026-10-07T12:00:00Z', findings: [], ...Object.fromEntries(['gsc','crawl','speed','indexing','sitemaps'].map(k => [k, { status: 'ok' }])) }
  assert.doesNotThrow(() => validatePublicationReport(r, today))
  for (const bad of [{ ...r, property: 'sc-domain:other.be' }, { ...r, generatedAt: '2026-10-01T12:00:00Z' }, { ...r, gsc: { status: 'error' } }, { ...r, findings: [{ severity: 'critical' }] }]) assert.throws(() => validatePublicationReport(bad, today))
})

test('automatic publishing accepts only the data file, never pricing, forms or code', () => {
  assert.doesNotThrow(() => validateChangedPaths(['src/data/editorial.json']))
  for (const paths of [[], ['src/data/pricing.ts'], ['src/data/editorial.json', 'server.js'], ['src/pages/Contact.tsx'], ['src/data/editorial.json', 'scripts/check-editorial.mjs']]) assert.throws(() => validateChangedPaths(paths))
})
