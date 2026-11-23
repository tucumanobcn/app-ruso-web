export interface SessionOption {
  id: string
  title: string
  description: string
  /** Si existe, la opción está desactivada y se explica por qué. */
  disabledReason?: string
  onSelect: () => void
}

/** Elegir otro tipo de sesión a mano. */
export function SessionChooser({ options }: { options: SessionOption[] }) {
  return (
    <section className="card" aria-labelledby="chooser-title">
      <h2 id="chooser-title">Elige otro tipo de sesión</h2>
      <ul className="chooser">
        {options.map((option) => (
          <li key={option.id}>
            <button
              className="chooser__item"
              onClick={option.onSelect}
              disabled={Boolean(option.disabledReason)}
              aria-describedby={`chooser-${option.id}`}
            >
              <span className="chooser__title">{option.title}</span>
              <span className="chooser__desc" id={`chooser-${option.id}`}>
                {option.disabledReason ?? option.description}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
