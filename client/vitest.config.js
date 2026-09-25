import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/polyfills.js", "./src/test/setup.js"],
    include: ["src/**/*.test.{js,jsx}"],
    testTimeout: 15000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/main.jsx", "src/test/**"],
    },
  },
});