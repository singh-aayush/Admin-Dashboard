import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    // host omitted to default to localhost,
    // no custom HMR config needed for local dev
  },
});
