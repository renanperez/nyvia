import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts'
  }
})

// globals: true - permite usar describe, test, expect sem importar
// environment: 'jsdom' - simula ambiente de browser
// setupFiles: arquivo de configuração inicial dos testes