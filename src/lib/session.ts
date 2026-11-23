import type { Lesson, Question } from '../content/types'
import {
  acceptedSequences,
  grade,
  isAnswerShapeValid,
  shuffleableIds,
  type AnswerValue,
} from './answers'
import type { ActiveSession, CompletedSession } from './storage'

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Barajado Fisher–Yates: la respuesta correcta no queda siempre en la misma posición. */
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** Orden inicial de los elementos de una pregunta. En las de ordenar, nunca ya resuelto. */
export function initialOrder(question: Question, random: () => number = Math.random): string[] {
  const ids = shuffleableIds(question)
  if (question.kind !== 'order') return shuffle(ids, random)

  const solved = (order: string[]) => {
    const texts = order.map((id) => question.tokens[Number(id)])
    return acceptedSequences(question).some(
      (sequence) => sequence.length === texts.length && sequence.every((t, i) => t === texts[i]),
    )
  }
  let order = shuffle(ids, random)
  for (let attempt = 0; attempt < 20 && solved(order); attempt++) order = shuffle(ids, random)
  return order
}

export function startSession(lesson: Lesson): ActiveSession {
  const optionOrder: Record<string, string[]> = {}
  for (const question of lesson.questions) optionOrder[question.id] = initialOrder(question)
  return {
    id: newId(),
    lessonId: lesson.id,
    startedAt: new Date().toISOString(),
    step: lesson.intro ? 'intro' : 0,
    optionOrder,
    answers: {},
  }
}

/**
 * Comprueba que una sesión guardada sigue encajando con el contenido actual
 * (por si la lección cambió entre visitas).
 */
export function isSessionCompatible(lesson: Lesson, session: ActiveSession): boolean {
  if (session.lessonId !== lesson.id) return false
  if (typeof session.step === 'number' && session.step >= lesson.questions.length) return false
  return lesson.questions.every((question) => {
    const ids = shuffleableIds(question)
    const order = session.optionOrder[question.id]
    if (!order || order.length !== ids.length || !order.every((id) => ids.includes(id))) {
      return false
    }
    const answer = session.answers[question.id]
    return answer === undefined || isAnswerShapeValid(question, answer)
  })
}

export function countCorrect(lesson: Lesson, answers: Record<string, AnswerValue>): number {
  return lesson.questions.filter((question) => {
    const answer = answers[question.id]
    return answer !== undefined && grade(question, answer).correct
  }).length
}

export function completeSession(lesson: Lesson, session: ActiveSession): CompletedSession {
  return {
    id: session.id,
    lessonId: session.lessonId,
    startedAt: session.startedAt,
    finishedAt: new Date().toISOString(),
    optionOrder: session.optionOrder,
    answers: session.answers,
    correctCount: countCorrect(lesson, session.answers),
    total: lesson.questions.length,
  }
}
