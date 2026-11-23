import { ALTS } from './alts'
import { Es, Frame, Ru } from './parts'

/** Libro de frente: tapa, lomo y etiqueta. `x` es el borde izquierdo y `y` la base. */
function Book({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y - 46} width={34} height={46} rx={3} fill={color} stroke="var(--navy-ink)" />
      <path d={`M${x + 7} ${y - 46} V${y}`} stroke="var(--navy-ink)" strokeWidth={2} />
      <rect x={x + 12} y={y - 37} width={16} height={9} rx={1.5} fill="var(--surface)" stroke="none" />
    </g>
  )
}

/** Libro tumbado, visto de canto: tapa de color y hojas a la derecha. */
function FlatBook({ x, y, w, color }: { x: number; y: number; w: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y - 11} width={w} height={11} rx={2.5} fill={color} stroke="var(--navy-ink)" strokeWidth={2} />
      <rect x={x + w - 12} y={y - 7.5} width={9} height={4} rx={1} fill="var(--surface)" stroke="none" />
    </g>
  )
}

const STACK = [
  { dx: 0, w: 70, color: 'var(--violet)' },
  { dx: 5, w: 62, color: 'var(--coral)' },
  { dx: -2, w: 68, color: 'var(--mint)' },
  { dx: 6, w: 60, color: 'var(--yellow)' },
  { dx: 2, w: 64, color: 'var(--violet)' },
]

/** одна книга (nominativo singular) / две книги (genitivo singular) / пять книг (genitivo plural). */
export function Plural() {
  return (
    <Frame label={ALTS.plural} minY={48} height={152}>
      <path d="M108 60 V186 M212 60 V186" stroke="var(--border)" strokeWidth={2} strokeDasharray="4 6" />
      <path d="M16 124 H92 M120 124 H200 M228 124 H304" stroke="var(--border)" />

      {/* 1 libro */}
      <Book x={37} y={124} color="var(--violet)" />

      {/* 2 libros */}
      <Book x={121} y={124} color="var(--violet)" />
      <Book x={165} y={124} color="var(--coral)" />

      {/* 5 libros apilados */}
      {STACK.map(({ dx, w, color }, i) => (
        <FlatBook key={w} x={266 - 35 + dx} y={124 - i * 11} w={w} color={color} />
      ))}

      <Ru x={54} y={150}>одна́ кни́га</Ru>
      <Es x={54} y={168}>nominativo</Es>
      <Es x={54} y={184}>singular</Es>
      <Ru x={160} y={150}>две кни́ги</Ru>
      <Es x={160} y={168}>genitivo</Es>
      <Es x={160} y={184}>singular</Es>
      <Ru x={266} y={150}>пять книг</Ru>
      <Es x={266} y={168}>genitivo</Es>
      <Es x={266} y={184}>plural</Es>
    </Frame>
  )
}
