# Motor de dominio

Cómo decide la aplicación en qué estado está cada conocimiento. El código está en `src/engine/`
y los umbrales en `src/engine/config.ts`. Los estados son una estimación orientativa del
aprendizaje, no una certificación MCER.

## Conocimientos y mapa

- Cada pregunta evalúa un conocimiento principal (`skill`) y, opcionalmente, otros
  (`alsoEvaluates`), por ejemplo en el repaso mixto.
- `src/content/knowledgeMap.ts` asigna a cada conocimiento su módulo, nivel orientativo,
  importancia (esencial o secundario) y los conocimientos en los que se apoya. El validador
  comprueba que no haya dependencias rotas ni ciclos.

## Evidencia que se tiene en cuenta

Para cada conocimiento se usan sus últimas **12** respuestas (`windowSize`):

- **Cada ejercicio cuenta una vez**, con su respuesta más reciente. Repetir la misma pregunta no
  suma evidencia nueva: así no se confunde memorizar una respuesta con dominar la regla.
- **Precisión reciente ponderada:** cada respuesta pesa un 85 % de la siguiente más reciente
  (`recencyDecay`), así que lo último cuenta más.
- **Ejercicios distintos acertados** y **familias de formato** acertadas (completar o
  seleccionar, verdadero o falso, identificar el error, selección múltiple, ordenar, relacionar).
- **Errores repetidos:** el mismo tipo de error dos veces en la ventana (`repeatedErrorThreshold`).
- **Separación en el tiempo:** días entre el primer y el último acierto de la ventana.

El historial completo (todas las respuestas y errores) se guarda siempre; la ventana solo decide
el estado actual.

## Estados

| Estado | Criterio (valores por defecto) |
|---|---|
| No estudiado | Ninguna respuesta. |
| En aprendizaje | Hay respuestas, pero no se cumple «en consolidación». |
| En consolidación | Precisión ≥ 60 % en al menos 2 ejercicios distintos (o todos los que haya, si son menos). |
| Dominado (provisional) | Precisión ≥ 85 %, ≥ 3 ejercicios distintos acertados, ≥ 2 familias de formato y ningún error repetido. |
| Dominado (consolidado) | Lo anterior y aciertos separados por al menos 3 días. |
| Necesita repaso | Se llegó a dominar y aparecen errores nuevos, o ya pasó el día que el calendario de repasos fijó para repasarlo. |

Cada estado viene con sus **motivos**: qué falta para el siguiente nivel o por qué necesita
repaso. Se muestran en «Progreso» y en los resultados de cada lección.

## Puntos débiles

Son los conocimientos «en aprendizaje» o «necesita repaso». Se ordenan por prioridad:

1. esenciales antes que secundarios;
2. cuántos conocimientos, aún no dominados, se apoyan en ellos;
3. «necesita repaso» antes que «en aprendizaje»;
4. menor precisión reciente.

Cada uno ofrece una **práctica dirigida** de hasta 6 ejercicios, elegidos entre los del banco y
las variantes generadas (ver abajo), primero los que nunca has visto.

## Repaso espaciado (inspirado en FSRS)

Código: `src/engine/scheduler.ts`. Se programa **por conocimiento**, no por pregunta:

- Cada día en que respondes ejercicios de un conocimiento cuenta como **un repaso**, valorado
  según tus aciertos de ese día: menos del 50 % → «otra vez»; 50–99 % → «difícil»; todo bien →
  «bien» («fácil» si fueron 3 o más ejercicios).
- Con esas valoraciones se calculan, con las fórmulas y los parámetros por defecto de
  **FSRS-4.5**, la **estabilidad** (días que se mantiene el recuerdo), la **dificultad** (1–10) y
  la **probabilidad estimada de recordar** hoy.
- El próximo repaso toca cuando esa probabilidad baja a la **retención objetivo**: 90 % en los
  conocimientos esenciales y 85 % en los secundarios. Así, los esenciales vuelven antes.
- Mientras un conocimiento **no está dominado**, el intervalo máximo es de **7 días**: lo que aún
  se está aprendiendo no puede quedarse semanas sin practicar. Los dominados pueden llegar a 365.
- Un fallo («otra vez») baja la estabilidad y adelanta el repaso; cuenta como lapso.

**Tu repaso de hoy** reúne hasta 4 conocimientos pendientes (primero esenciales y los menos
recordados), con 2 ejercicios cada uno. Se eligen primero los ejercicios que nunca has visto, y
dentro de ellos se varían el formato y la plantilla.

## Variantes generadas por plantillas

Código: `src/content/variants/`. Para no repetir siempre las mismas frases, cada plantilla
combina una frase con hueco con una lista de palabras (por ejemplo «Я пью чай с ___» con limón,
miel, leche…). Las formas correctas **y** las opciones incorrectas salen de las declinaciones y
conjugaciones verificadas de OpenRussian (`forms.generated.ts`), no de un modelo de lenguaje.
Cada opción incorrecta trae su explicación y su tipo de error. Los pronombres, que son una clase
cerrada, usan la tabla estándar escrita a mano.

- 31 plantillas y 221 variantes: casos en singular y en plural, в / на, lugar o dirección,
  medio de transporte, pronombres, conjugación de идти / ходить y ехать / ездить, «у меня
  болит / болят», aspecto en pasado y pares aspectuales.
- Son deterministas: el mismo contenido genera siempre las mismas preguntas con el mismo id.
- Los tests comprueban que la respuesta correcta es la forma de OpenRussian y que ninguna
  opción incorrecta es también una forma válida.
- Cuentan como ejercicios distintos para el dominio: aplicar la regla a una frase nueva es
  justo la evidencia que se busca.

## Progresión flexible

Ninguna lección se bloquea. Si un requisito **esencial** está débil o sin estudiar, el catálogo y
la introducción de la lección lo avisan y recomiendan repasarlo.

## Limitaciones actuales

- Los conocimientos de comunicación (presentarse, compras) y el vocabulario cotidiano aún no
  tienen plantillas; la aplicación indica en los motivos cuándo faltan ejercicios.
- Todavía no se usan la dificultad de cada ejercicio ni el uso de pistas, porque el contenido aún
  no tiene niveles de dificultad y la aplicación no ofrece pistas.
- Los parámetros de FSRS son los publicados por defecto, no ajustados a tu historial; con
  suficientes datos se podrían optimizar.

## Diagnóstico adaptativo

Código: `src/engine/diagnostic.ts`. Cuatro bloques de 7–12 preguntas que se pueden hacer en días
distintos; cada uno se puede interrumpir (se retoma en la misma pregunta) y repetir.

- Se sondean primero los conocimientos de nivel más bajo (A1 antes que A2).
- Cada conocimiento recibe **una** pregunta nunca vista (preferiblemente una variante de opción
  única). Acierto → **superado**. Fallo → **segunda pregunta**: acierto → **dudoso**; fallo →
  **débil**.
- Si un requisito **esencial** sale débil, los conocimientos que dependen de él se **omiten**.
- Las respuestas del diagnóstico entran en el historial normal: cuentan para el dominio y el
  calendario de repasos.

## Perfil por competencias

Código: `src/engine/profile.ts`. Cada conocimiento pertenece a una competencia (casos,
preposiciones, conjugación, aspecto, movimiento, pronombres, vocabulario, estructuras).

- Puntuación de cada conocimiento: la del diagnóstico (superado 0,8; dudoso 0,5; débil 0,15)
  mientras no lo vuelvas a practicar; después, la del motor de dominio (dominado 1; en
  consolidación 0,7; necesita repaso 0,5; en aprendizaje 0,3). «Omitido» no puntúa.
- Nivel de la competencia: si los conocimientos A1 no llegan a 0,75 de media, el nivel es A1
  («consolidado» ≥ 0,75, «en desarrollo» ≥ 0,45, «con dificultades» por debajo); si no, se mira
  A2 con los mismos umbrales.
- Nivel global: media de las competencias evaluadas, ponderada por el número de conocimientos.
- B1 aún no se evalúa (no hay contenido B1); adjetivos, comprensión escrita y auditiva y
  expresión aparecen como «sin evaluar».

## Planificador del día

Código: `src/engine/planner.ts`. Propone unos 10 minutos y explica cada parte:

1. **Diagnóstico** si aún no hay datos (ningún bloque terminado y menos de 15 respuestas).
2. **Repaso**: hasta 2 conocimientos que tocan hoy según el calendario (2 ejercicios cada uno).
3. **Refuerzo**: el punto débil prioritario (3 ejercicios); si un requisito de la siguiente
   lección está débil, ese primero.
4. **Siguiente lección del itinerario**, saltando las que ya dominas o superaste en el
   diagnóstico. Si no cabe en los 10–12 minutos, pasa a «si tienes más tiempo».

Repaso y refuerzo se hacen en una sola sesión. También se pueden elegir a mano: repasar errores
(lo fallado en 30 días, con frases nuevas), sesión mixta (un ejercicio de cada tema ya trabajado)
y vocabulario.
