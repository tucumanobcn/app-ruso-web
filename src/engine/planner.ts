/**
 * Planificador: propone la sesión del día (unos 10 minutos) y explica por qué.
 * Prioridades: conocer el nivel (diagnóstico) si aún no hay datos; después, el
 * repaso que toca hoy, un refuerzo del punto débil más importante (preferiblemente
 * un requisito de la siguiente lección) y la siguiente lección del itinerario.
 * También construye las sesiones que se pueden elegir a mano.
 */
import { ERROR_TYPES, SKILLS, type SkillId } from '../content/glossary'
import { LESSONS, questionsForSkill } from '../content/lessons'
import type { Lesson } from '../content/types'
import type { AnswerRecord, ProgressData } from '../lib/storage'
import { DIAGNOSTIC_BLOCKS, type DiagnosticSummary } from './diagnostic'
import { lessonReadiness, lessonSkills, weakPoints, type MasteryMap, type WeakPoint } from './insights'
import { DAY_MS, relativeDay, type SkillSchedule } from './scheduler'
import { pickQuestions, planReview } from './selection'

export const DAILY_MINUTES = 10

export interface PlanPart {
  kind: 'diagnostico' | 'repaso' | 'refuerzo' | 'leccion' | 'mixta'
  title: string
  minutes: number
  reason: string
  lessonId?: string
  blockId?: string
}

export interface DailyPlan {
  /** Lo que cabe en los ~10 minutos de hoy. */
  today: PlanPart[]
  /** Lo siguiente, si hay más tiempo (o para mañana). */
  later: PlanPart[]
  /** Ejercicios de la parte de repaso y refuerzo (una sola sesión). */
  practiceIds: string[]
  minutes: number
}

interface PlanInput {
  data: ProgressData
  mastery: MasteryMap
  due: SkillSchedule[]
  diagnostic: DiagnosticSummary
  now: number
}

const pct = (value: number) => `${Math.round(value * 100)} %`
const label = (skill: SkillId) => SKILLS[skill].label

function weakReason(point: WeakPoint, prerequisiteOf: Lesson | undefined): string {
  const reasons: string[] = []
  if (prerequisiteOf) reasons.push(`es requisito de «${prerequisiteOf.title}», tu siguiente lección`)
  if (point.mastery.state === 'necesita-repaso') reasons.push('lo dominabas, pero has vuelto a fallar o hace tiempo que no lo practicas')
  if (point.importance === 'esencial') reasons.push('es un conocimiento esencial')
  if (point.blocks.length > 0) reasons.push(`es base de ${point.blocks.slice(0, 2).map(label).join(' y ')}`)
  const [topError] = point.topErrors
  if (topError) reasons.push(`tu error más repetido aquí: ${ERROR_TYPES[topError[0]].toLowerCase()} (${topError[1]})`)
  return reasons.length > 0 ? `${reasons.slice(0, 3).join('; ')}.` : 'Es tu punto débil prioritario.'
}

/** Siguiente lección del itinerario que aún no sabes, según lecciones hechas, dominio y diagnóstico. */
export function nextItineraryLesson(
  data: ProgressData,
  mastery: MasteryMap,
  diagnostic: DiagnosticSummary,
): { lesson: Lesson; skipped: Lesson[] } | undefined {
  const completed = new Set(data.completedSessions.map((s) => s.lessonId))
  const skipped: Lesson[] = []
  for (const lesson of LESSONS) {
    if (lesson.status !== 'disponible' || completed.has(lesson.id)) continue
    const skills = lessonSkills(lesson).filter((s) => !s.startsWith('lex.'))
    const known = skills.every(
      (s) => mastery[s].state === 'dominado' || diagnostic.probes[s]?.status === 'superado',
    )
    if (known && skills.length > 0) {
      skipped.push(lesson)
      continue
    }
    return { lesson, skipped }
  }
  return undefined
}

export function buildDailyPlan({ data, mastery, due, diagnostic, now }: PlanInput): DailyPlan {
  const log = data.answerLog
  // Los ejercicios marcados como dudosos no se proponen.
  const excluded = new Set(Object.keys(data.contentReports))
  const forSkill = (skill: SkillId) => questionsForSkill(skill, excluded)
  const today: PlanPart[] = []
  const later: PlanPart[] = []

  // 1. Sin datos todavía: primero, conocer el nivel.
  const pendingBlock = DIAGNOSTIC_BLOCKS.find((b) => !diagnostic.byBlock[b.id]?.finished)
  if (pendingBlock && diagnostic.finishedBlocks === 0 && log.length < 15) {
    today.push({
      kind: 'diagnostico',
      title: `Diagnóstico: ${pendingBlock.title}`,
      minutes: 6,
      reason:
        'Aún no conozco tu nivel real. Un bloque corto sirve para no repetirte lo que ya sabes ni saltarte lo que no.',
      blockId: pendingBlock.id,
    })
  }

  const next = nextItineraryLesson(data, mastery, diagnostic)

  // 2. Repaso espaciado: hasta 2 conocimientos que tocan hoy.
  const dueToday = due.slice(0, 2)
  const reviewIds = planReview(
    dueToday.map((d) => d.skill),
    log,
    forSkill,
    2,
  )
  if (reviewIds.length > 0) {
    const startOfToday = new Date(new Date(now).toDateString()).getTime()
    today.push({
      kind: 'repaso',
      title: `Repaso: ${dueToday.map((d) => label(d.skill)).join(' y ')}`,
      minutes: reviewIds.length,
      reason: dueToday
        .map(
          (d) =>
            `${label(d.skill)}: ${d.dueAt < startOfToday ? `tocaba repasarlo ${relativeDay(d.dueAt, now)}` : 'toca hoy'} (recuerdo estimado ${pct(d.retrievability)})`,
        )
        .join('; ')
        .concat('.'),
    })
  }

  // 3. Refuerzo: el punto débil prioritario; si la siguiente lección tiene un requisito débil, ese primero.
  const weak = weakPoints(mastery).filter((w) => !dueToday.some((d) => d.skill === w.mastery.skill))
  const prerequisiteWeak = next ? lessonReadiness(next.lesson, mastery).weak.map((m) => m.skill) : []
  const target = weak.find((w) => prerequisiteWeak.includes(w.mastery.skill)) ?? weak[0]
  const reinforceIds = target
    ? pickQuestions(
        forSkill(target.mastery.skill).filter((q) => !reviewIds.includes(q.id)),
        log,
        3,
      ).map((q) => q.id)
    : []
  if (target && reinforceIds.length > 0) {
    today.push({
      kind: 'refuerzo',
      title: `Refuerzo: ${label(target.mastery.skill)}`,
      minutes: reinforceIds.length,
      reason: `Lo propongo porque ${weakReason(
        target,
        prerequisiteWeak.includes(target.mastery.skill) ? next?.lesson : undefined,
      )}`,
    })
  }

  // 4. Siguiente lección del itinerario.
  if (next) {
    const skippedNote =
      next.skipped.length > 0
        ? ` Me salto ${next.skipped.map((l) => `«${l.title}»`).join(', ')} porque ya lo dominas o el diagnóstico lo dio por superado.`
        : ''
    const part: PlanPart = {
      kind: 'leccion',
      title: `Nueva lección: ${next.lesson.title}`,
      minutes: next.lesson.estimatedMinutes,
      reason: `Siguiente paso de tu itinerario: ${next.lesson.objective.charAt(0).toLowerCase()}${next.lesson.objective.slice(1)}${skippedNote}`,
      lessonId: next.lesson.id,
    }
    const used = today.reduce((sum, p) => sum + p.minutes, 0)
    if (today.some((p) => p.kind === 'diagnostico') || used + part.minutes > DAILY_MINUTES + 2) later.push(part)
    else today.push(part)
  } else {
    later.push({
      kind: 'mixta',
      title: 'Sesión mixta',
      minutes: 8,
      reason: 'Ya has hecho todas las lecciones disponibles: combinar temas te ayuda a usarlos sin pistas.',
    })
  }

  // 5. Si el diagnóstico está a medias, recordarlo como opción.
  if (pendingBlock && !today.some((p) => p.kind === 'diagnostico') && diagnostic.finishedBlocks > 0) {
    later.push({
      kind: 'diagnostico',
      title: `Diagnóstico: ${pendingBlock.title}`,
      minutes: 6,
      reason: 'Completar el diagnóstico afina tu perfil por competencias.',
      blockId: pendingBlock.id,
    })
  }

  // Si no hay nada que repasar ni reforzar, la lección pasa a hoy aunque sea algo más larga.
  if (today.length === 0 && later[0]?.kind === 'leccion') today.push(later.shift()!)

  return {
    today,
    later,
    practiceIds: [...reviewIds, ...reinforceIds],
    minutes: today.reduce((sum, p) => sum + p.minutes, 0),
  }
}

// ---------- Sesiones elegidas a mano ----------

/** Ejercicios sobre lo fallado en los últimos 30 días, con frases nuevas. */
const NONE: ReadonlySet<string> = new Set()

export function errorSessionIds(log: AnswerRecord[], now: number, excluded = NONE, size = 8): string[] {
  const since = now - 30 * DAY_MS
  const counts = new Map<SkillId, number>()
  for (const record of log) {
    if (record.correct || Date.parse(record.answeredAt) < since || !(record.skill in SKILLS)) continue
    counts.set(record.skill as SkillId, (counts.get(record.skill as SkillId) ?? 0) + 1)
  }
  const skills = [...counts].sort((a, b) => b[1] - a[1]).map(([skill]) => skill).slice(0, 4)
  return planReview(skills, log, (s) => questionsForSkill(s, excluded), Math.max(2, Math.ceil(size / Math.max(skills.length, 1)))).slice(0, size)
}

/** Un ejercicio de cada tema ya estudiado (los practicados hace más tiempo primero). */
export function mixedSessionIds(mastery: MasteryMap, log: AnswerRecord[], excluded = NONE, size = 8): string[] {
  const studied = (Object.values(mastery) as MasteryMap[SkillId][])
    .filter((m) => m.state !== 'no-estudiado')
    .sort((a, b) => (a.evidence.lastPracticedAt ?? 0) - (b.evidence.lastPracticedAt ?? 0))
    .slice(0, size)
  if (studied.length < 3) return []
  const ids: string[] = []
  for (const m of studied) {
    const [question] = pickQuestions(questionsForSkill(m.skill, excluded).filter((q) => !ids.includes(q.id)), log, 1)
    if (question) ids.push(question.id)
  }
  return ids
}

/** Vocabulario de las lecciones y del cuerpo. */
export function vocabularySessionIds(log: AnswerRecord[], excluded = NONE, size = 8): string[] {
  const candidates = (['lex.cotidiano', 'lex.cuerpo', 'est.bolet'] as SkillId[]).flatMap((s) =>
    questionsForSkill(s, excluded).filter((q) => q.skill === s),
  )
  return pickQuestions(candidates, log, size).map((q) => q.id)
}
