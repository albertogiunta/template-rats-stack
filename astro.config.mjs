// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  // DOCS: https://docs.astro.build/en/guides/integrations-guide/sitemap/
  site: "https://placeholder.com", // final deployed url, needed by astro sitemap
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react({}), sitemap({})],
  env: {
    schema: {
      // Database
      DATABASE_PATH: envField.string({
        context: "server",
        access: "public",
        default: "./db/data.db",
      }),

      // App configuration (accessible on client)
      PUBLIC_APP_NAME: envField.string({
        context: "client",
        access: "public",
        default: "placeholder",
      }),

      PUBLIC_APP_URL: envField.string({
        context: "client",
        access: "public",
        default: "http://localhost:4321",
      }),

      // Authentication (better-auth)
      // Uncomment these when you're ready to enable authentication
      // AUTH_SECRET: envField.string({
      //   context: 'server',
      //   access: 'secret',
      // }),
      //
      // GOOGLE_CLIENT_ID: envField.string({
      //   context: 'server',
      //   access: 'secret',
      //   optional: true,
      // }),
      //
      // GOOGLE_CLIENT_SECRET: envField.string({
      //   context: 'server',
      //   access: 'secret',
      //   optional: true,
      // }),

      // Example: Third-party API (secret, server-only)
      // THIRD_PARTY_API_KEY: envField.string({
      //   context: 'server',
      //   access: 'secret',
      // }),

      // THIRD_PARTY_API_URL: envField.string({
      //   context: 'server',
      //   access: 'public',
      //   optional: true,
      // }),
    },
  },
});
