import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    proxy: {
      // Forward '/api' requests to service
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
      // Forward '/ws' requests to WebSocket server
      "/ws": {
        target: "ws://localhost:3000",
        ws: true,
        changeOrigin: true,
      }
    },
    https: false, // Disable HTTPS for local development
  },
});
