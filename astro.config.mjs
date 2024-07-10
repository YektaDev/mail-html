import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  build: {
    assets: "assets",
  },
  integrations: [tailwind(), react()],
});
