import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://mailhtml.yekta.dev",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover"
  },
  build: {
    assets: "assets"
  },
  integrations: [tailwind(), react(), robotsTxt()]
});