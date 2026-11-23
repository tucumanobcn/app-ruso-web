/** Claves de caso de OpenRussian: sg_nom … pl_prep. */
export type CaseKey = `${'sg' | 'pl'}_${'nom' | 'gen' | 'dat' | 'acc' | 'inst' | 'prep'}`

export interface NounForms {
  accented: string
  gender: string | null
  animate: boolean
  /** Cada caso: lista de formas válidas con acento; la primera es la principal. */
  forms: Partial<Record<CaseKey, string[]>>
}

export interface VerbForms {
  accented: string
  aspect: string
  /** я, ты, он/она, мы, вы, они (presente en imperfectivos, futuro en perfectivos). */
  presentOrFuture: string[]
  past: { m: string; f: string; n: string; pl: string }
}

const STRESS = /́/g

/** Quita las marcas de acento para mostrar el texto como en un texto ruso normal. */
export function plain(text: string): string {
  return text.replace(STRESS, '')
}
