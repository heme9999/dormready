import { describe, it, expect, beforeEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  DEFAULT_MEASUREMENTS,
  STORAGE_KEY,
  getDefaultMeasurements,
  checkZoneStatuses,
  generateMeasurementSummary,
  validateMeasurement,
  isValidPositiveNumber,
  formatMeasurementForSummary,
  getMeasurementAccessibility,
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

describe('Storage Planner Readiness, Validation, Summary Formatting & A11y', () => {
  let localStorageMock: MockLocalStorage;

  beforeEach(() => {
    localStorageMock = new MockLocalStorage();
  });

  describe('Input number validation & sanity checks (validateMeasurement)', () => {
    it('accepts valid finite positive numbers within realistic unit bounds', () => {
      const clearanceVal = validateMeasurement('14', 'inches');
      expect(clearanceVal.status).toBe('valid');
      if (clearanceVal.status === 'valid') {
        expect(clearanceVal.value).toBe(14);
      }

      const floorVal = validateMeasurement('8.5', 'feet');
      expect(floorVal.status).toBe('valid');
      if (floorVal.status === 'valid') {
        expect(floorVal.value).toBe(8.5);
      }

      expect(isValidPositiveNumber('28.5', 'inches')).toBe(true);
      expect(isValidPositiveNumber(' 36 ', 'inches')).toBe(true);
    });

    it('rejects empty strings, zero, negative numbers, NaN, and Infinity as invalid', () => {
      expect(validateMeasurement('', 'inches').status).toBe('empty');
      expect(validateMeasurement('   ', 'inches').status).toBe('empty');
      expect(validateMeasurement('0', 'inches').status).toBe('invalid');
      expect(validateMeasurement('-5', 'inches').status).toBe('invalid');
      expect(validateMeasurement('abc', 'inches').status).toBe('invalid');
      expect(validateMeasurement('NaN', 'inches').status).toBe('invalid');
      expect(validateMeasurement('Infinity', 'inches').status).toBe('invalid');
      expect(validateMeasurement('-Infinity', 'inches').status).toBe('invalid');
    });

    it('flags unreasonably large measurements for review to prevent unit or typing mistakes', () => {
      const reviewInches = validateMeasurement('999999999', 'inches');
      expect(reviewInches.status).toBe('review');
      if (reviewInches.status === 'review') {
        expect(reviewInches.message).toContain('typing or unit mistake');
        expect(reviewInches.value).toBe(999999999);
      }

      const reviewFeet = validateMeasurement('150', 'feet');
      expect(reviewFeet.status).toBe('review');
      if (reviewFeet.status === 'review') {
        expect(reviewFeet.message).toContain('typing or unit mistake');
      }

      expect(isValidPositiveNumber('999999999', 'inches')).toBe(false);
      expect(isValidPositiveNumber('150', 'feet')).toBe(false);
    });
  });

  describe('Accessible Error & Warning Association (getMeasurementAccessibility)', () => {
    it('returns clean props without error associations for empty or valid inputs', () => {
      const emptyA11y = getMeasurementAccessibility('underbed-clearance', '', 'inches');
      expect(emptyA11y.hasProblem).toBe(false);
      expect(emptyA11y.inputProps['aria-invalid']).toBeUndefined();
      expect(emptyA11y.inputProps['aria-describedby']).toBeUndefined();

      const validA11y = getMeasurementAccessibility('underbed-clearance', '16', 'inches');
      expect(validA11y.hasProblem).toBe(false);
      expect(validA11y.inputProps['aria-invalid']).toBeUndefined();
      expect(validA11y.inputProps['aria-describedby']).toBeUndefined();
    });

    it('sets aria-invalid="true" and aria-describedby for invalid inputs', () => {
      const invalidA11y = getMeasurementAccessibility('underbed-clearance', '-5', 'inches');
      expect(invalidA11y.hasProblem).toBe(true);
      expect(invalidA11y.inputProps['aria-invalid']).toBe(true);
      expect(invalidA11y.inputProps['aria-describedby']).toBe('underbed-clearance-message');
      expect(invalidA11y.messageId).toBe('underbed-clearance-message');
    });

    it('sets aria-describedby without aria-invalid for inputs requiring review', () => {
      const reviewA11y = getMeasurementAccessibility('underbed-width', '999999999', 'inches');
      expect(reviewA11y.hasProblem).toBe(true);
      expect(reviewA11y.inputProps['aria-invalid']).toBeUndefined();
      expect(reviewA11y.inputProps['aria-describedby']).toBe('underbed-width-message');
    });
  });

  describe('Summary Formatting (formatMeasurementForSummary)', () => {
    it('distinguishes Unmeasured, Invalid, Needs review, and valid values', () => {
      expect(formatMeasurementForSummary('', 'inches')).toBe('Unmeasured');
      expect(formatMeasurementForSummary('   ', 'inches')).toBe('Unmeasured');
      expect(formatMeasurementForSummary('0', 'inches')).toBe('0 — Invalid');
      expect(formatMeasurementForSummary('-5', 'inches')).toBe('-5 — Invalid');
      expect(formatMeasurementForSummary('abc', 'inches')).toBe('abc — Invalid');
      expect(formatMeasurementForSummary('38', 'inches')).toBe('38 in');
      expect(formatMeasurementForSummary('6', 'feet')).toBe('6 ft');
      expect(formatMeasurementForSummary('999999999', 'inches')).toBe('999999999 in — Needs review');
      expect(formatMeasurementForSummary('999999999', 'feet')).toBe('999999999 ft — Needs review');
    });
  });

  describe('Wall and Door Policy Completion Rules', () => {
    it('requires BOTH wallMaterial and mountingPolicy for Wall readiness', () => {
      const data = getDefaultMeasurements();

      // 1. Both unconfirmed -> wait
      let statuses = checkZoneStatuses(data);
      expect(statuses.wall.status).toBe('wait');
      expect(statuses.wall.badgeLabel).toBe('⏳ More wall details needed');
      expect(statuses.wall.message).toContain('Confirm both the wall material');

      // 2. Only wallMaterial confirmed -> wait
      data.wallAndDoor.wallMaterial = 'cinder-block';
      statuses = checkZoneStatuses(data);
      expect(statuses.wall.status).toBe('wait');
      expect(statuses.wall.badgeLabel).toBe('⏳ More wall details needed');

      // 3. Only mountingPolicy confirmed -> wait
      data.wallAndDoor.wallMaterial = 'unconfirmed';
      data.wallAndDoor.mountingPolicy = 'pushpins-only';
      statuses = checkZoneStatuses(data);
      expect(statuses.wall.status).toBe('wait');
      expect(statuses.wall.badgeLabel).toBe('⏳ More wall details needed');

      // 4. Both confirmed -> complete / ready (+1 count)
      data.wallAndDoor.wallMaterial = 'cinder-block';
      statuses = checkZoneStatuses(data);
      expect(statuses.wall.status).toBe('ready');
      expect(statuses.wall.badgeLabel).toBe('✓ Wall policy check complete');
      expect(statuses.wall.message).toBe('Wall material and the school’s permitted mounting method are both recorded.');
      expect(statuses.overallReadyCount).toBe(1);
    });

    it('treats Door policy as complete when prohibited (no) or allowed (yes), but incomplete when unconfirmed', () => {
      const data = getDefaultMeasurements();

      // 1. Unconfirmed -> wait
      let statuses = checkZoneStatuses(data);
      expect(statuses.door.status).toBe('wait');
      expect(statuses.door.outcome).toBe('unconfirmed');
      expect(statuses.door.badgeLabel).toBe('⏳ Door policy needed');

      // 2. Door prohibited (no) -> complete (+1 count) with prohibited outcome
      data.wallAndDoor.overDoorHookPermitted = 'no';
      statuses = checkZoneStatuses(data);
      expect(statuses.door.status).toBe('ready');
      expect(statuses.door.outcome).toBe('prohibited');
      expect(statuses.door.badgeLabel).toBe('⚠️ Door hooks prohibited');
      expect(statuses.overallReadyCount).toBe(1);

      // 3. Door allowed (yes) -> complete (+1 count) with allowed outcome
      data.wallAndDoor.overDoorHookPermitted = 'yes';
      statuses = checkZoneStatuses(data);
      expect(statuses.door.status).toBe('ready');
      expect(statuses.door.outcome).toBe('allowed');
      expect(statuses.door.badgeLabel).toBe('✓ Door hooks allowed');
      expect(statuses.overallReadyCount).toBe(1);

      // 4. Wall complete + Door prohibited -> overallReadyCount = 2
      data.wallAndDoor.wallMaterial = 'drywall';
      data.wallAndDoor.mountingPolicy = 'adhesive-allowed';
      data.wallAndDoor.overDoorHookPermitted = 'no';
      statuses = checkZoneStatuses(data);
      expect(statuses.wall.status).toBe('ready');
      expect(statuses.door.status).toBe('ready');
      expect(statuses.door.outcome).toBe('prohibited');
      expect(statuses.overallReadyCount).toBe(2);
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
      expect(statuses.wall.status).toBe('wait');
      expect(statuses.door.status).toBe('wait');
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
      data.desk.outletDistanceFeet = '5';

      let statuses = checkZoneStatuses(data);
      expect(statuses.desk.status).toBe('wait');

      data.desk.depthInches = '24';
      statuses = checkZoneStatuses(data);
      expect(statuses.desk.status).toBe('ready');
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

    it('rejects 0, negative values, and abnormal numbers from triggering ready status', () => {
      const data = getDefaultMeasurements();
      data.underbed.clearanceInches = '0';
      data.underbed.widthInches = '-38';
      data.underbed.depthInches = '999999999';
      data.underbed.loftingSetting = 'adjustable';

      const statuses = checkZoneStatuses(data);
      expect(statuses.underbed.status).toBe('wait');
    });
  });

  describe('Summary generation, local storage & immutability', () => {
    it('generates formatted Markdown summary with formatted states without unpurchased domain', () => {
      const custom = getDefaultMeasurements();
      custom.underbed.clearanceInches = '26';
      custom.underbed.widthInches = '38';
      custom.underbed.depthInches = '80';
      custom.underbed.loftingSetting = 'adjustable';
      custom.underbed.notes = 'Space for 3 plastic bins';

      custom.wallAndDoor.wallMaterial = 'cinder-block';
      custom.wallAndDoor.mountingPolicy = 'adhesive-allowed';
      custom.wallAndDoor.overDoorHookPermitted = 'no';

      custom.sharedFloor.openFloorWidthFeet = '6';
      custom.sharedFloor.openFloorLengthFeet = '999999999';

      const summary = generateMeasurementSummary(custom);

      expect(summary).toContain('# 📐 DormReady Storage Measurement Summary');
      expect(summary).toContain('Planning Areas Completed: 3 of 6 areas recorded or policy-checked');
      expect(summary).toContain('## 1. Under-Bed Zone [✓ Core Dimensions Ready]');
      expect(summary).toContain('## 4. Wall Mounting Policy [✓ Wall policy check complete]');
      expect(summary).toContain('- Wall Material: cinder-block');
      expect(summary).toContain('- School Mounting Rule: adhesive-allowed');
      expect(summary).toContain('## 5. Over-Door Hanging Policy [⚠️ Door hooks prohibited]');
      expect(summary).toContain('- Over-the-Door Hooks Allowed: no');
      expect(summary).toContain('- Open Floor Width: 6 ft');
      expect(summary).toContain('- Open Floor Length: 999999999 ft — Needs review');
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

      const freshState = getDefaultMeasurements();
      localStorageMock.removeItem(STORAGE_KEY);

      expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
      expect(freshState.underbed.clearanceInches).toBe('');
      expect(freshState.wallAndDoor.wallMaterial).toBe('unconfirmed');

      expect(DEFAULT_MEASUREMENTS.underbed.clearanceInches).toBe('');
      expect(DEFAULT_MEASUREMENTS.wallAndDoor.wallMaterial).toBe('unconfirmed');
    });
  });

  describe('A11y and Codebase Cleanliness Verification', () => {
    it('verifies StorageMeasurementPlanner component file uses getMeasurementAccessibility and has no "ready for shopping"', () => {
      const componentPath = path.resolve(__dirname, '../src/components/StorageMeasurementPlanner.tsx');
      const content = fs.readFileSync(componentPath, 'utf-8');

      expect(content).toContain('getMeasurementAccessibility');
      expect(content).toContain('underbed-clearance');
      expect(content).toContain('underbed-width');
      expect(content).toContain('underbed-depth');
      expect(content).toContain('closet-width');
      expect(content).toContain('closet-depth');
      expect(content).toContain('closet-bar-height');
      expect(content).toContain('closet-shelf-clearance');
      expect(content).toContain('desk-width');
      expect(content).toContain('desk-depth');
      expect(content).toContain('desk-hutch-clearance');
      expect(content).toContain('desk-outlet-distance');
      expect(content).toContain('floor-width');
      expect(content).toContain('floor-length');

      expect(content).not.toContain('ready for shopping');
    });
  });
});
