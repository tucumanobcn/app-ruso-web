import type { Lesson } from '../types'

export const cuerpo1: Lesson = {
  id: 'cuerpo-1',
  title: 'El cuerpo: части тела',
  level: 'A1',
  topic: 'Vocabulario y comunicación',
  type: 'monografica',
  objective:
    'Nombrar las partes del cuerpo, con sus plurales irregulares, y decir qué te duele con «у меня болит / болят».',
  prerequisites: ['Nominativo singular y plural', 'у + genitivo (у меня)'],
  estimatedMinutes: 8,
  status: 'disponible',
  intro: {
    title: 'Части тела en dos minutos',
    illustration: 'cuerpo',
    paragraphs: [
      'Para decir qué te duele, el ruso usa у меня + болит + la parte del cuerpo en nominativo: У меня болит голова (Me duele la cabeza).',
      'Si duele más de una cosa, el verbo va en plural: У меня болят ноги. Ojo con los plurales irregulares: глаз → глаза́, у́хо → у́ши.',
      'рука́ significa a la vez «mano» y «brazo», y нога́, «pierna» y «pie»: el contexto lo aclara.',
    ],
    tables: [
      {
        caption: 'Singular y plural (acentos según OpenRussian)',
        headers: ['Español', 'Singular', 'Plural'],
        ruColumns: [1, 2],
        rows: [
          ['cabeza', 'голова́', 'го́ловы'],
          ['ojo', 'глаз', 'глаза́'],
          ['oreja, oído', 'у́хо', 'у́ши'],
          ['nariz', 'нос', 'носы́'],
          ['mano, brazo', 'рука́', 'ру́ки'],
          ['pierna, pie', 'нога́', 'но́ги'],
          ['diente', 'зуб', 'зу́бы'],
        ],
        note: 'El acento cambia de sitio en varios plurales: голова́ → го́ловы, рука́ → ру́ки, нога́ → но́ги.',
      },
    ],
  },
  questions: [
    {
      id: 'cuer1-q1',
      kind: 'match',
      skill: 'lex.cuerpo',
      instruction: 'Relaciona cada parte del cuerpo con su significado.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'lexico.significado',
      pairs: [
        { id: 'p1', left: 'голова́', right: 'cabeza' },
        { id: 'p2', left: 'глаз', right: 'ojo' },
        { id: 'p3', left: 'у́хо', right: 'oreja' },
        { id: 'p4', left: 'нос', right: 'nariz' },
        { id: 'p5', left: 'рот', right: 'boca' },
      ],
      explanation: {
        rule: 'Vocabulario básico de la cabeza y la cara.',
        whyCorrect: 'голова es la cabeza; глаз, el ojo; ухо, la oreja; нос, la nariz, y рот, la boca.',
        examples: [
          { ru: 'Открой, пожалуйста, рот.', es: 'Abre la boca, por favor.' },
          { ru: 'У неё голубые глаза.', es: 'Ella tiene los ojos azules.' },
        ],
      },
    },
    {
      id: 'cuer1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'est.bolet',
      alsoEvaluates: ['lex.cuerpo'],
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'У меня болит ___.',
      translation: 'Me duele la cabeza.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'голова' },
        {
          id: 'b',
          text: 'голову',
          errorType: 'caso.acusativo',
          whyWrong:
            'голову es acusativo. En «у меня болит…», lo que duele es el sujeto, así que va en nominativo.',
        },
        {
          id: 'c',
          text: 'головы',
          errorType: 'caso.genitivo',
          whyWrong:
            'головы es genitivo singular (o nominativo plural, que pediría el verbo en plural: болят).',
        },
        {
          id: 'd',
          text: 'голове',
          errorType: 'caso.otro-oblicuo',
          whyWrong: 'голове es dativo o prepositivo.',
        },
      ],
      explanation: {
        rule: 'у + genitivo (la persona) + болит / болят + nominativo (lo que duele).',
        whyCorrect: 'голова es el sujeto de болит, así que va en nominativo: У меня болит голова.',
        examples: [
          { ru: 'У меня болит живот.', es: 'Me duele la barriga.' },
          { ru: 'У тебя болит спина?', es: '¿Te duele la espalda?' },
        ],
      },
    },
    {
      id: 'cuer1-q3',
      kind: 'choice',
      format: 'completar',
      skill: 'est.bolet',
      alsoEvaluates: ['lex.cuerpo'],
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'После марафона у меня болят ___.',
      translation: 'Después del maratón me duelen las piernas.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'ноги' },
        {
          id: 'b',
          text: 'нога',
          errorType: 'concordancia.numero',
          whyWrong:
            'нога es singular, pero el verbo está en plural (болят). Con una sola pierna sería «у меня болит нога».',
        },
        {
          id: 'c',
          text: 'ног',
          errorType: 'caso.genitivo',
          whyWrong: 'ног es genitivo plural, como en «много ног». Lo que duele va en nominativo.',
        },
        {
          id: 'd',
          text: 'ногами',
          errorType: 'caso.instrumental',
          whyWrong: 'ногами es instrumental plural («con los pies»).',
        },
      ],
      explanation: {
        rule: 'болит con un sujeto singular; болят con uno plural.',
        whyCorrect: 'болят está en plural, así que el sujeto va en nominativo plural: нога → ноги.',
        examples: [
          { ru: 'У него болят зубы.', es: 'Le duelen los dientes.' },
          { ru: 'У меня болит нога.', es: 'Me duele la pierna.' },
        ],
      },
    },
    {
      id: 'cuer1-q4',
      kind: 'choice',
      format: 'verdadero-falso',
      skill: 'lex.cuerpo',
      instruction: 'Verdadero o falso: en ruso, рука puede significar tanto «mano» como «brazo».',
      optionsLang: 'es',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Verdadero' },
        {
          id: 'b',
          text: 'Falso',
          errorType: 'lexico.significado',
          whyWrong:
            'Es verdadero: рука designa la mano y el brazo, y el contexto aclara cuál. Lo mismo pasa con нога (pierna y pie).',
        },
      ],
      explanation: {
        rule: 'рука = mano y brazo; нога = pierna y pie.',
        whyCorrect:
          'Es verdadero. Si hace falta precisar existen кисть (mano) y стопа (pie), pero en el día a día se usan рука y нога.',
        examples: [
          { ru: 'Дай мне руку.', es: 'Dame la mano.' },
          { ru: 'Я сломал руку.', es: 'Me he roto el brazo.' },
        ],
      },
    },
    {
      id: 'cuer1-q5',
      kind: 'multi',
      skill: 'lex.cuerpo',
      instruction: '¿Qué palabras nombran partes de la cara (лицо)? Selecciona todas.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        { id: 'a', text: 'нос', note: 'la nariz.' },
        { id: 'b', text: 'рот', note: 'la boca.' },
        { id: 'c', text: 'глаз', note: 'el ojo.' },
        {
          id: 'd',
          text: 'спина',
          errorType: 'lexico.significado',
          whyWrong: 'спина es la espalda.',
        },
        {
          id: 'e',
          text: 'живот',
          errorType: 'lexico.significado',
          whyWrong: 'живот es la barriga.',
        },
        {
          id: 'f',
          text: 'нога',
          errorType: 'lexico.significado',
          whyWrong: 'нога es la pierna o el pie.',
        },
      ],
      explanation: {
        rule: 'En la cara (лицо): глаза, нос, рот.',
        whyCorrect: 'нос, рот y глаз están en la cara; спина, живот y нога, no.',
        examples: [
          { ru: 'У него большой нос.', es: 'Tiene la nariz grande.' },
          { ru: 'Закрой глаза.', es: 'Cierra los ojos.' },
        ],
      },
    },
    {
      id: 'cuer1-q6',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'est.bolet',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'У меня болит живот.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Me duele la barriga»): живот va en nominativo.',
        },
        {
          id: 'b',
          text: 'У него болит зуб.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Le duele una muela»): зуб, sujeto en nominativo.',
        },
        { id: 'c', text: 'У меня болит голову.' },
        {
          id: 'd',
          text: 'У неё болят уши.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Le duelen los oídos»): уши es el plural irregular de ухо y lleva el verbo en plural.',
        },
      ],
      explanation: {
        rule: 'Lo que duele es el sujeto y va en nominativo.',
        whyCorrect:
          'La frase errónea es «У меня болит голову»: голову es acusativo. Lo correcto es «У меня болит голова».',
        examples: [
          { ru: 'У меня болит голова.', es: 'Me duele la cabeza.' },
          { ru: 'У ребёнка болят уши.', es: 'Al niño le duelen los oídos.' },
        ],
      },
    },
    {
      id: 'cuer1-q7',
      kind: 'order',
      display: 'palabras',
      skill: 'est.bolet',
      instruction: 'Ordena las palabras para formar la frase.',
      translation: 'Me duele la espalda.',
      tokens: ['у', 'меня', 'болит', 'спина'],
      alsoAccepted: [
        ['у', 'меня', 'спина', 'болит'],
        ['спина', 'у', 'меня', 'болит'],
      ],
      orderNote:
        '«У меня спина болит» es muy frecuente en la conversación; «Спина у меня болит» pone el foco en la espalda.',
      errorType: 'orden.palabras',
      explanation: {
        rule: 'у меня + болит + lo que duele. El orden neutro deja lo que duele al final.',
        whyCorrect: 'У меня (a mí) болит (duele) спина (la espalda).',
        examples: [
          { ru: 'У меня болит горло.', es: 'Me duele la garganta.' },
          { ru: 'У тебя что-нибудь болит?', es: '¿Te duele algo?' },
        ],
      },
    },
  ],
}
