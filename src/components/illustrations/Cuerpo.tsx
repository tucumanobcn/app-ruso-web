import { ALTS } from './alts'
import { Frame, Ru } from './parts'

interface Leader {
  label: string
  side: 'left' | 'right'
  /** Altura de la etiqueta. */
  ly: number
  /** Punto señalado. */
  px: number
  py: number
  dot: boolean
}

const LEADERS: Leader[] = [
  { label: 'голова́', side: 'left', ly: 34, px: 146, py: 39, dot: true },
  { label: 'глаз', side: 'left', ly: 62, px: 145, py: 60, dot: false },
  { label: 'рука́', side: 'left', ly: 170, px: 119, py: 166, dot: true },
  { label: 'нога́', side: 'left', ly: 246, px: 138, py: 246, dot: true },
  { label: 'у́хо', side: 'right', ly: 60, px: 189, py: 62, dot: true },
  { label: 'нос', side: 'right', ly: 84, px: 165, py: 70, dot: false },
  { label: 'рот', side: 'right', ly: 106, px: 170, py: 80, dot: false },
  { label: 'живо́т', side: 'right', ly: 158, px: 172, py: 158, dot: true },
]

/** Figura humana de frente con las partes del cuerpo señaladas. */
export function Cuerpo() {
  return (
    <Frame label={ALTS.cuerpo} height={300}>
      {/* Piernas y zapatos */}
      <path d="M144 200 L142 266 M176 200 L178 266" stroke="var(--navy-ink)" strokeWidth={20} />
      <rect x={128} y={268} width={24} height={14} rx={6} fill="var(--coral)" stroke="none" />
      <rect x={168} y={268} width={24} height={14} rx={6} fill="var(--coral)" stroke="none" />
      <rect x={128} y={186} width={64} height={20} rx={4} fill="var(--navy-ink)" stroke="none" />

      {/* Brazos y manos */}
      <path d="M132 108 L114 184 M188 108 L206 184" stroke="var(--violet)" strokeWidth={16} />
      <circle cx={112} cy={194} r={8} fill="var(--surface-2)" stroke="var(--navy-ink)" />
      <circle cx={208} cy={194} r={8} fill="var(--surface-2)" stroke="var(--navy-ink)" />

      {/* Torso (camiseta) */}
      <rect x={154} y={84} width={12} height={16} fill="var(--surface-2)" stroke="var(--navy-ink)" />
      <path
        d="M128 112 Q128 98 142 98 H178 Q192 98 192 112 V192 H128 Z"
        fill="var(--violet)"
        stroke="var(--surface)"
        strokeWidth={3}
      />
      <path d="M150 98 Q160 108 170 98" stroke="var(--violet-soft)" strokeWidth={2.5} />

      {/* Cabeza: orejas, cara mínima y pelo */}
      <ellipse cx={134} cy={62} rx={5} ry={8} fill="var(--surface-2)" stroke="var(--navy-ink)" />
      <ellipse cx={186} cy={62} rx={5} ry={8} fill="var(--surface-2)" stroke="var(--navy-ink)" />
      <circle cx={160} cy={60} r={26} fill="var(--surface-2)" stroke="var(--navy-ink)" />
      <path d="M135 54 Q134 33 160 33 Q186 33 185 54 Q176 43 160 43 Q144 43 135 54 Z" fill="var(--navy-ink)" stroke="var(--navy-ink)" strokeWidth={2} />
      <circle cx={150} cy={60} r={2.6} fill="var(--navy-ink)" stroke="none" />
      <circle cx={170} cy={60} r={2.6} fill="var(--navy-ink)" stroke="none" />
      <path d="M160 62 L157.5 69 H162" stroke="var(--navy-ink)" strokeWidth={2} />
      <path d="M153 76 Q160 81 167 76" stroke="var(--navy-ink)" strokeWidth={2} />

      {/* Líneas guía y etiquetas */}
      {LEADERS.map(({ label, side, ly, px, py, dot }) => {
        const left = side === 'left'
        const lx = left ? 98 : 222
        return (
          <g key={label}>
            <path d={`M${lx} ${ly} L${px} ${py}`} stroke="var(--muted)" strokeWidth={1.5} />
            {dot && <circle cx={px} cy={py} r={3} fill="var(--coral)" stroke="var(--surface)" strokeWidth={1.5} />}
            <Ru x={left ? 92 : 228} y={ly + 5} anchor={left ? 'end' : 'start'}>
              {label}
            </Ru>
          </g>
        )
      })}
    </Frame>
  )
}
