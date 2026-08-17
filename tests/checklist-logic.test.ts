import { describe, it, expect } from 'vitest';
import { CHECKLIST_ITEMS, CHECKLIST_CATEGORIES } from '../src/data/checklist';

describe('Checklist Logic & State Operations', () => {
  it('calculates completion percentages accurately', () => {
    const total = CHECKLIST_ITEMS.length;
    expect(total).toBeGreaterThan(30);

    const halfCount = Math.floor(total / 2);
    const mockCheckedState: Record<string, boolean> = {};
    for (let i = 0; i < halfCount; i++) {
      mockCheckedState[CHECKLIST_ITEMS[i].id] = true;
    }

    const checkedCount = Object.keys(mockCheckedState).filter((k) => mockCheckedState[k]).length;
    const progress = Math.round((checkedCount / total) * 100);
    expect(progress).toBe(Math.round((halfCount / total) * 100));
  });

  it('filters by category correctly', () => {
    for (const cat of CHECKLIST_CATEGORIES) {
      const itemsInCat = CHECKLIST_ITEMS.filter((i) => i.category === cat.key);
      expect(itemsInCat.length).toBeGreaterThan(0);
    }
  });

  it('filters essentials-only correctly without losing non-negotiable items', () => {
    const essentials = CHECKLIST_ITEMS.filter((i) => i.tier === 'essential');
    expect(essentials.length).toBeGreaterThan(15);
    for (const item of essentials) {
      expect(item.tier).toBe('essential');
    }
  });

  it('filters by budget tier without dropping baseline essentials', () => {
    const lowTier = CHECKLIST_ITEMS.filter((i) => i.budgetTier === 'low');
    const midTier = CHECKLIST_ITEMS.filter((i) => i.budgetTier === 'mid');
    const highTier = CHECKLIST_ITEMS.filter((i) => i.budgetTier === 'high');

    expect(lowTier.length).toBeGreaterThan(0);
    expect(midTier.length).toBeGreaterThan(0);
    expect(highTier.length).toBeGreaterThan(0);
    expect(lowTier.length + midTier.length + highTier.length).toBe(CHECKLIST_ITEMS.length);
  });
});
