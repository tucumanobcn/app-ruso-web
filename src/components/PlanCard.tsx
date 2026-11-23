import type { DailyPlan, PlanPart } from '../engine/planner'

interface PlanCardProps {
  plan: DailyPlan
  /** «Próximo repaso: …» cuando hoy no toca ninguno. */
  nextReview?: string
  onStartPractice: () => void
  onOpenLesson: (lessonId: string) => void
  onOpenDiagnostic: (blockId: string) => void
  onMixed: () => void
}

const KIND_LABEL: Record<PlanPart['kind'], string> = {
  diagnostico: 'Diagnóstico',
  repaso: 'Repaso',
  refuerzo: 'Refuerzo',
  leccion: 'Nuevo',
  mixta: 'Mixta',
}

function PartAction({ part, props, primary }: { part: PlanPart; props: PlanCardProps; primary: boolean }) {
  const cls = `btn ${primary ? 'btn--primary' : 'btn--secondary'} btn--small`
  if (part.kind === 'leccion' && part.lessonId) {
    return (
      <button className={cls} onClick={() => props.onOpenLesson(part.lessonId!)}>
        Empezar la lección
      </button>
    )
  }
  if (part.kind === 'diagnostico' && part.blockId) {
    return (
      <button className={cls} onClick={() => props.onOpenDiagnostic(part.blockId!)}>
        Empezar el bloque
      </button>
    )
  }
  if (part.kind === 'mixta') {
    return (
      <button className={cls} onClick={props.onMixed}>
        Empezar la sesión mixta
      </button>
    )
  }
  return null
}

/** «Tu sesión de hoy»: qué toca, cuánto dura y por qué. */
export function PlanCard(props: PlanCardProps) {
  const { plan, nextReview, onStartPractice } = props
  const practice = plan.today.filter((p) => p.kind === 'repaso' || p.kind === 'refuerzo')
  const others = plan.today.filter((p) => p.kind !== 'repaso' && p.kind !== 'refuerzo')
  if (plan.today.length === 0 && plan.later.length === 0) return null

  return (
    <section className="card plan-card" aria-labelledby="plan-title">
      <p className="eyebrow eyebrow--coral">Recomendado para hoy</p>
      <h2 id="plan-title">
        Tu sesión de hoy <span className="plan-card__time">≈ {plan.minutes} min</span>
      </h2>

      <ol className="plan-steps">
        {plan.today.map((part, i) => (
          <li key={i} className={`plan-step plan-step--${part.kind}`}>
            <div className="plan-step__head">
              <span className="plan-step__kind">{KIND_LABEL[part.kind]}</span>
              <span className="muted small">{part.minutes} min</span>
            </div>
            <strong className="plan-step__title">{part.title}</strong>
            <p className="plan-step__reason">{part.reason}</p>
            {part.kind !== 'repaso' && part.kind !== 'refuerzo' && (
              <PartAction part={part} props={props} primary={i === 0} />
            )}
          </li>
        ))}
      </ol>

      {practice.length > 0 && (
        <button
          className={`btn ${others.length === 0 || plan.today[0] === practice[0] ? 'btn--primary' : 'btn--secondary'}`}
          onClick={onStartPractice}
        >
          Empezar {practice.map((p) => p.kind).join(' y ')} ({plan.practiceIds.length} ejercicios)
        </button>
      )}

      {!practice.some((p) => p.kind === 'repaso') && nextReview && <p className="note">{nextReview}</p>}

      {plan.later.length > 0 && (
        <div className="plan-later">
          <h3>Si tienes más tiempo (o para mañana)</h3>
          <ul>
            {plan.later.map((part, i) => (
              <li key={i}>
                <div>
                  <strong>{part.title}</strong> <span className="muted small">· {part.minutes} min</span>
                  <p className="muted small">{part.reason}</p>
                </div>
                <PartAction part={part} props={props} primary={false} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
