import { describe, it, expect, beforeEach } from 'vitest';
import {
  DEFAULT_MEASUREMENTS,
  STORAGE_KEY,
  getDefaultMeasurements,
  checkZoneStatuses,
  generateMeasurementSummary,
  isValidPositiveNumber,
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

describe('Storage Planner Readiness, Granular Validation & Summary (Shared Module)', () => {
  let localStorageMock: MockLocalStorage;

  beforeEach(() => {
    localStorageMock = new MockLocalStorage();
  });

  describe('Input number validation (isValidPositiveNumber)', () => {
    it('accepts valid finite positive numbers and decimals', () => {
      expect(isValidPositiveNumber('14')).toBe(true);
      expect(isValidPositiveNumber('28.5')).toBe(true);
      expect(isValidPositiveNumber(' 36 ')).toBe(true);
      expect(isValidPositiveNumber('0.5')).toBe(true);
    });

    it('rejects empty strings, zero, negative numbers, NaN, and Infinity', () => {
      expect(isValidPositiveNumber('')).toBe(false);
      expect(isValidPositiveNumber('   ')).toBe(false);
      expect(isValidPositiveNumber('0')).toBe(false);
      expect(isValidPositiveNumber('-5')).toBe(false);
      expect(isValidPositiveNumber('abc')).toBe(false);
      expect(isValidPositiveNumber('NaN')).toBe(false);
      expect(isValidPositiveNumber('Infinity')).toBe(false);
      expect(isValidPositiveNumber('-Infinity')).toBe(false);
    });
  });

  describe('Zone-specific granular readiness logic', () => {
    it('marks all zones as "wait / more measurements needed" by default', () => {
      const defaultData = getDefaultMeasurements();
      const statuses = checkZoneStatuses(defaultData);

      expect(statuses.overallReadyCount).toBe(0);
      expect(statuses.underbed.status).toBe('wait');
      expect(statuses.underbed.badgeLabel).toContain('More measurements needed');
      expect(statuses.closet.status).toBe('wait');
      expect(statuses.desk.status).toBe('wait');
      expect(statuses.wallAndDoor.status).toBe('wait');
      expect(statuses.sharedFloor.status).toBe('wait');
    });

    it('keeps Under-bed as wait if only height and lofting are filled, or if width/depth are missing', () => {
      const data = getDefaultMeasurements();
      data.underbed.clearanceInches = '28';
      data.underbed.loftingSetting = 'adjustable';

      let statuses = checkZoneStatuses(data);
      expect(statuses.underbed.status).toBe('wait');
      expect(statuses.underbed.subDetails?.softBags.ready).toBe(true);
      expect(statuses.underbed.subDetails?.rigidBins.ready).toBe(false);

      // Missing depth
      data.underbed.widthInches = '38';
      statuses = checkZoneStatuses(data);
      expect(statuses.underbed.status).toBe('wait');
      expect(statuses.underbed.subDetails?.rigidBins.ready).toBe(false);

      // Add depth -> now overall ready
      data.underbed.depthInches = '80';
      statuses = checkZoneStatuses(data);
      expect(statuses.underbed.status).toBe('ready');
      expect(statuses.underbed.badgeLabel).toContain('Core Dimensions Ready');
      expect(statuses.underbed.message).toContain('Core under-bed dimensions are recorded');
      expect(statuses.underbed.subDetails?.rigidBins.ready).toBe(true);
    });

    it('evaluates Closet readiness with granular height requirements for hanging & top shelves', () => {
      const data = getDefaultMeasurements();
      data.closet.widthInches = '36';
      data.closet.doorType = 'bi-fold';

      // Missing depth -> wait
      let statuses = checkZoneStatuses(data);
      expect(statuses.closet.status).toBe('wait');
      expect(statuses.closet.subDetails?.core.ready).toBe(false);

      // Add depth -> core ready
      data.closet.depthInches = '24';
      statuses = checkZoneStatuses(data);
      expect(statuses.closet.status).toBe('ready');
      expect(statuses.closet.subDetails?.core.ready).toBe(true);
      expect(statuses.closet.subDetails?.hangingShelves.ready).toBe(false);
      expect(statuses.closet.subDetails?.topShelfBins.ready).toBe(false);

      // Add hanging bar height and top shelf height
      data.closet.hangingBarHeightInches = '64';
      data.closet.topShelfClearanceInches = '12';
      statuses = checkZoneStatuses(data);
      expect(statuses.closet.subDetails?.hangingShelves.ready).toBe(true);
      expect(statuses.closet.subDetails?.topShelfBins.ready).toBe(true);
    });

    it('keeps Desk as wait if width, depth, or hutch clearance is missing', () => {
      const data = getDefaultMeasurements();
      data.desk.widthInches = '42';
      data.desk.hutchClearanceInches = '18';
      data.desk.outletDistanceFeet = '5'; // outlet distance alone does not make storage ready

      let statuses = checkZoneStatuses(data);
      expect(statuses.desk.status).toBe('wait');

      data.desk.depthInches = '24';
      statuses = checkZoneStatuses(data);
      expect(statuses.desk.status).toBe('ready');
    });

    it('evaluates Wall and Door zone independently and rejects prohibited door hooks from ready', () => {
      const data = getDefaultMeasurements();
      data.wallAndDoor.mountingPolicy = 'adhesive-allowed';
      data.wallAndDoor.overDoorHookPermitted = 'no'; // Prohibited by hall policy

      let statuses = checkZoneStatuses(data);
      expect(statuses.wallAndDoor.status).toBe('wait');
      expect(statuses.wallAndDoor.badgeLabel).toContain('Prohibited');
      expect(statuses.wallAndDoor.message).toContain('Over-the-door hooks are prohibited');

      // Change door hook to permitted
      data.wallAndDoor.overDoorHookPermitted = 'yes';
      statuses = checkZoneStatuses(data);
      expect(statuses.wallAndDoor.status).toBe('ready');
      expect(statuses.wallAndDoor.badgeLabel).toContain('Policies Verified');
    });

    it('keeps Shared Floor as wait if only notes are present, and requires both positive width and length', () => {
      const data = getDefaultMeasurements();
      data.sharedFloor.roommateAgreementNotes = 'Agreed to split 4x6 rug';

      let statuses = checkZoneStatuses(data);
      expect(statuses.sharedFloor.status).toBe('wait');

      data.sharedFloor.openFloorWidthFeet = '5';
      statuses = checkZoneStatuses(data);
      expect(statuses.sharedFloor.status).toBe('wait');

      data.sharedFloor.openFloorLengthFeet = '7';
      statuses = checkZoneStatuses(data);
      expect(statuses.sharedFloor.status).toBe('ready');
    });

    it('rejects 0, negative values, and non-numeric inputs from triggering ready status', () => {
      const data = getDefaultMeasurements();
      data.underbed.clearanceInches = '0';
      data.underbed.widthInches = '-38';
      data.underbed.depthInches = 'NaN';
      data.underbed.loftingSetting = 'adjustable';

      const statuses = checkZoneStatuses(data);
      expect(statuses.underbed.status).toBe('wait');
    });
  });

  describe('Summary generation, local storage & immutability', () => {
    it('generates formatted Markdown summary without unpurchased domain', () => {
      const custom = getDefaultMeasurements();
      custom.underbed.clearanceInches = '26';
      custom.underbed.widthInches = '38';
      custom.underbed.depthInches = '80';
      custom.underbed.loftingSetting = 'adjustable';
      custom.underbed.notes = 'Space for 3 plastic bins';

      const summary = generateMeasurementSummary(custom);

      expect(summary).toContain('# 📐 DormReady Storage Measurement Summary');
      expect(summary).toContain('## 1. Under-Bed Zone [✓ Core Dimensions Ready]');
      expect(summary).toContain('- Vertical Clearance: 26 in');
      expect(summary).toContain('- Bed Frame Width: 38 in');
      expect(summary).toContain('- Frame Depth: 80 in');
      expect(summary).toContain('- Lofting Setting: adjustable');
      expect(summary).toContain('- Notes: Space for 3 plastic bins');
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
});
