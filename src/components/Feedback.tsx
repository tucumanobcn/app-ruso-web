import type { Ref } from 'react'
import { ERROR_TYPES, SKILLS } from '../content/glossary'
import type { Question, TextLang } from '../content/types'
import {
  acceptedSequences,
  grade,
  joinTokens,
  orderedTexts,
  type AnswerValue,
} from '../lib/answers'
import { QuestionSource } from './QuestionSource'

interface FeedbackProps {
  question: Question
  answer: AnswerValue | undefined
  headingRef?: Ref<HTMLHeadingElement>
}

function Ru({ children, lang = 'ru' }: { children: string; lang?: TextLang }) {
  return (
    <span lang={lang} className={lang === 'ru' ? 'ru' : undefined}>
      {children}
    </span>
  )
}

/** Detalle de lo respondido, según el formato de la pregunta. */
function AnswerDetail({ question, answer }: { question: Question; answer: AnswerValue }) {
  const { correct } = grade(question, answer)

  switch (question.kind) {
    case 'choice': {
      if (correct || answer.kind !== 'choice') return null
      const lang = question.optionsLang ?? 'ru'
      const chosen = question.options.find((o) => o.id === answer.optionId)
      const right = question.options.find((o) => o.id === question.correctOptionId)
      return (
        <>
          {chosen && (
            <>
              <p>
                <strong>Tu respuesta: </strong>
                <Ru lang={lang}>{chosen.text}</Ru>
              </p>
              <p>{chosen.whyWrong}</p>
            </>
          )}
          {right && (
            <p>
              <strong>Respuesta correcta: </strong>
              <Ru lang={lang}>{right.text}</Ru>
            </p>
          )}
        </>
      )
    }

    case 'multi': {
      if (answer.kind !== 'multi') return null
      const lang = question.optionsLang ?? 'ru'
      const wrongChosen = question.options.filter(
        (o) => answer.optionIds.includes(o.id) && !question.correctOptionIds.includes(o.id),
      )
      const missed = question.options.filter(
        (o) => question.correctOptionIds.includes(o.id) && !answer.optionIds.includes(o.id),
      )
      const rights = question.options.filter((o) => question.correctOptionIds.includes(o.id))
      return (
        <>
          {(wrongChosen.length > 0 || missed.length > 0) && (
            <ul className="detail-list">
              {wrongChosen.map((o) => (
                <li key={o.id}>
                  Marcaste <Ru lang={lang}>{o.text}</Ru>, que no es correcta. {o.whyWrong}
                </li>
              ))}
              {missed.map((o) => (
                <li key={o.id}>
                  Te faltó <Ru lang={lang}>{o.text}</Ru>. {o.note}
                </li>
              ))}
            </ul>
          )}
          <div className="feedback__block">
            <h4>Respuestas correctas</h4>
            <ul className="detail-list">
              {rights.map((o) => (
                <li key={o.id}>
                  <Ru lang={lang}>{o.text}</Ru>
                  {o.note ? `: ${o.note}` : ''}
                </li>
              ))}
            </ul>
          </div>
        </>
      )
    }

    case 'order': {
      if (answer.kind !== 'order') return null
      const yours = joinTokens(question, orderedTexts(question, answer.tokenIndexes))
      const accepted = acceptedSequences(question).map((s) => joinTokens(question, s))
      const same = (a: string, b: string) => a.toLocaleLowerCase('ru') === b.toLocaleLowerCase('ru')
      // Si acertaste, «también es correcto» muestra las demás opciones válidas, no la tuya.
      const main = correct ? yours : accepted[0]
      const others = accepted.filter((text) => !same(text, main))
      return (
        <>
          {!correct && (
            <p>
              <strong>Tu orden: </strong>
              <span lang="ru" className="ru pre-line">
                {yours}
              </span>
            </p>
          )}
          <p>
            <strong>{correct ? 'Tu respuesta: ' : 'Orden correcto: '}</strong>
            <span lang="ru" className="ru pre-line">
              {main}
            </span>
          </p>
          {others.length > 0 && (
            <p>
              <strong>También es correcto: </strong>
              {others.map((text) => (
                <span key={text} lang="ru" className="ru pre-line alt-answer">
                  {text}
                </span>
              ))}
            </p>
          )}
          {question.orderNote && <p>{question.orderNote}</p>}
        </>
      )
    }

    case 'match': {
      if (correct || answer.kind !== 'match') return null
      const wrong = question.pairs.filter((pair) => answer.pairs[pair.id] !== pair.id)
      // Quita el punto final para que no se acumule con la puntuación de la frase.
      const bare = (text: string) => text.replace(/\.$/, '')
      return (
        <ul className="detail-list">
          {wrong.map((pair) => {
            const chosen = question.pairs.find((p) => p.id === answer.pairs[pair.id])
            return (
              <li key={pair.id}>
                «<Ru lang={question.leftLang}>{bare(pair.left)}</Ru>»: elegiste «
                <Ru lang={question.rightLang}>{bare(chosen?.right ?? '—')}</Ru>»; lo correcto es «
                <Ru lang={question.rightLang}>{bare(pair.right)}</Ru>».
              </li>
            )
          })}
        </ul>
      )
    }
  }
}

/** Corrección pedagógica de una pregunta: qué es correcto, por qué y qué repasar. */
export function Feedback({ question, answer, headingRef }: FeedbackProps) {
  if (!answer) return null
  const { correct, errorType } = grade(question, answer)

  return (
    <section className={`feedback ${correct ? 'feedback--ok' : 'feedback--ko'}`}>
      <h3 className="feedback__title" tabIndex={-1} ref={headingRef}>
        <span aria-hidden="true">{correct ? '✓' : '✗'}</span>{' '}
        {correct ? 'Correcto' : 'No es correcto'}
      </h3>

      <AnswerDetail question={question} answer={answer} />

      <p>{question.explanation.whyCorrect}</p>

      <div className="feedback__block">
        <h4>Regla</h4>
        <p>{question.explanation.rule}</p>
      </div>

      <div className="feedback__block">
        <h4>Más ejemplos</h4>
        <ul className="examples">
          {question.explanation.examples.map((example) => (
            <li key={example.ru}>
              <span lang="ru" className="ru">
                {example.ru}
              </span>
              <span className="examples__es">{example.es}</span>
            </li>
          ))}
        </ul>
      </div>

      {!correct && (
        <div className="feedback__block feedback__review">
          <h4>Para repasar</h4>
          <p>{SKILLS[question.skill].review}</p>
          {errorType && (
            <p className="feedback__error-type">Tipo de error registrado: {ERROR_TYPES[errorType]}</p>
          )}
        </div>
      )}

      <QuestionSource question={question} />
    </section>
  )
}
