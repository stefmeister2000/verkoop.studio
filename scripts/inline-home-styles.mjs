import { gzipSync } from 'node:zlib'

// The homepage can paint without a separate render-blocking CSS request.
// Reuse the complete compiled stylesheet so navigation and responsive states
// keep the same rules; other entry pages retain their cacheable stylesheet.
export async function inlineHomepageStyles(template, readAsset) {
  const links = [...template.matchAll(/<link\b(?=[^>]*\brel="stylesheet")(?=[^>]*\bhref="(\/assets\/[^"/]+\.css)")[^>]*>/g)]
  if (!links.length) throw new Error('Expected a built homepage stylesheet')
  let result = template
  let compressedBytes = 0
  for (const [tag, href] of links) {
    const css = await readAsset(href)
    // Fail the build instead of silently changing asset resolution or HTML.
    if (/<\/style|@import\b/i.test(css)) throw new Error(`Unsafe inline stylesheet: ${href}`)
    for (const [, url] of css.matchAll(/url\(\s*["']?([^"')\s]+)/gi)) {
      if (!/^(?:\/|#|data:|https?:)/i.test(url)) throw new Error(`Relative CSS URL needs rebasing: ${url}`)
    }
    compressedBytes += gzipSync(css).length
    if (compressedBytes > 32768) throw new Error('Homepage inline CSS exceeds its 32 KiB compressed budget')
    result = result.replace(tag, () => `<style data-home-styles="${href}">${css}</style>`)
  }
  return result
}
