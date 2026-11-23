import { describe, expect, it } from 'vitest'
import { getLesson, LESSONS, questionsForSkill } from '../content/lessons'
import { practiceLessonId, reviewLessonId } from '../content/lessons/practice'
import { VARIANTS } from '../content/variants'
import type { AnswerRecord } from '../lib/storage'
import { buildQuestionIndex } from './questionIndex'
import {
  computeSchedule,
  DAY_MS,
  dueSkills,
  intervalDays,
  ratingFor,
  relativeDay,
  scheduleFromEvents,
  type Rating,
} from './scheduler'
import { pickQuestions } from './selection'

const day = (d: number) => new Date(2026, 10, d).getTime()
const events = (...items: [number, Rating][]) => items.map(([d, rating]) => ({ day: day(d), rating }))
const daysUntilDue = (s: { dueAt: number; lastReviewAt: number }) =>
  Math.round((s.dueAt - s.lastReviewAt) / DAY_MS)

describe('programador de repasos (FSRS-4.5)', () => {
  it('valora cada día de práctica según los aciertos', () => {
    expect(ratingFor(0, 2)).toBe(1)
    expect(ratingFor(1, 2)).toBe(2)
    expect(ratingFor(2, 2)).toBe(3)
    expect(ratingFor(4, 4)).toBe(4)
  })

  it('con retención 0,9 el intervalo es igual a la estabilidad', () => {
    expect(intervalDays(10, 0.9, 365)).toBe(10)
    expect(intervalDays(10, 0.85, 365)).toBeGreaterThan(10)
  })

  it('un primer repaso bueno da unos 4 días y uno fallido, 1', () => {
    expect(daysUntilDue(scheduleFromEvents('prep.lugar', events([1, 3]), day(1))!)).toBe(4)
    expect(daysUntilDue(scheduleFromEvents('prep.lugar', events([1, 1]), day(1))!)).toBe(1)
  })

  it('los aciertos sucesivos alargan el intervalo', () => {
    const first = scheduleFromEvents('prep.lugar', events([1, 3]), day(1))!
    const second = scheduleFromEvents('prep.lugar', events([1, 3], [5, 3]), day(5))!
    const third = scheduleFromEvents('prep.lugar', events([1, 3], [5, 3], [20, 3]), day(20))!
    expect(second.stability).toBeGreaterThan(first.stability)
    expect(third.stability).toBeGreaterThan(second.stability)
    expect(daysUntilDue(third)).toBeGreaterThan(daysUntilDue(second))
  })

  it('un fallo baja la estabilidad y cuenta como lapso', () => {
    const good = scheduleFromEvents('prep.lugar', events([1, 3], [5, 3]), day(5))!
    const lapse = scheduleFromEvents('prep.lugar', events([1, 3], [5, 3], [15, 1]), day(15))!
    expect(lapse.stability).toBeLessThan(good.stability)
    expect(lapse.lapses).toBe(1)
    expect(daysUntilDue(lapse)).toBeLessThan(daysUntilDue(good))
  })

  it('los conocimientos esenciales se repasan antes que los secundarios', () => {
    const essential = scheduleFromEvents('prep.lugar', events([1, 3], [5, 3]), day(5))!
    const secondary = scheduleFromEvents('prep.o', events([1, 3], [5, 3]), day(5))!
    expect(essential.stability).toBeCloseTo(secondary.stability)
    expect(daysUntilDue(essential)).toBeLessThan(daysUntilDue(secondary))
  })

  it('agrupa las respuestas por día y detecta lo que toca hoy', () => {
    const index = buildQuestionIndex(LESSONS, VARIANTS)
    const record = (questionId: string, correct: boolean, d: number): AnswerRecord => ({
      sessionId: 's',
      lessonId: 'l',
      questionId,
      answer: { kind: 'choice', optionId: 'a' },
      correct,
      skill: 'prep.lugar',
      answeredAt: new Date(day(d) + 10 * 3600_000).toISOString(),
    })
    const log = [record('prep1-q1', true, 1), record('prep1-q2', false, 1), record('prep1-q7', true, 1)]
    const schedule = computeSchedule(log, index, day(1))
    expect(schedule['prep.lugar']!.reviews).toBe(1)
    // 2 de 3 aciertos → «difícil»: el repaso llega pronto.
    expect(dueSkills(schedule, day(1))).toEqual([])
    expect(dueSkills(schedule, day(10)).map((s) => s.skill)).toContain('prep.lugar')
  })

  it('limita a 7 días el intervalo de lo que aún no está dominado', () => {
    const history = events([1, 3], [10, 4], [40, 4])
    const free = scheduleFromEvents('prep.lugar', history, day(40))!
    const capped = scheduleFromEvents('prep.lugar', history, day(40), undefined, 7)!
    expect(daysUntilDue(free)).toBeGreaterThan(7)
    expect(daysUntilDue(capped)).toBe(7)
  })

  it('describe las fechas de forma relativa', () => {
    expect(relativeDay(day(5), day(5))).toBe('hoy')
    expect(relativeDay(day(6), day(5))).toBe('mañana')
    expect(relativeDay(day(9), day(5))).toBe('en 4 días')
    expect(relativeDay(day(3), day(5))).toBe('hace 2 días')
  })
})

describe('elección de ejercicios y lecciones generadas', () => {
  it('prioriza ejercicios no vistos y variados', () => {
    const candidates = questionsForSkill('instr.compania')
    const seen: AnswerRecord[] = [
      {
        sessionId: 's',
        lessonId: 'l',
        questionId: 'instr1-q1',
        answer: { kind: 'choice', optionId: 'a' },
        correct: true,
        skill: 'instr.compania',
        answeredAt: '2026-11-20T10:00:00.000Z',
      },
    ]
    const picked = pickQuestions(candidates, seen, 4)
    expect(picked).toHaveLength(4)
    expect(picked.map((q) => q.id)).not.toContain('instr1-q1')
    expect(pickQuestions(candidates, seen, 4)).toEqual(picked)
  })

  it('reconstruye prácticas y repasos a partir de su id', () => {
    const ids = ['v:instr-te:мёд', 'instr1-q1']
    const practice = getLesson(practiceLessonId('instr.compania', ids))!
    expect(practice.questions.map((q) => q.id)).toEqual(ids)
    const review = getLesson(reviewLessonId(new Date(2026, 10, 23), ids))!
    expect(review.type).toBe('repaso')
    expect(review.questions).toHaveLength(2)
    expect(getLesson(practiceLessonId('instr.compania', ['no-existe']))).toBeUndefined()
    // Formato antiguo (fase 3): todos los ejercicios fijos del conocimiento.
    expect(getLesson('practica:instr.compania')!.questions.length).toBeGreaterThan(0)
  })

  it('las variantes dan a cada conocimiento suficientes ejercicios distintos', () => {
    const index = buildQuestionIndex(LESSONS, VARIANTS)
    for (const skill of ['instr.compania', 'instr.profesion', 'gen.cantidad', 'dat.k', 'mov.conjugacion'] as const) {
      expect(index.availableBySkill.get(skill)!, skill).toBeGreaterThanOrEqual(5)
    }
  })
})
