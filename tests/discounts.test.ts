import { describe, it, expect } from 'vitest';
import { STUDENT_DISCOUNTS, DISCOUNT_CATEGORIES } from '../src/data/discounts';

describe('Student Discounts Directory Data Integrity', () => {
  it('should have valid discount categories defined', () => {
    expect(DISCOUNT_CATEGORIES.length).toBeGreaterThanOrEqual(5);
  });

  it('rejects any example.com or unverified aggregator URLs across all student discounts', () => {
    for (const d of STUDENT_DISCOUNTS) {
      expect(d.officialSourceUrl).not.toContain('example.com');
      expect(d.officialSourceUrl).not.toContain('coupons.com');
      expect(d.officialSourceUrl).not.toContain('retailmenot.com');
      expect(d.officialSourceUrl).toMatch(/^https:\/\//);
    }
  });

  it('every verified discount must have a valid audit date (checkedAt) and official HTTPS URL', () => {
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

  it('contains verified Apple Music Student discount as an independent record from Apple Education Store', () => {
    const appleMusic = STUDENT_DISCOUNTS.find((d) => d.id === 'disc-apple-music');
    const appleStore = STUDENT_DISCOUNTS.find((d) => d.id === 'disc-apple');

    expect(appleMusic).toBeDefined();
    expect(appleStore).toBeDefined();
    expect(appleMusic?.id).not.toBe(appleStore?.id);

    expect(appleMusic?.brand).toBe('Apple Music Student');
    expect(appleMusic?.category).toBe('streaming');
    expect(appleMusic?.priceOrDiscount).toBe('$6.99/month');
    expect(appleMusic?.officialSourceUrl).toBe('https://www.apple.com/apple-music/');
    expect(appleMusic?.verificationStatus).toBe('verified');
    expect(appleMusic?.checkedAt).toMatch(/^2026-/);

    expect(appleStore?.category).toBe('hardware');
  });

  it('contains verified YouTube Premium Student discount with official SheerID verification', () => {
    const yt = STUDENT_DISCOUNTS.find((d) => d.id === 'disc-youtube-premium');
    expect(yt).toBeDefined();
    expect(yt?.brand).toBe('YouTube Premium Student');
    expect(yt?.category).toBe('streaming');
    expect(yt?.verificationMethod).toBe('SheerID');
    expect(yt?.officialSourceUrl).toBe('https://www.youtube.com/premium/student');
    expect(yt?.verificationStatus).toBe('verified');
    expect(yt?.checkedAt).toMatch(/^2026-/);
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
