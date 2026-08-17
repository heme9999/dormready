import { describe, it, expect } from 'vitest';
import { STUDENT_DISCOUNTS, DISCOUNT_CATEGORIES } from '../src/data/discounts';

describe('Student Discounts Directory Data Integrity', () => {
  it('should have valid discount categories defined', () => {
    expect(DISCOUNT_CATEGORIES.length).toBeGreaterThanOrEqual(5);
  });

  it('rejects any example.com URL across all student discounts', () => {
    for (const d of STUDENT_DISCOUNTS) {
      expect(d.officialSourceUrl).not.toContain('example.com');
      expect(d.officialSourceUrl).toMatch(/^https:\/\//);
    }
  });

  it('every verified discount must have a valid audit date (checkedAt) and official URL', () => {
    for (const d of STUDENT_DISCOUNTS) {
      expect(d.id).toBeTruthy();
      expect(d.brand).toBeTruthy();
      expect(d.category).toBeTruthy();
      expect(d.offerSummary).toBeTruthy();
      expect(d.discountDescription).toBeTruthy();
      expect(d.priceOrDiscount).toBeTruthy();
      expect(d.eligibilitySummary).toBeTruthy();
      expect(d.verificationMethod).toBeTruthy();
      expect(d.checkedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.officialSourceUrl).toMatch(/^https:\/\//);
      expect(['verified', 'needs_research', 'seasonal']).toContain(d.verificationStatus);
    }
  });

  it('correctly names Spotify offer without any Showtime references', () => {
    const spotify = STUDENT_DISCOUNTS.find((d) => d.id === 'disc-spotify');
    expect(spotify).toBeDefined();
    expect(spotify?.brand).toBe('Spotify Premium Student with Hulu');
    expect(spotify?.offerSummary).not.toContain('Showtime');
    expect(spotify?.discountDescription).not.toContain('Showtime');
    expect(spotify?.notes).not.toContain('Showtime');
    expect(spotify?.eligibilitySummary).toContain('18+');
    expect(spotify?.eligibilitySummary).toContain('Title IV');
  });
});
