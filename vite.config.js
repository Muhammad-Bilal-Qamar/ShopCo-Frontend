import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7110',
        changeOrigin: true,
        secure: false,
      },
      "/chat": {
        target: "https://localhost:7110", // <-- same backend port
        changeOrigin: true,
        secure: false,
        ws: true, // REQUIRED — this is what lets the WebSocket upgrade through
      },
    },
  },
})