import type { Lesson } from '../content/types'

export function LessonMeta({ lesson }: { lesson: Lesson }) {
  return (
    <ul className="meta" aria-label="Datos de la lección">
      <li className="chip chip--level">Nivel {lesson.level}</li>
      {lesson.type === 'mixta' && <li className="chip chip--mixed">Mixta</li>}
      {lesson.type === 'repaso' && <li className="chip chip--mixed">Repaso espaciado</li>}
      {lesson.type === 'practica' && <li className="chip chip--mixed">Práctica</li>}
      <li className="chip">≈ {lesson.estimatedMinutes} min</li>
      {lesson.status === 'disponible' && (
        <li className="chip">{lesson.questions.length} ejercicios</li>
      )}
    </ul>
  )
}
