import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import netlify from "@astrojs/netlify";

const isNetlify = !!process.env.NETLIFY;
const isGitHubActions = !!process.env.GITHUB_ACTIONS;

export default defineConfig({
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
  ],

  // Статика для GitHub Pages и обычного хостинга
  output: "static",

  // На Netlify можно оставить адаптер, но для GH Pages он не нужен
  adapter: isNetlify ? netlify() : undefined,

  // GitHub Pages публикует проект в подпапке /xtir-vnext/
  base: isGitHubActions ? "/xtir-vnext" : undefined,

  // RU only
  i18n: {
    defaultLocale: "ru",
    locales: ["ru"],
    routing: { prefixDefaultLocale: false },
  },

  vite: {
    ssr: {
      noExternal: ["three", "@react-three/fiber", "@react-three/drei"],
    },
  },

  site: "https://x-tir.ru",
  compressHTML: true,
  build: { inlineStylesheets: "auto" },
});
