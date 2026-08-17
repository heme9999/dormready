import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const node22Path = '/Users/hemrmicloud.com/.nvm/versions/node/v22.23.1/bin';
const envPath = fs.existsSync(node22Path) ? `${node22Path}:${process.env.PATH || ''}` : process.env.PATH;

const auditDistDir = path.resolve(process.cwd(), 'dist-test-audit');

function getAllHtmlFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

describe('Generated Distribution HTML Auditing', () => {
  let htmlFiles: string[] = [];

  beforeAll(() => {
    // Build isolated fixture for testing so clean checkout works independently
    execSync(`npx astro build --outDir dist-test-audit`, {
      stdio: 'pipe',
      env: {
        ...process.env,
        PATH: envPath,
        PUBLIC_SITE_ENV: 'preview',
        PUBLIC_SITE_URL: 'https://dormready-preview.pages.dev',
      },
    });
    htmlFiles = getAllHtmlFiles(auditDistDir);
  });

  afterAll(() => {
    if (fs.existsSync(auditDistDir)) {
      fs.rmSync(auditDistDir, { recursive: true, force: true });
    }
  });

  it('verifies that at least 21 HTML pages were generated in audit build', () => {
    expect(htmlFiles.length).toBeGreaterThanOrEqual(21);
  });

  it('verifies all Sprint 1 & Sprint 2 pages are present in distribution with PolicyNotice', () => {
    const p1 = path.join(auditDistDir, 'what-not-to-bring-to-college-dorm/index.html');
    const p2 = path.join(auditDistDir, 'what-to-buy-before-vs-after-moving-into-dorm/index.html');
    const p3 = path.join(auditDistDir, 'college-dorm-roommate-checklist/index.html');
    const p4 = path.join(auditDistDir, 'college-move-in-day-checklist/index.html');
    const p5 = path.join(auditDistDir, 'community-bathroom-college-essentials/index.html');
    const p6 = path.join(auditDistDir, 'small-dorm-room-storage-ideas/index.html');

    expect(fs.existsSync(p1), 'what-not-to-bring page missing').toBe(true);
    expect(fs.existsSync(p2), 'what-to-buy-before-vs-after page missing').toBe(true);
    expect(fs.existsSync(p3), 'roommate checklist page missing').toBe(true);
    expect(fs.existsSync(p4), 'move-in day checklist page missing').toBe(true);
    expect(fs.existsSync(p5), 'community bathroom page missing').toBe(true);
    expect(fs.existsSync(p6), 'small dorm storage page missing').toBe(true);

    const c1 = fs.readFileSync(p1, 'utf-8');
    const c2 = fs.readFileSync(p2, 'utf-8');
    const c3 = fs.readFileSync(p3, 'utf-8');
    const c4 = fs.readFileSync(p4, 'utf-8');
    const c5 = fs.readFileSync(p5, 'utf-8');
    const c6 = fs.readFileSync(p6, 'utf-8');

    expect(c1).toContain('Campus Policy Rule');
    expect(c1).toContain('Overrides Generic Checklists');

    expect(c2).toContain('Campus Policy Rule');
    expect(c2).toContain('Timing Decision Matrix');

    expect(c3).toContain('Campus Policy Rule');
    expect(c3).toContain('Roommate Agreement Progress');

    expect(c4).toContain('Campus Policy Rule');
    expect(c4).toContain('Arrival Execution Milestones');

    expect(c5).toContain('Campus Policy Rule');
    expect(c5).toContain('Communal Bathroom Dry/Wet Transit Blueprint');

    expect(c6).toContain('Campus Policy Rule');
    expect(c6).toContain('Dorm Storage Measurement Log');
  });

  it('rejects any example.com link in all generated HTML files', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('https://example.com');
      expect(content).not.toContain('http://example.com');
    }
  });

  it('verifies canonical tag, Open Graph image, and Twitter image in index.html', () => {
    const indexPath = path.join(auditDistDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    expect(indexHtml).toContain('<link rel="canonical"');
    expect(indexHtml).toContain('property="og:image"');
    expect(indexHtml).toContain('property="og:image:width" content="1200"');
    expect(indexHtml).toContain('property="og:image:height" content="630"');
    expect(indexHtml).toContain('name="twitter:image"');
    expect(indexHtml).toContain('<meta name="google-site-verification"');
  });

  it('verifies no fake alert() or fake form submission handlers in homepage HTML', () => {
    const indexPath = path.join(auditDistDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    expect(indexHtml).not.toContain("alert('Thank you for subscribing");
    expect(indexHtml).not.toContain('onsubmit="event.preventDefault()');
    expect(indexHtml).toContain('Move-in Bulletin Coming Soon');
  });

  it('verifies internal link integrity: all root-relative internal links resolve to files in audit dist', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      const matches = content.matchAll(/href="(\/[a-zA-Z0-9_\-\/]*)"/g);
      for (const m of matches) {
        const linkPath = m[1];
        if (linkPath === '/' || linkPath.startsWith('/_astro') || linkPath.startsWith('/images') || linkPath.startsWith('/favicon')) {
          continue;
        }

        const cleanPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;
        const targetDirIndex = path.join(auditDistDir, cleanPath, 'index.html');
        const targetHtml = path.join(auditDistDir, `${cleanPath}.html`);
        const targetExact = path.join(auditDistDir, cleanPath);

        const exists = fs.existsSync(targetDirIndex) || fs.existsSync(targetHtml) || fs.existsSync(targetExact);
        expect(exists, `Broken internal link ${linkPath} found in ${file}`).toBe(true);
      }
    }
  });
});
