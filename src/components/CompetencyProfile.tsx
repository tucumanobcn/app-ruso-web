import { SKILLS } from '../content/glossary'
import { globalLevel, UNCOVERED_COMPETENCIES, type CompetencyResult } from '../engine/profile'

interface CompetencyProfileProps {
  profile: CompetencyResult[]
  onOpenDiagnostic?: () => void
}

/** Nivel orientativo por competencia, con barra y conocimientos que más tiran hacia abajo. */
export function CompetencyProfile({ profile, onOpenDiagnostic }: CompetencyProfileProps) {
  const global = globalLevel(profile)

  return (
    <section className="card" aria-labelledby="profile-title">
      <p className="eyebrow">Nivel estimado</p>
      <h2 id="profile-title">Tu perfil por competencias</h2>
      {global ? (
        <p className="profile-global">
          Nivel global orientativo: <strong>{global.label}</strong>
        </p>
      ) : (
        <p className="muted">
          Todavía no hay datos. Haz el diagnóstico (4 bloques cortos) o algunas lecciones para ver tu
          perfil.
        </p>
      )}

      <ul className="profile-list">
        {profile.map((item) => (
          <li key={item.competency.id} className="profile-row">
            <div className="profile-row__head">
              <span className="profile-row__name">{item.competency.label}</span>
              <span className={`level-tag level-tag--${item.status?.replace(' ', '-') ?? 'none'}`}>
                {item.label}
              </span>
            </div>
            <div
              className="profile-bar"
              role="img"
              aria-label={`${item.competency.label}: ${item.label}`}
            >
              <span className="profile-bar__a1" />
              <span className="profile-bar__a2" />
              {item.value !== null && (
                <span className="profile-bar__fill" style={{ width: `${(item.value / 2) * 100}%` }} />
              )}
            </div>
            <p className="muted small">
              {item.evaluated} de {item.total} conocimientos con datos
              {item.weakest.length > 0 &&
                ` · por mejorar: ${item.weakest.map((s) => SKILLS[s].label.toLowerCase()).join(', ')}`}
            </p>
          </li>
        ))}
      </ul>

      <p className="note">
        <strong>Sin evaluar todavía</strong> (no hay ejercicios): {UNCOVERED_COMPETENCIES.join(', ')}.
        B1 aún no se puede evaluar: el contenido llega hasta A2. Es una estimación orientativa, no una
        certificación MCER; se actualiza con cada respuesta.
      </p>
      {onOpenDiagnostic && (
        <button className="btn btn--secondary btn--small" onClick={onOpenDiagnostic}>
          Diagnóstico de nivel
        </button>
      )}
    </section>
  )
}
