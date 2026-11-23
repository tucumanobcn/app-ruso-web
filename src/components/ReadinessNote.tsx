import { SKILLS } from '../content/glossary'
import type { Lesson } from '../content/types'
import { lessonReadiness, type MasteryMap } from '../engine/insights'
import { STATE_LABEL } from '../engine/mastery'

/**
 * Aviso de requisitos previos. La progresión es flexible: nunca bloquea la
 * lección, solo explica qué conviene repasar antes.
 */
export function ReadinessNote({ lesson, mastery }: { lesson: Lesson; mastery: MasteryMap }) {
  const { weak, unstudied } = lessonReadiness(lesson, mastery)
  if (weak.length === 0 && unstudied.length === 0) return null

  return (
    <div className={`readiness${weak.length > 0 ? ' readiness--warn' : ''}`}>
      {weak.length > 0 && (
        <p>
          <strong>Conviene repasar antes:</strong>{' '}
          {weak
            .map((m) => `${SKILLS[m.skill].label} (${STATE_LABEL[m.state].toLowerCase()})`)
            .join(', ')}
          . Puedes empezar igualmente.
        </p>
      )}
      {unstudied.length > 0 && (
        <p>
          <strong>Aún no has trabajado:</strong> {unstudied.map((s) => SKILLS[s].label).join(', ')}.
        </p>
      )}
    </div>
  )
}
