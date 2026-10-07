import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { validateEditorial } from './check-editorial.mjs'

const routes = JSON.parse(await readFile('dist/routes.json', 'utf8'))
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
const origin = new URL(sitemap.match(/<loc>(.*?)<\/loc>/)[1]).origin
const titles = new Set()

test('every indexable route has crawlable content, unique metadata and valid structured data', async () => {
  for (const route of routes) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8')
    const head = html.split('</head>')[0]
    assert.equal((head.match(/<title>/g) || []).length, 1, route)
    const title = head.match(/<title>(.*?)<\/title>/)[1]
    assert(!titles.has(title), `duplicate title: ${route}`)
    titles.add(title)
    assert(head.includes(`rel="canonical" href="${origin}${route}"`), route)
    assert.match(head, /name="description" content="[^"]{30,}"/)
    assert.match(head, /name="robots" content="index, follow/)
    assert.match(head, /property="og:image"/)
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, route)
    assert.match(html, /<html lang="nl"/)
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph']
    assert(graph.some(item => item['@type'] === 'ProfessionalService' && item.address.addressLocality === 'Lochristi'), route)
    assert(graph.some(item => item['@type'] === 'WebPage' && item.url === origin + route), route)
    assert(sitemap.includes(`<loc>${origin}${route}</loc>`), route)
    for (const [, asset] of html.matchAll(/(?:src|href)="(\/(?:assets|partners)\/[^"?#]+)[^"]*"/g)) {
      await access(`dist${asset}`)
    }
    for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
      const target = href.split(/[?#]/)[0] || '/'
      if (!target.includes('.')) assert(routes.includes(target) || target === '/over-stef', `broken internal link ${href} on ${route}`)
    }
  }
  assert(!sitemap.includes('xpert-funding'))
  assert(!sitemap.includes('/404'))
  const robots = await readFile('dist/robots.txt', 'utf8')
  assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
  await access('dist/social-cover.png')
})

test('production server returns route HTML, permanent redirects and real 404s', async () => {
  const server = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, PORT: '18791', RESEND_API_KEY: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  try {
    await Promise.race([
      once(server.stdout, 'data'),
      once(server, 'exit').then(([code]) => { throw new Error(`Server exited: ${code}`) }),
      new Promise((_, reject) => { const timeout = setTimeout(() => reject(new Error('Server startup timeout')), 10000); timeout.unref() }),
    ])
    const get = path => fetch(`http://127.0.0.1:18791${path}`, { redirect: 'manual' })
    for (const route of routes) {
      const response = await get(route)
      assert.equal(response.status, 200, route)
      const html = await response.text()
      assert(html.includes(`rel="canonical" href="${origin}${route}"`), route)
    }
    for (const path of ['/404', '/nonexistent-page', '/cases/xpert-funding']) {
      const response = await get(path)
      assert.equal(response.status, 404, path)
      assert((await response.text()).includes('noindex, follow'))
    }
    const alias = await get('/over-stef')
    assert.equal(alias.status, 301)
    assert.equal(alias.headers.get('location'), '/agency')
    const slash = await get('/google-ads/?utm_source=test')
    assert.equal(slash.status, 301)
    assert.equal(slash.headers.get('location'), '/google-ads?utm_source=test')
    for (const path of ['/', '/sitemap.xml', '/nonexistent-page']) {
      const response = await get(path)
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
      assert.equal(response.headers.get('x-frame-options'), 'SAMEORIGIN')
      assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin')
      assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'self'/)
      assert.equal(response.headers.get('strict-transport-security'), null)
      assert.equal(response.headers.get('x-powered-by'), null)
    }
    const secure = await fetch('http://127.0.0.1:18791/', { headers: { 'x-forwarded-proto': 'https' } })
    assert.equal(secure.headers.get('strict-transport-security'), 'max-age=31536000')
    const homepage = await (await get('/')).text()
    const asset = homepage.match(/src="(\/assets\/[^"]+)"/)[1]
    assert.match((await get(asset)).headers.get('cache-control'), /max-age=31536000.*immutable/)
    for (const path of ['/robots.txt', '/sitemap.xml', '/favicon.svg', '/social-cover.png']) assert.equal((await get(path)).status, 200, path)
  } finally {
    server.kill('SIGTERM')
    await once(server, 'exit')
  }
})


test('FAQ answers exist in initial HTML and service sections use headings', async () => {
  const { faqItems } = await import('../dist-ssr/entry-server.js')
  const home = await readFile('dist/index.html', 'utf8')
  const details = [...home.matchAll(/<details\b[^>]*name="studio-faq"[^>]*>([\s\S]*?)<\/details>/g)]
  assert.equal(details.length, faqItems.length)
  for (const [index, detail] of details.entries()) {
    assert.match(detail[1], /<summary[\s>]/)
    assert.match(detail[1], /<p[\s>]/)
    const escaped = faqItems[index].answer.nl.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    assert(detail[1].includes(escaped), faqItems[index].question.nl)
  }
  const service = await readFile('dist/google-ads/index.html', 'utf8')
  for (const heading of ['Het probleem', 'Aanpak', 'Opleverpunten']) assert.match(service, new RegExp(`<h2[^>]*>${heading}</h2>`))
  const agency = await readFile('dist/agency/index.html', 'utf8')
  const graph = JSON.parse(agency.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph']
  const person = graph.find(item => item['@type'] === 'Person')
  assert.equal(person.name, 'Stef Keppens')
  assert.equal(graph.find(item => item['@type'] === 'WebPage').mainEntity['@id'], person['@id'])
})

test('articles have crawlable content, authorship, links and sitemap entries', async () => {
  const blogRoutes = routes.filter(route => route.startsWith('/blog/'))
  const { articles } = await import('../dist-ssr/entry-server.js')
  const editorial = JSON.parse(await readFile('src/data/editorial.json', 'utf8'))
  validateEditorial(editorial, { routes })
  assert.equal(blogRoutes.length, articles.length)
  assert(articles.length >= 3, 'Existing articles must not disappear')
  for (const route of blogRoutes) {
    const html = await readFile(`dist${route}/index.html`, 'utf8')
    const graphs = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]))
    const article = graphs.find(g => g['@type'] === 'BlogPosting')
    assert.equal(article.url, origin + route)
    assert.equal(article.author.name, 'verkoop.studio')
    assert.equal(article.inLanguage, 'nl-BE')
    const source = articles.find(a => origin + `/blog/${a.slug}` === article.url)
    assert.equal(article.datePublished, source.publishedAt)
    assert.match(html, new RegExp(`<time dateTime="${source.publishedAt}"`))
    if (source.modifiedAt) { assert.equal(article.dateModified, source.modifiedAt); assert(html.includes('Bijgewerkt op')) }
    assert.match(html, /<article[\s>]/)
    assert.match(html, /href="\/contact"/)
    assert(sitemap.includes(`<loc>${origin}${route}</loc>`))
  }
})

test('hero uses responsive WebP candidates with explicit image dimensions', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const hero = html.match(/<section class="studio-hero"[\s\S]*?<\/section>/)?.[0]
  assert(hero, 'Homepage includes the hero section')
  const tag = hero.match(/<img[^>]*>/)?.[0]
  assert(tag, 'Hero includes an image')
  assert.match(tag, /src="[^"]+\.webp"/)
  assert.match(tag, /width="\d+"/)
  assert.match(tag, /height="\d+"/)
  assert.match(tag, /srcSet="[^"]+640w/)
  assert.match(tag, /sizes="/)
  for (const [,asset] of tag.matchAll(/(\/assets\/[^\s",]+\.webp)/g)) {
    const bytes = await readFile(`dist${asset}`)
    assert(bytes.length < 160000, asset)
  }
})


test('all page images reserve space, headings are sequential and contact links exist', async () => {
  for (const route of routes) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8')
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(tag, /width="\d+"/, route)
      assert.match(tag, /height="\d+"/, route)
      assert.match(tag, /alt="[^"]*"/, route)
    }
    let previous = 0
    for (const [, level] of html.matchAll(/<h([1-6])\b/g)) {
      assert(Number(level) <= previous + 1, `heading level skipped on ${route}`)
      previous = Number(level)
    }
    const emails = [...html.matchAll(/<a\b[^>]*href="mailto:[^"]*"[^>]*>[\s\S]*?<\/a>/g)]
    assert(emails.length > 0, route)
  }
})
