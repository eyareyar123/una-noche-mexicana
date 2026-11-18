import type { NextConfig } from "next";

/**
 * Static export: `npm run build` produces plain HTML/CSS/JS in `out/`.
 * No server is needed — upload `out/` to any free static host
 * (Netlify Drop, Cloudflare Pages, GitHub Pages…). See README.
 */
// GitHub Pages serves the site under /<repo-name>; the deploy workflow sets this.
// Locally it's empty, so the site lives at the root.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
