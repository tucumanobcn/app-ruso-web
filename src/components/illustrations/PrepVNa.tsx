import { ALTS } from './alts'
import { Es, Frame, Ru } from './parts'

/** в коробке / на коробке: dentro frente a encima. */
export function PrepVNa() {
  return (
    <Frame label={ALTS['prep-v-na']} minY={36} height={168}>
      <path d="M160 44 V190" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />

      {/* Izquierda: pelota dentro de una caja abierta y translúcida */}
      <ellipse cx={80} cy={148} rx={50} ry={5} fill="var(--surface-2)" stroke="none" />
      <path d="M40 80 V136 Q40 144 48 144 H112 Q120 144 120 136 V80 Z" fill="var(--violet-soft)" stroke="none" />
      <path d="M40 80 H120" stroke="var(--violet)" strokeDasharray="3 6" strokeOpacity={0.6} />
      <circle cx={80} cy={119} r={18} fill="var(--coral)" />
      <path d="M70 112 Q74 105 82 104" stroke="var(--surface)" strokeWidth={2.5} strokeOpacity={0.7} />
      <path d="M40 80 V136 Q40 144 48 144 H112 Q120 144 120 136 V80" stroke="var(--violet)" strokeWidth={3} />
      <path d="M40 80 L26 64 M120 80 L134 64" stroke="var(--violet)" strokeWidth={3} />

      {/* Derecha: caja cerrada con una pelota encima */}
      <ellipse cx={240} cy={148} rx={50} ry={5} fill="var(--surface-2)" stroke="none" />
      <rect x={200} y={96} width={80} height={48} rx={6} fill="var(--violet-soft)" stroke="var(--violet)" strokeWidth={3} />
      <path d="M240 100 V144" stroke="var(--violet)" strokeOpacity={0.5} />
      <rect x={194} y={86} width={92} height={14} rx={5} fill="var(--violet)" stroke="var(--violet)" strokeWidth={3} />
      <circle cx={240} cy={68} r={18} fill="var(--coral)" />
      <path d="M230 61 Q234 54 242 53" stroke="var(--surface)" strokeWidth={2.5} strokeOpacity={0.7} />

      <Ru x={80} y={176}>в коро́бке</Ru>
      <Es x={80} y={195}>dentro</Es>
      <Ru x={240} y={176}>на коро́бке</Ru>
      <Es x={240} y={195}>encima</Es>
    </Frame>
  )
}
