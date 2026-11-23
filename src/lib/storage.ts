/**
 * Formato del progreso guardado: tipos, datos vacíos, validación y migración de
 * versiones. Dónde se guarda (IndexedDB o localStorage) está en persistence.ts.
 */
import type { AnswerValue } from './answers'

/** Clave de localStorage, usada hasta la fase 6 y como alternativa si no hay IndexedDB. */
export const STORAGE_KEY = 'app-ruso:progreso'
/** Claves de versiones anteriores, que se migran al cargar. */
export const LEGACY_KEY_V1 = 'app-ruso:progreso:v1'

export const CURRENT_VERSION = 2

export type ThemePreference = 'system' | 'light' | 'dark'

export const DEFAULT_WEEKLY_GOAL = 5
export const MIN_WEEKLY_GOAL = 1
export const MAX_WEEKLY_GOAL = 14

/** Una respuesta individual, guardada para el futuro motor de dominio y repasos. */
export interface AnswerRecord {
  sessionId: string
  lessonId: string
  questionId: string
  answer: AnswerValue
  correct: boolean
  skill: string
  errorType?: string
  answeredAt: string
}

/** Lección en curso: permite interrumpir y retomar. */
export interface ActiveSession {
  id: string
  lessonId: string
  startedAt: string
  /** 'intro' = explicación inicial; número = índice de la pregunta actual. */
  step: 'intro' | number
  /** Orden barajado de los elementos de cada pregunta. */
  optionOrder: Record<string, string[]>
  /** Respuesta por pregunta (la primera es la que cuenta). */
  answers: Record<string, AnswerValue>
}

export interface CompletedSession {
  id: string
  lessonId: string
  startedAt: string
  finishedAt: string
  optionOrder: Record<string, string[]>
  answers: Record<string, AnswerValue>
  correctCount: number
  total: number
}

/** Estado de un bloque del diagnóstico. Las preguntas se eligen de una en una (adaptativo). */
export interface DiagnosticBlockState {
  startedAt: string
  finishedAt?: string
  /** Preguntas ya planteadas, en orden. */
  asked: string[]
  optionOrder: Record<string, string[]>
  answers: Record<string, AnswerValue>
}

export interface DiagnosticState {
  blocks: Record<string, DiagnosticBlockState>
}

/** Motivos por los que el estudiante avisa de un ejercicio dudoso (se eligen tocando). */
export const REPORT_REASONS = {
  'respuesta-dudosa': 'La respuesta que da por correcta me parece incorrecta',
  'otra-valida': 'Mi respuesta también me parece válida',
  explicacion: 'La explicación es confusa o incorrecta',
  traduccion: 'La traducción no es natural',
  otro: 'Otro problema',
} as const

export type ReportReason = keyof typeof REPORT_REASONS

/** Aviso sobre un ejercicio: deja de salir y sus respuestas no cuentan para el dominio. */
export interface ContentReport {
  reason: ReportReason
  reportedAt: string
}

export interface ProgressData {
  version: typeof CURRENT_VERSION
  createdAt: string
  preferences: {
    theme: ThemePreference
    /** Sesiones por semana que el estudiante se propone (objetivo semanal). */
    weeklyGoal: number
  }
  activeSession: ActiveSession | null
  completedSessions: CompletedSession[]
  answerLog: AnswerRecord[]
  /** Vídeos y recursos externos abiertos: id → fecha de la última vez. */
  viewedResources: Record<string, string>
  /** Diagnóstico de nivel por bloques. */
  diagnostic: DiagnosticState
  /** Ejercicios marcados como dudosos: id de pregunta → aviso. */
  contentReports: Record<string, ContentReport>
  /** Fecha de la última copia exportada (null si nunca). */
  lastExportAt: string | null
}

export function createEmptyProgress(): ProgressData {
  return {
    version: CURRENT_VERSION,
    createdAt: new Date().toISOString(),
    preferences: { theme: 'system', weeklyGoal: DEFAULT_WEEKLY_GOAL },
    activeSession: null,
    completedSessions: [],
    answerLog: [],
    viewedResources: {},
    diagnostic: { blocks: {} },
    contentReports: {},
    lastExportAt: null,
  }
}

// ---------- Validación y migración (funciones puras) ----------

type Obj = Record<string, unknown>

function isObj(value: unknown): value is Obj {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isAnswerValue(value: unknown): value is AnswerValue {
  if (!isObj(value)) return false
  switch (value.kind) {
    case 'choice':
      return typeof value.optionId === 'string'
    case 'multi':
      return Array.isArray(value.optionIds) && value.optionIds.every((id) => typeof id === 'string')
    case 'order':
      return (
        Array.isArray(value.tokenIndexes) &&
        value.tokenIndexes.every((i) => typeof i === 'number')
      )
    case 'match':
      return isObj(value.pairs) && Object.values(value.pairs).every((v) => typeof v === 'string')
    default:
      return false
  }
}

function isAnswerMap(value: unknown): value is Record<string, AnswerValue> {
  return isObj(value) && Object.values(value).every(isAnswerValue)
}

function isDiagnostic(value: unknown): value is DiagnosticState {
  if (!isObj(value) || !isObj(value.blocks)) return false
  return Object.values(value.blocks).every(
    (block) =>
      isObj(block) &&
      typeof block.startedAt === 'string' &&
      (block.finishedAt === undefined || typeof block.finishedAt === 'string') &&
      Array.isArray(block.asked) &&
      block.asked.every((id) => typeof id === 'string') &&
      isOrderMap(block.optionOrder) &&
      isAnswerMap(block.answers),
  )
}

function isOrderMap(value: unknown): value is Record<string, string[]> {
  return (
    isObj(value) &&
    Object.values(value).every((v) => Array.isArray(v) && v.every((id) => typeof id === 'string'))
  )
}

function isSessionBase(value: Obj): boolean {
  return (
    typeof value.id === 'string' &&
    typeof value.lessonId === 'string' &&
    typeof value.startedAt === 'string' &&
    isOrderMap(value.optionOrder) &&
    isAnswerMap(value.answers)
  )
}

function isActiveSession(value: unknown): value is ActiveSession {
  return (
    isObj(value) &&
    isSessionBase(value) &&
    (value.step === 'intro' || typeof value.step === 'number')
  )
}

function isCompletedSession(value: unknown): value is CompletedSession {
  return (
    isObj(value) &&
    isSessionBase(value) &&
    typeof value.finishedAt === 'string' &&
    typeof value.correctCount === 'number' &&
    typeof value.total === 'number'
  )
}

function isAnswerRecord(value: unknown): value is AnswerRecord {
  return (
    isObj(value) &&
    typeof value.sessionId === 'string' &&
    typeof value.lessonId === 'string' &&
    typeof value.questionId === 'string' &&
    typeof value.correct === 'boolean' &&
    typeof value.skill === 'string' &&
    typeof value.answeredAt === 'string' &&
    isAnswerValue(value.answer)
  )
}

function isContentReports(value: unknown): value is Record<string, ContentReport> {
  return (
    isObj(value) &&
    Object.values(value).every(
      (r) => isObj(r) && typeof r.reason === 'string' && r.reason in REPORT_REASONS && typeof r.reportedAt === 'string',
    )
  )
}

function isTheme(value: unknown): value is ThemePreference {
  return value === 'system' || value === 'light' || value === 'dark'
}

/** v1 guardaba las respuestas como id de opción; v2 como AnswerValue. */
function migrateV1(v1: Obj): Obj {
  const toAnswers = (answers: unknown) =>
    isObj(answers)
      ? Object.fromEntries(
          Object.entries(answers).map(([qid, optionId]) => [qid, { kind: 'choice', optionId }]),
        )
      : answers
  const migrateSession = (session: unknown) =>
    isObj(session) ? { ...session, answers: toAnswers(session.answers) } : session

  return {
    ...v1,
    version: 2,
    activeSession: v1.activeSession ? migrateSession(v1.activeSession) : null,
    completedSessions: Array.isArray(v1.completedSessions)
      ? v1.completedSessions.map(migrateSession)
      : v1.completedSessions,
    answerLog: Array.isArray(v1.answerLog)
      ? v1.answerLog.map((record) => {
          if (!isObj(record)) return record
          const { optionId, ...rest } = record
          return { ...rest, answer: { kind: 'choice', optionId } }
        })
      : v1.answerLog,
  }
}

/**
 * Convierte datos desconocidos (de localStorage o de un archivo importado) en
 * ProgressData actual, migrando versiones antiguas. Devuelve null si no son válidos.
 */
export function parseProgress(value: unknown): ProgressData | null {
  if (!isObj(value)) return null
  let data: Obj = value
  if (data.version === 1) data = migrateV1(data)
  if (data.version !== CURRENT_VERSION) return null

  const preferences = isObj(data.preferences) ? data.preferences : {}
  if (
    typeof data.createdAt !== 'string' ||
    !Array.isArray(data.completedSessions) ||
    !data.completedSessions.every(isCompletedSession) ||
    !Array.isArray(data.answerLog) ||
    !data.answerLog.every(isAnswerRecord) ||
    !(data.activeSession === null || isActiveSession(data.activeSession))
  ) {
    return null
  }

  return {
    version: CURRENT_VERSION,
    createdAt: data.createdAt,
    preferences: {
      theme: isTheme(preferences.theme) ? preferences.theme : 'system',
      // Añadido en la fase 6: si falta o no es válido, se usa el valor por defecto.
      weeklyGoal:
        typeof preferences.weeklyGoal === 'number' && preferences.weeklyGoal >= MIN_WEEKLY_GOAL && preferences.weeklyGoal <= MAX_WEEKLY_GOAL
          ? Math.round(preferences.weeklyGoal)
          : DEFAULT_WEEKLY_GOAL,
    },
    activeSession: data.activeSession,
    completedSessions: data.completedSessions,
    answerLog: data.answerLog,
    // Campo añadido después de la v2: si falta o no es válido, se empieza vacío.
    viewedResources:
      isObj(data.viewedResources) &&
      Object.values(data.viewedResources).every((v) => typeof v === 'string')
        ? (data.viewedResources as Record<string, string>)
        : {},
    // Añadido en la fase 5: copias anteriores no lo tienen.
    diagnostic: isDiagnostic(data.diagnostic) ? data.diagnostic : { blocks: {} },
    // Añadidos en la fase 7.
    contentReports: isContentReports(data.contentReports) ? data.contentReports : {},
    lastExportAt: typeof data.lastExportAt === 'string' ? data.lastExportAt : null,
  }
}
