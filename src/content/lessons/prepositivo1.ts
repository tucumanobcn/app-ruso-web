import type { Lesson } from '../types'

export const prepositivo1: Lesson = {
  id: 'prepositivo-1',
  title: 'El prepositivo: dónde y de qué hablamos',
  level: 'A1',
  topic: 'Casos gramaticales',
  type: 'monografica',
  objective:
    'Usar el prepositivo singular para indicar dónde está algo (в / на) y de qué se habla (о / об), eligiendo bien entre в y на.',
  prerequisites: ['Nominativo singular y género de los sustantivos'],
  estimatedMinutes: 9,
  status: 'disponible',
  intro: {
    title: 'El prepositivo en dos minutos',
    illustration: 'prep-v-na',
    paragraphs: [
      'El prepositivo siempre va con preposición. Con в y на responde a где? (¿dónde?): в Москве, на работе. Con о / об responde a о ком? о чём? (¿de quién?, ¿de qué?): о брате, о фильме.',
      'в se usa para espacios cerrados, ciudades y países; на, para superficies, espacios abiertos, eventos y algunas combinaciones fijas (на работе, на почте, на вокзале).',
    ],
    tables: [
      {
        caption: 'Terminaciones del singular',
        headers: ['Tipo', 'Nominativo', 'Prepositivo', 'Terminación'],
        ruColumns: [1, 2, 3],
        rows: [
          ['Masculino y neutro', 'город, окно', 'в городе, в окне', '-е'],
          ['Femenino en -а, -я', 'школа, неделя', 'в школе, на неделе', '-е'],
          ['En -ия, -ие, -ий', 'Россия, здание', 'в России, в здании', '-и'],
          ['Femenino en -ь', 'площадь', 'на площади', '-и'],
        ],
        note: 'Unos pocos masculinos toman -у tónica para indicar lugar: в лесу, в саду, на полу, в аэропорту. La mayoría usa -е: в парке, в магазине.',
      },
      {
        caption: 'Pronombres con о',
        headers: ['Nominativo', 'Prepositivo'],
        ruColumns: [0, 1],
        rows: [
          ['я', 'обо мне'],
          ['ты', 'о тебе'],
          ['он, оно', 'о нём'],
          ['она', 'о ней'],
          ['мы', 'о нас'],
          ['вы', 'о вас'],
          ['они', 'о них'],
        ],
        note: 'о pasa a об delante de vocal (об Анне, об этом) y a обо delante de мне.',
      },
    ],
  },
  questions: [
    {
      id: 'prep1-q1',
      kind: 'choice',
      format: 'completar',
      skill: 'prep.lugar',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Мы живём в ___.',
      translation: 'Vivimos en Moscú.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Москве' },
        {
          id: 'b',
          text: 'Москву',
          errorType: 'caso.lugar-direccion',
          whyWrong:
            'Москву es acusativo: con в indica la dirección (Я еду в Москву, viajo a Moscú). Para el lugar donde se está hace falta el prepositivo.',
        },
        {
          id: 'c',
          text: 'Москва',
          errorType: 'caso.nominativo',
          whyWrong: 'Москва es el nominativo. Tras в con el sentido de «dónde» hace falta el prepositivo.',
        },
        {
          id: 'd',
          text: 'Москвы',
          errorType: 'caso.genitivo',
          whyWrong:
            'Москвы es genitivo; se usa, por ejemplo, para la procedencia: из Москвы (de Moscú).',
        },
      ],
      explanation: {
        rule: 'в / на + prepositivo indica dónde está algo o alguien (где?). Los femeninos en -а cambian a -е.',
        whyCorrect: 'Para decir dónde vivimos se usa в + prepositivo. Москва es femenino en -а: в Москве.',
        examples: [
          { ru: 'Моя подруга работает в Москве.', es: 'Mi amiga trabaja en Moscú.' },
          { ru: 'Летом мы были в Москве.', es: 'En verano estuvimos en Moscú.' },
        ],
      },
    },
    {
      id: 'prep1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'prep.lugar',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я долго жил в ___.',
      translation: 'Viví mucho tiempo en Rusia.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'России' },
        {
          id: 'b',
          text: 'Россие',
          errorType: 'terminacion.ия',
          whyWrong:
            'Россие aplica la terminación general -е, pero los sustantivos en -ия forman el prepositivo en -и: в России.',
        },
        {
          id: 'c',
          text: 'Россию',
          errorType: 'caso.lugar-direccion',
          whyWrong:
            'Россию es acusativo: se usaría para la dirección, como en Я еду в Россию (Viajo a Rusia).',
        },
        {
          id: 'd',
          text: 'Россией',
          errorType: 'caso.instrumental',
          whyWrong: 'Россией es instrumental, como en «Я интересуюсь Россией». No indica lugar.',
        },
      ],
      explanation: {
        rule: 'Los sustantivos en -ия, -ие, -ий forman el prepositivo en -и: Россия → в России, здание → в здании.',
        whyCorrect: 'жить в + prepositivo indica dónde. Россия termina en -ия, así que su prepositivo es России.',
        examples: [
          { ru: 'Он учился в Германии.', es: 'Él estudió en Alemania.' },
          { ru: 'Музей находится в старом здании.', es: 'El museo está en un edificio antiguo.' },
        ],
      },
    },
    {
      id: 'prep1-q3',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'prep.v-na',
      instruction: 'Elige la preposición correcta.',
      prompt: 'Папа сейчас ___ работе.',
      translation: 'Papá está ahora en el trabajo.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'на' },
        {
          id: 'b',
          text: 'в',
          errorType: 'preposicion.v-na',
          whyWrong:
            'Con работа se dice siempre на: на работе (dónde), на работу (adónde). Es una combinación fija; no depende de si el lugar es cerrado.',
        },
      ],
      explanation: {
        rule: 'Algunos sustantivos van con на aunque designen lugares cerrados: на работе, на почте, на вокзале, на заводе.',
        whyCorrect: 'работа forma pareja fija con на: на работе.',
        examples: [
          { ru: 'Она сейчас на почте.', es: 'Ella está ahora en correos.' },
          { ru: 'Я жду тебя на вокзале.', es: 'Te espero en la estación.' },
        ],
      },
    },
    {
      id: 'prep1-q4',
      kind: 'multi',
      skill: 'prep.v-na',
      instruction: '¿Cuáles de estas palabras van con на para decir dónde estás? Selecciona todas.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        { id: 'a', text: 'почта', note: 'на почте: combinación fija.' },
        { id: 'b', text: 'концерт', note: 'на концерте: los eventos van con на.' },
        { id: 'c', text: 'улица', note: 'на улице: espacio abierto.' },
        {
          id: 'd',
          text: 'школа',
          errorType: 'preposicion.v-na',
          whyWrong: 'Se dice в школе: la escuela es un edificio, un espacio cerrado.',
        },
        {
          id: 'e',
          text: 'магазин',
          errorType: 'preposicion.v-na',
          whyWrong: 'Se dice в магазине.',
        },
        {
          id: 'f',
          text: 'театр',
          errorType: 'preposicion.v-na',
          whyWrong:
            'Se dice в театре cuando hablas del edificio; para el evento se usa на: на спектакле.',
        },
      ],
      explanation: {
        rule: 'в: espacios cerrados, ciudades, países. на: superficies, espacios abiertos, eventos y combinaciones fijas.',
        whyCorrect:
          'почта, концерт y улица van con на (на почте, на концерте, на улице); школа, магазин y театр, con в.',
        examples: [
          { ru: 'Мы познакомились на концерте.', es: 'Nos conocimos en un concierto.' },
          { ru: 'Дети играют на улице.', es: 'Los niños juegan en la calle.' },
        ],
      },
    },
    {
      id: 'prep1-q5',
      kind: 'choice',
      format: 'completar',
      skill: 'prep.o',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я часто думаю о ___.',
      translation: 'Pienso a menudo en mi hermano.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'брате' },
        {
          id: 'b',
          text: 'брата',
          errorType: 'caso.genitivo-acusativo',
          whyWrong:
            'брата es genitivo o acusativo. Tras о con el sentido de «sobre, en» siempre va el prepositivo.',
        },
        {
          id: 'c',
          text: 'брату',
          errorType: 'caso.dativo',
          whyWrong: 'брату es dativo («a mi hermano»), como en «Я позвонил брату».',
        },
        {
          id: 'd',
          text: 'братом',
          errorType: 'caso.instrumental',
          whyWrong: 'братом es instrumental («con mi hermano»).',
        },
      ],
      explanation: {
        rule: 'думать, говорить, рассказывать о + prepositivo.',
        whyCorrect: 'думать о (pensar en, sobre) rige prepositivo: брат → о брате.',
        examples: [
          { ru: 'Расскажи мне о своей работе.', es: 'Háblame de tu trabajo.' },
          { ru: 'Мы говорили о фильме.', es: 'Hablábamos de la película.' },
        ],
      },
    },
    {
      id: 'prep1-q6',
      kind: 'choice',
      format: 'completar',
      skill: 'prep.o',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Мы долго говорили о ___.',
      translation: 'Estuvimos mucho rato hablando de ella.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'ней' },
        {
          id: 'b',
          text: 'ей',
          errorType: 'caso.dativo',
          whyWrong:
            'ей es dativo o instrumental de она. Además, tras preposición los pronombres de tercera persona añaden н-.',
        },
        {
          id: 'c',
          text: 'неё',
          errorType: 'caso.genitivo-acusativo',
          whyWrong:
            'неё es la forma de genitivo y acusativo tras preposición: у неё, для неё, на неё. Con о hace falta el prepositivo.',
        },
        {
          id: 'd',
          text: 'она',
          errorType: 'caso.nominativo',
          whyWrong: 'она es nominativo; tras о hace falta el prepositivo.',
        },
      ],
      explanation: {
        rule: 'Pronombres en prepositivo: обо мне, о тебе, о нём, о ней, о нас, о вас, о них.',
        whyCorrect: 'о + prepositivo; el prepositivo de она es ней, con н- porque va tras preposición: о ней.',
        examples: [
          { ru: 'Что ты знаешь о нём?', es: '¿Qué sabes de él?' },
          { ru: 'Не думай обо мне.', es: 'No pienses en mí.' },
        ],
      },
    },
    {
      id: 'prep1-q7',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'prep.lugar',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'd',
      options: [
        {
          id: 'a',
          text: 'Книга лежит на столе.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («El libro está sobre la mesa»): на + prepositivo para una superficie.',
        },
        {
          id: 'b',
          text: 'Мы были в музее.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Estuvimos en el museo»): музей → в музее.',
        },
        {
          id: 'c',
          text: 'Я отдыхал в Испании.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Estuve de vacaciones en España»): Испания → в Испании.',
        },
        { id: 'd', text: 'Дети играют в парку.' },
      ],
      explanation: {
        rule: 'Solo unos pocos masculinos toman -у de lugar (в лесу, в саду, на полу, в аэропорту). Los demás usan -е.',
        whyCorrect:
          'La frase errónea es «Дети играют в парку». парк no pertenece al grupo de -у: lo correcto es в парке.',
        examples: [
          { ru: 'Дети играют в парке.', es: 'Los niños juegan en el parque.' },
          { ru: 'Мы гуляли в лесу.', es: 'Paseamos por el bosque.' },
        ],
      },
    },
    {
      id: 'prep1-q8',
      kind: 'order',
      display: 'palabras',
      skill: 'prep.lugar',
      instruction: 'Ordena las palabras para formar la frase.',
      translation: 'Mi hermana vive en San Petersburgo.',
      tokens: ['моя', 'сестра', 'живёт', 'в', 'Петербурге'],
      alsoAccepted: [['в', 'Петербурге', 'живёт', 'моя', 'сестра']],
      orderNote:
        'El orden en ruso es flexible: la información nueva suele ir al final. Aquí se aceptan los órdenes neutros; en el habla aparecen otros con matices de énfasis.',
      errorType: 'orden.palabras',
      explanation: {
        rule: 'Sujeto + verbo + lugar es el orden neutro. El lugar va en prepositivo.',
        whyCorrect:
          '«Моя сестра живёт в Петербурге» informa de dónde vive; «В Петербурге живёт моя сестра» pone el foco en quién vive allí.',
        examples: [
          { ru: 'Мой брат живёт в Казани.', es: 'Mi hermano vive en Kazán.' },
          { ru: 'В Казани живёт мой брат.', es: 'En Kazán vive mi hermano.' },
        ],
      },
    },
    {
      id: 'prep1-q9',
      kind: 'choice',
      format: 'completar',
      skill: 'lex.cotidiano',
      alsoEvaluates: ['prep.v-na'],
      instruction: 'Completa la frase con la palabra de la lección en la forma correcta.',
      prompt: 'Летом мы живём на ___.',
      translation: 'En verano vivimos en la dacha.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'даче' },
        {
          id: 'b',
          text: 'дачу',
          errorType: 'caso.lugar-direccion',
          whyWrong: 'дачу es acusativo: se usa para ir hacia allí (Мы едем на дачу).',
        },
        {
          id: 'c',
          text: 'дача',
          errorType: 'caso.nominativo',
          whyWrong: 'дача es nominativo; tras на con el sentido de «dónde» hace falta el prepositivo.',
        },
        {
          id: 'd',
          text: 'дачи',
          errorType: 'caso.genitivo',
          whyWrong: 'дачи es genitivo: se usa para la procedencia (с дачи, desde la dacha).',
        },
      ],
      explanation: {
        rule: 'дача va con на: на даче (dónde), на дачу (adónde), с дачи (de dónde).',
        whyCorrect: 'Para decir dónde vivimos se usa на + prepositivo: дача → на даче.',
        examples: [
          { ru: 'Мы отдыхали на даче.', es: 'Descansamos en la dacha.' },
          { ru: 'В субботу мы едем на дачу.', es: 'El sábado vamos a la dacha.' },
        ],
      },
    },
  ],
}
