import { ALTS } from './alts'
import { Bubble, Es, Frame, Person, Ru } from './parts'

/** Как тебя зовут? — Меня зовут Анна. Я из Испании. */
export function Presentarse() {
  return (
    <Frame label={ALTS.presentarse} height={200}>
      <path d="M36 172 H284" stroke="var(--border)" />

      {/* Pregunta (izquierda) */}
      <Bubble x={8} y={6} w={140} h={34} tailX={62} tipX={70} tipY={62} fill="var(--violet-soft)" stroke="var(--violet)" />
      <Ru x={78} y={28}>Как тебя́ зову́т?</Ru>
      <Person x={74} y={172} color="var(--violet)" pose="wave" scale={1.35} />

      {/* Respuesta (derecha) */}
      <Bubble x={154} y={28} w={158} h={50} tailX={250} tipX={242} tipY={88} fill="var(--coral-soft)" stroke="var(--coral)" />
      <Ru x={233} y={49}>Меня́ зову́т А́нна.</Ru>
      <Ru x={233} y={68}>Я из Испа́нии.</Ru>
      <Person x={246} y={172} color="var(--coral)" scale={1.35} flip />

      <Es x={160} y={195}>presentarse</Es>
    </Frame>
  )
}
