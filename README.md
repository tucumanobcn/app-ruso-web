# Шаг · Ruso paso a paso

Aplicación web personal para aprender ruso en sesiones cortas, pensada para el móvil. La interfaz
está en español y los ejercicios en ruso; todos se responden tocando, sin teclado cirílico.

- Especificación completa: [docs/especificacion.md](docs/especificacion.md)
- Plan por fases y estado: [docs/plan.md](docs/plan.md)
- Motor de dominio: [docs/motor-adaptativo.md](docs/motor-adaptativo.md)
- Fuentes externas (OpenRussian, Tatoeba, YouTube) y licencias: [docs/fuentes-y-licencias.md](docs/fuentes-y-licencias.md)
- Guardado, propuesta de base de datos e IA (con costes): [docs/persistencia-e-ia.md](docs/persistencia-e-ia.md)

## Ejecutar en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
```

Otras órdenes:

```bash
npm test           # tests unitarios (Vitest), incluida la validación del contenido
npm run lint       # linter (oxlint)
npm run build      # comprobación de tipos y compilación a dist/
npm run preview    # sirve la versión compilada
```

## Estructura

```
src/
  content/            Contenido pedagógico (datos, no lógica)
    glossary.ts       Habilidades y tipos de error
    knowledgeMap.ts   Nivel, importancia y dependencias de cada conocimiento
    lessons/          Una lección por archivo + index.ts con el orden del catálogo
    vocab/            Vocabulario verificado (generado desde OpenRussian y Tatoeba)
    variants/         Plantillas que generan variantes de ejercicios con formas verificadas
    resources.ts      Vídeos de YouTube verificados
    tools.ts          Herramientas de consulta externas comprobadas (OpenRussian, Wiktionary, Tatoeba)
    origin.ts         Origen y confianza de cada ejercicio (lección, variante, generado)
  lib/
    answers.ts        Motor de corrección (todos los formatos)
    session.ts        Sesiones de lección: barajado, compatibilidad, resultado
    storage.ts        Formato del progreso, validación y migración de versiones
    persistence.ts    Dónde se guarda: IndexedDB (o localStorage) y migración entre almacenes
    contentReports.ts Avisos de ejercicios dudosos
    backup.ts         Exportar / importar en JSON
    validateContent.ts Validador del contenido y del mapa de conocimientos
  engine/             Dominio, repasos (FSRS), diagnóstico, perfil por competencias, planificador
                      y estadísticas del panel (ver docs/motor-adaptativo.md)
  components/         Componentes de interfaz (questions/ = un formato por archivo, illustrations/ = SVG)
  screens/            Pantallas: inicio (plan del día), catálogo, lección, resultados, panel de
                      progreso, recursos, diagnóstico, datos
```

## Publicar en GitHub Pages

La app es estática (HTML, CSS y JavaScript, sin servidor), así que se puede alojar gratis.
El flujo `.github/workflows/deploy.yml` la compila y publica cada vez que se sube un cambio a
`main`, después de pasar el lint y los tests.

1. Crea un repositorio en GitHub (con una cuenta personal) y sube este proyecto a la rama `main`.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. La app queda en `https://<usuario>.github.io/<repositorio>/`. El flujo pone sola la ruta base
   (`BASE_PATH=/<repositorio>/`); en local y con un dominio propio se usa `/`.

Para probar en local la versión publicada (en PowerShell):

```powershell
$env:BASE_PATH = '/app-ruso/'; npm run build; npx vite preview
```

Notas:

- La página lleva `noindex` para que los buscadores no la indexen, pero cualquiera con el enlace
  puede abrirla. El progreso de cada persona se queda en su propio navegador.
- En GitHub gratuito, Pages solo funciona con repositorios **públicos**: el código y la carpeta
  `docs/` quedan a la vista.
- En el móvil, «Añadir a pantalla de inicio» usa el icono y el nombre de `public/manifest.webmanifest`.
  La app aún no funciona sin conexión.

## Añadir contenido

1. Crea o edita un archivo en `src/content/lessons/` siguiendo los tipos de `src/content/types.ts`.
2. Si la lección es nueva, añádela a `LESSONS` en `src/content/lessons/index.ts`.
3. Si usas una habilidad nueva, regístrala en `src/content/glossary.ts` y en
   `src/content/knowledgeMap.ts`; un tipo de error nuevo, solo en el glosario.
4. Ejecuta `npm test`: el validador avisa de ids repetidos, respuestas correctas inexistentes,
   opciones incorrectas sin explicación, órdenes alternativos imposibles, etc.

## Diseño

Identidad «Electric Coral» definida con variables CSS al principio de `src/index.css`:
violeta para navegación y botones, coral para acciones secundarias y destacados, menta para el
progreso, amarillo para logros. Incluye modo oscuro y contrastes AA comprobados. Las gráficas del
panel usan una serie por gráfica (violeta para minutos, verde de éxito para aciertos), con
tooltip accesible por teclado y tabla con los datos.

## Cómo se guardan los datos

El progreso se guarda en IndexedDB, la base de datos del navegador (base `app-ruso`, almacén
`datos`): sesión en curso, lecciones terminadas, cada respuesta con su tipo de error, vídeos
abiertos, diagnóstico, avisos sobre ejercicios y preferencias. No hay servidor.

- Los datos de versiones anteriores, guardados en `localStorage`, se pasan solos a IndexedDB la
  primera vez y solo se borran de allí tras comprobar la copia. Si IndexedDB no está disponible se
  sigue usando `localStorage`.
- Los datos viven solo en ese navegador y dispositivo, y se pierden si se borran los datos del
  sitio o se usa una ventana privada.
- Desde «Progreso → Mis datos» se puede exportar una copia en JSON e importarla en otro navegador,
  y pedir al navegador que no borre los datos por falta de espacio.
