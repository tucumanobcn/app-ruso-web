/**
 * Genera src/content/vocab/vocab.generated.ts a partir de:
 *  - scripts/vocab/selection.json (palabras elegidas y traducción al español),
 *  - los CSV de OpenRussian (https://github.com/Badestrand/russian-dictionary, CC BY-SA 4.0):
 *    acentos, género, declinación y conjugación,
 *  - la API pública de Tatoeba (https://tatoeba.org, CC BY 2.0 FR): frases de ejemplo
 *    rusas con su traducción al español.
 *
 * Uso: node scripts/vocab/build-vocab.mjs <carpeta-con-los-csv-de-openrussian>
 * Los CSV no se guardan en el repositorio; descárgalos del enlace de arriba.
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

/** «челове'к» → «челове́к». En monosílabos se omite el acento, como en los diccionarios. */
function accent(raw) {
  if (!raw) return ''
  return raw
    .split(/\s*[,;]\s*/)
    .map((word) => {
      const vowels = (word.replace(/'/g, '').match(VOWELS) ?? []).length
      return vowels <= 1 ? word.replace(/'/g, '') : word.replace(/'/g, STRESS)
    })
    .join(', ')
}

const bare = (text) => text.replace(new RegExp(STRESS, 'g'), '').toLowerCase()

function readTsv(name) {
  const [header, ...lines] = readFileSync(join(csvDir, `${name}.csv`), 'utf8').split(/\r?\n/)
  const cols = header.split('\t')
  return lines.filter(Boolean).map((line) => {
    const cells = line.split('\t')
    return Object.fromEntries(cols.map((c, i) => [c, cells[i] ?? '']))
  })
}

const nouns = readTsv('nouns')
const verbs = readTsv('verbs')
const findNoun = (lemma) => nouns.find((n) => n.bare === lemma)
const findVerb = (lemma) => verbs.find((v) => v.bare === lemma)

const CASES = ['nom', 'gen', 'dat', 'acc', 'inst', 'prep']

async function tatoeba(query) {
  const url =
    'https://tatoeba.org/en/api_v0/search?from=rus&to=spa&orphans=no&unapproved=no&sort=relevance&query=' +
    encodeURIComponent(query)
  const response = await fetch(url, { headers: { 'User-Agent': 'app-ruso-vocab-builder' } })
  if (!response.ok) return []
  const json = await response.json()
  return json.results ?? []
}

/** Frase corta que contenga alguna forma de la palabra y tenga traducción directa al español. */
async function findExample(queries, forms, preferred) {
  const skip = new Set(selection.skipExampleIds ?? [])
  const seen = new Map()
  for (const query of queries) {
    for (const result of await tatoeba(query)) seen.set(result.id, result)
    await new Promise((r) => setTimeout(r, 700)) // ser amables con la API
  }
  const candidates = []
  for (const result of seen.values()) {
    if (skip.has(result.id)) continue
    const words = result.text.toLowerCase().split(/[^а-яё-]+/)
    if (!forms.some((form) => words.includes(form))) continue
    const direct = (result.translations?.[0] ?? []).filter((t) => t.lang === 'spa')
    if (direct.length === 0) continue
    const wordCount = words.filter(Boolean).length
    if (wordCount > 9 || wordCount < 3) continue
    if (/["«»]/.test(result.text)) continue
    candidates.push({
      ru: result.text,
      es: direct[0].text,
      ruId: result.id,
      esId: direct[0].id,
      author: result.user?.username ?? null,
      score: wordCount - (preferred && words.includes(preferred) ? 5 : 0),
    })
  }
  candidates.sort((a, b) => a.score - b.score)
  const best = candidates[0]
  if (!best) return null
  delete best.score
  return best
}

const selection = JSON.parse(readFileSync(join(here, 'selection.json'), 'utf8'))
const entries = []
const problems = []

for (const [lessonId, words] of Object.entries(selection.lessons)) {
  for (const word of words) {
    if (word.pos === 'verb') {
      const impf = findVerb(word.lemma)
      const pf = findVerb(word.partner)
      if (!impf || !pf) {
        problems.push(`Verbo no encontrado: ${word.lemma} / ${word.partner}`)
        continue
      }
      if (impf.aspect !== 'imperfective' || pf.aspect !== 'perfective') {
        problems.push(`Aspecto inesperado: ${word.lemma} (${impf.aspect}) / ${word.partner} (${pf.aspect})`)
      }
      const forms = [impf, pf].flatMap((v) =>
        ['presfut_sg1', 'presfut_sg2', 'presfut_sg3', 'presfut_pl1', 'presfut_pl3', 'past_m', 'past_f', 'past_pl']
          .map((k) => bare(accent(v[k]).split(',')[0]))
          .concat(v.bare),
      )
      const example = await findExample([word.lemma, word.partner], [...new Set(forms)], null)
      entries.push({
        id: `${lessonId}:${word.lemma}`,
        lessonId,
        pos: 'verb',
        lemma: word.lemma,
        accented: accent(impf.accented),
        es: word.es,
        en: impf.translations_en,
        verb: {
          perfective: accent(pf.accented),
          imperfectiveForms: {
            ya: accent(impf.presfut_sg1),
            ty: accent(impf.presfut_sg2),
            pastM: accent(impf.past_m),
          },
          perfectiveForms: {
            ya: accent(pf.presfut_sg1),
            ty: accent(pf.presfut_sg2),
            pastM: accent(pf.past_m),
          },
        },
        example,
      })
      continue
    }

    const noun = findNoun(word.lemma)
    if (!noun) {
      problems.push(`Sustantivo no encontrado: ${word.lemma}`)
      continue
    }
    const indeclinable = noun.indeclinable === '1'
    const declension = {}
    for (const number of ['sg', 'pl']) {
      for (const c of CASES) {
        const value = indeclinable ? noun.accented : noun[`${number}_${c}`]
        if (value) declension[`${number}_${c}`] = accent(value)
      }
    }
    const focusForm = declension[word.focus.form]?.split(',')[0]
    if (!focusForm) problems.push(`Sin forma ${word.focus.form} para ${word.lemma}`)
    const allForms = [...new Set(Object.values(declension).flatMap((f) => f.split(', ').map(bare)))]
    const example = word.noExample
      ? null
      : await findExample(
      [word.lemma, bare(focusForm ?? word.lemma)],
      allForms,
      bare(focusForm ?? ''),
    )
    entries.push({
      id: `${lessonId}:${word.lemma}`,
      lessonId,
      pos: 'noun',
      lemma: word.lemma,
      accented: accent(noun.accented),
      es: word.es,
      en: noun.translations_en,
      noun: {
        gender: noun.gender || null,
        animate: noun.animate === '1',
        indeclinable,
        plOnly: noun.pl_only === '1',
        declension,
      },
      focus: {
        caseKey: word.focus.form,
        text: [word.focus.before, focusForm].filter(Boolean).join(' '),
      },
      example,
    })
    console.log(`${word.lemma}: ${focusForm} | ejemplo: ${example ? example.ru : '—'}`)
  }
}

const header = `/* Archivo generado por scripts/vocab/build-vocab.mjs. No editar a mano.
 *
 * Acentos, género, declinaciones y conjugaciones: OpenRussian
 * (https://github.com/Badestrand/russian-dictionary), licencia CC BY-SA 4.0.
 * Frases de ejemplo: Tatoeba (https://tatoeba.org), licencia CC BY 2.0 FR.
 * Traducciones de las palabras al español: elaboración propia.
 * Generado el ${new Date().toISOString().slice(0, 10)}.
 */
import type { VocabEntry } from './types'

export const VOCAB: VocabEntry[] = `

writeFileSync(
  join(here, '../../src/content/vocab/vocab.generated.ts'),
  header + JSON.stringify(entries, null, 2) + '\n',
)
console.log(`\n${entries.length} palabras escritas.`)
if (problems.length) console.log('Problemas:\n' + problems.join('\n'))
