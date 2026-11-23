import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { QUESTION_BY_ID } from '../content/lessons'
import { ORIGIN_INFO, questionOrigin } from '../content/origin'
import { downloadBackup, parseBackup } from '../lib/backup'
import { useContentReports } from '../lib/contentReports'
import {
  requestPersistentStorage,
  storageStatus,
  type StorageStatus,
  type StoreKind,
} from '../lib/persistence'
import { REPORT_REASONS, type ProgressData } from '../lib/storage'

interface DataSettingsProps {
  data: ProgressData
  storeKind: StoreKind
  now: number
  onImport: (data: ProgressData) => void
  onReset: () => void
  onExported: () => void
  onOpenCredits: () => void
}

type Status = { kind: 'ok' | 'error'; text: string } | null

const STORE_LABEL: Record<StoreKind, string> = {
  indexeddb: 'IndexedDB, la base de datos del navegador',
  localstorage: 'localStorage del navegador (IndexedDB no está disponible aquí)',
  memoria: 'Solo en memoria: se perderá al cerrar la página',
}

/** Días sin exportar a partir de los cuales se sugiere hacer una copia. */
const BACKUP_REMINDER_DAYS = 14

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} kB`
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1).replace('.', ',')} MB`
  return `${(bytes / 1024 ** 3).toFixed(1).replace('.', ',')} GB`
}

export function DataSettings({ data, storeKind, now, onImport, onReset, onExported, onOpenCredits }: DataSettingsProps) {
  const fileInput = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>(null)
  const [storage, setStorage] = useState<StorageStatus | null>(null)
  const [persistResult, setPersistResult] = useState<Status>(null)
  const { reports, undo } = useContentReports()
  const reportList = Object.entries(reports).sort((a, b) => b[1].reportedAt.localeCompare(a[1].reportedAt))

  useEffect(() => {
    let alive = true
    void storageStatus().then((s) => {
      if (alive) setStorage(s)
    })
    return () => {
      alive = false
    }
  }, [])

  const daysSinceExport =
    data.lastExportAt === null ? null : Math.floor((now - Date.parse(data.lastExportAt)) / 86_400_000)
  const suggestBackup =
    data.answerLog.length > 0 && (daysSinceExport === null || daysSinceExport >= BACKUP_REMINDER_DAYS)

  function handleExport() {
    downloadBackup(data)
    onExported()
    setStatus({ kind: 'ok', text: 'Copia descargada. Guárdala en un lugar seguro.' })
  }

  async function handlePersist() {
    const granted = await requestPersistentStorage()
    setStorage(await storageStatus())
    setPersistResult(
      granted
        ? { kind: 'ok', text: 'El navegador conservará tus datos aunque le falte espacio.' }
        : {
            kind: 'error',
            text: 'El navegador no lo ha concedido. Suele hacerlo con las webs que usas a menudo o que instalas; mientras tanto, exporta copias.',
          },
    )
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const imported = parseBackup(await file.text())
      const ok = window.confirm(
        `La copia contiene ${imported.completedSessions.length} lecciones terminadas y ${imported.answerLog.length} respuestas. Sustituirá todo tu progreso actual. ¿Continuar?`,
      )
      if (!ok) return
      onImport(imported)
      setStatus({ kind: 'ok', text: 'Progreso importado correctamente.' })
    } catch (error) {
      setStatus({
        kind: 'error',
        text: error instanceof Error ? error.message : 'No se pudo leer el archivo.',
      })
    }
  }

  function handleReset() {
    const ok = window.confirm(
      'Se borrará todo tu progreso de este navegador (lecciones, respuestas, avisos y sesión en curso). No se puede deshacer. Si quieres conservarlo, exporta antes una copia. ¿Borrar?',
    )
    if (!ok) return
    onReset()
    setStatus({ kind: 'ok', text: 'Progreso borrado.' })
  }

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Mis datos</h1>
        <p className="muted">
          Tu progreso se guarda solo en este navegador, sin servidores. Exporta una copia de vez en
          cuando para no perderlo o para llevarlo a otro dispositivo.
        </p>
      </header>

      {status && (
        <p className={`status status--${status.kind}`} role={status.kind === 'error' ? 'alert' : 'status'}>
          {status.text}
        </p>
      )}

      <section className="card">
        <h2>Lo que hay guardado</h2>
        <dl className="stats">
          <div>
            <dt>Lecciones terminadas</dt>
            <dd>{data.completedSessions.length}</dd>
          </div>
          <div>
            <dt>Respuestas</dt>
            <dd>{data.answerLog.length}</dd>
          </div>
          <div>
            <dt>Ejercicios con aviso</dt>
            <dd>{reportList.length}</dd>
          </div>
          <div>
            <dt>Desde</dt>
            <dd className="stats__date">{formatDate(data.createdAt)}</dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h2>Exportar</h2>
        <p>
          Descarga un archivo JSON con todo tu progreso: lecciones, respuestas, errores, avisos y
          preferencias.
        </p>
        <p className={suggestBackup ? 'backup-hint' : 'muted small'}>
          {data.lastExportAt === null
            ? 'Todavía no has exportado ninguna copia.'
            : `Última copia: ${formatDate(data.lastExportAt)}${
                daysSinceExport === 0
                  ? ' (hoy)'
                  : ` (hace ${daysSinceExport} ${daysSinceExport === 1 ? 'día' : 'días'})`
              }.`}
          {suggestBackup && ' Conviene hacer una ahora.'}
        </p>
        <button className="btn btn--primary" onClick={handleExport}>
          Descargar copia
        </button>
      </section>

      <section className="card">
        <h2>Importar</h2>
        <p>
          Recupera una copia exportada antes. Sustituye el progreso actual de este navegador; también
          admite copias de versiones anteriores de la aplicación.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="application/json,.json"
          className="visually-hidden"
          onChange={handleFile}
          aria-label="Archivo de copia"
        />
        <button className="btn btn--secondary" onClick={() => fileInput.current?.click()}>
          Elegir archivo…
        </button>
      </section>

      <section className="card" aria-labelledby="reports-title">
        <h2 id="reports-title">Ejercicios con aviso</h2>
        {reportList.length === 0 ? (
          <p className="muted">
            Si un ejercicio te parece dudoso, pulsa «Avisar de un problema» en su corrección. Deja de
            proponerse y tus respuestas a él no cuentan para el dominio.
          </p>
        ) : (
          <>
            <p className="muted small">
              No se proponen en prácticas ni repasos y sus respuestas no cuentan para el dominio. Van
              incluidos en la copia exportada, para poder revisarlos y corregirlos.
            </p>
            <ul className="report-list">
              {reportList.map(([id, report]) => {
                const question = QUESTION_BY_ID.get(id)
                return (
                  <li key={id} className="report-list__row">
                    <span lang={question?.prompt ? 'ru' : undefined} className="report-list__text">
                      {question ? (question.prompt ?? question.instruction) : `Ejercicio que ya no existe (${id})`}
                    </span>
                    <span className="muted small">
                      {REPORT_REASONS[report.reason]} · {formatDate(report.reportedAt)}
                      {question && ` · ${ORIGIN_INFO[questionOrigin(question)].label.toLowerCase()}`}
                    </span>
                    <button className="btn btn--ghost btn--small" onClick={() => undo(id)}>
                      Quitar el aviso
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>

      <section className="card" aria-labelledby="where-title">
        <h2 id="where-title">Dónde se guardan</h2>
        <dl className="storage-facts">
          <div>
            <dt>Almacén</dt>
            <dd>{STORE_LABEL[storeKind]}</dd>
          </div>
          <div>
            <dt>Protección frente a borrados</dt>
            <dd>
              {storage?.persisted === true
                ? 'Activada: el navegador no borrará tus datos por falta de espacio.'
                : storage?.persisted === false
                  ? 'No activada: si el dispositivo se queda sin espacio, el navegador podría borrarlos.'
                  : 'Este navegador no informa de ello.'}
            </dd>
          </div>
          {storage?.usage != null && (
            <div>
              <dt>Espacio usado</dt>
              <dd>
                {formatBytes(storage.usage)}
                {storage.quota != null && ` de ${formatBytes(storage.quota)} disponibles`}
              </dd>
            </div>
          )}
        </dl>
        {storage?.persisted === false && storeKind !== 'memoria' && (
          <button className="btn btn--secondary" onClick={() => void handlePersist()}>
            Pedir al navegador que conserve mis datos
          </button>
        )}
        {persistResult && (
          <p className={`status status--${persistResult.kind}`} role="status">
            {persistResult.text}
          </p>
        )}
        <ul className="plain-list small">
          <li>
            No se envían a ningún servidor; la app no usa cookies ni estadísticas.{' '}
            <button type="button" className="link-button" onClick={onOpenCredits}>
              Fuentes, licencias y privacidad
            </button>
          </li>
          <li>Se pierden si borras los datos del sitio o usas una ventana privada.</li>
          <li>No se sincronizan entre dispositivos: usa exportar e importar.</li>
          <li>
            Si abres la app en dos pestañas a la vez, la última que guarde sustituye a la otra: mejor
            usar una sola.
          </li>
        </ul>
      </section>

      <section className="card">
        <h2>Empezar de cero</h2>
        <button className="btn btn--danger" onClick={handleReset}>
          Borrar todo el progreso
        </button>
      </section>
    </div>
  )
}
