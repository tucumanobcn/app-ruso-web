/**
 * Genera las variantes de ejercicios a partir de las plantillas y de las formas
 * verificadas de OpenRussian. Son deterministas: el mismo contenido produce siempre
 * las mismas preguntas con los mismos ids, así una sesión guardada sigue siendo válida.
 */
import type { SkillId } from '../glossary'
import type { AnswerOption, ChoiceQuestion } from '../types'
import { NOUN_FORMS, VERB_FORMS } from '../vocab/forms.generated'
import { plain } from '../vocab/formTypes'
import {
  TEMPLATES,
  type AspectTemplate,
  type NounCaseTemplate,
  type PersonTemplate,
  type PairTemplate,
  type PlaceTemplate,
  type PronounTemplate,
} from './templates'

export const VARIANT_PREFIX = 'v:'

const LETTERS = ['a', 'b', 'c', 'd']
const PRONOUNS = ['я', 'ты', 'он / она', 'мы', 'вы', 'они']

function fill(text: string, values: Record<string, string>): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)
}

/** «a el museo» → «al museo», «de el» → «del». */
function contract(text: string): string {
  return text.replace(/\ba el\b/g, 'al').replace(/\bde el\b/g, 'del')
}

function noun(lemma: string) {
  const data = NOUN_FORMS[lemma]
  if (!data) throw new Error(`Plantillas: falta la palabra «${lemma}» en forms.generated.ts`)
  return data
}

function verb(lemma: string) {
  const data = VERB_FORMS[lemma]
  if (!data) throw new Error(`Plantillas: falta el verbo «${lemma}» en forms.generated.ts`)
  return data
}

/** Añade opciones incorrectas sin repetir texto ni coincidir con ninguna forma correcta. */
function withDistractors(
  correct: AnswerOption,
  correctVariants: string[],
  candidates: Omit<AnswerOption, 'id'>[],
): AnswerOption[] {
  const taken = new Set([correct.text, ...correctVariants])
  const options = [correct]
  for (const candidate of candidates) {
    if (options.length === LETTERS.length) break
    if (!candidate.text || taken.has(candidate.text)) continue
    taken.add(candidate.text)
    options.push({ ...candidate, id: LETTERS[options.length] })
  }
  return options
}

function base(template: { skill: SkillId; alsoEvaluates?: SkillId[]; instruction: string; rule: string; examples: ChoiceQuestion['explanation']['examples'] }) {
  return {
    kind: 'choice' as const,
    skill: template.skill,
    ...(template.alsoEvaluates ? { alsoEvaluates: template.alsoEvaluates } : {}),
    instruction: template.instruction,
    correctOptionId: 'a',
  }
}

function fromNounCase(template: NounCaseTemplate): ChoiceQuestion[] {
  return template.items.flatMap((item) => {
    const data = noun(item.lemma)
    const correctList = data.forms[template.target] ?? []
    if (correctList.length === 0) return []
    const correctText = plain(correctList[0])
    const options = withDistractors(
      { id: 'a', text: correctText },
      correctList.map(plain),
      template.distractors.map((d) => {
        const text = plain(data.forms[d.key]?.[0] ?? '')
        return { text, errorType: d.errorType, whyWrong: fill(d.whyWrong, { f: text }) }
      }),
    )
    if (options.length < 2) return []
    return [
      {
        ...base(template),
        id: `${VARIANT_PREFIX}${template.id}:${item.lemma}`,
        format: 'completar',
        prompt: template.prompt,
        translation: contract(fill(template.translation, { x: item.es })),
        options,
        explanation: {
          rule: template.rule,
          whyCorrect: fill(template.whyCorrect, { lemma: data.accented, form: correctList[0] }),
          examples: template.examples,
        },
      },
    ]
  })
}

function fromPlace(template: PlaceTemplate): ChoiceQuestion[] {
  return template.items.flatMap((item) => {
    const data = noun(item.lemma)
    const prepForm = data.forms.sg_prep?.[0]
    const accForm = data.forms.sg_acc?.[0]
    if (!prepForm || !accForm) return []
    const other = item.prep === 'в' ? 'на' : 'в'
    const [target, wrong] = template.mode === 'lugar' ? [prepForm, accForm] : [accForm, prepForm]
    const phrase = (p: string, form: string) => `${p} ${plain(form)}`
    const correctText = phrase(item.prep, target)
    const wrongText = (key: keyof PlaceTemplate['wrong'], text: string) =>
      fill(template.wrong[key], { prep: item.prep, f: text })
    const options = withDistractors({ id: 'a', text: correctText }, [], [
      { text: phrase(other, target), errorType: 'preposicion.v-na', whyWrong: wrongText('otherPreposition', phrase(other, target)) },
      { text: phrase(item.prep, wrong), errorType: 'caso.lugar-direccion', whyWrong: wrongText('wrongCase', phrase(item.prep, wrong)) },
      { text: phrase(other, wrong), errorType: 'caso.lugar-direccion', whyWrong: wrongText('both', phrase(other, wrong)) },
    ])
    return [
      {
        ...base(template),
        id: `${VARIANT_PREFIX}${template.id}:${item.lemma}`,
        format: 'seleccionar',
        prompt: template.prompt,
        translation: contract(fill(template.translation, { x: item.es })),
        options,
        explanation: {
          rule: template.rule,
          whyCorrect: fill(template.whyCorrect, {
            prep: item.prep,
            lemma: data.accented,
            form: `${item.prep} ${target}`,
          }),
          examples: template.examples,
        },
      },
    ]
  })
}

function fromPerson(template: PersonTemplate): ChoiceQuestion[] {
  const main = verb(template.verb)
  const partner = verb(template.partnerVerb)
  return template.items.map((item) => {
    const p = item.person
    const correct = main.presentOrFuture[p]
    const others = [(p + 1) % 6, (p + 3) % 6]
    const options = withDistractors({ id: 'a', text: plain(correct) }, [], [
      {
        text: plain(partner.presentOrFuture[p]),
        errorType: 'movimiento.uni-multi',
        whyWrong: fill(template.partnerWhyWrong, { f: plain(partner.presentOrFuture[p]) }),
      },
      ...others.map((o) => ({
        text: plain(main.presentOrFuture[o]),
        errorType: 'conjugacion.forma' as const,
        whyWrong: `${plain(main.presentOrFuture[o])} es la forma de «${PRONOUNS[o]}»; con este sujeto hace falta ${plain(correct)}.`,
      })),
    ])
    return {
      ...base(template),
      id: `${VARIANT_PREFIX}${template.id}:${p}`,
      format: 'seleccionar',
      prompt: item.prompt,
      translation: item.translation,
      options,
      explanation: {
        rule: template.rule,
        whyCorrect: fill(template.whyCorrect, { form: correct }),
        examples: template.examples,
      },
    }
  })
}

function fromAspect(template: AspectTemplate): ChoiceQuestion[] {
  return template.items.flatMap((item) => {
    const impf = verb(item.imperfective).past.m
    const pf = verb(item.perfective).past.m
    const duration: ChoiceQuestion = {
      ...base(template),
      id: `${VARIANT_PREFIX}${template.id}:${item.imperfective}:duracion`,
      format: 'seleccionar',
      prompt: `Вчера я весь вечер ___ ${item.object}.`,
      translation: `Ayer estuve toda la tarde ${item.esDuration}.`,
      options: [
        { id: 'a', text: plain(impf) },
        {
          id: 'b',
          text: plain(pf),
          errorType: 'aspecto.proceso-resultado',
          whyWrong: `${plain(pf)} presenta la acción como terminada; con «весь вечер» se describe la duración, que pide imperfectivo.`,
        },
      ],
      explanation: {
        rule: template.rule,
        whyCorrect: `«весь вечер» destaca cuánto duró el proceso: imperfectivo ${impf}.`,
        examples: template.examples,
      },
    }
    const sequence: ChoiceQuestion = {
      ...base(template),
      id: `${VARIANT_PREFIX}${template.id}:${item.imperfective}:secuencia`,
      format: 'seleccionar',
      prompt: `Я ___ ${item.object} и лёг спать.`,
      translation: `${item.esSequence} y me fui a dormir.`,
      options: [
        { id: 'a', text: plain(pf) },
        {
          id: 'b',
          text: plain(impf),
          errorType: 'aspecto.proceso-resultado',
          whyWrong: `${plain(impf)} describe el proceso; en una secuencia de acciones terminadas se usa perfectivo.`,
        },
      ],
      explanation: {
        rule: template.rule,
        whyCorrect: `Primero terminas la acción y después te acuestas: perfectivo ${pf}.`,
        examples: template.examples,
      },
    }
    return [duration, sequence]
  })
}

function fromPronoun(template: PronounTemplate): ChoiceQuestion[] {
  return template.items.map((item) => ({
    ...base(template),
    id: `${VARIANT_PREFIX}${template.id}:${item.id}`,
    format: 'completar',
    prompt: template.prompt,
    translation: fill(template.translation, { x: item.es }),
    options: withDistractors({ id: 'a', text: item.correct }, [], item.wrong),
    explanation: {
      rule: template.rule,
      whyCorrect: fill(template.whyCorrect, { form: `с ${item.correct}` }),
      examples: template.examples,
    },
  }))
}

/** Elegir el perfectivo: las opciones incorrectas son los perfectivos de otros verbos de la lista. */
function fromPair(template: PairTemplate): ChoiceQuestion[] {
  const n = template.items.length
  return template.items.map((item, i) => {
    const impf = verb(item.imperfective)
    const pf = verb(item.perfective)
    const others = [1, 2, 3].map((offset) => template.items[(i + offset) % n])
    return {
      ...base(template),
      id: `${VARIANT_PREFIX}${template.id}:${item.imperfective}`,
      format: 'seleccionar',
      prompt: `${plain(impf.accented)} → ___`,
      translation: `Imperfectivo: «${item.es}». ¿Cuál es su perfectivo?`,
      options: withDistractors(
        { id: 'a', text: plain(pf.accented) },
        [],
        others.map((other) => ({
          text: plain(verb(other.perfective).accented),
          errorType: 'aspecto.par' as const,
          whyWrong: `${plain(verb(other.perfective).accented)} es el perfectivo de ${plain(verb(other.imperfective).accented)} («${other.es}»).`,
        })),
      ),
      explanation: {
        rule: template.rule,
        whyCorrect: fill(template.whyCorrect, { lemma: impf.accented, form: pf.accented }),
        examples: template.examples,
      },
    }
  })
}

export function generateVariants(): ChoiceQuestion[] {
  return TEMPLATES.flatMap((template) => {
    switch (template.kind) {
      case 'pair':
        return fromPair(template)
      case 'pronoun':
        return fromPronoun(template)
      case 'noun-case':
        return fromNounCase(template)
      case 'place':
        return fromPlace(template)
      case 'person':
        return fromPerson(template)
      case 'aspect':
        return fromAspect(template)
    }
  })
}

export const VARIANTS: ChoiceQuestion[] = generateVariants()
