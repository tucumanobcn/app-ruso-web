import { ALTS } from './alts'
import { Arrow, Es, Frame, Person, Ru } from './parts'

/** Я дарю подарок бабушке: el regalo viaja hacia la abuela (dativo). */
export function DatPodarok() {
  return (
    <Frame label={ALTS['dat-podarok']} minY={46} height={160}>
      <path d="M24 150 H296" stroke="var(--border)" />

      {/* Quien regala */}
      <Person x={62} y={150} color="var(--violet)" pose="give" scale={1.1} />

      {/* Regalo sobre la flecha */}
      <Arrow x1={92} x2={226} y={122} color="var(--violet)" />
      <rect x={144} y={82} width={32} height={26} rx={3} fill="var(--yellow)" stroke="var(--navy-ink)" />
      <rect x={157} y={82} width={6} height={26} fill="var(--coral)" stroke="none" />
      <rect x={140} y={74} width={40} height={10} rx={3} fill="var(--yellow)" stroke="var(--navy-ink)" />
      <rect x={157} y={75.5} width={6} height={7} fill="var(--coral)" stroke="none" />
      <path
        d="M160 74 Q149 60 145 68 Q143 74 160 74 Z M160 74 Q171 60 175 68 Q177 74 160 74 Z"
        fill="var(--coral)"
        stroke="var(--coral)"
        strokeWidth={2}
      />

      {/* Abuela: pañuelo en la cabeza y vestido */}
      <g>
        <path d="M253 136 V150 M263 136 V150" stroke="var(--navy-ink)" strokeWidth={4.5} />
        <path d="M253 112 L240 121 M263 112 L268 129" stroke="var(--navy-ink)" strokeWidth={4.5} />
        <path d="M252 106 H264 L273 138 H243 Z" fill="var(--mint)" stroke="var(--navy-ink)" />
        <circle cx={258} cy={97} r={8} fill="var(--navy-ink)" />
        <path
          d="M248 102 Q246 85 258 85 Q270 85 268 102 L264 107 Q262 96 258 96 Q254 96 252 107 Z"
          fill="var(--coral)"
          stroke="var(--coral)"
          strokeWidth={2}
        />
      </g>

      <Ru x={160} y={180}>Я дарю́ пода́рок ба́бушке.</Ru>
      <Es x={160} y={199}>¿a quién? → dativo</Es>
    </Frame>
  )
}
