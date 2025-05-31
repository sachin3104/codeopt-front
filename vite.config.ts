import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      'localhost',
      '.ngrok-free.app', // Allow all ngrok free domains
      '.ngrok.io',       // Allow legacy ngrok domains
      '.ngrok.app'       // Allow newer ngrok app domains
    ]
  },
  plugins: [
    react(),
    mode === 'development' &&
      componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));