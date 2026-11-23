import type { IllustrationId } from '../components/illustrations'
import type { ErrorTypeId, SkillId } from './glossary'

export type Level = 'A1' | 'A2' | 'B1' | 'B2'

/** Idioma de un texto, para marcarlo con lang y elegir tipografía. */
export type TextLang = 'ru' | 'es'

/** Frase en ruso con su traducción al español. */
export interface Example {
  ru: string
  es: string
}

export interface AnswerOption {
  id: string
  text: string
  /** Por qué esta opción no es correcta. Obligatorio en las opciones incorrectas. */
  whyWrong?: string
  /** Tipo de error que revela elegir esta opción. Obligatorio en las opciones incorrectas. */
  errorType?: ErrorTypeId
  /** Solo en selección múltiple: por qué esta opción correcta lo es. */
  note?: string
}

interface QuestionBase {
  id: string
  /** Conocimiento principal que evalúa la pregunta. */
  skill: SkillId
  /** Otros conocimientos que la pregunta también pone a prueba (p. ej. en repasos mixtos). */
  alsoEvaluates?: SkillId[]
  /** Enunciado en español. */
  instruction: string
  /** Frase en ruso; «___» marca el hueco. */
  prompt?: string
  /** Traducción orientativa del enunciado ruso. */
  translation?: string
  explanation: {
    /** Regla gramatical que se aplica. */
    rule: string
    /** Por qué la respuesta correcta lo es. */
    whyCorrect: string
    examples: Example[]
  }
}

/** Opción única: completar, seleccionar, identificar el error, verdadero/falso. */
export interface ChoiceQuestion extends QuestionBase {
  kind: 'choice'
  format: 'completar' | 'seleccionar' | 'identificar-error' | 'verdadero-falso'
  /** Idioma de las opciones (por defecto, ruso). */
  optionsLang?: TextLang
  options: AnswerOption[]
  correctOptionId: string
}

/** Varias respuestas correctas: hay que marcarlas todas y ninguna incorrecta. */
export interface MultiQuestion extends QuestionBase {
  kind: 'multi'
  optionsLang?: TextLang
  options: AnswerOption[]
  correctOptionIds: string[]
}

/** Ordenar palabras para formar una frase, o réplicas para reconstruir un diálogo. */
export interface OrderQuestion extends QuestionBase {
  kind: 'order'
  display: 'palabras' | 'lineas'
  /** Fragmentos en el orden correcto principal. */
  tokens: string[]
  /** Otros órdenes igualmente válidos (mismos fragmentos, otro orden). */
  alsoAccepted?: string[][]
  /** Nota sobre los órdenes alternativos válidos. */
  orderNote?: string
  errorType: ErrorTypeId
}

/** Relacionar cada elemento de la izquierda con uno de la derecha. */
export interface MatchQuestion extends QuestionBase {
  kind: 'match'
  leftLang: TextLang
  rightLang: TextLang
  pairs: { id: string; left: string; right: string }[]
  errorType: ErrorTypeId
}

export type Question = ChoiceQuestion | MultiQuestion | OrderQuestion | MatchQuestion

export interface IntroTable {
  caption: string
  headers: string[]
  rows: string[][]
  /** Columnas cuyo contenido está en ruso (para lang="ru"). */
  ruColumns: number[]
  note?: string
}

export interface LessonIntro {
  title: string
  paragraphs: string[]
  tables: IntroTable[]
  /** Ilustración que acompaña la explicación. */
  illustration?: IllustrationId
}

export interface Lesson {
  id: string
  title: string
  level: Level
  /** Módulo del catálogo (Casos gramaticales, Aspecto verbal…). */
  topic: string
  /** monográfica: un solo tema; mixta: combina temas ya vistos; práctica: generada para un punto débil. */
  type: 'monografica' | 'mixta' | 'practica' | 'repaso'
  objective: string
  prerequisites: string[]
  estimatedMinutes: number
  status: 'disponible' | 'proximamente'
  intro?: LessonIntro
  questions: Question[]
}
