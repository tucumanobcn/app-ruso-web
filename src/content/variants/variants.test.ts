import { describe, expect, it } from 'vitest'
import { validateLessons } from '../../lib/validateContent'
import { LESSONS } from '../lessons'
import type { Lesson } from '../types'
import { NOUN_FORMS } from '../vocab/forms.generated'
import { plain } from '../vocab/formTypes'
import { generateVariants, VARIANTS } from '.'
import { TEMPLATES } from './templates'

const asLesson: Lesson = {
  id: 'variantes',
  title: 'Variantes',
  level: 'A2',
  topic: 'Variantes',
  type: 'practica',
  objective: '—',
  prerequisites: [],
  estimatedMinutes: 1,
  status: 'disponible',
  questions: VARIANTS,
}

describe('variantes generadas', () => {
  it('pasan el validador de contenido', () => {
    expect(validateLessons([asLesson])).toEqual([])
  })

  it('son más de 100 y sus ids no chocan con los ejercicios fijos', () => {
    expect(VARIANTS.length).toBeGreaterThan(100)
    const fixed = new Set(LESSONS.flatMap((l) => l.questions.map((q) => q.id)))
    for (const variant of VARIANTS) expect(fixed.has(variant.id), variant.id).toBe(false)
  })

  it('cada plantilla produce al menos 3 variantes', () => {
    for (const template of TEMPLATES) {
      const count = VARIANTS.filter((v) => v.id.startsWith(`v:${template.id}:`)).length
      expect(count, template.id).toBeGreaterThanOrEqual(3)
    }
  })

  it('son deterministas', () => {
    expect(generateVariants()).toEqual(VARIANTS)
  })

  it('la respuesta correcta de las plantillas de caso es la forma de OpenRussian', () => {
    for (const template of TEMPLATES) {
      if (template.kind !== 'noun-case') continue
      for (const item of template.items) {
        const variant = VARIANTS.find((v) => v.id === `v:${template.id}:${item.lemma}`)!
        const expected = NOUN_FORMS[item.lemma].forms[template.target]!.map(plain)
        expect(expected, variant.id).toContain(variant.options[0].text)
        // Ninguna opción incorrecta es también una forma válida del caso pedido.
        for (const option of variant.options.slice(1)) expect(expected).not.toContain(option.text)
      }
    }
  })

  it('las traducciones están completas y bien contraídas', () => {
    for (const variant of VARIANTS) {
      expect(variant.translation, variant.id).not.toMatch(/[{}]/)
      expect(variant.translation, variant.id).not.toMatch(/\ba el\b|\bde el\b/)
      expect(variant.prompt, variant.id).toContain('___')
    }
  })
})
