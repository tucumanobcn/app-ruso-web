/**
 * Estadísticas para el panel de progreso: tiempo de estudio estimado, evolución
 * semanal, objetivo semanal, historial de lecciones y camino al siguiente nivel.
 * Funciones puras: reciben `now` para poder probarse.
 */
import type { SkillId } from '../content/glossary'
import { dependentsOf, KNOWLEDGE_MAP } from '../content/knowledgeMap'
import type { AnswerRecord, CompletedSession } from '../lib/storage'
import type { MasteryMap } from './insights'
import type { MasteryState } from './mastery'

const MINUTE = 60_000
const DAY = 24 * 60 * MINUTE
/** Pausa máxima entre dos respuestas que se cuenta como estudio. */
const MAX_GAP = 3 * MINUTE
/** Una pausa mayor empieza una nueva sesión de estudio. */
const NEW_BURST = 10 * MINUTE
/** Tiempo que se suma al empezar (leer la explicación o el enunciado). */
const BURST_START = 1 * MINUTE

/**
 * Minutos de estudio estimados a partir de las respuestas: el tiempo entre respuestas
 * seguidas (hasta 3 minutos cada vez) más 1 minuto al empezar cada tanda.
 */
export function studyMinutes(log: AnswerRecord[]): number {
  const times = log.map((r) => Date.parse(r.answeredAt)).sort((a, b) => a - b)
  let total = 0
  times.forEach((t, i) => {
    const gap = i === 0 ? Infinity : t - times[i - 1]
    total += gap > NEW_BURST ? BURST_START : Math.min(gap, MAX_GAP)
  })
  return Math.round(total / MINUTE)
}

/** Lunes 00:00 (hora local) de la semana de `timestamp`. */
export function weekStart(timestamp: number): number {
  const d = new Date(timestamp)
  const day = (d.getDay() + 6) % 7 // lunes = 0
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() - day).getTime()
}

export interface WeekStats {
  start: number
  answers: number
  correct: number
  /** null si esa semana no hubo respuestas. */
  accuracy: number | null
  minutes: number
  sessions: number
}

/** Últimas `weeks` semanas, de la más antigua a la actual. */
export function weeklyStats(
  log: AnswerRecord[],
  sessions: CompletedSession[],
  now: number,
  weeks = 8,
): WeekStats[] {
  const current = weekStart(now)
  return Array.from({ length: weeks }, (_, i) => {
    const start = weekStart(current - (weeks - 1 - i) * 7 * DAY + DAY / 2)
    const end = weekStart(start + 8 * DAY)
    const inWeek = (iso: string) => {
      const t = Date.parse(iso)
      return t >= start && t < end
    }
    const answers = log.filter((r) => inWeek(r.answeredAt))
    const correct = answers.filter((r) => r.correct).length
    return {
      start,
      answers: answers.length,
      correct,
      accuracy: answers.length > 0 ? correct / answers.length : null,
      minutes: studyMinutes(answers),
      sessions: sessions.filter((s) => inWeek(s.finishedAt)).length,
    }
  })
}

export interface WeeklyGoal {
  target: number
  done: number
  reached: boolean
}

export function weeklyGoal(sessions: CompletedSession[], target: number, now: number): WeeklyGoal {
  const start = weekStart(now)
  const done = sessions.filter((s) => Date.parse(s.finishedAt) >= start).length
  return { target, done, reached: done >= target }
}

export interface HistoryEntry {
  id: string
  lessonId: string
  finishedAt: string
  correct: number
  total: number
  minutes: number
}

/** Sesiones terminadas, de la más reciente a la más antigua. */
export function lessonHistory(sessions: CompletedSession[], limit = 20): HistoryEntry[] {
  return [...sessions]
    .sort((a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt))
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      lessonId: s.lessonId,
      finishedAt: s.finishedAt,
      correct: s.correctCount,
      total: s.total,
      // Una sesión abierta y olvidada no debe inflar el tiempo: máximo 30 minutos.
      minutes: Math.min(30, Math.max(1, Math.round((Date.parse(s.finishedAt) - Date.parse(s.startedAt)) / MINUTE))),
    }))
}

export interface LevelPath {
  level: 'A1' | 'A2'
  total: number
  mastered: number
  essentialTotal: number
  essentialMastered: number
  /** Conocimientos esenciales aún no dominados, primero los que más bloquean. */
  missing: { skill: SkillId; state: MasteryState; blocks: number }[]
  complete: boolean
}

const STATE_ORDER: Record<MasteryState, number> = {
  'necesita-repaso': 0,
  'en-aprendizaje': 1,
  'en-consolidacion': 2,
  'no-estudiado': 3,
  dominado: 4,
}

/** Qué falta, por nivel, para tener dominados todos los conocimientos esenciales. */
export function levelPaths(mastery: MasteryMap): LevelPath[] {
  return (['A1', 'A2'] as const).map((level) => {
    const skills = (Object.keys(KNOWLEDGE_MAP) as SkillId[]).filter((s) => KNOWLEDGE_MAP[s].level === level)
    const essential = skills.filter((s) => KNOWLEDGE_MAP[s].importance === 'esencial')
    const missing = essential
      .filter((s) => mastery[s].state !== 'dominado')
      .map((skill) => ({ skill, state: mastery[skill].state, blocks: dependentsOf(skill).length }))
      .sort((a, b) => b.blocks - a.blocks || STATE_ORDER[a.state] - STATE_ORDER[b.state])
    return {
      level,
      total: skills.length,
      mastered: skills.filter((s) => mastery[s].state === 'dominado').length,
      essentialTotal: essential.length,
      essentialMastered: essential.length - missing.length,
      missing,
      complete: missing.length === 0,
    }
  })
}
