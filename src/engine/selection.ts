/**
 * Elección de ejercicios para repasos y prácticas: primero los que nunca has visto
 * (muchas veces variantes nuevas de la misma regla), después los vistos hace más
 * tiempo, intentando variar el formato. Es determinista para un mismo historial.
 */
import type { SkillId } from '../content/glossary'
import type { Question } from '../content/types'
import type { AnswerRecord } from '../lib/storage'
import { formatFamily } from './questionIndex'

/**
 * Ejercicios del repaso del día: para cada conocimiento pendiente, primero los que lo
 * tienen como tema principal (así el repaso anuncia bien qué se trabaja).
 */
export function planReview(
  skills: SkillId[],
  log: AnswerRecord[],
  candidatesFor: (skill: SkillId) => Question[],
  perSkill: number,
): string[] {
  const ids: string[] = []
  for (const skill of skills) {
    const all = candidatesFor(skill).filter((q) => !ids.includes(q.id))
    const primary = all.filter((q) => q.skill === skill)
    const pool = primary.length >= perSkill ? primary : all
    ids.push(...pickQuestions(pool, log, perSkill).map((q) => q.id))
  }
  return ids
}

/** Plantilla de una variante («v:instr-te:мёд» → «v:instr-te»); un ejercicio fijo es su propia plantilla. */
function templateOf(question: Question): string {
  return question.id.startsWith('v:') ? question.id.split(':').slice(0, 2).join(':') : question.id
}

export function pickQuestions(candidates: Question[], log: AnswerRecord[], count: number): Question[] {
  const lastSeen = new Map<string, number>()
  for (const record of log) {
    const at = Date.parse(record.answeredAt)
    if (at > (lastSeen.get(record.questionId) ?? -Infinity)) lastSeen.set(record.questionId, at)
  }

  const ordered = [...candidates].sort((a, b) => {
    const sa = lastSeen.get(a.id) ?? -Infinity
    const sb = lastSeen.get(b.id) ?? -Infinity
    return sa - sb || a.id.localeCompare(b.id)
  })

  const chosen: Question[] = []
  const families = new Set<string>()
  const templates = new Set<string>()
  const unseen = (q: Question) => !lastSeen.has(q.id)
  const newFamily = (q: Question) => !families.has(formatFamily(q))
  const newTemplate = (q: Question) => !templates.has(templateOf(q))
  // Lo no visto va siempre antes que lo visto; dentro de cada grupo se busca variar
  // primero el formato y después la plantilla (frases distintas). Lo visto se toma
  // del más antiguo al más reciente.
  const passes: ((q: Question) => boolean)[] = [
    (q) => unseen(q) && newFamily(q) && newTemplate(q),
    (q) => unseen(q) && newTemplate(q),
    unseen,
    newTemplate,
    () => true,
  ]
  for (const accept of passes) {
    for (const question of ordered) {
      if (chosen.length === count) return chosen
      if (chosen.includes(question) || !accept(question)) continue
      chosen.push(question)
      families.add(formatFamily(question))
      templates.add(templateOf(question))
    }
  }
  return chosen
}
