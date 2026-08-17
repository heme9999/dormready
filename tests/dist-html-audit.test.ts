import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

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
  const distDir = path.resolve(process.cwd(), 'dist');
  const htmlFiles = getAllHtmlFiles(distDir);

  it('verifies that at least 15 HTML pages were generated in dist', () => {
    expect(htmlFiles.length).toBeGreaterThanOrEqual(15);
  });

  it('rejects any example.com link in all generated HTML files', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      expect(content).not.toContain('https://example.com');
      expect(content).not.toContain('http://example.com');
    }
  });

  it('verifies canonical tag, Open Graph image, and Twitter image in index.html', () => {
    const indexPath = path.join(distDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    expect(indexHtml).toContain('<link rel="canonical"');
    expect(indexHtml).toContain('property="og:image"');
    expect(indexHtml).toContain('property="og:image:width" content="1200"');
    expect(indexHtml).toContain('property="og:image:height" content="630"');
    expect(indexHtml).toContain('name="twitter:image"');
  });

  it('verifies no fake alert() or fake form submission handlers in homepage HTML', () => {
    const indexPath = path.join(distDir, 'index.html');
    const indexHtml = fs.readFileSync(indexPath, 'utf-8');

    expect(indexHtml).not.toContain("alert('Thank you for subscribing");
    expect(indexHtml).not.toContain('onsubmit="event.preventDefault()');
    expect(indexHtml).toContain('Move-in Bulletin Coming Soon');
  });

  it('verifies internal link integrity: all root-relative internal links resolve to files in dist', () => {
    for (const file of htmlFiles) {
      const content = fs.readFileSync(file, 'utf-8');
      // match href="/..."
      const matches = content.matchAll(/href="(\/[a-zA-Z0-9_\-\/]*)"/g);
      for (const m of matches) {
        const linkPath = m[1];
        if (linkPath === '/' || linkPath.startsWith('/_astro') || linkPath.startsWith('/images') || linkPath.startsWith('/favicon')) {
          continue;
        }

        // Expected targets: dist<linkPath>/index.html OR dist<linkPath>.html OR dist<linkPath>
        const cleanPath = linkPath.endsWith('/') ? linkPath.slice(0, -1) : linkPath;
        const targetDirIndex = path.join(distDir, cleanPath, 'index.html');
        const targetHtml = path.join(distDir, `${cleanPath}.html`);
        const targetExact = path.join(distDir, cleanPath);

        const exists = fs.existsSync(targetDirIndex) || fs.existsSync(targetHtml) || fs.existsSync(targetExact);
        expect(exists, `Broken internal link ${linkPath} found in ${file}`).toBe(true);
      }
    }
  });
});
