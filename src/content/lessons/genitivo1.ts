import type { Lesson } from '../types'

export const genitivo1: Lesson = {
  id: 'genitivo-1',
  title: 'El genitivo: tener, no tener y cantidades',
  level: 'A2',
  topic: 'Casos gramaticales',
  type: 'monografica',
  objective:
    'Usar el genitivo singular con нет, con у para expresar posesión, tras 2, 3, 4 y con много / мало, respetando la ortografía -ы / -и.',
  prerequisites: ['Nominativo singular y género de los sustantivos', 'Pronombres personales en nominativo'],
  estimatedMinutes: 9,
  status: 'disponible',
  intro: {
    title: 'El genitivo en dos minutos',
    illustration: 'gen-net',
    paragraphs: [
      'El genitivo responde a кого? чего? Lo usarás para «no hay / no tengo» (нет + genitivo), para la posesión (машина брата), con у para «tener» (у меня есть) y con cantidades y números (два брата, много работы).',
      'También lo piden muchas preposiciones: у, из, от, до, без, для, после, около.',
    ],
    tables: [
      {
        caption: 'Terminaciones del singular',
        headers: ['Tipo', 'Nominativo', 'Genitivo', 'Terminación'],
        ruColumns: [1, 2, 3],
        rows: [
          ['Masculino en consonante', 'брат, стол', 'брата, стола', '-а'],
          ['Masculino en -й, -ь', 'музей, учитель', 'музея, учителя', '-я'],
          ['Neutro', 'окно, море', 'окна, моря', '-а / -я'],
          ['Femenino en -а', 'мама, машина', 'мамы, машины', '-ы'],
          ['Femenino en -я, -ь', 'неделя, дверь', 'недели, двери', '-и'],
        ],
        note: 'Tras г, к, х, ж, ш, ч, щ se escribe -и, nunca -ы: книга → книги, ручка → ручки.',
      },
      {
        caption: 'Pronombres con у («tener»)',
        headers: ['Nominativo', 'Genitivo', 'Con у'],
        ruColumns: [0, 1, 2],
        rows: [
          ['я', 'меня', 'у меня'],
          ['ты', 'тебя', 'у тебя'],
          ['он', 'его', 'у него'],
          ['она', 'её', 'у неё'],
          ['мы', 'нас', 'у нас'],
          ['вы', 'вас', 'у вас'],
          ['они', 'их', 'у них'],
        ],
        note: 'Tras preposición, los pronombres de tercera persona añaden н-: у него, у неё, у них.',
      },
    ],
  },
  questions: [
    {
      id: 'gen1-q1',
      kind: 'choice',
      format: 'completar',
      skill: 'gen.negacion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'У меня нет ___.',
      translation: 'No tengo coche.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'машины' },
        {
          id: 'b',
          text: 'машина',
          errorType: 'caso.nominativo',
          whyWrong:
            'Con есть lo que se tiene va en nominativo (У меня есть машина), pero con нет pasa siempre a genitivo.',
        },
        {
          id: 'c',
          text: 'машину',
          errorType: 'caso.acusativo',
          whyWrong: 'машину es acusativo. нет no rige acusativo, sino genitivo.',
        },
        {
          id: 'd',
          text: 'машине',
          errorType: 'caso.otro-oblicuo',
          whyWrong: 'машине es dativo o prepositivo.',
        },
      ],
      explanation: {
        rule: 'нет + genitivo: lo que falta o no existe va en genitivo.',
        whyCorrect: 'машина es femenino en -а: genitivo машины. У меня нет машины.',
        examples: [
          { ru: 'У нас нет времени.', es: 'No tenemos tiempo.' },
          { ru: 'Сегодня нет урока.', es: 'Hoy no hay clase.' },
        ],
      },
    },
    {
      id: 'gen1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'gen.posesion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'У ___ есть сестра.',
      translation: 'Él tiene una hermana.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'него' },
        {
          id: 'b',
          text: 'его',
          errorType: 'pronombre.n',
          whyWrong:
            'его es el genitivo de он, pero tras preposición (у) los pronombres de tercera persona añaden н-: у него.',
        },
        {
          id: 'c',
          text: 'ему',
          errorType: 'caso.dativo',
          whyWrong: 'ему es dativo. у siempre rige genitivo.',
        },
        {
          id: 'd',
          text: 'он',
          errorType: 'caso.nominativo',
          whyWrong: 'он es nominativo. En ruso, «tener» se dice con у + genitivo.',
        },
      ],
      explanation: {
        rule: 'у + genitivo + есть = tener. Tras preposición: у него, у неё, у них.',
        whyCorrect: 'у rige genitivo; el genitivo de он es его, que tras preposición pasa a него: у него.',
        examples: [
          { ru: 'У неё есть собака.', es: 'Ella tiene un perro.' },
          { ru: 'У них большая квартира.', es: 'Ellos tienen un piso grande.' },
        ],
      },
    },
    {
      id: 'gen1-q3',
      kind: 'choice',
      format: 'completar',
      skill: 'gen.posesion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Это машина ___.',
      translation: 'Es el coche de Antón.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Антона' },
        {
          id: 'b',
          text: 'Антон',
          errorType: 'caso.nominativo',
          whyWrong: 'Антон es nominativo. El poseedor va en genitivo detrás de lo poseído.',
        },
        {
          id: 'c',
          text: 'Антону',
          errorType: 'caso.dativo',
          whyWrong: 'Антону es dativo («a Antón»).',
        },
        {
          id: 'd',
          text: 'Антоном',
          errorType: 'caso.instrumental',
          whyWrong: 'Антоном es instrumental («con Antón»).',
        },
      ],
      explanation: {
        rule: 'Posesión: lo poseído + el poseedor en genitivo (машина Антона = el coche de Antón).',
        whyCorrect: 'El «de» de posesión se expresa con genitivo: Антон → Антона.',
        examples: [
          { ru: 'Это дом моего друга.', es: 'Es la casa de mi amigo.' },
          { ru: 'Где сумка мамы?', es: '¿Dónde está el bolso de mamá?' },
        ],
      },
    },
    {
      id: 'gen1-q4',
      kind: 'choice',
      format: 'completar',
      skill: 'gen.cantidad',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'У меня два ___.',
      translation: 'Tengo dos hermanos.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'брата' },
        {
          id: 'b',
          text: 'брат',
          errorType: 'numero.2-4',
          whyWrong: 'Tras 2, 3 y 4 el sustantivo no se queda en nominativo: va en genitivo singular.',
        },
        {
          id: 'c',
          text: 'братьев',
          errorType: 'numero.2-4',
          whyWrong:
            'братьев es genitivo plural: se usa tras 5 o más (пять братьев). Tras 2, 3, 4 va el genitivo singular.',
        },
        {
          id: 'd',
          text: 'братья',
          errorType: 'numero.2-4',
          whyWrong:
            'братья es nominativo plural. Aunque hablemos de dos, tras два el sustantivo va en genitivo singular.',
        },
      ],
      explanation: {
        rule: 'Tras 2, 3, 4 (y 22, 33, 44…): genitivo singular. Tras 5 a 20: genitivo plural.',
        whyCorrect: 'два + genitivo singular: два брата.',
        examples: [
          { ru: 'Я жил там три года.', es: 'Viví allí tres años.' },
          { ru: 'В квартире четыре комнаты.', es: 'El piso tiene cuatro habitaciones.' },
        ],
      },
    },
    {
      id: 'gen1-q5',
      kind: 'choice',
      format: 'completar',
      skill: 'gen.ortografia',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Без ___ я не могу писать.',
      translation: 'Sin bolígrafo no puedo escribir.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'ручки' },
        {
          id: 'b',
          text: 'ручкы',
          errorType: 'ortografia.ы-и',
          whyWrong:
            'El caso es correcto (genitivo), pero tras к nunca se escribe ы: ручки.',
        },
        {
          id: 'c',
          text: 'ручка',
          errorType: 'caso.nominativo',
          whyWrong: 'ручка es nominativo. без rige genitivo.',
        },
        {
          id: 'd',
          text: 'ручку',
          errorType: 'caso.acusativo',
          whyWrong: 'ручку es acusativo.',
        },
      ],
      explanation: {
        rule: 'Regla ortográfica: tras г, к, х, ж, ш, ч, щ se escribe и en lugar de ы.',
        whyCorrect: 'без + genitivo. ручка es femenino en -а (-ы), pero tras к se escribe -и: без ручки.',
        examples: [
          { ru: 'Я пью чай без сахара.', es: 'Tomo el té sin azúcar.' },
          { ru: 'У меня нет книги.', es: 'No tengo el libro.' },
        ],
      },
    },
    {
      id: 'gen1-q6',
      kind: 'multi',
      skill: 'gen.cantidad',
      instruction: 'Selecciona todas las palabras que completan bien la frase.',
      prompt: 'У нас много ___.',
      translation: 'Tenemos mucho / muchos…',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        { id: 'a', text: 'работы', note: 'много + genitivo singular con lo que no se cuenta.' },
        { id: 'b', text: 'друзей', note: 'много + genitivo plural con lo que se cuenta.' },
        { id: 'c', text: 'времени', note: 'время → времени (genitivo singular).' },
        {
          id: 'd',
          text: 'работа',
          errorType: 'caso.nominativo',
          whyWrong: 'работа es nominativo. много rige genitivo.',
        },
        {
          id: 'e',
          text: 'друзья',
          errorType: 'caso.nominativo',
          whyWrong: 'друзья es nominativo plural. Tras много hace falta genitivo plural: друзей.',
        },
      ],
      explanation: {
        rule: 'много, мало, сколько + genitivo: singular si no se cuenta, plural si se cuenta.',
        whyCorrect: 'работы y времени (genitivo singular) y друзей (genitivo plural) son correctas.',
        examples: [
          { ru: 'Сколько у тебя времени?', es: '¿Cuánto tiempo tienes?' },
          { ru: 'В городе мало парков.', es: 'En la ciudad hay pocos parques.' },
        ],
      },
    },
    {
      id: 'gen1-q7',
      kind: 'choice',
      format: 'verdadero-falso',
      skill: 'gen.negacion',
      instruction:
        'Verdadero o falso: en «У меня есть брат» y «У меня нет брата», брат va en el mismo caso.',
      optionsLang: 'es',
      correctOptionId: 'b',
      options: [
        {
          id: 'a',
          text: 'Verdadero',
          errorType: 'caso.identificacion',
          whyWrong:
            'En la frase afirmativa брат es el sujeto de есть y va en nominativo; con нет pasa a genitivo: брата.',
        },
        { id: 'b', text: 'Falso' },
      ],
      explanation: {
        rule: 'есть + nominativo; нет + genitivo.',
        whyCorrect: 'Es falso: брат (nominativo) con есть; брата (genitivo) con нет.',
        examples: [
          { ru: 'У меня есть время.', es: 'Tengo tiempo.' },
          { ru: 'У меня нет времени.', es: 'No tengo tiempo.' },
        ],
      },
    },
    {
      id: 'gen1-q8',
      kind: 'order',
      display: 'palabras',
      skill: 'gen.negacion',
      instruction: 'Ordena las palabras para formar la frase.',
      translation: 'Mi amigo no tiene coche.',
      tokens: ['у', 'моего', 'друга', 'нет', 'машины'],
      alsoAccepted: [
        ['у', 'моего', 'друга', 'машины', 'нет'],
        ['машины', 'у', 'моего', 'друга', 'нет'],
      ],
      orderNote:
        '«У моего друга машины нет» y «Машины у моего друга нет» también son correctas: ponen el énfasis en que el coche no existe.',
      errorType: 'orden.palabras',
      explanation: {
        rule: 'у + genitivo (poseedor) + нет + genitivo (lo que falta).',
        whyCorrect:
          'El poseedor va con у + genitivo (у моего друга) y lo que falta, en genitivo tras нет (машины).',
        examples: [
          { ru: 'У моей сестры нет кошки.', es: 'Mi hermana no tiene gato.' },
          { ru: 'У нашего соседа нет собаки.', es: 'Nuestro vecino no tiene perro.' },
        ],
      },
    },
    {
      id: 'gen1-q9',
      kind: 'choice',
      format: 'completar',
      skill: 'lex.cotidiano',
      instruction: 'Completa la frase con la palabra de la lección en la forma correcta.',
      prompt: 'Борщ без ___ — это не борщ!',
      translation: '¡Un borsch sin smetana no es un borsch!',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'сметаны' },
        {
          id: 'b',
          text: 'сметана',
          errorType: 'caso.nominativo',
          whyWrong: 'сметана es nominativo. без rige genitivo.',
        },
        {
          id: 'c',
          text: 'сметану',
          errorType: 'caso.acusativo',
          whyWrong: 'сметану es acusativo.',
        },
        {
          id: 'd',
          text: 'сметаной',
          errorType: 'caso.instrumental',
          whyWrong: 'сметаной es instrumental, como en «борщ со сметаной» (borsch con smetana).',
        },
      ],
      explanation: {
        rule: 'без + genitivo. Los femeninos en -а toman -ы.',
        whyCorrect: 'без rige genitivo: сметана → без сметаны.',
        examples: [
          { ru: 'Я пью чай без сахара.', es: 'Tomo el té sin azúcar.' },
          { ru: 'Борщ подают со сметаной.', es: 'El borsch se sirve con smetana.' },
        ],
      },
    },
  ],
}
