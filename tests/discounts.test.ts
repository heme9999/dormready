import { describe, it, expect } from 'vitest';
import { STUDENT_DISCOUNTS, DISCOUNT_CATEGORIES } from '../src/data/discounts';

describe('Student Discounts Directory', () => {
  it('should have valid discount categories', () => {
    expect(DISCOUNT_CATEGORIES.length).toBeGreaterThanOrEqual(5);
  });

  it('every discount should have required verification and source fields', () => {
    for (const d of STUDENT_DISCOUNTS) {
      expect(d.id).toBeTruthy();
      expect(d.brand).toBeTruthy();
      expect(d.category).toBeTruthy();
      expect(d.eligibility).toBeTruthy();
      expect(d.verificationMethod).toBeTruthy();
      expect(d.lastCheckedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.officialSourceUrl).toMatch(/^https?:\/\//);
      expect(['verified', 'needs_research', 'seasonal']).toContain(d.verificationStatus);
    }
  });

  it('explicitly flags placeholder entries as needs_research', () => {
    const placeholders = STUDENT_DISCOUNTS.filter((d) => d.verificationStatus === 'needs_research');
    expect(placeholders.length).toBeGreaterThan(0);
    for (const p of placeholders) {
      expect(p.notes).toContain('EDITORIAL NOTICE');
    }
  });
});
