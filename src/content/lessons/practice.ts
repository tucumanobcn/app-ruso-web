/**
 * Lecciones generadas: prácticas dirigidas de un punto débil y el repaso espaciado
 * del día. El id de la lección incluye las preguntas elegidas, así que una sesión
 * guardada se reconstruye siempre igual.
 *   practica:<conocimiento>                    → todos los ejercicios fijos (formato antiguo)
 *   practica:<conocimiento>:<id>|<id>|…        → ejercicios elegidos (fijos o variantes)
 *   repaso:<aaaa-mm-dd>:<id>|<id>|…            → repaso espaciado del día
 */
import { SKILLS, type SkillId } from '../glossary'
import { KNOWLEDGE_MAP } from '../knowledgeMap'
import type { Lesson, Question } from '../types'

export const PRACTICE_PREFIX = 'practica:'
export const REVIEW_PREFIX = 'repaso:'
const ID_SEPARATOR = '|'

export function practiceLessonId(skill: SkillId, questionIds?: string[]): string {
  return questionIds?.length
    ? `${PRACTICE_PREFIX}${skill}:${questionIds.join(ID_SEPARATOR)}`
    : `${PRACTICE_PREFIX}${skill}`
}

export function reviewLessonId(date: Date, questionIds: string[]): string {
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return `${REVIEW_PREFIX}${day}:${questionIds.join(ID_SEPARATOR)}`
}

export function evaluates(question: Question, skill: SkillId): boolean {
  return question.skill === skill || (question.alsoEvaluates?.includes(skill) ?? false)
}

function resolve(ids: string[], byId: Map<string, Question>): Question[] | undefined {
  const questions = ids.map((id) => byId.get(id))
  return questions.every((q) => q !== undefined) ? (questions as Question[]) : undefined
}

export function buildPracticeLesson(id: string, byId: Map<string, Question>): Lesson | undefined {
  const rest = id.slice(PRACTICE_PREFIX.length)
  const sep = rest.indexOf(':')
  const skill = (sep === -1 ? rest : rest.slice(0, sep)) as SkillId
  if (!(skill in SKILLS)) return undefined

  const questions =
    sep === -1
      ? [...byId.values()].filter((q) => !q.id.startsWith('v:') && evaluates(q, skill))
      : resolve(rest.slice(sep + 1).split(ID_SEPARATOR), byId)
  if (!questions || questions.length === 0) return undefined

  const info = SKILLS[skill]
  return {
    id,
    title: `Práctica: ${info.label}`,
    level: KNOWLEDGE_MAP[skill].level,
    topic: 'Práctica dirigida',
    type: 'practica',
    objective: `Reforzar un punto débil: ${info.label.toLowerCase()}.`,
    prerequisites: [],
    estimatedMinutes: Math.max(2, questions.length),
    status: 'disponible',
    intro: {
      title: 'Antes de empezar',
      paragraphs: [
        info.review,
        'Esta práctica mezcla ejercicios del banco con frases nuevas que aplican la misma regla, para comprobar que la entiendes y no solo que recuerdas una respuesta.',
      ],
      tables: [],
    },
    questions,
  }
}

export const SESSION_PREFIX = 'sesion:'

export type SessionKind = 'plan' | 'errores' | 'mixta' | 'vocabulario'

const SESSION_INFO: Record<SessionKind, { title: string; type: Lesson['type']; objective: string; intro: string }> = {
  plan: {
    title: 'Tu sesión de hoy',
    type: 'repaso',
    objective: 'Repasar lo que toca según tu calendario y reforzar tu punto débil prioritario.',
    intro: 'Esta sesión combina el repaso espaciado de hoy con un refuerzo de lo que más te cuesta.',
  },
  errores: {
    title: 'Repaso de tus errores',
    type: 'repaso',
    objective: 'Volver sobre lo que has fallado últimamente, con frases nuevas que aplican las mismas reglas.',
    intro: 'Los ejercicios trabajan los conocimientos en los que más has fallado en las últimas semanas.',
  },
  mixta: {
    title: 'Sesión mixta',
    type: 'mixta',
    objective: 'Combinar conocimientos ya estudiados para comprobar si los usas sin que te avisen de cuál toca.',
    intro: 'Cada ejercicio es de un tema distinto entre los que ya has trabajado.',
  },
  vocabulario: {
    title: 'Práctica de vocabulario',
    type: 'mixta',
    objective: 'Repasar el vocabulario de las lecciones y el del cuerpo.',
    intro: 'Ejercicios con las palabras de las lecciones: significado y forma correcta en contexto.',
  },
}

export function sessionLessonId(kind: SessionKind, date: Date, questionIds: string[]): string {
  const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return `${SESSION_PREFIX}${kind}:${day}:${questionIds.join(ID_SEPARATOR)}`
}

/** sesion:<tipo>:<aaaa-mm-dd>:<id>|<id>|… */
export function buildSessionLesson(id: string, byId: Map<string, Question>): Lesson | undefined {
  const [kind, , ...rest] = id.slice(SESSION_PREFIX.length).split(':')
  const info = SESSION_INFO[kind as SessionKind]
  if (!info || rest.length === 0) return undefined
  const questions = resolve(rest.join(':').split(ID_SEPARATOR), byId)
  if (!questions || questions.length === 0) return undefined
  const skills = [...new Set(questions.map((q) => q.skill))]
  return {
    id,
    title: info.title,
    level: KNOWLEDGE_MAP[skills[0]].level,
    topic: 'Sesión personalizada',
    type: info.type,
    objective: info.objective,
    prerequisites: [],
    estimatedMinutes: Math.max(2, questions.length),
    status: 'disponible',
    intro: {
      title: 'Qué trabajas',
      paragraphs: [info.intro, `Temas: ${skills.map((s) => SKILLS[s].label).join(', ')}.`],
      tables: [],
    },
    questions,
  }
}

export function buildReviewLesson(id: string, byId: Map<string, Question>): Lesson | undefined {
  const rest = id.slice(REVIEW_PREFIX.length)
  const sep = rest.indexOf(':')
  if (sep === -1) return undefined
  const questions = resolve(rest.slice(sep + 1).split(ID_SEPARATOR), byId)
  if (!questions || questions.length === 0) return undefined

  const skills = [...new Set(questions.map((q) => q.skill))]
  return {
    id,
    title: 'Tu repaso de hoy',
    level: KNOWLEDGE_MAP[skills[0]].level,
    topic: 'Repaso espaciado',
    type: 'repaso',
    objective:
      'Recuperar lo que ya estudiaste justo cuando empieza a olvidarse, con frases que en su mayoría no has visto todavía.',
    prerequisites: [],
    estimatedMinutes: Math.max(2, questions.length),
    status: 'disponible',
    intro: {
      title: 'Qué repasas hoy',
      paragraphs: [
        `Hoy tocan: ${skills.map((s) => SKILLS[s].label).join(', ')}.`,
        'El calendario de repasos se calcula con tus resultados: lo que aciertas se repasa cada vez más tarde, y lo que fallas vuelve pronto.',
      ],
      tables: [],
    },
    questions,
  }
}
