/**
 * Plantillas de variantes. Cada plantilla es una frase con hueco y una lista de
 * palabras; la respuesta correcta y las opciones incorrectas se toman de las formas
 * verificadas de OpenRussian (forms.generated.ts), nunca se escriben a mano.
 * Marcadores en los textos: {x} = elemento en español, {f} = forma elegida,
 * {lemma} = palabra en diccionario, {form} = forma correcta, {prep} = preposición correcta.
 */
import type { ErrorTypeId, SkillId } from '../glossary'
import type { Example } from '../types'
import type { CaseKey } from '../vocab/formTypes'

interface TemplateBase {
  id: string
  skill: SkillId
  alsoEvaluates?: SkillId[]
  instruction: string
  rule: string
  whyCorrect: string
  examples: Example[]
}

export interface Distractor<K> {
  key: K
  errorType: ErrorTypeId
  whyWrong: string
}

/** Un sustantivo en el hueco; la plantilla fija el caso correcto. */
export interface NounCaseTemplate extends TemplateBase {
  kind: 'noun-case'
  prompt: string
  translation: string
  target: CaseKey
  distractors: Distractor<CaseKey>[]
  items: { lemma: string; es: string }[]
}

/** Preposición + sustantivo en el hueco (в / на, lugar o dirección). */
export interface PlaceTemplate extends TemplateBase {
  kind: 'place'
  mode: 'lugar' | 'direccion'
  prompt: string
  /** {x} recibe «la escuela», «el museo»…; «a el» y «de el» se contraen. */
  translation: string
  wrong: {
    otherPreposition: string
    wrongCase: string
    both: string
  }
  items: { lemma: string; prep: 'в' | 'на'; es: string }[]
}

/** Forma personal de идти / ходить. */
export interface PersonTemplate extends TemplateBase {
  kind: 'person'
  verb: string
  /** Verbo de la pareja, para la opción incorrecta unidireccional / multidireccional. */
  partnerVerb: string
  partnerWhyWrong: string
  items: { person: number; prompt: string; translation: string }[]
}

/** Aspecto en pasado: duración (imperfectivo) o secuencia (perfectivo). */
export interface AspectTemplate extends TemplateBase {
  kind: 'aspect'
  items: { imperfective: string; perfective: string; object: string; esDuration: string; esSequence: string }[]
}

/**
 * Pronombres personales: clase cerrada, así que sus formas se escriben aquí a mano
 * (tabla estándar de la gramática rusa) en lugar de tomarse de OpenRussian.
 */
export interface PronounTemplate extends TemplateBase {
  kind: 'pronoun'
  prompt: string
  translation: string
  items: {
    id: string
    es: string
    correct: string
    wrong: { text: string; errorType: ErrorTypeId; whyWrong: string }[]
  }[]
}

/** Pares aspectuales: elegir el perfectivo de un imperfectivo (formas de OpenRussian). */
export interface PairTemplate extends TemplateBase {
  kind: 'pair'
  items: { imperfective: string; perfective: string; es: string }[]
}

export type Template =
  | NounCaseTemplate
  | PlaceTemplate
  | PersonTemplate
  | AspectTemplate
  | PronounTemplate
  | PairTemplate

const nominativo = (extra: string): Distractor<CaseKey> => ({
  key: 'sg_nom',
  errorType: 'caso.nominativo',
  whyWrong: `{f} es el nominativo, la forma del diccionario. ${extra}`,
})

export const TEMPLATES: Template[] = [
  {
    kind: 'noun-case',
    id: 'instr-te',
    skill: 'instr.compania',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Я пью чай с ___.',
    translation: 'Tomo té con {x}.',
    target: 'sg_inst',
    distractors: [
      nominativo('Tras с con el sentido de «con» hace falta el instrumental.'),
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo: с + genitivo significa «desde» (с утра), no «con».' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo; la preposición с nunca va con dativo.' },
    ],
    items: [
      { lemma: 'лимон', es: 'limón' },
      { lemma: 'мёд', es: 'miel' },
      { lemma: 'сахар', es: 'azúcar' },
      { lemma: 'молоко', es: 'leche' },
      { lemma: 'малина', es: 'frambuesa' },
      { lemma: 'варенье', es: 'mermelada' },
    ],
    rule: 'с + instrumental expresa acompañamiento: чай с лимоном, кофе с молоком.',
    whyCorrect: 'с («con») exige instrumental: {lemma} → {form}.',
    examples: [
      { ru: 'Я люблю кофе с молоком.', es: 'Me gusta el café con leche.' },
      { ru: 'Бабушка пьёт чай с малиной.', es: 'La abuela toma té con frambuesa.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'instr-gulyat',
    skill: 'instr.compania',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Вечером я гуляю с ___.',
    translation: 'Por la tarde paseo con {x}.',
    target: 'sg_inst',
    distractors: [
      nominativo('Para «con alguien» hace falta с + instrumental.'),
      { key: 'sg_acc', errorType: 'caso.acusativo', whyWrong: '{f} es acusativo; para «con alguien» hace falta el instrumental.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo; la preposición с nunca va con dativo.' },
    ],
    items: [
      { lemma: 'брат', es: 'mi hermano' },
      { lemma: 'сестра', es: 'mi hermana' },
      { lemma: 'друг', es: 'un amigo' },
      { lemma: 'подруга', es: 'una amiga' },
      { lemma: 'собака', es: 'el perro' },
      { lemma: 'мама', es: 'mamá' },
      { lemma: 'сосед', es: 'mi vecino' },
    ],
    rule: 'с + instrumental expresa compañía: с другом, с мамой.',
    whyCorrect: 'с («con») exige instrumental: {lemma} → {form}.',
    examples: [
      { ru: 'Она гуляет с собакой.', es: 'Ella pasea con el perro.' },
      { ru: 'Я часто говорю с ним по телефону.', es: 'Hablo a menudo con él por teléfono.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'instr-interes',
    skill: 'instr.regimen',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Я интересуюсь ___.',
    translation: 'Me interesa {x}.',
    target: 'sg_inst',
    distractors: [
      { key: 'sg_acc', errorType: 'regimen.calco', whyWrong: '{f} es acusativo. Sería correcto con любить o изучать, pero интересоваться rige instrumental.' },
      nominativo('Con интересоваться, quien se interesa es el sujeto; lo que interesa va en instrumental.'),
      { key: 'sg_prep', errorType: 'caso.prepositivo', whyWrong: '{f} es prepositivo, el caso de «говорить о …»; aquí no hay preposición.' },
    ],
    items: [
      { lemma: 'история', es: 'la historia' },
      { lemma: 'музыка', es: 'la música' },
      { lemma: 'политика', es: 'la política' },
      { lemma: 'спорт', es: 'el deporte' },
      { lemma: 'литература', es: 'la literatura' },
      { lemma: 'математика', es: 'las matemáticas' },
      { lemma: 'искусство', es: 'el arte' },
    ],
    rule: 'интересоваться, заниматься y увлекаться rigen instrumental.',
    whyCorrect: 'интересоваться чем? rige instrumental: {lemma} → {form}.',
    examples: [
      { ru: 'Она интересуется музыкой.', es: 'A ella le interesa la música.' },
      { ru: 'Мой отец интересуется политикой.', es: 'A mi padre le interesa la política.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'instr-zanimatsya',
    skill: 'instr.regimen',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Моя сестра занимается ___.',
    translation: 'Mi hermana hace {x}.',
    target: 'sg_inst',
    distractors: [
      { key: 'sg_acc', errorType: 'regimen.calco', whyWrong: '{f} es acusativo, como el complemento directo español («hace deporte»), pero заниматься rige instrumental.' },
      nominativo('заниматься pide instrumental.'),
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo; заниматься rige instrumental.' },
    ],
    items: [
      { lemma: 'спорт', es: 'deporte' },
      { lemma: 'музыка', es: 'música' },
      { lemma: 'плавание', es: 'natación' },
    ],
    rule: 'заниматься (dedicarse a, practicar) rige instrumental.',
    whyCorrect: 'заниматься чем? rige instrumental: {lemma} → {form}.',
    examples: [
      { ru: 'Я занимаюсь спортом каждый день.', es: 'Hago deporte todos los días.' },
      { ru: 'Мы занимаемся музыкой.', es: 'Hacemos música.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'instr-profesion',
    skill: 'instr.profesion',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Мой брат работает ___.',
    translation: 'Mi hermano trabaja de {x}.',
    target: 'sg_inst',
    distractors: [
      nominativo('Sería correcto sin verbo, en presente («Мой брат — …»), pero работать pide instrumental.'),
      { key: 'sg_acc', errorType: 'caso.genitivo-acusativo', whyWrong: '{f} es genitivo o acusativo (coinciden en los masculinos animados); ninguno expresa la profesión.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo («a …»), el caso del destinatario.' },
    ],
    items: [
      { lemma: 'учитель', es: 'profesor' },
      { lemma: 'инженер', es: 'ingeniero' },
      { lemma: 'программист', es: 'programador' },
      { lemma: 'повар', es: 'cocinero' },
      { lemma: 'водитель', es: 'conductor' },
      { lemma: 'журналист', es: 'periodista' },
      { lemma: 'врач', es: 'médico' },
    ],
    rule: 'работать, стать y быть (en pasado o futuro) llevan instrumental para la profesión.',
    whyCorrect: 'работать кем? rige instrumental: {lemma} → {form}.',
    examples: [
      { ru: 'Она работает учительницей.', es: 'Ella trabaja de profesora.' },
      { ru: 'Он хочет стать инженером.', es: 'Él quiere ser ingeniero.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'prep-v-lugar',
    skill: 'prep.lugar',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Мы сейчас в ___.',
    translation: 'Ahora estamos en {x}.',
    target: 'sg_prep',
    distractors: [
      { key: 'sg_acc', errorType: 'caso.lugar-direccion', whyWrong: '{f} es acusativo: con в indica adónde vas (Я иду в …), no dónde estás.' },
      nominativo('Tras в con el sentido de «dónde» hace falta el prepositivo.'),
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo, el caso de «из …» (de dónde vienes).' },
    ],
    items: [
      { lemma: 'школа', es: 'la escuela' },
      { lemma: 'библиотека', es: 'la biblioteca' },
      { lemma: 'магазин', es: 'la tienda' },
      { lemma: 'музей', es: 'el museo' },
      { lemma: 'театр', es: 'el teatro' },
      { lemma: 'парк', es: 'el parque' },
      { lemma: 'банк', es: 'el banco' },
      { lemma: 'аптека', es: 'la farmacia' },
    ],
    rule: 'в / на + prepositivo indica dónde está algo o alguien (где?).',
    whyCorrect: 'в con el sentido de «dónde» exige prepositivo: {lemma} → {form}.',
    examples: [
      { ru: 'Мы были в музее.', es: 'Estuvimos en el museo.' },
      { ru: 'Дети играют в парке.', es: 'Los niños juegan en el parque.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'prep-na-lugar',
    skill: 'prep.lugar',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Папа сейчас на ___.',
    translation: 'Papá está ahora en {x}.',
    target: 'sg_prep',
    distractors: [
      { key: 'sg_acc', errorType: 'caso.lugar-direccion', whyWrong: '{f} es acusativo: con на indica adónde vas (Я иду на …), no dónde estás.' },
      nominativo('Tras на con el sentido de «dónde» hace falta el prepositivo.'),
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo, el caso de «с …» (de dónde vienes).' },
    ],
    items: [
      { lemma: 'работа', es: 'el trabajo' },
      { lemma: 'почта', es: 'correos' },
      { lemma: 'вокзал', es: 'la estación' },
      { lemma: 'рынок', es: 'el mercado' },
      { lemma: 'концерт', es: 'un concierto' },
      { lemma: 'стадион', es: 'el estadio' },
      { lemma: 'улица', es: 'la calle' },
      { lemma: 'остановка', es: 'la parada' },
    ],
    rule: 'в / на + prepositivo indica dónde está algo o alguien (где?).',
    whyCorrect: 'на con el sentido de «dónde» exige prepositivo: {lemma} → {form}.',
    examples: [
      { ru: 'Она сейчас на почте.', es: 'Ella está ahora en correos.' },
      { ru: 'Дети играют на улице.', es: 'Los niños juegan en la calle.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'prep-o',
    skill: 'prep.o',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Мы долго говорили о ___.',
    translation: 'Estuvimos mucho rato hablando de {x}.',
    target: 'sg_prep',
    distractors: [
      { key: 'sg_acc', errorType: 'caso.acusativo', whyWrong: '{f} es acusativo; tras о con el sentido de «sobre, de» va el prepositivo.' },
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo; о rige prepositivo.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo; о rige prepositivo.' },
    ],
    items: [
      { lemma: 'брат', es: 'mi hermano' },
      { lemma: 'сестра', es: 'mi hermana' },
      { lemma: 'фильм', es: 'la película' },
      { lemma: 'книга', es: 'el libro' },
      { lemma: 'работа', es: 'el trabajo' },
      { lemma: 'погода', es: 'el tiempo (meteorológico)' },
      { lemma: 'путешествие', es: 'el viaje' },
      { lemma: 'политика', es: 'política' },
    ],
    rule: 'говорить, думать, рассказывать о + prepositivo.',
    whyCorrect: 'о («sobre, de») exige prepositivo: {lemma} → {form}.',
    examples: [
      { ru: 'Расскажи мне о своей работе.', es: 'Háblame de tu trabajo.' },
      { ru: 'Мы говорили о фильме.', es: 'Hablábamos de la película.' },
    ],
  },
  {
    // Solo sustantivos contables: con los incontables (сыр, молоко) el genitivo partitivo
    // («купил сыра») también sería correcto y no podría ser opción incorrecta.
    kind: 'noun-case',
    id: 'acus-objeto',
    skill: 'acus.objeto',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Вчера я купил ___.',
    translation: 'Ayer compré {x}.',
    target: 'sg_acc',
    distractors: [
      nominativo('Lo comprado es el objeto directo: acusativo (los femeninos en -а cambian a -у).'),
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo; comprar algo concreto lleva acusativo.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo.' },
      { key: 'sg_prep', errorType: 'caso.prepositivo', whyWrong: '{f} es prepositivo.' },
    ],
    items: [
      { lemma: 'книга', es: 'un libro' },
      { lemma: 'машина', es: 'un coche' },
      { lemma: 'билет', es: 'una entrada' },
      { lemma: 'компьютер', es: 'un ordenador' },
      { lemma: 'велосипед', es: 'una bicicleta' },
      { lemma: 'яблоко', es: 'una manzana' },
      { lemma: 'карта', es: 'un mapa' },
    ],
    rule: 'Acusativo del objeto directo: femeninos en -а → -у; masculinos y neutros inanimados no cambian.',
    whyCorrect: 'купить что? rige acusativo: {lemma} → {form}.',
    examples: [
      { ru: 'Я читаю книгу.', es: 'Leo un libro.' },
      { ru: 'Мы купили новый телефон.', es: 'Nos compramos un teléfono nuevo.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'acus-animado',
    skill: 'acus.animacion',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Вчера я видел ___ в парке.',
    translation: 'Ayer vi {x} en el parque.',
    target: 'sg_acc',
    distractors: [
      {
        key: 'sg_nom',
        errorType: 'animacion.animado-como-inanimado',
        whyWrong: '{f} es nominativo. Los masculinos animados toman en acusativo la forma del genitivo.',
      },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo («a …» como destinatario: дать …).' },
      { key: 'sg_inst', errorType: 'caso.instrumental', whyWrong: '{f} es instrumental («con …»).' },
    ],
    items: [
      { lemma: 'брат', es: 'a mi hermano' },
      { lemma: 'друг', es: 'a un amigo' },
      { lemma: 'сосед', es: 'a mi vecino' },
      { lemma: 'учитель', es: 'a mi profesor' },
      { lemma: 'отец', es: 'a tu padre' },
      { lemma: 'сын', es: 'a tu hijo' },
      { lemma: 'кот', es: 'a tu gato' },
    ],
    rule: 'Masculinos animados: el acusativo es igual al genitivo (брат → брата).',
    whyCorrect: 'видеть кого? rige acusativo; {lemma} es masculino animado y su acusativo coincide con el genitivo: {form}.',
    examples: [
      { ru: 'Я знаю твоего брата.', es: 'Conozco a tu hermano.' },
      { ru: 'Мы ждём учителя.', es: 'Esperamos al profesor.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'gen-net',
    skill: 'gen.negacion',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'У меня нет ___.',
    translation: 'No tengo {x}.',
    target: 'sg_gen',
    distractors: [
      nominativo('Con есть sería correcto (У меня есть …), pero con нет hace falta el genitivo.'),
      { key: 'sg_acc', errorType: 'caso.acusativo', whyWrong: '{f} es acusativo; нет no rige acusativo.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo; lo que falta va en genitivo.' },
    ],
    items: [
      { lemma: 'машина', es: 'coche' },
      { lemma: 'велосипед', es: 'bicicleta' },
      { lemma: 'дача', es: 'dacha' },
      { lemma: 'собака', es: 'perro' },
      { lemma: 'кошка', es: 'gato' },
      { lemma: 'компьютер', es: 'ordenador' },
      { lemma: 'брат', es: 'hermano' },
    ],
    rule: 'нет + genitivo: lo que falta o no existe va en genitivo.',
    whyCorrect: 'нет exige genitivo: {lemma} → {form}.',
    examples: [
      { ru: 'У нас нет времени.', es: 'No tenemos tiempo.' },
      { ru: 'Сегодня нет урока.', es: 'Hoy no hay clase.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'gen-dva',
    skill: 'gen.cantidad',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'У меня два ___.',
    translation: 'Tengo dos {x}.',
    target: 'sg_gen',
    distractors: [
      { key: 'sg_nom', errorType: 'numero.2-4', whyWrong: '{f} es nominativo singular; tras 2, 3 y 4 hace falta el genitivo singular.' },
      { key: 'pl_gen', errorType: 'numero.2-4', whyWrong: '{f} es genitivo plural, que se usa a partir de 5 (пять …).' },
      { key: 'pl_nom', errorType: 'numero.2-4', whyWrong: '{f} es nominativo plural; tras 2, 3 y 4 va el genitivo singular.' },
    ],
    items: [
      { lemma: 'брат', es: 'hermanos' },
      { lemma: 'друг', es: 'amigos íntimos' },
      { lemma: 'сын', es: 'hijos' },
      { lemma: 'билет', es: 'entradas' },
      { lemma: 'компьютер', es: 'ordenadores' },
      { lemma: 'велосипед', es: 'bicicletas' },
      { lemma: 'кот', es: 'gatos' },
    ],
    rule: 'Tras 2, 3, 4: genitivo singular. Tras 5 a 20: genitivo plural.',
    whyCorrect: 'два + genitivo singular: {lemma} → {form}.',
    examples: [
      { ru: 'Я жил там три года.', es: 'Viví allí tres años.' },
      { ru: 'В квартире четыре комнаты.', es: 'El piso tiene cuatro habitaciones.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'dat-zvonit',
    skill: 'dat.destinatario',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Я часто звоню ___.',
    translation: 'Llamo a menudo a {x}.',
    target: 'sg_dat',
    distractors: [
      { key: 'sg_acc', errorType: 'regimen.calco', whyWrong: '{f} es acusativo, como en español («llamar a alguien»), pero звонить rige dativo.' },
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo; звонить rige dativo.' },
      { key: 'sg_inst', errorType: 'caso.instrumental', whyWrong: '{f} es instrumental («con …»).' },
    ],
    items: [
      { lemma: 'мама', es: 'mi madre' },
      { lemma: 'брат', es: 'mi hermano' },
      { lemma: 'сестра', es: 'mi hermana' },
      { lemma: 'подруга', es: 'una amiga' },
      { lemma: 'бабушка', es: 'mi abuela' },
      { lemma: 'дедушка', es: 'mi abuelo' },
      { lemma: 'сосед', es: 'mi vecino' },
    ],
    rule: 'звонить, помогать y советовать rigen dativo.',
    whyCorrect: 'звонить кому? rige dativo: {lemma} → {form}.',
    examples: [
      { ru: 'Позвони мне вечером.', es: 'Llámame por la tarde.' },
      { ru: 'Внук часто звонит дедушке.', es: 'El nieto llama a menudo a su abuelo.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'dat-k',
    skill: 'dat.k',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Сегодня вечером я иду к ___.',
    translation: 'Esta tarde voy a {x}.',
    target: 'sg_dat',
    distractors: [
      { key: 'sg_gen', errorType: 'caso.lugar-direccion', whyWrong: '{f} es genitivo, el caso de «у …» (en casa de): indica dónde estás, no adónde vas.' },
      { key: 'sg_acc', errorType: 'caso.acusativo', whyWrong: '{f} es acusativo; к siempre rige dativo.' },
      { key: 'sg_inst', errorType: 'caso.instrumental', whyWrong: '{f} es instrumental («con …»).' },
    ],
    items: [
      { lemma: 'врач', es: 'el médico' },
      { lemma: 'бабушка', es: 'casa de mi abuela' },
      { lemma: 'подруга', es: 'casa de una amiga' },
      { lemma: 'дедушка', es: 'casa de mi abuelo' },
      { lemma: 'брат', es: 'casa de mi hermano' },
    ],
    rule: 'к + dativo: ir hacia una persona o a su casa.',
    whyCorrect: 'к exige dativo: {lemma} → {form}.',
    examples: [
      { ru: 'Завтра мы едем к бабушке.', es: 'Mañana vamos a casa de la abuela.' },
      { ru: 'Приходи ко мне в субботу.', es: 'Ven a mi casa el sábado.' },
    ],
  },
  {
    kind: 'place',
    id: 'acus-direccion',
    mode: 'direccion',
    skill: 'acus.direccion',
    alsoEvaluates: ['prep.v-na'],
    instruction: 'Elige la opción correcta.',
    prompt: 'Завтра я иду ___.',
    translation: 'Mañana voy a {x}.',
    wrong: {
      otherPreposition: 'El caso es correcto, pero con este lugar se usa {prep}.',
      wrongCase: '{f} indica dónde estás (prepositivo); para adónde vas hace falta el acusativo.',
      both: 'Falla dos veces: con este lugar se usa {prep}, y para adónde vas hace falta el acusativo.',
    },
    items: [
      { lemma: 'школа', prep: 'в', es: 'la escuela' },
      { lemma: 'библиотека', prep: 'в', es: 'la biblioteca' },
      { lemma: 'магазин', prep: 'в', es: 'la tienda' },
      { lemma: 'музей', prep: 'в', es: 'el museo' },
      { lemma: 'театр', prep: 'в', es: 'el teatro' },
      { lemma: 'банк', prep: 'в', es: 'el banco' },
      { lemma: 'аптека', prep: 'в', es: 'la farmacia' },
      { lemma: 'работа', prep: 'на', es: 'el trabajo' },
      { lemma: 'почта', prep: 'на', es: 'correos' },
      { lemma: 'вокзал', prep: 'на', es: 'la estación' },
      { lemma: 'рынок', prep: 'на', es: 'el mercado' },
      { lemma: 'концерт', prep: 'на', es: 'un concierto' },
      { lemma: 'стадион', prep: 'на', es: 'el estadio' },
    ],
    rule: 'в / на + acusativo responde a куда? (¿adónde?). Cada lugar va siempre con la misma preposición: в школу / в школе, на работу / на работе.',
    whyCorrect: 'Dirección con {prep}: {prep} + acusativo, {lemma} → {form}.',
    examples: [
      { ru: 'Вечером мы идём в кино.', es: 'Por la tarde vamos al cine.' },
      { ru: 'Она едет на работу.', es: 'Ella va (en transporte) al trabajo.' },
    ],
  },
  {
    kind: 'place',
    id: 'prep-v-na',
    mode: 'lugar',
    skill: 'prep.v-na',
    alsoEvaluates: ['prep.lugar'],
    instruction: 'Elige la opción correcta.',
    prompt: 'Я жду тебя ___.',
    translation: 'Te espero en {x}.',
    wrong: {
      otherPreposition: 'El caso es correcto, pero con este lugar se usa {prep}.',
      wrongCase: '{f} indica adónde vas (acusativo); para dónde estás hace falta el prepositivo.',
      both: 'Falla dos veces: con este lugar se usa {prep}, y para dónde estás hace falta el prepositivo.',
    },
    items: [
      { lemma: 'школа', prep: 'в', es: 'la escuela' },
      { lemma: 'библиотека', prep: 'в', es: 'la biblioteca' },
      { lemma: 'магазин', prep: 'в', es: 'la tienda' },
      { lemma: 'музей', prep: 'в', es: 'el museo' },
      { lemma: 'театр', prep: 'в', es: 'el teatro' },
      { lemma: 'банк', prep: 'в', es: 'el banco' },
      { lemma: 'аптека', prep: 'в', es: 'la farmacia' },
      { lemma: 'почта', prep: 'на', es: 'correos' },
      { lemma: 'вокзал', prep: 'на', es: 'la estación' },
      { lemma: 'рынок', prep: 'на', es: 'el mercado' },
      { lemma: 'концерт', prep: 'на', es: 'el concierto' },
      { lemma: 'стадион', prep: 'на', es: 'el estadio' },
      { lemma: 'остановка', prep: 'на', es: 'la parada' },
    ],
    rule: 'в: espacios cerrados; на: espacios abiertos, eventos y combinaciones fijas (на почте, на вокзале). Para dónde: prepositivo.',
    whyCorrect: '{lemma} va con {prep}, y para dónde estás hace falta prepositivo: {form}.',
    examples: [
      { ru: 'Я жду тебя на вокзале.', es: 'Te espero en la estación.' },
      { ru: 'Мы были в музее.', es: 'Estuvimos en el museo.' },
    ],
  },
  {
    kind: 'person',
    id: 'mov-idti',
    skill: 'mov.conjugacion',
    alsoEvaluates: ['mov.idti-hodit'],
    instruction: 'Elige la forma correcta del verbo.',
    verb: 'идти',
    partnerVerb: 'ходить',
    partnerWhyWrong: '{f} es de ходить: preguntaría adónde va habitualmente. Para un trayecto concreto ahora se usa идти.',
    items: [
      { person: 1, prompt: '— Куда ты ___? — Домой.', translation: '—¿Adónde vas? —A casa.' },
      { person: 2, prompt: '— Куда он ___? — Домой.', translation: '—¿Adónde va (él)? —A casa.' },
      { person: 3, prompt: '— Куда мы ___? — Домой.', translation: '—¿Adónde vamos? —A casa.' },
      { person: 4, prompt: '— Куда вы ___? — Домой.', translation: '—¿Adónde vais? —A casa.' },
      { person: 5, prompt: '— Куда они ___? — Домой.', translation: '—¿Adónde van? —A casa.' },
    ],
    rule: 'идти: иду, идёшь, идёт, идём, идёте, идут.',
    whyCorrect: 'Trayecto concreto ahora → идти, y con este sujeto la forma es {form}.',
    examples: [
      { ru: 'Куда вы идёте?', es: '¿Adónde vais?' },
      { ru: 'Мы идём в парк.', es: 'Vamos al parque.' },
    ],
  },
  {
    kind: 'person',
    id: 'mov-hodit',
    skill: 'mov.conjugacion',
    alsoEvaluates: ['mov.idti-hodit'],
    instruction: 'Elige la forma correcta del verbo.',
    verb: 'ходить',
    partnerVerb: 'идти',
    partnerWhyWrong: '{f} es de идти (un trayecto concreto). Para una costumbre (часто, каждый день) se usa ходить.',
    items: [
      { person: 0, prompt: 'Я часто ___ в бассейн.', translation: 'Voy a menudo a la piscina.' },
      { person: 1, prompt: 'Ты часто ___ в бассейн?', translation: '¿Vas a menudo a la piscina?' },
      { person: 2, prompt: 'Она часто ___ в бассейн.', translation: 'Ella va a menudo a la piscina.' },
      { person: 3, prompt: 'Мы часто ___ в бассейн.', translation: 'Vamos a menudo a la piscina.' },
      { person: 4, prompt: 'Вы часто ___ в бассейн?', translation: '¿Vais a menudo a la piscina?' },
      { person: 5, prompt: 'Они часто ___ в бассейн.', translation: 'Van a menudo a la piscina.' },
    ],
    rule: 'ходить: хожу, ходишь, ходит, ходим, ходите, ходят.',
    whyCorrect: 'Costumbre (часто) → ходить, y con este sujeto la forma es {form}.',
    examples: [
      { ru: 'Он часто ходит в театр.', es: 'Va a menudo al teatro.' },
      { ru: 'Дети ходят в школу.', es: 'Los niños van al colegio.' },
    ],
  },
  {
    kind: 'pronoun',
    id: 'instr-pronombre',
    skill: 'instr.pronombres',
    instruction: 'Completa la frase con el pronombre en la forma correcta.',
    prompt: 'Я часто говорю с ___ по телефону.',
    translation: 'Hablo a menudo por teléfono {x}.',
    items: [
      {
        id: 'on',
        es: 'con él',
        correct: 'ним',
        wrong: [
          { text: 'им', errorType: 'pronombre.n', whyWrong: 'им es el instrumental de он, pero tras preposición se añade н-: с ним.' },
          { text: 'него', errorType: 'caso.genitivo-acusativo', whyWrong: 'него es genitivo o acusativo (у него, на него).' },
          { text: 'нему', errorType: 'caso.dativo', whyWrong: 'нему es dativo (к нему).' },
        ],
      },
      {
        id: 'ona',
        es: 'con ella',
        correct: 'ней',
        wrong: [
          { text: 'ей', errorType: 'pronombre.n', whyWrong: 'ей es la forma sin preposición; tras с se añade н-: с ней.' },
          { text: 'неё', errorType: 'caso.genitivo-acusativo', whyWrong: 'неё es genitivo o acusativo (у неё, на неё).' },
          { text: 'она', errorType: 'caso.nominativo', whyWrong: 'она es nominativo; tras с hace falta el instrumental.' },
        ],
      },
      {
        id: 'my',
        es: 'con nosotros',
        correct: 'нами',
        wrong: [
          { text: 'нас', errorType: 'caso.genitivo-acusativo', whyWrong: 'нас es genitivo o acusativo (у нас, для нас).' },
          { text: 'нам', errorType: 'caso.dativo', whyWrong: 'нам es dativo (к нам).' },
          { text: 'мы', errorType: 'caso.nominativo', whyWrong: 'мы es nominativo; tras с hace falta el instrumental.' },
        ],
      },
      {
        id: 'vy',
        es: 'con vosotros',
        correct: 'вами',
        wrong: [
          { text: 'вас', errorType: 'caso.genitivo-acusativo', whyWrong: 'вас es genitivo o acusativo (у вас, для вас).' },
          { text: 'вам', errorType: 'caso.dativo', whyWrong: 'вам es dativo (к вам).' },
          { text: 'вы', errorType: 'caso.nominativo', whyWrong: 'вы es nominativo; tras с hace falta el instrumental.' },
        ],
      },
      {
        id: 'oni',
        es: 'con ellos',
        correct: 'ними',
        wrong: [
          { text: 'ими', errorType: 'pronombre.n', whyWrong: 'ими es el instrumental de они, pero tras preposición se añade н-: с ними.' },
          { text: 'них', errorType: 'caso.genitivo-acusativo', whyWrong: 'них es genitivo o acusativo (у них, на них).' },
          { text: 'ним', errorType: 'caso.dativo', whyWrong: 'ним es el dativo de они (к ним) o el instrumental de он (с ним), no el instrumental de они.' },
        ],
      },
      {
        id: 'ty',
        es: 'contigo',
        correct: 'тобой',
        wrong: [
          { text: 'тебя', errorType: 'caso.genitivo-acusativo', whyWrong: 'тебя es genitivo o acusativo (у тебя, для тебя).' },
          { text: 'тебе', errorType: 'caso.dativo', whyWrong: 'тебе es dativo o prepositivo (к тебе, о тебе).' },
          { text: 'ты', errorType: 'caso.nominativo', whyWrong: 'ты es nominativo; tras с hace falta el instrumental.' },
        ],
      },
    ],
    rule: 'Pronombres en instrumental: мной, тобой, им, ей, нами, вами, ими. Tras preposición, los de tercera persona añaden н-: с ним, с ней, с ними.',
    whyCorrect: 'с («con») exige instrumental: {form}.',
    examples: [
      { ru: 'Пойдём со мной!', es: '¡Ven conmigo!' },
      { ru: 'Мы работаем с ними.', es: 'Trabajamos con ellos.' },
    ],
  },
  {
    kind: 'aspect',
    id: 'aspecto',
    skill: 'aspecto.pasado',
    instruction: 'Elige el verbo adecuado.',
    items: [
      { imperfective: 'читать', perfective: 'прочитать', object: 'книгу', esDuration: 'leyendo un libro', esSequence: 'Leí el libro' },
      { imperfective: 'писать', perfective: 'написать', object: 'письмо', esDuration: 'escribiendo una carta', esSequence: 'Escribí la carta' },
      { imperfective: 'готовить', perfective: 'приготовить', object: 'ужин', esDuration: 'preparando la cena', esSequence: 'Preparé la cena' },
      { imperfective: 'смотреть', perfective: 'посмотреть', object: 'фильм', esDuration: 'viendo una película', esSequence: 'Vi la película' },
      { imperfective: 'делать', perfective: 'сделать', object: 'уроки', esDuration: 'haciendo los deberes', esSequence: 'Hice los deberes' },
    ],
    rule: 'Duración (весь вечер) → imperfectivo; acción terminada en una secuencia → perfectivo.',
    whyCorrect: '{form} es el aspecto adecuado: {lemma}.',
    examples: [
      { ru: 'Мы долго гуляли по городу.', es: 'Paseamos mucho rato por la ciudad.' },
      { ru: 'Он встал, оделся и вышел.', es: 'Se levantó, se vistió y salió.' },
    ],
  },
  // ---------- Fase 4b: plural ----------
  {
    kind: 'noun-case',
    id: 'pl-mnogo',
    skill: 'plural.genitivo',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'В этом городе много ___.',
    translation: 'En esta ciudad hay {x}.',
    target: 'pl_gen',
    distractors: [
      { key: 'pl_nom', errorType: 'caso.nominativo', whyWrong: '{f} es nominativo plural; tras много va el genitivo plural.' },
      { key: 'sg_gen', errorType: 'numero.cantidad', whyWrong: '{f} es genitivo singular: con много y algo que se cuenta, va el plural.' },
      { key: 'pl_prep', errorType: 'caso.prepositivo', whyWrong: '{f} es prepositivo plural (в …).' },
    ],
    items: [
      { lemma: 'магазин', es: 'muchas tiendas' },
      { lemma: 'музей', es: 'muchos museos' },
      { lemma: 'театр', es: 'muchos teatros' },
      { lemma: 'парк', es: 'muchos parques' },
      { lemma: 'библиотека', es: 'muchas bibliotecas' },
      { lemma: 'аптека', es: 'muchas farmacias' },
      { lemma: 'школа', es: 'muchas escuelas' },
      { lemma: 'банк', es: 'muchos bancos' },
      { lemma: 'машина', es: 'muchos coches' },
      { lemma: 'трамвай', es: 'muchos tranvías' },
    ],
    rule: 'много, мало, сколько + genitivo plural.',
    whyCorrect: 'много exige genitivo plural: {lemma} → {form}.',
    examples: [
      { ru: 'В Москве много театров.', es: 'En Moscú hay muchos teatros.' },
      { ru: 'На улице много машин.', es: 'En la calle hay muchos coches.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'pl-pyat',
    skill: 'plural.genitivo',
    alsoEvaluates: ['gen.cantidad'],
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'У нас пять ___.',
    translation: 'Tenemos cinco {x}.',
    target: 'pl_gen',
    distractors: [
      { key: 'sg_gen', errorType: 'numero.2-4', whyWrong: '{f} es genitivo singular, la forma de 2, 3 y 4. A partir de 5 va el genitivo plural.' },
      { key: 'pl_nom', errorType: 'caso.nominativo', whyWrong: '{f} es nominativo plural; tras пять hace falta el genitivo plural.' },
      { key: 'sg_nom', errorType: 'numero.2-4', whyWrong: '{f} es nominativo singular: solo va tras 1 (один, двадцать один…).' },
    ],
    items: [
      { lemma: 'брат', es: 'hermanos' },
      { lemma: 'сестра', es: 'hermanas' },
      { lemma: 'билет', es: 'entradas' },
      { lemma: 'книга', es: 'libros' },
      { lemma: 'кошка', es: 'gatos' },
      { lemma: 'собака', es: 'perros' },
      { lemma: 'компьютер', es: 'ordenadores' },
      { lemma: 'яблоко', es: 'manzanas' },
    ],
    rule: 'A partir de 5 (y de 11 a 14): genitivo plural.',
    whyCorrect: 'пять + genitivo plural: {lemma} → {form}.',
    examples: [
      { ru: 'У меня два брата.', es: 'Tengo dos hermanos.' },
      { ru: 'Это стоит пять рублей.', es: 'Cuesta cinco rublos.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'pl-dat',
    skill: 'plural.oblicuos',
    alsoEvaluates: ['dat.destinatario'],
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Я часто помогаю ___.',
    translation: 'Ayudo a menudo a {x}.',
    target: 'pl_dat',
    distractors: [
      { key: 'pl_acc', errorType: 'regimen.calco', whyWrong: '{f} es acusativo plural (igual que el genitivo en los animados), como en español; помогать rige dativo.' },
      { key: 'pl_inst', errorType: 'caso.instrumental', whyWrong: '{f} es instrumental plural («con …»).' },
      { key: 'pl_nom', errorType: 'caso.nominativo', whyWrong: '{f} es nominativo plural: serían el sujeto.' },
    ],
    items: [
      { lemma: 'друг', es: 'mis amigos' },
      { lemma: 'сосед', es: 'los vecinos' },
      { lemma: 'брат', es: 'mis hermanos' },
      { lemma: 'сестра', es: 'mis hermanas' },
      { lemma: 'учитель', es: 'los profesores' },
    ],
    rule: 'Dativo plural: -ам / -ям en todos los géneros.',
    whyCorrect: 'помогать rige dativo; en plural: {form}.',
    examples: [
      { ru: 'Я часто звоню друзьям.', es: 'Llamo a menudo a mis amigos.' },
      { ru: 'Мы подарили детям книги.', es: 'Les regalamos libros a los niños.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'pl-inst',
    skill: 'plural.oblicuos',
    alsoEvaluates: ['instr.compania'],
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'В выходные я гуляю с ___.',
    translation: 'Los fines de semana paseo con {x}.',
    target: 'pl_inst',
    distractors: [
      { key: 'pl_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo plural; с nunca va con dativo.' },
      { key: 'pl_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo plural: с + genitivo significa «desde», no «con».' },
      { key: 'pl_nom', errorType: 'caso.nominativo', whyWrong: '{f} es nominativo plural; tras с («con») va el instrumental.' },
    ],
    items: [
      { lemma: 'друг', es: 'mis amigos' },
      { lemma: 'брат', es: 'mis hermanos' },
      { lemma: 'сестра', es: 'mis hermanas' },
      { lemma: 'сосед', es: 'los vecinos' },
      { lemma: 'собака', es: 'los perros' },
    ],
    rule: 'Instrumental plural: -ами / -ями en todos los géneros.',
    whyCorrect: 'с («con») exige instrumental; en plural: {form}.',
    examples: [
      { ru: 'Мы работаем с ними.', es: 'Trabajamos con ellos.' },
      { ru: 'Я пью чай с друзьями.', es: 'Tomo té con mis amigos.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'pl-prep',
    skill: 'plural.oblicuos',
    alsoEvaluates: ['prep.o'],
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Мы долго говорили о ___.',
    translation: 'Estuvimos mucho rato hablando de {x}.',
    target: 'pl_prep',
    distractors: [
      { key: 'pl_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo plural (много …); о rige prepositivo.' },
      { key: 'pl_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo plural; о rige prepositivo.' },
      { key: 'pl_acc', errorType: 'caso.acusativo', whyWrong: '{f} es nominativo o acusativo plural; tras о con el sentido de «de, sobre» va el prepositivo.' },
    ],
    items: [
      { lemma: 'фильм', es: 'películas' },
      { lemma: 'книга', es: 'libros' },
      { lemma: 'путешествие', es: 'viajes' },
      { lemma: 'друг', es: 'nuestros amigos' },
      { lemma: 'музей', es: 'museos' },
      { lemma: 'машина', es: 'coches' },
    ],
    rule: 'Prepositivo plural: -ах / -ях en todos los géneros.',
    whyCorrect: 'о + prepositivo; en plural: {form}.',
    examples: [
      { ru: 'Она рассказала о своих путешествиях.', es: 'Habló de sus viajes.' },
      { ru: 'В магазинах сегодня много людей.', es: 'Hoy hay mucha gente en las tiendas.' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'pl-acus-anim',
    skill: 'plural.acusativo',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Я часто вижу ___ в парке.',
    translation: 'Veo a menudo {x} en el parque.',
    target: 'pl_acc',
    distractors: [
      {
        key: 'pl_nom',
        errorType: 'animacion.animado-como-inanimado',
        whyWrong: '{f} es nominativo plural. En plural, los animados de todos los géneros toman en acusativo la forma del genitivo.',
      },
      { key: 'pl_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo plural.' },
      { key: 'pl_inst', errorType: 'caso.instrumental', whyWrong: '{f} es instrumental plural («con …»).' },
    ],
    items: [
      { lemma: 'сосед', es: 'a los vecinos' },
      { lemma: 'друг', es: 'a mis amigos' },
      { lemma: 'сестра', es: 'a mis hermanas' },
      { lemma: 'брат', es: 'a mis hermanos' },
      { lemma: 'собака', es: 'perros' },
      { lemma: 'кошка', es: 'gatos' },
    ],
    rule: 'Acusativo plural: animados = genitivo plural; inanimados = nominativo plural.',
    whyCorrect: 'видеть кого? rige acusativo; son seres animados, así que el acusativo plural coincide con el genitivo: {form}.',
    examples: [
      { ru: 'Я люблю кошек.', es: 'Me encantan los gatos.' },
      { ru: 'Я купил новые книги.', es: 'He comprado libros nuevos.' },
    ],
  },
  // ---------- Fase 4b: transporte, ехать / ездить ----------
  {
    kind: 'noun-case',
    id: 'mov-transporte',
    skill: 'mov.transporte',
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'Я езжу на работу на ___.',
    translation: 'Voy al trabajo en {x}.',
    target: 'sg_prep',
    distractors: [
      { key: 'sg_acc', errorType: 'caso.lugar-direccion', whyWrong: 'на {f} (acusativo) indica adónde vas, como en «опоздать на …» (perder el …). El medio de transporte va en prepositivo.' },
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo.' },
    ],
    items: [
      { lemma: 'автобус', es: 'autobús' },
      { lemma: 'машина', es: 'coche' },
      { lemma: 'поезд', es: 'tren' },
      { lemma: 'трамвай', es: 'tranvía' },
      { lemma: 'велосипед', es: 'bicicleta' },
      { lemma: 'электричка', es: 'el tren de cercanías' },
    ],
    rule: 'Medio de transporte: на + prepositivo (на автобусе, на поезде). на метро y на такси no cambian.',
    whyCorrect: 'на + prepositivo para el medio de transporte: {lemma} → {form}.',
    examples: [
      { ru: 'Мы поедем на поезде.', es: 'Iremos en tren.' },
      { ru: 'Я езжу на трамвае.', es: 'Voy en tranvía.' },
    ],
  },
  {
    kind: 'person',
    id: 'mov-ehat',
    skill: 'mov.conjugacion',
    alsoEvaluates: ['mov.ehat-ezdit'],
    instruction: 'Elige la forma correcta del verbo.',
    verb: 'ехать',
    partnerVerb: 'ездить',
    partnerWhyWrong: '{f} es de ездить: expresaría la costumbre. Para un trayecto concreto en transporte se usa ехать.',
    items: [
      { person: 0, prompt: 'Я сейчас ___ на вокзал на такси.', translation: 'Ahora voy a la estación en taxi.' },
      { person: 1, prompt: '— Куда ты ___ на машине? — На дачу.', translation: '—¿Adónde vas con el coche? —A la dacha.' },
      { person: 2, prompt: 'Смотри, вон ___ наш автобус!', translation: '¡Mira, ahí viene nuestro autobús!' },
      { person: 3, prompt: 'Завтра мы ___ в Петербург.', translation: 'Mañana nos vamos a San Petersburgo.' },
      { person: 4, prompt: 'Вы сейчас ___ на метро или на автобусе?', translation: '¿Ahora vais en metro o en autobús?' },
      { person: 5, prompt: 'Сейчас они ___ в аэропорт.', translation: 'Ahora van al aeropuerto.' },
    ],
    rule: 'ехать: еду, едешь, едет, едем, едете, едут.',
    whyCorrect: 'Trayecto concreto en transporte → ехать, y con este sujeto la forma es {form}.',
    examples: [
      { ru: 'Куда ты едешь?', es: '¿Adónde vas?' },
      { ru: 'Завтра я еду в Москву.', es: 'Mañana me voy a Moscú.' },
    ],
  },
  {
    kind: 'person',
    id: 'mov-ezdit',
    skill: 'mov.conjugacion',
    alsoEvaluates: ['mov.ehat-ezdit'],
    instruction: 'Elige la forma correcta del verbo.',
    verb: 'ездить',
    partnerVerb: 'ехать',
    partnerWhyWrong: '{f} es de ехать (un trayecto concreto). Para una costumbre en transporte se usa ездить.',
    items: [
      { person: 0, prompt: 'Я обычно ___ на работу на метро.', translation: 'Normalmente voy al trabajo en metro.' },
      { person: 1, prompt: 'Ты часто ___ к родителям?', translation: '¿Vas a menudo a casa de tus padres?' },
      { person: 2, prompt: 'Мой брат каждое лето ___ на море.', translation: 'Mi hermano va al mar cada verano.' },
      { person: 3, prompt: 'Мы редко ___ на машине.', translation: 'Rara vez vamos en coche.' },
      { person: 4, prompt: 'Вы часто ___ за границу?', translation: '¿Viajáis a menudo al extranjero?' },
      { person: 5, prompt: 'Они ___ на дачу каждые выходные.', translation: 'Van a la dacha todos los fines de semana.' },
    ],
    rule: 'ездить: езжу, ездишь, ездит, ездим, ездите, ездят.',
    whyCorrect: 'Costumbre en transporte → ездить, y con este sujeto la forma es {form}.',
    examples: [
      { ru: 'Я езжу на работу на метро.', es: 'Voy al trabajo en metro.' },
      { ru: 'Она часто ездит к родителям.', es: 'Va a menudo a casa de sus padres.' },
    ],
  },
  // ---------- Fase 4b: el cuerpo ----------
  {
    kind: 'noun-case',
    id: 'bolet-sg',
    skill: 'est.bolet',
    alsoEvaluates: ['lex.cuerpo'],
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'У меня болит ___.',
    translation: 'Me duele {x}.',
    target: 'sg_nom',
    distractors: [
      { key: 'sg_acc', errorType: 'caso.acusativo', whyWrong: '{f} es acusativo. Lo que duele es el sujeto de болит y va en nominativo.' },
      { key: 'sg_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo singular. Lo que duele va en nominativo.' },
      { key: 'sg_dat', errorType: 'caso.dativo', whyWrong: '{f} es dativo. La persona va con у + genitivo (у меня) y lo que duele, en nominativo.' },
    ],
    items: [
      { lemma: 'голова', es: 'la cabeza' },
      { lemma: 'живот', es: 'la barriga' },
      { lemma: 'спина', es: 'la espalda' },
      { lemma: 'нога', es: 'la pierna' },
      { lemma: 'рука', es: 'el brazo' },
      { lemma: 'зуб', es: 'una muela' },
      { lemma: 'ухо', es: 'el oído' },
      { lemma: 'глаз', es: 'el ojo' },
    ],
    rule: 'у меня + болит + nominativo singular (lo que duele).',
    whyCorrect: 'Lo que duele es el sujeto: nominativo, {form}.',
    examples: [
      { ru: 'У меня болит голова.', es: 'Me duele la cabeza.' },
      { ru: 'У тебя болит спина?', es: '¿Te duele la espalda?' },
    ],
  },
  {
    kind: 'noun-case',
    id: 'bolet-pl',
    skill: 'est.bolet',
    alsoEvaluates: ['lex.cuerpo', 'plural.nominativo'],
    instruction: 'Completa la frase con la forma correcta.',
    prompt: 'У меня болят ___.',
    translation: 'Me duelen {x}.',
    target: 'pl_nom',
    distractors: [
      { key: 'sg_nom', errorType: 'concordancia.numero', whyWrong: '{f} es singular, pero болят está en plural: hace falta el nominativo plural.' },
      { key: 'pl_gen', errorType: 'caso.genitivo', whyWrong: '{f} es genitivo plural (много …). Lo que duele va en nominativo.' },
      { key: 'pl_inst', errorType: 'caso.instrumental', whyWrong: '{f} es instrumental plural.' },
    ],
    items: [
      { lemma: 'нога', es: 'las piernas' },
      { lemma: 'рука', es: 'los brazos' },
      { lemma: 'глаз', es: 'los ojos' },
      { lemma: 'ухо', es: 'los oídos' },
      { lemma: 'зуб', es: 'los dientes' },
    ],
    rule: 'Con varias cosas, болят + nominativo plural. Ojo con los irregulares: глаза, уши.',
    whyCorrect: 'болят va con un sujeto plural en nominativo: {form}.',
    examples: [
      { ru: 'После марафона у меня болят ноги.', es: 'Después del maratón me duelen las piernas.' },
      { ru: 'У неё болят уши.', es: 'Le duelen los oídos.' },
    ],
  },
  // ---------- Fase 4b: pares aspectuales ----------
  {
    kind: 'pair',
    id: 'aspecto-pares',
    skill: 'aspecto.pares',
    instruction: 'Elige el perfectivo de este verbo.',
    items: [
      { imperfective: 'читать', perfective: 'прочитать', es: 'leer' },
      { imperfective: 'писать', perfective: 'написать', es: 'escribir' },
      { imperfective: 'делать', perfective: 'сделать', es: 'hacer' },
      { imperfective: 'смотреть', perfective: 'посмотреть', es: 'ver, mirar' },
      { imperfective: 'готовить', perfective: 'приготовить', es: 'cocinar, preparar' },
      { imperfective: 'покупать', perfective: 'купить', es: 'comprar' },
      { imperfective: 'говорить', perfective: 'сказать', es: 'decir' },
      { imperfective: 'брать', perfective: 'взять', es: 'coger, tomar' },
      { imperfective: 'звонить', perfective: 'позвонить', es: 'llamar por teléfono' },
      { imperfective: 'решать', perfective: 'решить', es: 'resolver, decidir' },
    ],
    rule: 'Los pares se forman con prefijo (читать → прочитать), con otro sufijo (покупать → купить) o con otra raíz (говорить → сказать, брать → взять).',
    whyCorrect: '{lemma} → {form}.',
    examples: [
      { ru: 'Что ты сказал?', es: '¿Qué has dicho?' },
      { ru: 'Возьми зонт.', es: 'Coge el paraguas.' },
    ],
  },
]
