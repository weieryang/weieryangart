import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const root = fileURLToPath(new URL(".", import.meta.url));
const pageRoutes = [
  "garden-sculpture",
  "public-art",
  "resort-sculpture",
  "water-feature-sculpture",
  "bronze-sculpture",
  "stainless-steel-sculpture",
  "stone-sculpture",
  "custom-sculpture",
  "projects",
  "process",
  "materials",
  "faq",
];

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        commission: resolve(root, "commission/index.html"),
        ...Object.fromEntries(pageRoutes.map((route) => [route, resolve(root, `${route}/index.html`)])),
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client"],
  },
  server: {
    warmup: {
      clientFiles: ["./src/main.jsx"],
    },
  },
  plugins: [react()],
});
