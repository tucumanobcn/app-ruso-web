import type { SkillId } from '../glossary'
import type { Lesson, Question } from '../types'
import { VARIANTS } from '../variants'
import {
  buildPracticeLesson,
  buildReviewLesson,
  buildSessionLesson,
  evaluates,
  PRACTICE_PREFIX,
  REVIEW_PREFIX,
  SESSION_PREFIX,
} from './practice'
import { acusativo1 } from './acusativo1'
import { casosPlural1 } from './casosPlural1'
import { compras1 } from './compras1'
import { comunicacion1 } from './comunicacion1'
import { aspecto1 } from './aspecto1'
import { cuerpo1 } from './cuerpo1'
import { dativo1 } from './dativo1'
import { genitivo1 } from './genitivo1'
import { instrumental1 } from './instrumental1'
import { movimiento1 } from './movimiento1'
import { movimiento2 } from './movimiento2'
import { prepositivo1 } from './prepositivo1'
import { repasoCasos1 } from './repasoCasos1'

/** Lecciones anunciadas en el catálogo, todavía sin ejercicios. */
const upcoming: Lesson[] = [
  {
    id: 'imperativo-1',
    title: 'El imperativo: читай / прочитай',
    level: 'A2',
    topic: 'Aspecto verbal',
    type: 'monografica',
    objective: 'Formar el imperativo y elegir el aspecto según se trate de una petición concreta o de un consejo general.',
    prerequisites: ['Aspecto verbal: proceso o resultado'],
    estimatedMinutes: 10,
    status: 'proximamente',
    questions: [],
  },
  {
    id: 'prefijos-1',
    title: 'Verbos de movimiento con prefijos',
    level: 'B1',
    topic: 'Verbos de movimiento',
    type: 'monografica',
    objective: 'Usar пойти, прийти, уйти, выйти, войти y sus pares con ехать.',
    prerequisites: ['идти y ходить', 'ехать y ездить'],
    estimatedMinutes: 10,
    status: 'proximamente',
    questions: [],
  },
]

/** Orden del catálogo: también es el orden recomendado de estudio. */
export const LESSONS: Lesson[] = [
  prepositivo1,
  acusativo1,
  genitivo1,
  dativo1,
  instrumental1,
  casosPlural1,
  repasoCasos1,
  aspecto1,
  upcoming[0],
  movimiento1,
  movimiento2,
  upcoming[1],
  comunicacion1,
  cuerpo1,
  compras1,
]

/** Todos los ejercicios: los fijos de las lecciones y las variantes generadas. */
export const ALL_QUESTIONS: Question[] = [...LESSONS.flatMap((lesson) => lesson.questions), ...VARIANTS]

/** Búsqueda de cualquier ejercicio (fijo o variante) por su id. */
export const QUESTION_BY_ID = new Map(ALL_QUESTIONS.map((question) => [question.id, question]))

const NONE: ReadonlySet<string> = new Set()

/**
 * Ejercicios (fijos y variantes) que ponen a prueba un conocimiento, sin los que
 * el estudiante ha marcado como dudosos (`excluded`).
 */
export function questionsForSkill(skill: SkillId, excluded: ReadonlySet<string> = NONE): Question[] {
  return ALL_QUESTIONS.filter((question) => evaluates(question, skill) && !excluded.has(question.id))
}

/** Busca una lección del catálogo o genera una práctica dirigida o un repaso del día. */
export function getLesson(id: string): Lesson | undefined {
  if (id.startsWith(PRACTICE_PREFIX)) return buildPracticeLesson(id, QUESTION_BY_ID)
  if (id.startsWith(REVIEW_PREFIX)) return buildReviewLesson(id, QUESTION_BY_ID)
  if (id.startsWith(SESSION_PREFIX)) return buildSessionLesson(id, QUESTION_BY_ID)
  return LESSONS.find((lesson) => lesson.id === id)
}
