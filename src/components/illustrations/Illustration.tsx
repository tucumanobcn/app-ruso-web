import type { JSX } from 'react'
import type { IllustrationId } from './alts'
import { ILLUSTRATIONS } from './registry'

export function Illustration({ id }: { id: IllustrationId }): JSX.Element {
  const { Component } = ILLUSTRATIONS[id]
  return (
    <figure className="illustration">
      <Component />
    </figure>
  )
}
