import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_SECTIONS,
  STORAGE_KEY,
  getDefaultSections,
  calculateProgress,
  generateSummaryText,
  type ChecklistSection,
} from '../src/lib/roommateChecklist';

// Simulated localStorage mock for headless node test environment
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('Roommate Checklist State, LocalStorage & Summary Operations (Shared Module)', () => {
  let localStorageMock: MockLocalStorage;

  beforeEach(() => {
    localStorageMock = new MockLocalStorage();
  });

  it('calculates total topics and completion counts accurately from production data', () => {
    const defaultData = getDefaultSections();
    const { total, agreed, percent } = calculateProgress(defaultData);

    expect(total).toBe(22);
    expect(agreed).toBe(0);
    expect(percent).toBe(0);

    // Modify 7 items in a clone
    const modified = getDefaultSections();
    modified[0].fields[0].checked = true;
    modified[0].fields[1].checked = true;
    modified[1].fields[0].checked = true;
    modified[2].fields[0].checked = true;
    modified[3].fields[0].checked = true;
    modified[4].fields[0].checked = true;
    modified[5].fields[0].checked = true;

    const modifiedProgress = calculateProgress(modified);
    expect(modifiedProgress.total).toBe(22);
    expect(modifiedProgress.agreed).toBe(7);
    expect(modifiedProgress.percent).toBe(32);
  });

  it('persists and retrieves modified sections to and from localStorage', () => {
    const modified = getDefaultSections();
    modified[1].fields[0].checked = true;
    modified[1].fields[0].notes = 'Alex will bring the mini fridge; Jordan brings microwave';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(modified));

    const retrieved = localStorageMock.getItem(STORAGE_KEY);
    expect(retrieved).not.toBeNull();

    const parsed: ChecklistSection[] = JSON.parse(retrieved!);
    expect(parsed[1].fields[0].checked).toBe(true);
    expect(parsed[1].fields[0].notes).toBe('Alex will bring the mini fridge; Jordan brings microwave');
  });

  it('generates formatted Markdown copy summary with custom notes and status badges without unpurchased domain', () => {
    const modified = getDefaultSections();
    modified[1].fields[0].checked = true;
    modified[1].fields[0].notes = 'Alex brings fridge, Jordan brings microwave';

    const summary = generateSummaryText(modified);

    expect(summary).toContain('# 🎓 DormReady Roommate Coordination Summary');
    expect(summary).toContain('Progress: 1 of 22 items coordinated (5%)');
    expect(summary).toContain('## 2. Shared Purchases & Appliances');
    expect(summary).toContain('✅ [AGREED] **Mini-Fridge & Microwave**');
    expect(summary).toContain('• Note: Alex brings fridge, Jordan brings microwave');
    expect(summary).toContain('⏳ [PENDING] **Floor Area Rug**');
    expect(summary).toContain('• Baseline: Buy after move-in once room layout is established.');
    expect(summary).toContain('Generated locally with DormReady');

    // Must NOT contain unpurchased domain or preview domain in copy text
    expect(summary).not.toContain('dormready.org');
    expect(summary).not.toContain('pages.dev');
  });

  it('resets modified checklist back to default state and preserves shared DEFAULT_SECTIONS immutability', () => {
    const modified = getDefaultSections();
    modified[0].fields[0].checked = true;
    modified[0].fields[0].notes = 'Custom note here';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(modified));
    expect(localStorageMock.getItem(STORAGE_KEY)).not.toBeNull();

    // Perform Reset
    const freshState = getDefaultSections();
    localStorageMock.removeItem(STORAGE_KEY);

    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    expect(freshState[0].fields[0].checked).toBe(false);
    expect(freshState[0].fields[0].notes).toBe('');

    // Ensure the underlying constant DEFAULT_SECTIONS was not mutated by earlier operations
    expect(DEFAULT_SECTIONS[0].fields[0].checked).toBe(false);
    expect(DEFAULT_SECTIONS[0].fields[0].notes).toBe('');
  });
});
