import { describe, expect, it } from 'vitest'
import { SKILLS, type SkillId } from '../content/glossary'
import { KNOWLEDGE_MAP } from '../content/knowledgeMap'
import { getLesson, LESSONS } from '../content/lessons'
import { practiceLessonId } from '../content/lessons/practice'
import type { ChoiceQuestion } from '../content/types'
import { validateKnowledgeMap, validateLessons } from './validateContent'

const available = LESSONS.filter((lesson) => lesson.status === 'disponible')
const questions = available.flatMap((lesson) => lesson.questions)

describe('contenido de las lecciones', () => {
  it('no tiene errores de estructura', () => {
    expect(validateLessons(LESSONS)).toEqual([])
  })

  it('tiene al menos 50 ejercicios', () => {
    expect(questions.length).toBeGreaterThanOrEqual(50)
  })

  it('usa varios formatos de ejercicio', () => {
    const kinds = new Set(questions.map((q) => q.kind))
    expect([...kinds].sort()).toEqual(['choice', 'match', 'multi', 'order'])
  })

  it('no hace que la respuesta correcta sea casi siempre la más larga', () => {
    const choice = questions.filter(
      (q): q is ChoiceQuestion => q.kind === 'choice' && q.format !== 'verdadero-falso',
    )
    const correctIsLongest = choice.filter((q) => {
      const correct = q.options.find((o) => o.id === q.correctOptionId)!
      return q.options.every((o) => o === correct || o.text.length < correct.text.length)
    })
    expect(correctIsLongest.length / choice.length).toBeLessThan(0.5)
  })

  it('tiene un mapa de conocimientos sin dependencias rotas ni ciclos', () => {
    expect(validateKnowledgeMap(KNOWLEDGE_MAP)).toEqual([])
    expect(
      validateKnowledgeMap({ 'prep.lugar': { requires: ['prep.o'] }, 'prep.o': { requires: ['prep.lugar'] } }),
    ).toContainEqual(expect.stringContaining('Ciclo de dependencias'))
  })

  it('genera prácticas dirigidas para cada conocimiento con ejercicios', () => {
    for (const skill of Object.keys(SKILLS) as SkillId[]) {
      const practice = getLesson(practiceLessonId(skill))
      expect(practice?.questions.length).toBeGreaterThan(0)
    }
  })

  it('detecta contenido mal formado', () => {
    const broken = structuredClone(available[0])
    const question = broken.questions[0]
    if (question.kind !== 'choice') throw new Error('Se esperaba una pregunta de opción única')
    question.correctOptionId = 'zzz'
    question.options[1].whyWrong = ''
    const messages = validateLessons([broken]).map((issue) => issue.message)
    expect(messages).toContain('La respuesta correcta «zzz» no existe entre las opciones.')
    expect(messages.some((m) => m.includes('no explica por qué es incorrecta'))).toBe(true)
  })
})
