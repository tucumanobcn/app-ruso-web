/**
 * Dónde se guarda el progreso. Es el único módulo que toca el almacenamiento.
 *
 * - Principal: IndexedDB (base de datos del navegador): más capacidad que
 *   localStorage, no bloquea la página al guardar y el navegador puede marcarla
 *   como «persistente» para no borrarla cuando le falta espacio.
 * - Alternativa: localStorage, si IndexedDB no está disponible.
 * - Último recurso: memoria (nada se conserva al cerrar; la app lo avisa).
 *
 * Los datos de localStorage de versiones anteriores se migran solos a IndexedDB
 * la primera vez, y solo se borran de localStorage tras comprobar la copia.
 */
import { createEmptyProgress, parseProgress, type ProgressData } from './storage'

export type StoreKind = 'indexeddb' | 'localstorage' | 'memoria'

/** Almacén clave → valor asíncrono. `get` devuelve undefined si la clave no existe. */
export interface KeyValueStore {
  kind: StoreKind
  get(key: string): Promise<unknown>
  set(key: string, value: unknown): Promise<void>
  remove(key: string): Promise<void>
}

export const PROGRESS_KEY = 'progreso'
const LEGACY_V1_KEY = 'progreso:v1'
const UNREADABLE_KEY = 'progreso:copia-ilegible'

// ---------- Almacenes ----------

const DB_NAME = 'app-ruso'
const DB_VERSION = 1
const STORE = 'datos'

function promisify<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/** Abre la base de datos del navegador; null si no está disponible o falla. */
export async function openIndexedDbStore(): Promise<KeyValueStore | null> {
  if (typeof indexedDB === 'undefined') return null
  let db: IDBDatabase
  try {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE)
    }
    db = await promisify(request)
  } catch {
    return null
  }
  // Si otra pestaña con una versión más nueva necesita actualizar la base de datos, no se la bloquea.
  db.onversionchange = () => db.close()

  function run<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode)
      const request = action(tx.objectStore(STORE))
      // Se resuelve cuando la transacción se confirma, no antes: así «guardado» significa guardado.
      tx.oncomplete = () => resolve(request.result)
      tx.onerror = () => reject(tx.error)
      tx.onabort = () => reject(tx.error ?? new Error('Transacción cancelada'))
    })
  }

  return {
    kind: 'indexeddb',
    get: (key) => run('readonly', (s) => s.get(key)),
    set: async (key, value) => {
      await run('readwrite', (s) => s.put(value, key))
    },
    remove: async (key) => {
      await run('readwrite', (s) => s.delete(key))
    },
  }
}

/** localStorage con el prefijo «app-ruso:» (la clave «progreso» es «app-ruso:progreso»). */
export function createLocalStorageStore(): KeyValueStore | null {
  try {
    if (typeof localStorage === 'undefined') return null
    localStorage.getItem('app-ruso:prueba')
  } catch {
    return null
  }
  const full = (key: string) => `app-ruso:${key}`
  return {
    kind: 'localstorage',
    get: async (key) => {
      const raw = localStorage.getItem(full(key))
      if (raw === null) return undefined
      try {
        return JSON.parse(raw)
      } catch {
        return raw // ilegible: se devuelve tal cual para poder guardar una copia
      }
    },
    set: async (key, value) => {
      localStorage.setItem(full(key), JSON.stringify(value))
    },
    remove: async (key) => {
      localStorage.removeItem(full(key))
    },
  }
}

/** Almacén en memoria: para los tests y como último recurso. */
export function createMemoryStore(initial: Record<string, unknown> = {}, kind: StoreKind = 'memoria'): KeyValueStore {
  const values = new Map(Object.entries(structuredClone(initial)))
  return {
    kind,
    get: async (key) => (values.has(key) ? structuredClone(values.get(key)) : undefined),
    set: async (key, value) => {
      values.set(key, structuredClone(value))
    },
    remove: async (key) => {
      values.delete(key)
    },
  }
}

// ---------- Apertura y migración ----------

export interface OpenedProgress {
  data: ProgressData
  /** Almacén donde se guardarán los cambios. */
  store: KeyValueStore
  /** Se han pasado los datos de localStorage a IndexedDB. */
  migrated: boolean
  /** Había datos ilegibles: se guardó una copia aparte y se empezó de cero. */
  unreadable: boolean
}

async function readOrUndefined(store: KeyValueStore, key: string): Promise<unknown> {
  try {
    return await store.get(key)
  } catch {
    return undefined
  }
}

async function keepUnreadable(store: KeyValueStore, raw: unknown): Promise<void> {
  try {
    await store.set(UNREADABLE_KEY, raw)
  } catch {
    // Sin espacio o sin acceso: no hay nada más que hacer.
  }
}

/**
 * Carga el progreso del almacén principal; si está vacío, lo trae del almacén
 * anterior (localStorage) y, tras comprobar que se ha copiado bien, lo borra de allí.
 */
export async function openProgress(primary: KeyValueStore, legacy: KeyValueStore | null): Promise<OpenedProgress> {
  const result = (data: ProgressData, store: KeyValueStore, migrated = false, unreadable = false) => ({
    data,
    store,
    migrated,
    unreadable,
  })

  let current: unknown
  try {
    current = await primary.get(PROGRESS_KEY)
  } catch {
    // El almacén principal falla al leer: se sigue con el anterior si existe.
    if (legacy && legacy !== primary) return openProgress(legacy, null)
    return result(createEmptyProgress(), primary)
  }

  if (current !== undefined) {
    const parsed = parseProgress(current)
    if (parsed) return result(parsed, primary)
    await keepUnreadable(primary, current)
    return result(createEmptyProgress(), primary, false, true)
  }

  if (!legacy || legacy === primary) {
    // Sin almacén anterior distinto: solo queda la clave de la versión 1, en el propio almacén.
    const v1 = parseProgress(await readOrUndefined(primary, LEGACY_V1_KEY))
    return result(v1 ?? createEmptyProgress(), primary)
  }

  for (const key of [PROGRESS_KEY, LEGACY_V1_KEY]) {
    const raw = await readOrUndefined(legacy, key)
    if (raw === undefined) continue
    const parsed = parseProgress(raw)
    if (!parsed) {
      await keepUnreadable(legacy, raw)
      return result(createEmptyProgress(), primary, false, true)
    }
    try {
      await primary.set(PROGRESS_KEY, parsed)
      const check = parseProgress(await primary.get(PROGRESS_KEY))
      if (!check) throw new Error('La copia no coincide')
    } catch {
      // No se pudo copiar: se sigue usando el almacén anterior, sin borrar nada.
      return result(parsed, legacy)
    }
    await legacy.remove(PROGRESS_KEY).catch(() => {})
    await legacy.remove(LEGACY_V1_KEY).catch(() => {})
    return result(parsed, primary, true)
  }
  return result(createEmptyProgress(), primary)
}

/** Abre el mejor almacén disponible en este navegador y carga el progreso. */
export async function openBrowserProgress(): Promise<OpenedProgress> {
  const local = createLocalStorageStore()
  const primary = (await openIndexedDbStore()) ?? local ?? createMemoryStore()
  return openProgress(primary, local)
}

// ---------- Escritura ----------

export interface ProgressWriter {
  save(data: ProgressData): void
}

/**
 * Guarda en orden y sin solaparse: si llegan varios cambios mientras se escribe,
 * solo se escribe el último. `onResult` recibe si la última escritura fue bien.
 */
export function createWriter(store: KeyValueStore, onResult: (ok: boolean) => void): ProgressWriter {
  let pending: ProgressData | null = null
  let busy = false

  async function flush() {
    busy = true
    while (pending) {
      const data = pending
      pending = null
      let ok = true
      try {
        await store.set(PROGRESS_KEY, data)
      } catch {
        ok = false
      }
      if (!pending) onResult(ok)
    }
    busy = false
  }

  return {
    save(data) {
      pending = data
      if (!busy) void flush()
    },
  }
}

// ---------- Estado del almacenamiento del navegador ----------

export interface StorageStatus {
  /** El navegador se compromete a no borrar los datos por falta de espacio. null = no se sabe. */
  persisted: boolean | null
  /** Bytes usados por la app y cuota disponible (estimación del navegador). */
  usage: number | null
  quota: number | null
}

export async function storageStatus(): Promise<StorageStatus> {
  const storage = typeof navigator !== 'undefined' ? navigator.storage : undefined
  const [persisted, estimate] = await Promise.all([
    storage?.persisted ? storage.persisted().catch(() => null) : Promise.resolve(null),
    storage?.estimate ? storage.estimate().catch(() => null) : Promise.resolve(null),
  ])
  return { persisted, usage: estimate?.usage ?? null, quota: estimate?.quota ?? null }
}

/** Pide al navegador que no borre los datos de la app. Devuelve si lo ha concedido. */
export async function requestPersistentStorage(): Promise<boolean | null> {
  const storage = typeof navigator !== 'undefined' ? navigator.storage : undefined
  if (!storage?.persist) return null
  try {
    return await storage.persist()
  } catch {
    return null
  }
}
