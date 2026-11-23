import type { Lesson } from '../types'

export const acusativo1: Lesson = {
  id: 'acusativo-1',
  title: 'El acusativo: qué y adónde',
  level: 'A1',
  topic: 'Casos gramaticales',
  type: 'monografica',
  objective:
    'Formar el acusativo singular del objeto directo (con animados e inanimados) y distinguir la dirección (в / на + acusativo) del lugar (prepositivo).',
  prerequisites: ['Nominativo singular y género de los sustantivos', 'Prepositivo de lugar'],
  estimatedMinutes: 9,
  status: 'disponible',
  intro: {
    title: 'El acusativo en dos minutos',
    illustration: 'acus-direccion',
    paragraphs: [
      'El acusativo responde a кого? что? (¿a quién?, ¿qué?) para el objeto directo, y a куда? (¿adónde?) con в y на para la dirección: Я иду в школу.',
      'Compara: Я в школе (¿dónde? → prepositivo) y Я иду в школу (¿adónde? → acusativo).',
    ],
    tables: [
      {
        caption: 'Terminaciones del singular',
        headers: ['Tipo', 'Nominativo', 'Acusativo', 'Regla'],
        ruColumns: [1, 2],
        rows: [
          ['Femenino en -а, -я', 'мама, неделя', 'маму, неделю', '-у / -ю'],
          ['Femenino en -ь', 'дверь', 'дверь', 'no cambia'],
          ['Masculino y neutro inanimados', 'стол, окно', 'стол, окно', 'no cambia'],
          ['Masculino animado', 'брат, учитель', 'брата, учителя', 'igual que el genitivo'],
        ],
      },
      {
        caption: 'Pronombres personales',
        headers: ['Nominativo', 'Acusativo', 'Tras preposición'],
        ruColumns: [0, 1, 2],
        rows: [
          ['я', 'меня', 'на меня'],
          ['ты', 'тебя', 'на тебя'],
          ['он, оно', 'его', 'на него'],
          ['она', 'её', 'на неё'],
          ['мы', 'нас', 'на нас'],
          ['вы', 'вас', 'на вас'],
          ['они', 'их', 'на них'],
        ],
      },
    ],
  },
  questions: [
    {
      id: 'acus1-q1',
      kind: 'choice',
      format: 'completar',
      skill: 'acus.animacion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я читаю ___.',
      translation: 'Leo una revista.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'журнал' },
        {
          id: 'b',
          text: 'журнала',
          errorType: 'animacion.inanimado-como-animado',
          whyWrong:
            'журнала es genitivo. Solo los masculinos animados (personas y animales) toman en acusativo la forma del genitivo; журнал es inanimado.',
        },
        {
          id: 'c',
          text: 'журналу',
          errorType: 'caso.dativo',
          whyWrong: 'журналу es dativo; читать rige acusativo.',
        },
        {
          id: 'd',
          text: 'журналом',
          errorType: 'caso.instrumental',
          whyWrong: 'журналом es instrumental («con la revista»).',
        },
      ],
      explanation: {
        rule: 'Masculinos inanimados: el acusativo es igual al nominativo.',
        whyCorrect: 'читать что? rige acusativo. журнал es masculino inanimado, así que no cambia.',
        examples: [
          { ru: 'Я купил новый телефон.', es: 'Me compré un teléfono nuevo.' },
          { ru: 'Ты видишь этот дом?', es: '¿Ves esa casa?' },
        ],
      },
    },
    {
      id: 'acus1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'acus.animacion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Мы видели ___ в театре.',
      translation: 'Vimos a Iván en el teatro.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Ивана' },
        {
          id: 'b',
          text: 'Иван',
          errorType: 'animacion.animado-como-inanimado',
          whyWrong:
            'Иван es nominativo. En masculino singular, los animados toman en acusativo la forma del genitivo: Ивана.',
        },
        {
          id: 'c',
          text: 'Ивану',
          errorType: 'caso.dativo',
          whyWrong: 'Ивану es dativo, el destinatario: дать Ивану (darle a Iván).',
        },
        {
          id: 'd',
          text: 'Иваном',
          errorType: 'caso.instrumental',
          whyWrong: 'Иваном es instrumental («con Iván»).',
        },
      ],
      explanation: {
        rule: 'Masculinos animados: el acusativo es igual al genitivo (брат → брата, Иван → Ивана).',
        whyCorrect: 'видеть кого? rige acusativo. Иван es masculino animado: Ивана.',
        examples: [
          { ru: 'Я знаю твоего брата.', es: 'Conozco a tu hermano.' },
          { ru: 'Мы ждём учителя.', es: 'Esperamos al profesor.' },
        ],
      },
    },
    {
      id: 'acus1-q3',
      kind: 'choice',
      format: 'completar',
      skill: 'acus.objeto',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Закрой, пожалуйста, ___.',
      translation: 'Cierra la puerta, por favor.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'дверь' },
        {
          id: 'b',
          text: 'дверю',
          errorType: 'terminacion.fem-ь',
          whyWrong:
            '-у / -ю solo se añade a los femeninos en -а / -я. Los femeninos en -ь no cambian en acusativo.',
        },
        {
          id: 'c',
          text: 'двери',
          errorType: 'caso.otro-oblicuo',
          whyWrong:
            'двери es genitivo, dativo o prepositivo singular (o nominativo plural). Aquí hace falta el acusativo.',
        },
        {
          id: 'd',
          text: 'дверью',
          errorType: 'caso.instrumental',
          whyWrong: 'дверью es instrumental.',
        },
      ],
      explanation: {
        rule: 'Femeninos en -ь: el acusativo es igual al nominativo (дверь, тетрадь, площадь).',
        whyCorrect: 'закрыть что? rige acusativo. дверь es femenino en -ь, que no cambia: закрой дверь.',
        examples: [
          { ru: 'Открой тетрадь.', es: 'Abre el cuaderno.' },
          { ru: 'Я помню ту ночь.', es: 'Recuerdo aquella noche.' },
        ],
      },
    },
    {
      id: 'acus1-q4',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'acus.direccion',
      instruction: 'Elige la forma correcta.',
      prompt: 'Завтра я иду в ___.',
      translation: 'Mañana voy a la escuela.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'школу' },
        {
          id: 'b',
          text: 'школе',
          errorType: 'caso.lugar-direccion',
          whyWrong:
            'школе es prepositivo: indica dónde estás (Я в школе). Con un verbo de movimiento hacia un destino se usa acusativo.',
        },
      ],
      explanation: {
        rule: 'в / на + acusativo responde a куда? (¿adónde?).',
        whyCorrect: 'идти в + acusativo: школа → в школу.',
        examples: [
          { ru: 'Вечером мы идём в кино.', es: 'Por la tarde vamos al cine.' },
          { ru: 'Она едет на работу.', es: 'Ella va (en transporte) al trabajo.' },
        ],
      },
    },
    {
      id: 'acus1-q5',
      kind: 'choice',
      format: 'verdadero-falso',
      skill: 'acus.objeto',
      instruction: 'Verdadero o falso: en «Я вижу стол», стол está en acusativo.',
      optionsLang: 'es',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Verdadero' },
        {
          id: 'b',
          text: 'Falso',
          errorType: 'caso.identificacion',
          whyWrong:
            'Aunque tiene la misma forma que el nominativo, стол es el objeto directo de вижу, así que está en acusativo: en los masculinos inanimados ambas formas coinciden.',
        },
      ],
      explanation: {
        rule: 'El caso depende de la función en la frase, no solo de la forma.',
        whyCorrect:
          'стол es lo que se ve (objeto directo): acusativo. Coincide con el nominativo por ser masculino inanimado.',
        examples: [
          { ru: 'Стол стоит у окна.', es: 'La mesa está junto a la ventana (nominativo: sujeto).' },
          { ru: 'Я вижу стол.', es: 'Veo la mesa (acusativo: objeto directo).' },
        ],
      },
    },
    {
      id: 'acus1-q6',
      kind: 'choice',
      format: 'completar',
      skill: 'acus.objeto',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Ты знаешь ___? — Да, это мой коллега.',
      translation: '¿Lo conoces? — Sí, es mi colega.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'его' },
        {
          id: 'b',
          text: 'него',
          errorType: 'pronombre.n',
          whyWrong:
            'него es la forma que se usa tras preposición (на него, для него). Sin preposición se dice его.',
        },
        {
          id: 'c',
          text: 'ему',
          errorType: 'caso.dativo',
          whyWrong: 'ему es dativo («a él»): Я позвонил ему.',
        },
        {
          id: 'd',
          text: 'он',
          errorType: 'caso.nominativo',
          whyWrong: 'он es nominativo: sería el sujeto.',
        },
      ],
      explanation: {
        rule: 'Pronombres en acusativo: меня, тебя, его, её, нас, вас, их. Tras preposición, los de tercera persona añaden н-.',
        whyCorrect: 'знать кого? rige acusativo. El acusativo de он es его.',
        examples: [
          { ru: 'Я давно её не видел.', es: 'Hace mucho que no la veo.' },
          { ru: 'Я тебя слушаю.', es: 'Te escucho.' },
        ],
      },
    },
    {
      id: 'acus1-q7',
      kind: 'multi',
      skill: 'acus.direccion',
      instruction: 'Selecciona todas las frases correctas.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        { id: 'a', text: 'Я еду на работу.', note: 'на + acusativo para la dirección.' },
        { id: 'b', text: 'Мы идём в театр.', note: 'театр es inanimado: en acusativo no cambia.' },
        { id: 'c', text: 'Он любит музыку.', note: 'музыка → музыку: femenino en -а.' },
        {
          id: 'd',
          text: 'Она идёт в магазине.',
          errorType: 'caso.lugar-direccion',
          whyWrong:
            'Con идти (dirección) hace falta acusativo: в магазин. в магазине indica dónde se está.',
        },
        {
          id: 'e',
          text: 'Я видел брат.',
          errorType: 'animacion.animado-como-inanimado',
          whyWrong: 'брат es animado: en acusativo, брата.',
        },
      ],
      explanation: {
        rule: 'El objeto directo y la dirección (куда?) van en acusativo.',
        whyCorrect:
          'Las tres frases correctas usan bien el acusativo: dirección (на работу, в театр) y objeto directo (музыку).',
        examples: [
          { ru: 'Я иду на почту.', es: 'Voy a correos.' },
          { ru: 'Мы встретили друга.', es: 'Nos encontramos con un amigo.' },
        ],
      },
    },
    {
      id: 'acus1-q8',
      kind: 'match',
      skill: 'acus.direccion',
      instruction: 'Relaciona cada frase con su traducción.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'caso.lugar-direccion',
      pairs: [
        { id: 'p1', left: 'Я иду в банк.', right: 'Voy al banco.' },
        { id: 'p2', left: 'Я в банке.', right: 'Estoy en el banco.' },
        { id: 'p3', left: 'Я иду на почту.', right: 'Voy a correos.' },
        { id: 'p4', left: 'Я на почте.', right: 'Estoy en correos.' },
      ],
      explanation: {
        rule: '¿Adónde? → в / на + acusativo. ¿Dónde? → в / на + prepositivo.',
        whyCorrect: 'банк y почту (acusativo) indican destino; банке y почте (prepositivo), ubicación.',
        examples: [
          { ru: 'Куда ты идёшь? — В аптеку.', es: '¿Adónde vas? — A la farmacia.' },
          { ru: 'Где ты? — В аптеке.', es: '¿Dónde estás? — En la farmacia.' },
        ],
      },
    },
    {
      id: 'acus1-q9',
      kind: 'match',
      skill: 'lex.cotidiano',
      instruction: 'Relaciona cada palabra de la lección con su significado.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'lexico.significado',
      pairs: [
        { id: 'p1', left: 'гре́чка', right: 'trigo sarraceno' },
        { id: 'p2', left: 'матрёшка', right: 'matrioska' },
        { id: 'p3', left: 'самова́р', right: 'samovar' },
        { id: 'p4', left: 'борщ', right: 'borsch' },
        { id: 'p5', left: 'электри́чка', right: 'tren de cercanías' },
      ],
      explanation: {
        rule: 'Vocabulario de la lección: objetos y comidas muy presentes en la vida rusa.',
        whyCorrect: 'гречка es el trigo sarraceno; матрёшка, la muñeca matrioska; самовар, el samovar; борщ, el borsch, y электричка, el tren de cercanías.',
        examples: [
          { ru: 'Я купил гречку.', es: 'He comprado trigo sarraceno.' },
          { ru: 'Мы опоздали на электричку.', es: 'Hemos perdido el tren de cercanías.' },
        ],
      },
    },
  ],
}
