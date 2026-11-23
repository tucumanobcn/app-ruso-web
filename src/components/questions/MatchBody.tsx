import { useState } from 'react'
import type { MatchQuestion } from '../../content/types'
import type { BodyProps } from './QuestionCard'

/** Relacionar con desplegables: cómodo en el móvil y accesible con teclado. */
export function MatchBody({ question, order, answer, onDraft }: BodyProps<MatchQuestion>) {
  const answeredPairs = answer?.kind === 'match' ? answer.pairs : undefined
  const [chosen, setChosen] = useState<Record<string, string>>(answeredPairs ?? {})
  const answered = answer !== undefined

  const rightOptions = order
    .map((id) => question.pairs.find((pair) => pair.id === id))
    .filter((pair) => pair !== undefined)

  function choose(leftId: string, rightId: string) {
    const next = { ...chosen, [leftId]: rightId }
    if (!rightId) delete next[leftId]
    setChosen(next)
    const complete = question.pairs.every((pair) => next[pair.id])
    onDraft(complete ? { kind: 'match', pairs: next } : undefined)
  }

  return (
    <div className="match">
      {question.pairs.map((pair) => {
        const value = chosen[pair.id] ?? ''
        const ok = value === pair.id
        const selectId = `${question.id}-${pair.id}`
        return (
          <div
            key={pair.id}
            className={`match__row${answered ? (ok ? ' match__row--ok' : ' match__row--ko') : ''}`}
          >
            <label htmlFor={selectId} lang={question.leftLang} className="match__left">
              {pair.left}
            </label>
            <select
              id={selectId}
              value={value}
              disabled={answered}
              lang={question.rightLang}
              onChange={(event) => choose(pair.id, event.target.value)}
            >
              <option value="">Elige…</option>
              {rightOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.right}
                </option>
              ))}
            </select>
            {answered && !ok && (
              <p className="match__fix">
                Correcto: <span lang={question.rightLang}>{pair.right}</span>
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
