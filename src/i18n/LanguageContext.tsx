import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Lang } from '../data/types'

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'sk_lang'

function readInitialLang(): Lang {
  if (typeof window === 'undefined') return 'nl'
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'nl'
  } catch { return 'nl' }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('nl')
  const [storageReady, setStorageReady] = useState(false)

  useEffect(() => {
    setLangState(readInitialLang())
    setStorageReady(true)
  }, [])

  useEffect(() => {
    if (!storageReady) return
    document.documentElement.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // If storage is unavailable, the language choice will not persist.
    }
  }, [lang, storageReady])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangState,
      toggleLang: () => setLangState((prev) => (prev === 'nl' ? 'en' : 'nl')),
    }),
    [lang],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within a LanguageProvider')
  return ctx
}
