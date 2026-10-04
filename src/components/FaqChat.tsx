import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../i18n/LanguageContext'
import { findChatAnswers, getChatArticles, type ChatArticle } from '../lib/chatKnowledge'
import './FaqChat.css'

type Message = { question: string; answers: ChatArticle[] }
export default function FaqChat() {
  const { lang } = useLang()
  const nl = lang === 'nl'
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(false)
  const [viewport, setViewport] = useState({ height: 0, top: 0 })
  const panel = useRef<HTMLElement>(null)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const launcher = useRef<HTMLButtonElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const previousLang = useRef(lang)
  const articles = getChatArticles(lang)
  const lastAnswer = messages.at(-1)?.answers[0]
  const close = () => { setOpen(false); launcher.current?.focus() }
  useEffect(() => {
    const media = window.matchMedia('(max-width: 600px)')
    const update = () => { setMobile(media.matches); setViewport({ height: window.visualViewport?.height ?? window.innerHeight, top: window.visualViewport?.offsetTop ?? 0 }) }
    update()
    media.addEventListener('change', update)
    window.visualViewport?.addEventListener('resize', update)
    window.visualViewport?.addEventListener('scroll', update)
    return () => { media.removeEventListener('change', update); window.visualViewport?.removeEventListener('resize', update); window.visualViewport?.removeEventListener('scroll', update) }
  }, [])
  useEffect(() => {
    if (!open) return
    if (!mobile) { input.current?.focus(); return }
    panel.current?.focus({ preventScroll: true })
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open, mobile])
  useEffect(() => { if (previousLang.current !== lang) { setMessages([]); setQuery(''); previousLang.current = lang } }, [lang])
  useEffect(() => { if (log.current) log.current.scrollTop = messages.length ? log.current.scrollHeight : 0 }, [messages, open])
  const add = (question: string, answers: ChatArticle[]) => { setMessages(previous => [...previous.slice(-19), { question, answers }]); setQuery(''); if (!mobile) input.current?.focus() }
  function choose(id: string) { const article = articles.find(a => a.id === id); if (article) add(article.title, [article]) }
  function send() { if (query.trim()) add(query.trim(), findChatAnswers(query.trim(), lang, lastAnswer?.id)) }
  return <div className={`faq-chat ${open ? 'has-open-chat' : ''}`} style={{ '--chat-viewport-height': `${viewport.height}px`, '--chat-viewport-top': `${viewport.top}px` } as CSSProperties} data-clarity-mask="true">
    {open && <section ref={panel} tabIndex={-1} className="faq-chat-panel" role="dialog" aria-modal={mobile} aria-labelledby="faq-chat-title" onKeyDown={event => { if (mobile && event.key === 'Tab') {
      const items = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input')
      if (items?.length) {
        const first = items[0], last = items[items.length - 1]
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    } if (event.key === 'Escape') { event.stopPropagation(); close() } }}>
      <header className="chat-header"><div className="chat-identity"><h2 id="faq-chat-title">Studio assistant<span>.</span></h2><p>{nl ? 'Jouw wegwijzer bij verkoop.studio' : 'Your guide to verkoop.studio'}</p></div><button type="button" className="chat-icon-button" onClick={close} aria-label={nl ? 'Chat sluiten' : 'Close chat'}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg></button></header>
      <div className="chat-context"><span>{nl ? 'KENNIS VAN ONZE STUDIO' : 'STUDIO KNOWLEDGE'}</span><button type="button" onClick={() => { setMessages([]); setQuery(''); if (!mobile) input.current?.focus() }} disabled={!messages.length}>{nl ? 'Nieuw gesprek' : 'New conversation'} ↺</button></div>
      <div className="faq-chat-log" ref={log} role="log" aria-live="polite" aria-relevant="additions">
        {!messages.length && <div className="chat-welcome"><p className="chat-eyebrow">LET’S TALK GROWTH</p><h3>{nl ? 'Grote plannen?' : 'Big plans?'}<br /><span>{nl ? 'Begin met een vraag.' : 'Start with a question.'}</span></h3><p>{nl ? 'Ontdek onze diensten, prijzen en projecten. Ik zoek het antwoord in de informatie van onze studio.' : 'Explore our services, pricing and projects. I find answers in our studio information.'}</p><div className="chat-starters">{[['pricing',nl ? 'Wat past bij mijn budget?' : 'What fits my budget?'],['service-websites',nl ? 'Een website die verkoopt' : 'A website that sells'],['cases',nl ? 'Laat jullie werk zien' : 'Show me your work'],['service-ai-automatiseringen',nl ? 'Slimmer werken met AI' : 'Work smarter with AI']].map(([id,label]) => <button type="button" key={id} onClick={() => choose(id)}>{label}</button>)}</div></div>}
        {messages.map((message, index) => <div key={index} className="faq-chat-exchange"><p className="faq-chat-question">{message.question}</p><div className="chat-answer-label">STUDIO ASSISTANT</div>{message.answers.length ? message.answers.map(answer => <article key={answer.id} className="faq-chat-answer"><h3>{answer.title}</h3><p>{answer.text}</p>{answer.bullets && <ul>{answer.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}<Link className="chat-source" to={answer.href} onClick={close}>{nl ? 'Bekijk op de website' : 'View on the website'} <span aria-hidden="true">↗</span></Link></article>) : <div className="faq-chat-answer"><h3>{nl ? 'Dat bespreken we graag persoonlijk.' : 'Let’s discuss that personally.'}</h3><p>{nl ? 'Ik vind hiervoor geen betrouwbaar antwoord in onze website-informatie. Ons team kan je verder helpen.' : 'I can’t find a reliable answer in our website information. Our team can help you further.'}</p><Link className="chat-source" to="/contact" onClick={close}>{nl ? 'Stel je vraag aan ons team' : 'Ask our team'} ↗</Link></div>}</div>)}
        {!!messages.length && <div className="chat-followups">{(lastAnswer?.followups ?? ['pricing', 'cases', 'start']).map(id => { const a = articles.find(item => item.id === id); return a && <button key={id} type="button" onClick={() => choose(id)}>{a.title}<span aria-hidden="true"> ↗</span></button> })}</div>}
      </div>
      <form className="chat-composer" onSubmit={event => { event.preventDefault(); send() }}><label className="sr-only" htmlFor="faq-chat-query">{nl ? 'Je vraag' : 'Your question'}</label><input id="faq-chat-query" ref={input} value={query} onChange={event => setQuery(event.target.value)} placeholder={nl ? 'Waar wil je meer over weten?' : 'What would you like to know?'} maxLength={400} autoComplete="off" data-clarity-mask="true" /><button type="submit" disabled={!query.trim()} aria-label={nl ? 'Vraag versturen' : 'Send question'}>↑</button></form>
      <footer><span>{nl ? 'Antwoorden uit onze website' : 'Answers from our website'}</span><Link to="/contact" onClick={close}>{nl ? 'Praat met ons' : 'Talk to us'} ↗</Link></footer>
    </section>}
    <button type="button" className={`faq-chat-launcher ${open ? 'is-open' : ''}`} ref={launcher} onClick={() => open ? close() : setOpen(true)} aria-expanded={open} aria-label={nl ? (open ? 'FAQ-chat sluiten' : 'FAQ-chat openen') : (open ? 'Close FAQ chat' : 'Open FAQ chat')}><svg className="chat-launcher-symbol" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-4 3v-11a8 8 0 0 1 8-8h3a8 8 0 0 1 8 8Z" transform="translate(1 -1)" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 9h8M8 13h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg><span>{nl ? 'Vraag het de studio' : 'Ask the studio'}</span></button>
  </div>
}
