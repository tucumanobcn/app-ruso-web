import { useState } from 'react'
import type { MultiQuestion } from '../../content/types'
import type { BodyProps } from './QuestionCard'

export function MultiBody({ question, order, answer, onDraft }: BodyProps<MultiQuestion>) {
  const chosenIds = answer?.kind === 'multi' ? answer.optionIds : []
  const [selected, setSelected] = useState<string[]>(chosenIds)
  const answered = answer !== undefined
  const lang = question.optionsLang ?? 'ru'

  const options = order
    .map((id) => question.options.find((option) => option.id === id))
    .filter((option) => option !== undefined)

  function toggle(id: string) {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    setSelected(next)
    onDraft(next.length > 0 ? { kind: 'multi', optionIds: next } : undefined)
  }

  return (
    <>
      <p className="hint">Puede haber varias respuestas correctas.</p>
      <div className="options">
        {options.map((option) => {
          const isChosen = chosenIds.includes(option.id)
          const isRight = question.correctOptionIds.includes(option.id)
          let state = ''
          let tag = ''
          if (answered) {
            if (isRight && isChosen) [state, tag] = [' option--correct', '✓ correcta']
            else if (isRight) [state, tag] = [' option--missed', '✓ correcta, no la marcaste']
            else if (isChosen) [state, tag] = [' option--wrong', '✗ no es correcta']
            else state = ' option--dimmed'
          }
          return (
            <label key={option.id} className={`option${state}`}>
              <input
                type="checkbox"
                name={question.id}
                value={option.id}
                checked={selected.includes(option.id)}
                disabled={answered}
                onChange={() => toggle(option.id)}
              />
              <span lang={lang} className={`option__text option__text--${lang}`}>
                {option.text}
              </span>
              {tag && <span className="option__tag">{tag}</span>}
            </label>
          )
        })}
      </div>
    </>
  )
}
