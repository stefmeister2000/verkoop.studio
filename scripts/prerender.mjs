import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { render, routes, SITE_URL } from '../dist-ssr/entry-server.js'
import { inlineHomepageStyles } from './inline-home-styles.mjs'
const template = await readFile('dist/index.html', 'utf8')
const homepageTemplate = (await inlineHomepageStyles(template, href => readFile(`dist${href}`, 'utf8')))
  .replace(/<script\b(?=[^>]*\btype="module")(?=[^>]*\bsrc="\/assets\/[^"/]+\.js")[^>]*>/g,
    tag => tag.replace('<script', '<script fetchpriority="low"'))
const origin = new URL(SITE_URL)
if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/') throw new Error('VITE_SITE_URL must be an HTTP(S) origin')
for (const route of [...routes, '/404']) {
  let markup = render(route)
  const head = []
  markup = markup.replace(/<title>[\s\S]*?<\/title>|<meta\s[^>]*\/>|<link\s[^>]*\/>/g, tag => { head.push(tag); return '' })
  if (route === '/') {
    // Preload the exact picture candidates without adding non-hoistable React
    // nodes to the hydrated tree. Media queries prevent a double download.
    const hero = markup.match(/<section class="studio-hero"[\s\S]*?<\/section>/)?.[0]
    const phone = hero?.match(/<source media="\(max-width: 600px\)" srcSet="([^"]+)"/)?.[1]
    const image = hero?.match(/<img\b[^>]*>/)?.[0]
    const srcSet = image?.match(/srcSet="([^"]+)"/)?.[1]
    const sizes = image?.match(/sizes="([^"]+)"/)?.[1]
    if (!phone || !srcSet || !sizes) throw new Error('Expected responsive homepage hero candidates')
    head.push(`<link rel="preload" as="image" href="${phone}" media="(max-width: 600px)" fetchPriority="high"/>`)
    head.push(`<link rel="preload" as="image" imageSrcSet="${srcSet}" imageSizes="${sizes}" media="(min-width: 600.01px)" fetchPriority="high"/>`)
  }
  const pageTemplate = route === '/' ? homepageTemplate : template
  const html = pageTemplate.replace('<!--seo-head-->', head.join('\n')).replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
  const directory = route === '/' ? 'dist' : `dist${route}`
  await mkdir(directory, { recursive: true })
  await writeFile(`${directory}/index.html`, html)
}
const xml = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${xml(SITE_URL + route)}</loc></url>`).join('\n')}</urlset>`)
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nUser-agent: OAI-SearchBot\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
await writeFile('dist/routes.json', JSON.stringify(routes))
console.log(`Pre-rendered ${routes.length} indexable pages and a 404 page for ${SITE_URL}`)
