import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Fallback used whenever VITE_SITE_URL isn't set (e.g. CI builds, which only
// have `.env.example` committed, not a real `.env`). Keeps `%VITE_SITE_URL%`
// placeholders in index.html from ever reaching Vite's built-in html env
// replacement unresolved, which otherwise fails the build.
const DEFAULT_SITE_URL = "https://enochlabs.dev";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

  return {
    plugins: [
      react(),
      {
        name: "html-env-defaults",
        transformIndexHtml: {
          order: "pre",
          handler(html: string) {
            return html.replaceAll("%VITE_SITE_URL%", siteUrl);
          },
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
    },
  };
});
