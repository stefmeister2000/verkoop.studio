import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { articles as nlArticles, type Article } from '../data/articles'
import english from '../i18n/articles.en.json'
import { useLang } from '../i18n/LanguageContext'
import { SITE_URL } from '../lib/site'
import NotFound from './NotFound'

const dateLabel = (date: string, lang: 'nl' | 'en') => new Date(date + 'T12:00:00Z').toLocaleDateString(lang === 'nl' ? 'nl-BE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Brussels' })
type Translation = Pick<Article, 'title' | 'description' | 'category' | 'sections' | 'links'>
const translations = english as Record<string, Translation>
/** The English version of an article, or the Dutch one (en: false) when it has not been translated yet, e.g. a new automated article. */
function localized(article: Article, lang: 'nl' | 'en'): Article & { en: boolean } {
  const t = lang === 'en' ? translations[article.slug] : undefined
  return t ? { ...article, ...t, en: true } : { ...article, en: false }
}
const COPY = {
  nl: { title: 'Inzichten voor ondernemers in Gent en omgeving', description: 'Praktische artikelen over marketing, Google Ads en websites voor bedrijven in Gent en omgeving. Vanuit Verkoop Studio in Lochristi.', by: 'Door', updated: 'Bijgewerkt op', from: 'Vanuit Lochristi', toc: 'In dit artikel', apply: 'Van lezen naar toepassen', cta: 'Bespreek jouw groeivraag', all: 'Alle artikelen', read: 'Lees het artikel', dutchOnly: '' },
  en: { title: 'Insights for businesses in and around Ghent', description: 'Practical articles on marketing, Google Ads and websites for businesses in and around Ghent. From Verkoop Studio in Lochristi.', by: 'By', updated: 'Updated', from: 'From Lochristi', toc: 'In this article', apply: 'Putting it into practice', cta: 'Talk to us about your growth', all: 'All articles', read: 'Read the article', dutchOnly: 'This article is only available in Dutch for now.' },
}

export default function Blog() {
 const { slug } = useParams()
 const { lang } = useLang(),c = COPY[lang],articles = nlArticles.map(a => localized(a, lang))
 const article = articles.find(a => a.slug === slug)
 if (slug && !article) return <NotFound />
 const title = article?.title ?? c.title
 const description = article?.description ?? c.description
 const pageLang = article ? (article.en ? 'en' : 'nl') : lang
 const path = article ? `/blog/${article.slug}` : '/blog'
 return <div lang={pageLang}>
  <Seo title={title} description={description} path={path} language={pageLang} />
  {article && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:title,description,url:SITE_URL+path,inLanguage:pageLang==='nl'?'nl-BE':'en',datePublished:article.publishedAt,...(article.modifiedAt ? {dateModified:article.modifiedAt} : {}),author:{'@type':'Organization',name:'Verkoop Studio',url:SITE_URL+'/agency'},publisher:{'@id':SITE_URL+'/#organization'},mainEntityOfPage:{'@id':SITE_URL+path+'#webpage'}}).replace(/</g,'\\u003c')}} />}
  <div className="page-hero mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
   <Breadcrumbs items={article ? [{label:'Blog',href:'/blog'},{label:article.category}] : [{label:'Blog'}]} />
   <h1 className="mt-8 font-display leading-tight text-paper">{title}</h1>
   <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone">{description}</p>
   {article ? <>
    <p className="mt-6 text-sm text-mute">{c.by} <Link to="/agency" className="underline">Verkoop Studio</Link> · <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt!, lang)}</time>{article.modifiedAt && <> · {c.updated} <time dateTime={article.modifiedAt}>{dateLabel(article.modifiedAt, lang)}</time></>} · {c.from}</p>
    {lang === 'en' && !article.en && <p className="mt-4 text-sm text-mute" lang="en">{c.dutchOnly}</p>}
    <nav aria-label={c.toc} className="panel article-toc my-10"><p className="font-semibold">{c.toc}</p><ol className="mt-4 space-y-3">{article.sections.map((s,i)=><li key={s.title}><a className="text-bone underline underline-offset-4" href={`#deel-${i+1}`}>{s.title}</a></li>)}</ol></nav>
    <article className="max-w-3xl">{article.sections.map((s,i)=><section key={s.title} id={`deel-${i+1}`} className="scroll-mt-28 py-7"><h2 className="font-display text-2xl text-paper sm:text-3xl">{s.title}</h2>{s.paragraphs.map(p=><p key={p} className="mt-5 text-base leading-8 text-bone">{p}</p>)}{s.checklist && <ul className="mt-6 list-disc space-y-3 pl-5 text-bone">{s.checklist.map(p=><li key={p}>{p}</li>)}</ul>}</section>)}</article>
    <aside className="mt-12 border-t border-line pt-8"><h2 className="font-display text-2xl">{c.apply}</h2><ul className="mt-5 space-y-4">{article.links.map(l=><li key={l.href}>{l.href.startsWith('https://') ? <a className="text-bone underline underline-offset-4" href={l.href}>{l.label}</a> : <Link className="text-bone underline underline-offset-4" to={l.href}>{l.label}</Link>}</li>)}</ul></aside>
    <Link to="/contact" className="button-dark mt-10 inline-block">{c.cta}</Link>
    <Link to="/blog" className="mt-8 block underline">{c.all}</Link>
   </> : <div className="mt-12 grid gap-6">{articles.map(a=><article key={a.slug} className="panel article-card" lang={a.en || lang === 'nl' ? lang : 'nl'}><h2 className="font-display text-2xl"><Link to={`/blog/${a.slug}`}>{a.title}</Link></h2><p className="mt-4 text-base leading-relaxed text-bone">{a.description}</p><Link className="mt-5 inline-block font-semibold text-accent" to={`/blog/${a.slug}`}>{c.read}{lang === 'en' && !a.en ? ' (Dutch)' : ''}</Link></article>)}</div>}
  </div>
 </div>
}
