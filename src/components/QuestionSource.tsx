import { useState } from 'react'
import { ORIGIN_INFO, questionOrigin } from '../content/origin'
import type { Question } from '../content/types'
import { useContentReports } from '../lib/contentReports'
import { REPORT_REASONS, type ReportReason } from '../lib/storage'

/**
 * Origen del ejercicio y botón para avisar de un problema. Un ejercicio con aviso
 * deja de proponerse y sus respuestas no cuentan para el dominio (se puede deshacer).
 */
export function QuestionSource({ question }: { question: Question }) {
  const { reports, report, undo } = useContentReports()
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState<ReportReason | null>(null)
  const origin = ORIGIN_INFO[questionOrigin(question)]
  const current = reports[question.id]
  const groupName = `reason-${question.id}`

  return (
    <div className="source">
      <p className="source__origin small">
        <span className="tag">{origin.label}</span> <span className="muted">{origin.detail}</span>
      </p>

      {current ? (
        <div className="source__reported" role="status">
          <p className="small">
            <strong>Has avisado de un problema:</strong> {REPORT_REASONS[current.reason].toLowerCase()}. Este
            ejercicio ya no se propone en prácticas ni repasos y tus respuestas a él no cuentan para el
            dominio.
          </p>
          <button type="button" className="btn btn--ghost btn--small" onClick={() => undo(question.id)}>
            Deshacer el aviso
          </button>
        </div>
      ) : open ? (
        <fieldset className="source__form">
          <legend className="small">¿Qué problema ves?</legend>
          {(Object.keys(REPORT_REASONS) as ReportReason[]).map((id) => (
            <label key={id} className="source__reason">
              <input type="radio" name={groupName} checked={reason === id} onChange={() => setReason(id)} />
              <span>{REPORT_REASONS[id]}</span>
            </label>
          ))}
          <div className="source__actions">
            <button
              type="button"
              className="btn btn--primary btn--small"
              disabled={!reason}
              onClick={() => {
                if (reason) report(question.id, reason)
                setOpen(false)
              }}
            >
              Guardar aviso
            </button>
            <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(false)}>
              Cancelar
            </button>
          </div>
          <p className="muted small">
            El aviso se guarda solo en tu navegador (y en tus copias). No se envía a nadie.
          </p>
        </fieldset>
      ) : (
        <button type="button" className="btn btn--ghost btn--small" onClick={() => setOpen(true)}>
          Avisar de un problema con este ejercicio
        </button>
      )}
    </div>
  )
}

/** Aviso breve en el enunciado de un ejercicio ya marcado como dudoso. */
export function ReportedNote({ question }: { question: Question }) {
  const { reports } = useContentReports()
  if (!reports[question.id]) return null
  return (
    <p className="reported-note small">
      Marcaste este ejercicio como dudoso: tu respuesta no contará para el dominio.
    </p>
  )
}
