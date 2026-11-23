import { ALTS } from './alts'
import { Bubble, Es, Frame, Person, Ru } from './parts'

const STRIPES = Array.from({ length: 14 }, (_, i) => i)
const APPLES = [
  { cx: 36, cy: 92 },
  { cx: 50, cy: 90 },
  { cx: 64, cy: 92 },
  { cx: 43, cy: 82 },
  { cx: 57, cy: 82 },
]

/** Etiqueta de precio en la parte frontal del mostrador. */
function Tag({ cx, w, children }: { cx: number; w: number; children: string }) {
  return (
    <g>
      <rect x={cx - w / 2} y={128} width={w} height={18} rx={4} fill="var(--yellow-soft)" stroke="var(--navy-ink)" strokeWidth={2} />
      <text x={cx} y={141.5} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--text)" stroke="none">
        {children}
      </text>
    </g>
  )
}

/** Puesto de mercado con precios en rublos: «Сколько стоит?». */
export function Compras() {
  return (
    <Frame label={ALTS.compras} height={200}>
      <path d="M8 170 H312" stroke="var(--border)" />

      {/* Toldo a rayas con festón */}
      <path d="M22 42 V118 M166 42 V118" stroke="var(--navy-ink)" strokeWidth={3} />
      {STRIPES.map((i) => {
        const x = 10 + i * 12
        return (
          <path
            key={i}
            d={`M${x} 18 H${x + 12} V38 Q${x + 12} 46 ${x + 6} 46 Q${x} 46 ${x} 38 Z`}
            fill={i % 2 === 0 ? 'var(--coral)' : 'var(--surface)'}
            stroke="var(--navy-ink)"
            strokeWidth={2}
          />
        )
      })}
      <rect x={10} y={14} width={168} height={6} rx={3} fill="var(--navy-ink)" stroke="none" />

      {/* Mostrador */}
      <rect x={10} y={118} width={168} height={52} rx={3} fill="var(--surface)" stroke="var(--navy-ink)" />
      <path d="M10 124 H178" stroke="var(--navy-ink)" strokeWidth={2} />

      {/* Caja de manzanas */}
      {APPLES.map(({ cx, cy }) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r={7.5} fill="var(--coral)" stroke="var(--navy-ink)" strokeWidth={2} />
          <path d={`M${cx} ${cy - 7} l2 -4`} stroke="var(--success)" strokeWidth={2} />
        </g>
      ))}
      <rect x={26} y={96} width={48} height={22} rx={2} fill="var(--yellow)" stroke="var(--navy-ink)" />
      <path d="M26 107 H74" stroke="var(--navy-ink)" strokeWidth={2} />

      {/* Botella de agua */}
      <path
        d="M95 70 H103 V78 Q110 82 110 90 V114 Q110 118 106 118 H92 Q88 118 88 114 V90 Q88 82 95 78 Z"
        fill="var(--mint-soft)"
        stroke="var(--navy-ink)"
      />
      <rect x={94} y={64} width={10} height={6} rx={1.5} fill="var(--violet)" stroke="var(--navy-ink)" strokeWidth={2} />
      <rect x={88} y={96} width={22} height={10} fill="var(--mint)" stroke="none" />

      {/* Pan */}
      <path d="M122 118 C122 94 164 94 164 118 Z" fill="var(--yellow)" stroke="var(--navy-ink)" />
      <path d="M132 108 l6 -7 M141 106 l6 -7 M150 108 l6 -7" stroke="var(--navy-ink)" strokeWidth={2} />

      {/* Precios */}
      <Tag cx={50} w={46}>100 ₽</Tag>
      <Tag cx={99} w={38}>50 ₽</Tag>
      <Tag cx={143} w={38}>70 ₽</Tag>

      {/* Cliente */}
      <Bubble x={184} y={26} w={132} h={34} tailX={252} tipX={258} tipY={78} fill="var(--violet-soft)" stroke="var(--violet)" />
      <Ru x={250} y={48}>Ско́лько сто́ит?</Ru>
      <Person x={264} y={170} color="var(--violet)" pose="give" scale={1.35} flip />

      <Es x={160} y={194}>en la tienda / en el mercado</Es>
    </Frame>
  )
}
