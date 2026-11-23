/**
 * Genera src/content/vocab/forms.generated.ts con las formas verificadas (OpenRussian,
 * CC BY-SA 4.0) de las palabras de scripts/vocab/pool.json. Las plantillas de
 * variantes usan estas formas como respuestas correctas y como opciones incorrectas.
 *
 * Uso: node scripts/vocab/build-forms.mjs <carpeta-con-los-csv-de-openrussian>
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const csvDir = process.argv[2]
if (!csvDir) {
  console.error('Indica la carpeta con nouns.csv y verbs.csv de OpenRussian.')
  process.exit(1)
}

const STRESS = '́'
const VOWELS = /[аеёиоуыэюяАЕЁИОУЫЭЮЯ]/g

/** «челове'к» → «челове́к»; sin acento en monosílabos. Devuelve todas las variantes. */
function variants(raw) {
  if (!raw) return []
  return raw
    .split(/\s*[,;/]\s*/)
    .filter(Boolean)
    .map((word) => {
      const vowels = (word.replace(/'/g, '').match(VOWELS) ?? []).length
      return vowels <= 1 ? word.replace(/'/g, '') : word.replace(/'/g, STRESS)
    })
}

function readTsv(name) {
  const [header, ...lines] = readFileSync(join(csvDir, `${name}.csv`), 'utf8').split(/\r?\n/)
  const cols = header.split('\t')
  return lines.filter(Boolean).map((line) => {
    const cells = line.split('\t')
    return Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? '']))
  })
}

const pool = JSON.parse(readFileSync(join(here, 'pool.json'), 'utf8'))
const nounsCsv = readTsv('nouns')
const verbsCsv = readTsv('verbs')
const problems = []

const nouns = {}
for (const lemma of pool.nouns) {
  const row = nounsCsv.find((n) => n.bare === lemma && n.sg_nom)
  if (!row) {
    problems.push(`Sustantivo no encontrado: ${lemma}`)
    continue
  }
  const forms = {}
  for (const number of ['sg', 'pl']) {
    for (const c of ['nom', 'gen', 'dat', 'acc', 'inst', 'prep']) {
      const list = variants(row[`${number}_${c}`])
      if (list.length) forms[`${number}_${c}`] = list
    }
  }
  nouns[lemma] = {
    accented: variants(row.accented)[0],
    gender: row.gender || null,
    animate: row.animate === '1',
    forms,
  }
}

const verbs = {}
for (const lemma of pool.verbs) {
  const row = verbsCsv.find((v) => v.bare === lemma)
  if (!row) {
    problems.push(`Verbo no encontrado: ${lemma}`)
    continue
  }
  const first = (key) => variants(row[key])[0] ?? ''
  verbs[lemma] = {
    accented: variants(row.accented)[0],
    aspect: row.aspect,
    presentOrFuture: ['presfut_sg1', 'presfut_sg2', 'presfut_sg3', 'presfut_pl1', 'presfut_pl2', 'presfut_pl3'].map(first),
    past: { m: first('past_m'), f: first('past_f'), n: first('past_n'), pl: first('past_pl') },
  }
}

const header = `/* Archivo generado por scripts/vocab/build-forms.mjs. No editar a mano.
 * Formas con acento (U+0301) de OpenRussian (https://github.com/Badestrand/russian-dictionary),
 * licencia CC BY-SA 4.0. Cada forma es una lista: la primera es la principal y las demás,
 * variantes igualmente válidas.
 */
import type { NounForms, VerbForms } from './formTypes'

`
writeFileSync(
  join(here, '../../src/content/vocab/forms.generated.ts'),
  header +
    `export const NOUN_FORMS: Record<string, NounForms> = ${JSON.stringify(nouns, null, 2)}\n\n` +
    `export const VERB_FORMS: Record<string, VerbForms> = ${JSON.stringify(verbs, null, 2)}\n`,
)
console.log(`${Object.keys(nouns).length} sustantivos y ${Object.keys(verbs).length} verbos.`)
if (problems.length) console.log('Problemas:\n' + problems.join('\n'))
