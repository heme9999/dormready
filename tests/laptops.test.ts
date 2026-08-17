import { describe, it, expect } from 'vitest';
import { LAPTOP_PROFILES, MAJOR_OPTIONS } from '../src/data/laptops';

describe('Laptop Comparison Data', () => {
  it('should have major options defined with descriptions', () => {
    expect(MAJOR_OPTIONS.length).toBeGreaterThanOrEqual(4);
    for (const m of MAJOR_OPTIONS) {
      expect(m.key).toBeTruthy();
      expect(m.label).toBeTruthy();
      expect(m.description).toBeTruthy();
    }
  });

  it('all laptop profiles should be marked as placeholders needing research', () => {
    for (const profile of LAPTOP_PROFILES) {
      expect(profile.isPlaceholder).toBe(true);
      expect(profile.editorialStatus).toContain('PLACEHOLDER');
      expect(profile.recommendedSpecs.cpu).toBeTruthy();
      expect(profile.recommendedSpecs.ram).toBeTruthy();
      expect(profile.recommendedSpecs.storage).toBeTruthy();
      expect(profile.researchChecklist.length).toBeGreaterThan(0);
    }
  });
});
