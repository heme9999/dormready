import { describe, it, expect, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const node22Path = '/Users/hemrmicloud.com/.nvm/versions/node/v22.23.1/bin';
const envPath = fs.existsSync(node22Path) ? `${node22Path}:${process.env.PATH || ''}` : process.env.PATH;

const previewDistDir = path.resolve(process.cwd(), 'dist-test-preview');
const productionDistDir = path.resolve(process.cwd(), 'dist-test-production');

describe('Indexing & Environment Switching Logic', () => {
  afterAll(() => {
    // Clean up temporary test output directories
    if (fs.existsSync(previewDistDir)) fs.rmSync(previewDistDir, { recursive: true, force: true });
    if (fs.existsSync(productionDistDir)) fs.rmSync(productionDistDir, { recursive: true, force: true });
  });

  it('Preview build outputs noindex metadata, X-Robots-Tag header, robots.txt Disallow, and preview canonicals', () => {
    // Build isolated preview output
    execSync(`npx astro build --outDir dist-test-preview`, {
      stdio: 'pipe',
      env: {
        ...process.env,
        PATH: envPath,
        PUBLIC_SITE_ENV: 'preview',
        PUBLIC_SITE_URL: 'https://dormready-preview.pages.dev',
      },
    });

    const robotsPath = path.join(previewDistDir, 'robots.txt');
    const headersPath = path.join(previewDistDir, '_headers');
    const indexPath = path.join(previewDistDir, 'index.html');

    expect(fs.existsSync(robotsPath)).toBe(true);
    expect(fs.existsSync(headersPath)).toBe(true);
    expect(fs.existsSync(indexPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    const headersContent = fs.readFileSync(headersPath, 'utf-8');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // 1. robots.txt must disallow crawling in preview
    expect(robotsContent).toContain('Disallow: /');
    expect(robotsContent).not.toContain('Allow: /');

    // 2. _headers must include X-Robots-Tag: noindex, nofollow
    expect(headersContent).toContain('X-Robots-Tag: noindex, nofollow');

    // 3. HTML meta tag must specify noindex, nofollow
    expect(indexHtml).toContain('<meta name="robots" content="noindex, nofollow"');

    // 4. Canonical and OG URLs must point to preview domain, NEVER to dormready.org in preview mode
    expect(indexHtml).toContain('href="https://dormready-preview.pages.dev/"');
    expect(indexHtml).toContain('content="https://dormready-preview.pages.dev/"');
    expect(indexHtml).not.toContain('dormready.org');
  });

  it('Production build outputs index follow, Allow: /, sitemap, production canonicals, and NO noindex directives', () => {
    // Build isolated production output
    execSync(`npx astro build --outDir dist-test-production`, {
      stdio: 'pipe',
      env: {
        ...process.env,
        PATH: envPath,
        PUBLIC_SITE_ENV: 'production',
        PUBLIC_SITE_URL: 'https://dormready.org',
      },
    });

    const robotsPath = path.join(productionDistDir, 'robots.txt');
    const headersPath = path.join(productionDistDir, '_headers');
    const indexPath = path.join(productionDistDir, 'index.html');
    const checklistPath = path.join(productionDistDir, 'college-dorm-checklist', 'index.html');

    expect(fs.existsSync(robotsPath)).toBe(true);
    expect(fs.existsSync(headersPath)).toBe(true);
    expect(fs.existsSync(indexPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    const headersContent = fs.readFileSync(headersPath, 'utf-8');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    const checklistHtml = fs.readFileSync(checklistPath, 'utf-8');

    // 1. robots.txt must allow crawling and reference production sitemap
    expect(robotsContent).toContain('Allow: /');
    expect(robotsContent).not.toContain('Disallow: /');
    expect(robotsContent).toContain('Sitemap: https://dormready.org/sitemap-index.xml');

    // 2. _headers must NOT contain any X-Robots-Tag or noindex
    expect(headersContent).not.toContain('X-Robots-Tag');
    expect(headersContent).not.toContain('noindex');

    // 3. HTML meta tag must specify index, follow
    expect(indexHtml).toContain('<meta name="robots" content="index, follow');
    expect(indexHtml).not.toContain('noindex');
    expect(checklistHtml).toContain('<meta name="robots" content="index, follow');
    expect(checklistHtml).not.toContain('noindex');

    // 4. Canonical URLs must point to production domain
    expect(indexHtml).toContain('href="https://dormready.org/"');
    expect(checklistHtml).toContain('href="https://dormready.org/college-dorm-checklist/"');
  });
});
