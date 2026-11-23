import { ALTS } from './alts'
import { Arrow, Es, Frame, House, Person, Ru, School } from './parts'

/** идти (una dirección, ahora) / ходить (ida y vuelta, costumbre). */
export function MovIdtiHodit() {
  return (
    <Frame label={ALTS['mov-idti-hodit']} height={228}>
      {/* идти: una sola flecha hacia el destino */}
      <path d="M20 74 H300" stroke="var(--border)" />
      <Person x={40} y={74} color="var(--violet)" pose="walk" />
      <Arrow x1={60} x2={196} y={50} color="var(--violet)" />
      <School x={212} y={74} w={56} h={36} />
      <Ru x={24} y={100} anchor="start">идти́</Ru>
      <Es x={96} y={100} anchor="start">una dirección, ahora</Es>

      <path d="M20 118 H300" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />

      {/* ходить: ida y vuelta entre casa y escuela, repetido */}
      <path d="M20 192 H300" stroke="var(--border)" />
      <House x={22} y={192} />
      <Person x={86} y={192} color="var(--violet)" pose="walk" />
      <Arrow x1={104} x2={234} y={152} color="var(--violet)" />
      <Arrow x1={234} x2={104} y={170} color="var(--coral)" />
      <path d="M160 179 V187 M168 179 V187 M176 179 V187" stroke="var(--mint)" strokeWidth={2.5} />
      <School x={246} y={192} w={54} h={36} />
      <Ru x={24} y={218} anchor="start">ходи́ть</Ru>
      <Es x={96} y={218} anchor="start">ida y vuelta, costumbre</Es>
    </Frame>
  )
}
