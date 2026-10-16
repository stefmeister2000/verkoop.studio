import test from 'node:test'
import assert from 'node:assert/strict'
import { crmPayload, sendToCrm } from '../server-crm.js'
const form = {naam:'Alex Example', email:'Alex@EXAMPLE.com', telefoon:'123', doel:'Website', uitdaging:'More leads', bedrijf:'Example Co', investering:'1000–2000', attribution:{utm_source:'google'}}
test('maps contact and qualification without treating budget as deal value', () => {
  const p = crmPayload(form)
  assert.equal(p.company,'Example Co'); assert.equal(p.email,'alex@example.com')
  assert.match(p.notes,/Maandelijkse investering: 1000–2000/)
  assert.match(p.notes,/utm_source: google/); assert.equal(p.value_estimate,undefined)
  assert.equal(crmPayload({...form,bedrijf:''}).company,'Alex Example')
})
test('rejects oversized enquiries rather than truncating them', () => {
  assert.throws(() => crmPayload({...form,extra:'x'.repeat(4001)}),/field_too_long/)
})
test('authenticates server request and checks persisted result', async () => {
  const result = await sendToCrm(crmPayload(form), {url:'http://127.0.0.1:5174/api/public/inbound-lead',token:'test-only',fetchImpl:async (url, options) => {
    assert.equal(options.headers['x-inbound-token'],'test-only'); assert.equal(options.redirect,'error')
    return Response.json({status:'created',leadId:'example'})
  }})
  assert.equal(result.leadId,'example')
})
test('rejects failed or misleading CRM responses', async () => {
  for (const response of [new Response('',{status:503}),Response.json({ok:true})]) {
    await assert.rejects(sendToCrm({}, {url:'https://crm.example.com/api',token:'test',fetchImpl:async()=>response}))
  }
  await assert.rejects(sendToCrm({}, {url:'http://public.example.com/api',token:'test'}),/requires_https/)
})

test('forwards only valid Google identifiers for CRM appointment attribution', () => {
  const base={naam:'Example',email:'test@example.invalid'}
  const payload=crmPayload({...base,ga4:{clientId:'123.456',sessionId:'789',email:'private@example.invalid'}})
  assert.deepEqual(payload.ga4,{clientId:'123.456',sessionId:'789'})
  assert.equal(crmPayload({...base,ga4:{clientId:'private@example.invalid'}}).ga4,undefined)
})
