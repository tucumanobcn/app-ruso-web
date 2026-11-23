Vamos a desarrollar esta aplicación de forma incremental.
Ya tengo preparado un proyecto React + TypeScript con Vite.
Primero, analiza el proyecto y crea un plan de implementación dividido en fases. No implementes todavía toda la aplicación.
Para la primera fase, quiero únicamente:

* Una pantalla de inicio.
* Un catálogo de lecciones.
* Una lección interactiva con cinco preguntas de ruso.
* Corrección individual con explicaciones.
* Una pantalla de resultados.
* Guardado local del progreso.

Utiliza la paleta de colores propuesta y un diseño responsive, pensado principalmente para móviles.
Antes de modificar archivos, explícame brevemente qué vas a hacer. Después implementa esta primera fase, ejecuta las comprobaciones disponibles y dime cómo probarla.
No añadas todavía servicios externos, bases de datos remotas ni APIs de pago.
 
PROMPT PARA CLAUDE — Aplicación de aprendizaje adaptativo de ruso
1. Objetivo del proyecto
Quiero que diseñes y desarrolles una aplicación web personal para aprender ruso de manera progresiva, estructurada, interactiva y adaptativa.
No quiero una simple aplicación de preguntas y respuestas. Quiero un sistema de aprendizaje inteligente, capaz de evaluar mi conocimiento real, identificar mis dificultades, adaptar los ejercicios y construir un itinerario individualizado hasta alcanzar progresivamente los niveles A2, B1 y B2 del Marco Común Europeo de Referencia (MCER).
La aplicación debe funcionar como una combinación de:

* Profesor particular de ruso.
* Plataforma de ejercicios interactivos.
* Sistema de evaluación continua.
* Planificador de aprendizaje personalizado.
* Biblioteca de recursos educativos.
* Sistema de repetición espaciada y consolidación de conocimientos.

La prioridad es la calidad pedagógica, la continuidad del aprendizaje y una experiencia de usuario sencilla y agradable.
La interfaz debe estar en español, mientras que los ejercicios, ejemplos y contenidos lingüísticos deben utilizar ruso en alfabeto cirílico.
2. Perfil del estudiante
La aplicación se desarrollará inicialmente para un único usuario adulto con las siguientes características:

* Lengua materna: español.
* Nivel actual aproximado: A2, con algunos conocimientos de B1.
* Objetivo inicial: alcanzar un B1 sólido y posteriormente B2.
* Experiencia previa: estudié ruso hace algunos años, pero estuve aproximadamente tres años sin practicar.
* Tengo conocimientos previos de vocabulario, gramática y construcciones básicas, pero necesito recuperarlos y consolidarlos.
* Dispongo habitualmente de unos 10 minutos por sesión.
* Prefiero explicaciones gramaticales claras en español.
* Quiero ejercicios interactivos que pueda resolver desde el móvil.
* No siempre tengo teclado cirílico ni puedo hablar, por lo que debe existir un modo de aprendizaje completamente funcional sin escribir ni utilizar el micrófono.

No debe asumirse que conozco todos los contenidos de los niveles anteriores simplemente porque estoy trabajando contenidos A2–B1.
3. Evaluación inicial y diagnóstico
Diseña una evaluación diagnóstica adaptativa que permita determinar mi nivel real en distintas competencias.
La evaluación debe identificar por separado:

* Vocabulario.
* Casos gramaticales.
* Preposiciones.
* Conjugación verbal.
* Aspecto verbal.
* Verbos de movimiento.
* Adjetivos y concordancia.
* Pronombres.
* Estructuras sintácticas.
* Comprensión escrita.
* Comprensión auditiva.
* Expresión escrita y oral, cuando estén habilitadas.

No quiero recibir simplemente una nota global de A2 o B1.
Quiero un diagnóstico granular, por ejemplo:

* Casos: A2 consolidado.
* Aspecto verbal: A2 en desarrollo.
* Verbos de movimiento: A2 con dificultades.
* Vocabulario cotidiano: B1 inicial.
* Comprensión escrita: B1 inicial.

La evaluación debe realizarse en varias sesiones cortas, evitando un examen inicial excesivamente largo.
Debe poder actualizarse constantemente con los resultados posteriores.
4. Mapa de conocimientos y progresión
Construye un mapa curricular completo, organizado por niveles A1, A2, B1 y B2, alineado con los descriptores del MCER y con una progresión gramatical razonable para el ruso.
Cada nivel debe dividirse en módulos, unidades y conocimientos concretos.
Módulos principales
A. Casos gramaticales

* Nominativo.
* Acusativo.
* Genitivo.
* Dativo.
* Instrumental.
* Prepositivo.
* Singular y plural.
* Sustantivos masculinos, femeninos y neutros.
* Adjetivos y pronombres en cada caso.
* Sustantivos animados e inanimados.
* Construcciones que exigen casos específicos.
* Excepciones frecuentes.

B. Preposiciones

* В / на.
* Из / с.
* К / от.
* У.
* О / об.
* Для / без / после / до.
* По.
* Перед / за / под / над / между.
* Preposiciones con distintos casos.
* Diferencias entre ubicación, dirección y procedencia.

C. Verbos

* Presente, pasado y futuro.
* Primera y segunda conjugación.
* Verbos reflexivos.
* Verbos irregulares.
* Aspecto perfectivo e imperfectivo.
* Pares aspectuales.
* Verbos con régimen gramatical específico.
* Imperativo.
* Condicional.
* Verbos de obligación, necesidad, posibilidad y deseo.

D. Verbos de movimiento

* Идти / ходить.
* Ехать / ездить.
* Otros pares de movimiento.
* Movimiento unidireccional y multidireccional.
* Movimiento habitual y puntual.
* Verbos de movimiento con prefijos.
* Movimiento perfectivo e imperfectivo.
* Situaciones cotidianas de transporte y desplazamiento.

E. Adjetivos, pronombres y adverbios

* Concordancia.
* Comparativos y superlativos.
* Formas cortas de adjetivos.
* Pronombres personales, posesivos y demostrativos.
* Adverbios de frecuencia, tiempo, lugar y modo.

F. Comunicación cotidiana

* Presentaciones personales.
* Familia.
* Trabajo.
* Vivienda.
* Transporte.
* Compras.
* Restaurantes.
* Viajes.
* Salud.
* Opiniones y preferencias.
* Experiencias pasadas.
* Planes futuros.
* Situaciones hipotéticas.
* Conversaciones y situaciones sociales.

G. Comprensión y producción

* Lectura de textos graduados.
* Diálogos.
* Comprensión auditiva.
* Construcción de frases.
* Traducción contextual.
* Escritura guiada.
* Expresión oral opcional.

Estos módulos deben estar conectados mediante relaciones de dependencia.
Por ejemplo, antes de trabajar construcciones complejas con adjetivos en instrumental, la aplicación debe comprobar si conozco suficientemente las terminaciones básicas del instrumental.
5. Motor de aprendizaje adaptativo
Este es el componente más importante.
La aplicación debe mantener un registro individualizado de dominio para cada conocimiento.
Propongo cinco estados:

1. No estudiado: contenido todavía no presentado.
2. En aprendizaje: contenido introducido, pero con errores frecuentes.
3. En consolidación: buen rendimiento, aunque todavía no suficientemente estable.
4. Dominado: demostrado mediante ejercicios variados y repetidos.
5. Necesita repaso: conocimiento anteriormente adquirido que presenta nuevos errores o lleva demasiado tiempo sin practicarse.

Criterios de dominio
No quiero que un único ejercicio acertado implique que un contenido está dominado.
Diseña un algoritmo configurable que tenga en cuenta:

* Porcentaje de respuestas correctas.
* Número de intentos.
* Dificultad de los ejercicios.
* Rendimiento en distintos formatos.
* Capacidad de aplicar el conocimiento en frases nuevas.
* Errores repetidos.
* Resultados de repasos posteriores.
* Tiempo transcurrido desde el último repaso.
* Uso de pistas y ayudas.

Como propuesta inicial, considera dominio provisional cuando haya un rendimiento de al menos el 85 % en suficientes ejercicios variados, y dominio consolidado cuando ese rendimiento se mantenga en repasos separados en el tiempo.
Estos umbrales deben ser configurables y no deben interpretarse como una certificación oficial MCER.
Progresión flexible
Quiero poder avanzar a contenidos nuevos aunque mantenga algunas debilidades.
Sin embargo, el sistema debe:

* Identificar los conocimientos pendientes.
* Mostrar su importancia.
* Explicar si bloquean aprendizajes posteriores.
* Recomendar repasos específicos.
* Recuperarlos automáticamente en sesiones futuras.

Distingue entre conocimientos esenciales que requieren cierto dominio previo y conocimientos secundarios que permiten avanzar con seguimiento.
Nunca elimines una debilidad del historial por el simple hecho de pasar a otra lección.
6. Lecciones de aproximadamente 10 minutos
La unidad básica de aprendizaje será una sesión de unos 10 minutos.
Cada lección debe mostrar:

* Título.
* Nivel estimado.
* Objetivo pedagógico.
* Conocimientos previos necesarios.
* Tiempo estimado.
* Número de ejercicios.
* Progreso durante la sesión.

Estructura orientativa

* 1 minuto: repaso de conocimientos anteriores.
* 2 minutos: explicación de un concepto.
* 5 minutos: ejercicios interactivos.
* 1 minuto: aplicación en frases reales.
* 1 minuto: evaluación y recomendaciones.

Esta estructura debe adaptarse al contenido.
Lecciones monográficas
Quiero poder elegir estudiar un único tema de forma exhaustiva.
Por ejemplo, una lección sobre el dativo debe centrarse principalmente en el dativo y cubrir progresivamente:

* Función gramatical.
* Preguntas del caso.
* Terminaciones.
* Singular y plural.
* Pronombres.
* Adjetivos.
* Preposiciones.
* Verbos que lo exigen.
* Errores habituales.
* Ejercicios prácticos.

No es necesario cubrir todos estos puntos en una sola sesión. El sistema debe poder dividir un tema extenso en varias microlecciones consecutivas.
Lecciones mixtas
También quiero sesiones que combinen conocimientos anteriores para comprobar si puedo utilizarlos espontáneamente.
El sistema debe recomendar cuándo conviene una lección monográfica y cuándo una de integración.
7. Tipos de ejercicios
Implementa una biblioteca variada de ejercicios interactivos.
Como mínimo:

1. Selección múltiple con una respuesta correcta.
2. Selección de varias respuestas correctas.
3. Verdadero o falso.
4. Completar frases mediante opciones.
5. Elegir la terminación gramatical correcta.
6. Asociar verbos con casos.
7. Ordenar palabras para formar frases.
8. Relacionar frases rusas con traducciones.
9. Identificar errores gramaticales.
10. Elegir entre perfectivo e imperfectivo.
11. Diferenciar verbos de movimiento.
12. Seleccionar preposiciones correctas.
13. Reconstruir diálogos.
14. Comprensión de pequeños textos.
15. Comprensión auditiva, cuando haya audio disponible.
16. Traducción inversa mediante opciones.
17. Ejercicios de repaso acumulativo.
18. Ejercicios contextualizados en situaciones cotidianas.

El sistema debe evitar que las respuestas correctas sean siempre las más largas o aparezcan en la misma posición.
Las opciones incorrectas deben ser lingüísticamente plausibles y ayudar a identificar errores reales, no respuestas absurdas.
8. Corrección y explicaciones
Cada respuesta debe recibir una corrección pedagógica clara.
Cuando responda incorrectamente, quiero conocer:

* La respuesta correcta.
* Por qué es correcta.
* Qué regla gramatical se aplica.
* Qué caso, aspecto o construcción interviene.
* Por qué mi respuesta es incorrecta.
* Un ejemplo adicional.
* Una recomendación breve de repaso cuando sea necesario.

Por ejemplo:
Я интересуюсь историей.
Explicar que интересоваться exige instrumental, que история se transforma en историей y mostrar dos ejemplos equivalentes.
No quiero explicaciones genéricas como «respuesta incorrecta, inténtalo de nuevo».
El sistema debe identificar el tipo de error y registrarlo.
9. Repetición espaciada y memoria
Implementa un sistema de repaso espaciado inspirado en algoritmos como FSRS o alternativas apropiadas.
Debe programar repasos en función de:

* Dificultad.
* Historial de aciertos.
* Tiempo desde el último ejercicio.
* Frecuencia de errores.
* Importancia del conocimiento.

El repaso no debe limitarse a repetir exactamente la misma pregunta.
Quiero que el sistema genere nuevas frases para comprobar que comprendí la regla y no que memoricé una respuesta.
Debe existir una sección «Mis puntos débiles», con acceso directo a ejercicios específicos.
10. Recursos externos y YouTube
Quiero que cada módulo o lección pueda recomendar recursos externos adecuados al conocimiento que estoy estudiando.
Principalmente:

* Vídeos educativos de YouTube.
* Explicaciones gramaticales.
* Vídeos con conversaciones reales.
* Canales especializados en ruso para extranjeros.
* Lecturas graduadas.
* Ejercicios complementarios.
* Material de escucha.

Cada recurso debe mostrar:

* Título.
* Fuente o canal.
* Idioma de la explicación.
* Nivel recomendado.
* Duración.
* Tema.
* Motivo por el que se recomienda.
* Enlace directo.

Priorizá materiales explicados en español, aunque también acepto materiales en inglés y francés.
Requisitos importantes
No inventes vídeos, títulos, duraciones ni enlaces.
Si existe una integración con YouTube Data API, utilizala para buscar y verificar recursos reales.
Si no existe integración, diseña una biblioteca de recursos verificados o una búsqueda externa claramente identificada.
El sistema debe diferenciar entre recursos comprobados y sugerencias de búsqueda pendientes de verificar.
Las recomendaciones deben responder a mis errores y al contenido que estoy estudiando.
Por ejemplo, si fallo repetidamente en el instrumental, debe sugerirme un vídeo específico sobre ese caso, no un curso genérico de ruso de dos horas.
11. Panel de progreso
Quiero un dashboard visual con:

* Nivel global estimado.
* Progreso por competencia.
* Mapa de conocimientos.
* Temas dominados.
* Temas en consolidación.
* Puntos débiles.
* Repasos pendientes.
* Evolución de resultados.
* Tiempo total de estudio.
* Sesiones completadas.
* Objetivos semanales.
* Historial de lecciones.

Incluí una visualización que permita identificar rápidamente qué conocimientos son necesarios para avanzar al siguiente nivel.
No quiero que un simple porcentaje de ejercicios completados se confunda con dominio real.
12. Planificador inteligente
Al abrir la aplicación, quiero recibir una propuesta de sesión basada en mi progreso.
Por ejemplo:
Tu sesión recomendada de hoy — 10 minutos

* Repaso del instrumental: 2 minutos.
* Nueva construcción verbal: 3 minutos.
* Ejercicios sobre verbos de movimiento: 4 minutos.
* Evaluación final: 1 minuto.

También debo poder elegir manualmente:

* Continuar mi itinerario.
* Repasar errores.
* Estudiar un tema específico.
* Realizar una sesión mixta.
* Practicar vocabulario.
* Practicar comprensión.
* Hacer una evaluación de nivel.

La aplicación debe justificar brevemente sus recomendaciones.
13. Interfaz y diseño visual
Quiero una aplicación moderna, elegante, minimalista y agradable para estudiar diariamente.
No debe utilizar los colores corporativos de mi empresa ni ninguna identidad visual de mi empresa.
Propongo una identidad propia inspirada en aplicaciones educativas contemporáneas, con un estilo adulto, tranquilo y limpio.
Paleta propuesta

* Azul noche: #233047
* Verde salvia: #87A89A
* Marfil cálido: #F7F4ED
* Terracota suave: #CB8068
* Gris pizarra: #667085

Utilizá el verde salvia para progreso y elementos positivos, terracota para detalles y alertas moderadas, y azul noche para navegación y títulos.
Evitar colores excesivamente saturados, estética infantil o gamificación invasiva.
Experiencia de usuario

* Diseño mobile-first.
* Responsive para ordenador.
* Modo claro y oscuro.
* Tipografía legible en español y cirílico.
* Navegación sencilla.
* Una pregunta visible cada vez cuando convenga.
* Indicador de progreso.
* Correcciones visuales claras.
* Posibilidad de revisar respuestas anteriores.
* Accesibilidad y navegación por teclado.
* Sesiones que puedan interrumpirse y retomarse.

La interfaz debe transmitir progreso sin generar presión innecesaria.
14. Persistencia de datos
El progreso debe conservarse entre sesiones y al cerrar la aplicación.
Guardá:

* Perfil del estudiante.
* Nivel estimado.
* Mapa de conocimientos.
* Historial de respuestas.
* Errores.
* Evaluaciones.
* Lecciones completadas.
* Recursos consultados.
* Preferencias.
* Programación de repasos.

Para un prototipo local, podés utilizar almacenamiento persistente del navegador, explicando sus limitaciones.
Para una versión estable, proponé una base de datos adecuada.
Quiero poder exportar e importar mis datos en JSON para no perder mi progreso ni depender de un dispositivo concreto.
15. Arquitectura técnica
Elegí una arquitectura adecuada para una aplicación web personal.
Podés proponer React, TypeScript, Tailwind CSS y otras herramientas si están justificadas.
Separá claramente:

* Interfaz.
* Contenido pedagógico.
* Banco de ejercicios.
* Motor de evaluación.
* Motor de aprendizaje adaptativo.
* Algoritmo de repetición espaciada.
* Sistema de recomendaciones.
* Persistencia de datos.
* Integración de recursos externos.

El contenido debe estar estructurado para poder ampliarlo sin modificar continuamente el código.
Inteligencia artificial
Evaluá si conviene utilizar un modelo de lenguaje para generar ejercicios nuevos y explicaciones personalizadas.
No quiero depender exclusivamente de respuestas generadas sin validación.
Diseñá un sistema híbrido:

* Reglas gramaticales y contenidos verificados.
* Banco de ejercicios estructurado.
* Generación opcional de ejercicios nuevos.
* Validación de las respuestas y explicaciones.
* Seguimiento de errores y nivel de confianza.

Si se necesita una API de pago, explicá el coste aproximado y ofrecé una alternativa funcional sin ella.
Nunca coloques claves privadas de API directamente en el frontend.
16. Calidad pedagógica
El sistema debe evitar varios errores habituales:

* Dar por dominado un concepto tras una sola respuesta correcta.
* Repetir indefinidamente las mismas preguntas.
* Aumentar la dificultad demasiado rápido.
* Introducir conceptos avanzados sin explicar los requisitos previos.
* Confundir errores tipográficos con errores gramaticales.
* Dar explicaciones gramaticales incorrectas.
* Utilizar traducciones demasiado literales.
* Presentar como incorrectas frases rusas que son válidas en determinados contextos.
* Confundir progreso curricular con competencia lingüística demostrada.

Las preguntas deben tener respuestas inequívocas dentro del contexto proporcionado. Cuando existan varias soluciones correctas, deben aceptarse o explicarse las diferencias.
17. Contenido inicial de demostración
No quiero únicamente una maqueta visual.
Quiero una primera versión funcional con suficiente contenido real para comprobar el funcionamiento del sistema.
Incluí como mínimo:

* Un diagnóstico inicial.
* Un mapa curricular A1–B2 estructurado.
* Un módulo completo de casos gramaticales.
* Un módulo inicial de aspecto verbal.
* Un módulo inicial de verbos de movimiento.
* Varias lecciones de vocabulario y frases cotidianas.
* Al menos 50 ejercicios revisados y funcionales, distribuidos entre distintos formatos.
* Correcciones detalladas.
* Registro persistente del progreso.
* Sistema básico de recomendaciones.
* Repasos adaptativos.
* Un dashboard funcional.

Priorizá que el contenido inicial sea correcto y que las funciones principales estén operativas antes de ampliar el catálogo.
18. Metodología de desarrollo
Quiero que trabajes en fases.
Fase 1 — Diseño funcional
Definí la arquitectura, el mapa curricular, el modelo de datos y la lógica adaptativa.
Fase 2 — Prototipo
Construí la interfaz y un recorrido completo de aprendizaje con datos reales.
Fase 3 — Motor pedagógico
Implementá seguimiento del dominio, evaluación, recomendaciones y repetición espaciada.
Fase 4 — Ampliación de contenidos
Incorporá más módulos, ejercicios y recursos educativos.
Fase 5 — Validación
Probá el funcionamiento de la aplicación, la persistencia de datos, los ejercicios y la coherencia pedagógica.
No quiero que presentes funcionalidades simuladas como si estuvieran implementadas.
Si alguna funcionalidad queda pendiente, identificala claramente.
19. Resultado esperado
Quiero recibir:

1. Una aplicación web funcional.
2. Código fuente organizado y mantenible.
3. Instrucciones claras para ejecutarla localmente.
4. Explicación de cómo se guardan los datos.
5. Un sistema de aprendizaje realmente adaptativo.
6. Contenido inicial suficiente para comenzar a estudiar.
7. Una propuesta de evolución futura.

Empezá presentando brevemente la arquitectura y las decisiones pedagógicas principales. Después implementá la primera versión funcional, priorizando una experiencia completa de aprendizaje sobre la cantidad de pantallas.
La prioridad absoluta es que la aplicación me ayude a aprender ruso de verdad, no simplemente a completar ejercicios.
