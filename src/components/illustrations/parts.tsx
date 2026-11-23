import type { ReactNode } from 'react'

/* Piezas compartidas por las ilustraciones. Todo color sale de variables CSS
   para que funcionen en modo claro y oscuro. */

interface FrameProps {
  label: string
  height: number
  /** Coordenada superior del viewBox (recorta el aire de arriba). */
  minY?: number
  children: ReactNode
}

/** Lienzo SVG común: 320 de ancho, trazos redondeados de 2.5. */
export function Frame({ label, height, minY = 0, children }: FrameProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 ${minY} 320 ${height}`}
      width="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
      fill="none"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fontFamily="inherit"
    >
      {children}
    </svg>
  )
}

type Anchor = 'start' | 'middle' | 'end'

interface LabelProps {
  x: number
  y: number
  children: ReactNode
  anchor?: Anchor
}

/** Etiqueta en ruso: algo más gruesa, color de texto. */
export function Ru({ x, y, children, anchor = 'middle' }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      lang="ru"
      textAnchor={anchor}
      fontSize={15}
      fontWeight={600}
      fill="var(--text)"
      stroke="none"
    >
      {children}
    </text>
  )
}

/** Subetiqueta en español: más pequeña y apagada. */
export function Es({ x, y, children, anchor = 'middle' }: LabelProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={13}
      fontWeight={400}
      fill="var(--muted)"
      stroke="none"
    >
      {children}
    </text>
  )
}

type Pose = 'stand' | 'walk' | 'give' | 'wave'

const LIMBS: Record<Pose, string> = {
  stand: 'M0 -41 V-20 M0 -20 L-6 0 M0 -20 L6 0 M0 -35 L-8 -21 M0 -35 L8 -21',
  walk: 'M0 -41 L1 -20 M1 -20 L10 0 M1 -20 L-3 -10 L-9 -1 M0 -35 L9 -25 M0 -35 L-8 -24',
  give: 'M0 -41 V-20 M0 -20 L-6 0 M0 -20 L6 0 M0 -35 L-8 -21 M0 -35 L14 -32',
  wave: 'M0 -41 V-20 M0 -20 L-6 0 M0 -20 L6 0 M0 -35 L-8 -21 M0 -35 L10 -44 L13 -56',
}

interface PersonProps {
  /** Centro horizontal. */
  x: number
  /** Línea del suelo (pies). */
  y: number
  color: string
  pose?: Pose
  scale?: number
  /** Refleja la figura en horizontal (mira hacia la izquierda). */
  flip?: boolean
}

/** Figura minimalista sin rasgos, de unos 58 de alto a escala 1. */
export function Person({ x, y, color, pose = 'stand', scale = 1, flip = false }: PersonProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <circle cx={0} cy={-50} r={7.5} fill={color} />
      <path d={LIMBS[pose]} stroke={color} strokeWidth={4.5} />
    </g>
  )
}

interface ArrowProps {
  x1: number
  x2: number
  y: number
  color: string
}

/** Flecha horizontal; apunta hacia x2. */
export function Arrow({ x1, x2, y, color }: ArrowProps) {
  const d = x2 > x1 ? 1 : -1
  return (
    <g stroke={color} strokeWidth={3}>
      <path d={`M${x1} ${y} H${x2}`} />
      <path d={`M${x2 - 8 * d} ${y - 7} L${x2} ${y} L${x2 - 8 * d} ${y + 7}`} />
    </g>
  )
}

interface SchoolProps {
  /** Borde izquierdo. */
  x: number
  /** Línea del suelo. */
  y: number
  w: number
  h: number
  doorW?: number
  doorH?: number
  doorFill?: string
}

/** Edificio de escuela: frontón, bandera, ventanas y puerta. */
export function School({
  x,
  y,
  w,
  h,
  doorW = w * 0.26,
  doorH = h * 0.5,
  doorFill = 'var(--violet)',
}: SchoolProps) {
  const top = y - h
  const roofH = w * 0.3
  const cx = x + w / 2
  const winW = w * 0.17
  const winH = winW * 0.85
  return (
    <g>
      <path d={`M${cx} ${top - roofH} V${top - roofH - 14}`} stroke="var(--navy-ink)" />
      <path
        d={`M${cx} ${top - roofH - 14} H${cx + 12} L${cx + 9} ${top - roofH - 10} L${cx + 12} ${top - roofH - 6} H${cx}`}
        fill="var(--mint)"
        stroke="var(--mint)"
        strokeWidth={1.5}
      />
      <rect x={x} y={top} width={w} height={h} rx={3} fill="var(--surface)" stroke="var(--navy-ink)" />
      <path
        d={`M${x - 4} ${top} L${cx} ${top - roofH} L${x + w + 4} ${top} Z`}
        fill="var(--coral)"
        stroke="var(--navy-ink)"
      />
      <rect
        x={x + w * 0.08}
        y={top + 10}
        width={winW}
        height={winH}
        rx={2}
        fill="var(--yellow-soft)"
        stroke="var(--navy-ink)"
        strokeWidth={2}
      />
      <rect
        x={x + w * 0.92 - winW}
        y={top + 10}
        width={winW}
        height={winH}
        rx={2}
        fill="var(--yellow-soft)"
        stroke="var(--navy-ink)"
        strokeWidth={2}
      />
      <path
        d={`M${cx - doorW / 2} ${y} V${y - doorH + 4} Q${cx - doorW / 2} ${y - doorH} ${cx - doorW / 2 + 4} ${y - doorH} H${cx + doorW / 2 - 4} Q${cx + doorW / 2} ${y - doorH} ${cx + doorW / 2} ${y - doorH + 4} V${y}`}
        fill={doorFill}
        stroke="var(--navy-ink)"
        strokeWidth={2}
      />
    </g>
  )
}

interface HouseProps {
  /** Borde izquierdo. */
  x: number
  /** Línea del suelo. */
  y: number
}

/** Casa pequeña (unos 44 de ancho y 48 de alto). */
export function House({ x, y }: HouseProps) {
  return (
    <g>
      <rect x={x + 2} y={y - 28} width={40} height={28} rx={2} fill="var(--surface)" stroke="var(--navy-ink)" />
      <path d={`M${x - 3} ${y - 26} L${x + 22} ${y - 48} L${x + 47} ${y - 26} Z`} fill="var(--violet)" stroke="var(--navy-ink)" />
      <rect x={x + 17} y={y - 16} width={10} height={16} rx={1.5} fill="var(--yellow)" stroke="var(--navy-ink)" strokeWidth={2} />
    </g>
  )
}

interface BubbleProps {
  /** Esquina superior izquierda. */
  x: number
  y: number
  w: number
  h: number
  /** Centro de la base de la cola, sobre el borde inferior. */
  tailX: number
  /** Punta de la cola. */
  tipX: number
  tipY: number
  fill: string
  stroke: string
}

/** Bocadillo de diálogo con la cola hacia abajo. */
export function Bubble({ x, y, w, h, tailX, tipX, tipY, fill, stroke }: BubbleProps) {
  const r = 12
  const b = y + h
  return (
    <path
      d={`M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${b - r} Q${x + w} ${b} ${x + w - r} ${b} H${tailX + 7} L${tipX} ${tipY} L${tailX - 7} ${b} H${x + r} Q${x} ${b} ${x} ${b - r} V${y + r} Q${x} ${y} ${x + r} ${y} Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={2.5}
    />
  )
}

interface VehicleProps {
  /** Borde izquierdo. */
  x: number
  /** Línea del suelo (base de las ruedas). */
  y: number
  color: string
}

function Wheels({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  return (
    <g fill="var(--navy-ink)" stroke="var(--surface)" strokeWidth={2}>
      <circle cx={x1} cy={y - 6} r={6} />
      <circle cx={x2} cy={y - 6} r={6} />
    </g>
  )
}

/** Autobús pequeño de perfil, mirando a la derecha (unos 56 de ancho y 32 de alto). */
export function Bus({ x, y, color }: VehicleProps) {
  return (
    <g>
      <rect x={x} y={y - 32} width={56} height={24} rx={6} fill={color} stroke="var(--navy-ink)" />
      <g fill="var(--yellow-soft)" stroke="var(--navy-ink)" strokeWidth={2}>
        <rect x={x + 6} y={y - 27} width={10} height={9} rx={1.5} />
        <rect x={x + 20} y={y - 27} width={10} height={9} rx={1.5} />
        <rect x={x + 34} y={y - 27} width={10} height={9} rx={1.5} />
        <path d={`M${x + 48} ${y - 27} H${x + 51} Q${x + 53} ${y - 27} ${x + 53} ${y - 25} V${y - 18} H${x + 48} Z`} />
      </g>
      <Wheels x1={x + 13} x2={x + 43} y={y} />
    </g>
  )
}

/** Coche pequeño de perfil, mirando a la derecha (unos 54 de ancho y 30 de alto). */
export function Car({ x, y, color }: VehicleProps) {
  return (
    <g>
      <path
        d={`M${x + 12} ${y - 19} L${x + 18} ${y - 29} H${x + 34} L${x + 42} ${y - 19} Z`}
        fill="var(--yellow-soft)"
        stroke="var(--navy-ink)"
      />
      <path d={`M${x + 26} ${y - 29} V${y - 19}`} stroke="var(--navy-ink)" strokeWidth={2} />
      <rect x={x} y={y - 20} width={54} height={13} rx={5} fill={color} stroke="var(--navy-ink)" />
      <Wheels x1={x + 13} x2={x + 41} y={y} />
    </g>
  )
}
