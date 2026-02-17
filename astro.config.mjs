import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

const isProd = process.env.GITHUB_ACTIONS === "true";

// GitHub Pages project site: https://<user>.github.io/<repo>/
export default defineConfig({
  site: "https://ilyascorpion39-svg.github.io/xtir-vnext",
  base: isProd ? "/xtir-vnext" : "",
  trailingSlash: "always",

  integrations: [react(), tailwind()],
});

