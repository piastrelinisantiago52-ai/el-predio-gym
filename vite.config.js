import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // base relativo: la app puede servirse desde cualquier subcarpeta
  // (útil si el link del QR apunta a un hosting estático tipo /gym/)
  base: "./",
});
