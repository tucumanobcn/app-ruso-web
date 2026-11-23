/**
 * Lecturas del estado de dominio para la interfaz: puntos débiles, errores
 * frecuentes, preparación para una lección y cambios tras una sesión.
 */
import { ERROR_TYPES, type ErrorTypeId, type SkillId } from '../content/glossary'
import { dependentsOf, KNOWLEDGE_MAP } from '../content/knowledgeMap'
import type { Lesson } from '../content/types'
import type { AnswerRecord } from '../lib/storage'
import type { MasteryState, SkillMastery } from './mastery'
import { skillsOf } from './questionIndex'

export type MasteryMap = Record<SkillId, SkillMastery>

const WEAK_STATES: MasteryState[] = ['en-aprendizaje', 'necesita-repaso']

export function isWeak(mastery: SkillMastery): boolean {
  return WEAK_STATES.includes(mastery.state)
}

export interface WeakPoint {
  mastery: SkillMastery
  importance: 'esencial' | 'secundario'
  /** Conocimientos que se apoyan en este y aún no están dominados. */
  blocks: SkillId[]
  /** Errores más frecuentes de este conocimiento (todo el historial). */
  topErrors: [ErrorTypeId, number][]
  priority: number
}

/** Puntos débiles ordenados por prioridad: importancia, lo que bloquean y su estado. */
export function weakPoints(map: MasteryMap): WeakPoint[] {
  return (Object.values(map) as SkillMastery[])
    .filter(isWeak)
    .map((mastery) => {
      const node = KNOWLEDGE_MAP[mastery.skill]
      const blocks = dependentsOf(mastery.skill).filter((dep) => map[dep].state !== 'dominado')
      const topErrors = (Object.entries(mastery.evidence.errorCounts) as [ErrorTypeId, number][])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
      const accuracy = mastery.evidence.recentAccuracy ?? 0
      const priority =
        (node.importance === 'esencial' ? 3 : 0) +
        blocks.length +
        (mastery.state === 'necesita-repaso' ? 1 : 0) +
        (1 - accuracy) * 2
      return { mastery, importance: node.importance, blocks, topErrors, priority }
    })
    .sort((a, b) => b.priority - a.priority)
}

/** Tipos de error más frecuentes en todo el historial. */
export function frequentErrors(log: AnswerRecord[], limit = 5): [ErrorTypeId, number][] {
  const counts = new Map<ErrorTypeId, number>()
  for (const record of log) {
    if (!record.correct && record.errorType && record.errorType in ERROR_TYPES) {
      const type = record.errorType as ErrorTypeId
      counts.set(type, (counts.get(type) ?? 0) + 1)
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit)
}

export function lessonSkills(lesson: Lesson): SkillId[] {
  return [...new Set(lesson.questions.flatMap(skillsOf))]
}

export interface Readiness {
  /** Requisitos esenciales trabajados pero todavía débiles. */
  weak: SkillMastery[]
  /** Requisitos esenciales que aún no se han estudiado. */
  unstudied: SkillId[]
}

/**
 * Comprueba los conocimientos previos de una lección. No bloquea: la progresión
 * es flexible, pero se avisa de lo que conviene repasar.
 */
export function lessonReadiness(lesson: Lesson, map: MasteryMap): Readiness {
  const own = new Set(lessonSkills(lesson))
  const required = new Set<SkillId>()
  for (const skill of own) {
    for (const req of KNOWLEDGE_MAP[skill].requires) if (!own.has(req)) required.add(req)
  }
  const essential = [...required].filter((skill) => KNOWLEDGE_MAP[skill].importance === 'esencial')
  return {
    weak: essential.map((skill) => map[skill]).filter(isWeak),
    unstudied: essential.filter((skill) => map[skill].state === 'no-estudiado'),
  }
}

export interface MasteryChange {
  skill: SkillId
  before: MasteryState
  after: SkillMastery
}

/** Estado de los conocimientos de una lección antes y después de una sesión. */
export function masteryChanges(skills: SkillId[], before: MasteryMap, after: MasteryMap): MasteryChange[] {
  return skills.map((skill) => ({ skill, before: before[skill].state, after: after[skill] }))
}
