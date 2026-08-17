import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_MEASUREMENTS,
  STORAGE_KEY,
  getDefaultMeasurements,
  checkZoneStatuses,
  generateMeasurementSummary,
} from '../src/lib/storagePlanner';

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

describe('Storage Planner Readiness & Measurement Logic (Shared Module)', () => {
  let localStorageMock: MockLocalStorage;

  beforeEach(() => {
    localStorageMock = new MockLocalStorage();
  });

  it('marks all zones as "wait before buying" by default when measurements are unconfirmed', () => {
    const defaultData = getDefaultMeasurements();
    const statuses = checkZoneStatuses(defaultData);

    expect(statuses.overallReadyCount).toBe(0);
    expect(statuses.underbed.status).toBe('wait');
    expect(statuses.closet.status).toBe('wait');
    expect(statuses.desk.status).toBe('wait');
    expect(statuses.wallAndDoor.status).toBe('wait');
    expect(statuses.sharedFloor.status).toBe('wait');
  });

  it('transitions zones to "ready to shop" when dimensions and policies are verified', () => {
    const custom = getDefaultMeasurements();

    // 1. Confirm under-bed height and lofting
    custom.underbed.clearanceInches = '28';
    custom.underbed.loftingSetting = 'adjustable';

    // 2. Confirm closet width and door type
    custom.closet.widthInches = '36';
    custom.closet.doorType = 'bi-fold';

    const statuses = checkZoneStatuses(custom);
    expect(statuses.overallReadyCount).toBe(2);
    expect(statuses.underbed.status).toBe('ready');
    expect(statuses.underbed.badgeLabel).toContain('Ready to shop');
    expect(statuses.closet.status).toBe('ready');
    expect(statuses.closet.badgeLabel).toContain('Ready to shop');
    expect(statuses.desk.status).toBe('wait');
  });

  it('generates formatted Markdown measurement summary without unpurchased domain', () => {
    const custom = getDefaultMeasurements();
    custom.underbed.clearanceInches = '26';
    custom.underbed.loftingSetting = 'adjustable';
    custom.underbed.notes = 'Space for 3 plastic bins';

    custom.desk.widthInches = '42';
    custom.desk.hutchClearanceInches = '18';
    custom.desk.outletDistanceFeet = '4';

    const summary = generateMeasurementSummary(custom);

    expect(summary).toContain('# 📐 DormReady Storage Measurement Summary');
    expect(summary).toContain('## 1. Under-Bed Zone [✓ Ready to shop]');
    expect(summary).toContain('- Vertical Clearance: 26 in');
    expect(summary).toContain('- Lofting Setting: adjustable');
    expect(summary).toContain('- Notes: Space for 3 plastic bins');
    expect(summary).toContain('## 3. Desk & Study Zone [✓ Ready to shop]');
    expect(summary).toContain('- Surface Width: 42 in');
    expect(summary).toContain('Generated locally with DormReady');

    expect(summary).not.toContain('dormready.org');
    expect(summary).not.toContain('pages.dev');
  });

  it('persists and resets measurement logs while preserving DEFAULT_MEASUREMENTS immutability', () => {
    const custom = getDefaultMeasurements();
    custom.underbed.clearanceInches = '30';
    custom.wallAndDoor.wallMaterial = 'cinder-block';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(custom));
    expect(localStorageMock.getItem(STORAGE_KEY)).not.toBeNull();

    // Reset
    const freshState = getDefaultMeasurements();
    localStorageMock.removeItem(STORAGE_KEY);

    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    expect(freshState.underbed.clearanceInches).toBe('');
    expect(freshState.wallAndDoor.wallMaterial).toBe('unconfirmed');

    // Ensure constant DEFAULT_MEASUREMENTS was not mutated
    expect(DEFAULT_MEASUREMENTS.underbed.clearanceInches).toBe('');
    expect(DEFAULT_MEASUREMENTS.wallAndDoor.wallMaterial).toBe('unconfirmed');
  });
});
