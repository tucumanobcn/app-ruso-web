import { useState } from 'react'
import type { ChoiceQuestion } from '../../content/types'
import type { BodyProps } from './QuestionCard'

export function ChoiceBody({ question, order, answer, onDraft }: BodyProps<ChoiceQuestion>) {
  const chosenId = answer?.kind === 'choice' ? answer.optionId : undefined
  const [selected, setSelected] = useState<string | undefined>(chosenId)
  const answered = answer !== undefined
  const lang = question.optionsLang ?? 'ru'

  const options = order
    .map((id) => question.options.find((option) => option.id === id))
    .filter((option) => option !== undefined)

  return (
    <div className={`options${question.format === 'verdadero-falso' ? ' options--row' : ''}`}>
      {options.map((option) => {
        const isChosen = option.id === chosenId
        const isRight = option.id === question.correctOptionId
        const state = !answered
          ? ''
          : isRight
            ? ' option--correct'
            : isChosen
              ? ' option--wrong'
              : ' option--dimmed'
        return (
          <label key={option.id} className={`option${state}`}>
            <input
              type="radio"
              name={question.id}
              value={option.id}
              checked={selected === option.id}
              disabled={answered}
              onChange={() => {
                setSelected(option.id)
                onDraft({ kind: 'choice', optionId: option.id })
              }}
            />
            <span lang={lang} className={`option__text option__text--${lang}`}>
              {option.text}
            </span>
            {answered && isRight && (
              <span className="option__tag">
                <span aria-hidden="true">✓</span> correcta
              </span>
            )}
            {answered && isChosen && !isRight && (
              <span className="option__tag">
                <span aria-hidden="true">✗</span> tu respuesta
              </span>
            )}
          </label>
        )
      })}
    </div>
  )
}
