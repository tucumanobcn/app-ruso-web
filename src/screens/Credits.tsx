import { CHANNELS, RESOURCES_VERIFIED_ON, VIDEOS } from '../content/resources'

/** Fuentes externas, licencias y qué datos guarda la app. Necesaria al publicarla. */
export function Credits() {
  const verified = new Date(RESOURCES_VERIFIED_ON).toLocaleDateString('es-ES')
  return (
    <div className="stack">
      <header className="page-header">
        <h1>Fuentes y licencias</h1>
        <p className="muted">
          De dónde sale cada contenido de la app y con qué licencia se usa.
        </p>
      </header>

      <section className="card" aria-labelledby="cr-vocab">
        <h2 id="cr-vocab">Vocabulario, acentos y formas: OpenRussian</h2>
        <p>
          Los acentos, el género y las declinaciones y conjugaciones de las palabras (y las formas que
          usan las variantes de ejercicios) proceden del diccionario de{' '}
          <a href="https://openrussian.org" target="_blank" rel="noreferrer">
            OpenRussian.org
          </a>
          , a partir de sus{' '}
          <a href="https://github.com/Badestrand/russian-dictionary" target="_blank" rel="noreferrer">
            datos abiertos
          </a>
          , basados en Wiktionary y corregidos por su comunidad.
        </p>
        <p>
          Licencia:{' '}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noreferrer">
            Creative Commons Atribución-CompartirIgual 4.0 (CC BY-SA 4.0)
          </a>
          . Los extractos de esos datos incluidos en la app se comparten con la misma licencia. Las
          traducciones al español de cada palabra son propias.
        </p>
      </section>

      <section className="card" aria-labelledby="cr-tatoeba">
        <h2 id="cr-tatoeba">Frases de ejemplo: Tatoeba</h2>
        <p>
          Las frases de las tarjetas de vocabulario y su traducción proceden de{' '}
          <a href="https://tatoeba.org/es/" target="_blank" rel="noreferrer">
            Tatoeba
          </a>
          , escritas por voluntarios. Cada tarjeta enlaza a la frase original y nombra a su autor.
        </p>
        <p>
          Licencia:{' '}
          <a href="https://creativecommons.org/licenses/by/2.0/fr/deed.es" target="_blank" rel="noreferrer">
            Creative Commons Atribución 2.0 Francia (CC BY 2.0 FR)
          </a>
          .
        </p>
      </section>

      <section className="card" aria-labelledby="cr-videos">
        <h2 id="cr-videos">Vídeos</h2>
        <p>
          Los {VIDEOS.length} vídeos recomendados son de los canales{' '}
          {Object.values(CHANNELS)
            .map((c) => c.name)
            .join(', ')}
          . La app solo enlaza a YouTube: no los copia ni los incrusta, y sus derechos son de sus
          autores. Título, canal y duración se comprobaron el {verified}.
        </p>
      </section>

      <section className="card" aria-labelledby="cr-own">
        <h2 id="cr-own">Contenido propio</h2>
        <p>
          Las explicaciones, los ejercicios, las ilustraciones y el diseño son originales de esta app.
          No ha revisado el contenido un hablante nativo: si algo te parece incorrecto, usa «Avisar de
          un problema» en la corrección del ejercicio.
        </p>
      </section>

      <section className="card" aria-labelledby="cr-privacy">
        <h2 id="cr-privacy">Tus datos</h2>
        <ul className="plain-list">
          <li>Tu progreso se guarda solo en el navegador de este dispositivo. No se envía a ningún servidor.</li>
          <li>La app no usa cookies, publicidad ni estadísticas de uso.</li>
          <li>
            Al abrir un vídeo o una herramienta de consulta sales a otro sitio (YouTube, OpenRussian,
            Wiktionary o Tatoeba), que tiene sus propias condiciones.
          </li>
        </ul>
      </section>
    </div>
  )
}
