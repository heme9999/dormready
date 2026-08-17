import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const node22Path = '/Users/hemrmicloud.com/.nvm/versions/node/v22.23.1/bin';
const envPath = fs.existsSync(node22Path) ? `${node22Path}:${process.env.PATH || ''}` : process.env.PATH;

describe('Indexing & Environment Switching Logic', () => {
  it('Preview build outputs noindex metadata, X-Robots-Tag header, and robots.txt Disallow', () => {
    // Run build with preview env
    execSync('npm run build', {
      stdio: 'pipe',
      env: {
        ...process.env,
        PATH: envPath,
        PUBLIC_SITE_ENV: 'preview',
        PUBLIC_SITE_URL: 'https://dormready-preview.pages.dev',
      },
    });

    const distDir = path.resolve(process.cwd(), 'dist');
    const robotsPath = path.join(distDir, 'robots.txt');
    const headersPath = path.join(distDir, '_headers');
    const indexPath = path.join(distDir, 'index.html');

    expect(fs.existsSync(robotsPath)).toBe(true);
    expect(fs.existsSync(headersPath)).toBe(true);
    expect(fs.existsSync(indexPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    const headersContent = fs.readFileSync(headersPath, 'utf-8');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    // 1. robots.txt must disallow in preview
    expect(robotsContent).toContain('Disallow: /');
    expect(robotsContent).not.toContain('Allow: /');

    // 2. _headers must include X-Robots-Tag: noindex, nofollow
    expect(headersContent).toContain('X-Robots-Tag: noindex, nofollow');

    // 3. HTML meta tag must specify noindex, nofollow
    expect(indexHtml).toContain('<meta name="robots" content="noindex, nofollow"');
  });

  it('Production build outputs index follow, Allow: /, sitemap, and NO noindex directives', () => {
    // Run build with production env
    execSync('npm run build', {
      stdio: 'pipe',
      env: {
        ...process.env,
        PATH: envPath,
        PUBLIC_SITE_ENV: 'production',
        PUBLIC_SITE_URL: 'https://dormready.org',
      },
    });

    const distDir = path.resolve(process.cwd(), 'dist');
    const robotsPath = path.join(distDir, 'robots.txt');
    const headersPath = path.join(distDir, '_headers');
    const indexPath = path.join(distDir, 'index.html');
    const checklistPath = path.join(distDir, 'college-dorm-checklist', 'index.html');

    expect(fs.existsSync(robotsPath)).toBe(true);
    expect(fs.existsSync(headersPath)).toBe(true);
    expect(fs.existsSync(indexPath)).toBe(true);

    const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
    const headersContent = fs.readFileSync(headersPath, 'utf-8');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');
    const checklistHtml = fs.readFileSync(checklistPath, 'utf-8');

    // 1. robots.txt must allow crawling and reference sitemap
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
  });
});
