import {
  CASE_LABEL,
  GENDER_LABEL,
  SOURCES,
  tatoebaUrl,
  vocabForLesson,
  type NounEntry,
  type VocabEntry,
} from '../content/vocab'

/** Tarjetas de las palabras de una lección, con datos verificados de OpenRussian y Tatoeba. */
export function VocabCards({ lessonId }: { lessonId: string }) {
  const entries = vocabForLesson(lessonId)
  if (entries.length === 0) return null

  return (
    <section className="card vocab" aria-labelledby={`vocab-${lessonId}`}>
      <p className="eyebrow eyebrow--coral">Vocabulario</p>
      <h2 id={`vocab-${lessonId}`}>Palabras de la lección</h2>
      <p className="muted small">
        {entries.length} palabras muy rusas y cotidianas. Fíjate en el acento (´) y en la forma
        destacada: la practicarás al final de la lección.
      </p>
      <ul className="vocab-list">
        {entries.map((entry) => (
          <VocabCard key={entry.id} entry={entry} />
        ))}
      </ul>
      <p className="source-note">
        Acentos y formas:{' '}
        <a href={SOURCES.openRussian.url} target="_blank" rel="noreferrer">
          OpenRussian
        </a>{' '}
        ({SOURCES.openRussian.license}). Frases de ejemplo:{' '}
        <a href={SOURCES.tatoeba.url} target="_blank" rel="noreferrer">
          Tatoeba
        </a>{' '}
        ({SOURCES.tatoeba.license}). Traducción de las palabras: propia.
      </p>
    </section>
  )
}

function VocabCard({ entry }: { entry: VocabEntry }) {
  return (
    <li className="vocab-card">
      <div className="vocab-card__head">
        <span className="vocab-card__word" lang="ru">
          {entry.accented}
        </span>
        <span className="vocab-card__meaning">{entry.es}</span>
      </div>

      {entry.pos === 'noun' ? (
        <>
          <p className="vocab-card__meta">
            {entry.noun.gender ? GENDER_LABEL[entry.noun.gender] : 'sustantivo'}
            {entry.noun.animate ? ' · animado' : ''}
            {entry.noun.indeclinable ? ' · invariable' : ''}
          </p>
          <p className="vocab-card__focus" lang="ru">
            {entry.focus.text}
          </p>
          {!entry.noun.indeclinable && <Declension entry={entry} />}
        </>
      ) : (
        <>
          <p className="vocab-card__meta">
            verbo · perfectivo:{' '}
            <span lang="ru" className="ru">
              {entry.verb.perfective}
            </span>
          </p>
          <p className="vocab-card__focus" lang="ru">
            я {entry.verb.imperfectiveForms.ya}, ты {entry.verb.imperfectiveForms.ty} → я{' '}
            {entry.verb.perfectiveForms.ya}
          </p>
          <p className="vocab-card__meta" lang="ru">
            {entry.verb.imperfectiveForms.pastM} / {entry.verb.perfectiveForms.pastM}
          </p>
        </>
      )}

      {entry.example ? (
        <p className="vocab-card__example">
          <span lang="ru" className="ru">
            {entry.example.ru}
          </span>
          <span className="muted">{entry.example.es}</span>
          <a href={tatoebaUrl(entry.example.ruId)} target="_blank" rel="noreferrer" className="source-link">
            Tatoeba #{entry.example.ruId}
            {entry.example.author ? ` · ${entry.example.author}` : ''}
          </a>
        </p>
      ) : (
        <p className="vocab-card__example muted small">Sin frase de ejemplo verificada todavía.</p>
      )}
    </li>
  )
}

function Declension({ entry }: { entry: NounEntry }) {
  const { declension, plOnly } = entry.noun
  return (
    <details className="declension">
      <summary>Ver declinación</summary>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Caso</th>
              {!plOnly && <th scope="col">Singular</th>}
              <th scope="col">Plural</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(CASE_LABEL).map(([key, label]) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                {!plOnly && <td lang="ru">{declension[`sg_${key}`] ?? '—'}</td>}
                <td lang="ru">{declension[`pl_${key}`] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
