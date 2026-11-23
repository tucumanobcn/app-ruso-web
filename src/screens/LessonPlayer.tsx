import { Illustration } from '../components/illustrations'
import { LessonMeta } from '../components/LessonMeta'
import { ProgressBar } from '../components/ProgressBar'
import { ReadinessNote } from '../components/ReadinessNote'
import { QuestionCard } from '../components/questions/QuestionCard'
import { VideoList } from '../components/VideoList'
import { VocabCards } from '../components/VocabCards'
import { videosForLesson } from '../content/resources'
import type { Lesson } from '../content/types'
import type { MasteryMap } from '../engine/insights'
import type { AnswerValue } from '../lib/answers'
import type { ActiveSession } from '../lib/storage'

interface LessonPlayerProps {
  lesson: Lesson
  session: ActiveSession
  mastery: MasteryMap
  onAnswer: (questionId: string, answer: AnswerValue) => void
  onStep: (step: ActiveSession['step']) => void
  onFinish: () => void
  onExit: () => void
}

export function LessonPlayer({ lesson, session, mastery, onAnswer, onStep, onFinish, onExit }: LessonPlayerProps) {
  const total = lesson.questions.length
  const answeredCount = lesson.questions.filter((q) => session.answers[q.id] !== undefined).length

  if (session.step === 'intro' && lesson.intro) {
    const intro = lesson.intro
    return (
      <div className="stack">
        <header className="page-header">
          <p className="eyebrow">{lesson.topic}</p>
          <h1>{lesson.title}</h1>
          <LessonMeta lesson={lesson} />
        </header>

        <section className="card">
          <h2>Objetivo</h2>
          <p>{lesson.objective}</p>
          {lesson.prerequisites.length > 0 && (
            <p className="muted small">
              <strong>Conviene conocer:</strong> {lesson.prerequisites.join(' · ')}
            </p>
          )}
          <ReadinessNote lesson={lesson} mastery={mastery} />
        </section>

        <section className="card">
          <h2>{intro.title}</h2>
          {intro.illustration && <Illustration id={intro.illustration} />}
          {intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {intro.tables.map((table) => (
            <div className="table-wrap" key={table.caption}>
              <table>
                <caption>{table.caption}</caption>
                <thead>
                  <tr>
                    {table.headers.map((header) => (
                      <th key={header} scope="col">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.join('|')}>
                      {row.map((cell, index) => (
                        <td key={index} lang={table.ruColumns.includes(index) ? 'ru' : undefined}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {table.note && <p className="note">{table.note}</p>}
            </div>
          ))}
        </section>

        <VocabCards lessonId={lesson.id} />

        {videosForLesson(lesson.id).length > 0 && (
          <section className="card">
            <details>
              <summary className="summary-heading">
                Vídeos para profundizar ({videosForLesson(lesson.id).length})
              </summary>
              <VideoList videos={videosForLesson(lesson.id)} />
            </details>
          </section>
        )}

        <div className="actions actions--sticky">
          <button className="btn btn--ghost" onClick={onExit}>
            Salir
          </button>
          <button className="btn btn--primary" onClick={() => onStep(0)}>
            Empezar los ejercicios
          </button>
        </div>
      </div>
    )
  }

  const index = typeof session.step === 'number' ? session.step : 0
  const question = lesson.questions[index]
  const isLast = index === total - 1
  const allAnswered = answeredCount === total

  return (
    <div className="stack">
      <div className="lesson-top">
        <button className="btn btn--ghost btn--small" onClick={onExit}>
          Salir
        </button>
        <ProgressBar value={answeredCount} max={total} label={`Pregunta ${index + 1} de ${total}`} />
      </div>

      <QuestionCard
        key={question.id}
        question={question}
        order={session.optionOrder[question.id]}
        answer={session.answers[question.id]}
        onAnswer={(answer) => onAnswer(question.id, answer)}
      />

      {(index > 0 || session.answers[question.id] !== undefined) && (
        <div className="actions actions--sticky">
          {index > 0 ? (
            <button className="btn btn--ghost" onClick={() => onStep(index - 1)}>
              Anterior
            </button>
          ) : (
            <span />
          )}
          {session.answers[question.id] === undefined ? (
            <span />
          ) : isLast ? (
            <button
              className="btn btn--primary"
              onClick={allAnswered ? onFinish : () => onStep(firstUnanswered(lesson, session))}
            >
              {allAnswered ? 'Ver resultados' : 'Ir a la pregunta pendiente'}
            </button>
          ) : (
            <button className="btn btn--primary" onClick={() => onStep(index + 1)}>
              Siguiente
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function firstUnanswered(lesson: Lesson, session: ActiveSession): number {
  const found = lesson.questions.findIndex((q) => session.answers[q.id] === undefined)
  return found === -1 ? 0 : found
}
