import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // ✅ Use IPv4 to avoid "::" issues
    port: 8080,
    allowedHosts: [
      "cropadvisory-drbn.onrender.com", // ✅ Your Render domain
      ".onrender.com", // ✅ Allow all subdomains of Render (backup)
      "localhost", // ✅ Allow local development
    ],
  },
  preview: {
    host: "0.0.0.0", // ✅ Important for production preview
    port: 8080,
    allowedHosts: [
      "cropadvisory-drbn.onrender.com",
      ".onrender.com",
      "localhost",
    ],
  },
}));
