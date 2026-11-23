/** Exportar e importar el progreso como archivo JSON. */
import { parseProgress, type ProgressData } from './storage'

const APP_ID = 'app-ruso'

interface BackupFile {
  app: typeof APP_ID
  exportedAt: string
  data: ProgressData
}

export function serializeBackup(data: ProgressData, now = new Date()): string {
  const backup: BackupFile = { app: APP_ID, exportedAt: now.toISOString(), data }
  return JSON.stringify(backup, null, 2)
}

export function backupFileName(now = new Date()): string {
  return `app-ruso-progreso-${now.toISOString().slice(0, 10)}.json`
}

/** Lee el contenido de un archivo de copia. Lanza un Error con un mensaje en español si no es válido. */
export function parseBackup(text: string): ProgressData {
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error('El archivo no es un JSON válido.')
  }
  if (typeof json !== 'object' || json === null || (json as { app?: unknown }).app !== APP_ID) {
    throw new Error('El archivo no parece una copia de esta aplicación.')
  }
  const data = parseProgress((json as { data?: unknown }).data)
  if (!data) {
    throw new Error('La copia está incompleta o es de una versión que no se reconoce.')
  }
  return data
}

/** Descarga la copia en el navegador. */
export function downloadBackup(data: ProgressData): void {
  const blob = new Blob([serializeBackup(data)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = backupFileName()
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
