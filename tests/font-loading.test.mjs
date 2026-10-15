import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { runInNewContext } from 'node:vm'

const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
const routes = JSON.parse(await readFile('dist/routes.json', 'utf8'))

test('every production page loads Inter without blocking initial rendering', async () => {
  for (const route of [...routes, '/404']) {
    const html = await readFile(`dist${route === '/' ? '' : route}/index.html`, 'utf8')
    const head = html.split('</head>')[0]
    const fallback = head.match(/<noscript>([\s\S]*?)<\/noscript>/)?.[1]
    assert(fallback, `${route}: font fallback for JavaScript-disabled browsers`)
    assert(fallback.includes(`href="${fontUrl}"`), route)
    assert.match(fallback, /rel="stylesheet"/)
    assert(!fallback.includes('media="print"'), `${route}: fallback must apply to screens`)
    const activeHead = head.replace(/<noscript>[\s\S]*?<\/noscript>/g, '')
    const fontLinks = [...activeHead.matchAll(/<link\b[^>]*>/g)].map(m => m[0]).filter(tag => tag.includes(fontUrl))
    assert.equal(fontLinks.length, 1, route)
    assert.match(fontLinks[0], /rel="stylesheet"/)
    assert.match(fontLinks[0], /media="print"/)
    const handler = fontLinks[0].match(/onload="([^"]+)"/)?.[1]
    assert(handler, `${route}: apply the stylesheet after loading`)
    const element = { media: 'print', onload: handler }
    runInNewContext(`(function () { ${handler} }).call(element)`, { element })
    assert.equal(element.media, 'all', route)
    assert.equal(element.onload, null, route)
    assert.match(head, /rel="preconnect" href="https:\/\/fonts\.googleapis\.com"/)
    assert.match(head, /rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin/)
  }
})
