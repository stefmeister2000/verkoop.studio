import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  GIVEAWAY_CAMPAIGN,
  GIVEAWAY_FORM_ID,
  WEBSITE_CAMPAIGN,
  campaignForForm,
  crmPayload,
} from '../server-crm.js'
import { sendConfirmation } from '../server-confirmation.js'
import { captureLead } from '../server-lead.js'

const entry = {
  naam: 'Alex Example',
  bedrijf: 'Example Co',
  email: 'alex@example.com',
  telefoon: '+32 470 00 00 00',
  doel: 'Gratis website actie: deelname',
  uitdaging: 'Onze site haalt geen aanvragen binnen.',
  extra: `Actievoorwaarden aanvaard: ja (${GIVEAWAY_CAMPAIGN})`,
  form_id: GIVEAWAY_FORM_ID,
  lang: 'nl',
}

test('an entry reaches the CRM under the campaign, an enquiry does not', () => {
  assert.equal(crmPayload(entry).campaign, GIVEAWAY_CAMPAIGN)
  assert.equal(crmPayload({ ...entry, form_id: 'audit-formulier' }).campaign, WEBSITE_CAMPAIGN)
  assert.equal(crmPayload({ ...entry, form_id: undefined }).campaign, WEBSITE_CAMPAIGN)
  // An explicit campaign still wins, so the academy form keeps its own.
  assert.equal(crmPayload(entry, { campaign: 'Verkoop Studio academy' }).campaign, 'Verkoop Studio academy')
})

test('the campaign is decided by the form, never by a visitor-supplied name', () => {
  assert.equal(campaignForForm(` ${GIVEAWAY_FORM_ID} `), GIVEAWAY_CAMPAIGN)
  assert.equal(campaignForForm('gratis-website-actie-nep'), WEBSITE_CAMPAIGN)
  assert.equal(campaignForForm(null), WEBSITE_CAMPAIGN)
  // A campaign name in the body is not read; only form_id is.
  assert.equal(crmPayload({ ...entry, form_id: 'audit-formulier', campaign: GIVEAWAY_CAMPAIGN }).campaign, WEBSITE_CAMPAIGN)
})

test('the landing page posts the form_id the server tags on', () => {
  const page = readFileSync(new URL('../src/data/giveaway.ts', import.meta.url), 'utf8')
  assert.match(page, new RegExp(`formId: '${GIVEAWAY_FORM_ID}'`))
  assert.match(page, new RegExp(`campaign: '${GIVEAWAY_CAMPAIGN}'`))
})

test('the entry notification is not called a growth analysis', async () => {
  const sent = []
  const resend = {
    contacts: {
      get: async () => ({ data: { id: 'contact-1', properties: {} } }),
      segments: { add: async () => ({ data: { id: 'segment-1' } }) },
    },
    emails: { send: async payload => { sent.push(payload); return { data: { id: 'email-1' } } } },
    events: { send: async () => ({ data: { object: 'event', event: 'website.enquiry_received' } }) },
  }
  const result = await captureLead({ resend, body: entry, from: 'studio@example.com', to: 'studio@example.com' })
  assert.equal(result.ok, true)
  assert.match(sent[0].subject, /Nieuwe deelname gratis website van Example Co/)
})

test('an entrant is told how the campaign ends, not promised a call in 24 hours', async () => {
  for (const [lang, expected] of [['nl', /19 november 2026/], ['en', /19 November 2026/]]) {
    const sent = []
    const resend = { emails: { send: async payload => { sent.push(payload); return { data: { id: 'email-1' } } } } }
    await sendConfirmation(resend, { ...entry, lang }, {
      from: 'studio@example.com', replyTo: 'studio@example.com', idempotencyKey: 'giveaway/test',
    })
    assert.equal(sent.length, 1)
    assert.match(sent[0].text, expected)
    assert.doesNotMatch(sent[0].text, /24 ?(uur|hours)/)
    assert.equal(sent[0].template, undefined)
  }
})
