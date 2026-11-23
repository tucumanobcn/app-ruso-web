import type { Lesson } from '../types'

export const repasoCasos1: Lesson = {
  id: 'repaso-casos-1',
  title: 'Repaso mixto: los seis casos',
  level: 'A2',
  topic: 'Repaso mixto',
  type: 'mixta',
  objective:
    'Elegir el caso correcto sin saber de antemano cuál toca, identificando qué lo exige: el verbo, la preposición o la función en la frase.',
  prerequisites: ['Prepositivo', 'Acusativo', 'Genitivo', 'Dativo', 'Instrumental'],
  estimatedMinutes: 9,
  status: 'disponible',
  intro: {
    title: 'Cómo reconocer el caso',
    paragraphs: [
      'Esta lección combina los seis casos sin avisarte de cuál toca. Ante cada hueco, pregúntate qué lo exige: un verbo, una preposición o la función en la frase.',
    ],
    tables: [
      {
        caption: 'Resumen de los casos',
        headers: ['Caso', 'Pregunta', 'Lo exigen, por ejemplo'],
        ruColumns: [1],
        rows: [
          ['Nominativo', 'кто? что?', 'el sujeto; lo que se tiene con есть'],
          ['Genitivo', 'кого? чего?', 'у, из, от, без, нет, 2–4'],
          ['Dativo', 'кому? чему?', 'к, помогать, звонить, нравиться'],
          ['Acusativo', 'кого? что? куда?', 'objeto directo; в / на + dirección'],
          ['Instrumental', 'кем? чем?', 'с, заниматься, интересоваться, работать'],
          ['Prepositivo', 'о ком? о чём? где?', 'о / об; в / на + lugar'],
        ],
      },
    ],
  },
  questions: [
    {
      id: 'rep1-q1',
      kind: 'match',
      skill: 'casos.integracion',
      instruction: 'Relaciona cada palabra con el caso que exige.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'relacion.incorrecta',
      pairs: [
        { id: 'p1', left: 'интересоваться', right: 'Instrumental' },
        { id: 'p2', left: 'помогать', right: 'Dativo' },
        { id: 'p3', left: 'без', right: 'Genitivo' },
        { id: 'p4', left: 'думать о', right: 'Prepositivo' },
        { id: 'p5', left: 'видеть', right: 'Acusativo' },
      ],
      explanation: {
        rule: 'Cada verbo o preposición rige un caso concreto; conviene aprenderlos juntos (помогать кому, без чего).',
        whyCorrect:
          'интересоваться чем (instrumental), помогать кому (dativo), без чего (genitivo), думать о чём (prepositivo), видеть что / кого (acusativo).',
        examples: [
          { ru: 'Я интересуюсь спортом.', es: 'Me interesa el deporte.' },
          { ru: 'Я пью кофе без молока.', es: 'Tomo el café sin leche.' },
        ],
      },
    },
    {
      id: 'rep1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'casos.integracion',
      alsoEvaluates: ['dat.destinatario'],
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я подарил ___ книгу.',
      translation: 'Le regalé un libro a mi hermana.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'сестре' },
        {
          id: 'b',
          text: 'сестру',
          errorType: 'caso.acusativo',
          whyWrong:
            'сестру es acusativo, pero el objeto directo ya es книгу. El destinatario va en dativo.',
        },
        {
          id: 'c',
          text: 'сестры',
          errorType: 'caso.genitivo',
          whyWrong: 'сестры es genitivo («de mi hermana»).',
        },
        {
          id: 'd',
          text: 'сестрой',
          errorType: 'caso.instrumental',
          whyWrong: 'сестрой es instrumental («con mi hermana»).',
        },
      ],
      explanation: {
        rule: 'подарить что (acusativo) кому (dativo).',
        whyCorrect: 'El destinatario va en dativo: сестра → сестре.',
        examples: [
          { ru: 'Я подарил маме цветы.', es: 'Le regalé flores a mamá.' },
          { ru: 'Напиши брату письмо.', es: 'Escríbele una carta a tu hermano.' },
        ],
      },
    },
    {
      id: 'rep1-q3',
      kind: 'choice',
      format: 'completar',
      skill: 'casos.integracion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Мы живём недалеко от ___.',
      translation: 'Vivimos cerca del centro.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'центра' },
        {
          id: 'b',
          text: 'центру',
          errorType: 'caso.dativo',
          whyWrong: 'центру es dativo. от siempre rige genitivo.',
        },
        {
          id: 'c',
          text: 'центре',
          errorType: 'caso.prepositivo',
          whyWrong: 'центре es prepositivo, como en в центре (en el centro).',
        },
        {
          id: 'd',
          text: 'центр',
          errorType: 'caso.nominativo',
          whyWrong: 'центр es nominativo (o acusativo). от rige genitivo.',
        },
      ],
      explanation: {
        rule: 'от + genitivo: procedencia o distancia (недалеко от, далеко от).',
        whyCorrect: 'от rige genitivo: центр → от центра.',
        examples: [
          { ru: 'Я живу далеко от работы.', es: 'Vivo lejos del trabajo.' },
          { ru: 'Это письмо от мамы.', es: 'Esta carta es de mamá.' },
        ],
      },
    },
    {
      id: 'rep1-q4',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'casos.integracion',
      alsoEvaluates: ['dat.k'],
      instruction: 'Elige la opción correcta.',
      prompt: 'Сегодня вечером я иду ___.',
      translation: 'Esta tarde voy a casa de mi amigo.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'к другу' },
        {
          id: 'b',
          text: 'у друга',
          errorType: 'caso.lugar-direccion',
          whyWrong:
            'у друга indica dónde estás (en casa de mi amigo: Я у друга). Para ir hacia allí se usa к + dativo.',
        },
        {
          id: 'c',
          text: 'на друга',
          errorType: 'preposicion.v-na',
          whyWrong:
            'на друга se usa con verbos como смотреть (mirar a): смотреть на друга. No indica ir a casa de alguien.',
        },
      ],
      explanation: {
        rule: '¿Adónde? (persona) → к + dativo. ¿Dónde? (en casa de) → у + genitivo.',
        whyCorrect: 'Para ir a casa de alguien se usa к + dativo: к другу.',
        examples: [
          { ru: 'Я иду к врачу.', es: 'Voy al médico.' },
          { ru: 'Я был у врача.', es: 'Estuve en el médico.' },
        ],
      },
    },
    {
      id: 'rep1-q5',
      kind: 'multi',
      skill: 'casos.integracion',
      instruction: 'Selecciona todas las frases correctas.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        { id: 'a', text: 'Я занимаюсь спортом.', note: 'заниматься + instrumental.' },
        { id: 'b', text: 'У меня нет времени.', note: 'нет + genitivo: времени.' },
        {
          id: 'c',
          text: 'Мне нравится эта песня.',
          note: 'Persona en dativo; lo que gusta, en nominativo.',
        },
        {
          id: 'd',
          text: 'Я думаю о тебя.',
          errorType: 'caso.genitivo-acusativo',
          whyWrong: 'о rige prepositivo: о тебе.',
        },
        {
          id: 'e',
          text: 'Она живёт в Москву.',
          errorType: 'caso.lugar-direccion',
          whyWrong: 'Para decir dónde se vive hace falta el prepositivo: в Москве.',
        },
      ],
      explanation: {
        rule: 'Identifica qué exige cada caso: el verbo, la preposición o la construcción.',
        whyCorrect: 'Las tres primeras frases son correctas; las otras dos usan un caso que no corresponde.',
        examples: [
          { ru: 'Я часто думаю о тебе.', es: 'Pienso a menudo en ti.' },
          { ru: 'Она живёт в Москве.', es: 'Ella vive en Moscú.' },
        ],
      },
    },
    {
      id: 'rep1-q6',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'casos.integracion',
      alsoEvaluates: ['gen.posesion'],
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'd',
      options: [
        {
          id: 'a',
          text: 'Я пишу письмо маме.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Le escribo una carta a mamá»): письмо en acusativo, маме en dativo.',
        },
        {
          id: 'b',
          text: 'Он работает инженером.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Trabaja de ingeniero»): работать + instrumental.',
        },
        {
          id: 'c',
          text: 'Мы говорили о новом фильме.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Hablamos de la nueva película»): о + prepositivo, también en el adjetivo (новом).',
        },
        { id: 'd', text: 'У моей сестры есть собаку.' },
      ],
      explanation: {
        rule: 'Con есть, lo que se tiene es el sujeto y va en nominativo.',
        whyCorrect:
          'La frase errónea es «У моей сестры есть собаку»: собака es el sujeto de есть. Lo correcto es «У моей сестры есть собака».',
        examples: [
          { ru: 'У нас есть кошка.', es: 'Tenemos un gato.' },
          { ru: 'У тебя есть брат?', es: '¿Tienes un hermano?' },
        ],
      },
    },
    {
      id: 'rep1-q7',
      kind: 'order',
      display: 'palabras',
      skill: 'casos.integracion',
      alsoEvaluates: ['dat.destinatario'],
      instruction: 'Ordena las palabras para formar la frase.',
      translation: 'Llamo a mamá todos los días.',
      tokens: ['я', 'звоню', 'маме', 'каждый', 'день'],
      alsoAccepted: [
        ['каждый', 'день', 'я', 'звоню', 'маме'],
        ['я', 'каждый', 'день', 'звоню', 'маме'],
        ['маме', 'я', 'звоню', 'каждый', 'день'],
      ],
      orderNote:
        'Hay varios órdenes válidos: «Каждый день я звоню маме» y «Я каждый день звоню маме» destacan la frecuencia; «Маме я звоню каждый день» pone el foco en a quién llamas.',
      errorType: 'orden.palabras',
      explanation: {
        rule: 'звонить + dativo. Los complementos de tiempo pueden ir al principio, en medio o al final.',
        whyCorrect: 'Я (sujeto) звоню (verbo) маме (dativo) каждый день (tiempo).',
        examples: [
          { ru: 'Я пишу брату каждую неделю.', es: 'Le escribo a mi hermano cada semana.' },
          { ru: 'Каждое утро я гуляю с собакой.', es: 'Cada mañana paseo al perro.' },
        ],
      },
    },
    {
      id: 'rep1-q8',
      kind: 'match',
      skill: 'lex.cotidiano',
      instruction: 'Relaciona cada palabra de la lección con su significado.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'lexico.significado',
      pairs: [
        { id: 'p1', left: 'пода́рок', right: 'regalo' },
        { id: 'p2', left: 'ёлка', right: 'abeto de Año Nuevo' },
        { id: 'p3', left: 'пра́здник', right: 'fiesta' },
        { id: 'p4', left: 'гость', right: 'invitado' },
        { id: 'p5', left: 'тост', right: 'brindis' },
      ],
      explanation: {
        rule: 'Vocabulario de la lección: las fiestas y las visitas.',
        whyCorrect: 'подарок es el regalo; ёлка, el abeto de Año Nuevo; праздник, la fiesta; гость, el invitado, y тост, el brindis.',
        examples: [
          { ru: 'С праздником!', es: '¡Felices fiestas!' },
          { ru: 'Мы ждём гостей.', es: 'Esperamos invitados.' },
        ],
      },
    },
  ],
}
