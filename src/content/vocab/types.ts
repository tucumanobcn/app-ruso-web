/** Palabra de vocabulario con datos verificados (ver vocab.generated.ts para las fuentes). */
export interface VocabExample {
  ru: string
  es: string
  /** Ids de las frases en Tatoeba (rusa y española). */
  ruId: number
  esId: number
  /** Usuario de Tatoeba que aportó la frase rusa. */
  author: string | null
}

interface VocabBase {
  id: string
  lessonId: string
  lemma: string
  /** Forma con acento (U+0301), según OpenRussian. */
  accented: string
  /** Traducción al español (propia). */
  es: string
  /** Traducción inglesa de OpenRussian, como referencia. */
  en: string
  example: VocabExample | null
}

export interface NounEntry extends VocabBase {
  pos: 'noun'
  noun: {
    gender: string | null
    animate: boolean
    indeclinable: boolean
    plOnly: boolean
    /** Claves sg_nom … pl_prep, con acento. */
    declension: Record<string, string>
  }
  /** Forma destacada en la tarjeta, por ejemplo «на да́че». */
  focus: { caseKey: string; text: string }
}

export interface VerbEntry extends VocabBase {
  pos: 'verb'
  verb: {
    perfective: string
    imperfectiveForms: { ya: string; ty: string; pastM: string }
    perfectiveForms: { ya: string; ty: string; pastM: string }
  }
}

export type VocabEntry = NounEntry | VerbEntry
