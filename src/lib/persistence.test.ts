import { describe, expect, it } from 'vitest'
import { questionsForSkill } from '../content/lessons'
import { questionOrigin } from '../content/origin'
import { withoutReported } from './contentReports'
import { createMemoryStore, createWriter, openProgress, PROGRESS_KEY, type KeyValueStore } from './persistence'
import { createEmptyProgress, parseProgress, type ProgressData } from './storage'

function progressWithAnswers(n: number): ProgressData {
  const data = createEmptyProgress()
  data.answerLog = Array.from({ length: n }, (_, i) => ({
    sessionId: 's',
    lessonId: 'instrumental-1',
    questionId: `q${i}`,
    answer: { kind: 'choice' as const, optionId: 'a' },
    correct: true,
    skill: 'instr.compania',
    answeredAt: '2026-11-20T10:00:00.000Z',
  }))
  return data
}

describe('openProgress', () => {
  it('empieza vacío si no hay nada guardado', async () => {
    const opened = await openProgress(createMemoryStore({}, 'indexeddb'), createMemoryStore({}, 'localstorage'))
    expect(opened.data.answerLog).toEqual([])
    expect(opened.store.kind).toBe('indexeddb')
    expect(opened.migrated).toBe(false)
  })

  it('pasa los datos de localStorage a IndexedDB y solo entonces los borra de localStorage', async () => {
    const primary = createMemoryStore({}, 'indexeddb')
    const legacy = createMemoryStore({ [PROGRESS_KEY]: progressWithAnswers(3) }, 'localstorage')
    const opened = await openProgress(primary, legacy)
    expect(opened.migrated).toBe(true)
    expect(opened.store).toBe(primary)
    expect(opened.data.answerLog).toHaveLength(3)
    expect(parseProgress(await primary.get(PROGRESS_KEY))!.answerLog).toHaveLength(3)
    expect(await legacy.get(PROGRESS_KEY)).toBeUndefined()
  })

  it('migra también la clave de la versión 1', async () => {
    const v1 = { version: 1, createdAt: '2026-11-01T00:00:00.000Z', preferences: { theme: 'dark' }, activeSession: null, completedSessions: [], answerLog: [] }
    const legacy = createMemoryStore({ 'progreso:v1': v1 }, 'localstorage')
    const opened = await openProgress(createMemoryStore({}, 'indexeddb'), legacy)
    expect(opened.migrated).toBe(true)
    expect(opened.data.preferences.theme).toBe('dark')
    expect(await legacy.get('progreso:v1')).toBeUndefined()
  })

  it('si no puede copiar a IndexedDB, sigue con localStorage sin borrar nada', async () => {
    const failing: KeyValueStore = {
      ...createMemoryStore({}, 'indexeddb'),
      set: () => Promise.reject(new Error('cuota llena')),
    }
    const legacy = createMemoryStore({ [PROGRESS_KEY]: progressWithAnswers(2) }, 'localstorage')
    const opened = await openProgress(failing, legacy)
    expect(opened.store).toBe(legacy)
    expect(opened.migrated).toBe(false)
    expect(opened.data.answerLog).toHaveLength(2)
    expect(await legacy.get(PROGRESS_KEY)).toBeDefined()
  })

  it('si el almacén principal falla al leer, usa el anterior', async () => {
    const broken: KeyValueStore = {
      ...createMemoryStore({}, 'indexeddb'),
      get: () => Promise.reject(new Error('base de datos dañada')),
    }
    const legacy = createMemoryStore({ [PROGRESS_KEY]: progressWithAnswers(1) }, 'localstorage')
    const opened = await openProgress(broken, legacy)
    expect(opened.store).toBe(legacy)
    expect(opened.data.answerLog).toHaveLength(1)
  })

  it('no descarta en silencio datos ilegibles: guarda una copia aparte', async () => {
    const primary = createMemoryStore({ [PROGRESS_KEY]: { version: 99 } }, 'indexeddb')
    const opened = await openProgress(primary, null)
    expect(opened.unreadable).toBe(true)
    expect(opened.data.answerLog).toEqual([])
    expect(await primary.get('progreso:copia-ilegible')).toEqual({ version: 99 })
  })
})

describe('createWriter', () => {
  it('escribe en orden y, si llegan varios cambios seguidos, solo el último', async () => {
    const writes: number[] = []
    const store = createMemoryStore({}, 'indexeddb')
    const slow: KeyValueStore = {
      ...store,
      set: async (key, value) => {
        await new Promise((r) => setTimeout(r, 5))
        writes.push((value as ProgressData).answerLog.length)
        await store.set(key, value)
      },
    }
    const results: boolean[] = []
    const writer = createWriter(slow, (ok) => results.push(ok))
    writer.save(progressWithAnswers(1))
    writer.save(progressWithAnswers(2))
    writer.save(progressWithAnswers(3))
    await new Promise((r) => setTimeout(r, 40))
    expect(writes).toEqual([1, 3])
    expect(results).toEqual([true])
    expect((await store.get(PROGRESS_KEY) as ProgressData).answerLog).toHaveLength(3)
  })

  it('avisa si la escritura falla', async () => {
    const results: boolean[] = []
    const writer = createWriter(
      { ...createMemoryStore(), set: () => Promise.reject(new Error('sin espacio')) },
      (ok) => results.push(ok),
    )
    writer.save(createEmptyProgress())
    await new Promise((r) => setTimeout(r, 5))
    expect(results).toEqual([false])
  })
})

describe('ejercicios con aviso', () => {
  it('quita del dominio las respuestas a ejercicios marcados', () => {
    const log = progressWithAnswers(3).answerLog
    expect(withoutReported(log, {})).toBe(log)
    expect(withoutReported(log, { q1: {} }).map((r) => r.questionId)).toEqual(['q0', 'q2'])
  })

  it('no los vuelve a proponer', () => {
    const all = questionsForSkill('instr.compania')
    const [first] = all
    const filtered = questionsForSkill('instr.compania', new Set([first.id]))
    expect(filtered).toHaveLength(all.length - 1)
    expect(filtered.some((q) => q.id === first.id)).toBe(false)
  })

  it('distingue los ejercicios de lección de las variantes de plantilla', () => {
    const all = questionsForSkill('acus.objeto')
    expect(all.some((q) => questionOrigin(q) === 'plantilla')).toBe(true)
    expect(all.some((q) => questionOrigin(q) === 'leccion')).toBe(true)
  })
})
