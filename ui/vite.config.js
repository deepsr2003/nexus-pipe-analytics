import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests from /api to your Node.js backend
      '/api': {
        target: 'http://localhost:8080', // Your Query API server
        changeOrigin: true,
      },
      // Proxy WebSocket connections
      '/socket.io': { // Default path for WebSocket connections
        target: 'ws://localhost:8080',
        ws: true,
      },
    },
  },
})
