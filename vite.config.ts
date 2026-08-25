import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const HOST = process.env.SERVER_HOST || "localhost";
const PORT = process.env.SERVER_PORT || "3000"

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api": {
        target: `http://${HOST}:${PORT}`,
        changeOrigin: true
      }
    }
  }
});
