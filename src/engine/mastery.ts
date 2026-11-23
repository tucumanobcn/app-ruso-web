/**
 * Motor de dominio: a partir del historial de respuestas calcula, para cada
 * conocimiento, uno de cinco estados y explica qué falta para el siguiente.
 * Funciones puras (sin React ni almacenamiento): reciben `now` para poder probarse.
 */
import { ERROR_TYPES, SKILLS, type ErrorTypeId, type SkillId } from '../content/glossary'
import type { AnswerRecord } from '../lib/storage'
import { DEFAULT_MASTERY_CONFIG, type MasteryConfig } from './config'
import type { FormatFamily, QuestionIndex } from './questionIndex'
import { relativeDay, type ScheduleMap } from './scheduler'

export type MasteryState =
  | 'no-estudiado'
  | 'en-aprendizaje'
  | 'en-consolidacion'
  | 'dominado'
  | 'necesita-repaso'

export const STATE_LABEL: Record<MasteryState, string> = {
  'no-estudiado': 'No estudiado',
  'en-aprendizaje': 'En aprendizaje',
  'en-consolidacion': 'En consolidación',
  dominado: 'Dominado',
  'necesita-repaso': 'Necesita repaso',
}

export const STATE_ORDER: MasteryState[] = [
  'necesita-repaso',
  'en-aprendizaje',
  'en-consolidacion',
  'dominado',
  'no-estudiado',
]

/** Una respuesta vista desde un conocimiento concreto. */
export interface Attempt {
  questionId: string
  correct: boolean
  errorType?: string
  at: number
  family: FormatFamily | null
}

export interface SkillEvidence {
  /** Respuestas totales registradas (todo el historial). */
  totalAttempts: number
  /** Errores totales (todo el historial: nunca se borran). */
  totalErrors: number
  /** Errores por tipo en todo el historial. */
  errorCounts: Partial<Record<ErrorTypeId, number>>
  /** Precisión ponderada por recencia, contando una vez cada ejercicio de la ventana. */
  recentAccuracy: number | null
  /** Ejercicios distintos en la ventana reciente. */
  distinctAttempted: number
  /** Ejercicios distintos acertados (última respuesta) en la ventana reciente. */
  distinctCorrect: number
  /** Familias de formato con algún acierto en la ventana. */
  families: FormatFamily[]
  /** Tipos de error repetidos en la ventana reciente. */
  repeatedErrors: ErrorTypeId[]
  /** Días entre el primer y el último acierto de la ventana. */
  correctDaySpan: number
  lastPracticedAt: number | null
  /** Ejercicios distintos que existen en el banco para este conocimiento. */
  available: number
}

export interface SkillMastery {
  skill: SkillId
  state: MasteryState
  /** Solo en «dominado»: mantenido en días separados. */
  consolidated: boolean
  /** Llegó a cumplir los criterios de dominio en algún momento. */
  everMastered: boolean
  evidence: SkillEvidence
  /** Por qué está en este estado o qué le falta para el siguiente. */
  reasons: string[]
}

const DAY_MS = 24 * 60 * 60 * 1000

function dayNumber(timestamp: number): number {
  const date = new Date(timestamp)
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / DAY_MS)
}

function percent(value: number): string {
  return `${Math.round(value * 100)} %`
}

interface WindowStats {
  accuracy: number | null
  distinctAttempted: number
  distinctCorrect: number
  families: Set<FormatFamily>
  repeatedErrors: ErrorTypeId[]
  correctDaySpan: number
}

/** Estadísticas de la ventana reciente. Cada ejercicio cuenta una vez (su última respuesta). */
function windowStats(attempts: Attempt[], cfg: MasteryConfig): WindowStats {
  const recent = attempts.slice(-cfg.windowSize)

  const latest = new Map<string, Attempt>()
  for (const attempt of recent) latest.set(attempt.questionId, attempt)
  const items = [...latest.values()].sort((a, b) => a.at - b.at)

  let weighted = 0
  let totalWeight = 0
  items.forEach((item, index) => {
    const weight = cfg.recencyDecay ** (items.length - 1 - index)
    totalWeight += weight
    if (item.correct) weighted += weight
  })

  const correctItems = items.filter((item) => item.correct)
  const families = new Set(
    correctItems.map((item) => item.family).filter((f): f is FormatFamily => f !== null),
  )

  const errorCounts = new Map<string, number>()
  for (const attempt of recent) {
    if (!attempt.correct && attempt.errorType) {
      errorCounts.set(attempt.errorType, (errorCounts.get(attempt.errorType) ?? 0) + 1)
    }
  }
  const repeatedErrors = [...errorCounts]
    .filter(([type, count]) => count >= cfg.repeatedErrorThreshold && type in ERROR_TYPES)
    .map(([type]) => type as ErrorTypeId)

  const correctDays = recent.filter((a) => a.correct).map((a) => dayNumber(a.at))
  const correctDaySpan =
    correctDays.length > 0 ? Math.max(...correctDays) - Math.min(...correctDays) : 0

  return {
    accuracy: totalWeight > 0 ? weighted / totalWeight : null,
    distinctAttempted: items.length,
    distinctCorrect: correctItems.length,
    families,
    repeatedErrors,
    correctDaySpan,
  }
}

function meetsMastery(stats: WindowStats, cfg: MasteryConfig): boolean {
  return (
    stats.accuracy !== null &&
    stats.accuracy >= cfg.masteryAccuracy &&
    stats.distinctCorrect >= cfg.minDistinctQuestions &&
    stats.families.size >= cfg.minFormatFamilies &&
    stats.repeatedErrors.length === 0
  )
}

/** Qué le falta a un conocimiento para alcanzar el dominio. */
function missingForMastery(stats: WindowStats, available: number, cfg: MasteryConfig): string[] {
  const reasons: string[] = []
  if (stats.accuracy !== null && stats.accuracy < cfg.masteryAccuracy) {
    reasons.push(
      `Precisión reciente: ${percent(stats.accuracy)} (para el dominio hace falta un ${percent(cfg.masteryAccuracy)}).`,
    )
  }
  if (stats.distinctCorrect < cfg.minDistinctQuestions) {
    let text = `Has acertado ${stats.distinctCorrect} de los ${cfg.minDistinctQuestions} ejercicios distintos necesarios.`
    if (available < cfg.minDistinctQuestions) {
      text += ` El banco actual solo tiene ${available} de este conocimiento; harán falta más ejercicios (fase 4).`
    }
    reasons.push(text)
  }
  if (stats.families.size < cfg.minFormatFamilies) {
    reasons.push(
      `Has acertado en ${stats.families.size} tipo${stats.families.size === 1 ? '' : 's'} de ejercicio; hacen falta ${cfg.minFormatFamilies} distintos.`,
    )
  }
  for (const type of stats.repeatedErrors) {
    reasons.push(`Error repetido en tus últimas respuestas: ${ERROR_TYPES[type].toLowerCase()}.`)
  }
  return reasons
}

export function evaluateSkill(
  skill: SkillId,
  attempts: Attempt[],
  available: number,
  now: number,
  /** Programación de repasos (FSRS) de este conocimiento, si la hay. */
  schedule?: { dueAt: number; retrievability: number },
  cfg: MasteryConfig = DEFAULT_MASTERY_CONFIG,
): SkillMastery {
  const sorted = [...attempts].sort((a, b) => a.at - b.at)
  const errorCounts: Partial<Record<ErrorTypeId, number>> = {}
  for (const attempt of sorted) {
    if (!attempt.correct && attempt.errorType && attempt.errorType in ERROR_TYPES) {
      const type = attempt.errorType as ErrorTypeId
      errorCounts[type] = (errorCounts[type] ?? 0) + 1
    }
  }

  const stats = windowStats(sorted, cfg)
  const last = sorted.at(-1)
  const evidence: SkillEvidence = {
    totalAttempts: sorted.length,
    totalErrors: sorted.filter((a) => !a.correct).length,
    errorCounts,
    recentAccuracy: stats.accuracy,
    distinctAttempted: stats.distinctAttempted,
    distinctCorrect: stats.distinctCorrect,
    families: [...stats.families],
    repeatedErrors: stats.repeatedErrors,
    correctDaySpan: stats.correctDaySpan,
    lastPracticedAt: last ? last.at : null,
    available,
  }

  if (sorted.length === 0) {
    return {
      skill,
      state: 'no-estudiado',
      consolidated: false,
      everMastered: false,
      evidence,
      reasons: ['Todavía no has respondido ejercicios de este conocimiento.'],
    }
  }

  // ¿Llegó a dominarse en algún momento? Se reconstruye la historia respuesta a respuesta.
  let everMastered = false
  for (let i = 1; i <= sorted.length && !everMastered; i++) {
    everMastered = meetsMastery(windowStats(sorted.slice(0, i), cfg), cfg)
  }

  const mastered = meetsMastery(stats, cfg)
  const consolidated = mastered && stats.correctDaySpan >= cfg.consolidationSpacingDays
  const base = { skill, everMastered, evidence }

  if (mastered) {
    // Repaso espaciado: si ya pasó el día en que tocaba repasarlo, necesita repaso.
    const today = new Date(now)
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
    if (schedule && schedule.dueAt < startOfToday) {
      return {
        ...base,
        state: 'necesita-repaso',
        consolidated,
        reasons: [
          `Tocaba repasarlo ${relativeDay(schedule.dueAt, now)}: la probabilidad estimada de recordarlo ha bajado al ${percent(schedule.retrievability)}.`,
        ],
      }
    }
    return {
      ...base,
      state: 'dominado',
      consolidated,
      reasons: consolidated
        ? ['Dominio consolidado: lo has mantenido en días distintos.']
        : [
            `Dominio provisional: para consolidarlo, vuelve a acertar con al menos ${cfg.consolidationSpacingDays} días de diferencia.`,
          ],
    }
  }

  const missing = missingForMastery(stats, available, cfg)

  if (everMastered) {
    return {
      ...base,
      state: 'necesita-repaso',
      consolidated: false,
      reasons: ['Lo llegaste a dominar, pero tus respuestas recientes muestran nuevos errores.', ...missing],
    }
  }

  const neededItems = Math.min(cfg.minItemsForConsolidation, Math.max(available, 1))
  const consolidating =
    stats.accuracy !== null &&
    stats.accuracy >= cfg.consolidationAccuracy &&
    stats.distinctAttempted >= neededItems

  return {
    ...base,
    state: consolidating ? 'en-consolidacion' : 'en-aprendizaje',
    consolidated: false,
    reasons: missing,
  }
}

/** Calcula el estado de todos los conocimientos del glosario. */
export function computeMastery(
  log: AnswerRecord[],
  index: QuestionIndex,
  now: number = Date.now(),
  schedule: ScheduleMap = {},
  cfg: MasteryConfig = DEFAULT_MASTERY_CONFIG,
): Record<SkillId, SkillMastery> {
  const attemptsBySkill = new Map<SkillId, Attempt[]>()
  for (const record of log) {
    const info = index.byQuestion.get(record.questionId)
    const skills = info?.skills ?? (record.skill in SKILLS ? [record.skill as SkillId] : [])
    const attempt: Attempt = {
      questionId: record.questionId,
      correct: record.correct,
      errorType: record.errorType,
      at: Date.parse(record.answeredAt),
      family: info?.family ?? null,
    }
    for (const skill of skills) {
      attemptsBySkill.set(skill, [...(attemptsBySkill.get(skill) ?? []), attempt])
    }
  }

  const result = {} as Record<SkillId, SkillMastery>
  for (const skill of Object.keys(SKILLS) as SkillId[]) {
    result[skill] = evaluateSkill(
      skill,
      attemptsBySkill.get(skill) ?? [],
      index.availableBySkill.get(skill) ?? 0,
      now,
      schedule[skill],
      cfg,
    )
  }
  return result
}
