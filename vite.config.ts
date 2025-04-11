import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from 'vite-plugin-mkcert';

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    proxy: {
      // Forward '/api' requests to service
      "/api": {
        target: "https://localhost:3000",
        changeOrigin: true,
        secure: false
      },
      // Forward '/ws' requests to WebSocket server
      "/ws": {
        target: "wss://localhost:3000",
        ws: true,
        changeOrigin: true,
        secure: false,
      }
    },
    https: true
  },
});
