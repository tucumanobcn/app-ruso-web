import { CompetencyProfile } from '../components/CompetencyProfile'
import { LessonHistory, LevelPathCard, SummaryTiles, WeeklyGoalCard } from '../components/ProgressPanels'
import { WeeklyCharts } from '../components/WeeklyCharts'
import { StateBadge } from '../components/StateBadge'
import { WeakPointCard } from '../components/WeakPointCard'
import { ERROR_TYPES, SKILLS, type SkillId } from '../content/glossary'
import { dependentsOf, KNOWLEDGE_MAP } from '../content/knowledgeMap'
import { DEFAULT_MASTERY_CONFIG as CFG } from '../engine/config'
import { frequentErrors, weakPoints, type MasteryMap } from '../engine/insights'
import { STATE_LABEL, STATE_ORDER, type SkillMastery } from '../engine/mastery'
import { FORMAT_FAMILY_LABEL } from '../engine/questionIndex'
import { relativeDay, type ScheduleMap, type SkillSchedule } from '../engine/scheduler'
import type { CompetencyResult } from '../engine/profile'
import { lessonHistory, levelPaths, studyMinutes, weeklyGoal, weeklyStats } from '../engine/stats'
import type { ProgressData } from '../lib/storage'

interface ProgressProps {
  data: ProgressData
  mastery: MasteryMap
  schedule: ScheduleMap
  now: number
  profile: CompetencyResult[]
  onPractice: (skill: SkillId) => void
  onOpenData: () => void
  onOpenDiagnostic: () => void
  onSetWeeklyGoal: (target: number) => void
}

const SECTIONS = [
  ['resumen', 'Resumen'],
  ['objetivo', 'Objetivo'],
  ['evolucion', 'Evolución'],
  ['camino', 'Siguiente nivel'],
  ['perfil', 'Competencias'],
  ['debiles', 'Puntos débiles'],
  ['repasos', 'Repasos'],
  ['historial', 'Historial'],
  ['mapa', 'Mapa'],
] as const

const pct = (value: number) => `${Math.round(value * 100)} %`

function groupByModule(skills: SkillId[]): [string, SkillId[]][] {
  const groups = new Map<string, SkillId[]>()
  for (const skill of skills) {
    const module = KNOWLEDGE_MAP[skill].module
    groups.set(module, [...(groups.get(module) ?? []), skill])
  }
  return [...groups]
}

export function Progress({
  data,
  mastery,
  schedule,
  now,
  profile,
  onPractice,
  onOpenData,
  onOpenDiagnostic,
  onSetWeeklyGoal,
}: ProgressProps) {
  const all = Object.values(mastery) as SkillMastery[]
  const counts = STATE_ORDER.map((state) => [state, all.filter((m) => m.state === state).length] as const)
  const weak = weakPoints(mastery)
  const errors = frequentErrors(data.answerLog)
  const calendar = (Object.values(schedule) as SkillSchedule[]).sort((a, b) => a.dueAt - b.dueAt)
  const weeks = weeklyStats(data.answerLog, data.completedSessions, now)
  const goal = weeklyGoal(data.completedSessions, data.preferences.weeklyGoal, now)

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Tu progreso</h1>
        <p className="muted">
          El estado de cada conocimiento se calcula a partir de tus respuestas, no del número de
          lecciones hechas. Es una estimación orientativa, no una certificación MCER.
        </p>
      </header>

      <nav className="anchor-nav" aria-label="Secciones de la página">
        {SECTIONS.filter(([id]) => id !== 'repasos' || calendar.length > 0).map(([id, label]) => (
          <a key={id} href={`#${id}`} className="chip">
            {label}
          </a>
        ))}
      </nav>

      <section className="card" aria-labelledby="summary-title" id="resumen">
        <h2 id="summary-title">Resumen</h2>
        <SummaryTiles
          profile={profile}
          minutes={studyMinutes(data.answerLog)}
          sessions={data.completedSessions.length}
          mastered={counts.find(([state]) => state === 'dominado')?.[1] ?? 0}
          totalSkills={all.length}
        />
        <h3 className="summary-subtitle">Conocimientos por estado</h3>
        <ul className="state-summary">
          {counts.map(([state, count]) => (
            <li key={state}>
              <span className="state-summary__count">{count}</span>
              <StateBadge state={state} />
            </li>
          ))}
        </ul>
      </section>

      <WeeklyGoalCard goal={goal} onChange={onSetWeeklyGoal} />

      <WeeklyCharts weeks={weeks} />

      <LevelPathCard paths={levelPaths(mastery)} onPractice={onPractice} />

      <div id="perfil" className="anchor-target">
        <CompetencyProfile profile={profile} onOpenDiagnostic={onOpenDiagnostic} />
      </div>

      <section className="card" aria-labelledby="weak-title" id="debiles">
        <h2 id="weak-title">Mis puntos débiles</h2>
        {weak.length === 0 ? (
          <p className="muted">
            {data.answerLog.length === 0
              ? 'Aparecerán aquí cuando empieces a responder ejercicios.'
              : 'Ahora mismo no tienes conocimientos «en aprendizaje» ni «necesita repaso». Tus errores siguen guardados en el historial.'}
          </p>
        ) : (
          <>
            <p className="muted small">
              Ordenados por prioridad: primero los esenciales y los que sirven de base a otros.
            </p>
            <ul className="weak-list">
              {weak.map((point) => (
                <WeakPointCard
                  key={point.mastery.skill}
                  point={point}
                  onPractice={() => onPractice(point.mastery.skill)}
                />
              ))}
            </ul>
          </>
        )}
      </section>

      {calendar.length > 0 && (
        <section className="card" id="repasos">
          <h2>Calendario de repasos</h2>
          <p className="muted small">
            Cuándo conviene repasar cada conocimiento según tus resultados. «Recuerdo» es la
            probabilidad estimada de acordarte hoy.
          </p>
          <ul className="calendar">
            {calendar.map((item) => {
              const isDue = item.dueAt <= now || relativeDay(item.dueAt, now) === 'hoy'
              return (
                <li key={item.skill} className={isDue ? 'calendar__row calendar__row--due' : 'calendar__row'}>
                  <span className="calendar__skill">{SKILLS[item.skill].label}</span>
                  <span className="calendar__when">{isDue ? 'Toca hoy' : relativeDay(item.dueAt, now)}</span>
                  <span className="calendar__meta">
                    Recuerdo {pct(item.retrievability)} · estabilidad {item.stability < 1 ? '<1' : Math.round(item.stability)}{' '}
                    {Math.round(item.stability) === 1 ? 'día' : 'días'} · {item.reviews}{' '}
                    {item.reviews === 1 ? 'repaso' : 'repasos'}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {errors.length > 0 && (
        <section className="card">
          <h2>Errores más frecuentes</h2>
          <p className="muted small">Todo tu historial: los errores no se borran al avanzar.</p>
          <ol className="error-list">
            {errors.map(([type, count]) => (
              <li key={type}>
                <span>{ERROR_TYPES[type]}</span>
                <span className="error-list__count">{count}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <LessonHistory entries={lessonHistory(data.completedSessions)} total={data.completedSessions.length} />

      <section className="card" id="mapa">
        <h2>Mapa de conocimientos</h2>
        <p className="muted small">Toca un conocimiento para ver por qué está en ese estado.</p>
        {groupByModule(Object.keys(mastery) as SkillId[]).map(([module, skills]) => (
          <div key={module} className="map-group">
            <h3 className="map-group__title">{module}</h3>
            <ul className="map-list">
              {skills.map((skill) => (
                <SkillRow
                  key={skill}
                  mastery={mastery[skill]}
                  map={mastery}
                  onPractice={() => onPractice(skill)}
                />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="card">
        <details>
          <summary className="summary-heading">Cómo se calcula el dominio</summary>
          <ul className="plain-list small">
            <li>
              Se miran tus últimas {CFG.windowSize} respuestas de cada conocimiento. Cada ejercicio
              cuenta una vez (su respuesta más reciente) y las respuestas recientes pesan más.
            </li>
            <li>
              <strong>{STATE_LABEL['en-consolidacion']}:</strong> al menos un {pct(CFG.consolidationAccuracy)} de
              aciertos en {CFG.minItemsForConsolidation} ejercicios distintos o más.
            </li>
            <li>
              <strong>{STATE_LABEL.dominado} (provisional):</strong> al menos un {pct(CFG.masteryAccuracy)},{' '}
              {CFG.minDistinctQuestions} ejercicios distintos acertados, {CFG.minFormatFamilies} tipos de
              ejercicio distintos y ningún error repetido.
            </li>
            <li>
              <strong>Consolidado:</strong> además, aciertos separados por al menos{' '}
              {CFG.consolidationSpacingDays} días.
            </li>
            <li>
              <strong>{STATE_LABEL['necesita-repaso']}:</strong> algo que dominabas y vuelves a fallar, o
              cuyo día de repaso ya ha pasado.
            </li>
            <li>
              <strong>Repasos:</strong> el calendario se calcula con un modelo inspirado en FSRS. Cada día
              que practicas un conocimiento cuenta como un repaso; según tus aciertos, aumenta o baja su
              estabilidad (los días que se mantiene el recuerdo). El repaso toca cuando la probabilidad
              estimada de recordarlo baja al 90 % (85 % en los conocimientos secundarios).
            </li>
            <li>Los umbrales están en src/engine/config.ts y src/engine/scheduler.ts.</li>
          </ul>
        </details>
      </section>

      <button className="btn btn--secondary" onClick={onOpenData}>
        Mis datos: exportar o importar
      </button>
    </div>
  )
}

function SkillRow({
  mastery,
  map,
  onPractice,
}: {
  mastery: SkillMastery
  map: MasteryMap
  onPractice: () => void
}) {
  const node = KNOWLEDGE_MAP[mastery.skill]
  const { evidence } = mastery
  const dependents = dependentsOf(mastery.skill)

  return (
    <li>
      <details className="skill-row">
        <summary>
          <span className="skill-row__label">
            {SKILLS[mastery.skill].label}
            <span className="muted small">
              {' '}
              · {node.level} · {node.importance}
            </span>
          </span>
          <StateBadge state={mastery.state} consolidated={mastery.consolidated} />
        </summary>
        <div className="skill-row__body small">
          <ul className="plain-list">
            {mastery.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {evidence.totalAttempts > 0 && (
            <dl className="evidence">
              <div>
                <dt>Precisión reciente</dt>
                <dd>{evidence.recentAccuracy === null ? '—' : pct(evidence.recentAccuracy)}</dd>
              </div>
              <div>
                <dt>Ejercicios distintos acertados</dt>
                <dd>
                  {evidence.distinctCorrect} de {evidence.available}
                </dd>
              </div>
              <div>
                <dt>Respuestas / errores (total)</dt>
                <dd>
                  {evidence.totalAttempts} / {evidence.totalErrors}
                </dd>
              </div>
              <div>
                <dt>Tipos de ejercicio acertados</dt>
                <dd>
                  {evidence.families.length === 0
                    ? '—'
                    : evidence.families.map((f) => FORMAT_FAMILY_LABEL[f]).join(', ')}
                </dd>
              </div>
            </dl>
          )}
          {node.requires.length > 0 && (
            <p>
              <strong>Se apoya en:</strong>{' '}
              {node.requires
                .map((req) => `${SKILLS[req].label} (${STATE_LABEL[map[req].state].toLowerCase()})`)
                .join(', ')}
            </p>
          )}
          {dependents.length > 0 && (
            <p>
              <strong>Es base de:</strong> {dependents.map((dep) => SKILLS[dep].label).join(', ')}
            </p>
          )}
          {evidence.available > 0 && (
            <button className="btn btn--ghost btn--small" onClick={onPractice}>
              Practicar ({evidence.available} {evidence.available === 1 ? 'ejercicio' : 'ejercicios'})
            </button>
          )}
        </div>
      </details>
    </li>
  )
}
