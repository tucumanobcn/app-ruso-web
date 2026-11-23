import { ALTS } from './alts'
import { Es, Frame, Ru } from './parts'

const WAVE = `M24 80 q6 -9 12 0${' t12 0'.repeat(20)}`

/** Я читал книгу (proceso) / Я прочитал книгу (resultado). */
export function AspectoLinea() {
  return (
    <Frame label={ALTS['aspecto-linea']} height={210}>
      {/* Proceso: línea ondulada que sigue abierta */}
      <Ru x={24} y={30} anchor="start">Я чита́л кни́гу.</Ru>
      <Es x={24} y={50} anchor="start">proceso · imperfectivo</Es>
      <circle cx={24} cy={80} r={5} fill="var(--violet)" />
      <path d={WAVE} stroke="var(--violet)" strokeWidth={3} />
      <circle cx={288} cy={80} r={3} fill="var(--violet)" fillOpacity={0.8} />
      <circle cx={298} cy={80} r={2.5} fill="var(--violet)" fillOpacity={0.55} />
      <circle cx={307} cy={80} r={2} fill="var(--violet)" fillOpacity={0.3} />

      <path d="M24 106 H296" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />

      {/* Resultado: línea recta que termina en un logro */}
      <Ru x={24} y={134} anchor="start">Я прочита́л кни́гу.</Ru>
      <Es x={24} y={154} anchor="start">resultado · perfectivo</Es>
      <circle cx={24} cy={182} r={5} fill="var(--mint)" />
      <path d="M24 182 H264" stroke="var(--mint)" strokeWidth={3} />
      <circle cx={282} cy={182} r={16} fill="var(--mint)" />
      <path d="M274 182 l6 6 l10 -12" stroke="var(--surface)" strokeWidth={3} />
    </Frame>
  )
}
