import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const isGh = process.env.GITHUB_ACTIONS === 'true';
const repo = (process.env.GITHUB_REPOSITORY?.split('/')[1]) ?? 'xtir-vnext';
const owner = (process.env.GITHUB_REPOSITORY?.split('/')[0]) ?? '';
const ghBase = `/${repo}/`;
const ghSite = owner ? `https://${owner}.github.io` : "https://github.io";

export default defineConfig({
  site: isGh ? ghSite : 'https://x-tir.ru',
  base: isGh ? ghBase : "/",
  output: "static",
  trailingSlash: "always",
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
