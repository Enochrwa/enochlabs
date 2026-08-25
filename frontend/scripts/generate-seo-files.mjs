#!/usr/bin/env node
/**
 * Generates dist/robots.txt and dist/sitemap.xml after the Vite build.
 *
 * The frontend is a client-rendered SPA (see docs/SPRINT-PLAN.md Sprint 2), so
 * search engines can't discover routes by crawling links inside a single
 * server-rendered document the way they would on a traditional site. A static
 * sitemap.xml lists every real route explicitly so crawlers know they exist,
 * without requiring full prerendering.
 *
 * Site URL resolution mirrors vite.config.ts: prefer VITE_SITE_URL from the
 * environment, otherwise fall back to the documented default domain so this
 * script never fails in CI (which only has `.env.example`, not a real `.env`).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const DEFAULT_SITE_URL = "https://enochlabs.dev";

const siteUrl = (process.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");

// Every real route in src/App.tsx, excluding the catch-all 404.
const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "monthly", priority: "0.8" },
  { path: "/work", changefreq: "monthly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
];

const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

const distDir = path.resolve(fileURLToPath(new URL(".", import.meta.url)), "..", "dist");

writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
writeFileSync(path.join(distDir, "robots.txt"), robots);

console.log(`[seo] wrote sitemap.xml and robots.txt for ${siteUrl}`);
