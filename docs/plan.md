# Plan de implementación por fases

Referencia funcional completa: [especificacion.md](especificacion.md).

La aplicación se construye de forma incremental. Cada fase deja una versión que funciona y
se puede usar; nada se presenta como implementado si no lo está.

## Arquitectura (válida para todas las fases)

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Contenido pedagógico | `src/content/` | Lecciones, preguntas, explicaciones, glosario de habilidades y tipos de error. Datos, no lógica. |
| Lógica de sesión | `src/lib/session.ts` | Crear sesiones, barajar opciones, calcular resultados. |
| Persistencia | `src/lib/storage.ts` | Leer y guardar el progreso (hoy `localStorage`). Único punto que toca el almacenamiento. |
| Interfaz | `src/screens/`, `src/components/` | Pantallas y componentes de React. |
| Motor adaptativo, repaso espaciado, recomendaciones | `src/engine/` (fases 3–5) | Todavía no existe. |

Stack: React 19 + TypeScript + Vite, CSS propio con variables (sin Tailwind por ahora), sin
servicios externos.

## Fase 1 — Recorrido mínimo de aprendizaje ✅ terminada

- Pantalla de inicio con acceso a continuar la sesión pendiente y estadísticas básicas reales.
- Catálogo de lecciones: título, nivel, objetivo, requisitos previos, tiempo, nº de ejercicios.
  Las lecciones futuras aparecen como «Próximamente».
- Una lección interactiva sobre el instrumental: explicación breve + 5 preguntas de opción única
  (completar, seleccionar, identificar el error).
- Corrección individual: respuesta correcta, por qué, regla, por qué tu opción es incorrecta,
  ejemplos y recomendación de repaso. Se registra el tipo de error.
- Pantalla de resultados con revisión de todas las respuestas.
- Guardado local: sesión en curso (se puede interrumpir y retomar), sesiones terminadas,
  historial de respuestas y tema claro/oscuro.

Pendiente de forma explícita: dominio por habilidad, repasos, diagnóstico, dashboard, recursos.

## Fase 2 — Contenido ampliado y más formatos ✅ terminada

Hecho:

- Formatos nuevos: selección múltiple, verdadero/falso, ordenar palabras, reconstruir diálogos
  (ordenar réplicas) y relacionar (con desplegables). Ordenar acepta varios órdenes válidos.
- 8 lecciones y 60 ejercicios: prepositivo, acusativo, genitivo, dativo, instrumental (singular),
  un repaso mixto de casos, aspecto verbal (proceso o resultado) e идти / ходить.
- Validador automático del contenido (`src/lib/validateContent.ts`): se ejecuta en los tests y en
  la consola del navegador en modo desarrollo.
- Exportar e importar el progreso en JSON (pantalla «Datos»), con migración automática de los
  datos de la fase 1 (formato v1 → v2).
- Tests unitarios con Vitest: corrección, sesiones, persistencia, copias y contenido.

Pendiente y trasladado a la fase 4: casos en plural, ехать / ездить y lecciones de vocabulario
y comunicación cotidiana (ya anunciadas como «Próximamente» en el catálogo).

## Fase 3 — Motor de dominio ✅ terminada

Detalle del algoritmo: [motor-adaptativo.md](motor-adaptativo.md).

- Mapa de conocimientos con nivel, importancia (esencial / secundario) y dependencias
  (`src/content/knowledgeMap.ts`), validado sin ciclos.
- Cinco estados por conocimiento con umbrales configurables (`src/engine/config.ts`): dominio
  provisional y consolidado, repetir una pregunta no cuenta como evidencia nueva.
- «Mis puntos débiles» ordenados por prioridad, con errores frecuentes, lo que bloquean y práctica
  dirigida. El historial de errores nunca se borra.
- Pantalla «Progreso» con resumen, mapa de conocimientos y motivos de cada estado; resultados con
  el cambio de dominio; avisos de requisitos en catálogo y lecciones (sin bloquear).

Pendiente: dificultad y pistas en el cálculo (el contenido aún no los tiene) y más ejercicios
para los conocimientos con 1–2 ejercicios (fase 4).

## Mejoras previas a la fase 4 ✅ terminadas

- **Vocabulario verificado:** 5 palabras cotidianas y muy rusas por lección (10 en «El cuerpo»), con
  acentos, género y declinación o conjugación sacados de OpenRussian y frases reales de Tatoeba
  con traducción al español. Cada lección termina con un ejercicio sobre esas palabras.
- **Nueva lección «El cuerpo: части тела»** (7 ejercicios), con ilustración rotulada.
- **Ilustraciones SVG** en las introducciones de las 8 lecciones de gramática y en la del cuerpo.
- **Vídeos de YouTube verificados** (34) de Amazing Russian, Russian With Max y О русском по-русски:
  en cada lección, en los resultados según tus errores y en «Mis puntos débiles». Se registra cuáles
  has abierto.
- **Identidad visual Electric Coral**, con modo oscuro, barra de pestañas inferior y botones
  principales fijos al alcance del pulgar.

Fuentes y licencias: [fuentes-y-licencias.md](fuentes-y-licencias.md).

## Fase 4 — Repetición espaciada y variantes ✅ terminada

Detalle: [motor-adaptativo.md](motor-adaptativo.md).

- Calendario de repasos por conocimiento con las fórmulas de FSRS-4.5: estabilidad, dificultad,
  probabilidad de recordar e importancia (retención 90 % en esenciales, 85 % en secundarios).
  Lo no dominado vuelve como máximo a los 7 días.
- «Necesita repaso» depende ahora del calendario, no de un número fijo de días.
- 140 variantes generadas con 19 plantillas a partir de formas verificadas de OpenRussian,
  con explicación propia en cada opción incorrecta.
- «Tu repaso de hoy» en el inicio, calendario de repasos en «Progreso», próximo repaso en los
  resultados y prácticas dirigidas que priorizan frases no vistas.

## Fase 4b — Ampliación de contenido ✅ terminada

- 4 lecciones nuevas, cada una con ilustración, 5 palabras verificadas y vídeos comprobados:
  «Los casos en plural» (10 ejercicios), «Ехать y ездить» (9), «Presentarse y hablar de uno
  mismo» (9) y «De compras» (9).
- 12 plantillas nuevas (31 en total, 221 variantes): plural en todos los casos, medio de
  transporte, conjugación de ехать / ездить, «у меня болит / болят» y pares aspectuales.
- 8 conocimientos nuevos en el mapa (plural, ехать / ездить, transporte, presentarse, compras).
- Totales: 13 lecciones disponibles, 112 ejercicios fijos + 221 variantes, 70 palabras de
  vocabulario y 49 vídeos verificados.

Anunciados como «Próximamente»: el imperativo y los verbos de movimiento con prefijos.

## Fase 5 — Diagnóstico y planificador ✅ terminada

Detalle: [motor-adaptativo.md](motor-adaptativo.md#diagnóstico-adaptativo).

- **Diagnóstico adaptativo** en 4 bloques cortos (casos 1, casos 2, verbos, plural y
  comunicación), que se pueden hacer en días distintos, interrumpir y repetir. Una pregunta por
  conocimiento (dos si fallas); se omite lo que depende de un requisito esencial débil.
- **Perfil por competencias** (casos, preposiciones, conjugación, aspecto, movimiento,
  pronombres, vocabulario, estructuras) con nivel orientativo («A2 en desarrollo») y nivel
  global; combina el diagnóstico con lo practicado después. Las competencias sin contenido
  (adjetivos, comprensión escrita y auditiva, expresión) se muestran como «sin evaluar».
- **Sesión recomendada del día** (~10 min) con justificación de cada parte: diagnóstico si aún no
  hay datos, repaso espaciado, refuerzo del punto débil prioritario (primero si es requisito de
  la siguiente lección) y siguiente lección del itinerario (saltando lo ya superado).
- **Sesiones a elegir**: continuar itinerario, repasar errores, estudiar un tema, sesión mixta,
  vocabulario y evaluación de nivel. «Practicar comprensión» aparece desactivada hasta que haya
  textos y audios.
- El JavaScript se divide en tres partes (React, contenido y aplicación), todas por debajo de
  500 kB.

## Fase 6 — Panel de progreso y recursos ✅ terminada

- **Panel «Progreso»** con índice de secciones: resumen en cifras (nivel global orientativo,
  tiempo de estudio estimado, sesiones terminadas, conocimientos dominados y reparto por estado).
- **Objetivo semanal** configurable (1–14 sesiones, 5 por defecto), con barra amarilla de logro;
  se guarda en las preferencias y las copias antiguas reciben el valor por defecto.
- **Evolución de las últimas 8 semanas**: minutos por semana (columnas) y % de aciertos (línea),
  cada una en su propia gráfica, con tooltip con ratón o teclado y tabla con los datos. Las
  semanas sin respuestas no se dibujan como 0 %.
- **Camino al siguiente nivel**: esenciales dominados de A1 y A2 y los que faltan, primero los que
  sirven de base a más temas, con acceso directo a practicarlos.
- **Historial de sesiones** (las 20 más recientes) con fecha, aciertos y duración.
- Se mantienen el perfil por competencias, los puntos débiles, el calendario de repasos, los
  errores frecuentes y el mapa de conocimientos.
- **Pestaña «Recursos»**: vídeos recomendados según tus puntos débiles; biblioteca de los 49
  vídeos verificados con filtros por tema, canal, nivel y «solo los que no he abierto», agrupada
  por lección; herramientas de consulta comprobadas (OpenRussian, Wiktionary en inglés y en ruso,
  Tatoeba y el diccionario abierto de GitHub) con búsqueda de una palabra; y, aparte, búsquedas
  sugeridas marcadas como «sin verificar».

Cómo se estima el tiempo: se suma el intervalo entre respuestas seguidas (máximo 3 minutos cada
uno) y 1 minuto al empezar cada tanda; una pausa de más de 10 minutos empieza una tanda nueva.
Es una estimación: la app no mide el tiempo de lectura de las explicaciones.

No incluido: integración con la YouTube Data API. Exigiría un servidor propio que guarde la
clave (nunca en el navegador); queda como mejora opcional.

## Fase 7 — Persistencia estable e IA opcional ✅ terminada (parte local)

Detalle, propuesta de base de datos y costes: [persistencia-e-ia.md](persistencia-e-ia.md).

- **IndexedDB** como almacén principal, con migración automática y comprobada desde
  `localStorage` (que queda como alternativa), escrituras ordenadas y copia de datos ilegibles.
- **«Mis datos»** muestra dónde se guarda, el espacio usado y si el navegador protege los datos
  (con botón para pedirlo), y recuerda exportar una copia a partir de 14 días.
- **Origen y confianza de cada ejercicio** (lección, variante automática, generado por IA) en cada
  corrección.
- **Avisos de ejercicios dudosos**: el ejercicio deja de proponerse y sus respuestas no cuentan
  para el dominio; se puede deshacer y viaja en la copia exportada.

No implementado, a la espera de tu autorización porque exige un servidor o una API de pago:
sincronización entre dispositivos y generación de ejercicios con un modelo de lenguaje.

## Limitaciones del guardado actual (IndexedDB)

- Los datos viven solo en este navegador y dispositivo; para llevarlos a otro, exportar e importar.
- Se pierden si se borran los datos del sitio o se usa una ventana privada.
- Dos pestañas abiertas a la vez pueden sobrescribirse: gana la última que guarda.
