export const ACADEMY_POPUP_DELAY = 45_000
export const ACADEMY_POPUP_COOLDOWN = 7 * 24 * 60 * 60_000
const storageKey = 'academy-intro-popup-v1'
type PopupHistory = { shownAt?: number; converted?: boolean }
let memory: PopupHistory = {}

export function readAcademyPopupHistory(): PopupHistory {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
    if (saved && typeof saved === 'object') {
      memory = {
        shownAt: typeof saved.shownAt === 'number' ? saved.shownAt : memory.shownAt,
        converted: saved.converted === true || memory.converted,
      }
    }
  } catch { /* Keep the in-memory cap when storage is unavailable. */ }
  return memory
}

export function recordAcademyPopup(converted = false) {
  memory = { ...readAcademyPopupHistory(), shownAt: Date.now() }
  if (converted) memory.converted = true
  try { localStorage.setItem(storageKey, JSON.stringify(memory)) } catch { /* Nonessential storage. */ }
}

export function canShowAcademyPopup({ now, startedAt, scrollProgress, history, blocked }: {
  now: number; startedAt: number; scrollProgress: number; history: PopupHistory; blocked: boolean
}) {
  return !blocked && !history.converted && now - startedAt >= ACADEMY_POPUP_DELAY
    && scrollProgress >= .25
    && (history.shownAt === undefined || now - history.shownAt >= ACADEMY_POPUP_COOLDOWN)
}
