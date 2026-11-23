import { PlanCard } from '../components/PlanCard'
import { SessionChooser, type SessionOption } from '../components/SessionChooser'
import { WeakPointCard } from '../components/WeakPointCard'
import { SKILLS, type SkillId } from '../content/glossary'
import { getLesson } from '../content/lessons'
import { weakPoints, type MasteryMap } from '../engine/insights'
import type { SkillMastery } from '../engine/mastery'
import type { DailyPlan } from '../engine/planner'
import { relativeDay, type ScheduleMap, type SkillSchedule } from '../engine/scheduler'
import type { ProgressData } from '../lib/storage'

interface HomeProps {
  data: ProgressData
  mastery: MasteryMap
  schedule: ScheduleMap
  now: number
  plan: DailyPlan
  /** Siguiente lección del itinerario (para «Continuar mi itinerario»). */
  nextLessonId?: string
  /** Ejercicios disponibles para cada sesión manual (0 = no disponible). */
  sessionSizes: { errores: number; mixta: number; vocabulario: number }
  onStartPlan: () => void
  onStartSession: (kind: 'errores' | 'mixta' | 'vocabulario') => void
  onOpenDiagnostic: (blockId?: string) => void
  onOpenCatalog: () => void
  onOpenProgress: () => void
  onOpenLesson: (lessonId: string) => void
  onPractice: (skill: SkillId) => void
}

export function Home(props: HomeProps) {
  const { data, mastery, schedule, now, plan, nextLessonId, sessionSizes } = props
  const active = data.activeSession
  const activeLesson = active ? getLesson(active.lessonId) : undefined
  const nextLesson = nextLessonId ? getLesson(nextLessonId) : undefined

  const weak = weakPoints(mastery).slice(0, 2)
  const all = Object.values(mastery) as SkillMastery[]
  const studied = all.filter((m) => m.state !== 'no-estudiado').length
  const mastered = all.filter((m) => m.state === 'dominado').length

  const upcoming = (Object.values(schedule) as SkillSchedule[]).sort((a, b) => a.dueAt - b.dueAt)[0]
  const nextReview = upcoming
    ? `Próximo repaso: ${SKILLS[upcoming.skill].label.toLowerCase()}, ${relativeDay(upcoming.dueAt, now)}.`
    : undefined

  const options: SessionOption[] = [
    {
      id: 'itinerario',
      title: 'Continuar mi itinerario',
      description: nextLesson ? `Siguiente lección: ${nextLesson.title}.` : '',
      disabledReason: nextLesson ? undefined : 'Ya has hecho todas las lecciones disponibles.',
      onSelect: () => nextLesson && props.onOpenLesson(nextLesson.id),
    },
    {
      id: 'errores',
      title: 'Repasar mis errores',
      description: `${sessionSizes.errores} ejercicios nuevos sobre lo que has fallado en los últimos 30 días.`,
      disabledReason: sessionSizes.errores === 0 ? 'No has fallado nada en los últimos 30 días.' : undefined,
      onSelect: () => props.onStartSession('errores'),
    },
    {
      id: 'tema',
      title: 'Estudiar un tema',
      description: 'Elige una lección concreta del catálogo.',
      onSelect: props.onOpenCatalog,
    },
    {
      id: 'mixta',
      title: 'Sesión mixta',
      description: `${sessionSizes.mixta} ejercicios, cada uno de un tema que ya has trabajado.`,
      disabledReason: sessionSizes.mixta === 0 ? 'Disponible cuando hayas trabajado al menos 3 temas.' : undefined,
      onSelect: () => props.onStartSession('mixta'),
    },
    {
      id: 'vocabulario',
      title: 'Practicar vocabulario',
      description: `${sessionSizes.vocabulario} ejercicios con las palabras de las lecciones.`,
      disabledReason: sessionSizes.vocabulario === 0 ? 'No hay ejercicios de vocabulario.' : undefined,
      onSelect: () => props.onStartSession('vocabulario'),
    },
    {
      id: 'comprension',
      title: 'Practicar comprensión',
      description: '',
      disabledReason: 'Todavía no hay textos ni audios: llegará en una fase posterior.',
      onSelect: () => undefined,
    },
    {
      id: 'nivel',
      title: 'Evaluación de nivel',
      description: 'Diagnóstico adaptativo en 4 bloques cortos.',
      onSelect: () => props.onOpenDiagnostic(),
    },
  ]

  return (
    <div className="stack">
      <section className="hero">
        <p className="eyebrow" lang="ru">
          Привет!
        </p>
        <h1>Diez minutos de ruso, paso a paso</h1>
        <p className="lead">
          Lecciones cortas con explicaciones claras en español. Todos los ejercicios se responden
          tocando opciones, sin teclado cirílico ni micrófono.
        </p>
      </section>

      {active && activeLesson && (
        <section className="card card--accent">
          <p className="eyebrow">Lección a medias</p>
          <h2>{activeLesson.title}</h2>
          <p className="muted">
            {active.step === 'intro'
              ? 'Estabas leyendo la explicación inicial.'
              : `Vas por la pregunta ${active.step + 1} de ${activeLesson.questions.length}.`}
          </p>
          <button className="btn btn--primary" onClick={() => props.onOpenLesson(activeLesson.id)}>
            Continuar donde lo dejé
          </button>
        </section>
      )}

      <PlanCard
        plan={plan}
        nextReview={nextReview}
        onStartPractice={props.onStartPlan}
        onOpenLesson={props.onOpenLesson}
        onOpenDiagnostic={(blockId) => props.onOpenDiagnostic(blockId)}
        onMixed={() => props.onStartSession('mixta')}
      />

      <SessionChooser options={options} />

      {weak.length > 0 && (
        <section className="card">
          <h2>Mis puntos débiles</h2>
          <ul className="weak-list">
            {weak.map((point) => (
              <WeakPointCard
                key={point.mastery.skill}
                point={point}
                compact
                onPractice={() => props.onPractice(point.mastery.skill)}
              />
            ))}
          </ul>
          <button className="btn btn--ghost btn--small" onClick={props.onOpenProgress}>
            Ver todos en «Progreso»
          </button>
        </section>
      )}

      <section className="card">
        <h2>Tu actividad</h2>
        {data.completedSessions.length === 0 ? (
          <p className="muted">Todavía no has terminado ninguna sesión.</p>
        ) : (
          <dl className="stats">
            <div>
              <dt>Sesiones terminadas</dt>
              <dd>{data.completedSessions.length}</dd>
            </div>
            <div>
              <dt>Conocimientos trabajados</dt>
              <dd>
                {studied}/{all.length}
              </dd>
            </div>
            <div className="stat--reward">
              <dt>★ Dominados</dt>
              <dd>{mastered}</dd>
            </div>
          </dl>
        )}
        <p className="note">
          «Dominado» exige aciertos variados y mantenidos, no solo terminar lecciones. Consulta el
          detalle en «Progreso».
        </p>
      </section>
    </div>
  )
}
