import { describe, expect, it } from 'vitest'
import { getLesson, LESSONS } from '../content/lessons'
import type { OrderQuestion } from '../content/types'
import { acceptedSequences } from './answers'
import { countCorrect, initialOrder, isSessionCompatible, startSession } from './session'

/** Generador pseudoaleatorio con semilla, para tests reproducibles. */
function seeded(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

const orderQuestions = LESSONS.flatMap((l) => l.questions).filter(
  (q): q is OrderQuestion => q.kind === 'order',
)

describe('initialOrder', () => {
  it('nunca presenta una pregunta de ordenar ya resuelta', () => {
    for (const question of orderQuestions) {
      for (let seed = 1; seed <= 200; seed++) {
        const texts = initialOrder(question, seeded(seed)).map((id) => question.tokens[Number(id)])
        const solved = acceptedSequences(question).some((s) => s.join(' ') === texts.join(' '))
        expect(solved).toBe(false)
      }
    }
  })

  it('devuelve una permutación de los elementos', () => {
    const lesson = getLesson('instrumental-1')!
    const question = lesson.questions[0]
    const order = initialOrder(question, seeded(7))
    expect([...order].sort()).toEqual(['a', 'b', 'c', 'd'])
  })
})

describe('sesiones', () => {
  const lesson = getLesson('instrumental-1')!

  it('una sesión nueva es compatible con su lección', () => {
    expect(isSessionCompatible(lesson, startSession(lesson))).toBe(true)
  })

  it('detecta una sesión que ya no encaja con el contenido', () => {
    const session = startSession(lesson)
    session.optionOrder[lesson.questions[0].id] = ['a', 'b']
    expect(isSessionCompatible(lesson, session)).toBe(false)
  })

  it('cuenta las respuestas correctas', () => {
    const answers = {
      'instr1-q1': { kind: 'choice' as const, optionId: 'a' },
      'instr1-q2': { kind: 'choice' as const, optionId: 'a' },
      'instr1-q3': { kind: 'choice' as const, optionId: 'b' },
    }
    expect(countCorrect(lesson, answers)).toBe(2)
  })
})
