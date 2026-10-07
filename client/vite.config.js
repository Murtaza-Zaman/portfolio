import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("gsap") || id.includes("@gsap")) {
              return "vendor-gsap";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("@tanstack")) {
              return "vendor-query";
            }
            if (id.includes("react-router")) {
              return "vendor-router";
            }
            if (id.includes("react") || id.includes("scheduler")) {
              return "vendor-react";
            }
          }
        },
      },
    },
  },
});
