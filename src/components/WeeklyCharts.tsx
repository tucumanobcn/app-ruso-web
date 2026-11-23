import { useState } from 'react'
import type { WeekStats } from '../engine/stats'

/**
 * Evolución semanal: dos gráficas de una sola serie (nunca doble eje).
 * Columnas de minutos (violeta) y línea de % de aciertos (verde de éxito).
 * Cada una tiene tooltip al pasar el ratón o con el teclado, y hay tabla con los datos.
 */

const W = 320
const H = 150
const PAD = { top: 16, right: 12, bottom: 24, left: 32 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

const sessionsLabel = (n: number) => `${n} ${n === 1 ? 'sesión' : 'sesiones'}`

const fmtWeek = (t: number) => new Date(t).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

/** Marcas «limpias» del eje: 0 y múltiplos redondos hasta cubrir el máximo. */
function niceTicks(max: number): number[] {
  if (max <= 0) return [0, 10]
  const steps = [5, 10, 15, 20, 30, 50, 60, 100, 120, 200]
  const step = steps.find((s) => max / s <= 3) ?? Math.ceil(max / 3 / 100) * 100
  return Array.from({ length: Math.ceil(max / step) + 1 }, (_, i) => i * step)
}

interface TooltipState {
  index: number
}

function Tooltip({ x, lines }: { x: number; lines: string[] }) {
  const left = `${Math.min(80, Math.max(20, (x / W) * 100))}%`
  return (
    <div className="chart-tooltip" style={{ left }} role="status">
      {lines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

function MinutesChart({ weeks }: { weeks: WeekStats[] }) {
  const [hover, setHover] = useState<TooltipState | null>(null)
  const ticks = niceTicks(Math.max(...weeks.map((w) => w.minutes)))
  const top = ticks[ticks.length - 1]
  const band = PLOT_W / weeks.length
  const barW = Math.min(24, band - 6)
  const y = (v: number) => PAD.top + PLOT_H - (v / top) * PLOT_H
  const last = weeks.length - 1

  return (
    <figure className="chart">
      <figcaption className="chart__title">Minutos de estudio por semana</figcaption>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Minutos de estudio en cada una de las últimas 8 semanas; los datos están en la tabla">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="chart__grid" />
              <text x={PAD.left - 6} y={y(t) + 4} className="chart__axis" textAnchor="end">
                {t}
              </text>
            </g>
          ))}
          {weeks.map((w, i) => {
            const cx = PAD.left + band * i + band / 2
            const h = (w.minutes / top) * PLOT_H
            const x0 = cx - barW / 2
            const yTop = PAD.top + PLOT_H - h
            const r = Math.min(4, h)
            // Extremo de datos redondeado (4px), base recta.
            const d = h > 0
              ? `M${x0},${PAD.top + PLOT_H} V${yTop + r} Q${x0},${yTop} ${x0 + r},${yTop} H${x0 + barW - r} Q${x0 + barW},${yTop} ${x0 + barW},${yTop + r} V${PAD.top + PLOT_H} Z`
              : ''
            return (
              <g key={w.start}>
                {h > 0 && <path d={d} className="chart__bar" opacity={hover && hover.index !== i ? 0.45 : 1} />}
                {i === last && w.minutes > 0 && (
                  <text x={cx} y={yTop - 5} textAnchor="middle" className="chart__value">
                    {w.minutes}
                  </text>
                )}
                {(i % 2 === last % 2) && (
                  <text x={cx} y={H - 6} textAnchor="middle" className="chart__axis">
                    {fmtWeek(w.start)}
                  </text>
                )}
                <rect
                  x={PAD.left + band * i}
                  y={PAD.top}
                  width={band}
                  height={PLOT_H}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`Semana del ${fmtWeek(w.start)}: ${w.minutes} minutos, ${sessionsLabel(w.sessions)}`}
                  onMouseEnter={() => setHover({ index: i })}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover({ index: i })}
                  onBlur={() => setHover(null)}
                />
              </g>
            )
          })}
          <line x1={PAD.left} x2={W - PAD.right} y1={PAD.top + PLOT_H} y2={PAD.top + PLOT_H} className="chart__baseline" />
        </svg>
        {hover && (
          <Tooltip
            x={PAD.left + band * hover.index + band / 2}
            lines={[
              `Semana del ${fmtWeek(weeks[hover.index].start)}`,
              `${weeks[hover.index].minutes} min · ${sessionsLabel(weeks[hover.index].sessions)}`,
            ]}
          />
        )}
      </div>
    </figure>
  )
}

function AccuracyChart({ weeks }: { weeks: WeekStats[] }) {
  const [hover, setHover] = useState<TooltipState | null>(null)
  const band = PLOT_W / weeks.length
  const x = (i: number) => PAD.left + band * i + band / 2
  const y = (v: number) => PAD.top + PLOT_H - v * PLOT_H
  const points = weeks.map((w, i) => (w.accuracy === null ? null : { i, x: x(i), y: y(w.accuracy) }))
  // Tramos continuos: una semana sin respuestas corta la línea (no se inventa el dato).
  const segments: { x: number; y: number }[][] = []
  points.forEach((p) => {
    if (!p) segments.push([])
    else if (segments.length === 0) segments.push([p])
    else segments[segments.length - 1].push(p)
  })
  const lastPoint = [...points].reverse().find((p) => p !== null)

  return (
    <figure className="chart">
      <figcaption className="chart__title">Porcentaje de aciertos por semana</figcaption>
      <div className="chart__plot">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Porcentaje de aciertos en cada una de las últimas 8 semanas; los datos están en la tabla">
          {[0, 0.5, 1].map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="chart__grid" />
              <text x={PAD.left - 6} y={y(t) + 4} className="chart__axis" textAnchor="end">
                {t * 100} %
              </text>
            </g>
          ))}
          {segments
            .filter((s) => s.length > 1)
            .map((s, k) => (
              <polyline key={k} points={s.map((p) => `${p.x},${p.y}`).join(' ')} className="chart__line" />
            ))}
          {points.map(
            (p) =>
              p && (
                <circle key={p.i} cx={p.x} cy={p.y} r={hover?.index === p.i ? 6 : 4} className="chart__dot" />
              ),
          )}
          {lastPoint && (
            <text x={lastPoint.x} y={lastPoint.y - 10} textAnchor="middle" className="chart__value">
              {Math.round((weeks[lastPoint.i].accuracy ?? 0) * 100)} %
            </text>
          )}
          {weeks.map((w, i) => (
            <g key={w.start}>
              {i % 2 === (weeks.length - 1) % 2 && (
                <text x={x(i)} y={H - 6} textAnchor="middle" className="chart__axis">
                  {fmtWeek(w.start)}
                </text>
              )}
              <rect
                x={PAD.left + band * i}
                y={PAD.top}
                width={band}
                height={PLOT_H}
                fill="transparent"
                tabIndex={0}
                aria-label={`Semana del ${fmtWeek(w.start)}: ${w.accuracy === null ? 'sin respuestas' : `${Math.round(w.accuracy * 100)} % de aciertos en ${w.answers} respuestas`}`}
                onMouseEnter={() => setHover({ index: i })}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover({ index: i })}
                onBlur={() => setHover(null)}
              />
            </g>
          ))}
        </svg>
        {hover && (
          <Tooltip
            x={x(hover.index)}
            lines={[
              `Semana del ${fmtWeek(weeks[hover.index].start)}`,
              weeks[hover.index].accuracy === null
                ? 'Sin respuestas'
                : `${Math.round((weeks[hover.index].accuracy ?? 0) * 100)} % de aciertos · ${weeks[hover.index].answers} respuestas`,
            ]}
          />
        )}
      </div>
    </figure>
  )
}

export function WeeklyCharts({ weeks }: { weeks: WeekStats[] }) {
  const empty = weeks.every((w) => w.answers === 0)
  return (
    <section className="card" aria-labelledby="evolution-title" id="evolucion">
      <h2 id="evolution-title">Evolución de las últimas 8 semanas</h2>
      {empty ? (
        <p className="muted">Aún no hay respuestas en las últimas semanas.</p>
      ) : (
        <>
          <div className="charts">
            <MinutesChart weeks={weeks} />
            <AccuracyChart weeks={weeks} />
          </div>
          <details className="chart-table">
            <summary>Ver los datos en una tabla</summary>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Semana</th>
                    <th scope="col">Minutos</th>
                    <th scope="col">Sesiones</th>
                    <th scope="col">Respuestas</th>
                    <th scope="col">Aciertos</th>
                  </tr>
                </thead>
                <tbody>
                  {weeks.map((w) => (
                    <tr key={w.start}>
                      <th scope="row">{fmtWeek(w.start)}</th>
                      <td>{w.minutes}</td>
                      <td>{w.sessions}</td>
                      <td>{w.answers}</td>
                      <td>{w.accuracy === null ? '—' : `${Math.round(w.accuracy * 100)} %`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
          <p className="note">
            Los minutos se estiman a partir de tus respuestas (el tiempo entre una y otra, como máximo
            3 minutos cada vez). Un porcentaje de aciertos alto no equivale a dominio: el dominio exige
            aciertos variados y mantenidos.
          </p>
        </>
      )}
    </section>
  )
}
