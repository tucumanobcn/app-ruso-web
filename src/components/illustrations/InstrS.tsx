import { ALTS } from './alts'
import { Es, Frame, Ru } from './parts'

interface GlassProps {
  cx: number
  handle: 'left' | 'right'
}

/** Vaso de té en portavasos (подстаканник). */
function TeaGlass({ cx, handle }: GlassProps) {
  const s = handle === 'right' ? 1 : -1
  return (
    <g>
      <path
        d={`M${cx + 2} 54 q-5 -7 0 -14 q5 -7 0 -14 M${cx + 14} 54 q-5 -7 0 -14 q5 -7 0 -14`}
        stroke="var(--muted)"
        strokeOpacity={0.6}
      />
      <path
        d={`M${cx - 25.3} 78 L${cx - 22} 140 H${cx + 22} L${cx + 25.3} 78 Z`}
        fill="var(--yellow)"
        fillOpacity={0.7}
        stroke="none"
      />
      <path
        d={`M${cx - 25.3} 78 L${cx - 22} 140 H${cx + 22} L${cx + 25.3} 78 Z`}
        fill="var(--coral)"
        fillOpacity={0.3}
        stroke="none"
      />
      <path d={`M${cx - 26} 64 L${cx - 22} 140 H${cx + 22} L${cx + 26} 64`} stroke="var(--navy-ink)" />
      <path
        d={`M${cx + 27 * s} 114 C${cx + 46 * s} 114 ${cx + 46 * s} 138 ${cx + 24 * s} 136`}
        stroke="var(--navy-ink)"
        strokeWidth={3}
      />
      <path
        d={`M${cx - 28} 108 H${cx + 28} L${cx + 25} 140 Q${cx + 24} 146 ${cx + 18} 146 H${cx - 18} Q${cx - 24} 146 ${cx - 25} 140 Z`}
        fill="var(--violet)"
        stroke="var(--navy-ink)"
      />
      <path d={`M${cx} 117 l6 9 l-6 9 l-6 -9 Z`} fill="var(--violet-soft)" stroke="none" />
    </g>
  )
}

const SEGMENTS = [0, 60, 120, 180, 240, 300]

function LemonSlice({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill="var(--yellow)" stroke="var(--navy-ink)" />
      <circle cx={x} cy={y} r={9} fill="var(--yellow-soft)" stroke="none" />
      <path
        d={SEGMENTS.map((a) => {
          const r = (a * Math.PI) / 180
          return `M${x} ${y} L${(x + 8 * Math.cos(r)).toFixed(1)} ${(y + 8 * Math.sin(r)).toFixed(1)}`
        }).join(' ')}
        stroke="var(--yellow)"
        strokeWidth={1.8}
      />
    </g>
  )
}

function HoneyJar({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={104} width={40} height={42} rx={8} fill="var(--yellow)" stroke="var(--navy-ink)" />
      <rect x={x - 2} y={94} width={44} height={12} rx={4} fill="var(--coral)" stroke="var(--navy-ink)" />
      <rect x={x + 8} y={115} width={24} height={18} rx={3} fill="var(--yellow-soft)" stroke="none" />
      <path
        d={`M${x + 20} 118 l5 3 v6 l-5 3 l-5 -3 v-6 Z`}
        stroke="var(--yellow)"
        strokeWidth={2}
      />
    </g>
  )
}

/** чай с лимоном / чай с мёдом: с + instrumental. */
export function InstrS() {
  return (
    <Frame label={ALTS['instr-s']} minY={14} height={192}>
      <path d="M24 146 H296" stroke="var(--border)" />

      <TeaGlass cx={80} handle="right" />
      <LemonSlice x={62} y={68} />

      <TeaGlass cx={218} handle="left" />
      <HoneyJar x={258} />

      <Ru x={84} y={172}>чай с лимо́ном</Ru>
      <Ru x={236} y={172}>чай с мёдом</Ru>
      <Es x={160} y={198}>
        <tspan lang="ru" fontWeight={600} fill="var(--text)">
          с
        </tspan>{' '}
        + instrumental
      </Es>
    </Frame>
  )
}
