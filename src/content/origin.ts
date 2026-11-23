/**
 * De dónde sale cada ejercicio y cuánta confianza merece. Es la base del sistema
 * híbrido: si algún día se generan ejercicios con un modelo de lenguaje, entrarán
 * como «generado» (sin revisar) y nunca se mezclarán en silencio con el resto.
 */
import type { Question } from './types'
import { VARIANT_PREFIX } from './variants'

export type QuestionOrigin = 'leccion' | 'plantilla' | 'generado'

export interface OriginInfo {
  label: string
  /** Qué garantiza y qué no, en una frase. */
  detail: string
  confidence: 'alta' | 'media' | 'sin revisar'
}

export const ORIGIN_INFO: Record<QuestionOrigin, OriginInfo> = {
  leccion: {
    label: 'Ejercicio de la lección',
    detail: 'Redactado para la app y comprobado por el validador automático; no lo ha revisado un hablante nativo.',
    confidence: 'media',
  },
  plantilla: {
    label: 'Variante automática',
    detail: 'Frase de plantilla con formas sacadas de OpenRussian, una fuente verificada de declinaciones y conjugaciones.',
    confidence: 'alta',
  },
  generado: {
    label: 'Generado por IA',
    detail: 'Creado por un modelo de lenguaje y pendiente de revisión. Todavía no hay ninguno en la app.',
    confidence: 'sin revisar',
  },
}

export function questionOrigin(question: Pick<Question, 'id'>): QuestionOrigin {
  return question.id.startsWith(VARIANT_PREFIX) ? 'plantilla' : 'leccion'
}
