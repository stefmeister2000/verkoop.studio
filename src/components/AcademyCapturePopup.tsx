import { useCallback, useEffect, useRef, useState } from 'react'
import AcademySignup from './AcademySignup'
import { useAcademyTranslation } from '../i18n/academy'
import { ACADEMY_POPUP_DELAY, canShowAcademyPopup, readAcademyPopupHistory, recordAcademyPopup } from '../lib/academy-popup'

export default function AcademyCapturePopup({ completed, suppressed, onVisibilityChange, onSuccess }: {
  completed: boolean
  suppressed: boolean
  onVisibilityChange: (visible: boolean) => void
  onSuccess: (name: string) => void
}) {
  const { t } = useAcademyTranslation()
  const [stage, setStage] = useState<'prompt' | 'form' | 'success' | null>(null)
  const panel = useRef<HTMLElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const capturedHere = useRef(false)

  const close = useCallback(() => {
    const restoreFocus = panel.current?.contains(document.activeElement)
    recordAcademyPopup()
    setStage(null)
    onVisibilityChange(false)
    if (restoreFocus) previousFocus.current?.focus({ preventScroll: true })
  }, [onVisibilityChange])

  useEffect(() => {
    if (completed || suppressed) {
      if (!capturedHere.current || suppressed) {
        setStage(null)
        onVisibilityChange(false)
      }
      return
    }
    const startedAt = Date.now()
    let shown = false
    let interactedWithForm = false
    const visible = (selector: string) => {
      const rect = document.querySelector(selector)?.getBoundingClientRect()
      return !!rect && rect.top < innerHeight && rect.bottom > 0
    }
    const check = () => {
      if (shown || interactedWithForm) return
      const scrollable = document.documentElement.scrollHeight - innerHeight
      const blocked = document.visibilityState !== 'visible' || innerHeight < 440
        || !!document.activeElement?.closest('form')
        || !!document.querySelector('iframe[src*="youtube"]')
        || visible('#aanmelden') || visible('.ac-footer')
      if (!canShowAcademyPopup({ now: Date.now(), startedAt, scrollProgress: scrollable > 0 ? scrollY / scrollable : 0, history: readAcademyPopupHistory(), blocked })) return
      shown = true
      previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      recordAcademyPopup()
      setStage('prompt')
      onVisibilityChange(true)
    }
    const formInteraction = (event: Event) => {
      if (!(event.target instanceof Element) || !event.target.closest('form') || panel.current?.contains(event.target)) return
      interactedWithForm = true
      recordAcademyPopup()
      setStage(null)
      onVisibilityChange(false)
    }
    const timer = setTimeout(check, ACADEMY_POPUP_DELAY)
    window.addEventListener('scroll', check, { passive: true })
    document.addEventListener('visibilitychange', check)
    document.addEventListener('input', formInteraction)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', check)
      document.removeEventListener('visibilitychange', check)
      document.removeEventListener('input', formInteraction)
    }
  }, [completed, suppressed, onVisibilityChange])

  useEffect(() => {
    if (stage === 'form') panel.current?.querySelector<HTMLInputElement>('input[name="naam"]')?.focus({ preventScroll: true })
    if (!stage) return
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [stage, close])

  if (!stage) return null
  return <aside ref={panel} className="ac-capture-popup" role="dialog" aria-modal="false" aria-labelledby="academy-popup-title" aria-describedby="academy-popup-description">
    <button className="ac-popup-close" type="button" onClick={close} aria-label={t('Sluit kennismakingsvenster')}>×</button>
    <p className="ac-kicker">META ADS ACADEMY</p>
    <h2 id="academy-popup-title">{stage === 'success' ? t('Je aanvraag is binnen.') : t('Even kennismaken?')}</h2>
    <p id="academy-popup-description">{stage === 'success' ? t('Stef neemt contact op om een kennismaking te plannen. Je krijgt ook een bevestiging per mail.') : t('Ontdek samen met Stef of de lessen bij je passen.')}</p>
    {stage === 'prompt' && <div className="ac-popup-actions"><button className="ac-button" onClick={() => setStage('form')}>{t('Plan een kennismaking')}</button><button className="ac-popup-later" onClick={close}>{t('Niet nu')}</button></div>}
    {stage === 'form' && <>
      <AcademySignup formId="academy-popup" onSuccess={name => {
        capturedHere.current = true
        recordAcademyPopup(true)
        setStage('success')
        onSuccess(name)
      }} />
      <p className="ac-popup-privacy">{t('Alleen contact over je kennismaking. Geen nieuwsbrief.')}</p>
    </>}
    {stage === 'success' && <button className="ac-popup-later" onClick={close}>{t('Verder lezen')}</button>}
  </aside>
}
