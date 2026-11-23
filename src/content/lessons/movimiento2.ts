import type { Lesson } from '../types'

export const movimiento2: Lesson = {
  id: 'movimiento-2',
  title: 'Ехать y ездить',
  level: 'A2',
  topic: 'Verbos de movimiento',
  type: 'monografica',
  objective:
    'Distinguir ехать (en transporte, una dirección) de ездить (costumbre, ida y vuelta), conjugarlos y decir el medio de transporte con на + prepositivo.',
  prerequisites: ['идти y ходить', 'Prepositivo de lugar'],
  estimatedMinutes: 10,
  status: 'disponible',
  intro: {
    title: 'ехать y ездить en dos minutos',
    illustration: 'mov-ehat-ezdit',
    paragraphs: [
      'Para ir en un vehículo (coche, autobús, tren, metro) se usan ехать y ездить, con la misma lógica que идти y ходить.',
      'ехать: un trayecto concreto en una dirección, ahora o en un momento determinado, y también un viaje ya planeado (Завтра я еду в Москву). ездить: costumbre o repetición (Я езжу на работу на метро) e ida y vuelta en pasado (Летом я ездил в Испанию).',
      'El medio de transporte va con на + prepositivo: на автобусе, на машине, на поезде. на метро y на такси no cambian. En avión se usan otros verbos: лететь / летать на самолёте.',
    ],
    tables: [
      {
        caption: 'Conjugación (acentos según OpenRussian)',
        headers: ['Persona', 'ехать', 'ездить'],
        ruColumns: [1, 2],
        rows: [
          ['я', 'е́ду', 'е́зжу'],
          ['ты', 'е́дешь', 'е́здишь'],
          ['он, она', 'е́дет', 'е́здит'],
          ['мы', 'е́дем', 'е́здим'],
          ['вы', 'е́дете', 'е́здите'],
          ['они', 'е́дут', 'е́здят'],
          ['Pasado', 'е́хал, е́хала, е́хали', 'е́здил, е́здила, е́здили'],
        ],
        note: 'Ojo a la alternancia д → жд → зж: е́здить, pero я е́зжу.',
      },
    ],
  },
  questions: [
    {
      id: 'mov2-q1',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'mov.ehat-ezdit',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Я сейчас ___ на работу на автобусе.',
      translation: 'Ahora voy al trabajo en autobús.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'еду' },
        {
          id: 'b',
          text: 'езжу',
          errorType: 'movimiento.uni-multi',
          whyWrong: 'езжу expresa una costumbre. сейчас indica un trayecto concreto ahora, en una dirección: еду.',
        },
        {
          id: 'c',
          text: 'иду',
          errorType: 'movimiento.pie-transporte',
          whyWrong: 'иду es ir a pie. Con un vehículo (на автобусе) se usa ехать.',
        },
        {
          id: 'd',
          text: 'хожу',
          errorType: 'movimiento.pie-transporte',
          whyWrong: 'хожу es ir a pie y, además, de forma habitual. Aquí es en autobús y ahora: еду.',
        },
      ],
      explanation: {
        rule: 'Transporte + una dirección, ahora → ехать.',
        whyCorrect: 'Vas en autobús (transporte) y ahora (una dirección): еду.',
        examples: [
          { ru: 'Мы едем домой на такси.', es: 'Vamos a casa en taxi.' },
          { ru: 'Куда ты едешь?', es: '¿Adónde vas (en coche, en autobús…)?' },
        ],
      },
    },
    {
      id: 'mov2-q2',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'mov.ehat-ezdit',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Каждое лето мы ___ на море.',
      translation: 'Cada verano vamos al mar.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'ездим' },
        {
          id: 'b',
          text: 'едем',
          errorType: 'movimiento.uni-multi',
          whyWrong:
            'Para la costumbre (каждое лето) se usa ездить. (Para un viaje concreto ya planeado sí se diría «Этим летом мы едем на море».)',
        },
        {
          id: 'c',
          text: 'ходим',
          errorType: 'movimiento.pie-transporte',
          whyWrong: 'ходить es ir a pie; un viaje al mar se hace en transporte: ездить.',
        },
        {
          id: 'd',
          text: 'идём',
          errorType: 'movimiento.pie-transporte',
          whyWrong: 'идти es ir a pie y en una dirección; aquí es una costumbre en transporte.',
        },
      ],
      explanation: {
        rule: 'Costumbre o repetición en transporte → ездить.',
        whyCorrect: 'каждое лето indica una costumbre: ездим.',
        examples: [
          { ru: 'Я езжу на работу на метро.', es: 'Voy al trabajo en metro.' },
          { ru: 'Она часто ездит к родителям.', es: 'Va a menudo a casa de sus padres.' },
        ],
      },
    },
    {
      id: 'mov2-q3',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'mov.ehat-ezdit',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'В прошлом году я ___ в Испанию.',
      translation: 'El año pasado fui a España (y volví).',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'ездил' },
        {
          id: 'b',
          text: 'ехал',
          errorType: 'movimiento.ida-vuelta',
          whyWrong:
            'ехал describe el trayecto en curso («iba»), por ejemplo: «Я ехал в аэропорт, когда позвонила мама». Para un viaje completo de ida y vuelta, ездил.',
        },
      ],
      explanation: {
        rule: 'ездить en pasado = viaje de ida y vuelta ya completado.',
        whyCorrect: 'Fuiste y volviste: ездил.',
        examples: [
          { ru: 'Летом они ездили на Байкал.', es: 'En verano fueron al Baikal.' },
          { ru: 'Мы ехали домой, когда пошёл дождь.', es: 'Íbamos a casa cuando empezó a llover.' },
        ],
      },
    },
    {
      id: 'mov2-q4',
      kind: 'choice',
      format: 'completar',
      skill: 'mov.conjugacion',
      alsoEvaluates: ['mov.ehat-ezdit'],
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Сейчас они ___ на дачу на электричке.',
      translation: 'Ahora van a la dacha en el tren de cercanías.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'едут' },
        {
          id: 'b',
          text: 'едет',
          errorType: 'conjugacion.forma',
          whyWrong: 'едет es la forma de «он / она». Con они hace falta едут.',
        },
        {
          id: 'c',
          text: 'ездят',
          errorType: 'movimiento.uni-multi',
          whyWrong: 'ездят expresaría la costumbre. Сейчас indica un trayecto concreto: едут.',
        },
        {
          id: 'd',
          text: 'ехать',
          errorType: 'conjugacion.forma',
          whyWrong: 'ехать es el infinitivo; hace falta la forma conjugada.',
        },
      ],
      explanation: {
        rule: 'ехать: еду, едешь, едет, едем, едете, едут.',
        whyCorrect: 'Sujeto они y trayecto concreto ahora: едут.',
        examples: [
          { ru: 'Вы едете с нами?', es: '¿Venís con nosotros?' },
          { ru: 'Я еду в аэропорт.', es: 'Voy al aeropuerto.' },
        ],
      },
    },
    {
      id: 'mov2-q5',
      kind: 'choice',
      format: 'completar',
      skill: 'mov.transporte',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я езжу на работу на ___.',
      translation: 'Voy al trabajo en autobús.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'автобусе' },
        {
          id: 'b',
          text: 'автобус',
          errorType: 'caso.lugar-direccion',
          whyWrong: 'на автобус (acusativo) indica adónde vas: «опоздать на автобус» (perder el autobús). El medio de transporte va en prepositivo.',
        },
        {
          id: 'c',
          text: 'автобуса',
          errorType: 'caso.genitivo',
          whyWrong: 'автобуса es genitivo.',
        },
        {
          id: 'd',
          text: 'автобусу',
          errorType: 'caso.dativo',
          whyWrong: 'автобусу es dativo.',
        },
      ],
      explanation: {
        rule: 'Medio de transporte: на + prepositivo (на автобусе, на поезде, на машине).',
        whyCorrect: 'на + prepositivo: автобус → на автобусе.',
        examples: [
          { ru: 'Мы поедем на поезде.', es: 'Iremos en tren.' },
          { ru: 'Я езжу на трамвае.', es: 'Voy en tranvía.' },
        ],
      },
    },
    {
      id: 'mov2-q6',
      kind: 'choice',
      format: 'verdadero-falso',
      skill: 'mov.ehat-ezdit',
      instruction:
        'Verdadero o falso: «Вчера я ездил к бабушке» significa que ayer fui (en transporte) a casa de mi abuela y ya volví.',
      optionsLang: 'es',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Verdadero' },
        {
          id: 'b',
          text: 'Falso',
          errorType: 'movimiento.ida-vuelta',
          whyWrong: 'ездил en pasado describe un viaje completo de ida y vuelta: fuiste y volviste.',
        },
      ],
      explanation: {
        rule: 'ездить en pasado = ida y vuelta.',
        whyCorrect: 'Es verdadero: «Я ездил к бабушке» equivale a «Я был у бабушки».',
        examples: [
          { ru: 'Я ездил к бабушке.', es: 'Fui a casa de mi abuela.' },
          { ru: 'Я был у бабушки.', es: 'Estuve en casa de mi abuela.' },
        ],
      },
    },
    {
      id: 'mov2-q7',
      kind: 'multi',
      skill: 'mov.ehat-ezdit',
      instruction: 'Selecciona todas las frases correctas.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        {
          id: 'a',
          text: 'Завтра я еду в Москву.',
          note: 'para un viaje concreto ya planeado se usa el presente de ехать.',
        },
        {
          id: 'b',
          text: 'Мой брат часто ездит в командировки.',
          note: 'costumbre → ездить (командировка: viaje de trabajo).',
        },
        {
          id: 'c',
          text: 'Смотри, вон едет трамвай!',
          note: 'vehículo que circula en una dirección, ahora → ехать.',
        },
        {
          id: 'd',
          text: 'Сейчас я езжу в магазин.',
          errorType: 'movimiento.uni-multi',
          whyWrong: 'сейчас con un destino concreto describe un trayecto en una dirección: Сейчас я еду в магазин.',
        },
        {
          id: 'e',
          text: 'Я иду в аэропорт на такси.',
          errorType: 'movimiento.pie-transporte',
          whyWrong: 'Con transporte (на такси) se usa ехать: Я еду в аэропорт на такси.',
        },
      ],
      explanation: {
        rule: 'ехать: una dirección (ahora o un viaje planeado). ездить: costumbre, ida y vuelta. Sin vehículo: идти / ходить.',
        whyCorrect: 'Las tres primeras frases usan bien cada verbo.',
        examples: [
          { ru: 'Сейчас я еду в магазин.', es: 'Ahora voy a la tienda.' },
          { ru: 'Я еду в аэропорт на такси.', es: 'Voy al aeropuerto en taxi.' },
        ],
      },
    },
    {
      id: 'mov2-q8',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'mov.ehat-ezdit',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'Мы едем домой на такси.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Vamos a casa en taxi»): trayecto concreto en transporte.',
        },
        {
          id: 'b',
          text: 'Летом они ездили на Байкал.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («En verano fueron al Baikal»): ida y vuelta en pasado.',
        },
        { id: 'c', text: 'Я хожу на работу на машине.' },
        {
          id: 'd',
          text: 'Куда вы едете?',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («¿Adónde vais?»): trayecto concreto en transporte.',
        },
      ],
      explanation: {
        rule: 'Con un vehículo (на машине) se usa ехать / ездить, no идти / ходить.',
        whyCorrect: 'La frase errónea es «Я хожу на работу на машине»: si vas en coche, «Я езжу на работу на машине».',
        examples: [
          { ru: 'Я езжу на работу на машине.', es: 'Voy al trabajo en coche.' },
          { ru: 'Я хожу на работу пешком.', es: 'Voy al trabajo a pie.' },
        ],
      },
    },
    {
      id: 'mov2-q9',
      kind: 'match',
      skill: 'lex.cotidiano',
      instruction: 'Relaciona cada palabra de la lección con su significado.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'lexico.significado',
      pairs: [
        { id: 'p1', left: 'авто́бус', right: 'autobús' },
        { id: 'p2', left: 'по́езд', right: 'tren' },
        { id: 'p3', left: 'самолёт', right: 'avión' },
        { id: 'p4', left: 'такси́', right: 'taxi' },
        { id: 'p5', left: 'трамва́й', right: 'tranvía' },
      ],
      explanation: {
        rule: 'Vocabulario de la lección: medios de transporte.',
        whyCorrect: 'автобус es el autobús; поезд, el tren; самолёт, el avión; такси, el taxi, y трамвай, el tranvía.',
        examples: [
          { ru: 'Мы поедем на поезде.', es: 'Iremos en tren.' },
          { ru: 'Я полечу на самолёте.', es: 'Iré en avión.' },
        ],
      },
    },
  ],
}
