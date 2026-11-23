import type { Lesson } from '../types'

export const dativo1: Lesson = {
  id: 'dativo-1',
  title: 'El dativo: a quién',
  level: 'A2',
  topic: 'Casos gramaticales',
  type: 'monografica',
  objective:
    'Usar el dativo singular para el destinatario, con verbos como помогать y звонить, en construcciones como мне нравится o мне двадцать лет, y con к.',
  prerequisites: ['Acusativo singular', 'Pronombres personales en nominativo'],
  estimatedMinutes: 9,
  status: 'disponible',
  intro: {
    title: 'El dativo en dos minutos',
    illustration: 'dat-podarok',
    paragraphs: [
      'El dativo responde a кому? чему? (¿a quién?, ¿a qué?). Marca el destinatario (дать, подарить, написать кому), va con verbos como помогать, звонить y советовать, y expresa a quién le pasa algo: Мне нравится, Мне холодно, Мне двадцать лет.',
      'Con к indica hacia quién vas: к врачу, к другу.',
    ],
    tables: [
      {
        caption: 'Terminaciones del singular',
        headers: ['Tipo', 'Nominativo', 'Dativo', 'Terminación'],
        ruColumns: [1, 2, 3],
        rows: [
          ['Masculino y neutro', 'брат, окно', 'брату, окну', '-у'],
          ['Masculino en -й, -ь', 'музей, учитель', 'музею, учителю', '-ю'],
          ['Femenino en -а, -я', 'мама, Таня', 'маме, Тане', '-е'],
          ['Femenino en -ия, -ь', 'Мария, тетрадь', 'Марии, тетради', '-и'],
        ],
      },
      {
        caption: 'Pronombres personales',
        headers: ['Nominativo', 'Dativo', 'Tras preposición'],
        ruColumns: [0, 1, 2],
        rows: [
          ['я', 'мне', 'ко мне'],
          ['ты', 'тебе', 'к тебе'],
          ['он', 'ему', 'к нему'],
          ['она', 'ей', 'к ней'],
          ['мы', 'нам', 'к нам'],
          ['вы', 'вам', 'к вам'],
          ['они', 'им', 'к ним'],
        ],
      },
    ],
  },
  questions: [
    {
      id: 'dat1-q1',
      kind: 'choice',
      format: 'completar',
      skill: 'dat.destinatario',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я часто помогаю ___.',
      translation: 'Ayudo a menudo a mi hermano.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'брату' },
        {
          id: 'b',
          text: 'брата',
          errorType: 'regimen.calco',
          whyWrong:
            'En español «ayudar a alguien» lleva complemento directo, pero помогать rige dativo: помогать брату.',
        },
        {
          id: 'c',
          text: 'братом',
          errorType: 'caso.instrumental',
          whyWrong: 'братом es instrumental («con mi hermano»).',
        },
        {
          id: 'd',
          text: 'брат',
          errorType: 'caso.nominativo',
          whyWrong: 'брат es nominativo: sería el sujeto.',
        },
      ],
      explanation: {
        rule: 'помогать, звонить, советовать, мешать + dativo.',
        whyCorrect: 'помогать кому? rige dativo: брат → брату.',
        examples: [
          { ru: 'Она помогает маме на кухне.', es: 'Ella ayuda a su madre en la cocina.' },
          { ru: 'Я посоветовал другу этот фильм.', es: 'Le recomendé esta película a mi amigo.' },
        ],
      },
    },
    {
      id: 'dat1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'dat.impersonal',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: '___ нравится эта книга.',
      translation: 'Me gusta este libro.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Мне' },
        {
          id: 'b',
          text: 'Я',
          errorType: 'estructura.impersonal',
          whyWrong:
            'Con нравиться, quien siente el gusto va en dativo y lo que gusta es el sujeto (книга).',
        },
        {
          id: 'c',
          text: 'Меня',
          errorType: 'caso.genitivo-acusativo',
          whyWrong: 'меня es genitivo o acusativo, como en «Меня зовут Анна».',
        },
        {
          id: 'd',
          text: 'Мной',
          errorType: 'caso.instrumental',
          whyWrong: 'мной es instrumental («conmigo» en со мной).',
        },
      ],
      explanation: {
        rule: 'нравиться: la persona en dativo, lo que gusta en nominativo; el verbo concuerda con lo que gusta.',
        whyCorrect: 'Мне (dativo de я) + нравится + эта книга (sujeto).',
        examples: [
          { ru: 'Тебе нравятся эти фильмы?', es: '¿Te gustan estas películas?' },
          { ru: 'Моему отцу нравится джаз.', es: 'A mi padre le gusta el jazz.' },
        ],
      },
    },
    {
      id: 'dat1-q3',
      kind: 'choice',
      format: 'completar',
      skill: 'dat.destinatario',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Завтра я позвоню ___.',
      translation: 'Mañana llamaré a María.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Марии' },
        {
          id: 'b',
          text: 'Марие',
          errorType: 'terminacion.ия',
          whyWrong: 'Los nombres en -ия forman el dativo en -и, no en -е: Марии.',
        },
        {
          id: 'c',
          text: 'Марию',
          errorType: 'regimen.calco',
          whyWrong:
            'Марию es acusativo, por calco de «llamar a María». звонить rige dativo.',
        },
        {
          id: 'd',
          text: 'Мария',
          errorType: 'caso.nominativo',
          whyWrong: 'Мария es nominativo.',
        },
      ],
      explanation: {
        rule: 'звонить кому? + dativo. Los femeninos en -ия hacen el dativo en -ии.',
        whyCorrect: 'позвонить rige dativo; Мария termina en -ия: Марии.',
        examples: [
          { ru: 'Позвони мне вечером.', es: 'Llámame por la tarde.' },
          { ru: 'Мы подарили Виктории цветы.', es: 'Le regalamos flores a Victoria.' },
        ],
      },
    },
    {
      id: 'dat1-q4',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'dat.impersonal',
      instruction: 'Elige la forma correcta.',
      prompt: 'Сколько тебе лет? — ___ двадцать пять лет.',
      translation: '¿Cuántos años tienes? — Tengo veinticinco años.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'Мне' },
        {
          id: 'b',
          text: 'У меня',
          errorType: 'estructura.impersonal',
          whyWrong:
            'Calco de «tengo 25 años». La edad se expresa con dativo, sin у ni есть.',
        },
        {
          id: 'c',
          text: 'Я',
          errorType: 'estructura.impersonal',
          whyWrong: 'Construcción personal calcada. La persona va en dativo.',
        },
      ],
      explanation: {
        rule: 'Edad: persona en dativo + número + год / года / лет.',
        whyCorrect: 'Мне (dativo) двадцать пять лет.',
        examples: [
          { ru: 'Моему сыну три года.', es: 'Mi hijo tiene tres años.' },
          { ru: 'Сколько лет твоей бабушке?', es: '¿Cuántos años tiene tu abuela?' },
        ],
      },
    },
    {
      id: 'dat1-q5',
      kind: 'choice',
      format: 'completar',
      skill: 'dat.k',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Вечером я иду к ___.',
      translation: 'Por la tarde voy al médico.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'врачу' },
        {
          id: 'b',
          text: 'врача',
          errorType: 'caso.genitivo-acusativo',
          whyWrong: 'врача es genitivo o acusativo. к siempre rige dativo.',
        },
        {
          id: 'c',
          text: 'врачом',
          errorType: 'caso.instrumental',
          whyWrong: 'врачом es instrumental, como en «Он работает врачом».',
        },
        {
          id: 'd',
          text: 'врач',
          errorType: 'caso.nominativo',
          whyWrong: 'врач es nominativo.',
        },
      ],
      explanation: {
        rule: 'к + dativo: ir hacia una persona o a su casa (к врачу, к бабушке).',
        whyCorrect: 'к + dativo: врач → к врачу.',
        examples: [
          { ru: 'Завтра мы едем к бабушке.', es: 'Mañana vamos a casa de la abuela.' },
          { ru: 'Приходи ко мне в субботу.', es: 'Ven a mi casa el sábado.' },
        ],
      },
    },
    {
      id: 'dat1-q6',
      kind: 'multi',
      skill: 'dat.destinatario',
      instruction: '¿Qué verbos rigen dativo? Selecciona todos.',
      correctOptionIds: ['a', 'b', 'c'],
      options: [
        { id: 'a', text: 'помогать', note: 'помогать кому: помогать другу.' },
        { id: 'b', text: 'звонить', note: 'звонить кому: звонить маме.' },
        { id: 'c', text: 'советовать', note: 'советовать кому: советовать брату.' },
        {
          id: 'd',
          text: 'видеть',
          errorType: 'caso.dativo',
          whyWrong: 'видеть rige acusativo: видеть друга.',
        },
        {
          id: 'e',
          text: 'любить',
          errorType: 'caso.dativo',
          whyWrong: 'любить rige acusativo: любить маму.',
        },
        {
          id: 'f',
          text: 'спрашивать',
          errorType: 'caso.dativo',
          whyWrong: 'спрашивать rige acusativo: спрашивать учителя.',
        },
      ],
      explanation: {
        rule: 'Verbos frecuentes con dativo: помогать, звонить, советовать, мешать, отвечать (кому), обещать.',
        whyCorrect:
          'помогать, звонить y советовать rigen dativo; видеть, любить y спрашивать rigen acusativo.',
        examples: [
          { ru: 'Я отвечаю учителю.', es: 'Respondo al profesor.' },
          { ru: 'Не мешай папе!', es: '¡No molestes a papá!' },
        ],
      },
    },
    {
      id: 'dat1-q7',
      kind: 'match',
      skill: 'dat.impersonal',
      instruction: 'Relaciona cada frase con su traducción.',
      leftLang: 'ru',
      rightLang: 'es',
      errorType: 'relacion.incorrecta',
      pairs: [
        { id: 'p1', left: 'Мне холодно.', right: 'Tengo frío.' },
        { id: 'p2', left: 'Мне нужно идти.', right: 'Tengo que irme.' },
        { id: 'p3', left: 'Мне скучно.', right: 'Me aburro.' },
        { id: 'p4', left: 'Мне двадцать лет.', right: 'Tengo veinte años.' },
      ],
      explanation: {
        rule: 'Estados, necesidad y edad: persona en dativo + adverbio, нужно o número.',
        whyCorrect: 'Las cuatro construcciones son impersonales, con la persona en dativo (мне).',
        examples: [
          { ru: 'Тебе не холодно?', es: '¿No tienes frío?' },
          { ru: 'Нам нужно поговорить.', es: 'Tenemos que hablar.' },
        ],
      },
    },
    {
      id: 'dat1-q8',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'dat.destinatario',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'Я дал книгу другу.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Le di el libro a mi amigo»): el destinatario va en dativo.',
        },
        {
          id: 'b',
          text: 'Мы позвонили маме.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Llamamos a mamá»): звонить + dativo.',
        },
        { id: 'c', text: 'Она помогает подругу.' },
        {
          id: 'd',
          text: 'Ему нравится футбол.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Le gusta el fútbol»): la persona va en dativo.',
        },
      ],
      explanation: {
        rule: 'помогать rige dativo.',
        whyCorrect:
          'La frase errónea es «Она помогает подругу»: подругу es acusativo. Lo correcto es «Она помогает подруге».',
        examples: [
          { ru: 'Она помогает подруге.', es: 'Ella ayuda a su amiga.' },
          { ru: 'Помоги мне, пожалуйста.', es: 'Ayúdame, por favor.' },
        ],
      },
    },
    {
      id: 'dat1-q9',
      kind: 'choice',
      format: 'completar',
      skill: 'lex.cotidiano',
      alsoEvaluates: ['dat.k'],
      instruction: 'Completa la frase con la palabra de la lección en la forma correcta.',
      prompt: 'В субботу мы едем к ___.',
      translation: 'El sábado vamos a casa de la abuela.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'бабушке' },
        {
          id: 'b',
          text: 'бабушку',
          errorType: 'caso.acusativo',
          whyWrong: 'бабушку es acusativo. к siempre rige dativo.',
        },
        {
          id: 'c',
          text: 'бабушки',
          errorType: 'caso.genitivo',
          whyWrong: 'бабушки es genitivo, como en «у бабушки» (en casa de la abuela).',
        },
        {
          id: 'd',
          text: 'бабушкой',
          errorType: 'caso.instrumental',
          whyWrong: 'бабушкой es instrumental («con la abuela»).',
        },
      ],
      explanation: {
        rule: 'к + dativo: ir a casa de alguien. Los sustantivos en -а toman -е.',
        whyCorrect: 'к rige dativo: бабушка → к бабушке.',
        examples: [
          { ru: 'Внук часто звонит дедушке.', es: 'El nieto llama a menudo a su abuelo.' },
          { ru: 'Я помогаю соседу.', es: 'Ayudo a mi vecino.' },
        ],
      },
    },
  ],
}
