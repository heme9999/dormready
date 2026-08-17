import { describe, it, expect } from 'vitest';
import { EDITORIAL_GUIDES } from '../src/data/guides';

describe('Sprint 1 Content & Route Integrity', () => {
  it('should include the 3 new sprint 1 guide routes in EDITORIAL_GUIDES', () => {
    const slugs = EDITORIAL_GUIDES.map((g) => g.slug);
    expect(slugs).toContain('what-not-to-bring-to-college-dorm');
    expect(slugs).toContain('what-to-buy-before-vs-after-moving-into-dorm');
    expect(slugs).toContain('college-dorm-roommate-checklist');
  });

  it('all sprint 1 guides have valid titles, descriptions, and summary points', () => {
    const sprint1Slugs = [
      'what-not-to-bring-to-college-dorm',
      'what-to-buy-before-vs-after-moving-into-dorm',
      'college-dorm-roommate-checklist',
    ];

    for (const slug of sprint1Slugs) {
      const guide = EDITORIAL_GUIDES.find((g) => g.slug === slug);
      expect(guide).toBeDefined();
      expect(guide!.title.length).toBeGreaterThan(15);
      expect(guide!.description.length).toBeGreaterThan(50);
      expect(guide!.readingTimeMinutes).toBeGreaterThan(0);
      expect(guide!.summaryPoints.length).toBeGreaterThanOrEqual(3);
    }
  });
});
