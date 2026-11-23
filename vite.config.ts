import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Ruta donde se publica. En GitHub Pages es /<nombre-del-repositorio>/ (la pone el flujo
  // de despliegue con BASE_PATH); en local y en un dominio propio, la raíz.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Partes separadas: React, el contenido pedagógico (lecciones, vocabulario,
        // variantes) y el código de la aplicación. Así el navegador las cachea por
        // separado y ninguna supera el tamaño recomendado.
        manualChunks(id: string) {
          if (id.includes('node_modules')) return 'react'
          if (id.includes('/src/content/')) return 'contenido'
          return undefined
        },
      },
    },
  },
})
