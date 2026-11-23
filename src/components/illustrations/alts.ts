export type IllustrationId =
  | 'prep-v-na'
  | 'acus-direccion'
  | 'gen-net'
  | 'dat-podarok'
  | 'instr-s'
  | 'aspecto-linea'
  | 'mov-idti-hodit'
  | 'cuerpo'
  | 'mov-ehat-ezdit'
  | 'plural'
  | 'presentarse'
  | 'compras'

/** Texto alternativo (español) de cada ilustración. */
export const ALTS: Record<IllustrationId, string> = {
  'prep-v-na': 'Una pelota dentro de una caja y otra encima de una caja',
  'acus-direccion': 'Ir a la escuela frente a estar en la escuela',
  'gen-net': 'Una cesta con pan y una cesta vacía',
  'dat-podarok': 'Una persona da un regalo a su abuela',
  'instr-s': 'Una taza de té con limón y otra con miel',
  'aspecto-linea': 'Línea de tiempo: proceso frente a resultado',
  'mov-idti-hodit': 'Ir en una dirección frente a ir y volver',
  cuerpo: 'Figura humana con las partes del cuerpo en ruso',
  'mov-ehat-ezdit': 'Ir en transporte en una dirección frente a ir y volver',
  plural: 'Un libro frente a cinco libros',
  presentarse: 'Dos personas se presentan',
  compras: 'Un puesto de mercado con precios en rublos',
}
