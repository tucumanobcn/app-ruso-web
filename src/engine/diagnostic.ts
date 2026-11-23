/**
 * Diagnóstico adaptativo en bloques cortos. Cada conocimiento se sondea con una o
 * dos preguntas (de las que nunca has visto, preferiblemente variantes):
 *   - acierto a la primera → superado;
 *   - fallo → segunda pregunta: acierto → dudoso; fallo → débil;
 *   - si un requisito esencial resulta débil, los conocimientos que dependen de él
 *     se omiten (no tiene sentido evaluarlos todavía).
 * Todo se deduce de la lista de preguntas ya respondidas, así que un bloque se puede
 * interrumpir y retomar sin perder nada.
 */
import { SKILLS, type SkillId } from '../content/glossary'
import { KNOWLEDGE_MAP } from '../content/knowledgeMap'
import type { Question } from '../content/types'
import type { AnswerRecord, DiagnosticState } from '../lib/storage'
import type { ProbeRecord } from './profile'

export interface DiagnosticBlock {
  id: string
  title: string
  description: string
  skills: SkillId[]
  maxQuestions: number
}

export const DIAGNOSTIC_BLOCKS: DiagnosticBlock[] = [
  {
    id: 'casos-1',
    title: 'Casos: lugar, objeto y posesión',
    description: 'Prepositivo, acusativo y genitivo en singular, y la elección entre в y на.',
    skills: [
      'prep.lugar',
      'acus.objeto',
      'gen.negacion',
      'gen.posesion',
      'prep.v-na',
      'prep.o',
      'acus.animacion',
      'acus.direccion',
    ],
    maxQuestions: 12,
  },
  {
    id: 'casos-2',
    title: 'Casos: destinatario, compañía y cantidades',
    description: 'Dativo, instrumental, pronombres y el genitivo con números.',
    skills: [
      'dat.destinatario',
      'dat.impersonal',
      'instr.compania',
      'gen.cantidad',
      'dat.k',
      'instr.regimen',
      'instr.profesion',
      'instr.pronombres',
    ],
    maxQuestions: 12,
  },
  {
    id: 'verbos',
    title: 'Verbos: aspecto y movimiento',
    description: 'Aspecto verbal, идти / ходить, ехать / ездить y su conjugación.',
    skills: [
      'aspecto.pasado',
      'aspecto.pares',
      'mov.conjugacion',
      'aspecto.presente-futuro',
      'mov.idti-hodit',
      'mov.ehat-ezdit',
      'mov.transporte',
    ],
    maxQuestions: 11,
  },
  {
    id: 'plural-vocabulario',
    title: 'Plural, vocabulario y comunicación',
    description: 'Los casos en plural, el cuerpo, presentarse y hacer la compra.',
    skills: [
      'plural.nominativo',
      'lex.cuerpo',
      'com.presentarse',
      'plural.genitivo',
      'plural.oblicuos',
      'plural.acusativo',
      'est.bolet',
      'com.compras',
    ],
    maxQuestions: 12,
  },
]

export type ProbeStatus = 'superado' | 'dudoso' | 'debil' | 'omitido' | 'sin-evaluar'

export const PROBE_LABEL: Record<ProbeStatus, string> = {
  superado: 'Superado',
  dudoso: 'Dudoso',
  debil: 'Débil',
  omitido: 'Omitido',
  'sin-evaluar': 'Sin evaluar',
}

/** Una respuesta del diagnóstico: qué conocimiento sondeaba y si fue correcta. */
export interface ProbeAnswer {
  questionId: string
  skill: SkillId
  correct: boolean
}

export interface ProbeResult {
  status: ProbeStatus
  /** Por qué se omitió o se dejó sin evaluar. */
  note?: string
}

const LEVEL_RANK = { A1: 1, A2: 2, B1: 3, B2: 4 } as const

/** Orden de sondeo: primero el nivel más bajo; dentro del mismo nivel, el orden del bloque. */
export function probeOrder(block: DiagnosticBlock): SkillId[] {
  return [...block.skills].sort(
    (a, b) =>
      LEVEL_RANK[KNOWLEDGE_MAP[a].level] - LEVEL_RANK[KNOWLEDGE_MAP[b].level] ||
      block.skills.indexOf(a) - block.skills.indexOf(b),
  )
}

/**
 * Estado de cada conocimiento del bloque a partir de las respuestas dadas.
 * `previous` son los resultados de otros bloques, para omitir por requisitos.
 */
export function blockResults(
  block: DiagnosticBlock,
  answers: ProbeAnswer[],
  previous: Partial<Record<SkillId, ProbeResult>> = {},
): { results: Record<string, ProbeResult>; next: SkillId | null; finished: boolean } {
  const results: Partial<Record<SkillId, ProbeResult>> = {}
  const known = (skill: SkillId) => results[skill] ?? previous[skill]
  let next: SkillId | null = null
  const limitReached = answers.length >= block.maxQuestions

  for (const skill of probeOrder(block)) {
    const weakRequirement = KNOWLEDGE_MAP[skill].requires.find(
      (req) => KNOWLEDGE_MAP[req].importance === 'esencial' && known(req)?.status === 'debil',
    )
    if (weakRequirement) {
      results[skill] = {
        status: 'omitido',
        note: `Se omite porque se apoya en «${SKILLS[weakRequirement].label}», que ha salido débil.`,
      }
      continue
    }
    const own = answers.filter((a) => a.skill === skill)
    if (own.length === 0 || (own.length === 1 && !own[0].correct)) {
      if (next === null && !limitReached) next = skill
      results[skill] = own.length === 0 ? { status: 'sin-evaluar' } : { status: 'dudoso' }
      // Un fallo sin segunda pregunta todavía cuenta como dudoso provisionalmente.
      continue
    }
    if (own[0].correct) results[skill] = { status: 'superado' }
    else results[skill] = { status: own[1].correct ? 'dudoso' : 'debil' }
  }

  // Un conocimiento que se ha quedado esperando su segunda pregunta cuando ya no
  // quedan preguntas: con un solo fallo, se considera débil.
  if (limitReached) {
    for (const skill of block.skills) {
      const own = answers.filter((a) => a.skill === skill)
      if (own.length === 1 && !own[0].correct) results[skill] = { status: 'debil' }
      if (results[skill]?.status === 'sin-evaluar') {
        results[skill] = { status: 'sin-evaluar', note: 'El bloque llegó a su número máximo de preguntas.' }
      }
    }
  }

  return { results: results as Record<string, ProbeResult>, next, finished: next === null }
}

/** Id de sesión de un intento de bloque: permite repetir un bloque sin mezclar intentos. */
export function diagnosticSessionId(blockId: string, startedAt: string): string {
  return `diag:${blockId}:${startedAt}`
}

export interface DiagnosticSummary {
  byBlock: Record<string, { results: Record<string, ProbeResult>; next: SkillId | null; finished: boolean; asked: number }>
  /** Resultado del diagnóstico por conocimiento, con el momento de la última respuesta. */
  probes: Partial<Record<SkillId, ProbeRecord>>
  /** Bloques terminados. */
  finishedBlocks: number
}

/** Reconstruye los resultados de todos los bloques a partir del historial de respuestas. */
export function summarizeDiagnostic(
  state: DiagnosticState,
  log: AnswerRecord[],
  questionById: Map<string, Question>,
): DiagnosticSummary {
  const byBlock: DiagnosticSummary['byBlock'] = {}
  const previous: Partial<Record<SkillId, ProbeResult>> = {}
  const probes: Partial<Record<SkillId, ProbeRecord>> = {}
  let finishedBlocks = 0

  for (const block of DIAGNOSTIC_BLOCKS) {
    const blockState = state.blocks[block.id]
    const sessionId = blockState ? diagnosticSessionId(block.id, blockState.startedAt) : null
    const records = sessionId ? log.filter((r) => r.sessionId === sessionId) : []
    const answers: ProbeAnswer[] = records.flatMap((r) => {
      const question = questionById.get(r.questionId)
      return question ? [{ questionId: r.questionId, skill: question.skill, correct: r.correct }] : []
    })
    const summary = blockResults(block, answers, previous)
    const finished = Boolean(blockState?.finishedAt) || (answers.length > 0 && summary.finished)
    byBlock[block.id] = { ...summary, finished, asked: answers.length }
    if (finished) finishedBlocks += 1

    for (const skill of block.skills) {
      const result = summary.results[skill]
      if (!result || !blockState) continue
      previous[skill] = result
      if (result.status === 'sin-evaluar') continue
      const times = records
        .filter((r) => questionById.get(r.questionId)?.skill === skill)
        .map((r) => Date.parse(r.answeredAt))
      const at = times.length > 0 ? Math.max(...times) : Date.parse(blockState.finishedAt ?? blockState.startedAt)
      probes[skill] = { status: result.status, at }
    }
  }
  return { byBlock, probes, finishedBlocks }
}

/**
 * Pregunta para sondear un conocimiento: de las que lo tienen como tema principal,
 * primero las nunca vistas, luego las de opción única (más rápidas) y las variantes.
 */
export function probeQuestion(
  skill: SkillId,
  candidates: Question[],
  log: AnswerRecord[],
  exclude: string[],
): Question | null {
  const seen = new Set(log.map((r) => r.questionId))
  const pool = candidates.filter((q) => q.skill === skill && !exclude.includes(q.id))
  const ranked = [...pool].sort((a, b) => {
    const score = (q: Question) =>
      (seen.has(q.id) ? 4 : 0) + (q.kind === 'choice' ? 0 : 2) + (q.id.startsWith('v:') ? 0 : 1)
    return score(a) - score(b) || a.id.localeCompare(b.id)
  })
  return ranked[0] ?? null
}
