import type { CSSProperties } from 'react'
import { Feedback } from '../components/Feedback'
import { StateBadge } from '../components/StateBadge'
import { VideoList } from '../components/VideoList'
import { videosForLesson, videosForSkills } from '../content/resources'
import { SKILLS, type SkillId } from '../content/glossary'
import type { Lesson, Question } from '../content/types'
import { lessonSkills, masteryChanges, type MasteryMap } from '../engine/insights'
import { relativeDay, type ScheduleMap } from '../engine/scheduler'
import { describeAnswer, grade, type AnswerValue } from '../lib/answers'
import type { CompletedSession } from '../lib/storage'

interface ResultsProps {
  lesson: Lesson
  session: CompletedSession
  /** Dominio calculado sin las respuestas de esta sesión y con ellas. */
  masteryBefore: MasteryMap
  masteryAfter: MasteryMap
  schedule: ScheduleMap
  onRepeat: () => void
  onCatalog: () => void
}

function isRight(question: Question, answer: AnswerValue | undefined): boolean {
  return answer !== undefined && grade(question, answer).correct
}

function formatDuration(startIso: string, endIso: string): string {
  const seconds = Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 1000)
  if (seconds < 60) return 'menos de 1 min'
  return `${Math.round(seconds / 60)} min`
}

function summaryMessage(correct: number, total: number): string {
  if (correct === total) return 'Todas correctas en esta sesión.'
  if (correct >= total * 0.6) return 'Buen resultado. Revisa abajo los puntos que has fallado.'
  return 'Este tema necesita más práctica. Lee las explicaciones de abajo y repite la lección cuando quieras.'
}

export function Results({ lesson, session, masteryBefore, masteryAfter, schedule, onRepeat, onCatalog }: ResultsProps) {
  const { correctCount, total } = session
  const failedSkills = [
    ...new Set(
      lesson.questions
        .filter((q) => !isRight(q, session.answers[q.id]))
        .map((q) => q.skill),
    ),
  ] as SkillId[]
  const changes = masteryChanges(lessonSkills(lesson), masteryBefore, masteryAfter)
  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100)

  return (
    <div className="stack">
      <header className="page-header">
        <p className="eyebrow">Resultados</p>
        <h1>{lesson.title}</h1>
      </header>

      <section className="card score">
        <div
          className="score__ring"
          style={{ '--percent': `${percent}%` } as CSSProperties}
          role="img"
          aria-label={`${correctCount} de ${total} correctas`}
        >
          <span>
            {correctCount}/{total}
          </span>
        </div>
        <div>
          {correctCount === total && total > 0 && <p className="reward">★ Pleno</p>}
          <p className="score__message">{summaryMessage(correctCount, total)}</p>
          <p className="muted small">Tiempo: {formatDuration(session.startedAt, session.finishedAt)}</p>
        </div>
      </section>

      <section className="card">
        <h2>Cómo ha cambiado tu dominio</h2>
        <ul className="change-list">
          {changes.map(({ skill, before, after }) => (
            <li key={skill}>
              <span className="change-list__label">{SKILLS[skill].label}</span>
              <span className="change-list__states">
                {before !== after.state && (
                  <>
                    <StateBadge state={before} />
                    <span aria-label="pasa a">→</span>
                  </>
                )}
                <StateBadge state={after.state} consolidated={after.consolidated} />
              </span>
              {after.state !== 'dominado' && after.reasons[0] && (
                <span className="muted small">{after.reasons[0]}</span>
              )}
              {schedule[skill] && (
                <span className="next-review">Próximo repaso: {relativeDay(schedule[skill].dueAt)}</span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {failedSkills.length > 0 && (
        <section className="card">
          <h2>Qué repasar</h2>
          <ul className="review-list">
            {failedSkills.map((skill) => (
              <li key={skill}>
                <strong>{SKILLS[skill].label}.</strong> {SKILLS[skill].review}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(failedSkills.length > 0 || videosForLesson(lesson.id).length > 0) && (
        <section className="card">
          <h2>{failedSkills.length > 0 ? 'Vídeos para lo que has fallado' : 'Para profundizar'}</h2>
          <VideoList
            videos={
              failedSkills.length > 0
                ? videosForSkills(failedSkills, 3)
                : videosForLesson(lesson.id).slice(0, 2)
            }
          />
        </section>
      )}

      <section className="card">
        <h2>Revisa tus respuestas</h2>
        <ol className="answer-review">
          {lesson.questions.map((question, index) => {
            const answer = session.answers[question.id]
            const ok = isRight(question, answer)
            return (
              <li key={question.id}>
                <details>
                  <summary>
                    <span className={`dot ${ok ? 'dot--ok' : 'dot--ko'}`} aria-hidden="true">
                      {ok ? '✓' : '✗'}
                    </span>
                    <span className="answer-review__summary">
                      <span className="small muted">
                        Pregunta {index + 1} · {ok ? 'correcta' : 'incorrecta'}
                      </span>
                      {question.prompt ? (
                        <span lang="ru" className="ru">
                          {question.prompt}
                        </span>
                      ) : (
                        <span>{question.instruction}</span>
                      )}
                      <span className="small">Tu respuesta: {describeAnswer(question, answer)}</span>
                    </span>
                  </summary>
                  <Feedback question={question} answer={answer} />
                </details>
              </li>
            )
          })}
        </ol>
      </section>

      <p className="note">
        Un único resultado no indica dominio: el estado de cada conocimiento se calcula con todo tu
        historial y exige aciertos variados y mantenidos en el tiempo.
      </p>

      <div className="actions">
        <button className="btn btn--ghost" onClick={onCatalog}>
          Volver al catálogo
        </button>
        <button className="btn btn--primary" onClick={onRepeat}>
          Repetir la lección
        </button>
      </div>
    </div>
  )
}
