import { LessonMeta } from '../components/LessonMeta'
import { ReadinessNote } from '../components/ReadinessNote'
import { LESSONS } from '../content/lessons'
import type { Lesson } from '../content/types'
import type { MasteryMap } from '../engine/insights'
import type { ProgressData } from '../lib/storage'

interface CatalogProps {
  data: ProgressData
  mastery: MasteryMap
  onOpenLesson: (lessonId: string) => void
}

/** Agrupa las lecciones por módulo manteniendo el orden recomendado. */
function groupByTopic(lessons: Lesson[]): [string, Lesson[]][] {
  const groups = new Map<string, Lesson[]>()
  for (const lesson of lessons) {
    groups.set(lesson.topic, [...(groups.get(lesson.topic) ?? []), lesson])
  }
  return [...groups]
}

export function Catalog({ data, mastery, onOpenLesson }: CatalogProps) {
  const exerciseCount = LESSONS.reduce((sum, lesson) => sum + lesson.questions.length, 0)

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Lecciones</h1>
        <p className="muted">
          {exerciseCount} ejercicios en {LESSONS.filter((l) => l.status === 'disponible').length}{' '}
          lecciones, en el orden recomendado de estudio. Las marcadas como «Próximamente» todavía no
          tienen ejercicios.
        </p>
      </header>

      {groupByTopic(LESSONS).map(([topic, lessons]) => (
        <section key={topic} className="catalog-group" aria-label={topic}>
          <h2 className="catalog-group__title">{topic}</h2>
          <ul className="lesson-list">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                data={data}
                mastery={mastery}
                onOpenLesson={onOpenLesson}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function LessonCard({
  lesson,
  data,
  mastery,
  onOpenLesson,
}: {
  lesson: Lesson
  data: ProgressData
  mastery: MasteryMap
  onOpenLesson: (lessonId: string) => void
}) {
  const sessions = data.completedSessions.filter((s) => s.lessonId === lesson.id)
  const best = sessions.reduce<number | null>(
    (acc, s) => (acc === null || s.correctCount > acc ? s.correctCount : acc),
    null,
  )
  const inProgress = data.activeSession?.lessonId === lesson.id
  const available = lesson.status === 'disponible'
  const titleId = `lesson-title-${lesson.id}`

  return (
    <li
      className={`card lesson-card${available ? '' : ' lesson-card--soon'}`}
      aria-labelledby={titleId}
    >
      <h3 id={titleId}>{lesson.title}</h3>
      <LessonMeta lesson={lesson} />
      <p>{lesson.objective}</p>
      <p className="muted small">
        <strong>Conviene conocer:</strong> {lesson.prerequisites.join(' · ')}
      </p>

      {available && <ReadinessNote lesson={lesson} mastery={mastery} />}

      {available ? (
        <div className="lesson-card__footer">
          <span className="muted small">
            {inProgress
              ? 'En curso'
              : best === null
                ? 'Sin empezar'
                : `Mejor resultado: ${best}/${lesson.questions.length} · ${sessions.length} ${sessions.length === 1 ? 'intento' : 'intentos'}`}
          </span>
          <button className="btn btn--primary" onClick={() => onOpenLesson(lesson.id)}>
            {inProgress ? 'Continuar' : best === null ? 'Empezar' : 'Repetir'}
          </button>
        </div>
      ) : (
        <div className="lesson-card__footer">
          <span className="badge">Próximamente</span>
        </div>
      )}
    </li>
  )
}
