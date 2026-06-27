import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
// In production we build for GitHub Pages, served from /shopify/.
// In dev we serve from the root.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/shopify/" : "/",
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
}));
