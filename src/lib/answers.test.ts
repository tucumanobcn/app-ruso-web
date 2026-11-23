import { describe, expect, it } from 'vitest'
import type { ChoiceQuestion, MatchQuestion, MultiQuestion, OrderQuestion } from '../content/types'
import { describeAnswer, grade, isAnswerShapeValid } from './answers'

const explanation = { rule: 'r', whyCorrect: 'w', examples: [{ ru: 'а', es: 'a' }] }

const choice: ChoiceQuestion = {
  id: 'c1',
  kind: 'choice',
  format: 'completar',
  skill: 'instr.compania',
  instruction: 'Completa',
  prompt: 'Чай с ___.',
  correctOptionId: 'a',
  options: [
    { id: 'a', text: 'лимоном' },
    { id: 'b', text: 'лимона', whyWrong: 'genitivo', errorType: 'caso.genitivo' },
  ],
  explanation,
}

const multi: MultiQuestion = {
  id: 'm1',
  kind: 'multi',
  skill: 'prep.v-na',
  instruction: 'Selecciona',
  correctOptionIds: ['a', 'b'],
  options: [
    { id: 'a', text: 'почта', note: 'n' },
    { id: 'b', text: 'улица', note: 'n' },
    { id: 'c', text: 'школа', whyWrong: 'в', errorType: 'preposicion.v-na' },
  ],
  explanation,
}

const order: OrderQuestion = {
  id: 'o1',
  kind: 'order',
  display: 'palabras',
  skill: 'prep.lugar',
  instruction: 'Ordena',
  tokens: ['моя', 'сестра', 'живёт', 'в', 'Петербурге'],
  alsoAccepted: [['в', 'Петербурге', 'живёт', 'моя', 'сестра']],
  errorType: 'orden.palabras',
  explanation,
}

const match: MatchQuestion = {
  id: 'r1',
  kind: 'match',
  skill: 'acus.direccion',
  instruction: 'Relaciona',
  leftLang: 'ru',
  rightLang: 'es',
  errorType: 'caso.lugar-direccion',
  pairs: [
    { id: 'p1', left: 'Я иду в банк.', right: 'Voy al banco.' },
    { id: 'p2', left: 'Я в банке.', right: 'Estoy en el banco.' },
  ],
  explanation,
}

describe('grade', () => {
  it('corrige opción única y devuelve el tipo de error de la opción elegida', () => {
    expect(grade(choice, { kind: 'choice', optionId: 'a' })).toEqual({ correct: true })
    expect(grade(choice, { kind: 'choice', optionId: 'b' })).toEqual({
      correct: false,
      errorType: 'caso.genitivo',
    })
  })

  it('exige todas las opciones correctas y ninguna incorrecta en selección múltiple', () => {
    expect(grade(multi, { kind: 'multi', optionIds: ['b', 'a'] }).correct).toBe(true)
    expect(grade(multi, { kind: 'multi', optionIds: ['a'] })).toEqual({
      correct: false,
      errorType: 'seleccion.incompleta',
    })
    expect(grade(multi, { kind: 'multi', optionIds: ['a', 'b', 'c'] })).toEqual({
      correct: false,
      errorType: 'preposicion.v-na',
    })
  })

  it('acepta el orden principal y los alternativos', () => {
    expect(grade(order, { kind: 'order', tokenIndexes: [0, 1, 2, 3, 4] }).correct).toBe(true)
    expect(grade(order, { kind: 'order', tokenIndexes: [3, 4, 2, 0, 1] }).correct).toBe(true)
    expect(grade(order, { kind: 'order', tokenIndexes: [1, 0, 2, 3, 4] })).toEqual({
      correct: false,
      errorType: 'orden.palabras',
    })
  })

  it('compara fragmentos sin distinguir mayúsculas', () => {
    const upper: OrderQuestion = { ...order, alsoAccepted: [['В', 'Петербурге', 'живёт', 'моя', 'сестра']] }
    expect(grade(upper, { kind: 'order', tokenIndexes: [3, 4, 2, 0, 1] }).correct).toBe(true)
  })

  it('corrige las parejas de relacionar', () => {
    expect(grade(match, { kind: 'match', pairs: { p1: 'p1', p2: 'p2' } }).correct).toBe(true)
    expect(grade(match, { kind: 'match', pairs: { p1: 'p2', p2: 'p1' } }).correct).toBe(false)
  })

  it('no da por buena una respuesta de otro formato', () => {
    expect(grade(choice, { kind: 'multi', optionIds: ['a'] }).correct).toBe(false)
  })
})

describe('describeAnswer', () => {
  it('resume la respuesta de forma legible', () => {
    expect(describeAnswer(order, { kind: 'order', tokenIndexes: [3, 4, 2, 0, 1] })).toBe(
      'В Петербурге живёт моя сестра',
    )
    expect(describeAnswer(multi, { kind: 'multi', optionIds: ['a', 'c'] })).toBe('почта · школа')
    expect(describeAnswer(choice, undefined)).toBe('Sin responder')
  })
})

describe('isAnswerShapeValid', () => {
  it('rechaza respuestas que no encajan con la pregunta', () => {
    expect(isAnswerShapeValid(choice, { kind: 'choice', optionId: 'x' })).toBe(false)
    expect(isAnswerShapeValid(order, { kind: 'order', tokenIndexes: [0, 0, 1, 2, 3] })).toBe(false)
    expect(isAnswerShapeValid(order, { kind: 'order', tokenIndexes: [4, 3, 2, 1, 0] })).toBe(true)
  })
})
