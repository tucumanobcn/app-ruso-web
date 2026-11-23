import { ALTS } from './alts'
import { Es, Frame, Ru } from './parts'

function loaf(cx: number) {
  return `M${cx - 40} 108 C${cx - 40} 70 ${cx + 40} 70 ${cx + 40} 108 Z`
}

function Basket({ cx }: { cx: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={150} rx={48} ry={4.5} fill="var(--surface-2)" stroke="none" />
      <path
        d={`M${cx - 52} 106 H${cx + 52} L${cx + 42} 140 Q${cx + 40} 146 ${cx + 34} 146 H${cx - 34} Q${cx - 40} 146 ${cx - 42} 140 Z`}
        fill="var(--coral-soft)"
        stroke="var(--navy-ink)"
      />
      <path
        d={`M${cx - 48} 120 H${cx + 48} M${cx - 44} 133 H${cx + 44}`}
        stroke="var(--coral)"
        strokeWidth={2}
      />
      <rect x={cx - 56} y={100} width={112} height={11} rx={5.5} fill="var(--coral)" stroke="var(--navy-ink)" />
    </g>
  )
}

/** Есть хлеб (nominativo) / Нет хлеба (genitivo). */
export function GenNet() {
  return (
    <Frame label={ALTS['gen-net']} minY={56} height={148}>
      <path d="M160 70 V190" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />

      {/* Izquierda: cesta con pan */}
      <path d={loaf(80)} fill="var(--yellow)" stroke="var(--navy-ink)" />
      <path d="M60 96 l8 -9 M76 93 l8 -9 M92 96 l8 -9" stroke="var(--navy-ink)" strokeWidth={2} />
      <Basket cx={80} />

      {/* Derecha: cesta vacía, solo el contorno de donde estaba el pan */}
      <path d={loaf(240)} stroke="var(--muted)" strokeWidth={2} strokeDasharray="5 6" />
      <Basket cx={240} />

      <Ru x={80} y={176}>Есть хлеб.</Ru>
      <Es x={80} y={195}>nominativo</Es>
      <Ru x={240} y={176}>Нет хле́ба.</Ru>
      <Es x={240} y={195}>genitivo</Es>
    </Frame>
  )
}
