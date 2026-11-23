import { ALTS } from './alts'
import { Arrow, Bus, Car, Es, Frame, House, Ru, School } from './parts'

/** ехать (en transporte, una dirección) / ездить (ida y vuelta, costumbre). */
export function MovEhatEzdit() {
  return (
    <Frame label={ALTS['mov-ehat-ezdit']} height={200}>
      {/* ехать: el autobús va en una sola dirección hacia el destino */}
      <path d="M20 72 H300" stroke="var(--border)" />
      <path d="M14 50 H22 M10 58 H20" stroke="var(--muted)" strokeWidth={2} />
      <Bus x={28} y={72} color="var(--violet)" />
      <Arrow x1={96} x2={200} y={54} color="var(--violet)" />
      <School x={214} y={72} w={56} h={36} />
      <Ru x={24} y={96} anchor="start">е́хать</Ru>
      <Es x={96} y={96} anchor="start">en transporte, una dirección</Es>

      <path d="M20 112 H300" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />

      {/* ездить: ida y vuelta entre casa y edificio, repetido */}
      <path d="M20 172 H300" stroke="var(--border)" />
      <House x={22} y={172} />
      <Car x={78} y={172} color="var(--coral)" />
      <Arrow x1={142} x2={236} y={138} color="var(--violet)" />
      <Arrow x1={236} x2={142} y={154} color="var(--coral)" />
      <path d="M181 162 V169 M189 162 V169 M197 162 V169" stroke="var(--mint)" strokeWidth={2.5} />
      <School x={248} y={172} w={52} h={30} />
      <Ru x={24} y={194} anchor="start">е́здить</Ru>
      <Es x={96} y={194} anchor="start">ida y vuelta, costumbre</Es>
    </Frame>
  )
}
