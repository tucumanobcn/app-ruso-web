import {
  CHANNELS,
  channelSearchUrl,
  RESOURCES_VERIFIED_ON,
  videoUrl,
  type ChannelId,
  type VideoResource,
} from '../content/resources'
import { useResourceViews } from '../lib/resourceViews'

interface VideoListProps {
  videos: VideoResource[]
  /** Consulta para sugerir búsquedas en los canales (resultados sin verificar). */
  searchQuery?: { query: string; channels: ChannelId[] }
  compact?: boolean
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}

/** Lista de vídeos verificados, con marca de «visto» y búsquedas sugeridas aparte. */
export function VideoList({ videos, searchQuery, compact }: VideoListProps) {
  const { viewed, markViewed } = useResourceViews()
  if (videos.length === 0 && !searchQuery) return null

  return (
    <div className="videos">
      <ul className="video-list">
        {videos.map((video) => {
          const channel = CHANNELS[video.channel]
          const seen = viewed[video.id]
          return (
            <li key={video.id} className="video-card">
              <a
                href={videoUrl(video)}
                target="_blank"
                rel="noreferrer"
                className="video-card__link"
                onClick={() => markViewed(video.id)}
              >
                <span className="video-card__play" aria-hidden="true">
                  ▶
                </span>
                <span className="video-card__body">
                  <span className="video-card__title">{video.title}</span>
                  <span className="video-card__meta">
                    {channel.name} · {video.duration} · en {channel.language} · {video.level}
                  </span>
                  {!compact && <span className="video-card__reason">{video.reason}</span>}
                </span>
              </a>
              <span className="video-card__tags">
                <span className="tag tag--verified">✓ Verificado</span>
                {seen && <span className="tag">Visto el {formatDate(seen)}</span>}
              </span>
            </li>
          )
        })}
      </ul>
      {!compact && videos.length > 0 && (
        <p className="source-note">
          Título, canal y duración comprobados en YouTube el{' '}
          {new Date(RESOURCES_VERIFIED_ON).toLocaleDateString('es-ES')}. Se abren en YouTube.
        </p>
      )}
      {searchQuery && (
        <p className="source-note">
          <strong>Buscar más (sugerencia sin verificar):</strong>{' '}
          {searchQuery.channels.map((id, index) => (
            <span key={id}>
              {index > 0 && ' · '}
              <a href={channelSearchUrl(id, searchQuery.query)} target="_blank" rel="noreferrer">
                {CHANNELS[id].name}
              </a>
            </span>
          ))}
        </p>
      )}
    </div>
  )
}
