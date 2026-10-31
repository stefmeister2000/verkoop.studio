import { seoMetadata } from '../data/seoMetadata'
import { useLang } from '../i18n/LanguageContext'
import { SITE_NAME, SITE_ALTERNATE_NAME, SITE_URL, socialImage } from '../lib/site'
import { services } from '../data/services'

interface SeoProps { title: string; description: string; path: string; noindex?: boolean; language?: 'nl' | 'en' }
export default function Seo({ title, description, path, noindex = false, language }: SeoProps) {
  const { lang: selectedLang } = useLang()
  const lang = language ?? selectedLang
  const url = `${SITE_URL}${path === '/' ? '/' : path}`
  const metadata = seoMetadata[path]?.[lang]
  const pageTitle = metadata?.title ?? title
  const fullTitle = path === '/' ? `${SITE_NAME} | ${pageTitle}` : `${pageTitle} | ${SITE_NAME}`
  const metaDescription = metadata?.description ?? description
  const service = services.find(s => `/${s.slug}` === path)
  const organization = {
    '@type': 'ProfessionalService', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, alternateName: SITE_ALTERNATE_NAME,
    url: `${SITE_URL}/`, logo: `${SITE_URL}/favicon.svg`, image: socialImage,
    email: 'stef@verkoop.studio',
    description: 'Google Ads, Meta Ads, e-mailmarketing, data-analyse, websites en software vanuit Lochristi.',
  }
  const person = {
    '@type': 'Person', '@id': `${SITE_URL}/#stef-keppens`, name: 'Stef Keppens',
    url: `${SITE_URL}/agency`, jobTitle: 'Growth & Strategy',
    worksFor: { '@id': organization['@id'] },
  }
  const graph = [organization, person,
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, alternateName: SITE_ALTERNATE_NAME, publisher: { '@id': organization['@id'] } },
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: fullTitle, description: metaDescription, inLanguage: lang === 'nl' ? 'nl-BE' : 'en', isPartOf: { '@id': `${SITE_URL}/#website` }, about: { '@id': organization['@id'] }, ...(path === '/agency' ? { mainEntity: { '@id': person['@id'] } } : {}) },
    ...(service ? [{ '@type': 'Service', name: service.title[lang], description: service.summary[lang], url, provider: { '@id': organization['@id'] }, serviceType: service.title[lang] }] : []),
    ...(path !== '/' && !noindex ? [{ '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      ...(path.startsWith('/cases/') ? [{ '@type': 'ListItem', position: 2, name: 'Cases', item: `${SITE_URL}/cases` }] : []),
      { '@type': 'ListItem', position: path.startsWith('/cases/') ? 3 : 2, name: title, item: url },
    ] }] : []),
  ]
  return <>
    <title>{fullTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'} />
    <link rel="canonical" href={url} />
    <meta property="og:site_name" content={SITE_NAME} />
    <meta property="og:title" content={fullTitle} />
    <meta property="og:description" content={metaDescription} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={url} />
    <meta property="og:locale" content={lang === 'nl' ? 'nl_BE' : 'en_GB'} />
    <meta property="og:image" content={socialImage} />
    <meta property="og:image:alt" content="verkoop.studio. Meer aanvragen. Meer verkoop." />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={fullTitle} />
    <meta name="twitter:description" content={metaDescription} />
    <meta name="twitter:image" content={socialImage} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c') }} />
  </>
}
