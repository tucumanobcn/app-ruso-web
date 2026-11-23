/**
 * Programador de repasos inspirado en FSRS-4.5 (Free Spaced Repetition Scheduler).
 *
 * Se programa por conocimiento, no por pregunta: cada día en que respondes ejercicios
 * de un conocimiento cuenta como un repaso, valorado según tu precisión de ese día.
 * De ahí salen la estabilidad (días que se mantiene el recuerdo), la dificultad y la
 * fecha del próximo repaso. Los parámetros son los valores por defecto publicados de
 * FSRS-4.5; la retención objetivo depende de la importancia del conocimiento.
 */
import { SKILLS, type SkillId } from '../content/glossary'
import { KNOWLEDGE_MAP } from '../content/knowledgeMap'
import type { AnswerRecord } from '../lib/storage'
import type { QuestionIndex } from './questionIndex'

/** Valoración de un repaso, como en FSRS: 1 otra vez, 2 difícil, 3 bien, 4 fácil. */
export type Rating = 1 | 2 | 3 | 4

export const FSRS_WEIGHTS = [
  0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367, 1.0461, 2.1072,
  0.0793, 0.3246, 1.587, 0.2272, 2.8755,
] as const

const DECAY = -0.5
const FACTOR = 19 / 81
export const DAY_MS = 24 * 60 * 60 * 1000

export interface SchedulerConfig {
  /** Probabilidad de recordar que se busca mantener, según la importancia. */
  retention: { esencial: number; secundario: number }
  maxIntervalDays: number
  /**
   * Intervalo máximo mientras un conocimiento no está dominado: aunque la memoria
   * aguante, lo que aún se está aprendiendo debe volver pronto.
   */
  learningMaxIntervalDays: number
}

export const DEFAULT_SCHEDULER_CONFIG: SchedulerConfig = {
  retention: { esencial: 0.9, secundario: 0.85 },
  maxIntervalDays: 365,
  learningMaxIntervalDays: 7,
}

export interface SkillSchedule {
  skill: SkillId
  /** Días en que la probabilidad de recordar cae al 90 %. */
  stability: number
  /** Dificultad estimada, de 1 (fácil) a 10 (difícil). */
  difficulty: number
  reviews: number
  /** Repasos valorados como «otra vez» (menos de la mitad de aciertos). */
  lapses: number
  lastReviewAt: number
  dueAt: number
  /** Probabilidad estimada de recordar ahora (0–1). */
  retrievability: number
  targetRetention: number
}

const W = FSRS_WEIGHTS
const clampD = (d: number) => Math.min(10, Math.max(1, d))

export function retrievability(elapsedDays: number, stability: number): number {
  return (1 + (FACTOR * elapsedDays) / stability) ** DECAY
}

function initialStability(g: Rating): number {
  return W[g - 1]
}

function initialDifficulty(g: Rating): number {
  return clampD(W[4] - (g - 3) * W[5])
}

function nextDifficulty(d: number, g: Rating): number {
  const updated = d - W[6] * (g - 3)
  return clampD(W[7] * initialDifficulty(3) + (1 - W[7]) * updated)
}

function stabilityAfterRecall(d: number, s: number, r: number, g: Rating): number {
  const hard = g === 2 ? W[15] : 1
  const easy = g === 4 ? W[16] : 1
  return s * (1 + Math.exp(W[8]) * (11 - d) * s ** -W[9] * (Math.exp((1 - r) * W[10]) - 1) * hard * easy)
}

function stabilityAfterLapse(d: number, s: number, r: number): number {
  return W[11] * d ** -W[12] * ((s + 1) ** W[13] - 1) * Math.exp((1 - r) * W[14])
}

/** Días hasta que la probabilidad de recordar baja a la retención objetivo. */
export function intervalDays(stability: number, retention: number, maxDays: number): number {
  const days = (stability / FACTOR) * (retention ** (1 / DECAY) - 1)
  return Math.min(maxDays, Math.max(1, Math.round(days)))
}

/** Valoración de un día de práctica a partir de sus aciertos. */
export function ratingFor(correct: number, total: number): Rating {
  const ratio = correct / total
  if (ratio === 1) return total >= 3 ? 4 : 3
  return ratio >= 0.5 ? 2 : 1
}

function startOfDay(timestamp: number): number {
  const d = new Date(timestamp)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export interface ReviewEvent {
  day: number
  rating: Rating
}

/** Reproduce los repasos de un conocimiento y devuelve su programación. */
export function scheduleFromEvents(
  skill: SkillId,
  events: ReviewEvent[],
  now: number,
  cfg: SchedulerConfig = DEFAULT_SCHEDULER_CONFIG,
  maxDays: number = cfg.maxIntervalDays,
): SkillSchedule | null {
  if (events.length === 0) return null
  const target = cfg.retention[KNOWLEDGE_MAP[skill].importance]
  let s = initialStability(events[0].rating)
  let d = initialDifficulty(events[0].rating)
  let lapses = events[0].rating === 1 ? 1 : 0
  let last = events[0].day

  for (const event of events.slice(1)) {
    const elapsed = Math.max(0, Math.round((event.day - last) / DAY_MS))
    const r = retrievability(elapsed, s)
    s = event.rating === 1 ? stabilityAfterLapse(d, s, r) : stabilityAfterRecall(d, s, r, event.rating)
    d = nextDifficulty(d, event.rating)
    if (event.rating === 1) lapses += 1
    last = event.day
  }

  const due = last + intervalDays(s, target, maxDays) * DAY_MS
  const elapsedNow = Math.max(0, (startOfDay(now) - last) / DAY_MS)
  return {
    skill,
    stability: s,
    difficulty: d,
    reviews: events.length,
    lapses,
    lastReviewAt: last,
    dueAt: due,
    retrievability: retrievability(elapsedNow, s),
    targetRetention: target,
  }
}

export type ScheduleMap = Partial<Record<SkillId, SkillSchedule>>

/** Programación de todos los conocimientos a partir del historial de respuestas. */
export function computeSchedule(
  log: AnswerRecord[],
  index: QuestionIndex,
  now: number = Date.now(),
  /** Conocimientos ya dominados: solo ellos pueden tener intervalos largos. */
  mastered: ReadonlySet<SkillId> = new Set(),
  cfg: SchedulerConfig = DEFAULT_SCHEDULER_CONFIG,
): ScheduleMap {
  // conocimiento → día → [aciertos, total]
  const days = new Map<SkillId, Map<number, [number, number]>>()
  for (const record of log) {
    const info = index.byQuestion.get(record.questionId)
    const skills = info?.skills ?? (record.skill in SKILLS ? [record.skill as SkillId] : [])
    const day = startOfDay(Date.parse(record.answeredAt))
    for (const skill of skills) {
      const perDay = days.get(skill) ?? new Map<number, [number, number]>()
      const [correct, total] = perDay.get(day) ?? [0, 0]
      perDay.set(day, [correct + (record.correct ? 1 : 0), total + 1])
      days.set(skill, perDay)
    }
  }

  const result: ScheduleMap = {}
  for (const [skill, perDay] of days) {
    const events = [...perDay]
      .sort((a, b) => a[0] - b[0])
      .map(([day, [correct, total]]) => ({ day, rating: ratingFor(correct, total) }))
    const maxDays = mastered.has(skill) ? cfg.maxIntervalDays : cfg.learningMaxIntervalDays
    const schedule = scheduleFromEvents(skill, events, now, cfg, maxDays)
    if (schedule) result[skill] = schedule
  }
  return result
}

/** Conocimientos con repaso pendiente hoy: primero los esenciales y los más olvidados. */
export function dueSkills(schedule: ScheduleMap, now: number = Date.now()): SkillSchedule[] {
  const endOfToday = startOfDay(now) + DAY_MS - 1
  return (Object.values(schedule) as SkillSchedule[])
    .filter((s) => s.dueAt <= endOfToday)
    .sort((a, b) => {
      const ia = KNOWLEDGE_MAP[a.skill].importance === 'esencial' ? 0 : 1
      const ib = KNOWLEDGE_MAP[b.skill].importance === 'esencial' ? 0 : 1
      return ia - ib || a.retrievability - b.retrievability
    })
}

/** «hoy», «mañana», «en 5 días», «hace 2 días»… */
export function relativeDay(timestamp: number, now: number = Date.now()): string {
  const diff = Math.round((startOfDay(timestamp) - startOfDay(now)) / DAY_MS)
  if (diff === 0) return 'hoy'
  if (diff === 1) return 'mañana'
  if (diff === -1) return 'ayer'
  if (diff > 1) return `en ${diff} días`
  return `hace ${-diff} días`
}
