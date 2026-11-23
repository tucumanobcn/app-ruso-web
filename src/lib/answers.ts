/**
 * Motor de corrección: representa las respuestas del estudiante y las evalúa.
 * No depende de React ni del almacenamiento, para poder probarlo aislado.
 */
import type { ErrorTypeId } from '../content/glossary'
import type { OrderQuestion, Question } from '../content/types'

export type AnswerValue =
  | { kind: 'choice'; optionId: string }
  | { kind: 'multi'; optionIds: string[] }
  /** Índices de `tokens` en el orden elegido. */
  | { kind: 'order'; tokenIndexes: number[] }
  /** id de la pareja de la izquierda → id de la pareja elegida a la derecha. */
  | { kind: 'match'; pairs: Record<string, string> }

export interface Grade {
  correct: boolean
  errorType?: ErrorTypeId
}

/** Elementos que se barajan al empezar una sesión (opciones, fragmentos o columna derecha). */
export function shuffleableIds(question: Question): string[] {
  switch (question.kind) {
    case 'choice':
    case 'multi':
      return question.options.map((option) => option.id)
    case 'order':
      return question.tokens.map((_, index) => String(index))
    case 'match':
      return question.pairs.map((pair) => pair.id)
  }
}

function normalize(text: string): string {
  return text.trim().toLocaleLowerCase('ru')
}

/** Todas las secuencias de fragmentos aceptadas para una pregunta de ordenar. */
export function acceptedSequences(question: OrderQuestion): string[][] {
  return [question.tokens, ...(question.alsoAccepted ?? [])]
}

export function orderedTexts(question: OrderQuestion, tokenIndexes: number[]): string[] {
  return tokenIndexes.map((index) => question.tokens[index])
}

function sameSequence(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((text, i) => normalize(text) === normalize(b[i]))
}

export function grade(question: Question, answer: AnswerValue): Grade {
  switch (question.kind) {
    case 'choice': {
      if (answer.kind !== 'choice') return { correct: false }
      if (answer.optionId === question.correctOptionId) return { correct: true }
      const option = question.options.find((o) => o.id === answer.optionId)
      return { correct: false, errorType: option?.errorType }
    }
    case 'multi': {
      if (answer.kind !== 'multi') return { correct: false }
      const chosen = new Set(answer.optionIds)
      const wrongChosen = question.options.find(
        (o) => chosen.has(o.id) && !question.correctOptionIds.includes(o.id),
      )
      if (wrongChosen) return { correct: false, errorType: wrongChosen.errorType }
      const missing = question.correctOptionIds.some((id) => !chosen.has(id))
      if (missing) return { correct: false, errorType: 'seleccion.incompleta' }
      return { correct: true }
    }
    case 'order': {
      if (answer.kind !== 'order') return { correct: false }
      const texts = orderedTexts(question, answer.tokenIndexes)
      const correct = acceptedSequences(question).some((sequence) => sameSequence(sequence, texts))
      return correct ? { correct } : { correct, errorType: question.errorType }
    }
    case 'match': {
      if (answer.kind !== 'match') return { correct: false }
      const correct = question.pairs.every((pair) => answer.pairs[pair.id] === pair.id)
      return correct ? { correct } : { correct, errorType: question.errorType }
    }
  }
}

/** Une fragmentos en una frase legible (con mayúscula inicial si son palabras). */
export function joinTokens(question: OrderQuestion, texts: string[]): string {
  if (question.display === 'lineas') return texts.join('\n')
  const sentence = texts.join(' ')
  return sentence.charAt(0).toLocaleUpperCase('ru') + sentence.slice(1)
}

/** Resumen textual de la respuesta, para la revisión de resultados. */
export function describeAnswer(question: Question, answer: AnswerValue | undefined): string {
  if (!answer) return 'Sin responder'
  switch (question.kind) {
    case 'choice':
      return answer.kind === 'choice'
        ? (question.options.find((o) => o.id === answer.optionId)?.text ?? '—')
        : '—'
    case 'multi':
      return answer.kind === 'multi'
        ? question.options
            .filter((o) => answer.optionIds.includes(o.id))
            .map((o) => o.text)
            .join(' · ')
        : '—'
    case 'order':
      return answer.kind === 'order'
        ? joinTokens(question, orderedTexts(question, answer.tokenIndexes)).replace(/\n/g, ' / ')
        : '—'
    case 'match': {
      if (answer.kind !== 'match') return '—'
      const right = (id: string) => question.pairs.find((p) => p.id === id)?.right ?? '—'
      return question.pairs.map((pair) => `${pair.left} → ${right(answer.pairs[pair.id])}`).join(' · ')
    }
  }
}

/** Comprueba que una respuesta guardada encaja con la pregunta actual. */
export function isAnswerShapeValid(question: Question, answer: AnswerValue): boolean {
  if (answer.kind !== question.kind) return false
  const ids = new Set(shuffleableIds(question))
  switch (answer.kind) {
    case 'choice':
      return ids.has(answer.optionId)
    case 'multi':
      return answer.optionIds.every((id) => ids.has(id))
    case 'order':
      return (
        answer.tokenIndexes.length === ids.size &&
        new Set(answer.tokenIndexes).size === ids.size &&
        answer.tokenIndexes.every((index) => ids.has(String(index)))
      )
    case 'match':
      return Object.entries(answer.pairs).every(([left, right]) => ids.has(left) && ids.has(right))
  }
}
