import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), componentTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "cropadvisory-drbn.onrender.com",
      ".onrender.com",
      "localhost",
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "cropadvisory-drbn.onrender.com",
      ".onrender.com",
      "localhost",
    ],
  },
}));
