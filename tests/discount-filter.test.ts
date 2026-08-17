import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { STUDENT_DISCOUNTS } from '../src/data/discounts';
import { filterStudentDiscounts } from '../src/lib/discountFilter';

describe('Discount Filter Logic & Pure Function Tests', () => {
  it('returns all items when no search or category filters are applied', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, {});
    expect(results.length).toBe(STUDENT_DISCOUNTS.length);
  });

  it('matches "apple music" with case-insensitivity and returns Apple Music Student', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, { query: 'apple music' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('disc-apple-music');
    expect(results[0].brand).toBe('Apple Music Student');
  });

  it('matches "youtube" and returns YouTube Premium Student', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, { query: 'youtube' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('disc-youtube-premium');
  });

  it('matches "youtube premium" with mixed casing (e.g. "YoUtUbE PrEmIuM")', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, { query: 'YoUtUbE PrEmIuM' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('disc-youtube-premium');
  });

  it('handles leading and trailing whitespace in queries without breaking matching', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, { query: '   apple music   ' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('disc-apple-music');
  });

  it('handles multiple consecutive spaces between query tokens', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, { query: 'youtube     premium' });
    expect(results.length).toBe(1);
    expect(results[0].id).toBe('disc-youtube-premium');
  });

  it('filters correctly when combining query and category', () => {
    // "apple music" in streaming -> 1 result (Apple Music Student)
    const streamingMatch = filterStudentDiscounts(STUDENT_DISCOUNTS, {
      query: 'apple music',
      category: 'streaming',
    });
    expect(streamingMatch.length).toBe(1);
    expect(streamingMatch[0].id).toBe('disc-apple-music');

    // "apple music" in hardware -> 0 results (since Apple Music is in streaming, not hardware)
    const hardwareMatch = filterStudentDiscounts(STUDENT_DISCOUNTS, {
      query: 'apple music',
      category: 'hardware',
    });
    expect(hardwareMatch.length).toBe(0);

    // "apple" in hardware -> 1 result (Apple Education Store)
    const appleHardware = filterStudentDiscounts(STUDENT_DISCOUNTS, {
      query: 'apple',
      category: 'hardware',
    });
    expect(appleHardware.length).toBe(1);
    expect(appleHardware[0].id).toBe('disc-apple');
  });

  it('returns empty array when query does not match any items', () => {
    const results = filterStudentDiscounts(STUDENT_DISCOUNTS, {
      query: 'nonexistent-service-xyz',
    });
    expect(results).toEqual([]);
  });

  it('verifies that DiscountDirectory component source contains zero-results state and accessibility attributes', () => {
    const componentPath = path.resolve(__dirname, '../src/components/DiscountDirectory.tsx');
    const content = fs.readFileSync(componentPath, 'utf-8');

    // Zero-results title and reset buttons
    expect(content).toContain('No verified discounts match these filters');
    expect(content).toContain('Clear Search');
    expect(content).toContain('Show All Categories');
    expect(content).toContain('Clear All Filters');

    // Results feedback counter
    expect(content).toContain('Showing');
    expect(content).toContain('verified offers');

    // Accessibility attributes
    expect(content).toContain('aria-live="polite"');
    expect(content).toContain('aria-atomic="true"');
  });
});
