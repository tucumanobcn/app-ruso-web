import { SKILLS } from '../content/glossary'
import { getLesson } from '../content/lessons'
import { STATE_LABEL } from '../engine/mastery'
import type { CompetencyResult } from '../engine/profile'
import { globalLevel } from '../engine/profile'
import type { HistoryEntry, LevelPath, WeeklyGoal } from '../engine/stats'
import { MAX_WEEKLY_GOAL, MIN_WEEKLY_GOAL } from '../lib/storage'
import { StateBadge } from './StateBadge'

function formatMinutes(total: number): string {
  if (total < 60) return `${total} min`
  const h = Math.floor(total / 60)
  const m = total % 60
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}

/* ---------- Resumen en cifras ---------- */

interface SummaryTilesProps {
  profile: CompetencyResult[]
  minutes: number
  sessions: number
  mastered: number
  totalSkills: number
}

export function SummaryTiles({ profile, minutes, sessions, mastered, totalSkills }: SummaryTilesProps) {
  const global = globalLevel(profile)
  const tiles = [
    { label: 'Nivel global orientativo', value: global?.label ?? 'Sin datos', small: true },
    { label: 'Tiempo de estudio (estimado)', value: formatMinutes(minutes) },
    { label: 'Sesiones terminadas', value: String(sessions) },
    { label: 'Conocimientos dominados', value: `${mastered} de ${totalSkills}` },
  ]
  return (
    <ul className="stat-tiles" aria-label="Resumen en cifras">
      {tiles.map((tile) => (
        <li key={tile.label} className="stat-tile">
          <span className={tile.small ? 'stat-tile__value stat-tile__value--text' : 'stat-tile__value'}>
            {tile.value}
          </span>
          <span className="stat-tile__label">{tile.label}</span>
        </li>
      ))}
    </ul>
  )
}

/* ---------- Objetivo semanal ---------- */

interface WeeklyGoalCardProps {
  goal: WeeklyGoal
  onChange: (target: number) => void
}

export function WeeklyGoalCard({ goal, onChange }: WeeklyGoalCardProps) {
  const ratio = Math.min(1, goal.done / goal.target)
  const left = goal.target - goal.done
  return (
    <section className="card goal-card" aria-labelledby="goal-title" id="objetivo">
      <p className="eyebrow">Esta semana</p>
      <h2 id="goal-title">Objetivo semanal</h2>
      <p className="goal-card__status">
        {goal.reached ? (
          <>
            <span className="goal-card__star" aria-hidden="true">
              ★
            </span>{' '}
            <strong>¡Objetivo cumplido!</strong> {goal.done} de {goal.target} {goal.target === 1 ? 'sesión' : 'sesiones'}.
          </>
        ) : (
          <>
            <strong>
              {goal.done} de {goal.target} {goal.target === 1 ? 'sesión' : 'sesiones'}
            </strong>{' '}
            · {left === 1 ? 'te falta 1' : `te faltan ${left}`}
          </>
        )}
      </p>
      <div
        className="goal-meter"
        role="progressbar"
        aria-label="Sesiones de esta semana"
        aria-valuemin={0}
        aria-valuemax={goal.target}
        aria-valuenow={Math.min(goal.done, goal.target)}
        aria-valuetext={`${goal.done} de ${goal.target} sesiones`}
      >
        <span className="goal-meter__fill" style={{ width: `${ratio * 100}%` }} />
      </div>
      <div className="goal-stepper">
        <span className="small">Sesiones por semana</span>
        <div className="goal-stepper__controls">
          <button
            className="btn btn--ghost btn--small"
            onClick={() => onChange(goal.target - 1)}
            disabled={goal.target <= MIN_WEEKLY_GOAL}
            aria-label="Una sesión menos por semana"
          >
            −
          </button>
          <output className="goal-stepper__value" aria-live="polite">
            {goal.target}
          </output>
          <button
            className="btn btn--ghost btn--small"
            onClick={() => onChange(goal.target + 1)}
            disabled={goal.target >= MAX_WEEKLY_GOAL}
            aria-label="Una sesión más por semana"
          >
            +
          </button>
        </div>
      </div>
      <p className="muted small">
        Cuenta cada lección, repaso o sesión terminada desde el lunes. Con unos 10 minutos por sesión,
        5 a la semana son unos 50 minutos.
      </p>
    </section>
  )
}

/* ---------- Camino al siguiente nivel ---------- */

export function LevelPathCard({ paths, onPractice }: { paths: LevelPath[]; onPractice: (skill: LevelPath['missing'][number]['skill']) => void }) {
  // El nivel que toca: el primero cuyos esenciales no están todos dominados.
  const current = paths.find((p) => !p.complete)
  return (
    <section className="card" aria-labelledby="path-title" id="camino">
      <p className="eyebrow">Itinerario</p>
      <h2 id="path-title">Camino al siguiente nivel</h2>
      <ul className="path-levels">
        {paths.map((p) => (
          <li key={p.level} className="path-level">
            <div className="path-level__head">
              <strong>{p.level}</strong>
              <span className="small">
                {p.essentialMastered} de {p.essentialTotal} esenciales dominados
                {p.complete && ' ✓'}
              </span>
            </div>
            <div
              className="path-bar"
              role="progressbar"
              aria-label={`Conocimientos esenciales de ${p.level} dominados`}
              aria-valuemin={0}
              aria-valuemax={p.essentialTotal}
              aria-valuenow={p.essentialMastered}
            >
              <span className="path-bar__fill" style={{ width: `${p.essentialTotal ? (p.essentialMastered / p.essentialTotal) * 100 : 0}%` }} />
            </div>
            <p className="muted small">
              {p.mastered} de {p.total} conocimientos de {p.level} en total (esenciales y secundarios).
            </p>
          </li>
        ))}
      </ul>

      {current ? (
        <>
          <h3 className="path-subtitle">
            Para cerrar {current.level} te faltan {current.missing.length}{' '}
            {current.missing.length === 1 ? 'esencial' : 'esenciales'}
          </h3>
          <p className="muted small">Primero los que sirven de base a más temas.</p>
          <ul className="path-missing">
            {current.missing.slice(0, 6).map((item) => (
              <li key={item.skill} className="path-missing__row">
                <div className="path-missing__text">
                  <span>{SKILLS[item.skill].label}</span>
                  <span className="muted small">
                    {item.blocks > 0
                      ? `Base de ${item.blocks} ${item.blocks === 1 ? 'tema' : 'temas'}`
                      : 'No bloquea otros temas'}
                  </span>
                </div>
                <StateBadge state={item.state} />
                <button
                  className="btn btn--ghost btn--small"
                  onClick={() => onPractice(item.skill)}
                  aria-label={`Practicar ${SKILLS[item.skill].label} (${STATE_LABEL[item.state].toLowerCase()})`}
                >
                  Practicar
                </button>
              </li>
            ))}
          </ul>
          {current.missing.length > 6 && (
            <p className="muted small">Y {current.missing.length - 6} más en el mapa de conocimientos.</p>
          )}
        </>
      ) : (
        <p>
          <span aria-hidden="true">★ </span>
          <strong>Tienes dominados todos los esenciales de A1 y A2</strong> que cubre la app. B1 aún no
          tiene contenido.
        </p>
      )}
      <p className="note">
        «Dominar» un nivel aquí significa dominar los conocimientos esenciales que la app enseña de ese
        nivel; no equivale a un certificado MCER.
      </p>
    </section>
  )
}

/* ---------- Historial de lecciones ---------- */

function lessonTitle(lessonId: string): string {
  const lesson = getLesson(lessonId)
  return lesson?.title ?? 'Lección que ya no existe'
}

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function LessonHistory({ entries, total }: { entries: HistoryEntry[]; total: number }) {
  return (
    <section className="card" aria-labelledby="history-title" id="historial">
      <h2 id="history-title">Historial de sesiones</h2>
      {entries.length === 0 ? (
        <p className="muted">Aquí aparecerán las lecciones y sesiones que termines.</p>
      ) : (
        <>
          <ol className="history">
            {entries.map((entry) => {
              const accuracy = entry.total > 0 ? Math.round((entry.correct / entry.total) * 100) : 0
              return (
                <li key={entry.id} className="history__row">
                  <span className="history__title">{lessonTitle(entry.lessonId)}</span>
                  <span className="history__meta small">
                    {formatWhen(entry.finishedAt)} · {entry.correct} de {entry.total} ({accuracy} %) ·{' '}
                    {entry.minutes} min
                  </span>
                </li>
              )
            })}
          </ol>
          {total > entries.length && (
            <p className="muted small">
              Se muestran las {entries.length} más recientes de {total}. El historial completo está en
              la copia de tus datos.
            </p>
          )}
        </>
      )}
    </section>
  )
}
