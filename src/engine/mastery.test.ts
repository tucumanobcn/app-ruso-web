import { describe, expect, it } from 'vitest'
import { LESSONS } from '../content/lessons'
import type { AnswerRecord } from '../lib/storage'
import { lessonReadiness, weakPoints } from './insights'
import { computeMastery, evaluateSkill, type Attempt } from './mastery'
import { buildQuestionIndex, type FormatFamily } from './questionIndex'

/** Fecha local del mes de noviembre de 2026 a mediodía. */
const day = (d: number) => new Date(2026, 10, d, 12).getTime()

function attempt(
  questionId: string,
  correct: boolean,
  at: number,
  family: FormatFamily = 'opcion',
  errorType?: string,
): Attempt {
  return { questionId, correct, at, family, errorType }
}

/** Tres ejercicios distintos acertados en dos familias de formato el mismo día. */
const masteredSameDay = [
  attempt('q1', true, day(1)),
  attempt('q2', true, day(1) + 1000),
  attempt('q3', true, day(1) + 2000, 'ordenar'),
]

describe('evaluateSkill', () => {
  it('sin respuestas: no estudiado', () => {
    expect(evaluateSkill('prep.lugar', [], 4, day(1)).state).toBe('no-estudiado')
  })

  it('un solo acierto no basta para salir de «en aprendizaje»', () => {
    const result = evaluateSkill('prep.lugar', [attempt('q1', true, day(1))], 4, day(1))
    expect(result.state).toBe('en-aprendizaje')
  })

  it('dos ejercicios distintos bien resueltos: en consolidación', () => {
    const result = evaluateSkill(
      'prep.lugar',
      [attempt('q1', true, day(1)), attempt('q2', true, day(1) + 1)],
      4,
      day(1),
    )
    expect(result.state).toBe('en-consolidacion')
  })

  it('repetir la misma pregunta no demuestra dominio', () => {
    const repeated = Array.from({ length: 8 }, (_, i) => attempt('q1', true, day(1) + i))
    const result = evaluateSkill('prep.lugar', repeated, 4, day(1))
    expect(result.state).not.toBe('dominado')
    expect(result.evidence.distinctCorrect).toBe(1)
    expect(result.reasons.join(' ')).toContain('ejercicios distintos')
  })

  it('exige variedad de formatos', () => {
    const sameFormat = masteredSameDay.map((a) => ({ ...a, family: 'opcion' as const }))
    const result = evaluateSkill('prep.lugar', sameFormat, 4, day(1))
    expect(result.state).not.toBe('dominado')
    expect(result.reasons.join(' ')).toContain('tipo de ejercicio')
  })

  it('dominio provisional con aciertos variados el mismo día', () => {
    const result = evaluateSkill('prep.lugar', masteredSameDay, 4, day(1))
    expect(result.state).toBe('dominado')
    expect(result.consolidated).toBe(false)
  })

  it('dominio consolidado cuando se mantiene en días separados', () => {
    const later = [...masteredSameDay, attempt('q4', true, day(5), 'relacionar')]
    const result = evaluateSkill('prep.lugar', later, 4, day(5))
    expect(result.state).toBe('dominado')
    expect(result.consolidated).toBe(true)
  })

  it('un error repetido impide el dominio', () => {
    const withErrors = [
      attempt('q4', false, day(1), 'opcion', 'preposicion.v-na'),
      attempt('q5', false, day(1) + 1, 'opcion', 'preposicion.v-na'),
      ...masteredSameDay.map((a) => ({ ...a, at: a.at + 10 })),
      attempt('q6', true, day(1) + 20),
      attempt('q7', true, day(1) + 30),
      attempt('q8', true, day(1) + 40),
    ]
    const result = evaluateSkill('prep.lugar', withErrors, 8, day(1))
    expect(result.evidence.repeatedErrors).toEqual(['preposicion.v-na'])
    expect(result.state).not.toBe('dominado')
  })

  it('pasa a «necesita repaso» cuando ya pasó el día que el programador fijó para repasar', () => {
    const schedule = { dueAt: new Date(2026, 10, 5).getTime(), retrievability: 0.82 }
    // El mismo día del repaso todavía cuenta como dominado (está en «Tu repaso de hoy»).
    expect(evaluateSkill('prep.lugar', masteredSameDay, 4, day(5), schedule).state).toBe('dominado')
    const result = evaluateSkill('prep.lugar', masteredSameDay, 4, day(7), schedule)
    expect(result.state).toBe('necesita-repaso')
    expect(result.reasons[0]).toContain('Tocaba repasarlo hace 2 días')
    expect(result.reasons[0]).toContain('82 %')
  })

  it('pasa a «necesita repaso» si aparecen errores en algo ya dominado', () => {
    const relapse = [
      ...masteredSameDay,
      attempt('q1', false, day(2), 'opcion', 'caso.genitivo'),
      attempt('q2', false, day(2) + 1, 'opcion', 'caso.dativo'),
    ]
    const result = evaluateSkill('prep.lugar', relapse, 4, day(2))
    expect(result.everMastered).toBe(true)
    expect(result.state).toBe('necesita-repaso')
  })

  it('conserva todos los errores del historial aunque mejore', () => {
    const history = [
      attempt('q1', false, day(1), 'opcion', 'caso.genitivo'),
      ...masteredSameDay.map((a) => ({ ...a, at: a.at + 100 })),
    ]
    const result = evaluateSkill('prep.lugar', history, 4, day(1))
    expect(result.evidence.totalErrors).toBe(1)
    expect(result.evidence.errorCounts['caso.genitivo']).toBe(1)
  })

  it('avisa cuando el banco no tiene ejercicios suficientes para demostrar dominio', () => {
    const result = evaluateSkill('dat.k', [attempt('q1', true, day(1))], 1, day(1))
    expect(result.reasons.join(' ')).toContain('El banco actual solo tiene 1')
  })
})

describe('computeMastery', () => {
  const index = buildQuestionIndex(LESSONS)
  const record = (questionId: string, correct: boolean, errorType?: string): AnswerRecord => ({
    sessionId: 's',
    lessonId: 'l',
    questionId,
    answer: { kind: 'choice', optionId: 'a' },
    correct,
    skill: 'casos.integracion',
    errorType,
    answeredAt: new Date(day(1)).toISOString(),
  })

  it('reparte la evidencia entre la habilidad principal y las adicionales', () => {
    const map = computeMastery([record('rep1-q2', false, 'caso.acusativo')], index, day(1))
    expect(map['casos.integracion'].evidence.totalAttempts).toBe(1)
    expect(map['dat.destinatario'].evidence.totalAttempts).toBe(1)
    expect(map['prep.lugar'].state).toBe('no-estudiado')
  })

  it('prioriza puntos débiles esenciales y avisa de requisitos débiles', () => {
    const map = computeMastery(
      [record('acus1-q3', false, 'terminacion.fem-ь'), record('prep1-q5', false, 'caso.dativo')],
      index,
      day(1),
    )
    const weak = weakPoints(map).map((w) => w.mastery.skill)
    expect(weak).toEqual(['acus.objeto', 'prep.o'])
    const dativo = LESSONS.find((l) => l.id === 'dativo-1')!
    expect(lessonReadiness(dativo, map).weak.map((m) => m.skill)).toContain('acus.objeto')
  })
})
