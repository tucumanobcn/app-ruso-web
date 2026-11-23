/**
 * Biblioteca de vídeos externos verificados.
 *
 * Cada vídeo se comprobó el 23/11/2026: título y canal con el servicio oEmbed de
 * YouTube, y duración con la página de búsqueda del canal. No hay ningún título,
 * duración ni enlace inventado. Las búsquedas sugeridas (searchUrl) son otra cosa:
 * enlaces a la búsqueda del canal, cuyos resultados no se han revisado.
 */
import type { SkillId } from './glossary'
import type { Level } from './types'

export const RESOURCES_VERIFIED_ON = '2026-11-23'

export interface Channel {
  name: string
  handle: string
  /** Idioma en que se explica la gramática. */
  language: 'inglés' | 'ruso'
}

export const CHANNELS = {
  amazing: { name: 'Amazing Russian', handle: 'AmazingRussian', language: 'inglés' },
  max: { name: 'Russian With Max', handle: 'RussianWithMax', language: 'inglés' },
  orussk: { name: 'О русском по-русски', handle: 'orusskomporusski', language: 'ruso' },
} as const satisfies Record<string, Channel>

export type ChannelId = keyof typeof CHANNELS

export interface VideoResource {
  id: string
  channel: ChannelId
  title: string
  /** Duración tal como la muestra YouTube. */
  duration: string
  level: Level | `${Level}–${Level}`
  /** Tema concreto, en español. */
  topic: string
  /** Por qué se recomienda. */
  reason: string
  /** Conocimientos con los que se relaciona: se sugiere cuando fallas en ellos. */
  skills: SkillId[]
  /** Lecciones en las que aparece. */
  lessons: string[]
}

export function videoUrl(video: VideoResource): string {
  return `https://www.youtube.com/watch?v=${video.id}`
}

/** Búsqueda en el canal (sugerencia sin verificar). */
export function channelSearchUrl(channel: ChannelId, query: string): string {
  return `https://www.youtube.com/@${CHANNELS[channel].handle}/search?query=${encodeURIComponent(query)}`
}

export const VIDEOS: VideoResource[] = [
  // Prepositivo
  {
    id: 'C3AbfBD5_xs',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: Prepositional Case to Show Location. Noun Endings',
    duration: '11:54',
    level: 'A1',
    topic: 'Prepositivo de lugar y sus terminaciones',
    reason: 'Explica paso a paso las terminaciones del prepositivo para decir dónde está algo.',
    skills: ['prep.lugar'],
    lessons: ['prepositivo-1'],
  },
  {
    id: 'kWdoc1c2gdk',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: Prepositional Case With the Preposition ABOUT (О/ОБ)',
    duration: '16:54',
    level: 'A1',
    topic: 'Prepositivo con о / об',
    reason: 'Dedicado a hablar «de» algo o alguien con о / об, incluida la forma обо мне.',
    skills: ['prep.o'],
    lessons: ['prepositivo-1'],
  },
  {
    id: 'ZygRjLKT1tw',
    channel: 'amazing',
    title: 'Basic Russian 3️⃣: Prepositional Case for Location: Words in -У',
    duration: '9:53',
    level: 'A2',
    topic: 'Prepositivo de lugar en -у (в лесу, в саду)',
    reason: 'Aclara el pequeño grupo de sustantivos con -у, la trampa de «в парку».',
    skills: ['prep.lugar'],
    lessons: ['prepositivo-1'],
  },
  {
    id: 'i6HybTu0h3Y',
    channel: 'orussk',
    title: 'Предлоги В, ВО и НА. Предложный падеж || Предлоги',
    duration: '11:48',
    level: 'A2–B1',
    topic: 'в, во y на con prepositivo',
    reason: 'Práctica de comprensión en ruso sobre cuándo usar в o на.',
    skills: ['prep.v-na'],
    lessons: ['prepositivo-1'],
  },

  // Acusativo
  {
    id: 'qaQQUQQ8mO0',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: Accusative Case. Introduction',
    duration: '11:09',
    level: 'A1',
    topic: 'Introducción al acusativo',
    reason: 'Presenta el objeto directo y las terminaciones básicas del acusativo.',
    skills: ['acus.objeto'],
    lessons: ['acusativo-1'],
  },
  {
    id: 'NzAAlCIeZiQ',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Accusative Case of Animate Nouns and Modifiers',
    duration: '11:39',
    level: 'A1–A2',
    topic: 'Acusativo de sustantivos animados',
    reason: 'Centrado en la diferencia animado / inanimado (брата frente a журнал).',
    skills: ['acus.animacion'],
    lessons: ['acusativo-1'],
  },
  {
    id: 'keytbDEJju8',
    channel: 'orussk',
    title: 'Винительный падеж. Существительные. Часть 1 || Падежи',
    duration: '17:24',
    level: 'A2–B1',
    topic: 'Acusativo de los sustantivos',
    reason: 'Repaso del acusativo explicado íntegramente en ruso.',
    skills: ['acus.objeto', 'acus.direccion'],
    lessons: ['acusativo-1'],
  },

  // Genitivo
  {
    id: 'BzXxZ3EFmfA',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Genitive Case to Express Nonexistence and Absence',
    duration: '9:39',
    level: 'A1–A2',
    topic: 'Genitivo con нет',
    reason: 'Justo el uso de «нет + genitivo» para decir que algo no hay o no se tiene.',
    skills: ['gen.negacion'],
    lessons: ['genitivo-1'],
  },
  {
    id: 'sJ0gaNfAC-8',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Genitive Case Singular Nouns: У КОГО ЧТО ЕСТЬ',
    duration: '11:01',
    level: 'A1–A2',
    topic: 'у + genitivo para «tener»',
    reason: 'Explica la construcción у меня есть y los pronombres con н-.',
    skills: ['gen.posesion'],
    lessons: ['genitivo-1'],
  },
  {
    id: 'PfDwyMD24p8',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Genitive Case After Numbers and Expressions of Quantity',
    duration: '10:38',
    level: 'A2',
    topic: 'Genitivo con números y cantidades',
    reason: 'Trata два брата, много, мало y сколько.',
    skills: ['gen.cantidad'],
    lessons: ['genitivo-1'],
  },
  {
    id: 'tCTRZTjOr2M',
    channel: 'orussk',
    title: 'Родительный падеж. Существительные. Часть 1 || Падежи',
    duration: '23:43',
    level: 'A2–B1',
    topic: 'Genitivo de los sustantivos',
    reason: 'Repaso completo del genitivo en ruso, útil también para la escucha.',
    skills: ['gen.negacion', 'gen.posesion', 'gen.ortografia'],
    lessons: ['genitivo-1'],
  },

  // Dativo
  {
    id: 'xRHxCrizxmY',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Dative Case for Indirect Objects. Common Verbs',
    duration: '15:03',
    level: 'A1–A2',
    topic: 'Dativo: destinatario y verbos frecuentes',
    reason: 'Repasa los verbos que rigen dativo, como помогать y звонить.',
    skills: ['dat.destinatario'],
    lessons: ['dativo-1'],
  },
  {
    id: 'e_dnFDF_J7Y',
    channel: 'amazing',
    title: 'Basic Russian 3️⃣: Dative Subjectless Constructions: How Someone Feels',
    duration: '9:33',
    level: 'A2',
    topic: 'Construcciones impersonales con dativo',
    reason: 'Explica мне холодно, мне скучно y frases parecidas.',
    skills: ['dat.impersonal'],
    lessons: ['dativo-1'],
  },
  {
    id: 'XLoQm9hfg_s',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Dative Case to Express Age: Сколько лет?',
    duration: '12:32',
    level: 'A1–A2',
    topic: 'La edad con dativo',
    reason: 'Dedicado a «Мне двадцать лет» y a год / года / лет.',
    skills: ['dat.impersonal'],
    lessons: ['dativo-1'],
  },
  {
    id: '7xKVCrxv9s4',
    channel: 'orussk',
    title: 'Дательный падеж. Существительные. Часть 1 || Падежи',
    duration: '14:11',
    level: 'A2–B1',
    topic: 'Dativo de los sustantivos',
    reason: 'Terminaciones y usos del dativo, explicados en ruso.',
    skills: ['dat.destinatario', 'dat.k'],
    lessons: ['dativo-1'],
  },

  // Instrumental
  {
    id: 'eZVIwjBN9Dc',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Instrumental Case. Preposition WITH: С ЧЕМ? С КАКИМ?',
    duration: '15:50',
    level: 'A1–A2',
    topic: 'с + instrumental',
    reason: 'Justo el uso de с para la compañía y el acompañamiento (чай с лимоном).',
    skills: ['instr.compania'],
    lessons: ['instrumental-1'],
  },
  {
    id: '8-8PmPgDJZQ',
    channel: 'amazing',
    title: 'Basic Russian 4️⃣: Instrumental Case with ЗАНИМАТЬСЯ, УВЛЕКАТЬСЯ, ИНТЕРЕСОВАТЬСЯ',
    duration: '14:35',
    level: 'A2',
    topic: 'Verbos que rigen instrumental',
    reason: 'Trata exactamente los verbos de la lección: заниматься e интересоваться.',
    skills: ['instr.regimen'],
    lessons: ['instrumental-1'],
  },
  {
    id: 'F3yNMfjVd2c',
    channel: 'amazing',
    title: 'Basic Russian 4️⃣: Instrumental Case with РАБОТАТЬ',
    duration: '12:22',
    level: 'A2',
    topic: 'работать + instrumental',
    reason: 'Para decir de qué trabajas: работать врачом.',
    skills: ['instr.profesion'],
    lessons: ['instrumental-1'],
  },
  {
    id: 'trz0j0buahA',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Instrumental Case of Personal Pronouns',
    duration: '8:35',
    level: 'A1–A2',
    topic: 'Pronombres en instrumental',
    reason: 'Las formas мной, тобой, ним… y со мной.',
    skills: ['instr.pronombres'],
    lessons: ['instrumental-1'],
  },
  {
    id: 'VfSGj2C_1UI',
    channel: 'orussk',
    title: 'ЧЕМ или С ЧЕМ? Творительный падеж || Существительные. Падежи',
    duration: '15:17',
    level: 'A2–B1',
    topic: 'Instrumental con y sin с',
    reason: 'Distingue «писать ручкой» de «чай с лимоном», en ruso.',
    skills: ['instr.compania'],
    lessons: ['instrumental-1'],
  },

  // Repaso de casos
  {
    id: 'FLPyE0ITGDk',
    channel: 'orussk',
    title: 'Я не умею использовать падежи и не понимаю их. Что делать?',
    duration: '16:09',
    level: 'A2–B1',
    topic: 'Cómo aprender a usar los casos',
    reason: 'Consejos para dejar de dudar con los casos al hablar.',
    skills: ['casos.integracion'],
    lessons: ['repaso-casos-1'],
  },
  {
    id: 'xNaBC3wU16o',
    channel: 'orussk',
    title: 'Личные местоимения во всех падежах || Местоимения. Падежи.',
    duration: '29:18',
    level: 'A2–B1',
    topic: 'Pronombres personales en todos los casos',
    reason: 'Repaso de меня, мне, мной, обо мне… en una sola sesión.',
    skills: ['casos.integracion', 'instr.pronombres'],
    lessons: ['repaso-casos-1'],
  },

  // Aspecto
  {
    id: '6upG32BeUKU',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Verbal Aspect: Two Past Tenses',
    duration: '16:38',
    level: 'A2',
    topic: 'Aspecto en pasado',
    reason: 'Proceso frente a resultado en pasado (читал / прочитал), el tema de la lección.',
    skills: ['aspecto.pasado'],
    lessons: ['aspecto-1'],
  },
  {
    id: 'CE8aYwTkMv4',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Verbal Aspect: Two Future Tenses',
    duration: '11:42',
    level: 'A2',
    topic: 'Aspecto en futuro',
    reason: 'Explica буду читать frente a прочитаю (y por qué no existe «буду прочитать»).',
    skills: ['aspecto.presente-futuro'],
    lessons: ['aspecto-1'],
  },
  {
    id: 'IVze6V6xAUA',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Verbal Aspect: Formation of Aspectual Pairs',
    duration: '6:25',
    level: 'A2',
    topic: 'Cómo se forman los pares aspectuales',
    reason: 'Prefijos, sufijos y raíces distintas en los pares de verbos.',
    skills: ['aspecto.pares'],
    lessons: ['aspecto-1'],
  },
  {
    id: 'xi8vWNKol3E',
    channel: 'orussk',
    title: 'Урок 2. Буду делать или сделаю? || Глаголы НСВ и СВ. Будущее время.',
    duration: '18:16',
    level: 'A2–B1',
    topic: 'Futuro imperfectivo o perfectivo',
    reason: 'El mismo contraste del futuro, explicado en ruso.',
    skills: ['aspecto.presente-futuro'],
    lessons: ['aspecto-1'],
  },
  {
    id: 'UD2RPMnWWvI',
    channel: 'max',
    title: '12 Real Russian Verb Collocations (With Perfective & Imperfective Examples)',
    duration: '15:02',
    level: 'A2–B1',
    topic: 'Pares aspectuales en expresiones reales',
    reason: 'Ejemplos de uso cotidiano de verbos en los dos aspectos.',
    skills: ['aspecto.pares', 'aspecto.pasado'],
    lessons: ['aspecto-1'],
  },

  // Movimiento
  {
    id: 'cGkq9_8hRm8',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: Verbs of Motion. Going on Foot: ИДТИ-ХОДИТЬ',
    duration: '16:56',
    level: 'A1–A2',
    topic: 'идти y ходить',
    reason: 'Dedicado exactamente al contraste идти / ходить de la lección.',
    skills: ['mov.idti-hodit', 'mov.conjugacion'],
    lessons: ['movimiento-1'],
  },
  {
    id: 'JB8kolZ0ltg',
    channel: 'orussk',
    title: 'Урок 1. ИДТИ - ХОДИТЬ и ЕХАТЬ - ЕЗДИТЬ || Глаголы движения',
    duration: '14:51',
    level: 'A2',
    topic: 'идти / ходить y ехать / ездить',
    reason: 'El mismo tema en ruso, con el siguiente paso: ехать / ездить.',
    skills: ['mov.idti-hodit', 'mov.ehat-ezdit'],
    lessons: ['movimiento-1', 'movimiento-2'],
  },
  {
    id: 'Oaa8irF9adw',
    channel: 'max',
    title: 'Russian Verbs Of Motion In Past Tense Practice | TPRS',
    duration: '8:57',
    level: 'A2',
    topic: 'Verbos de movimiento en pasado',
    reason: 'Práctica de шёл / ходил en pasado mediante una historia.',
    skills: ['mov.idti-hodit'],
    lessons: ['movimiento-1'],
  },
  {
    id: 'ntYhD_poqRE',
    channel: 'max',
    title: 'Russian Verbs Of Motion Exercises | TPRS Lesson with PDF',
    duration: '8:18',
    level: 'A1–A2',
    topic: 'Ejercicios de verbos de movimiento',
    reason: 'Práctica oral guiada con verbos de movimiento básicos.',
    skills: ['mov.idti-hodit', 'mov.conjugacion'],
    lessons: ['movimiento-1'],
  },

  // Cuerpo
  {
    id: 'E128l2l-4L4',
    channel: 'amazing',
    title: 'Basic Russian 4️⃣: Части тела. Body Parts. Vocabulary in Context',
    duration: '16:23',
    level: 'A2',
    topic: 'Partes del cuerpo',
    reason: 'Vocabulario del cuerpo en contexto, el de esta lección.',
    skills: ['lex.cuerpo'],
    lessons: ['cuerpo-1'],
  },
  {
    id: 'SrKsM7-lc3c',
    channel: 'amazing',
    title: 'Basic Russian 4️⃣: Verb БОЛЕТЬ / ЗАБОЛЕТЬ to express “Being Sick” and “It Hurts”',
    duration: '11:10',
    level: 'A2',
    topic: 'у меня болит…',
    reason: 'Explica la construcción para decir qué te duele.',
    skills: ['est.bolet'],
    lessons: ['cuerpo-1'],
  },
  {
    id: 'IA2Jdk6QgVI',
    channel: 'max',
    title: 'Learn Russian - Vocabulary - Feeling sick',
    duration: '14:53',
    level: 'A2',
    topic: 'Vocabulario para cuando estás enfermo',
    reason: 'Frases útiles en el médico o en la farmacia.',
    skills: ['est.bolet', 'lex.cuerpo'],
    lessons: ['cuerpo-1'],
  },

  // Plural (verificados el 23/11/2026)
  {
    id: 'fK_OqJ85kck',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: Plural Forms of Nouns',
    duration: '9:46',
    level: 'A1',
    topic: 'Nominativo plural',
    reason: 'Cómo se forma el plural de los sustantivos (-ы / -и, -а / -я).',
    skills: ['plural.nominativo'],
    lessons: ['casos-plural-1'],
  },
  {
    id: 'jQJCyrLuDFI',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Genitive Plural Forms',
    duration: '16:21',
    level: 'A2',
    topic: 'Genitivo plural',
    reason: 'Dedicado entero al genitivo plural, lo más difícil del plural.',
    skills: ['plural.genitivo'],
    lessons: ['casos-plural-1'],
  },
  {
    id: 'FMU1pFnv6qE',
    channel: 'orussk',
    title: 'Множественное число. Существительные || Число: единственное и множественное',
    duration: '18:33',
    level: 'A2–B1',
    topic: 'Plural de los sustantivos',
    reason: 'El nominativo plural explicado en ruso, con los casos irregulares.',
    skills: ['plural.nominativo'],
    lessons: ['casos-plural-1'],
  },
  {
    id: '0P9fPYhJtWo',
    channel: 'orussk',
    title: 'Родительный падеж. Множественное число || Существительные. Падежи',
    duration: '24:40',
    level: 'A2–B1',
    topic: 'Genitivo plural',
    reason: 'Repaso completo del genitivo plural en ruso.',
    skills: ['plural.genitivo'],
    lessons: ['casos-plural-1'],
  },
  {
    id: 'E9nC0NAiNsM',
    channel: 'orussk',
    title: 'Урок 3. Винительный падеж. Множественное число || Существительные. Падежи.',
    duration: '25:11',
    level: 'A2–B1',
    topic: 'Acusativo plural',
    reason: 'Acusativo plural de animados e inanimados, en ruso.',
    skills: ['plural.acusativo'],
    lessons: ['casos-plural-1'],
  },
  {
    id: 'LCkYbgfO87k',
    channel: 'orussk',
    title: 'Дательный падеж. Множественное число || Существительные. Падежи.',
    duration: '13:34',
    level: 'A2–B1',
    topic: 'Dativo plural',
    reason: 'Las terminaciones -ам / -ям con ejemplos, en ruso.',
    skills: ['plural.oblicuos'],
    lessons: ['casos-plural-1'],
  },
  {
    id: '5hINZsAf8vk',
    channel: 'orussk',
    title: 'Творительный падеж. Множественное число || Существительные. Падежи.',
    duration: '11:55',
    level: 'A2–B1',
    topic: 'Instrumental plural',
    reason: 'Las terminaciones -ами / -ями con ejemplos, en ruso.',
    skills: ['plural.oblicuos'],
    lessons: ['casos-plural-1'],
  },

  // ехать / ездить
  {
    id: 'yfjcH7Nnn90',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: Verbs of Motion. Going by Transport: ЕХАТЬ-ЕЗДИТЬ',
    duration: '14:19',
    level: 'A1–A2',
    topic: 'ехать y ездить',
    reason: 'Dedicado exactamente al contraste ехать / ездить de la lección.',
    skills: ['mov.ehat-ezdit', 'mov.transporte', 'mov.conjugacion'],
    lessons: ['movimiento-2'],
  },

  // Presentarse
  {
    id: '_47FHz6GcwE',
    channel: 'orussk',
    title: 'Диалог 1. ЗНАКОМСТВО || Диалоги',
    duration: '10:10',
    level: 'A1–A2',
    topic: 'Diálogo: conocerse',
    reason: 'Un diálogo real de presentación, para escuchar las frases de la lección.',
    skills: ['com.presentarse'],
    lessons: ['comunicacion-1'],
  },
  {
    id: 'R0YagbmLU8A',
    channel: 'orussk',
    title: 'Тема 1. О СЕБЕ || Давайте говорить + КОНКУРС',
    duration: '10:51',
    level: 'A2',
    topic: 'Hablar de uno mismo',
    reason: 'Cómo contar quién eres, en ruso sencillo.',
    skills: ['com.presentarse'],
    lessons: ['comunicacion-1'],
  },
  {
    id: 'e-FBpLauVoA',
    channel: 'amazing',
    title: 'Basic Russian 1️⃣: What is in a Russian Name? (Old Version)',
    duration: '10:52',
    level: 'A1',
    topic: 'Nombres rusos: имя, отчество, фамилия',
    reason: 'Explica el nombre, el patronímico y el apellido rusos.',
    skills: ['com.presentarse', 'lex.cotidiano'],
    lessons: ['comunicacion-1'],
  },

  // Compras
  {
    id: '5epHCOYnRBY',
    channel: 'orussk',
    title: 'Диалог 2. В СУПЕРМАРКЕТЕ И В МАГАЗИНЕ || Диалоги',
    duration: '16:00',
    level: 'A2',
    topic: 'Diálogo: en el supermercado',
    reason: 'Las frases de la lección en un diálogo real de compras.',
    skills: ['com.compras'],
    lessons: ['compras-1'],
  },
  {
    id: 'c-NfdXUtVjU',
    channel: 'max',
    title: 'Grocery Shopping in Russian – Real-Life Vocabulary Practice',
    duration: '15:53',
    level: 'A2',
    topic: 'Vocabulario de la compra',
    reason: 'Vocabulario de supermercado en situaciones reales.',
    skills: ['com.compras'],
    lessons: ['compras-1'],
  },
  {
    id: 'layYJR94oa8',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: What I Bought in a “Russian” Store | RUS CC',
    duration: '7:31',
    level: 'A2',
    topic: 'Productos de una tienda rusa',
    reason: 'Comprensión oral breve sobre productos y cantidades.',
    skills: ['com.compras', 'lex.cotidiano'],
    lessons: ['compras-1'],
  },
  {
    id: '2EWAo0VsDSY',
    channel: 'amazing',
    title: 'Basic Russian 2️⃣: Grocery Shopping Online | Покупаем продукты онлайн',
    duration: '13:45',
    level: 'A2',
    topic: 'Comprar comida',
    reason: 'Cantidades y productos (genitivo) al hacer la compra.',
    skills: ['com.compras'],
    lessons: ['compras-1'],
  },
]

export function videosForLesson(lessonId: string): VideoResource[] {
  return VIDEOS.filter((video) => video.lessons.includes(lessonId))
}

/** Vídeos para los conocimientos indicados, sin repetir, primero los más específicos. */
export function videosForSkills(skills: SkillId[], limit = 3): VideoResource[] {
  return VIDEOS.filter((video) => video.skills.some((skill) => skills.includes(skill)))
    .sort((a, b) => a.skills.length - b.skills.length)
    .slice(0, limit)
}
