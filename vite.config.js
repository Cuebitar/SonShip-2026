import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['c31e-2001-e68-542f-a222-bcb4-595e-7df8-1501.ngrok-free.app']
  },
  base: '/SonShip-2026/',
})
