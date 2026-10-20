const escape = (value, empty = '') => String(value || empty).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
export function enquiryTemplate(body) {
  const blank = 'niet ingevuld'
  const variables = Object.fromEntries(['form_id','naam','bedrijf','telefoon','website','doel','uitdaging','investering','kanalen','timing','extra'].map(key => [key.toUpperCase(), escape(body[key], blank)]))
  variables.LEAD_EMAIL = escape(body.email, blank)
  variables.ATTRIBUTION = escape(Object.entries(body.attribution || {}).map(([key,value]) => `${key}: ${value}`).join(' · '), blank)
  return {id:'website-aanvraag-interne-melding-aan-stef-nl',variables}
}
export function confirmationTemplate(body) {
  return {
    id:body.lang === 'en' ? 'website-enquiry-confirmation-within-24-hours-en' : 'website-aanvraag-bevestiging-binnen-24-uur-nl',
    variables:{CONTACT_NAME:escape(body.naam?.trim().split(/\s+/)[0]),COMPANY:escape(body.bedrijf),GOAL:escape(body.doel),CHALLENGE:escape(body.uitdaging)},
  }
}
