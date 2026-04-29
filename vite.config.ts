import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { runCheckoutPurityCheck } from "./scripts/checkout-purity-check.mjs";

// Vite plugin: fail the build if checkout-critical files reference
// consultation/booking/scheduling/Acuity/Calendly.
const checkoutPurityPlugin = () => ({
  name: "checkout-purity-check",
  buildStart() {
    runCheckoutPurityCheck();
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    checkoutPurityPlugin(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
}));
