import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Backend (IIS) base URL. In dev, Vite proxies /api here so the browser only
// ever talks to localhost (no CORS / mixed-content). In prod, Vercel rewrites
// handle the same proxying (see vercel.json).
const API_TARGET = process.env.VITE_API_TARGET ?? "http://194.164.126.42:81";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});
