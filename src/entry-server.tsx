/* eslint-disable react/only-export-components -- Build-only entry; never used by Fast Refresh. */
import { renderToString } from 'react-dom/server'
import { articles } from './data/articles'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import { services } from './data/services'
import { cases } from './data/cases'
export { SITE_URL } from './lib/site'
export const routes = ['/', '/blog', ...articles.map(a => `/blog/${a.slug}`), '/cases', '/agency', '/contact', '/funnel-audit', ...services.map(s => `/${s.slug}`), ...cases.map(c => `/cases/${c.slug}`)]
export function render(location: string) {
  return renderToString(<LanguageProvider><App location={location} /></LanguageProvider>)
}

export { faqItems } from './data/faq'
export { articles } from './data/articles'
