import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/HangInLearn/", // <-- EXACT repo name
  plugins: [react()],
});
