import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAcademyTranslation } from '../i18n/academy'

export default function AcademyInfoSignup({ onSuccess }: { onSuccess: () => void }) {
  const { lang, t } = useAcademyTranslation()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    setPending(true); setError('')
    try {
      const response = await fetch('/api/academy-info', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(25_000),
        body: JSON.stringify({ email: data.get('email'), company_website: data.get('company_website'), lang }),
      })
      const receipt = await response.json()
      if (!response.ok || receipt.ok !== true) throw new Error(response.status === 429 ? 'rate_limit' : 'delivery')
      onSuccess()
    } catch (error) {
      setError(error instanceof Error && error.message === 'rate_limit' ? 'Even te veel pogingen. Probeer het over enkele minuten opnieuw.' : 'Versturen lukte niet. Probeer opnieuw of mail stef@verkoop.studio.')
    } finally { setPending(false) }
  }
  return <form className="ac-info-form" onSubmit={submit} data-clarity-mask="true">
    <label className="ac-field"><span>{t('E-mailadres')}</span><input name="email" type="email" autoComplete="email" autoCapitalize="none" spellCheck={false} required maxLength={200} placeholder={t('Je e-mailadres')} disabled={pending} /></label>
    <input className="ac-honeypot" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
    <button type="submit" className="ac-button" disabled={pending}>{pending ? t('Even geduld…') : t('Stuur mij de info')}</button>
    {error && <p className="ac-form-error" role="alert">{t(error)}</p>}
  </form>
}
