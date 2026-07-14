import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    
    // === AGREGA ESTO PARA GENERAR EL LCOV.INFO ===
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"], // Añade 'lcov' explícitamente
    },
  },
});