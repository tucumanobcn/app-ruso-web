import { describe, expect, it } from 'vitest'
import { backupFileName, parseBackup, serializeBackup } from './backup'
import { createEmptyProgress, parseProgress } from './storage'

const v1Data = {
  version: 1,
  createdAt: '2026-11-22T10:00:00.000Z',
  preferences: { theme: 'dark' },
  activeSession: {
    id: 's2',
    lessonId: 'instrumental-1',
    startedAt: '2026-11-22T11:00:00.000Z',
    step: 1,
    optionOrder: { 'instr1-q1': ['b', 'a', 'd', 'c'] },
    answers: { 'instr1-q1': 'c' },
  },
  completedSessions: [
    {
      id: 's1',
      lessonId: 'instrumental-1',
      startedAt: '2026-11-22T10:00:00.000Z',
      finishedAt: '2026-11-22T10:05:00.000Z',
      optionOrder: { 'instr1-q1': ['a', 'b', 'c', 'd'] },
      answers: { 'instr1-q1': 'a' },
      correctCount: 1,
      total: 5,
    },
  ],
  answerLog: [
    {
      sessionId: 's1',
      lessonId: 'instrumental-1',
      questionId: 'instr1-q1',
      optionId: 'a',
      correct: true,
      skill: 'instr.compania',
      answeredAt: '2026-11-22T10:01:00.000Z',
    },
  ],
}

describe('parseProgress', () => {
  it('acepta datos vacíos de la versión actual', () => {
    const empty = createEmptyProgress()
    expect(parseProgress(JSON.parse(JSON.stringify(empty)))).toEqual(empty)
  })

  it('migra los datos de la versión 1', () => {
    const migrated = parseProgress(v1Data)
    expect(migrated).not.toBeNull()
    expect(migrated!.version).toBe(2)
    expect(migrated!.preferences.theme).toBe('dark')
    expect(migrated!.activeSession!.answers['instr1-q1']).toEqual({ kind: 'choice', optionId: 'c' })
    expect(migrated!.completedSessions[0].answers['instr1-q1']).toEqual({
      kind: 'choice',
      optionId: 'a',
    })
    expect(migrated!.answerLog[0]).not.toHaveProperty('optionId')
    expect(migrated!.answerLog[0].answer).toEqual({ kind: 'choice', optionId: 'a' })
  })

  it('rechaza datos que no son progreso', () => {
    expect(parseProgress(null)).toBeNull()
    expect(parseProgress({ version: 99 })).toBeNull()
    expect(parseProgress({ ...createEmptyProgress(), answerLog: [{ foo: 1 }] })).toBeNull()
  })

  it('conserva el diagnóstico y lo inicia vacío en copias antiguas o dañadas', () => {
    expect(parseProgress(v1Data)!.diagnostic).toEqual({ blocks: {} })
    const block = { startedAt: '2026-11-23T10:00:00.000Z', asked: ['a'], optionOrder: { a: ['x', 'y'] }, answers: {} }
    const withDiagnostic = { ...createEmptyProgress(), diagnostic: { blocks: { 'casos-1': block } } }
    expect(parseProgress(JSON.parse(JSON.stringify(withDiagnostic)))!.diagnostic.blocks['casos-1']).toEqual(block)
    const broken = { ...createEmptyProgress(), diagnostic: { blocks: { 'casos-1': { asked: 'no' } } } }
    expect(parseProgress(broken)!.diagnostic).toEqual({ blocks: {} })
  })

  it('añade el objetivo semanal a datos antiguos y descarta valores fuera de rango', () => {
    expect(parseProgress(v1Data)!.preferences.weeklyGoal).toBe(5)
    const withGoal = (weeklyGoal: unknown) => ({ ...createEmptyProgress(), preferences: { theme: 'light', weeklyGoal } })
    expect(parseProgress(withGoal(3))!.preferences.weeklyGoal).toBe(3)
    expect(parseProgress(withGoal(14))!.preferences.weeklyGoal).toBe(14)
    expect(parseProgress(withGoal(0))!.preferences.weeklyGoal).toBe(5)
    expect(parseProgress(withGoal(99))!.preferences.weeklyGoal).toBe(5)
    expect(parseProgress(withGoal('7'))!.preferences.weeklyGoal).toBe(5)
  })

  it('conserva los avisos y la fecha de la última copia, y descarta avisos mal formados', () => {
    expect(parseProgress(v1Data)!.contentReports).toEqual({})
    expect(parseProgress(v1Data)!.lastExportAt).toBeNull()
    const report = { reason: 'otra-valida', reportedAt: '2026-11-23T10:00:00.000Z' }
    const data = { ...createEmptyProgress(), contentReports: { 'rep1-q2': report }, lastExportAt: '2026-11-20T10:00:00.000Z' }
    const parsed = parseProgress(JSON.parse(JSON.stringify(data)))!
    expect(parsed.contentReports['rep1-q2']).toEqual(report)
    expect(parsed.lastExportAt).toBe('2026-11-20T10:00:00.000Z')
    const broken = { ...createEmptyProgress(), contentReports: { x: { reason: 'inventado', reportedAt: 'hoy' } } }
    expect(parseProgress(broken)!.contentReports).toEqual({})
  })

  it('usa el tema automático si la preferencia no es válida', () => {
    const data = { ...createEmptyProgress(), preferences: { theme: 'rosa' } }
    expect(parseProgress(data)!.preferences.theme).toBe('system')
  })
})

describe('copias de seguridad', () => {
  it('exporta e importa sin perder datos', () => {
    const data = parseProgress(v1Data)!
    expect(parseBackup(serializeBackup(data))).toEqual(data)
  })

  it('importa una copia que contiene datos de la versión 1', () => {
    const text = JSON.stringify({ app: 'app-ruso', exportedAt: 'x', data: v1Data })
    expect(parseBackup(text).completedSessions).toHaveLength(1)
  })

  it('explica por qué rechaza un archivo', () => {
    expect(() => parseBackup('no es json')).toThrow('El archivo no es un JSON válido.')
    expect(() => parseBackup('{"app":"otra"}')).toThrow('no parece una copia')
    expect(() => parseBackup('{"app":"app-ruso","data":{}}')).toThrow('incompleta')
  })

  it('nombra el archivo con la fecha', () => {
    expect(backupFileName(new Date('2026-11-22T12:00:00Z'))).toBe('app-ruso-progreso-2026-11-22.json')
  })
})
