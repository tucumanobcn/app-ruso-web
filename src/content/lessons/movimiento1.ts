import type { Lesson } from '../types'

export const movimiento1: Lesson = {
  id: 'movimiento-1',
  title: 'Идти y ходить',
  level: 'A2',
  topic: 'Verbos de movimiento',
  type: 'monografica',
  objective:
    'Distinguir el movimiento a pie en una dirección (идти) del movimiento habitual, de ida y vuelta o en general (ходить), y conjugar ambos verbos.',
  prerequisites: ['Presente de los verbos', 'в / на + acusativo (dirección)'],
  estimatedMinutes: 10,
  status: 'disponible',
  intro: {
    title: 'идти y ходить en dos minutos',
    illustration: 'mov-idti-hodit',
    paragraphs: [
      'Los verbos de movimiento van en parejas. Para ir a pie: идти (unidireccional) y ходить (multidireccional).',
      'идти: un trayecto concreto en una dirección, ahora o en un momento determinado: Я иду в магазин (Voy ahora a la tienda).',
      'ходить: costumbre o repetición (Я хожу в бассейн по субботам), ida y vuelta en pasado (Вчера я ходил в кино: fui y volví) y la capacidad de andar (Ребёнок уже ходит).',
      'Con transporte se usan ехать / ездить, que siguen la misma lógica; los verás en una lección próxima.',
    ],
    tables: [
      {
        caption: 'Conjugación',
        headers: ['Persona', 'идти', 'ходить'],
        ruColumns: [1, 2],
        rows: [
          ['я', 'иду', 'хожу'],
          ['ты', 'идёшь', 'ходишь'],
          ['он, она', 'идёт', 'ходит'],
          ['мы', 'идём', 'ходим'],
          ['вы', 'идёте', 'ходите'],
          ['они', 'идут', 'ходят'],
          ['Pasado', 'шёл, шла, шли', 'ходил, ходила, ходили'],
        ],
      },
    ],
  },
  questions: [
    {
      id: 'mov1-q1',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'mov.idti-hodit',
      instruction: 'Elige el verbo adecuado.',
      prompt: '— Куда ты ___? — В магазин.',
      translation: '—¿Adónde vas (ahora)? —A la tienda.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'идёшь' },
        {
          id: 'b',
          text: 'ходишь',
          errorType: 'movimiento.uni-multi',
          whyWrong:
            '«Куда ты ходишь?» preguntaría adónde vas habitualmente. Para un trayecto concreto en este momento se usa идти.',
        },
      ],
      explanation: {
        rule: 'Trayecto concreto en una dirección, ahora → идти.',
        whyCorrect: 'Se pregunta por el destino de este trayecto: идёшь.',
        examples: [
          { ru: 'Смотри, вон идёт Анна.', es: 'Mira, por ahí viene Anna.' },
          { ru: 'Я иду домой.', es: 'Voy a casa.' },
        ],
      },
    },
    {
      id: 'mov1-q2',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'mov.idti-hodit',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Я каждую субботу ___ в бассейн.',
      translation: 'Voy a la piscina todos los sábados.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'хожу' },
        {
          id: 'b',
          text: 'иду',
          errorType: 'movimiento.uni-multi',
          whyWrong:
            'Para la costumbre de ir a un sitio se usa ходить. (En una cadena de acciones habituales, como «Каждое утро я встаю, завтракаю и иду на работу», también aparece идти, pero aquí no hay secuencia.)',
        },
      ],
      explanation: {
        rule: 'Costumbre o repetición → ходить.',
        whyCorrect: 'каждую субботу indica una costumbre: хожу.',
        examples: [
          { ru: 'Он часто ходит в театр.', es: 'Va a menudo al teatro.' },
          { ru: 'Дети ходят в школу.', es: 'Los niños van al colegio.' },
        ],
      },
    },
    {
      id: 'mov1-q3',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'mov.idti-hodit',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Вчера мы ___ в театр.',
      translation: 'Ayer fuimos al teatro (y volvimos).',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'ходили' },
        {
          id: 'b',
          text: 'шли',
          errorType: 'movimiento.ida-vuelta',
          whyWrong:
            'шли describe el trayecto en curso («íbamos al teatro»), por ejemplo cuando pasó otra cosa: Мы шли в театр, когда начался дождь. Para un viaje completo de ida y vuelta, ходили.',
        },
      ],
      explanation: {
        rule: 'ходить en pasado = viaje de ida y vuelta ya completado.',
        whyCorrect: 'Fuisteis y ya volvisteis: ходили.',
        examples: [
          { ru: 'Где ты был? — Я ходил в магазин.', es: '¿Dónde estabas? — Fui a la tienda.' },
          { ru: 'Мы шли домой, когда пошёл снег.', es: 'Íbamos a casa cuando empezó a nevar.' },
        ],
      },
    },
    {
      id: 'mov1-q4',
      kind: 'choice',
      format: 'completar',
      skill: 'mov.conjugacion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Смотри, дети ___ в школу.',
      translation: 'Mira, los niños van al colegio.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'идут' },
        {
          id: 'b',
          text: 'идёт',
          errorType: 'conjugacion.forma',
          whyWrong: 'идёт es la tercera persona del singular (он / она идёт). Con дети hace falta идут.',
        },
        {
          id: 'c',
          text: 'ходят',
          errorType: 'movimiento.uni-multi',
          whyWrong:
            'ходят expresaría la costumbre («los niños van al colegio» en general). Смотри indica algo que ocurre ahora, en una dirección.',
        },
        {
          id: 'd',
          text: 'идти',
          errorType: 'conjugacion.forma',
          whyWrong: 'идти es el infinitivo; hace falta la forma conjugada.',
        },
      ],
      explanation: {
        rule: 'идти: иду, идёшь, идёт, идём, идёте, идут.',
        whyCorrect: 'Sujeto plural (дети) y acción en curso en una dirección: идут.',
        examples: [
          { ru: 'Куда вы идёте?', es: '¿Adónde vais?' },
          { ru: 'Мы идём в парк.', es: 'Vamos al parque.' },
        ],
      },
    },
    {
      id: 'mov1-q5',
      kind: 'multi',
      skill: 'mov.idti-hodit',
      instruction: 'Selecciona todas las frases correctas.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        {
          id: 'a',
          text: 'Мой сын уже ходит.',
          note: 'ходить para la capacidad de andar: «Mi hijo ya anda».',
        },
        {
          id: 'b',
          text: 'Смотри, вон идёт автобус!',
          note: 'идти también se usa para vehículos que circulan en una dirección: «Mira, ahí viene el autobús».',
        },
        {
          id: 'c',
          text: 'Вчера я ходил к врачу.',
          note: 'ida y vuelta en pasado: «Ayer fui al médico».',
        },
        {
          id: 'd',
          text: 'Я часто иду в кино.',
          errorType: 'movimiento.uni-multi',
          whyWrong: 'часто indica costumbre: Я часто хожу в кино.',
        },
        {
          id: 'e',
          text: 'Сейчас я хожу домой.',
          errorType: 'movimiento.uni-multi',
          whyWrong:
            'сейчас con un destino concreto describe un trayecto en una dirección: Сейчас я иду домой.',
        },
      ],
      explanation: {
        rule: 'идти: una dirección, ahora. ходить: costumbre, ida y vuelta, capacidad de andar.',
        whyCorrect: 'Las tres primeras frases usan bien cada verbo.',
        examples: [
          { ru: 'Я часто хожу в кино.', es: 'Voy a menudo al cine.' },
          { ru: 'Сейчас я иду домой.', es: 'Ahora voy a casa.' },
        ],
      },
    },
    {
      id: 'mov1-q6',
      kind: 'choice',
      format: 'verdadero-falso',
      skill: 'mov.idti-hodit',
      instruction: 'Verdadero o falso: «Вчера я ходил в банк» significa que fui al banco y ya volví.',
      optionsLang: 'es',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Verdadero' },
        {
          id: 'b',
          text: 'Falso',
          errorType: 'movimiento.ida-vuelta',
          whyWrong: 'ходил en pasado describe un viaje completo de ida y vuelta: fuiste y volviste.',
        },
      ],
      explanation: {
        rule: 'ходить en pasado = ida y vuelta.',
        whyCorrect: 'Es verdadero: «Я ходил в банк» significa que fui y volví; equivale a «Я был в банке».',
        examples: [
          { ru: 'Я ходил в банк.', es: 'Fui al banco.' },
          { ru: 'Я был в банке.', es: 'Estuve en el banco.' },
        ],
      },
    },
    {
      id: 'mov1-q7',
      kind: 'order',
      display: 'lineas',
      skill: 'mov.idti-hodit',
      instruction: 'Ordena las réplicas para reconstruir el diálogo.',
      tokens: [
        '— Привет! Куда ты идёшь?',
        '— Привет! Иду в библиотеку.',
        '— Ты часто туда ходишь?',
        '— Да, каждый вторник.',
      ],
      errorType: 'orden.palabras',
      explanation: {
        rule: 'Pregunta por el trayecto de ahora → идти; pregunta por la costumbre → ходить.',
        whyCorrect:
          'Primero se pregunta adónde va ahora (идёшь), después si va a menudo (ходишь) y la respuesta indica la frecuencia.',
        examples: [
          { ru: 'Куда ты идёшь?', es: '¿Adónde vas?' },
          { ru: 'Ты часто туда ходишь?', es: '¿Vas allí a menudo?' },
        ],
      },
    },
    {
      id: 'mov1-q8',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'mov.idti-hodit',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'Я иду в магазин. Тебе что-нибудь купить?',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Voy a la tienda. ¿Te compro algo?»): trayecto concreto ahora.',
        },
        {
          id: 'b',
          text: 'Он ходит в бассейн три раза в неделю.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Va a la piscina tres veces por semana»): costumbre.',
        },
        { id: 'c', text: 'Они ходят домой прямо сейчас.' },
        {
          id: 'd',
          text: 'Куда вы ходили вчера?',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («¿Adónde fuisteis ayer?»): ida y vuelta en pasado.',
        },
      ],
      explanation: {
        rule: 'прямо сейчас con un destino concreto → идти.',
        whyCorrect:
          'La frase errónea es «Они ходят домой прямо сейчас»: es un trayecto concreto ahora, así que lo correcto es «Они идут домой прямо сейчас».',
        examples: [
          { ru: 'Они идут домой.', es: 'Van a casa.' },
          { ru: 'Обычно они ходят домой пешком.', es: 'Normalmente van a casa a pie.' },
        ],
      },
    },
    {
      id: 'mov1-q9',
      kind: 'match',
      skill: 'lex.cotidiano',
      instruction: 'Relaciona cada palabra de la lección con su significado.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'lexico.significado',
      pairs: [
        { id: 'p1', left: 'метро́', right: 'metro' },
        { id: 'p2', left: 'маршру́тка', right: 'microbús (marshrutka)' },
        { id: 'p3', left: 'остано́вка', right: 'parada' },
        { id: 'p4', left: 'вокза́л', right: 'estación de tren' },
        { id: 'p5', left: 'про́бка', right: 'atasco' },
      ],
      explanation: {
        rule: 'Vocabulario de la lección: moverse por la ciudad.',
        whyCorrect: 'метро es el metro; маршрутка, el microbús; остановка, la parada; вокзал, la estación de tren, y пробка, el atasco.',
        examples: [
          { ru: 'Я еду на работу на метро.', es: 'Voy al trabajo en metro.' },
          { ru: 'Мы стоим в пробке.', es: 'Estamos en un atasco.' },
        ],
      },
    },
  ],
}
