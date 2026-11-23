import { CompetencyProfile } from '../components/CompetencyProfile'
import { ProgressBar } from '../components/ProgressBar'
import { QuestionCard } from '../components/questions/QuestionCard'
import { SKILLS, type SkillId } from '../content/glossary'
import { QUESTION_BY_ID } from '../content/lessons'
import { DIAGNOSTIC_BLOCKS, PROBE_LABEL, type DiagnosticSummary, type ProbeStatus } from '../engine/diagnostic'
import type { CompetencyResult } from '../engine/profile'
import { shuffleableIds, type AnswerValue } from '../lib/answers'
import type { DiagnosticState } from '../lib/storage'

interface DiagnosticProps {
  state: DiagnosticState
  summary: DiagnosticSummary
  profile: CompetencyResult[]
  /** Bloque abierto en este momento, si lo hay. */
  blockId?: string
  onOpenBlock: (blockId: string, restart: boolean) => void
  onAnswer: (blockId: string, questionId: string, value: AnswerValue) => void
  onNext: (blockId: string) => void
  onClose: () => void
}

const STATUS_CLASS: Record<ProbeStatus, string> = {
  superado: 'probe--ok',
  dudoso: 'probe--mid',
  debil: 'probe--ko',
  omitido: 'probe--off',
  'sin-evaluar': 'probe--off',
}

function ProbeList({ results }: { results: DiagnosticSummary['byBlock'][string]['results'] }) {
  return (
    <ul className="probe-list">
      {(Object.entries(results) as [SkillId, { status: ProbeStatus; note?: string }][]).map(([skill, result]) => (
        <li key={skill}>
          <span>{SKILLS[skill].label}</span>
          <span className={`probe ${STATUS_CLASS[result.status]}`} title={result.note}>
            {PROBE_LABEL[result.status]}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function Diagnostic(props: DiagnosticProps) {
  const { state, summary, profile, blockId, onOpenBlock, onClose } = props
  const block = DIAGNOSTIC_BLOCKS.find((b) => b.id === blockId)
  if (block) return <BlockRunner {...props} blockId={block.id} />

  return (
    <div className="stack">
      <header className="page-header">
        <p className="eyebrow">Evaluación de nivel</p>
        <h1>Diagnóstico</h1>
        <p className="muted">
          Cuatro bloques cortos, de unos 5 minutos, que puedes hacer en días distintos. Cada pregunta
          depende de tus respuestas: si aciertas, pasa a otro tema; si fallas, te pregunta otra vez para
          confirmarlo, y no te evalúa lo que depende de algo que aún no dominas.
        </p>
      </header>

      <ul className="diag-blocks">
        {DIAGNOSTIC_BLOCKS.map((b, i) => {
          const s = summary.byBlock[b.id]
          const blockState = state.blocks[b.id]
          const status = s?.finished ? 'Terminado' : blockState ? `En curso · ${s?.asked ?? 0} respuestas` : 'Pendiente'
          return (
            <li key={b.id} className="card diag-block">
              <div className="diag-block__head">
                <span className="diag-block__num">{i + 1}</span>
                <div>
                  <h2>{b.title}</h2>
                  <p className="muted small">{b.description}</p>
                </div>
              </div>
              <p className={`diag-block__status${s?.finished ? ' diag-block__status--done' : ''}`}>{status}</p>
              {s?.finished && <ProbeList results={s.results} />}
              <div className="diag-block__actions">
                {!s?.finished && (
                  <button className="btn btn--primary" onClick={() => onOpenBlock(b.id, false)}>
                    {blockState ? 'Continuar' : 'Empezar'}
                  </button>
                )}
                {(s?.finished || blockState) && (
                  <button className="btn btn--ghost btn--small" onClick={() => onOpenBlock(b.id, true)}>
                    Repetir el bloque
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      <CompetencyProfile profile={profile} />

      <button className="btn btn--ghost" onClick={onClose}>
        Volver al inicio
      </button>
    </div>
  )
}

function BlockRunner({ state, summary, blockId, onAnswer, onNext, onClose, onOpenBlock }: DiagnosticProps & { blockId: string }) {
  const block = DIAGNOSTIC_BLOCKS.find((b) => b.id === blockId)!
  const blockState = state.blocks[blockId]
  const result = summary.byBlock[blockId]
  const currentId = blockState?.asked.at(-1)
  const question = currentId ? QUESTION_BY_ID.get(currentId) : undefined
  const answer = currentId ? blockState?.answers[currentId] : undefined
  const finished = Boolean(blockState?.finishedAt)

  if (!blockState) {
    return (
      <div className="stack">
        <p>Este bloque todavía no ha empezado.</p>
        <button className="btn btn--primary" onClick={() => onOpenBlock(blockId, false)}>
          Empezar
        </button>
      </div>
    )
  }

  if (finished || !question) {
    return (
      <div className="stack">
        <header className="page-header">
          <p className="eyebrow">Diagnóstico · bloque terminado</p>
          <h1>{block.title}</h1>
        </header>
        <section className="card">
          <h2>Resultado</h2>
          <ProbeList results={result.results} />
          <p className="note">
            «Dudoso» significa que acertaste una de dos; «omitido», que se apoya en algo que ha salido
            débil. Las lecciones y los repasos se adaptarán a esto.
          </p>
        </section>
        <div className="actions">
          <button className="btn btn--ghost" onClick={() => onClose()}>
            Volver
          </button>
        </div>
      </div>
    )
  }

  const answered = blockState.answers[question.id] !== undefined
  return (
    <div className="stack">
      <div className="lesson-top">
        <button className="btn btn--ghost btn--small" onClick={onClose}>
          Salir
        </button>
        <ProgressBar
          value={blockState.asked.length}
          max={block.maxQuestions}
          label={`Diagnóstico · pregunta ${blockState.asked.length} (máx. ${block.maxQuestions})`}
        />
      </div>
      <p className="eyebrow">{block.title}</p>
      <QuestionCard
        key={question.id}
        question={question}
        order={blockState.optionOrder[question.id] ?? shuffleableIds(question)}
        answer={answer}
        onAnswer={(value) => onAnswer(blockId, question.id, value)}
      />
      {answered && (
        <div className="actions actions--sticky">
          <span />
          <button className="btn btn--primary" onClick={() => onNext(blockId)}>
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
