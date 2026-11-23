import type { VocabEntry } from './types'
import { VOCAB } from './vocab.generated'

export type { NounEntry, VerbEntry, VocabEntry, VocabExample } from './types'

export function vocabForLesson(lessonId: string): VocabEntry[] {
  return VOCAB.filter((entry) => entry.lessonId === lessonId)
}

export const GENDER_LABEL: Record<string, string> = { m: 'masculino', f: 'femenino', n: 'neutro' }

export const CASE_LABEL: Record<string, string> = {
  nom: 'Nominativo',
  gen: 'Genitivo',
  dat: 'Dativo',
  acc: 'Acusativo',
  inst: 'Instrumental',
  prep: 'Prepositivo',
}

export const SOURCES = {
  openRussian: {
    name: 'OpenRussian',
    url: 'https://github.com/Badestrand/russian-dictionary',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/deed.es',
  },
  tatoeba: {
    name: 'Tatoeba',
    url: 'https://tatoeba.org/es',
    license: 'CC BY 2.0 FR',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0/fr/deed.es',
  },
} as const

export function tatoebaUrl(id: number): string {
  return `https://tatoeba.org/es/sentences/show/${id}`
}
