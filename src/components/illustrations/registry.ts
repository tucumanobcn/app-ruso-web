import type { JSX } from 'react'
import { AcusDireccion } from './AcusDireccion'
import { ALTS, type IllustrationId } from './alts'
import { AspectoLinea } from './AspectoLinea'
import { Compras } from './Compras'
import { Cuerpo } from './Cuerpo'
import { DatPodarok } from './DatPodarok'
import { GenNet } from './GenNet'
import { InstrS } from './InstrS'
import { MovEhatEzdit } from './MovEhatEzdit'
import { MovIdtiHodit } from './MovIdtiHodit'
import { Plural } from './Plural'
import { PrepVNa } from './PrepVNa'
import { Presentarse } from './Presentarse'

export const ILLUSTRATIONS: Record<IllustrationId, { Component: () => JSX.Element; alt: string }> = {
  'prep-v-na': { Component: PrepVNa, alt: ALTS['prep-v-na'] },
  'acus-direccion': { Component: AcusDireccion, alt: ALTS['acus-direccion'] },
  'gen-net': { Component: GenNet, alt: ALTS['gen-net'] },
  'dat-podarok': { Component: DatPodarok, alt: ALTS['dat-podarok'] },
  'instr-s': { Component: InstrS, alt: ALTS['instr-s'] },
  'aspecto-linea': { Component: AspectoLinea, alt: ALTS['aspecto-linea'] },
  'mov-idti-hodit': { Component: MovIdtiHodit, alt: ALTS['mov-idti-hodit'] },
  cuerpo: { Component: Cuerpo, alt: ALTS.cuerpo },
  'mov-ehat-ezdit': { Component: MovEhatEzdit, alt: ALTS['mov-ehat-ezdit'] },
  plural: { Component: Plural, alt: ALTS.plural },
  presentarse: { Component: Presentarse, alt: ALTS.presentarse },
  compras: { Component: Compras, alt: ALTS.compras },
}
