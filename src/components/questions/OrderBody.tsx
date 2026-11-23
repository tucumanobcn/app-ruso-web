import { useState } from 'react'
import type { OrderQuestion } from '../../content/types'
import type { BodyProps } from './QuestionCard'

/** Ordenar tocando fragmentos: se añaden a la respuesta y se quitan tocándolos de nuevo. */
export function OrderBody({ question, order, answer, onDraft }: BodyProps<OrderQuestion>) {
  const answeredIndexes = answer?.kind === 'order' ? answer.tokenIndexes : undefined
  const [placed, setPlaced] = useState<number[]>(answeredIndexes ?? [])
  const answered = answer !== undefined
  const lines = question.display === 'lineas'
  const total = question.tokens.length

  const available = order.map(Number).filter((index) => !placed.includes(index))

  function update(next: number[]) {
    setPlaced(next)
    onDraft(next.length === total ? { kind: 'order', tokenIndexes: next } : undefined)
  }

  const tokenClass = `token${lines ? ' token--line' : ''}`

  return (
    <div className="order">
      <p className="order__label" id={`${question.id}-answer`}>
        {lines ? 'Tu diálogo' : 'Tu frase'} ({placed.length}/{total})
      </p>
      <div
        className={`order__answer${lines ? ' order__answer--lines' : ''}`}
        aria-labelledby={`${question.id}-answer`}
        role="group"
      >
        {placed.length === 0 && (
          <span className="order__placeholder">
            Toca {lines ? 'las réplicas' : 'las palabras'} en el orden correcto.
          </span>
        )}
        {placed.map((index, position) => (
          <button
            key={index}
            type="button"
            className={`${tokenClass} token--placed`}
            disabled={answered}
            lang="ru"
            aria-label={`${question.tokens[index]} (posición ${position + 1}, tocar para quitar)`}
            onClick={() => update(placed.filter((p) => p !== index))}
          >
            {question.tokens[index]}
          </button>
        ))}
      </div>

      {!answered && (
        <>
          <p className="order__label" id={`${question.id}-bank`}>
            {lines ? 'Réplicas disponibles' : 'Palabras disponibles'}
          </p>
          <div
            className={`order__bank${lines ? ' order__answer--lines' : ''}`}
            role="group"
            aria-labelledby={`${question.id}-bank`}
          >
            {available.map((index) => (
              <button
                key={index}
                type="button"
                className={tokenClass}
                lang="ru"
                onClick={() => update([...placed, index])}
              >
                {question.tokens[index]}
              </button>
            ))}
            {available.length === 0 && <span className="order__placeholder">Todo colocado.</span>}
          </div>
          {placed.length > 0 && (
            <button type="button" className="btn btn--ghost btn--small" onClick={() => update([])}>
              Empezar de nuevo
            </button>
          )}
        </>
      )}
    </div>
  )
}
