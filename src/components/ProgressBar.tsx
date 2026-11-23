interface ProgressBarProps {
  value: number
  max: number
  label: string
}

export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className="progress">
      <div className="progress__label">{label}</div>
      <div
        className="progress__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      >
        <div className="progress__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
