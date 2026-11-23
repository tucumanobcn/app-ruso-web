import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { openBrowserProgress } from './lib/persistence'

// En desarrollo, avisa en la consola si el contenido pedagógico tiene errores de estructura.
if (import.meta.env.DEV) {
  void Promise.all([import('./lib/validateContent'), import('./content/lessons')]).then(
    ([{ validateLessons }, { LESSONS }]) => {
      const issues = validateLessons(LESSONS)
      if (issues.length > 0) console.error('Problemas en el contenido de las lecciones:', issues)
    },
  )
}

// El progreso se lee de IndexedDB (asíncrono) antes de mostrar la aplicación.
void openBrowserProgress().then((opened) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App opened={opened} />
    </StrictMode>,
  )
})
