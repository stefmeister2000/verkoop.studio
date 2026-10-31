import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('homepage connects the visible brand, search title and a single website identity', async () => {
  const html = await readFile('dist/index.html', 'utf8')
  const title = html.match(/<title>(.*?)<\/title>/)[1]
  assert.match(title, /^Verkoop Studio \| .+/)
  assert.match(html, /<p class="hero-description">Verkoop Studio helpt je met online marketing en websites\./)
  assert.match(html, /property="og:site_name" content="Verkoop Studio"/)
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph']
  const websites = graph.filter(node => node['@type'] === 'WebSite')
  assert.equal(websites.length, 1, 'Keep one canonical website identity')
  const website = websites[0]
  const organization = graph.find(node => node['@id'] === website.publisher['@id'])
  for (const node of [website, organization]) {
    assert.equal(node.name, 'Verkoop Studio')
    assert.equal(node.alternateName, 'verkoop.studio')
    assert.equal(node.url, html.match(/rel="canonical" href="([^"]+)"/)[1])
  }
  assert.equal(graph.find(node => node['@type'] === 'WebPage').name, title)
})

test('service titles retain their topic before the consistent brand name', async () => {
  for (const route of ['google-ads', 'websites']) {
    const html = await readFile(`dist/${route}/index.html`, 'utf8')
    assert.match(html, /<title>[^<|]+ \| Verkoop Studio<\/title>/)
    assert.match(html, /name="robots" content="index, follow/)
  }
})
