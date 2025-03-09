import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forward '/api' requests to your Express server running on port 3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
