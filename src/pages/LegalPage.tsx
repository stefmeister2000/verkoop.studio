import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/Breadcrumbs'
import Seo from '../components/Seo'
import { legalDocuments, type LegalSlug } from '../data/legal'
import { useLang } from '../i18n/LanguageContext'

export default function LegalPage({ slug }: { slug: LegalSlug }) {
  const { lang } = useLang()
  const page = legalDocuments[slug]
  const other = slug === 'privacy' ? legalDocuments.terms : legalDocuments.privacy

  return (
    <div className="page-hero mx-auto max-w-3xl px-5 py-16 sm:px-8 sm:py-24">
      <Seo title={page.title[lang]} description={page.description[lang]} path={page.path} />
      <Breadcrumbs items={[{ label: page.title[lang] }]} />
      <h1 className="mt-8 font-display leading-tight text-paper">{page.title[lang]}</h1>
      <p className="mt-4 text-sm text-mute">{page.updated[lang]}</p>
      <p className="panel mt-8 px-6 py-5 text-base leading-7 text-bone">{page.notice[lang]}</p>
      <article>
        {page.sections.map((section) => (
          <section key={section.title.nl} className="border-b border-line py-8">
            <h2 className="font-display text-2xl text-paper">{section.title[lang]}</h2>
            {section.paragraphs[lang].map((paragraph) => (
              <p key={paragraph} className="mt-4 text-base leading-8 text-bone">{paragraph}</p>
            ))}
          </section>
        ))}
      </article>
      <p className="mt-8 text-sm">
        <Link className="text-mute underline underline-offset-4 transition hover:text-paper" to={other.path}>
          {other.title[lang]}
        </Link>
      </p>
    </div>
  )
}
