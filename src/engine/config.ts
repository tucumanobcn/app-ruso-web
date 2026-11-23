/**
 * Umbrales del motor de dominio. Todos son configurables aquí y están
 * documentados en docs/motor-adaptativo.md. No equivalen a una certificación MCER.
 */
export interface MasteryConfig {
  /** Respuestas más recientes de cada conocimiento que se tienen en cuenta. */
  windowSize: number
  /** Peso de cada respuesta respecto a la siguiente más reciente (1 = sin ponderar). */
  recencyDecay: number
  /** Precisión reciente mínima para «en consolidación». */
  consolidationAccuracy: number
  /** Ejercicios distintos mínimos para «en consolidación» (o todos los que haya, si son menos). */
  minItemsForConsolidation: number
  /** Precisión reciente mínima para «dominado». */
  masteryAccuracy: number
  /** Ejercicios distintos acertados mínimos para «dominado». */
  minDistinctQuestions: number
  /** Familias de formato distintas acertadas mínimas para «dominado». */
  minFormatFamilies: number
  /** Repeticiones del mismo tipo de error, dentro de la ventana, que impiden el dominio. */
  repeatedErrorThreshold: number
  /** Días mínimos entre el primer y el último acierto para considerar el dominio consolidado. */
  consolidationSpacingDays: number
}
// Cuándo toca repasar ya no es un número fijo de días: lo calcula el programador
// de repasos (scheduler.ts) con su propia configuración (DEFAULT_SCHEDULER_CONFIG).

export const DEFAULT_MASTERY_CONFIG: MasteryConfig = {
  windowSize: 12,
  recencyDecay: 0.85,
  consolidationAccuracy: 0.6,
  minItemsForConsolidation: 2,
  masteryAccuracy: 0.85,
  minDistinctQuestions: 3,
  minFormatFamilies: 2,
  repeatedErrorThreshold: 2,
  consolidationSpacingDays: 3,
}
