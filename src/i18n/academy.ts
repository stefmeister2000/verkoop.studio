import translations from './academy.en.json'
import type { Lang } from '../data/types'
import { useLang } from './LanguageContext'

/** Dutch source copy remains the default; shared terms and brand names need no translation. */
export function academyTranslator(lang: Lang) {
  return (text: string): string => lang === 'en' ? translations[text as keyof typeof translations] ?? text : text
}

export function useAcademyTranslation() {
  const language = useLang()
  return { ...language, t: academyTranslator(language.lang) }
}
