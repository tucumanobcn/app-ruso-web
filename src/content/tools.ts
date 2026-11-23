/**
 * Herramientas de consulta externas. Cada dirección se comprobó el 23/11/2026
 * (respuesta 200 y título de la página). Las búsquedas de una palabra usan el
 * formato de enlace de cada sitio, comprobado con la palabra «дом».
 */

export const TOOLS_VERIFIED_ON = '2026-11-23'

export interface ReferenceTool {
  id: string
  name: string
  url: string
  /** Para qué sirve, en español. */
  use: string
  /** Idioma de la interfaz o de las explicaciones. */
  language: string
  /** Enlace para buscar una palabra concreta, si el sitio lo permite. */
  lookup?: (word: string) => string
}

export const REFERENCE_TOOLS: ReferenceTool[] = [
  {
    id: 'openrussian',
    name: 'OpenRussian',
    url: 'https://en.openrussian.org/',
    use: 'Acento, declinación completa, conjugación y aspecto de cada palabra. Es la fuente de las formas de esta app.',
    language: 'inglés',
    lookup: (word) => `https://en.openrussian.org/ru/${encodeURIComponent(word)}`,
  },
  {
    id: 'wiktionary-en',
    name: 'Wiktionary (en inglés)',
    url: 'https://en.wiktionary.org/wiki/Category:Russian_language',
    use: 'Tablas de declinación y conjugación, pronunciación y etimología.',
    language: 'inglés',
    lookup: (word) => `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}#Russian`,
  },
  {
    id: 'wiktionary-ru',
    name: 'Викисловарь (Wiktionary en ruso)',
    url: 'https://ru.wiktionary.org/wiki/',
    use: 'Definiciones en ruso, sinónimos y ejemplos de uso: útil a partir de A2–B1.',
    language: 'ruso',
    lookup: (word) => `https://ru.wiktionary.org/wiki/${encodeURIComponent(word)}`,
  },
  {
    id: 'tatoeba',
    name: 'Tatoeba',
    url: 'https://tatoeba.org/es/',
    use: 'Frases reales traducidas por voluntarios, muchas con audio. De aquí salen los ejemplos del vocabulario.',
    language: 'español',
  },
  {
    id: 'dataset',
    name: 'Diccionario de OpenRussian en GitHub',
    url: 'https://github.com/Badestrand/russian-dictionary',
    use: 'Los datos abiertos (CC BY-SA 4.0) con los que se generan las variantes de los ejercicios.',
    language: 'inglés',
  },
]
