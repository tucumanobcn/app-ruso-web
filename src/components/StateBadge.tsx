import { STATE_LABEL, type MasteryState } from '../engine/mastery'

interface StateBadgeProps {
  state: MasteryState
  /** Si se indica, «dominado» muestra si es provisional o consolidado. */
  consolidated?: boolean
}

export function StateBadge({ state, consolidated }: StateBadgeProps) {
  const suffix =
    state === 'dominado' && consolidated !== undefined
      ? consolidated
        ? ' · consolidado'
        : ' · provisional'
      : ''
  return (
    <span className={`state state--${state}`}>
      {STATE_LABEL[state]}
      {suffix}
    </span>
  )
}
