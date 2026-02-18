import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// GitHub Actions автоматически выставляет GITHUB_ACTIONS=true
const isProd = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  site: "https://ilyascorpion39-svg.github.io",
  base: isProd ? "/xtir-vnext" : "",
  trailingSlash: "always",
  integrations: [react(), tailwind()],
});
