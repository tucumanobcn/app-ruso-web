import type { SkillId } from '../content/glossary'
import type { Lesson, Question } from '../content/types'

/**
 * Familias de formato: completar y seleccionar comparten mecánica (elegir la palabra
 * que falta), así que cuentan como una sola para exigir variedad.
 */
export type FormatFamily =
  | 'opcion'
  | 'verdadero-falso'
  | 'identificar-error'
  | 'seleccion-multiple'
  | 'ordenar'
  | 'relacionar'

export const FORMAT_FAMILY_LABEL: Record<FormatFamily, string> = {
  opcion: 'completar o seleccionar',
  'verdadero-falso': 'verdadero o falso',
  'identificar-error': 'identificar el error',
  'seleccion-multiple': 'selección múltiple',
  ordenar: 'ordenar',
  relacionar: 'relacionar',
}

export function formatFamily(question: Question): FormatFamily {
  switch (question.kind) {
    case 'choice':
      return question.format === 'completar' || question.format === 'seleccionar'
        ? 'opcion'
        : question.format
    case 'multi':
      return 'seleccion-multiple'
    case 'order':
      return 'ordenar'
    case 'match':
      return 'relacionar'
  }
}

export function skillsOf(question: Question): SkillId[] {
  return [question.skill, ...(question.alsoEvaluates ?? [])]
}

export interface QuestionInfo {
  skills: SkillId[]
  family: FormatFamily
}

export interface QuestionIndex {
  byQuestion: Map<string, QuestionInfo>
  /** Número de ejercicios distintos disponibles para cada conocimiento. */
  availableBySkill: Map<SkillId, number>
}

/** Índice de las preguntas de las lecciones y, opcionalmente, de las variantes generadas. */
export function buildQuestionIndex(lessons: Lesson[], extra: Question[] = []): QuestionIndex {
  const byQuestion = new Map<string, QuestionInfo>()
  const availableBySkill = new Map<SkillId, number>()
  for (const group of [...lessons.map((lesson) => lesson.questions), extra]) {
    for (const question of group) {
      if (byQuestion.has(question.id)) continue
      const skills = skillsOf(question)
      byQuestion.set(question.id, { skills, family: formatFamily(question) })
      for (const skill of skills) availableBySkill.set(skill, (availableBySkill.get(skill) ?? 0) + 1)
    }
  }
  return { byQuestion, availableBySkill }
}
