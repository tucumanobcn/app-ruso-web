import type { Lesson } from '../types'

export const instrumental1: Lesson = {
  id: 'instrumental-1',
  title: 'El instrumental: con quién y con qué',
  level: 'A2',
  topic: 'Casos gramaticales',
  type: 'monografica',
  objective:
    'Reconocer y formar el instrumental singular en cuatro usos frecuentes: compañía con с, profesiones, verbos que lo exigen y pronombres.',
  prerequisites: [
    'Nominativo singular y género de los sustantivos',
    'Pronombres personales en nominativo',
  ],
  estimatedMinutes: 7,
  status: 'disponible',
  intro: {
    title: 'El instrumental en dos minutos',
    illustration: 'instr-s',
    paragraphs: [
      'El instrumental responde a las preguntas кем? (¿con quién?, ¿como quién?) y чем? (¿con qué?).',
      'En esta lección lo usarás en cuatro situaciones: compañía con с (чай с лимоном), profesión con работать o стать (работать врачом), verbos que lo exigen (интересоваться историей) y pronombres (со мной).',
    ],
    tables: [
      {
        caption: 'Terminaciones del singular',
        headers: ['Tipo', 'Nominativo', 'Instrumental', 'Terminación'],
        ruColumns: [1, 2, 3],
        rows: [
          ['Masculino en consonante', 'стол', 'столом', '-ом'],
          ['Masculino en -й, -ь', 'музей, учитель', 'музеем, учителем', '-ем'],
          ['Neutro', 'окно, море', 'окном, морем', '-ом / -ем'],
          ['Femenino en -а, -я', 'мама, история', 'мамой, историей', '-ой / -ей'],
          ['Femenino en -ь', 'дверь', 'дверью', '-ью'],
        ],
        note: 'Tras ж, ш, ч, щ, ц se escribe -ом si la terminación es tónica (врачом, отцом) y -ем si es átona (товарищем, месяцем).',
      },
      {
        caption: 'Pronombres personales',
        headers: ['Nominativo', 'Instrumental', 'Tras preposición'],
        ruColumns: [0, 1, 2],
        rows: [
          ['я', 'мной', 'со мной'],
          ['ты', 'тобой', 'с тобой'],
          ['он, оно', 'им', 'с ним'],
          ['она', 'ей', 'с ней'],
          ['мы', 'нами', 'с нами'],
          ['вы', 'вами', 'с вами'],
          ['они', 'ими', 'с ними'],
        ],
        note: 'Tras preposición, los pronombres de tercera persona añaden н-: с ним, с ней, с ними.',
      },
    ],
  },
  questions: [
    {
      id: 'instr1-q1',
      kind: 'choice',
      format: 'completar',
      skill: 'instr.compania',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я пью чай с ___.',
      translation: 'Tomo té con limón.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'лимоном' },
        {
          id: 'b',
          text: 'лимон',
          errorType: 'caso.nominativo',
          whyWrong:
            'лимон es el nominativo, la forma del diccionario. Tras с con el sentido de «con» hace falta el instrumental.',
        },
        {
          id: 'c',
          text: 'лимона',
          errorType: 'caso.genitivo',
          whyWrong:
            'лимона es genitivo. с + genitivo existe, pero significa «desde» o «de encima de» (с утра, со стола), no «con».',
        },
        {
          id: 'd',
          text: 'лимону',
          errorType: 'caso.dativo',
          whyWrong: 'лимону es dativo. La preposición с nunca se combina con el dativo.',
        },
      ],
      explanation: {
        rule: 'с + instrumental expresa compañía o acompañamiento. Los masculinos terminados en consonante añaden -ом.',
        whyCorrect:
          'En чай с лимоном, с significa «con» y exige instrumental. лимон es masculino terminado en consonante: лимон → лимоном.',
        examples: [
          { ru: 'Я люблю кофе с молоком.', es: 'Me gusta el café con leche.' },
          { ru: 'Она гуляет с собакой.', es: 'Ella pasea con el perro.' },
        ],
      },
    },
    {
      id: 'instr1-q2',
      kind: 'choice',
      format: 'completar',
      skill: 'instr.regimen',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Я интересуюсь ___.',
      translation: 'Me interesa la historia.',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'историю',
          errorType: 'caso.acusativo',
          whyWrong:
            'историю es acusativo. Sería correcto con любить o изучать (Я изучаю историю), pero интересоваться no lleva complemento directo: rige instrumental.',
        },
        {
          id: 'b',
          text: 'истории',
          errorType: 'caso.otro-oblicuo',
          whyWrong:
            'истории puede ser genitivo, dativo o prepositivo singular, pero ninguno de esos casos va con интересоваться.',
        },
        { id: 'c', text: 'историей' },
        {
          id: 'd',
          text: 'история',
          errorType: 'caso.nominativo',
          whyWrong:
            'история es el nominativo. Con интересоваться, quien se interesa es el sujeto (я) y aquello que interesa va en instrumental.',
        },
      ],
      explanation: {
        rule: 'Algunos verbos rigen instrumental: интересоваться, заниматься, увлекаться. Los femeninos en -а / -я toman -ой / -ей.',
        whyCorrect:
          'интересоваться (интересоваться чем?) exige instrumental. история es femenino en -я, que en instrumental pasa a -ей: история → историей.',
        examples: [
          { ru: 'Она интересуется музыкой.', es: 'A ella le interesa la música.' },
          { ru: 'Мой отец интересуется политикой.', es: 'A mi padre le interesa la política.' },
        ],
      },
    },
    {
      id: 'instr1-q3',
      kind: 'choice',
      format: 'completar',
      skill: 'instr.profesion',
      instruction: 'Completa la frase con la forma correcta.',
      prompt: 'Мой брат работает ___.',
      translation: 'Mi hermano trabaja de médico.',
      correctOptionId: 'b',
      options: [
        {
          id: 'a',
          text: 'врач',
          errorType: 'caso.nominativo',
          whyWrong:
            'врач es nominativo. Sería correcto sin verbo, en presente: «Мой брат — врач» (Mi hermano es médico). Con работать hace falta instrumental.',
        },
        { id: 'b', text: 'врачом' },
        {
          id: 'c',
          text: 'врача',
          errorType: 'caso.genitivo-acusativo',
          whyWrong:
            'врача es genitivo o acusativo (en sustantivos masculinos animados coinciden). Ninguno de los dos expresa la profesión.',
        },
        {
          id: 'd',
          text: 'врачу',
          errorType: 'caso.dativo',
          whyWrong: 'врачу es dativo («al médico»), como en «Я позвонил врачу» (Llamé al médico).',
        },
      ],
      explanation: {
        rule: 'работать, стать y быть (en pasado o futuro) llevan instrumental para indicar profesión. Tras ж, ш, ч, щ, ц: -ом si la terminación es tónica, -ем si es átona.',
        whyCorrect:
          'работать кем? exige instrumental. врач termina en ч y el acento cae en la terminación, por eso toma -ом: врач → врачом.',
        examples: [
          { ru: 'Она работает учительницей.', es: 'Ella trabaja de profesora.' },
          { ru: 'Он хочет стать инженером.', es: 'Él quiere ser ingeniero.' },
        ],
      },
    },
    {
      id: 'instr1-q4',
      kind: 'choice',
      format: 'seleccionar',
      skill: 'instr.pronombres',
      instruction: 'Elige la opción que significa «conmigo».',
      prompt: 'Ты пойдёшь в кино ___?',
      translation: '¿Irás al cine conmigo?',
      correctOptionId: 'd',
      options: [
        {
          id: 'a',
          text: 'с мной',
          errorType: 'preposicion.forma',
          whyWrong:
            'El caso es correcto (мной es instrumental), pero delante de мной la preposición toma la forma со para facilitar la pronunciación: siempre se dice со мной.',
        },
        {
          id: 'b',
          text: 'с меня',
          errorType: 'caso.genitivo',
          whyWrong:
            'с меня existe, pero es с + genitivo y significa «de mí» o «a mi cargo», como en «С меня хватит» (Ya tengo bastante). No expresa compañía.',
        },
        {
          id: 'c',
          text: 'с мне',
          errorType: 'caso.dativo',
          whyWrong:
            'мне es dativo (o prepositivo, como en обо мне). La preposición с nunca va con dativo.',
        },
        { id: 'd', text: 'со мной' },
      ],
      explanation: {
        rule: 'с + instrumental significa «con». Pronombres en instrumental: мной, тобой, им, ей, нами, вами, ими.',
        whyCorrect:
          'Para expresar compañía se usa с + instrumental. El instrumental de я es мной, y delante de мной la preposición se escribe со: со мной.',
        examples: [
          { ru: 'Пойдём со мной!', es: '¡Ven conmigo!' },
          { ru: 'Я часто говорю с ним по телефону.', es: 'Hablo a menudo con él por teléfono.' },
        ],
      },
    },
    {
      id: 'instr1-q5',
      kind: 'choice',
      format: 'identificar-error',
      skill: 'instr.regimen',
      instruction: '¿Qué frase contiene un error?',
      correctOptionId: 'c',
      options: [
        {
          id: 'a',
          text: 'Я пишу ручкой.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Escribo con bolígrafo»): el instrumental sin preposición indica el instrumento con el que se hace algo.',
        },
        {
          id: 'b',
          text: 'Он стал инженером.',
          errorType: 'deteccion.falso-error',
          whyWrong: 'Esta frase es correcta («Se hizo ingeniero»): стать rige instrumental.',
        },
        { id: 'c', text: 'Мы занимаемся музыку.' },
        {
          id: 'd',
          text: 'Она пришла с подругой.',
          errorType: 'deteccion.falso-error',
          whyWrong:
            'Esta frase es correcta («Vino con una amiga»): с + instrumental expresa compañía.',
        },
      ],
      explanation: {
        rule: 'заниматься (dedicarse a, practicar) rige instrumental: заниматься спортом, музыкой, русским языком.',
        whyCorrect:
          'La frase errónea es «Мы занимаемся музыку»: музыку es acusativo. заниматься exige instrumental, así que lo correcto es «Мы занимаемся музыкой» (музыка → музыкой).',
        examples: [
          { ru: 'Мы занимаемся музыкой.', es: 'Hacemos música.' },
          { ru: 'Я занимаюсь спортом каждый день.', es: 'Hago deporte todos los días.' },
        ],
      },
    },
    {
      id: 'instr1-q6',
      kind: 'choice',
      format: 'completar',
      skill: 'lex.cotidiano',
      alsoEvaluates: ['instr.compania'],
      instruction: 'Completa la frase con la palabra de la lección en la forma correcta.',
      prompt: 'Я люблю чай с ___.',
      translation: 'Me gusta el té con miel.',
      correctOptionId: 'a',
      options: [
        { id: 'a', text: 'мёдом' },
        {
          id: 'b',
          text: 'мёд',
          errorType: 'caso.nominativo',
          whyWrong: 'мёд es nominativo. с con el sentido de «con» exige instrumental.',
        },
        {
          id: 'c',
          text: 'мёда',
          errorType: 'caso.genitivo',
          whyWrong: 'мёда es genitivo, como en «банка мёда» (un tarro de miel).',
        },
        {
          id: 'd',
          text: 'мёду',
          errorType: 'caso.genitivo',
          whyWrong: 'мёду es una forma partitiva del genitivo (немного мёду, un poco de miel), no instrumental.',
        },
      ],
      explanation: {
        rule: 'с + instrumental. Los masculinos en consonante toman -ом.',
        whyCorrect: 'Чай с мёдом: с exige instrumental y мёд añade -ом.',
        examples: [
          { ru: 'Бабушка пьёт чай с малиной.', es: 'La abuela toma té con frambuesa.' },
          { ru: 'Блины с икрой — праздничное блюдо.', es: 'Los blinis con caviar son un plato de fiesta.' },
        ],
      },
    },
  ],
}
