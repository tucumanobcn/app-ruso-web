import { useState } from 'react'
import { VideoList } from '../components/VideoList'
import { SKILLS } from '../content/glossary'
import { LESSONS } from '../content/lessons'
import { CHANNELS, channelSearchUrl, VIDEOS, videosForSkills, type ChannelId, type VideoResource } from '../content/resources'
import { REFERENCE_TOOLS, TOOLS_VERIFIED_ON } from '../content/tools'
import { weakPoints, type MasteryMap } from '../engine/insights'
import { useResourceViews } from '../lib/resourceViews'

interface ResourcesProps {
  mastery: MasteryMap
  onOpenCredits: () => void
}

type LevelFilter = 'todos' | 'A1' | 'A2' | 'B1'

/** Un vídeo «A1–A2» sirve para quien busca A1 y para quien busca A2. */
function matchesLevel(video: VideoResource, level: LevelFilter): boolean {
  return level === 'todos' || video.level.split('–').includes(level)
}

/** Búsquedas en los canales sobre temas que aún no tienen vídeos verificados. Sin revisar. */
const SUGGESTED_SEARCHES: { topic: string; queries: Partial<Record<ChannelId, string>> }[] = [
  {
    topic: 'El imperativo (próxima lección)',
    queries: { amazing: 'imperative', max: 'imperative', orussk: 'повелительное наклонение' },
  },
  {
    topic: 'Verbos de movimiento con prefijos (próxima lección)',
    queries: { amazing: 'prefixes verbs of motion', max: 'verbs of motion prefixes', orussk: 'глаголы движения с приставками' },
  },
  {
    topic: 'Adjetivos: concordancia y declinación (sin contenido en la app)',
    queries: { amazing: 'adjectives', max: 'adjectives', orussk: 'прилагательные' },
  },
  {
    topic: 'Comprensión auditiva (sin contenido en la app)',
    queries: { amazing: 'listening', max: 'listening', orussk: 'аудирование' },
  },
]

export function Resources({ mastery, onOpenCredits }: ResourcesProps) {
  const { viewed } = useResourceViews()
  const [lesson, setLesson] = useState('todas')
  const [channel, setChannel] = useState<ChannelId | 'todos'>('todos')
  const [level, setLevel] = useState<LevelFilter>('todos')
  const [unseenOnly, setUnseenOnly] = useState(false)
  const [word, setWord] = useState('')

  const weak = weakPoints(mastery).slice(0, 3)
  const recommended = videosForSkills(
    weak.map((w) => w.mastery.skill),
    4,
  )

  const filtered = VIDEOS.filter(
    (v) =>
      (lesson === 'todas' || v.lessons.includes(lesson)) &&
      (channel === 'todos' || v.channel === channel) &&
      matchesLevel(v, level) &&
      (!unseenOnly || !viewed[v.id]),
  )
  // Agrupados por lección, en el orden del itinerario; cada vídeo una sola vez.
  const lessonsWithVideos = LESSONS.filter((l) => VIDEOS.some((v) => v.lessons.includes(l.id)))
  const groups = lessonsWithVideos
    .map((l) => ({ lesson: l, videos: filtered.filter((v) => (lesson === 'todas' ? v.lessons[0] : lesson) === l.id) }))
    .filter((g) => g.videos.length > 0)
  const seenCount = VIDEOS.filter((v) => viewed[v.id]).length
  const cleanWord = word.trim()

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Recursos</h1>
        <p className="muted">
          {VIDEOS.length} vídeos de YouTube comprobados uno a uno y herramientas de consulta. Has abierto{' '}
          {seenCount} de {VIDEOS.length}.
        </p>
      </header>

      <section className="card" aria-labelledby="rec-title">
        <p className="eyebrow">Para ti</p>
        <h2 id="rec-title">Recomendados según tus puntos débiles</h2>
        {recommended.length === 0 ? (
          <p className="muted">
            {weak.length === 0
              ? 'Cuando tengas puntos débiles, aquí aparecerán los vídeos que los explican.'
              : 'Todavía no hay vídeos verificados para tus puntos débiles actuales.'}
          </p>
        ) : (
          <>
            <p className="muted small">
              Para: {weak.map((w) => SKILLS[w.mastery.skill].label.toLowerCase()).join(', ')}.
            </p>
            <VideoList videos={recommended} />
          </>
        )}
      </section>

      <section className="card" aria-labelledby="library-title">
        <h2 id="library-title">Biblioteca de vídeos</h2>
        <div className="filters">
          <label className="filter">
            <span>Tema</span>
            <select value={lesson} onChange={(e) => setLesson(e.target.value)}>
              <option value="todas">Todos los temas</option>
              {lessonsWithVideos.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title}
                </option>
              ))}
            </select>
          </label>
          <label className="filter">
            <span>Canal</span>
            <select value={channel} onChange={(e) => setChannel(e.target.value as ChannelId | 'todos')}>
              <option value="todos">Todos los canales</option>
              {(Object.keys(CHANNELS) as ChannelId[]).map((id) => (
                <option key={id} value={id}>
                  {CHANNELS[id].name} (en {CHANNELS[id].language})
                </option>
              ))}
            </select>
          </label>
          <label className="filter">
            <span>Nivel</span>
            <select value={level} onChange={(e) => setLevel(e.target.value as LevelFilter)}>
              <option value="todos">Todos</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
          </label>
          <label className="filter filter--check">
            <input type="checkbox" checked={unseenOnly} onChange={(e) => setUnseenOnly(e.target.checked)} />
            <span>Solo los que no he abierto</span>
          </label>
        </div>
        <p className="muted small" aria-live="polite">
          {filtered.length === 1 ? '1 vídeo' : `${filtered.length} vídeos`}
        </p>
        {groups.length === 0 ? (
          <p className="muted">Ningún vídeo coincide con estos filtros.</p>
        ) : (
          groups.map((g) => (
            // Plegados para que la lista no sea interminable en el móvil; abiertos si hay pocos grupos.
            <details key={`${g.lesson.id}-${groups.length <= 2}`} className="resource-group" open={groups.length <= 2}>
              <summary className="resource-group__title">
                {g.lesson.title}
                <span className="resource-group__count"> {g.videos.length === 1 ? '1 vídeo' : `${g.videos.length} vídeos`}</span>
              </summary>
              <VideoList videos={g.videos} compact />
            </details>
          ))
        )}
        <p className="source-note">
          Título, canal y duración comprobados en YouTube. Los vídeos se abren en YouTube; la app solo
          recuerda cuáles has abierto, en este navegador.
        </p>
      </section>

      <section className="card" aria-labelledby="tools-title">
        <h2 id="tools-title">Herramientas de consulta</h2>
        <label className="filter lookup">
          <span>Buscar una palabra rusa</span>
          <input
            type="search"
            lang="ru"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Por ejemplo: дом"
            autoComplete="off"
          />
        </label>
        <ul className="tool-list">
          {REFERENCE_TOOLS.map((tool) => (
            <li key={tool.id} className="tool-card">
              <div className="tool-card__head">
                <a href={tool.url} target="_blank" rel="noreferrer" className="tool-card__name">
                  {tool.name}
                </a>
                <span className="tag tag--verified">✓ Verificado</span>
              </div>
              <p className="small">{tool.use}</p>
              <p className="muted small">
                En {tool.language}
                {tool.lookup && cleanWord && (
                  <>
                    {' · '}
                    <a href={tool.lookup(cleanWord)} target="_blank" rel="noreferrer" lang="ru">
                      Ver «{cleanWord}»
                    </a>
                  </>
                )}
              </p>
            </li>
          ))}
        </ul>
        <p className="source-note">
          Direcciones comprobadas el {new Date(TOOLS_VERIFIED_ON).toLocaleDateString('es-ES')}. La
          palabra que escribas solo se envía al sitio cuyo enlace abras.
        </p>
      </section>

      <section className="card card--muted" aria-labelledby="search-title">
        <h2 id="search-title">Búsquedas sugeridas</h2>
        <p className="muted small">
          <strong>Sin verificar:</strong> son búsquedas dentro de cada canal sobre temas que aún no tienen
          vídeos comprobados. Nadie ha revisado los resultados.
        </p>
        <ul className="plain-list">
          {SUGGESTED_SEARCHES.map((s) => (
            <li key={s.topic}>
              <span>{s.topic}: </span>
              {(Object.entries(s.queries) as [ChannelId, string][]).map(([id, query], index) => (
                <span key={id}>
                  {index > 0 && ' · '}
                  <a href={channelSearchUrl(id, query)} target="_blank" rel="noreferrer">
                    {CHANNELS[id].name}
                  </a>
                </span>
              ))}
            </li>
          ))}
        </ul>
        <p className="note">
          La app no está conectada a la API de YouTube: no busca ni actualiza vídeos sola. Hacerlo exigiría
          un servidor propio que guarde la clave (nunca en el navegador); queda como mejora opcional.
        </p>
      </section>

      <button className="btn btn--secondary" onClick={onOpenCredits}>
        Fuentes y licencias
      </button>
    </div>
  )
}
