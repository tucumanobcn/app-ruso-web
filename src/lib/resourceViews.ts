import { createContext, useContext } from 'react'

export interface ResourceViews {
  /** id del recurso → fecha ISO de la última vez que se abrió. */
  viewed: Record<string, string>
  markViewed: (id: string) => void
}

/** Registro de recursos externos consultados, compartido por toda la interfaz. */
export const ResourceViewsContext = createContext<ResourceViews>({
  viewed: {},
  markViewed: () => {},
})

export function useResourceViews(): ResourceViews {
  return useContext(ResourceViewsContext)
}
