import { describe, it, expect } from 'vitest';
import { SITE_CONFIG } from '../src/data/site';
import { EDITORIAL_GUIDES } from '../src/data/guides';

describe('Site & Navigation Architecture', () => {
  it('should contain all required primary navigation routes', () => {
    const hrefs = SITE_CONFIG.nav.map((n) => n.href);
    expect(hrefs).toContain('/college-dorm-checklist/');
    expect(hrefs).toContain('/college-packing-list/');
    expect(hrefs).toContain('/dorm-room-essentials/');
    expect(hrefs).toContain('/best-laptops-for-college-students/');
    expect(hrefs).toContain('/budget/');
    expect(hrefs).toContain('/student-discounts/');
    expect(hrefs).toContain('/guides/');
  });

  it('all editorial guides should have unique slugs and valid metadata', () => {
    const slugs = EDITORIAL_GUIDES.map((g) => g.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    for (const g of EDITORIAL_GUIDES) {
      expect(g.title).toBeTruthy();
      expect(g.description).toBeTruthy();
      expect(g.readingTimeMinutes).toBeGreaterThan(0);
      expect(g.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('supports optional googleSiteVerification configuration', () => {
    expect(SITE_CONFIG).toHaveProperty('googleSiteVerification');
  });
});
