/**
 * Mapa de conocimientos: nivel orientativo, importancia y dependencias de cada
 * conocimiento del glosario. El tipo Record<SkillId, …> obliga a que todo
 * conocimiento tenga su entrada; el validador comprueba que no haya ciclos.
 */
import type { SkillId } from './glossary'
import type { Level } from './types'

export interface KnowledgeNode {
  module: string
  level: Level
  /**
   * esencial: conviene tener cierto dominio antes de construir encima.
   * secundario: se puede avanzar sin él, con seguimiento.
   */
  importance: 'esencial' | 'secundario'
  /** Conocimientos en los que se apoya. */
  requires: SkillId[]
}

export const KNOWLEDGE_MAP: Record<SkillId, KnowledgeNode> = {
  'prep.lugar': { module: 'Casos gramaticales', level: 'A1', importance: 'esencial', requires: [] },
  'prep.v-na': {
    module: 'Casos gramaticales',
    level: 'A1',
    importance: 'esencial',
    requires: ['prep.lugar'],
  },
  'prep.o': { module: 'Casos gramaticales', level: 'A1', importance: 'secundario', requires: ['prep.lugar'] },

  'acus.objeto': { module: 'Casos gramaticales', level: 'A1', importance: 'esencial', requires: [] },
  'acus.animacion': {
    module: 'Casos gramaticales',
    level: 'A1',
    importance: 'esencial',
    requires: ['acus.objeto'],
  },
  'acus.direccion': {
    module: 'Casos gramaticales',
    level: 'A1',
    importance: 'esencial',
    requires: ['acus.objeto', 'prep.lugar'],
  },

  'gen.negacion': { module: 'Casos gramaticales', level: 'A2', importance: 'esencial', requires: [] },
  'gen.posesion': { module: 'Casos gramaticales', level: 'A2', importance: 'esencial', requires: [] },
  'gen.cantidad': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'esencial',
    requires: ['gen.negacion'],
  },
  'gen.ortografia': { module: 'Casos gramaticales', level: 'A2', importance: 'secundario', requires: [] },

  'dat.destinatario': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'esencial',
    requires: ['acus.objeto'],
  },
  'dat.impersonal': { module: 'Casos gramaticales', level: 'A2', importance: 'esencial', requires: [] },
  'dat.k': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'secundario',
    requires: ['acus.direccion'],
  },

  'instr.compania': { module: 'Casos gramaticales', level: 'A2', importance: 'esencial', requires: [] },
  'instr.regimen': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'esencial',
    requires: ['instr.compania'],
  },
  'instr.profesion': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'secundario',
    requires: ['instr.compania'],
  },
  'instr.pronombres': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'secundario',
    requires: ['instr.compania'],
  },

  'casos.integracion': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'esencial',
    requires: ['prep.lugar', 'acus.objeto', 'gen.negacion', 'dat.destinatario', 'instr.compania'],
  },

  'aspecto.pasado': { module: 'Aspecto verbal', level: 'A2', importance: 'esencial', requires: [] },
  'aspecto.presente-futuro': {
    module: 'Aspecto verbal',
    level: 'A2',
    importance: 'esencial',
    requires: ['aspecto.pasado'],
  },
  'aspecto.pares': { module: 'Aspecto verbal', level: 'A2', importance: 'secundario', requires: [] },

  'mov.idti-hodit': {
    module: 'Verbos de movimiento',
    level: 'A2',
    importance: 'esencial',
    requires: ['acus.direccion'],
  },
  'mov.conjugacion': { module: 'Verbos de movimiento', level: 'A2', importance: 'secundario', requires: [] },

  'lex.cotidiano': { module: 'Vocabulario y comunicación', level: 'A2', importance: 'secundario', requires: [] },
  'lex.cuerpo': { module: 'Vocabulario y comunicación', level: 'A1', importance: 'esencial', requires: [] },
  'est.bolet': {
    module: 'Vocabulario y comunicación',
    level: 'A2',
    importance: 'secundario',
    requires: ['lex.cuerpo', 'gen.posesion'],
  },
  'com.presentarse': {
    module: 'Vocabulario y comunicación',
    level: 'A1',
    importance: 'esencial',
    requires: ['prep.lugar', 'instr.profesion'],
  },
  'com.compras': {
    module: 'Vocabulario y comunicación',
    level: 'A2',
    importance: 'esencial',
    requires: ['gen.cantidad', 'acus.objeto'],
  },

  'mov.ehat-ezdit': {
    module: 'Verbos de movimiento',
    level: 'A2',
    importance: 'esencial',
    requires: ['mov.idti-hodit'],
  },
  'mov.transporte': {
    module: 'Verbos de movimiento',
    level: 'A2',
    importance: 'secundario',
    requires: ['prep.lugar'],
  },

  'plural.nominativo': { module: 'Casos gramaticales', level: 'A1', importance: 'esencial', requires: [] },
  'plural.genitivo': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'esencial',
    requires: ['gen.cantidad', 'plural.nominativo'],
  },
  'plural.acusativo': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'secundario',
    requires: ['acus.animacion', 'plural.genitivo'],
  },
  'plural.oblicuos': {
    module: 'Casos gramaticales',
    level: 'A2',
    importance: 'esencial',
    requires: ['plural.nominativo'],
  },
}

/** Conocimientos que dependen directamente de `skill`. */
export function dependentsOf(skill: SkillId): SkillId[] {
  return (Object.keys(KNOWLEDGE_MAP) as SkillId[]).filter((other) =>
    KNOWLEDGE_MAP[other].requires.includes(skill),
  )
}
