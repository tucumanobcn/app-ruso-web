import { describe, expect, it } from 'vitest'
import { SKILLS, type SkillId } from '../content/glossary'
import { ALL_QUESTIONS, LESSONS } from '../content/lessons'
import { VARIANTS } from '../content/variants'
import { createEmptyProgress, type AnswerRecord } from '../lib/storage'
import {
  blockResults,
  DIAGNOSTIC_BLOCKS,
  diagnosticSessionId,
  probeOrder,
  probeQuestion,
  summarizeDiagnostic,
  type ProbeAnswer,
} from './diagnostic'
import { computeMastery } from './mastery'
import { buildDailyPlan, errorSessionIds, mixedSessionIds, vocabularySessionIds } from './planner'
import { COMPETENCIES, competencyProfile, globalLevel, skillScore } from './profile'
import { buildQuestionIndex } from './questionIndex'

const block = DIAGNOSTIC_BLOCKS.find((b) => b.id === 'casos-1')!
const answer = (skill: SkillId, correct: boolean, n = 1): ProbeAnswer => ({ questionId: `${skill}-${n}`, skill, correct })
const byId = new Map(ALL_QUESTIONS.map((q) => [q.id, q]))
const index = buildQuestionIndex(LESSONS, VARIANTS)

describe('diagnóstico adaptativo', () => {
  it('sondea primero los conocimientos de nivel más bajo', () => {
    const order = probeOrder(block)
    expect(order.slice(0, 4).every((s) => ['prep.lugar', 'acus.objeto', 'prep.v-na', 'prep.o', 'acus.animacion', 'acus.direccion'].includes(s))).toBe(true)
    expect(order.indexOf('gen.negacion')).toBeGreaterThan(order.indexOf('prep.lugar'))
  })

  it('un acierto supera el conocimiento; un fallo pide una segunda pregunta', () => {
    const first = blockResults(block, [])
    expect(first.next).toBe(probeOrder(block)[0])
    const afterHit = blockResults(block, [answer('prep.lugar', true)])
    expect(afterHit.results['prep.lugar'].status).toBe('superado')
    expect(afterHit.next).not.toBe('prep.lugar')
    const afterMiss = blockResults(block, [answer('prep.lugar', false)])
    expect(afterMiss.next).toBe('prep.lugar')
    const doubtful = blockResults(block, [answer('prep.lugar', false), answer('prep.lugar', true, 2)])
    expect(doubtful.results['prep.lugar'].status).toBe('dudoso')
  })

  it('dos fallos en algo esencial omiten lo que depende de ello', () => {
    const result = blockResults(block, [answer('acus.objeto', false), answer('acus.objeto', false, 2)])
    expect(result.results['acus.objeto'].status).toBe('debil')
    expect(result.results['acus.animacion'].status).toBe('omitido')
    expect(result.results['acus.direccion'].status).toBe('omitido')
    expect(result.results['acus.animacion'].note).toContain(SKILLS['acus.objeto'].label)
  })

  it('termina al resolver todo o al llegar al máximo de preguntas', () => {
    const all = probeOrder(block).map((s) => answer(s, true))
    expect(blockResults(block, all).finished).toBe(true)
    const many = Array.from({ length: block.maxQuestions }, (_, i) => answer(probeOrder(block)[i % 2], false, i))
    expect(blockResults(block, many).next).toBeNull()
  })

  it('elige preguntas no vistas, del tema principal y de opción única', () => {
    const question = probeQuestion('instr.compania', ALL_QUESTIONS, [], [])!
    expect(question.skill).toBe('instr.compania')
    expect(question.kind).toBe('choice')
    const seenLog = [{ questionId: question.id }] as AnswerRecord[]
    expect(probeQuestion('instr.compania', ALL_QUESTIONS, seenLog, [])!.id).not.toBe(question.id)
  })

  it('reconstruye los resultados desde el historial', () => {
    const data = createEmptyProgress()
    const startedAt = '2026-11-23T10:00:00.000Z'
    data.diagnostic.blocks['casos-1'] = { startedAt, asked: [], optionOrder: {}, answers: {} }
    const q = probeQuestion('prep.lugar', ALL_QUESTIONS, [], [])!
    data.answerLog.push({
      sessionId: diagnosticSessionId('casos-1', startedAt),
      lessonId: 'diagnostico',
      questionId: q.id,
      answer: { kind: 'choice', optionId: 'a' },
      correct: true,
      skill: q.skill,
      answeredAt: '2026-11-23T10:01:00.000Z',
    })
    const summary = summarizeDiagnostic(data.diagnostic, data.answerLog, byId)
    expect(summary.probes['prep.lugar']?.status).toBe('superado')
    expect(summary.byBlock['casos-1'].finished).toBe(false)
  })
})

describe('perfil por competencias', () => {
  const empty = computeMastery([], index, Date.parse('2026-11-23'))

  it('cada conocimiento pertenece exactamente a una competencia', () => {
    const all = COMPETENCIES.flatMap((c) => c.skills)
    expect(new Set(all).size).toBe(all.length)
    expect([...all].sort()).toEqual(Object.keys(SKILLS).sort())
  })

  it('sin datos no inventa ningún nivel', () => {
    const profile = competencyProfile(empty, {})
    expect(profile.every((p) => p.label === 'Sin evaluar')).toBe(true)
    expect(globalLevel(profile)).toBeNull()
  })

  it('usa el diagnóstico mientras no se vuelva a practicar', () => {
    expect(skillScore(empty['prep.lugar'], { status: 'superado', at: 0 })).toBe(0.8)
    expect(skillScore(empty['prep.lugar'], { status: 'debil', at: 0 })).toBeLessThan(0.45)
    expect(skillScore(empty['prep.lugar'])).toBeNull()
    // Omitir no es evidencia: no cuenta ni a favor ni en contra.
    expect(skillScore(empty['acus.animacion'], { status: 'omitido', at: 0 })).toBeNull()
  })

  it('da un nivel granular por competencia', () => {
    const probes = Object.fromEntries(
      COMPETENCIES[0].skills.map((s) => [s, { status: 'superado' as const, at: 0 }]),
    )
    const profile = competencyProfile(empty, probes)
    expect(profile[0].label).toBe('A2 consolidado')
    expect(profile[1].label).toBe('Sin evaluar')
    expect(globalLevel(profile)?.label).toBe('A2 consolidado')
  })
})

describe('planificador', () => {
  const now = Date.parse('2026-11-23T12:00:00.000Z')

  it('sin datos propone empezar por el diagnóstico', () => {
    const data = createEmptyProgress()
    const mastery = computeMastery([], index, now)
    const plan = buildDailyPlan({ data, mastery, due: [], diagnostic: summarizeDiagnostic(data.diagnostic, [], byId), now })
    expect(plan.today[0].kind).toBe('diagnostico')
    expect(plan.later.some((p) => p.kind === 'leccion')).toBe(true)
  })

  it('con historial combina refuerzo y lección, y explica por qué', () => {
    const data = createEmptyProgress()
    const at = (h: number) => new Date(now - h * 3600_000).toISOString()
    for (let i = 0; i < 16; i++) {
      data.answerLog.push({
        sessionId: 's',
        lessonId: 'prepositivo-1',
        questionId: i % 2 ? 'acus1-q3' : 'acus1-q1',
        answer: { kind: 'choice', optionId: 'b' },
        correct: false,
        skill: 'acus.objeto',
        errorType: 'terminacion.fem-ь',
        answeredAt: at(2),
      })
    }
    const mastery = computeMastery(data.answerLog, index, now)
    const plan = buildDailyPlan({ data, mastery, due: [], diagnostic: summarizeDiagnostic(data.diagnostic, data.answerLog, byId), now })
    const reinforce = plan.today.find((p) => p.kind === 'refuerzo')
    expect(reinforce?.title).toContain(SKILLS['acus.objeto'].label)
    expect(reinforce?.reason).toMatch(/esencial|requisito/)
    expect(plan.practiceIds.length).toBeGreaterThan(0)
    expect([...plan.today, ...plan.later].some((p) => p.kind === 'leccion')).toBe(true)
  })

  it('construye sesiones de errores, mixtas y de vocabulario', () => {
    const log: AnswerRecord[] = [
      { sessionId: 's', lessonId: 'l', questionId: 'instr1-q1', answer: { kind: 'choice', optionId: 'b' }, correct: false, skill: 'instr.compania', answeredAt: new Date(now - 3600_000).toISOString() },
    ]
    expect(errorSessionIds(log, now).length).toBeGreaterThan(0)
    expect(mixedSessionIds(computeMastery(log, index, now), log)).toEqual([])
    expect(vocabularySessionIds([]).length).toBe(8)
  })
})
