import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://x-tir.ru",
  output: "static",
  trailingSlash: "ignore",
  compressHTML: true,

  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],

  vite: {
    ssr: {
      noExternal: ["three", "@react-three/fiber", "@react-three/drei"],
    },
  },

  build: {
    inlineStylesheets: "auto",
  },
});
