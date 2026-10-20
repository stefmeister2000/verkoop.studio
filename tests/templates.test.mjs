import test from 'node:test'
import assert from 'node:assert/strict'
import { enquiryTemplate, confirmationTemplate } from '../server-templates.js'
import { sendConfirmation } from '../server-confirmation.js'
test('internal template uses applicant email rather than recipient reserved EMAIL',()=>{
 const t=enquiryTemplate({naam:'Applicant',email:'applicant@example.com',uitdaging:'<img src=x>',attribution:{source:'Website'}})
 assert.equal(t.variables.LEAD_EMAIL,'applicant@example.com')
 assert.equal(t.variables.UITDAGING,'&lt;img src=x&gt;')
 assert.equal(t.variables.ATTRIBUTION,'source: Website')
 assert.equal(t.variables.WEBSITE,'niet ingevuld')
})
test('confirmation selects actual NL and EN templates and applicant name',()=>{
 const nl=confirmationTemplate({naam:'New Visitor',doel:'Growth'})
 assert.equal(nl.id,'website-aanvraag-bevestiging-binnen-24-uur-nl')
 assert.equal(nl.variables.CONTACT_NAME,'New')
 assert.equal(confirmationTemplate({lang:'en'}).id,'website-enquiry-confirmation-within-24-hours-en')
})
test('confirmation sends template without conflicting HTML and preserves idempotency',async()=>{
 let sent
 await sendConfirmation({emails:{send:async(...args)=>{sent=args;return {data:{id:'accepted'}}}}},{email:'test@example.com'},{from:'sender@example.com',replyTo:'owner@example.com',idempotencyKey:'stable'})
 assert.ok(sent[0].template);assert.equal(sent[0].html,undefined);assert.equal(sent[1].idempotencyKey,'stable')
})
