interface RussianPromptProps {
  text: string
  /** Texto que rellena el hueco una vez corregida la pregunta. */
  filled?: string
}

/** Muestra una frase rusa y sustituye «___» por un hueco visible. */
export function RussianPrompt({ text, filled }: RussianPromptProps) {
  const parts = text.split('___')
  return (
    <p className="prompt" lang="ru">
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 &&
            (filled ? (
              <span className="blank blank--filled">{filled}</span>
            ) : (
              <span className="blank" aria-label="hueco">
                {'   '}
              </span>
            ))}
        </span>
      ))}
    </p>
  )
}
