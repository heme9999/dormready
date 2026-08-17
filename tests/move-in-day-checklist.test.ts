import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_MOVEIN_STAGES,
  STORAGE_KEY,
  getDefaultStages,
  calculateProgress,
  generateSummaryText,
  type MoveInStage,
} from '../src/lib/moveInDayChecklist';

// Simulated localStorage mock
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

describe('Move-In Day Checklist State, LocalStorage & Summary Operations (Shared Module)', () => {
  let localStorageMock: MockLocalStorage;

  beforeEach(() => {
    localStorageMock = new MockLocalStorage();
  });

  it('calculates total milestones and completion percentages accurately across all 6 stages', () => {
    const defaultData = getDefaultStages();
    const { totalSteps, completedSteps, percent, stageProgress } = calculateProgress(defaultData);

    expect(totalSteps).toBe(26);
    expect(completedSteps).toBe(0);
    expect(percent).toBe(0);

    // Verify all 6 stages exist in stageProgress
    expect(Object.keys(stageProgress).length).toBe(6);
    expect(stageProgress['stage-pre-departure'].total).toBe(5);
    expect(stageProgress['stage-checkin'].total).toBe(3);
    expect(stageProgress['stage-before-unpacking'].total).toBe(4);
    expect(stageProgress['stage-unload-sequence'].total).toBe(6);
    expect(stageProgress['stage-before-family-leaves'].total).toBe(4);
    expect(stageProgress['stage-first-48-hours'].total).toBe(4);

    // Complete 6 steps in a clone
    const modified = getDefaultStages();
    modified[0].steps[0].completed = true;
    modified[0].steps[1].completed = true;
    modified[1].steps[0].completed = true;
    modified[2].steps[0].completed = true;
    modified[3].steps[0].completed = true;
    modified[3].steps[1].completed = true;

    const modifiedProgress = calculateProgress(modified);
    expect(modifiedProgress.totalSteps).toBe(26);
    expect(modifiedProgress.completedSteps).toBe(6);
    expect(modifiedProgress.percent).toBe(23);
    expect(modifiedProgress.stageProgress['stage-pre-departure'].completed).toBe(2);
  });

  it('persists and retrieves modified stages to and from localStorage', () => {
    const modified = getDefaultStages();
    modified[0].steps[1].completed = true;
    modified[0].steps[1].notes = 'Check-in is at Gregory Gym hub, not dorm desk';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(modified));

    const retrieved = localStorageMock.getItem(STORAGE_KEY);
    expect(retrieved).not.toBeNull();

    const parsed: MoveInStage[] = JSON.parse(retrieved!);
    expect(parsed[0].steps[1].completed).toBe(true);
    expect(parsed[0].steps[1].notes).toBe('Check-in is at Gregory Gym hub, not dorm desk');
  });

  it('generates formatted Markdown summary with custom notes without leaking unpurchased domain', () => {
    const modified = getDefaultStages();
    modified[0].steps[0].completed = true;
    modified[0].steps[0].notes = 'Time slot: 10:00 AM - 12:00 PM';
    modified[2].steps[0].completed = true;
    modified[2].steps[0].notes = 'Uploaded 12 photos to Google Drive';

    const summary = generateSummaryText(modified);

    expect(summary).toContain('# 🎓 DormReady Move-In Day Execution Summary');
    expect(summary).toContain('Progress: 2 of 26 milestones completed (8%)');
    expect(summary).toContain('## 1. Before Leaving Home');
    expect(summary).toContain('✅ [DONE] **Confirm Scheduled Move-In Slot & Housing Portal Check-In**');
    expect(summary).toContain('• Note: Time slot: 10:00 AM - 12:00 PM');
    expect(summary).toContain('⏳ [PENDING] **Confirm Exact Key Pickup Location**');
    expect(summary).toContain('Generated locally with DormReady');

    // Must NOT contain unpurchased domain or preview domain
    expect(summary).not.toContain('dormready.org');
    expect(summary).not.toContain('pages.dev');
  });

  it('resets modified checklist back to default state and preserves shared DEFAULT_MOVEIN_STAGES immutability', () => {
    const modified = getDefaultStages();
    modified[0].steps[0].completed = true;
    modified[0].steps[0].notes = 'Custom arrival note';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(modified));
    expect(localStorageMock.getItem(STORAGE_KEY)).not.toBeNull();

    // Perform Reset
    const freshState = getDefaultStages();
    localStorageMock.removeItem(STORAGE_KEY);

    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    expect(freshState[0].steps[0].completed).toBe(false);
    expect(freshState[0].steps[0].notes).toBe('');

    // Ensure constant DEFAULT_MOVEIN_STAGES was not mutated
    expect(DEFAULT_MOVEIN_STAGES[0].steps[0].completed).toBe(false);
    expect(DEFAULT_MOVEIN_STAGES[0].steps[0].notes).toBe('');
  });
});
