import { describe, expect, it } from 'vitest'
import { LESSONS } from '../content/lessons'
import { KNOWLEDGE_MAP } from '../content/knowledgeMap'
import type { AnswerRecord, CompletedSession } from '../lib/storage'
import { computeMastery } from './mastery'
import { buildQuestionIndex } from './questionIndex'
import { lessonHistory, levelPaths, studyMinutes, weeklyGoal, weeklyStats, weekStart } from './stats'

/** Fechas en hora local, como las usa la app. Miércoles 25/11/2026, 10:00. */
const NOW = new Date(2026, 10, 25, 10, 0).getTime()
const at = (daysAgo: number, hour: number, minute = 0, second = 0) =>
  new Date(2026, 10, 25 - daysAgo, hour, minute, second).toISOString()

function answer(answeredAt: string, correct = true): AnswerRecord {
  return {
    sessionId: 's',
    lessonId: 'instrumental-1',
    questionId: 'q',
    answer: { kind: 'choice', optionId: 'a' },
    correct,
    skill: 'instr.compania',
    answeredAt,
  }
}

function session(id: string, startedAt: string, finishedAt: string, correctCount = 4, total = 5): CompletedSession {
  return { id, lessonId: 'instrumental-1', startedAt, finishedAt, optionOrder: {}, answers: {}, correctCount, total }
}

describe('studyMinutes', () => {
  it('suma los huecos entre respuestas con un máximo de 3 minutos y 1 minuto al empezar cada tanda', () => {
    const log = [
      answer(at(0, 9, 0)), // empieza la tanda: 1 min
      answer(at(0, 9, 1)), // +1
      answer(at(0, 9, 3)), // +2
      answer(at(0, 9, 9)), // pausa de 6 min: cuenta 3
      answer(at(0, 11, 0)), // pausa larga: nueva tanda, 1 min
    ]
    expect(studyMinutes(log)).toBe(8)
  })

  it('no depende del orden del historial y vale 0 sin respuestas', () => {
    expect(studyMinutes([])).toBe(0)
    const log = [answer(at(0, 9, 2)), answer(at(0, 9, 0))]
    expect(studyMinutes(log)).toBe(3)
  })
})

describe('weekStart', () => {
  it('devuelve el lunes a las 00:00 de la misma semana', () => {
    const start = new Date(weekStart(NOW))
    expect(start.getDay()).toBe(1)
    expect(start.getHours()).toBe(0)
    expect(start.getDate()).toBe(23)
    // Un domingo pertenece a la semana que empezó el lunes anterior.
    expect(new Date(weekStart(new Date(2026, 10, 29, 23, 0).getTime())).getDate()).toBe(23)
  })
})

describe('weeklyStats', () => {
  it('reparte respuestas y sesiones por semana, de la más antigua a la actual', () => {
    const log = [answer(at(0, 9, 0)), answer(at(0, 9, 1), false), answer(at(7, 9, 0))]
    const sessions = [session('a', at(0, 9, 0), at(0, 9, 5)), session('b', at(7, 9, 0), at(7, 9, 6))]
    const weeks = weeklyStats(log, sessions, NOW, 4)
    expect(weeks).toHaveLength(4)
    expect(weeks[3].start).toBe(weekStart(NOW))
    expect(weeks[3]).toMatchObject({ answers: 2, correct: 1, accuracy: 0.5, minutes: 2, sessions: 1 })
    expect(weeks[2]).toMatchObject({ answers: 1, correct: 1, accuracy: 1, sessions: 1 })
    // Sin respuestas no hay porcentaje: no se inventa un 0 %.
    expect(weeks[0].accuracy).toBeNull()
    expect(weeks[1].start).toBeLessThan(weeks[2].start)
  })
})

describe('weeklyGoal', () => {
  it('cuenta solo las sesiones terminadas desde el lunes', () => {
    const sessions = [
      session('a', at(0, 9), at(0, 9, 5)),
      session('b', at(2, 9), at(2, 9, 5)), // lunes 23
      session('c', at(3, 9), at(3, 9, 5)), // domingo 22: semana anterior
    ]
    expect(weeklyGoal(sessions, 2, NOW)).toEqual({ target: 2, done: 2, reached: true })
    expect(weeklyGoal(sessions, 5, NOW)).toEqual({ target: 5, done: 2, reached: false })
  })
})

describe('lessonHistory', () => {
  it('ordena de la más reciente a la más antigua y limita la duración de una sesión olvidada', () => {
    const sessions = [
      session('vieja', at(3, 9), at(3, 9, 7)),
      session('olvidada', at(1, 9), at(0, 9)),
      session('rapida', at(0, 10, 0, 0), at(0, 10, 0, 20)),
    ]
    const history = lessonHistory(sessions)
    expect(history.map((h) => h.id)).toEqual(['rapida', 'olvidada', 'vieja'])
    expect(history[0].minutes).toBe(1)
    expect(history[1].minutes).toBe(30)
    expect(history[2].minutes).toBe(7)
    expect(lessonHistory(sessions, 2)).toHaveLength(2)
  })
})

describe('levelPaths', () => {
  it('sin datos, faltan todos los esenciales y primero los que más bloquean', () => {
    const index = buildQuestionIndex(LESSONS)
    const mastery = computeMastery([], index, NOW)
    const [a1, a2] = levelPaths(mastery)
    expect(a1.level).toBe('A1')
    expect(a2.level).toBe('A2')
    const essentialA1 = Object.values(KNOWLEDGE_MAP).filter((n) => n.level === 'A1' && n.importance === 'esencial')
    expect(a1.essentialTotal).toBe(essentialA1.length)
    expect(a1.essentialMastered).toBe(0)
    expect(a1.missing).toHaveLength(essentialA1.length)
    expect(a1.complete).toBe(false)
    for (let i = 1; i < a1.missing.length; i++) {
      expect(a1.missing[i - 1].blocks).toBeGreaterThanOrEqual(a1.missing[i].blocks)
    }
  })
})
