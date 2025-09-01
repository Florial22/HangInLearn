import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "gh" ? "/HangInLearn/" : "./", 
  plugins: [react()],
}));