import type { Lesson } from '../types'

export const aspecto1: Lesson = {
  id: 'aspecto-1',
  title: 'Aspecto verbal: proceso o resultado',
  level: 'A2',
  topic: 'Aspecto verbal',
  type: 'monografica',
  objective:
    'Elegir entre imperfectivo y perfectivo según se describa un proceso, una repetición o un resultado, y formar bien el futuro de cada aspecto.',
  prerequisites: ['Presente y pasado de los verbos'],
  estimatedMinutes: 10,
  status: 'disponible',
  intro: {
    title: 'El aspecto en dos minutos',
    illustration: 'aspecto-linea',
    paragraphs: [
      'Casi todos los verbos rusos forman parejas: un imperfectivo (НСВ) y un perfectivo (СВ), como читать / прочитать.',
      'Imperfectivo: el proceso, la duración, la repetición o el simple hecho de la acción (Я читал весь вечер. Я часто читаю). Perfectivo: una acción completa, con resultado, a menudo en secuencia (Я прочитал книгу и лёг спать).',
      'Los marcadores (каждый день, долго, вдруг…) ayudan, pero son tendencias, no reglas absolutas: lo que decide es qué quieres comunicar.',
    ],
    tables: [
      {
        caption: 'Tiempos de cada aspecto',
        headers: ['Tiempo', 'Imperfectivo', 'Perfectivo'],
        ruColumns: [1, 2],
        rows: [
          ['Pasado', 'читал', 'прочитал'],
          ['Presente', 'читаю', '— (no existe)'],
          ['Futuro', 'буду читать', 'прочитаю'],
        ],
        note: 'El perfectivo no tiene presente: sus formas conjugadas (прочитаю) expresan futuro.',
      },
      {
        caption: 'Pares frecuentes',
        headers: ['Imperfectivo', 'Perfectivo', 'Significado'],
        ruColumns: [0, 1],
        rows: [
          ['делать', 'сделать', 'hacer'],
          ['писать', 'написать', 'escribir'],
          ['покупать', 'купить', 'comprar'],
          ['говорить', 'сказать', 'decir'],
          ['брать', 'взять', 'coger, tomar'],
          ['решать', 'решить', 'resolver, decidir'],
        ],
      },
    ],
  },
  questions: [
    {
      id: 'asp1-q1',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'aspecto.pasado',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Вчера я весь вечер ___ книгу.',
      translation: 'Ayer estuve leyendo un libro toda la tarde.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'читал' },
        {
          id: 'b',
          text: 'прочитал',
          errorType: 'aspecto.proceso-resultado',
          whyWrong:
            'прочитал presenta la lectura como terminada. Con весь вечер se describe la duración del proceso, que pide imperfectivo.',
        },
      ],
      explanation: {
        rule: 'Duración (весь вечер, долго, два часа) → imperfectivo.',
        whyCorrect: 'весь вечер destaca cuánto duró la acción, no su resultado: imperfectivo читал.',
        examples: [
          { ru: 'Мы долго гуляли по городу.', es: 'Paseamos mucho rato por la ciudad.' },
          { ru: 'Она два часа готовила ужин.', es: 'Estuvo dos horas preparando la cena.' },
        ],
      },
    },
    {
      id: 'asp1-q2',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'aspecto.pasado',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Я ___ письмо и пошёл на почту.',
      translation: 'Escribí la carta y fui a correos.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'написал' },
        {
          id: 'b',
          text: 'писал',
          errorType: 'aspecto.proceso-resultado',
          whyWrong:
            'писал describe el proceso. En una secuencia de acciones terminadas, una tras otra, se usa perfectivo.',
        },
      ],
      explanation: {
        rule: 'Secuencia de acciones completadas → perfectivo.',
        whyCorrect:
          'Primero terminas la carta y después vas a correos: acciones completas en secuencia, perfectivo написал.',
        examples: [
          { ru: 'Он встал, оделся и вышел.', es: 'Se levantó, se vistió y salió.' },
          { ru: 'Я купил хлеб и вернулся домой.', es: 'Compré pan y volví a casa.' },
        ],
      },
    },
    {
      id: 'asp1-q3',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'aspecto.presente-futuro',
      instruction: 'Elige el verbo adecuado.',
      prompt: 'Каждое утро она ___ кофе.',
      translation: 'Cada mañana toma café.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'пьёт' },
        {
          id: 'b',
          text: 'выпьет',
          errorType: 'aspecto.habitual',
          whyWrong:
            'выпьет es futuro perfectivo («se tomará»). El perfectivo no tiene presente: las acciones habituales en presente solo pueden ir en imperfectivo.',
        },
      ],
      explanation: {
        rule: 'Presente habitual → imperfectivo. Las formas conjugadas del perfectivo son futuro.',
        whyCorrect: 'Каждое утро describe una costumbre en presente: imperfectivo пьёт.',
        examples: [
          { ru: 'Я обычно встаю в семь.', es: 'Normalmente me levanto a las siete.' },
          { ru: 'Он часто звонит родителям.', es: 'Llama a menudo a sus padres.' },
        ],
      },
    },
    {
      id: 'asp1-q4',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'aspecto.pasado',
      instruction: 'Elige la combinación correcta para los dos huecos.',
      prompt: 'Мы долго ___ задачу и наконец ___ её.',
      translation: 'Estuvimos mucho rato resolviendo el problema y por fin lo resolvimos.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'решали … решили' },
        {
          id: 'b',
          text: 'решили … решали',
          errorType: 'aspecto.proceso-resultado',
          whyWrong:
            'Invierte los aspectos: долго pide el proceso (решали) y наконец, el resultado alcanzado (решили).',
        },
        {
          id: 'c',
          text: 'решили … решили',
          errorType: 'aspecto.proceso-resultado',
          whyWrong:
            'La primera parte describe la duración del esfuerzo (долго), que pide imperfectivo: решали.',
        },
        {
          id: 'd',
          text: 'решали … решали',
          errorType: 'aspecto.proceso-resultado',
          whyWrong: 'наконец marca que se consiguió el resultado: hace falta perfectivo, решили.',
        },
      ],
      explanation: {
        rule: 'Proceso o esfuerzo (долго) → imperfectivo; resultado conseguido (наконец) → perfectivo.',
        whyCorrect: 'решали expresa el proceso largo; решили, el resultado final.',
        examples: [
          {
            ru: 'Я долго искал ключи и наконец нашёл их.',
            es: 'Estuve mucho rato buscando las llaves y por fin las encontré.',
          },
          {
            ru: 'Она долго учила стихотворение и наконец выучила его.',
            es: 'Estuvo mucho tiempo estudiando el poema y por fin se lo aprendió.',
          },
        ],
      },
    },
    {
      id: 'asp1-q5',
      kind: 'choice',
      format: 'verdadero-falso',
      skill: 'aspecto.presente-futuro',
      instruction: 'Verdadero o falso: «Я буду прочитать эту книгу» es una forma correcta del futuro.',
      optionsLang: 'es',
      correctOptionId: 'b',
      options: [
        {
          id: 'a',
          text: 'Verdadero',
          errorType: 'aspecto.futuro-compuesto',
          whyWrong:
            'буду + infinitivo solo se forma con imperfectivos (буду читать). El futuro del perfectivo es simple: прочитаю.',
        },
        { id: 'b', text: 'Falso' },
      ],
      explanation: {
        rule: 'Futuro imperfectivo: буду + infinitivo imperfectivo. Futuro perfectivo: forma conjugada (прочитаю).',
        whyCorrect:
          'Es falso: se dice «Я буду читать эту книгу» (proceso) o «Я прочитаю эту книгу» (resultado).',
        examples: [
          { ru: 'Завтра я буду работать весь день.', es: 'Mañana estaré trabajando todo el día.' },
          { ru: 'Я сделаю это завтра.', es: 'Lo haré mañana.' },
        ],
      },
    },
    {
      id: 'asp1-q6',
      kind: 'multi',
      skill: 'aspecto.pasado',
      instruction: 'Selecciona los marcadores que suelen acompañar al imperfectivo.',
      correctOptionIds: ['a', 'b', 'c', 'd'],
      options: [
        { id: 'a', text: 'каждый день', note: 'repetición («cada día»).' },
        { id: 'b', text: 'часто', note: 'frecuencia («a menudo»).' },
        { id: 'c', text: 'долго', note: 'duración («mucho tiempo»).' },
        { id: 'd', text: 'обычно', note: 'costumbre («normalmente»).' },
        {
          id: 'e',
          text: 'вдруг',
          errorType: 'aspecto.proceso-resultado',
          whyWrong:
            'вдруг («de repente») suele introducir una acción puntual, en perfectivo: вдруг зазвонил телефон.',
        },
        {
          id: 'f',
          text: 'наконец',
          errorType: 'aspecto.proceso-resultado',
          whyWrong:
            'наконец («por fin») suele marcar un resultado alcanzado, en perfectivo: наконец решил.',
        },
      ],
      explanation: {
        rule: 'Repetición, frecuencia, duración y costumbre → imperfectivo. Lo puntual y el resultado → perfectivo.',
        whyCorrect: 'каждый день, часто, долго y обычно describen repetición o duración.',
        examples: [
          { ru: 'Я часто смотрю этот сериал.', es: 'Veo a menudo esta serie.' },
          { ru: 'Вдруг пошёл дождь.', es: 'De repente empezó a llover.' },
        ],
      },
    },
    {
      id: 'asp1-q7',
      kind: 'match',
      skill: 'aspecto.pares',
      instruction: 'Relaciona cada imperfectivo con su perfectivo.',
      leftLang: 'ru',
      rightLang: 'ru',
      errorType: 'aspecto.par',
      pairs: [
        { id: 'p1', left: 'читать', right: 'прочитать' },
        { id: 'p2', left: 'говорить', right: 'сказать' },
        { id: 'p3', left: 'покупать', right: 'купить' },
        { id: 'p4', left: 'брать', right: 'взять' },
      ],
      explanation: {
        rule: 'Los pares se forman con prefijo (читать → прочитать), con cambio de sufijo (покупать → купить) o con raíces distintas (говорить → сказать, брать → взять).',
        whyCorrect: 'читать / прочитать, говорить / сказать, покупать / купить, брать / взять.',
        examples: [
          { ru: 'Что ты сказал?', es: '¿Qué has dicho?' },
          { ru: 'Возьми зонт.', es: 'Coge el paraguas.' },
        ],
      },
    },
    {
      id: 'asp1-q8',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'aspecto.presente-futuro',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'Я каждый день покупаю хлеб.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Compro pan todos los días»): repetición → imperfectivo.',
        },
        {
          id: 'b',
          text: 'Вчера я купил новый телефон.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Ayer me compré un teléfono nuevo»): acción única terminada → perfectivo.',
        },
        { id: 'c', text: 'Обычно я встану в семь часов.' },
        {
          id: 'd',
          text: 'Когда я читал, зазвонил телефон.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Cuando estaba leyendo, sonó el teléfono»): un proceso (читал) interrumpido por una acción puntual (зазвонил).',
        },
      ],
      explanation: {
        rule: 'Una costumbre en presente (обычно) pide imperfectivo.',
        whyCorrect:
          'La frase errónea es «Обычно я встану в семь часов»: встану es futuro perfectivo. Lo correcto es «Обычно я встаю в семь часов».',
        examples: [
          { ru: 'Обычно я встаю в семь часов.', es: 'Normalmente me levanto a las siete.' },
          { ru: 'Завтра я встану в шесть.', es: 'Mañana me levantaré a las seis.' },
        ],
      },
    },
    {
      id: 'asp1-q9',
      kind: 'match',
      skill: 'lex.cotidiano',
      instruction: 'Relaciona cada palabra de la lección con su significado.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'lexico.significado',
      pairs: [
        { id: 'p1', left: 'гото́вить', right: 'cocinar, preparar' },
        { id: 'p2', left: 'покупа́ть', right: 'comprar' },
        { id: 'p3', left: 'звони́ть', right: 'llamar por teléfono' },
        { id: 'p4', left: 'убира́ть', right: 'recoger, ordenar' },
        { id: 'p5', left: 'пить', right: 'beber' },
      ],
      explanation: {
        rule: 'Verbos de la vida diaria (imperfectivos). Sus perfectivos: пригото́вить, купи́ть, позвони́ть, убра́ть, вы́пить.',
        whyCorrect: 'готовить es cocinar; покупать, comprar; звонить, llamar por teléfono; убирать, recoger u ordenar, y пить, beber.',
        examples: [
          { ru: 'Мама готовит ужин.', es: 'Mamá prepara la cena.' },
          { ru: 'Я уже приготовил борщ.', es: 'Ya he preparado el borsch.' },
        ],
      },
    },
  ],
}
