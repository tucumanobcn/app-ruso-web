import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Question } from '../../content/types'
import type { AnswerValue } from '../../lib/answers'
import { Feedback } from '../Feedback'
import { ReportedNote } from '../QuestionSource'
import { RussianPrompt } from '../RussianPrompt'
import { ChoiceBody } from './ChoiceBody'
import { MatchBody } from './MatchBody'
import { MultiBody } from './MultiBody'
import { OrderBody } from './OrderBody'

interface QuestionCardProps {
  question: Question
  /** Orden barajado de opciones, fragmentos o columna derecha. */
  order: string[]
  /** Respuesta ya registrada (si existe, la pregunta está corregida). */
  answer: AnswerValue | undefined
  onAnswer: (answer: AnswerValue) => void
}

/** Marco común de todas las preguntas: enunciado, cuerpo según el formato, botón y corrección. */
export function QuestionCard({ question, order, answer, onAnswer }: QuestionCardProps) {
  const [draft, setDraft] = useState<AnswerValue | undefined>(undefined)
  const feedbackHeading = useRef<HTMLHeadingElement>(null)
  const justAnswered = useRef(false)
  const answered = answer !== undefined

  useEffect(() => {
    // Lleva el foco a la corrección solo justo después de responder.
    if (answered && justAnswered.current) {
      feedbackHeading.current?.focus()
      justAnswered.current = false
    }
  }, [answered])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!draft || answered) return
    justAnswered.current = true
    onAnswer(draft)
  }

  // Solo se rellena el hueco cuando hay exactamente uno y la opción es la palabra que falta.
  const fillsBlank =
    question.kind === 'choice' &&
    (question.format === 'completar' || question.format === 'seleccionar') &&
    question.prompt?.split('___').length === 2
  const filled =
    answered && fillsBlank && question.kind === 'choice'
      ? question.options.find((option) => option.id === question.correctOptionId)?.text
      : undefined

  const bodyProps = { order, answer, onDraft: setDraft }
  const legendId = `legend-${question.id}`

  return (
    <form className="card question" onSubmit={handleSubmit}>
      <fieldset aria-labelledby={legendId}>
        <legend id={legendId} className="question__instruction">
          {question.instruction}
        </legend>
        <ReportedNote question={question} />

        {question.prompt && <RussianPrompt text={question.prompt} filled={filled} />}
        {question.translation && <p className="question__translation">{question.translation}</p>}

        {question.kind === 'choice' && <ChoiceBody question={question} {...bodyProps} />}
        {question.kind === 'multi' && <MultiBody question={question} {...bodyProps} />}
        {question.kind === 'order' && <OrderBody question={question} {...bodyProps} />}
        {question.kind === 'match' && <MatchBody question={question} {...bodyProps} />}
      </fieldset>

      {!answered && (
        <button type="submit" className="btn btn--primary btn--block" disabled={!draft}>
          Comprobar
        </button>
      )}

      {answered && <Feedback question={question} answer={answer} headingRef={feedbackHeading} />}
    </form>
  )
}

export interface BodyProps<Q extends Question> {
  question: Q
  order: string[]
  answer: AnswerValue | undefined
  /** Respuesta lista para comprobar, o undefined si aún está incompleta. */
  onDraft: (draft: AnswerValue | undefined) => void
}
