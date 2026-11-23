/**
 * Catálogo de conocimientos (habilidades) y tipos de error.
 * Las preguntas los referencian por id; el historial de respuestas los guarda
 * para que las fases posteriores (dominio, puntos débiles, repasos) puedan usarlos.
 */

interface SkillInfo {
  label: string
  /** Recomendación breve de repaso cuando hay errores en este conocimiento. */
  review: string
}

export const SKILLS = {
  // Prepositivo
  'prep.lugar': {
    label: 'Prepositivo de lugar',
    review:
      'Repasa в / на + prepositivo para indicar dónde está algo: в Москве, в школе, на работе. La terminación general es -е; los sustantivos en -ия, -ие, -ий y los femeninos en -ь toman -и.',
  },
  'prep.v-na': {
    label: 'Elección entre в y на',
    review:
      'в para espacios cerrados, ciudades y países (в театре, в Испании); на para superficies, espacios abiertos y eventos (на столе, на улице, на концерте). Hay combinaciones fijas que conviene memorizar: на работе, на почте, на вокзале.',
  },
  'prep.o': {
    label: 'Prepositivo con о / об',
    review:
      'говорить, думать, рассказывать о + prepositivo: о брате, о Москве. Delante de vocal se usa об (об Анне) y con мне se dice обо мне. Los pronombres de tercera persona añaden н-: о нём, о ней, о них.',
  },

  // Acusativo
  'acus.objeto': {
    label: 'Acusativo de objeto directo',
    review:
      'Femeninos en -а → -у, en -я → -ю (маму, неделю); femeninos en -ь no cambian (дверь); masculinos y neutros inanimados no cambian (стол, окно).',
  },
  'acus.animacion': {
    label: 'Animados e inanimados en acusativo',
    review:
      'En masculino singular, los animados (personas y animales) toman la forma del genitivo (брата, Ивана) y los inanimados la del nominativo (журнал, стол).',
  },
  'acus.direccion': {
    label: 'Acusativo de dirección',
    review:
      'Con verbos de movimiento hacia un destino (идти, ехать, куда?) se usa в / на + acusativo: в школу, на работу. El prepositivo indica dónde estás (где?): в школе, на работе.',
  },

  // Genitivo
  'gen.negacion': {
    label: 'Genitivo con нет',
    review:
      'Con нет («no hay», «no tengo») lo que falta va en genitivo: нет машины, нет времени, у меня нет брата.',
  },
  'gen.posesion': {
    label: 'Genitivo de posesión y у + genitivo',
    review:
      'El poseedor va en genitivo detrás de lo poseído (машина Антона). Para «tener» se usa у + genitivo: у меня, у него, у Анны есть…',
  },
  'gen.cantidad': {
    label: 'Genitivo con números y cantidades',
    review:
      'Tras 2, 3, 4 el sustantivo va en genitivo singular (два брата); tras 5 o más y tras много, мало, сколько, en genitivo plural (пять братьев, много друзей), o en genitivo singular si no se cuenta (много работы).',
  },
  'gen.ortografia': {
    label: 'Ortografía del genitivo (-ы / -и)',
    review:
      'Tras г, к, х, ж, ш, ч, щ nunca se escribe ы, sino и: книги, ручки, подруги.',
  },

  // Dativo
  'dat.destinatario': {
    label: 'Dativo: destinatario y verbos que lo rigen',
    review:
      'El destinatario va en dativo (дать, подарить, написать кому?). También lo rigen помогать, звонить y советовать, aunque en español lleven complemento directo.',
  },
  'dat.impersonal': {
    label: 'Dativo en construcciones impersonales',
    review:
      'La persona que experimenta va en dativo: мне нравится, мне холодно, мне нужно, мне двадцать лет.',
  },
  'dat.k': {
    label: 'к + dativo',
    review:
      'к + dativo indica que vas hacia una persona o a su casa: идти к врачу, к другу. Para el lugar donde estás con alguien se usa у + genitivo: у друга.',
  },

  // Instrumental
  'instr.compania': {
    label: 'Instrumental con с («con»)',
    review:
      'Repasa с + instrumental para expresar compañía o acompañamiento: с другом, с мамой, кофе с молоком. Recuerda que с + genitivo significa «desde» (с утра, со стола).',
  },
  'instr.regimen': {
    label: 'Verbos que rigen instrumental',
    review:
      'Memoriza los verbos que piden instrumental aunque en español lleven complemento directo: интересоваться, заниматься, увлекаться.',
  },
  'instr.profesion': {
    label: 'Instrumental para profesiones',
    review:
      'работать, стать y быть (en pasado o futuro) van con instrumental: работать врачом, стать инженером, быть учителем.',
  },
  'instr.pronombres': {
    label: 'Pronombres en instrumental',
    review:
      'Repasa las formas мной, тобой, им, ей, нами, вами, ими; tras preposición: с ним, с ней, с ними, y la forma со мной.',
  },

  // Integración
  'casos.integracion': {
    label: 'Uso combinado de los casos',
    review:
      'Ante cada hueco, pregúntate qué lo exige: el verbo (помогать → dativo), la preposición (от → genitivo) o la función (objeto directo → acusativo).',
  },

  // Aspecto verbal
  'aspecto.pasado': {
    label: 'Aspecto en pasado: proceso o resultado',
    review:
      'Imperfectivo para procesos, duración y acciones repetidas (читал весь вечер); perfectivo para una acción completada con resultado o para secuencias (написал и пошёл).',
  },
  'aspecto.presente-futuro': {
    label: 'Aspecto en presente y futuro',
    review:
      'El perfectivo no tiene presente: прочитаю es futuro. El futuro compuesto (буду + infinitivo) solo se forma con imperfectivos: буду читать, nunca *буду прочитать.',
  },
  'aspecto.pares': {
    label: 'Pares aspectuales',
    review:
      'Aprende los verbos por parejas: читать / прочитать, делать / сделать, покупать / купить, говорить / сказать, брать / взять.',
  },

  // Verbos de movimiento
  'mov.idti-hodit': {
    label: 'идти frente a ходить',
    review:
      'идти: un trayecto en una dirección, ahora o en un momento concreto (Я иду в магазин). ходить: costumbre o repetición (хожу в бассейн), ida y vuelta en pasado (ходил в кино) o capacidad de andar.',
  },
  'mov.conjugacion': {
    label: 'Conjugación de los verbos de movimiento',
    review:
      'идти: иду, идёшь, идут (шёл); ходить: хожу, ходишь, ходят (ходил); ехать: еду, едешь, едут (ехал); ездить: езжу, ездишь, ездят (ездил).',
  },
  'mov.ehat-ezdit': {
    label: 'ехать frente a ездить',
    review:
      'Con transporte: ехать para un trayecto en una dirección, ahora o en un momento concreto (Я еду на работу); ездить para la costumbre o la ida y vuelta (Я езжу на дачу каждое лето, ездил в Испанию).',
  },
  'mov.transporte': {
    label: 'Medio de transporte (на + prepositivo)',
    review:
      'El medio de transporte va con на + prepositivo: на автобусе, на машине, на поезде, на трамвае; на метро y на такси no cambian.',
  },

  // Plural
  'plural.nominativo': {
    label: 'Nominativo plural',
    review:
      'Masculinos y femeninos: -ы / -и (столы, книги); neutros: -а / -я (окна, моря). Tras г, к, х, ж, ш, ч, щ siempre -и. Hay irregulares: брат → братья, друг → друзья, глаз → глаза.',
  },
  'plural.genitivo': {
    label: 'Genitivo plural',
    review:
      'Masculinos en consonante: -ов (билетов); en -й: -ев (музеев); en -ь o tras ж, ш, ч, щ: -ей (врачей); femeninos en -а y neutros en -о: sin terminación (книг, мест). Se usa con много, мало, сколько y a partir de 5.',
  },
  'plural.acusativo': {
    label: 'Acusativo plural de los animados',
    review:
      'En plural, los animados de todos los géneros toman en acusativo la forma del genitivo (вижу братьев, сестёр, собак); los inanimados, la del nominativo (вижу столы).',
  },
  'plural.oblicuos': {
    label: 'Dativo, instrumental y prepositivo plural',
    review:
      'Casi iguales para todos los géneros: dativo -ам / -ям, instrumental -ами / -ями, prepositivo -ах / -ях (друзьям, с друзьями, о друзьях).',
  },

  // Vocabulario y comunicación cotidiana
  'lex.cotidiano': {
    label: 'Vocabulario cotidiano ruso',
    review:
      'Repasa las tarjetas de vocabulario de cada lección: fíjate en el acento y en la forma destacada (на да́че, без смета́ны, чай с мёдом).',
  },
  'lex.cuerpo': {
    label: 'Partes del cuerpo',
    review:
      'Repasa голова́, глаз, у́хо, нос, рот, рука́, нога́, живо́т, спина́ y зуб, y sus plurales irregulares: глаза́, у́ши.',
  },
  'est.bolet': {
    label: 'Decir qué te duele (у меня болит)',
    review:
      'Lo que duele es el sujeto y va en nominativo: у меня болит голова́. Si son varias cosas, el verbo va en plural: у меня болят но́ги.',
  },
  'com.presentarse': {
    label: 'Presentarse y hablar de uno mismo',
    review:
      'Меня зовут + nombre; Я из + genitivo (из Испании); Я живу в + prepositivo (в Мадриде); Я работаю + instrumental (инженером); Мне … лет.',
  },
  'com.compras': {
    label: 'De compras',
    review:
      'Сколько стоит (singular) / стоят (plural)? Cantidades con genitivo: бутылка воды, килограмм яблок; precios: два рубля, пять рублей; оплатить картой.',
  },
} as const satisfies Record<string, SkillInfo>

export type SkillId = keyof typeof SKILLS

export const ERROR_TYPES = {
  'caso.nominativo': 'Nominativo en lugar del caso exigido',
  'caso.acusativo': 'Acusativo en lugar del caso exigido',
  'caso.genitivo': 'Genitivo en lugar del caso exigido',
  'caso.dativo': 'Dativo en lugar del caso exigido',
  'caso.instrumental': 'Instrumental en lugar del caso exigido',
  'caso.prepositivo': 'Prepositivo en lugar del caso exigido',
  'caso.genitivo-acusativo': 'Genitivo/acusativo en lugar del caso exigido',
  'caso.otro-oblicuo': 'Otro caso (genitivo, dativo o prepositivo) en lugar del exigido',
  'caso.lugar-direccion': 'Confundir lugar (¿dónde?) y dirección (¿adónde?)',
  'caso.identificacion': 'No identificar el caso por la función en la frase',
  'terminacion.ия': 'Terminación -е en lugar de -и en sustantivos en -ия / -ие / -ий',
  'terminacion.locativo-u': 'Terminación -у de lugar en un sustantivo que no la admite',
  'terminacion.fem-ь': 'Aplicar -у / -ю a un femenino terminado en -ь',
  'preposicion.forma': 'Forma incorrecta de la preposición (с / со, о / об)',
  'preposicion.v-na': 'Elegir в en lugar de на, o al revés',
  'animacion.inanimado-como-animado': 'Tratar un sustantivo inanimado como animado',
  'animacion.animado-como-inanimado': 'Tratar un sustantivo animado como inanimado',
  'pronombre.n': 'Error con la н- de los pronombres de tercera persona (у него, с ним)',
  'numero.2-4': 'Caso incorrecto tras 2, 3, 4',
  'ortografia.ы-и': 'Escribir ы tras г, к, х, ж, ш, ч, щ',
  'regimen.calco': 'Régimen calcado del español',
  'estructura.impersonal': 'Construcción personal en lugar de la impersonal con dativo',
  'aspecto.proceso-resultado': 'Confundir proceso y resultado',
  'aspecto.habitual': 'Perfectivo para una acción habitual o en presente',
  'aspecto.futuro-compuesto': 'Usar буду con un infinitivo perfectivo',
  'aspecto.par': 'Par aspectual incorrecto',
  'movimiento.uni-multi': 'Confundir movimiento unidireccional y multidireccional',
  'movimiento.ida-vuelta': 'No reconocer el sentido de ida y vuelta de ходить en pasado',
  'conjugacion.forma': 'Forma verbal incorrecta (persona o infinitivo)',
  'orden.palabras': 'Orden de palabras o de réplicas incorrecto',
  'relacion.incorrecta': 'Asociación incorrecta',
  'seleccion.incompleta': 'Selección incompleta: faltan respuestas correctas',
  'deteccion.falso-error': 'Frase correcta identificada como errónea',
  'lexico.significado': 'Confundir el significado de una palabra',
  'concordancia.numero': 'Falta de concordancia en número entre verbo y sujeto',
  'numero.cantidad': 'Singular en lugar de plural tras una expresión de cantidad',
  'plural.irregular': 'Plural irregular formado como si fuera regular',
  'movimiento.pie-transporte': 'Confundir ir a pie (идти / ходить) e ir en transporte (ехать / ездить)',
} as const satisfies Record<string, string>

export type ErrorTypeId = keyof typeof ERROR_TYPES
