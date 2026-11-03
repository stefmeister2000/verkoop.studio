import { confirmationTemplate } from './server-templates.js'
import { resendRequest } from './server-lead.js'

export async function sendConfirmation(resend, form, {from, replyTo, idempotencyKey}) {
  if (form.form_id === 'home-free-plan') {
    const en = form.lang === 'en'
    return resendRequest(() => resend.emails.send({
      from, to: [form.email], replyTo,
      subject: en ? 'Your free growth plan request' : 'Je aanvraag voor een gratis groeiplan',
      text: en
        ? 'Thank you for requesting your free growth plan. We will contact you to discuss your business and prepare your plan. Have a question? Reply to this email.\n\nStef — Verkoop Studio'
        : 'Bedankt voor je aanvraag voor een gratis groeiplan. We nemen contact op om je bedrijf te bespreken en je plan uit te werken. Heb je een vraag? Antwoord op deze mail.\n\nStef — Verkoop Studio',
    }, { idempotencyKey }))
  }
  return resendRequest(() => resend.emails.send({
    from, to:[form.email], replyTo, template:confirmationTemplate(form),
  }, {idempotencyKey}))
}
