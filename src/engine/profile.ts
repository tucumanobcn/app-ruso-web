/**
 * Perfil por competencias. Combina el diagnóstico con lo practicado después:
 * mientras no vuelvas a trabajar un conocimiento cuenta el diagnóstico; en cuanto
 * lo practicas, cuenta tu rendimiento reciente (motor de dominio).
 * Es una estimación orientativa, no una certificación MCER.
 */
import type { SkillId } from '../content/glossary'
import { KNOWLEDGE_MAP } from '../content/knowledgeMap'
import type { ProbeStatus } from './diagnostic'
import type { MasteryMap } from './insights'
import type { MasteryState, SkillMastery } from './mastery'

export interface Competency {
  id: string
  label: string
  skills: SkillId[]
}

export const COMPETENCIES: Competency[] = [
  {
    id: 'casos',
    label: 'Casos gramaticales',
    skills: [
      'prep.lugar',
      'acus.objeto',
      'acus.animacion',
      'gen.negacion',
      'gen.posesion',
      'gen.cantidad',
      'gen.ortografia',
      'dat.destinatario',
      'dat.impersonal',
      'instr.compania',
      'instr.regimen',
      'instr.profesion',
      'casos.integracion',
      'plural.nominativo',
      'plural.genitivo',
      'plural.acusativo',
      'plural.oblicuos',
    ],
  },
  {
    id: 'preposiciones',
    label: 'Preposiciones',
    skills: ['prep.v-na', 'prep.o', 'acus.direccion', 'dat.k', 'mov.transporte'],
  },
  { id: 'conjugacion', label: 'Conjugación verbal', skills: ['mov.conjugacion'] },
  { id: 'aspecto', label: 'Aspecto verbal', skills: ['aspecto.pasado', 'aspecto.presente-futuro', 'aspecto.pares'] },
  { id: 'movimiento', label: 'Verbos de movimiento', skills: ['mov.idti-hodit', 'mov.ehat-ezdit'] },
  { id: 'pronombres', label: 'Pronombres', skills: ['instr.pronombres'] },
  { id: 'vocabulario', label: 'Vocabulario', skills: ['lex.cotidiano', 'lex.cuerpo'] },
  {
    id: 'estructuras',
    label: 'Estructuras y comunicación',
    skills: ['est.bolet', 'com.presentarse', 'com.compras'],
  },
]

/** Competencias de la especificación que aún no tienen ejercicios en la aplicación. */
export const UNCOVERED_COMPETENCIES = [
  'Adjetivos y concordancia',
  'Comprensión escrita',
  'Comprensión auditiva',
  'Expresión escrita y oral',
]

const MASTERY_SCORE: Record<Exclude<MasteryState, 'no-estudiado'>, number> = {
  dominado: 1,
  'en-consolidacion': 0.7,
  'necesita-repaso': 0.5,
  'en-aprendizaje': 0.3,
}

// «omitido» y «sin evaluar» no tienen puntuación: no son evidencia de que algo se sepa
// o no se sepa (se omitió porque falla un requisito, que ya cuenta como débil).
const PROBE_SCORE: Partial<Record<ProbeStatus, number>> = {
  superado: 0.8,
  dudoso: 0.5,
  debil: 0.15,
}

export interface ProbeRecord {
  status: ProbeStatus
  /** Momento de la última respuesta del diagnóstico para este conocimiento. */
  at: number
}

/** Puntuación 0–1 de un conocimiento, o null si no hay ninguna evidencia. */
export function skillScore(mastery: SkillMastery, probe?: ProbeRecord): number | null {
  const probeScore = probe ? PROBE_SCORE[probe.status] : undefined
  const practicedAfter =
    mastery.state !== 'no-estudiado' &&
    mastery.evidence.lastPracticedAt !== null &&
    (!probe || mastery.evidence.lastPracticedAt > probe.at)

  if (practicedAfter) {
    const base = MASTERY_SCORE[mastery.state as Exclude<MasteryState, 'no-estudiado'>]
    // Si el diagnóstico salió bien y sigues acertando, la poca evidencia nueva no lo rebaja.
    const accuracy = mastery.evidence.recentAccuracy ?? 0
    return probe?.status === 'superado' && accuracy >= 0.8 ? Math.max(base, 0.8) : base
  }
  if (probeScore !== undefined) return probeScore
  if (mastery.state !== 'no-estudiado') return MASTERY_SCORE[mastery.state]
  return null
}

export type CompetencyStatus = 'consolidado' | 'en desarrollo' | 'con dificultades'

export interface CompetencyResult {
  competency: Competency
  /** null si no hay ningún conocimiento evaluado. */
  level: 'A1' | 'A2' | null
  status: CompetencyStatus | null
  /** Texto para mostrar: «A2 en desarrollo», «Sin evaluar»… */
  label: string
  /** Valor numérico del nivel (0–2) para barras y para el nivel global. */
  value: number | null
  evaluated: number
  total: number
  /** Conocimientos que más tiran hacia abajo. */
  weakest: SkillId[]
}

const status = (score: number): CompetencyStatus =>
  score >= 0.75 ? 'consolidado' : score >= 0.45 ? 'en desarrollo' : 'con dificultades'

const VALUE: Record<'A1' | 'A2', Record<CompetencyStatus, number>> = {
  A1: { 'con dificultades': 0.3, 'en desarrollo': 0.6, consolidado: 1 },
  A2: { 'con dificultades': 1.2, 'en desarrollo': 1.5, consolidado: 2 },
}

const average = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length

export function competencyProfile(
  mastery: MasteryMap,
  probes: Partial<Record<SkillId, ProbeRecord>>,
): CompetencyResult[] {
  return COMPETENCIES.map((competency) => {
    const scored = competency.skills
      .map((skill) => ({ skill, score: skillScore(mastery[skill], probes[skill]) }))
      .filter((s): s is { skill: SkillId; score: number } => s.score !== null)
    const base = { competency, evaluated: scored.length, total: competency.skills.length }
    if (scored.length === 0) {
      return { ...base, level: null, status: null, label: 'Sin evaluar', value: null, weakest: [] }
    }
    const byLevel = (level: 'A1' | 'A2') =>
      scored.filter((s) => KNOWLEDGE_MAP[s.skill].level === level).map((s) => s.score)
    const a1 = byLevel('A1')
    const a2 = byLevel('A2')

    let level: 'A1' | 'A2'
    let st: CompetencyStatus
    if (a1.length > 0 && average(a1) < 0.75) {
      level = 'A1'
      st = status(average(a1))
    } else if (a2.length > 0) {
      level = 'A2'
      st = status(average(a2))
    } else {
      level = 'A1'
      st = 'consolidado'
    }
    const weakest = scored
      .filter((s) => s.score < 0.75)
      .sort((x, y) => x.score - y.score)
      .slice(0, 2)
      .map((s) => s.skill)
    return { ...base, level, status: st, label: `${level} ${st}`, value: VALUE[level][st], weakest }
  })
}

/** Nivel global orientativo: media de las competencias evaluadas, ponderada por conocimientos. */
export function globalLevel(profile: CompetencyResult[]): { label: string; value: number } | null {
  const evaluated = profile.filter((p) => p.value !== null)
  if (evaluated.length === 0) return null
  const weight = evaluated.reduce((sum, p) => sum + p.evaluated, 0)
  const value = evaluated.reduce((sum, p) => sum + (p.value ?? 0) * p.evaluated, 0) / weight
  const label =
    value < 0.45
      ? 'A1 con dificultades'
      : value < 0.8
        ? 'A1 en desarrollo'
        : value < 1.1
          ? 'A1 consolidado'
          : value < 1.35
            ? 'A2 inicial'
            : value < 1.75
              ? 'A2 en desarrollo'
              : 'A2 consolidado'
  return { label, value }
}

export function competencyOf(skill: SkillId): Competency | undefined {
  return COMPETENCIES.find((c) => c.skills.includes(skill))
}

