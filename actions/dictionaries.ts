
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'es') =>
  dictionaries[locale]()

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export type Lang = 'en' | 'es'
