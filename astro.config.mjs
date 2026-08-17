import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

const isProduction = (process.env.PUBLIC_SITE_ENV || 'preview') === 'production';
const siteUrl = process.env.PUBLIC_SITE_URL || (isProduction ? 'https://dormready.org' : 'https://dormready-preview.pages.dev');

function indexingAndHeadersIntegration() {
  return {
    name: 'indexing-and-headers-generator',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const isProd = (process.env.PUBLIC_SITE_ENV || 'preview') === 'production';
        const finalSiteUrl = process.env.PUBLIC_SITE_URL || (isProd ? 'https://dormready.org' : 'https://dormready-preview.pages.dev');

        // 1. Generate robots.txt
        const robotsTxt = isProd
          ? `User-agent: *\nAllow: /\n\nSitemap: ${finalSiteUrl}/sitemap-index.xml\n`
          : `User-agent: *\nDisallow: /\n`;
        await fs.promises.writeFile(new URL('robots.txt', dir), robotsTxt, 'utf-8');

        // 2. Generate Cloudflare Pages _headers
        const headersContent = isProd
          ? `/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`
          : `/*
  X-Robots-Tag: noindex, nofollow
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;
        await fs.promises.writeFile(new URL('_headers', dir), headersContent, 'utf-8');
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: [
    react(),
    sitemap(),
    indexingAndHeadersIntegration(),
  ],
  build: {
    format: 'directory',
  },
});
