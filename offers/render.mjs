#!/usr/bin/env node
/**
 * verkoop.studio offerte renderer.
 *
 * Copy offers/offerte.template.json, point clientId at a file in offers/clients/,
 * fill the copy and the amounts, then:
 *
 *   node offers/render.mjs offers/offerte.template.json
 *   node offers/render.mjs path/to/offerte.json path/to/out.pdf
 *
 * status "template" or "draft" prints a chip. status "final" does not.
 * An empty amount stays blank. Totals appear once every line in that group has a price.
 * Issuer details live in offers/issuer.json. verkoop.studio factureert via TanguyDeBee BV.
 */

import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const months = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

const recurrenceOrder = ['once', 'month', 'year']
const recurrenceName = { once: 'Eenmalig', month: 'Per maand', year: 'Per jaar' }
const recurrenceSuffix = { once: '', month: ' / maand', year: ' / jaar' }

const eur = new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR' })

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]))
}

function formatDate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${months[month - 1]} ${year}`
}

function addDays(iso, days) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function money(amount) {
  if (amount === null || amount === undefined || amount === '') return ''
  return eur.format(amount).replace(/\s/g, ' ')
}

function partyBlock(title, rows) {
  const body = rows.filter(Boolean).map((row) => {
    if (typeof row === 'string') return `<p>${esc(row)}</p>`
    return `<p class="${row.className || ''}">${esc(row.text)}</p>`
  }).join('')
  return `<section class="card"><p class="eyebrow">${esc(title)}</p>${body}</section>`
}

function renderHtml({ offer, client, issuer, fontHref }) {
  const validUntil = addDays(offer.date, offer.validDays ?? 30)
  const statusLabels = { draft: 'Concept', example: 'Voorbeeld', template: 'Sjabloon' }
  const statusChip = offer.status === 'final'
    ? ''
    : `<span class="chip">${statusLabels[offer.status] || 'Sjabloon'}</span>`

  const locality = [issuer.postalCode, issuer.city].filter(Boolean).join(' ')
  const issuerRows = [
    { text: issuer.brand, className: 'name' },
    issuer.legalName,
    issuer.contactName,
    issuer.street,
    [locality, issuer.country].filter(Boolean).join(', '),
    issuer.vat ? `BTW ${issuer.vat}` : '',
    { text: issuer.email, className: 'gap' },
    issuer.phone,
    issuer.website,
  ]

  const clientRows = [
    { text: client.legalName, className: 'name' },
    client.tradeName && client.tradeName !== client.legalName ? client.tradeName : '',
    client.vat ? `BTW ${client.vat}` : '',
    client.seat ? { text: client.seat.label, className: 'gap label' } : '',
    ...(client.seat?.lines || []),
    client.site ? { text: client.site.label, className: 'gap label' } : '',
    ...(client.site?.lines || []),
    client.email ? { text: client.email, className: 'gap' } : '',
    client.phone,
    client.website,
  ]

  const steps = (offer.approach || []).map((step, index) => `
    <article class="step">
      <span class="num">${String(index + 1).padStart(2, '0')}</span>
      <div>
        <h3>${esc(step.title)}</h3>
        <p>${esc(step.body)}</p>
      </div>
    </article>`).join('')

  const principles = (offer.principles || []).map((item) => `<li>${esc(item)}</li>`).join('')

  const groups = new Map(recurrenceOrder.map((key) => [key, []]))
  for (const line of offer.lines || []) {
    const key = recurrenceOrder.includes(line.recurrence) ? line.recurrence : 'once'
    groups.get(key).push(line)
  }

  const tableRows = []
  for (const key of recurrenceOrder) {
    const group = groups.get(key)
    if (!group.length) continue
    if ([...groups.values()].filter((items) => items.length).length > 1) {
      tableRows.push(`<tr class="group"><td colspan="2">${esc(recurrenceName[key])}</td></tr>`)
    }
    for (const line of group) {
      const discount = line.discount === true || (typeof line.amount === 'number' && line.amount < 0)
      const price = line.amount === null || line.amount === undefined || line.amount === ''
        ? ''
        : `${discount ? '− ' : ''}${money(Math.abs(line.amount))}${recurrenceSuffix[key]}`
      tableRows.push(`
        <tr class="${discount ? 'discount' : ''}">
          <td>
            <strong>${esc(line.name)}</strong>
            ${line.detail ? `<span>${esc(line.detail)}</span>` : ''}
          </td>
          <td class="amount">${esc(price)}</td>
        </tr>`)
    }
  }

  const activeGroups = recurrenceOrder.filter((key) => groups.get(key).length)
  const vatLabel = `Btw ${Math.round((offer.vatRate ?? 0.21) * 100)}%`
  const totalBlocks = activeGroups.map((key) => {
    const group = groups.get(key)
    const priced = group.every((line) => typeof line.amount === 'number')
    const net = priced ? group.reduce((sum, line) => sum + line.amount, 0) : null
    const vat = net === null ? null : Math.round(net * (offer.vatRate ?? 0.21) * 100) / 100
    const gross = net === null ? null : Math.round((net + vat) * 100) / 100
    const heading = activeGroups.length > 1 || key !== 'once' ? recurrenceName[key] : 'Totaal'
    return `
      <div class="total-group">
        <p>${esc(heading)}</p>
        <div class="quiet"><span>Excl. btw</span><span>${money(net)}</span></div>
        <div class="quiet"><span>${vatLabel}</span><span>${money(vat)}</span></div>
        <div class="strong"><span>Incl. btw</span><span>${money(gross)}</span></div>
      </div>`
  }).join('')

  const excluded = (offer.excluded || []).map((item) => `<li>${esc(item)}</li>`).join('')
  const terms = (offer.terms || []).map((item) => `<li>${esc(item)}</li>`).join('')

  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <title>${esc(offer.number)} · ${esc(client.tradeName || client.legalName)} · verkoop.studio</title>
  <style>
    @font-face { font-family: Inter; src: url("${fontHref}/inter-400.woff2") format("woff2"); font-weight: 400; font-style: normal; font-display: block; }
    @font-face { font-family: Inter; src: url("${fontHref}/inter-500.woff2") format("woff2"); font-weight: 500; font-style: normal; font-display: block; }
    @font-face { font-family: Inter; src: url("${fontHref}/inter-600.woff2") format("woff2"); font-weight: 600; font-style: normal; font-display: block; }
    @font-face { font-family: Inter; src: url("${fontHref}/inter-700.woff2") format("woff2"); font-weight: 700; font-style: normal; font-display: block; }

    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: Inter, system-ui, sans-serif;
      color: #10131c;
      font-size: 13px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    .bar { position: fixed; top: 0; left: 0; right: 0; height: 5px; background: #254bfa; z-index: 3; }
    .foot {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 3;
      height: 14mm; box-sizing: border-box;
      display: flex; justify-content: space-between; align-items: center; gap: 16px;
      padding: 0 15mm;
      background: #fff; border-top: 1px solid #e1e4ef;
      color: #676d7e; font-size: 10px; letter-spacing: 0.01em;
    }
    .foot b { color: #10131c; font-weight: 600; }

    main { padding: 12mm 15mm 20mm; }
    header { display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; }
    .mark { display: flex; align-items: baseline; gap: 5px; color: #10131c; }
    .mark .name { font-size: 28px; line-height: 1; font-weight: 700; letter-spacing: -1.5px; }
    .mark .dot { color: #254bfa; }
    .mark .studio { font-size: 12px; font-weight: 500; letter-spacing: -0.2px; }
    .tagline { margin: 8px 0 0; color: #676d7e; font-size: 11px; }

    .doc { text-align: right; }
    .chip {
      display: inline-block; margin-bottom: 8px;
      background: #eaf0ff; color: #2344ca; border: 1px solid #d5e0ff;
      border-radius: 999px; padding: 3px 9px;
      font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
    }
    .doclabel {
      margin: 0; color: #676d7e; font-size: 10px; font-weight: 600;
      letter-spacing: 0.16em; text-transform: uppercase;
    }
    .docnum { margin: 2px 0 8px; font-size: 18px; font-weight: 600; letter-spacing: -0.04em; }
    .meta { margin: 0; color: #4e5364; font-size: 11.5px; }
    .meta div { display: flex; justify-content: flex-end; gap: 14px; }
    .meta dt { color: #676d7e; }
    .meta dd { margin: 0; min-width: 118px; color: #10131c; }

    h1 {
      margin: 18px 0 0; max-width: 12em;
      font-size: 34px; line-height: 1.02; font-weight: 600; letter-spacing: -0.045em;
    }
    .reference { margin: 8px 0 0; color: #254bfa; font-size: 12px; font-weight: 600; }
    .intro { margin: 8px 0 0; max-width: 64ch; color: #4e5364; font-size: 13.5px; line-height: 1.5; }

    .parties { display: grid; grid-template-columns: 1fr 1.15fr; gap: 12px; margin-top: 16px; }
    .card { background: #f4f5fb; border-radius: 16px; padding: 14px 16px 15px; break-inside: avoid; }
    .eyebrow {
      margin: 0 0 8px; color: #254bfa; font-size: 10px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase;
    }
    .card p { margin: 0; color: #4e5364; font-size: 12px; line-height: 1.4; }
    .card .name { color: #10131c; font-size: 15px; font-weight: 600; letter-spacing: -0.03em; }
    .card .label { color: #676d7e; font-size: 10px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
    .card .gap { margin-top: 10px; }

    h2 {
      margin: 16px 0 0; font-size: 11px; font-weight: 600;
      letter-spacing: 0.14em; text-transform: uppercase; color: #254bfa;
    }
    .step {
      display: grid; grid-template-columns: 42px 1fr; gap: 8px;
      padding: 9px 0; border-bottom: 1px solid #e1e4ef; break-inside: avoid;
    }
    .step:first-of-type { border-top: 1px solid #e1e4ef; margin-top: 12px; }
    .num { color: #254bfa; font-weight: 600; letter-spacing: -0.04em; font-size: 14px; }
    .step h3 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -0.03em; }
    .step p { margin: 3px 0 0; color: #4e5364; }

    .principles { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin: 8px 0 0; padding: 0; list-style: none; }
    .principles li {
      margin: 0; background: #fff; border: 1px solid #e1e4ef; border-radius: 12px;
      padding: 9px 11px; color: #4e5364; font-size: 11.5px; line-height: 1.4; break-inside: avoid;
    }

    .sheet { break-before: page; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; }
    .group td {
      padding: 11px 0 2px; border: 0; color: #676d7e; font-size: 10px; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
    }
    td { padding: 10px 0; border-bottom: 1px solid #e1e4ef; vertical-align: top; }
    td strong { display: block; font-size: 14px; font-weight: 600; letter-spacing: -0.02em; }
    td span { display: block; margin-top: 2px; color: #4e5364; }
    td.amount {
      width: 34%; text-align: right; color: #10131c; font-weight: 600;
      font-size: 14px; letter-spacing: -0.02em; white-space: nowrap;
    }
    tr.discount td.amount { color: #254bfa; }

    .totals {
      display: grid; grid-template-columns: 1fr 1fr; gap: 22px;
      margin-top: 14px; background: #10131c; color: #fff;
      border-radius: 16px; padding: 14px 18px 12px; break-inside: avoid;
    }
    .totals:has(.total-group:only-child) { grid-template-columns: 1fr; }
    .total-group p {
      margin: 0 0 4px; color: #a9b9ff; font-size: 10px; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
    }
    .totals .quiet, .totals .strong { display: flex; justify-content: space-between; gap: 16px; padding: 3px 0; }
    .totals .quiet { color: #c5cbdc; font-size: 12px; }
    .totals .strong { color: #fff; font-size: 15px; font-weight: 600; letter-spacing: -0.03em; padding-top: 6px; }

    .split { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-top: 8px; }
    .split ul, .note { margin: 10px 0 0; padding: 0; list-style: none; color: #4e5364; }
    .split li { position: relative; padding-left: 14px; margin: 0 0 7px; }
    .split li::before { content: ""; position: absolute; left: 0; top: 0.55em; width: 5px; height: 5px; border-radius: 50%; background: #254bfa; }
    .closing { margin: 16px 0 0; max-width: 62ch; font-size: 13.5px; }

    .sign { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; break-inside: avoid; }
    .sign article { border: 1px solid #e1e4ef; border-radius: 16px; padding: 12px 14px 10px; break-inside: avoid; }
    .sign h3 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -0.02em; }
    .sign .who { margin: 3px 0 14px; color: #4e5364; font-size: 12px; }
    .field { display: grid; grid-template-columns: 88px 1fr; gap: 8px; align-items: end; margin-top: 7px; color: #676d7e; font-size: 11px; }
    .field i { display: block; border-bottom: 1px solid #10131c; min-height: 16px; font-style: normal; color: #10131c; font-size: 12px; }
  </style>
</head>
<body>
  <div class="bar"></div>
  <footer class="foot">
    <span><b>verkoop.studio</b> · ${esc([issuer.city, issuer.country].filter(Boolean).join(', '))}${issuer.vat ? ` · BTW ${esc(issuer.vat)}` : ''}</span>
    <span>${esc(issuer.email)}</span>
    <span>${esc(offer.number)}</span>
  </footer>
  <main>
    <header>
      <div>
        <div class="mark" aria-label="verkoop.studio"><span class="name">verkoop<span class="dot">.</span></span><span class="studio">studio</span></div>
        <p class="tagline">${esc(issuer.tagline)}</p>
      </div>
      <div class="doc">
        ${statusChip}
        <p class="doclabel">Offerte</p>
        <p class="docnum">${esc(offer.number)}</p>
        <dl class="meta">
          <div><dt>Datum</dt><dd>${esc(formatDate(offer.date))}</dd></div>
          <div><dt>Geldig tot</dt><dd>${esc(formatDate(validUntil))}</dd></div>
        </dl>
      </div>
    </header>

    <h1>${esc(offer.title)}</h1>
    ${offer.reference ? `<p class="reference">${esc(offer.reference)}</p>` : ''}
    <p class="intro">${esc(offer.intro)}</p>

    <div class="parties">
      ${partyBlock('Van', issuerRows)}
      ${partyBlock('Aan', clientRows)}
    </div>

    <h2>${esc(offer.approachLabel || 'Aanpak')}</h2>
    ${steps}

    ${principles ? `<h2>${esc(offer.principlesLabel || 'Uitgangspunten')}</h2><ul class="principles">${principles}</ul>` : ''}

    <section class="sheet">
      <h2>${esc(offer.investmentLabel || 'Investering')}</h2>
      <table>
        <tbody>${tableRows.join('')}</tbody>
      </table>
      <div class="totals">${totalBlocks}</div>

      <div class="split">
        <section>
          <h2>${esc(offer.excludedLabel || 'Niet inbegrepen')}</h2>
          <ul>${excluded}</ul>
        </section>
        <section>
          <h2>${esc(offer.termsLabel || 'Afspraken')}</h2>
          <ul>${terms}</ul>
        </section>
      </div>

      <p class="closing">${esc(offer.closing || '')}</p>

      <div class="sign">
        <article>
          <p class="eyebrow">Voor akkoord</p>
          <h3>${esc(client.legalName)}</h3>
          <p class="who">${esc(client.tradeName || '')}</p>
          <div class="field"><span>Naam</span><i></i></div>
          <div class="field"><span>Datum</span><i></i></div>
          <div class="field"><span>Handtekening</span><i></i></div>
        </article>
        <article>
          <p class="eyebrow">Opgesteld door</p>
          <h3>${esc(issuer.brand)}</h3>
          <p class="who">${esc(offer.signOff || issuer.contactName)}</p>
          <div class="field"><span>Naam</span><i>${esc(offer.signOff || issuer.contactName)}</i></div>
          <div class="field"><span>Datum</span><i>${esc(formatDate(offer.date))}</i></div>
          <div class="field"><span>Handtekening</span><i></i></div>
        </article>
      </div>
    </section>
  </main>
</body>
</html>`
}

function loadOffer(offerPath) {
  const offer = readJson(offerPath)
  const issuer = offer.issuer || readJson(resolve(root, 'issuer.json'))
  const client = offer.client || readJson(resolve(root, 'clients', `${offer.clientId}.json`))
  return { offer, issuer, client }
}

function render(offerPath, outPath) {
  const data = loadOffer(offerPath)
  const htmlPath = outPath.replace(/\.pdf$/i, '.html')
  mkdirSync(dirname(outPath), { recursive: true })
  const fontHref = resolve(root, 'fonts')
  writeFileSync(htmlPath, renderHtml({ ...data, fontHref }))

  const result = spawnSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--hide-scrollbars',
    `--print-to-pdf=${outPath}`,
    htmlPath,
  ], { encoding: 'utf8' })

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Chrome exited ${result.status}`)
  }
  return { htmlPath, outPath }
}

const offerPath = resolve(process.argv[2] || resolve(root, 'offerte.template.json'))
const outPath = resolve(process.argv[3] || resolve(root, 'out', 'offerte-pursuit-femmes.pdf'))
const written = render(offerPath, outPath)
console.log(`${written.outPath}\n${written.htmlPath}`)
