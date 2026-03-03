import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['2282-2001-e68-542f-a222-bcb4-595e-7df8-1501.ngrok-free.app']
  },
  // base: '/SonShip-2026/',
})
