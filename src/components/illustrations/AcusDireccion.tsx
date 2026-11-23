import { ALTS } from './alts'
import { Arrow, Es, Frame, Person, Ru, School } from './parts'

/** Я иду в школу (acusativo, dirección) / Я в школе (prepositivo, lugar). */
export function AcusDireccion() {
  return (
    <Frame label={ALTS['acus-direccion']} minY={18} height={186}>
      <path d="M160 30 V190" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />

      {/* Izquierda: camino hacia la escuela */}
      <path d="M16 140 H150" stroke="var(--border)" />
      <Person x={30} y={140} color="var(--violet)" pose="walk" />
      <Arrow x1={48} x2={82} y={112} color="var(--coral)" />
      <School x={90} y={140} w={58} h={44} />

      {/* Derecha: dentro de la escuela */}
      <path d="M170 140 H304" stroke="var(--border)" />
      <School x={192} y={140} w={96} h={66} doorW={40} doorH={50} doorFill="var(--violet-soft)" />
      <Person x={240} y={140} color="var(--violet)" scale={0.76} />

      <Ru x={80} y={170}>Я иду́ в шко́лу</Ru>
      <Es x={80} y={190}>¿adónde? → acusativo</Es>
      <Ru x={240} y={170}>Я в шко́ле</Ru>
      <Es x={240} y={190}>¿dónde? → prepositivo</Es>
    </Frame>
  )
}
