import { ERROR_TYPES, SKILLS } from '../content/glossary'
import type { WeakPoint } from '../engine/insights'
import { videosForSkills } from '../content/resources'
import { StateBadge } from './StateBadge'
import { VideoList } from './VideoList'

interface WeakPointCardProps {
  point: WeakPoint
  onPractice: () => void
  /** Versión breve para la pantalla de inicio. */
  compact?: boolean
}

export function WeakPointCard({ point, onPractice, compact }: WeakPointCardProps) {
  const { mastery, importance, blocks, topErrors } = point
  const info = SKILLS[mastery.skill]
  const accuracy = mastery.evidence.recentAccuracy

  return (
    <li className="weak-point">
      <div className="weak-point__head">
        <h3>{info.label}</h3>
        <StateBadge state={mastery.state} />
      </div>
      <p className="muted small">
        {importance === 'esencial' ? 'Esencial' : 'Secundario'}
        {accuracy !== null && ` · precisión reciente ${Math.round(accuracy * 100)} %`}
        {` · ${mastery.evidence.totalErrors} ${mastery.evidence.totalErrors === 1 ? 'error' : 'errores'} en total`}
      </p>
      {!compact && topErrors.length > 0 && (
        <p className="small">
          <strong>Errores frecuentes:</strong>{' '}
          {topErrors.map(([type, count]) => `${ERROR_TYPES[type].toLowerCase()} (${count})`).join('; ')}
        </p>
      )}
      {blocks.length > 0 && (
        <p className="small">
          <strong>Es base de:</strong> {blocks.map((skill) => SKILLS[skill].label).join(', ')}.
        </p>
      )}
      {!compact && <p className="small">{info.review}</p>}
      {!compact && videosForSkills([mastery.skill], 1).length > 0 && (
        <VideoList videos={videosForSkills([mastery.skill], 1)} compact />
      )}
      <button className="btn btn--secondary btn--small" onClick={onPractice}>
        Practicar este punto
      </button>
    </li>
  )
}
