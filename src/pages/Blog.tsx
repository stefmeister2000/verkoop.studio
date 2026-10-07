import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import Breadcrumbs from '../components/Breadcrumbs'
import { articles } from '../data/articles'
import { SITE_URL } from '../lib/site'
import NotFound from './NotFound'

const dateLabel = (date: string) => new Date(date + 'T12:00:00Z').toLocaleDateString('nl-BE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Brussels' })

export default function Blog() {
 const { slug } = useParams()
 const article = articles.find(a => a.slug === slug)
 if (slug && !article) return <NotFound />
 const title = article?.title ?? 'Inzichten voor ondernemers in Gent en omgeving'
 const description = article?.description ?? 'Praktische artikelen over marketing, Google Ads en websites voor bedrijven in Gent en omgeving. Vanuit verkoop.studio in Lochristi.'
 const path = article ? `/blog/${article.slug}` : '/blog'
 return <div lang="nl">
  <Seo title={title} description={description} path={path} language="nl" />
  {article && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BlogPosting',headline:title,description,url:SITE_URL+path,inLanguage:'nl-BE',datePublished:article.publishedAt,...(article.modifiedAt ? {dateModified:article.modifiedAt} : {}),author:{'@type':'Organization',name:'verkoop.studio',url:SITE_URL+'/agency'},publisher:{'@id':SITE_URL+'/#organization'},mainEntityOfPage:{'@id':SITE_URL+path+'#webpage'}}).replace(/</g,'\\u003c')}} />}
  <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
   <Breadcrumbs items={article ? [{label:'Blog',href:'/blog'},{label:article.category}] : [{label:'Blog'}]} />
   <p className="mt-8 text-xs uppercase tracking-widest text-mute">{article?.category ?? 'Kennis uit de studio'} · Gent & omgeving</p>
   <h1 className="mt-4 font-display text-4xl leading-tight text-paper sm:text-5xl">{title}</h1>
   <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone">{description}</p>
   {article ? <>
    <p className="mt-6 text-sm text-mute">Door <Link to="/agency" className="underline">verkoop.studio</Link> · <time dateTime={article.publishedAt}>{dateLabel(article.publishedAt!)}</time>{article.modifiedAt && <> · Bijgewerkt op <time dateTime={article.modifiedAt}>{dateLabel(article.modifiedAt)}</time></>} · Vanuit Lochristi</p>
    <nav aria-label="In dit artikel" className="my-10 rounded-2xl border border-line p-6"><p className="font-semibold">In dit artikel</p><ol className="mt-4 space-y-3">{article.sections.map((s,i)=><li key={s.title}><a className="text-bone underline underline-offset-4" href={`#deel-${i+1}`}>{s.title}</a></li>)}</ol></nav>
    <article className="max-w-3xl">{article.sections.map((s,i)=><section key={s.title} id={`deel-${i+1}`} className="scroll-mt-28 py-7"><h2 className="font-display text-2xl text-paper sm:text-3xl">{s.title}</h2>{s.paragraphs.map(p=><p key={p} className="mt-5 text-base leading-8 text-bone">{p}</p>)}{s.checklist && <ul className="mt-6 list-disc space-y-3 pl-5 text-bone">{s.checklist.map(p=><li key={p}>{p}</li>)}</ul>}</section>)}</article>
    <aside className="mt-12 border-t border-line pt-8"><h2 className="font-display text-2xl">Van lezen naar toepassen</h2><ul className="mt-5 space-y-4">{article.links.map(l=><li key={l.href}>{l.href.startsWith('https://') ? <a className="text-bone underline underline-offset-4" href={l.href}>{l.label}</a> : <Link className="text-bone underline underline-offset-4" to={l.href}>{l.label}</Link>}</li>)}</ul></aside>
    <Link to="/contact" className="button-dark mt-10 inline-block">Bespreek jouw groeivraag</Link>
    <Link to="/blog" className="mt-8 block underline">Alle artikelen</Link>
   </> : <div className="mt-12 grid gap-6">{articles.map(a=><article key={a.slug} className="rounded-2xl border border-line p-7"><p className="text-xs uppercase tracking-widest text-mute">{a.category}</p><h2 className="mt-3 font-display text-2xl"><Link to={`/blog/${a.slug}`}>{a.title}</Link></h2><p className="mt-4 leading-relaxed text-bone">{a.description}</p><Link className="mt-5 inline-block underline" to={`/blog/${a.slug}`}>Lees het artikel</Link></article>)}</div>}
  </div>
 </div>
}
