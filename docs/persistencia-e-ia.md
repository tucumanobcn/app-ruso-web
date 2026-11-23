# Persistencia estable e inteligencia artificial

Fase 7. Este documento explica qué se ha implementado, qué se propone para más adelante y
cuánto costaría. Respeta las restricciones de la especificación: sin servicios externos, sin
bases de datos remotas, sin APIs de pago y sin claves en el navegador.

## 1. Guardado: de localStorage a IndexedDB (implementado)

| | Antes (fases 1–6) | Ahora (fase 7) |
|---|---|---|
| Dónde | `localStorage` | IndexedDB (base de datos del navegador), base `app-ruso`, almacén `datos` |
| Capacidad | unos 5 MB | cientos de MB o más (depende del navegador y del disco) |
| Escritura | bloquea la página un instante | asíncrona; se confirma al cerrar la transacción |
| Borrado por falta de espacio | posible, sin aviso | se puede pedir al navegador que lo evite («Mis datos») |

Código: `src/lib/persistence.ts` (único módulo que toca el almacenamiento) y
`src/lib/storage.ts` (formato, validación y migración de versiones, sin cambios de esquema
incompatibles).

- **Migración automática.** La primera vez se leen los datos de `localStorage` (también la clave
  de la versión 1), se copian a IndexedDB, se vuelven a leer para comprobarlos y solo entonces
  se borran de `localStorage`. Si la copia falla, se sigue usando `localStorage` sin borrar nada.
- **Alternativas.** Si IndexedDB no está disponible se usa `localStorage`; si tampoco, la memoria,
  y la app avisa desde el principio de que no se conservará nada.
- **Datos ilegibles** nunca se descartan en silencio: se guarda una copia aparte
  (`progreso:copia-ilegible`) y se empieza de cero.
- **Escrituras ordenadas.** Si llegan varios cambios mientras se escribe, solo se escribe el último;
  si una escritura falla, aparece el aviso de que no se puede guardar.
- **«Mis datos»** muestra el almacén en uso, si el navegador protege los datos, el espacio usado,
  la fecha de la última copia exportada (con un recordatorio a partir de 14 días) y los ejercicios
  con aviso.

Limitaciones que siguen: los datos viven en un solo navegador; dos pestañas abiertas a la vez
pueden sobrescribirse (gana la última que guarda); una ventana privada lo pierde todo al cerrarse.
Exportar e importar en JSON sigue siendo la forma de llevarlos a otro dispositivo.

## 2. Propuesta de base de datos para sincronizar (no implementada)

Solo tiene sentido si quieres usar la app en varios dispositivos sin exportar a mano. Exige un
servidor y, por tanto, salir de la restricción «sin servicios externos»: queda a tu decisión.

Propuesta: **local primero + sincronización opcional**. IndexedDB sigue siendo la fuente con la
que trabaja la app (funciona sin conexión) y un servidor pequeño guarda una copia.

- **Base de datos:** SQLite (un archivo, sin administración) detrás de un servidor mínimo, o
  PostgreSQL gestionado si se prefiere no mantener nada. Para un solo usuario, SQLite basta.
- **Esquema:** `respuestas` (solo se añaden filas: una por respuesta), `sesiones`, `avisos`,
  `diagnostico` y `preferencias`. El dominio y los repasos no se guardan: se recalculan a partir
  de las respuestas, como hoy.
- **Fusión sin conflictos:** como el historial de respuestas solo crece, sincronizar es unir los
  dos historiales sin duplicados. Haría falta añadir un identificador único a cada respuesta (hoy
  se distinguen por sesión, pregunta y fecha). Las preferencias se resuelven por «la última
  modificación gana».
- **Acceso:** un solo usuario con una contraseña o un enlace de inicio de sesión; nunca claves en
  el navegador.

## 3. ¿Conviene usar un modelo de lenguaje?

### Lo que ya hay sin IA (la alternativa funcional)

- Ejercicios y explicaciones redactados y comprobados por un validador automático.
- **Variantes automáticas**: plantillas de frase con formas sacadas de OpenRussian, una fuente
  verificada de declinaciones y conjugaciones (unas 228 variantes). Generan ejercicios nuevos sin
  que nadie «invente» una forma rusa.
- Explicaciones personalizadas por reglas: cada opción incorrecta tiene su explicación, y el tipo
  de error alimenta los puntos débiles, el plan del día y los repasos.

### Dónde aportaría un modelo de lenguaje

- Frases y contextos más variados que una plantilla.
- **Textos cortos de lectura** con preguntas: hoy la comprensión escrita está «sin evaluar» porque
  no hay contenido.
- Explicar con otras palabras un error concreto cuando la explicación fija no basta.

### Riesgos

Un modelo puede producir ruso incorrecto o poco natural, marcar como errónea una frase válida o
dar una regla falsa, justo los fallos que la especificación pide evitar. Por eso no se usaría
nunca en directo ni sin validación.

### Diseño híbrido propuesto

1. **Generación por lotes, no en directo.** Un script en un servidor (o en tu ordenador) con la
   clave en una variable de entorno genera ejercicios en lotes. La app nunca llama a la API.
2. **Material de partida verificado.** El modelo recibe la regla, las formas de OpenRussian que
   debe usar y el formato de pregunta; no se le pide que «sepa» las declinaciones.
3. **Validación automática.** El validador de contenido actual (estructura, una respuesta correcta,
   explicación en cada opción incorrecta) y una comprobación nueva: toda palabra rusa de la
   respuesta correcta debe existir en las formas de OpenRussian.
4. **Segunda revisión.** Un segundo modelo, o tú mismo desde la app, revisa cada ejercicio antes
   de que cuente.
5. **Confianza visible y limitada.** Entrarían con origen «Generado por IA» y confianza «sin
   revisar», y no bastarían por sí solos para dar algo por dominado.
6. **Avisos.** Cualquier ejercicio dudoso se retira con «Avisar de un problema» (ya implementado).

### Implementado en esta fase (sin API)

- **Origen y confianza de cada ejercicio** (`src/content/origin.ts`): «Ejercicio de la lección»
  (confianza media: redactado y validado, no revisado por un nativo), «Variante automática»
  (confianza alta: formas de OpenRussian) y «Generado por IA» (sin revisar; reservado, no hay
  ninguno). La etiqueta y su explicación aparecen en cada corrección.
- **Avisos de ejercicios dudosos.** Desde la corrección eliges el motivo tocando: la respuesta que
  da por correcta te parece incorrecta, tu respuesta también es válida, la explicación es confusa,
  la traducción no es natural u otro. El ejercicio deja de proponerse (prácticas, repasos, sesiones
  y diagnóstico) y sus respuestas no cuentan para el dominio ni para los repasos. Se puede deshacer
  y se incluye en la copia exportada para corregir el contenido después. En las lecciones fijas
  sigue apareciendo, con una nota de que no cuenta.

### Coste aproximado con la API de Claude

Precios oficiales por millón de tokens (tabla del 3/11/2026; la API por lotes cuesta la mitad):

| Modelo | Entrada | Salida |
|---|---|---|
| Claude Haiku 5.5 | 0,10 $ | 0,50 $ (prompts de hasta 100 000 tokens) |
| Claude Sonnet 5.5 | 2 $ | 10 $ |
| Claude Opus 5.5 | 4 $ | 20 $ |

Estimación por ejercicio generado: unos 2 000 tokens de entrada (regla, formas, formato y
ejemplos) y unos 1 500 de salida (pregunta, opciones, explicaciones y razonamiento).

| Modelo | Por ejercicio | 1 000 ejercicios | Con lotes (−50 %) |
|---|---|---|---|
| Haiku 5.5 | ≈ 0,001 $ | ≈ 1 $ | ≈ 0,50 $ |
| Sonnet 5.5 | ≈ 0,02 $ | ≈ 19 $ | ≈ 10 $ |
| Opus 5.5 | ≈ 0,04 $ | ≈ 38 $ | ≈ 19 $ |

Una segunda revisión por otro modelo aproximadamente duplica el coste. Para uso personal
(unos 20 ejercicios nuevos al día, unos 600 al mes) serían menos de 1 $ al mes con Haiku y unos
10–25 $ al mes con Sonnet, según si se revisan y si se usan lotes. Son estimaciones: el coste real
depende de la longitud de cada ejercicio y hay que medirlo con un lote de prueba.

**Recomendación:** mantener la app sin IA, que ya funciona con contenido verificado, y si se
quiere ampliar, empezar por un lote pequeño de textos de lectura con Sonnet 5.5, revisados uno a
uno, antes de automatizar nada. Requiere tu autorización expresa, porque es una API de pago.
