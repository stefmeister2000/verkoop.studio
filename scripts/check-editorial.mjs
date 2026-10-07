import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const legacyDates = {
  'marketingbureau-gent-kiezen': '2026-10-02',
  'google-ads-gent-budget-aanvragen': '2026-10-02',
  'website-gent-meer-aanvragen': '2026-10-02',
}
const origin = 'https://verkoop.studio'
const isoDay = now => now.toLocaleDateString('en-CA', { timeZone: 'Europe/Brussels' })
const object = value => !!value && typeof value === 'object' && !Array.isArray(value)
function keys(value, allowed, label) {
  assert(object(value), `${label}: object vereist`)
  assert(Object.keys(value).every(k => allowed.includes(k)), `${label}: onbekend veld`)
}
function text(value, label, min = 1, max = 6000) {
  assert(typeof value === 'string' && value.trim().length >= min && value.length <= max, `${label}: ongeldige tekstlengte`)
  assert(!/<\/?[a-z!][^>]*>/i.test(value), `${label}: HTML is niet toegestaan`)
  assert(!/\[(?:TODO|contactpersoon|bron|voeg .*toe)\]|\b(?:lorem ipsum|TBD)\b/i.test(value), `${label}: onafgewerkt concept`)
  assert(!/(?:€|\$|£)\s*\d|\d[\d., ]*\s*(?:euro|EUR|€)|\b(?:vanaf|voor slechts)\s*\d/i.test(value), `${label}: prijsbedragen vereisen menselijke goedkeuring`)
}
function date(value, label, today) {
  assert(typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value), `${label}: datum vereist`)
  const timestamp = Date.parse(value + 'T12:00:00Z')
  assert(Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === value && value <= today, `${label}: ongeldige of toekomstige datum`)
}
export function validateEditorial(document, { previous, routes, now = new Date() } = {}) {
  const today = isoDay(now)
  keys(document, ['version', 'articles', 'metadata'], 'editorial')
  assert.equal(document.version, 1, 'Onbekende contentversie')
  assert(Array.isArray(document.articles), 'articles moet een lijst zijn')
  assert(document.articles.length <= 200, 'Controleer de omvang van het contentarchief')
  keys(document.metadata, Object.keys(document.metadata || {}), 'metadata')
  const slugs = new Set(); const titles = new Set()
  const previousArticles = new Map((previous?.articles || []).map(a => [a.slug, a]))
  const knownRoutes = routes ? new Set([...routes, ...document.articles.map(a => `/blog/${a.slug}`)]) : null
  for (const article of document.articles) {
    keys(article, ['slug','title','description','category','publishedAt','modifiedAt','sections','links'], 'article')
    assert(typeof article.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) && article.slug.length <= 100, 'Ongeldige slug')
    assert(!slugs.has(article.slug), 'Dubbele artikel-URL'); slugs.add(article.slug)
    text(article.title, 'title', 15, 160); text(article.description, 'description', 40, 300); text(article.category, 'category', 2, 80)
    assert(!titles.has(article.title.toLowerCase()), 'Dubbele artikeltitel'); titles.add(article.title.toLowerCase())
    date(article.publishedAt, 'publishedAt', today)
    const previousDate = previousArticles.get(article.slug)?.publishedAt || legacyDates[article.slug]
    if (previousDate) assert.equal(article.publishedAt, previousDate, 'Bestaande publicatiedatum mag niet veranderen')
    else if (previous) assert.equal(article.publishedAt, today, 'Nieuwe publicatie moet de werkelijke publicatiedag gebruiken')
    if (article.modifiedAt) { date(article.modifiedAt, 'modifiedAt', today); assert(article.modifiedAt >= article.publishedAt, 'Wijziging voor publicatie') }
    assert(Array.isArray(article.sections) && article.sections.length >= 3 && article.sections.length <= 16, 'Artikel vereist 3–16 inhoudelijke secties')
    const headings = new Set()
    for (const section of article.sections) {
      keys(section, ['title','paragraphs','checklist'], 'section'); text(section.title, 'section title', 5, 180)
      assert(!headings.has(section.title), 'Dubbele sectietitel'); headings.add(section.title)
      assert(Array.isArray(section.paragraphs) && section.paragraphs.length >= 1 && section.paragraphs.length <= 12, 'Sectie vereist alinea’s')
      section.paragraphs.forEach(p => text(p, 'paragraph', 20))
      if (section.checklist) { assert(Array.isArray(section.checklist) && section.checklist.length <= 15); section.checklist.forEach(p => text(p, 'checklist', 3, 500)) }
    }
    const words = article.sections.flatMap(s => s.paragraphs).join(' ').split(/\s+/).length
    assert(words >= 200 && words <= 3000, 'Controleer inhoudelijke diepgang en lengte (200–3000 woorden)')
    assert(Array.isArray(article.links) && article.links.length >= 2 && article.links.length <= 20, 'Artikel vereist 2–20 relevante links')
    let internal = 0
    for (const link of article.links) {
      keys(link, ['href','label'], 'link'); text(link.label, 'linklabel', 3, 200)
      assert(typeof link.href === 'string' && (/^\/(?!\/)/.test(link.href) || link.href.startsWith('https://')), 'Alleen relatieve of HTTPS-links toegestaan')
      const url = new URL(link.href, origin)
      assert(!url.username && !url.password && url.protocol === 'https:', 'Ongeldige link')
      if (url.origin === origin) { internal++; assert(!/^\/(api|admin)(\/|$)/.test(url.pathname), 'Geen applicatie-endpoints linken'); if (knownRoutes) assert(knownRoutes.has(url.pathname), `Interne link bestaat niet: ${url.pathname}`) }
    }
    assert(internal >= 2, 'Minimaal twee relevante interne links vereist')
  }
  for (const [route, metadata] of Object.entries(document.metadata)) {
    assert(/^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/.test(route), 'Ongeldige metadata-URL')
    if (knownRoutes) assert(knownRoutes.has(route), `Metadata voor onbekende pagina: ${route}`)
    keys(metadata, ['title','description'], 'metadata entry')
    assert(Object.keys(metadata).length > 0, 'Lege metadata')
    if (metadata.title !== undefined) text(metadata.title, 'SEO title', 8, 100)
    if (metadata.description !== undefined) text(metadata.description, 'SEO description', 40, 200)
  }
  const changes = document.articles.filter(a => JSON.stringify(a) !== JSON.stringify(previousArticles.get(a.slug)))
  if (previous) {
    for (const old of previous.articles) assert(slugs.has(old.slug), 'Artikelen verwijderen/hernoemen vereist goedkeuring')
    assert(changes.length <= 1, 'Maximaal één artikelwijziging per publicatie')
    for (const changed of changes) if (previousArticles.has(changed.slug) || legacyDates[changed.slug]) assert.equal(changed.modifiedAt, today, 'Een inhoudelijke update vereist de werkelijke wijzigingsdatum')
    const metadataChanges = new Set([...Object.keys(previous.metadata), ...Object.keys(document.metadata)])
    assert([...metadataChanges].filter(key => JSON.stringify(previous.metadata[key]) !== JSON.stringify(document.metadata[key])).length <= 2, 'Maximaal twee metadatawijzigingen per publicatie')
    const weekStart = new Date(today + 'T12:00:00Z'); weekStart.setUTCDate(weekStart.getUTCDate() - 6)
    const newThisWeek = document.articles.filter(a => !legacyDates[a.slug] && a.publishedAt >= weekStart.toISOString().slice(0, 10)).length
    assert(newThisWeek <= 2, 'Maximaal twee nieuwe blogs in zeven dagen')
  }
  return { status: 'ok', articles: document.articles.length, changedArticles: previous ? changes.map(a => a.slug) : null, metadata: Object.keys(document.metadata).length }
}

export function validatePublicationReport(report, now = new Date()) {
  assert.equal(report.property, 'sc-domain:verkoop.studio', 'Verkeerde Search Console-property')
  assert.equal(report.origin, origin, 'Verkeerde website')
  assert.equal(report.version, 2, 'Onbekend rapportformaat')
  const age = now.getTime() - Date.parse(report.generatedAt)
  assert(Number.isFinite(age) && age >= 0 && age <= 24 * 3600000, 'Eerst een actuele audit uitvoeren')
  assert(['gsc','crawl','speed','indexing','sitemaps'].every(k => report[k]?.status === 'ok'), 'Onvolledige audit: geen automatische publicatie')
  assert(!report.findings?.some(f => f.severity === 'critical'), 'Kritiek probleem: eerst menselijke controle')
}

export function validateChangedPaths(paths) {
  assert(Array.isArray(paths) && paths.length === 1 && paths[0] === 'src/data/editorial.json', 'Automatische publicatie mag uitsluitend src/data/editorial.json wijzigen')
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = fileURLToPath(new URL('../', import.meta.url))
    const arg = name => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null }
    const read = async file => JSON.parse(await readFile(file, 'utf8'))
    const previous = arg('--base') ? await read(arg('--base')) : undefined
    if (process.argv.includes('--publish-check')) {
      assert(previous && arg('--report') && arg('--changed-files'), '--publish-check vereist --base, --report en --changed-files')
      validatePublicationReport(await read(arg('--report')))
      validateChangedPaths(await read(arg('--changed-files')))
    }
    const result = validateEditorial(await read(path.join(root, 'src/data/editorial.json')), { previous, routes: await read(path.join(root, 'dist/routes.json')) })
    console.log(JSON.stringify({ ...result, published: false, note: 'Inhoud gecontroleerd; build, SEO-tests en publicatie zijn aparte stappen.' }))
  } catch (error) { console.error('[editorial] ' + (error.code === 'ERR_ASSERTION' ? error.message.split('\n')[0] : 'Controle mislukt; controleer JSON, paden en build.')); process.exitCode = 1 }
}
