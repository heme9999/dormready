import { describe, it, expect } from 'vitest';
import { CHECKLIST_CATEGORIES, CHECKLIST_ITEMS } from '../src/data/checklist';

describe('Checklist Data Integrity', () => {
  it('should have all 10 core categories defined', () => {
    expect(CHECKLIST_CATEGORIES.length).toBe(10);
    const keys = CHECKLIST_CATEGORIES.map((c) => c.key);
    expect(keys).toContain('bedding');
    expect(keys).toContain('bathroom');
    expect(keys).toContain('laundry');
    expect(keys).toContain('study');
    expect(keys).toContain('technology');
    expect(keys).toContain('kitchen');
    expect(keys).toContain('clothing');
    expect(keys).toContain('health');
    expect(keys).toContain('documents');
    expect(keys).toContain('optional');
  });

  it('should have unique IDs for every checklist item', () => {
    const ids = CHECKLIST_ITEMS.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should only reference valid categories', () => {
    const categoryKeys = new Set(CHECKLIST_CATEGORIES.map((c) => c.key));
    for (const item of CHECKLIST_ITEMS) {
      expect(categoryKeys.has(item.category)).toBe(true);
    }
  });

  it('should include fire safety / prohibited warnings on high-risk items', () => {
    const surge = CHECKLIST_ITEMS.find((i) => i.id === 'tech-1');
    expect(surge?.prohibitedWarning).toBeDefined();
    expect(surge?.prohibitedWarning).toContain('extension cord');

    const lamp = CHECKLIST_ITEMS.find((i) => i.id === 'stu-1');
    expect(lamp?.prohibitedWarning).toBeDefined();
    expect(lamp?.prohibitedWarning).toContain('Halogen');
  });

  it('should have essential tier items in every critical zone', () => {
    const essentialItems = CHECKLIST_ITEMS.filter((i) => i.tier === 'essential');
    expect(essentialItems.length).toBeGreaterThanOrEqual(15);
    const essentialCategories = new Set(essentialItems.map((i) => i.category));
    expect(essentialCategories.has('bedding')).toBe(true);
    expect(essentialCategories.has('bathroom')).toBe(true);
    expect(essentialCategories.has('technology')).toBe(true);
    expect(essentialCategories.has('documents')).toBe(true);
  });
});
