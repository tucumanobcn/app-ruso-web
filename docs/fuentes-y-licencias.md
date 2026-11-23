# Fuentes externas y licencias

## Vocabulario: OpenRussian

- Origen: <https://github.com/Badestrand/russian-dictionary> (datos de <https://openrussian.org>,
  basados en Wiktionary y corregidos por su comunidad).
- Licencia: **Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0)**.
- Qué se usa: acentos, género, animación, declinaciones completas y conjugaciones de las palabras
  elegidas para cada lección. No se generan con IA.
- Dónde está: `src/content/vocab/vocab.generated.ts` (tarjetas de vocabulario) y
  `src/content/vocab/forms.generated.ts` (formas para las variantes de ejercicios). Al ser extractos
  de esos datos, **esos dos archivos se distribuyen también bajo CC BY-SA 4.0**. El resto del código
  de la aplicación no está afectado.
- Traducciones al español de cada palabra: elaboración propia (OpenRussian solo trae inglés y
  alemán; su traducción inglesa se guarda en el campo `en` como referencia).

## Frases de ejemplo: Tatoeba

- Origen: API pública de <https://tatoeba.org>.
- Licencia: **Creative Commons Atribución 2.0 Francia (CC BY 2.0 FR)**.
- Qué se usa: frases rusas cortas que contienen la palabra y tienen una traducción directa al
  español hecha por la comunidad. Cada tarjeta enlaza a la frase original y nombra a su autor.
- Las frases se revisaron a mano; las descartadas están en `skipExampleIds` de
  `scripts/vocab/selection.json` con el motivo.

## Vídeos de YouTube

- Canales: Amazing Russian (@AmazingRussian), Russian With Max (@RussianWithMax) y
  О русском по-русски (@orusskomporusski).
- La aplicación solo enlaza a los vídeos; no los descarga ni los incrusta.
- Verificación (23/11/2026): título y canal con el servicio oEmbed de YouTube; duración con la página
  de búsqueda del propio canal. Datos en `src/content/resources.ts`.
- Los enlaces «Buscar más» abren la búsqueda del canal y están marcados como sugerencias sin
  verificar.

## Herramientas de consulta (pestaña «Recursos»)

Enlaces en `src/content/tools.ts`, comprobados el 23/11/2026 (respuesta 200 y título de la
página): OpenRussian, Wiktionary en inglés, Викисловарь, Tatoeba y el repositorio
Badestrand/russian-dictionary. Los enlaces para buscar una palabra (OpenRussian y los dos
Wiktionary) se comprobaron con «дом». La búsqueda de Tatoeba no se enlaza porque su página de
resultados no se pudo comprobar de forma automática. La app no envía nada a estos sitios: la
palabra solo viaja si abres el enlace.

Las «búsquedas sugeridas» de esa pestaña son búsquedas dentro de los canales de YouTube y se
muestran como «sin verificar»: nadie ha revisado sus resultados.

## Regenerar el vocabulario

1. Descarga `nouns.csv` y `verbs.csv` del repositorio de OpenRussian a una carpeta cualquiera.
2. Edita `scripts/vocab/selection.json` (palabras, traducción, forma destacada).
3. Ejecuta `node scripts/vocab/build-vocab.mjs <carpeta-con-los-csv>` (tarjetas) y
   `node scripts/vocab/build-forms.mjs <carpeta-con-los-csv>` (formas de `scripts/vocab/pool.json`).
4. Revisa las frases de Tatoeba elegidas y ejecuta `npm test`.

## Ilustraciones

Dibujos SVG originales de este proyecto (`src/components/illustrations/`), sin recursos de
terceros.
