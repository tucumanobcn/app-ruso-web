import { createContext, useContext } from 'react'
import type { ContentReport, ReportReason } from './storage'

export interface ContentReports {
  /** id de pregunta → aviso del estudiante. */
  reports: Record<string, ContentReport>
  report: (questionId: string, reason: ReportReason) => void
  undo: (questionId: string) => void
}

/** Avisos sobre ejercicios dudosos, compartidos por toda la interfaz. */
export const ContentReportsContext = createContext<ContentReports>({
  reports: {},
  report: () => {},
  undo: () => {},
})

export function useContentReports(): ContentReports {
  return useContext(ContentReportsContext)
}

/** Respuestas que cuentan para el dominio: se quitan las de ejercicios marcados como dudosos. */
export function withoutReported<T extends { questionId: string }>(log: T[], reports: Record<string, unknown>): T[] {
  return Object.keys(reports).length === 0 ? log : log.filter((r) => !(r.questionId in reports))
}
