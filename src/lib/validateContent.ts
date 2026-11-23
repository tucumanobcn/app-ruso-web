/**
 * Validador del contenido pedagógico. Detecta errores de estructura antes de que
 * lleguen al estudiante: ids repetidos, respuestas correctas inexistentes,
 * opciones incorrectas sin explicación, órdenes alternativos imposibles…
 * Se ejecuta en los tests y al arrancar en modo desarrollo.
 */
import { ERROR_TYPES, SKILLS } from '../content/glossary'
import type { AnswerOption, Lesson, Question } from '../content/types'

export interface ContentIssue {
  lessonId: string
  questionId?: string
  message: string
}

function duplicates(values: string[]): string[] {
  const seen = new Set<string>()
  const repeated = new Set<string>()
  for (const value of values) {
    if (seen.has(value)) repeated.add(value)
    seen.add(value)
  }
  return [...repeated]
}

function sameMultiset(a: string[], b: string[]): boolean {
  return a.length === b.length && [...a].sort().join('\u0000') === [...b].sort().join('\u0000')
}

function checkOptions(
  question: Question & { options: AnswerOption[] },
  correctIds: string[],
  report: (message: string) => void,
) {
  const ids = question.options.map((o) => o.id)
  if (question.options.length < 2) report('Necesita al menos dos opciones.')
  for (const id of duplicates(ids)) report(`Id de opción repetido: ${id}.`)
  for (const text of duplicates(question.options.map((o) => o.text.trim()))) {
    report(`Texto de opción repetido: «${text}».`)
  }
  for (const id of correctIds) {
    if (!ids.includes(id)) report(`La respuesta correcta «${id}» no existe entre las opciones.`)
  }
  for (const option of question.options) {
    const correct = correctIds.includes(option.id)
    if (correct && (option.errorType || option.whyWrong)) {
      report(`La opción correcta «${option.text}» no debe tener whyWrong ni errorType.`)
    }
    if (!correct && !option.whyWrong?.trim()) {
      report(`La opción incorrecta «${option.text}» no explica por qué es incorrecta.`)
    }
    if (!correct && !option.errorType) {
      report(`La opción incorrecta «${option.text}» no tiene tipo de error.`)
    }
    if (option.errorType && !(option.errorType in ERROR_TYPES)) {
      report(`Tipo de error desconocido: ${option.errorType}.`)
    }
  }
}

function checkQuestion(question: Question, report: (message: string) => void) {
  if (!(question.skill in SKILLS)) report(`Habilidad desconocida: ${question.skill}.`)
  for (const extra of question.alsoEvaluates ?? []) {
    if (!(extra in SKILLS)) report(`Habilidad desconocida en alsoEvaluates: ${extra}.`)
    if (extra === question.skill) report('alsoEvaluates repite la habilidad principal.')
  }
  if (!question.instruction.trim()) report('Falta el enunciado.')
  const { rule, whyCorrect, examples } = question.explanation
  if (!rule.trim() || !whyCorrect.trim()) report('Falta la regla o la explicación de la respuesta.')
  if (examples.length === 0) report('Necesita al menos un ejemplo.')
  for (const example of examples) {
    if (!example.ru.trim() || !example.es.trim()) report('Ejemplo sin texto ruso o sin traducción.')
  }

  switch (question.kind) {
    case 'choice':
      checkOptions(question, [question.correctOptionId], report)
      if (question.format === 'completar' && !question.prompt?.includes('___')) {
        report('Una pregunta de completar necesita un hueco (___) en el enunciado ruso.')
      }
      if (question.format === 'verdadero-falso' && question.options.length !== 2) {
        report('Verdadero/falso debe tener exactamente dos opciones.')
      }
      break
    case 'multi':
      checkOptions(question, question.correctOptionIds, report)
      if (question.correctOptionIds.length === 0) report('Debe haber al menos una opción correcta.')
      if (question.correctOptionIds.length === question.options.length) {
        report('Debe haber al menos una opción incorrecta.')
      }
      for (const option of question.options) {
        if (question.correctOptionIds.includes(option.id) && !option.note?.trim()) {
          report(`La opción correcta «${option.text}» necesita una nota explicativa.`)
        }
      }
      break
    case 'order': {
      if (question.tokens.length < 2) report('Hay que ordenar al menos dos fragmentos.')
      const sequences = [question.tokens, ...(question.alsoAccepted ?? [])]
      for (const sequence of question.alsoAccepted ?? []) {
        if (!sameMultiset(sequence, question.tokens)) {
          report(`Orden alternativo con fragmentos distintos: «${sequence.join(' ')}».`)
        }
      }
      for (const repeated of duplicates(sequences.map((s) => s.join(' ')))) {
        report(`Orden aceptado repetido: «${repeated}».`)
      }
      if (!(question.errorType in ERROR_TYPES)) report(`Tipo de error desconocido: ${question.errorType}.`)
      break
    }
    case 'match':
      if (question.pairs.length < 2) report('Hay que relacionar al menos dos parejas.')
      for (const id of duplicates(question.pairs.map((p) => p.id))) report(`Id de pareja repetido: ${id}.`)
      for (const text of duplicates(question.pairs.map((p) => p.left))) report(`Elemento izquierdo repetido: «${text}».`)
      for (const text of duplicates(question.pairs.map((p) => p.right))) report(`Elemento derecho repetido: «${text}».`)
      if (!(question.errorType in ERROR_TYPES)) report(`Tipo de error desconocido: ${question.errorType}.`)
      break
  }
}

/** Comprueba que las dependencias del mapa existan y no formen ciclos. */
export function validateKnowledgeMap(
  map: Record<string, { requires: readonly string[] }>,
): string[] {
  const issues: string[] = []
  for (const [skill, node] of Object.entries(map)) {
    if (!(skill in SKILLS)) issues.push(`El mapa incluye un conocimiento desconocido: ${skill}.`)
    for (const req of node.requires) {
      if (!(req in map)) issues.push(`${skill} depende de un conocimiento inexistente: ${req}.`)
      if (req === skill) issues.push(`${skill} depende de sí mismo.`)
    }
  }
  // Detección de ciclos con búsqueda en profundidad.
  const state = new Map<string, 'visitando' | 'hecho'>()
  const visit = (skill: string, path: string[]): void => {
    if (state.get(skill) === 'hecho') return
    if (state.get(skill) === 'visitando') {
      issues.push(`Ciclo de dependencias: ${[...path, skill].join(' → ')}.`)
      return
    }
    state.set(skill, 'visitando')
    for (const req of map[skill]?.requires ?? []) visit(req, [...path, skill])
    state.set(skill, 'hecho')
  }
  for (const skill of Object.keys(map)) visit(skill, [])
  return issues
}

export function validateLessons(lessons: Lesson[]): ContentIssue[] {
  const issues: ContentIssue[] = []

  for (const id of duplicates(lessons.map((l) => l.id))) {
    issues.push({ lessonId: id, message: 'Id de lección repetido.' })
  }
  const allQuestionIds = lessons.flatMap((l) => l.questions.map((q) => q.id))
  for (const id of duplicates(allQuestionIds)) {
    issues.push({ lessonId: '*', questionId: id, message: 'Id de pregunta repetido.' })
  }

  for (const lesson of lessons) {
    if (lesson.status === 'disponible' && lesson.questions.length === 0) {
      issues.push({ lessonId: lesson.id, message: 'Lección disponible sin preguntas.' })
    }
    if (lesson.status === 'proximamente' && lesson.questions.length > 0) {
      issues.push({ lessonId: lesson.id, message: 'Lección «próximamente» con preguntas.' })
    }
    for (const question of lesson.questions) {
      checkQuestion(question, (message) =>
        issues.push({ lessonId: lesson.id, questionId: question.id, message }),
      )
    }
  }
  return issues
}
