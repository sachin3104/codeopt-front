import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: true,            // listen on all interfaces (0.0.0.0 & ::) 
    port: 8080,
    allowedHosts: [
      "localhost",
      ".ngrok-free.app",
      ".ngrok.io",
      ".ngrok.app",
    ],
    hmr: {
      protocol: "wss",      // ensure secure WS
      clientPort: 443,      // tell the client to connect on 443
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
}));
