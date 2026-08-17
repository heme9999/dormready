export interface DormMeasurements {
  underbed: {
    widthInches: string;
    depthInches: string;
    clearanceInches: string;
    loftingSetting: 'fixed-low' | 'adjustable' | 'lofted' | 'unconfirmed';
    notes: string;
  };
  closet: {
    widthInches: string;
    depthInches: string;
    hangingBarHeightInches: string;
    topShelfClearanceInches: string;
    doorType: 'bi-fold' | 'curtain' | 'open' | 'hinged' | 'unconfirmed';
    notes: string;
  };
  desk: {
    widthInches: string;
    depthInches: string;
    hutchClearanceInches: string;
    outletDistanceFeet: string;
    notes: string;
  };
  wallAndDoor: {
    wallMaterial: 'drywall' | 'cinder-block' | 'brick' | 'plaster' | 'unconfirmed';
    mountingPolicy: 'pushpins-only' | 'adhesive-allowed' | 'no-adhesives' | 't-pins-only' | 'unconfirmed';
    overDoorHookPermitted: 'yes' | 'no' | 'unconfirmed';
    notes: string;
  };
  sharedFloor: {
    openFloorWidthFeet: string;
    openFloorLengthFeet: string;
    roommateAgreementNotes: string;
  };
}

export const STORAGE_KEY = 'dormready_storage_measurements_v1';

export const DEFAULT_MEASUREMENTS: DormMeasurements = {
  underbed: {
    widthInches: '',
    depthInches: '',
    clearanceInches: '',
    loftingSetting: 'unconfirmed',
    notes: '',
  },
  closet: {
    widthInches: '',
    depthInches: '',
    hangingBarHeightInches: '',
    topShelfClearanceInches: '',
    doorType: 'unconfirmed',
    notes: '',
  },
  desk: {
    widthInches: '',
    depthInches: '',
    hutchClearanceInches: '',
    outletDistanceFeet: '',
    notes: '',
  },
  wallAndDoor: {
    wallMaterial: 'unconfirmed',
    mountingPolicy: 'unconfirmed',
    overDoorHookPermitted: 'unconfirmed',
    notes: '',
  },
  sharedFloor: {
    openFloorWidthFeet: '',
    openFloorLengthFeet: '',
    roommateAgreementNotes: '',
  },
};

export function getDefaultMeasurements(): DormMeasurements {
  return JSON.parse(JSON.stringify(DEFAULT_MEASUREMENTS));
}

export type MeasurementUnit = 'inches' | 'feet';

export type MeasurementValidation =
  | { status: 'empty' }
  | { status: 'invalid'; message: string }
  | { status: 'review'; message: string; value: number }
  | { status: 'valid'; value: number };

/**
 * Validates a measurement string for sanity and correct input boundaries.
 * Does NOT assert universal dorm standards; thresholds detect typing/unit mistakes.
 */
export function validateMeasurement(val: string, unit: MeasurementUnit = 'inches'): MeasurementValidation {
  if (!val || typeof val !== 'string') return { status: 'empty' };
  const trimmed = val.trim();
  if (trimmed === '') return { status: 'empty' };
  const num = Number(trimmed);

  if (Number.isNaN(num) || !Number.isFinite(num) || num <= 0) {
    return { status: 'invalid', message: 'Enter a valid positive number greater than 0.' };
  }

  // Unit sanity limits (flags accidental inputs like 999999 or entering inches in feet fields)
  const maxThreshold = unit === 'inches' ? 120 : 40;
  if (num > maxThreshold) {
    return {
      status: 'review',
      value: num,
      message: `Double-check this measurement (${num} ${unit}). Values over ${maxThreshold} ${unit} may indicate a typing or unit mistake.`,
    };
  }

  return { status: 'valid', value: num };
}

export function isValidPositiveNumber(val: string, unit: MeasurementUnit = 'inches'): boolean {
  const result = validateMeasurement(val, unit);
  return result.status === 'valid';
}

/**
 * Formats a measurement value for Markdown / text export.
 * Distinguishes Unmeasured, Invalid, and Needs review states.
 */
export function formatMeasurementForSummary(value: string, unit: MeasurementUnit): string {
  const result = validateMeasurement(value, unit);
  switch (result.status) {
    case 'empty':
      return 'Unmeasured';
    case 'invalid':
      return value.trim() ? `${value.trim()} — Invalid` : 'Invalid';
    case 'review':
      return `${result.value} ${unit === 'inches' ? 'in' : 'ft'} — Needs review`;
    case 'valid':
      return `${result.value} ${unit === 'inches' ? 'in' : 'ft'}`;
  }
}

/**
 * Returns accessibility props and validation message metadata for a numeric measurement input.
 */
export function getMeasurementAccessibility(
  inputId: string,
  value: string,
  unit: MeasurementUnit = 'inches'
) {
  const validation = validateMeasurement(value, unit);
  const isInvalid = validation.status === 'invalid';
  const isReview = validation.status === 'review';
  const hasProblem = isInvalid || isReview;
  const message = hasProblem ? validation.message : undefined;

  return {
    validation,
    isInvalid,
    isReview,
    hasProblem,
    message,
    messageId: `${inputId}-message`,
    inputProps: {
      id: inputId,
      'aria-invalid': isInvalid ? (true as const) : undefined,
      'aria-describedby': hasProblem ? `${inputId}-message` : undefined,
    },
  };
}

export interface ZoneStatus {
  status: 'ready' | 'wait';
  badgeLabel: string;
  message: string;
  outcome?: 'allowed' | 'prohibited' | 'unconfirmed';
  subDetails?: {
    [key: string]: {
      ready: boolean;
      label: string;
      requirement: string;
    };
  };
}

export function checkZoneStatuses(data: DormMeasurements): {
  underbed: ZoneStatus;
  closet: ZoneStatus;
  desk: ZoneStatus;
  wall: ZoneStatus;
  door: ZoneStatus;
  wallAndDoor: ZoneStatus; // Combined backward-compatible alias
  sharedFloor: ZoneStatus;
  overallReadyCount: number;
} {
  let overallReadyCount = 0;

  // 1. Under-bed Zone
  const underbedClearanceValid = isValidPositiveNumber(data.underbed.clearanceInches, 'inches');
  const underbedWidthValid = isValidPositiveNumber(data.underbed.widthInches, 'inches');
  const underbedDepthValid = isValidPositiveNumber(data.underbed.depthInches, 'inches');
  const underbedLoftingConfirmed = data.underbed.loftingSetting !== 'unconfirmed';

  const softBagsReady = underbedClearanceValid;
  const rigidBinsReady = underbedWidthValid && underbedDepthValid && underbedClearanceValid;
  const underbedReady = rigidBinsReady && underbedLoftingConfirmed;
  if (underbedReady) overallReadyCount++;

  // 2. Closet Zone
  const closetWidthValid = isValidPositiveNumber(data.closet.widthInches, 'inches');
  const closetDepthValid = isValidPositiveNumber(data.closet.depthInches, 'inches');
  const closetDoorConfirmed = data.closet.doorType !== 'unconfirmed';
  const closetHangingBarValid = isValidPositiveNumber(data.closet.hangingBarHeightInches, 'inches');
  const closetTopShelfValid = isValidPositiveNumber(data.closet.topShelfClearanceInches, 'inches');

  const closetCoreReady = closetWidthValid && closetDepthValid && closetDoorConfirmed;
  const hangingShelvesReady = closetCoreReady && closetHangingBarValid;
  const topShelfBinsReady = closetCoreReady && closetTopShelfValid;
  const closetReady = closetCoreReady;
  if (closetReady) overallReadyCount++;

  // 3. Desk Zone
  const deskWidthValid = isValidPositiveNumber(data.desk.widthInches, 'inches');
  const deskDepthValid = isValidPositiveNumber(data.desk.depthInches, 'inches');
  const deskHutchValid = isValidPositiveNumber(data.desk.hutchClearanceInches, 'inches');

  const deskReady = deskWidthValid && deskDepthValid && deskHutchValid;
  if (deskReady) overallReadyCount++;

  // 4. Wall Zone (Requires BOTH wall material and mounting policy)
  const wallMaterialConfirmed = data.wallAndDoor.wallMaterial !== 'unconfirmed';
  const wallMountingPolicyConfirmed = data.wallAndDoor.mountingPolicy !== 'unconfirmed';
  const wallPolicyComplete = wallMaterialConfirmed && wallMountingPolicyConfirmed;
  if (wallPolicyComplete) overallReadyCount++;

  // 5. Door Zone (Policy is complete if yes or no; unconfirmed is wait)
  const doorPolicyComplete = data.wallAndDoor.overDoorHookPermitted !== 'unconfirmed';
  const doorHooksAllowed = data.wallAndDoor.overDoorHookPermitted === 'yes';
  const doorHooksProhibited = data.wallAndDoor.overDoorHookPermitted === 'no';
  if (doorPolicyComplete) overallReadyCount++;

  // Combined Wall & Door for backward compatibility
  const wallAndDoorComplete = wallPolicyComplete && doorPolicyComplete;

  // 6. Shared Floor Zone
  const floorWidthValid = isValidPositiveNumber(data.sharedFloor.openFloorWidthFeet, 'feet');
  const floorLengthValid = isValidPositiveNumber(data.sharedFloor.openFloorLengthFeet, 'feet');

  const sharedFloorReady = floorWidthValid && floorLengthValid;
  if (sharedFloorReady) overallReadyCount++;

  return {
    underbed: {
      status: underbedReady ? 'ready' : 'wait',
      badgeLabel: underbedReady ? '✓ Core Dimensions Ready' : '⏳ More measurements needed',
      message: underbedReady
        ? 'Core under-bed dimensions are recorded. Compare all product dimensions with your measurements and housing policy before purchasing.'
        : 'Record frame width, depth, clearance height, and lofting setting before purchasing rigid drawers or totes.',
      subDetails: {
        softBags: {
          ready: softBagsReady,
          label: 'Low-Profile Soft Bags',
          requirement: 'Requires clearance height',
        },
        rigidBins: {
          ready: rigidBinsReady,
          label: 'Rigid Bins & Drawers',
          requirement: 'Requires width, depth, and clearance height',
        },
        risers: {
          ready: false,
          label: 'Bed Risers / Lofting Kits',
          requirement: 'Must not be assumed; verify hall furniture policy first',
        },
      },
    },
    closet: {
      status: closetReady ? 'ready' : 'wait',
      badgeLabel: closetReady ? '✓ Core Dimensions Ready' : '⏳ More measurements needed',
      message: closetReady
        ? 'Core closet dimensions are recorded. Compare hanger and shelf organizers against your measurements and door clearance.'
        : 'Record closet width, depth, and door style before purchasing hanging organizers or shoe racks.',
      subDetails: {
        core: {
          ready: closetCoreReady,
          label: 'Basic Closet Footprint',
          requirement: 'Requires width, depth, and confirmed door type',
        },
        hangingShelves: {
          ready: hangingShelvesReady,
          label: 'Hanging Tiered Shelves',
          requirement: 'Requires hanging bar height and confirmed door type',
        },
        topShelfBins: {
          ready: topShelfBinsReady,
          label: 'Top Shelf Storage Bins',
          requirement: 'Requires top shelf vertical clearance',
        },
      },
    },
    desk: {
      status: deskReady ? 'ready' : 'wait',
      badgeLabel: deskReady ? '✓ Core Dimensions Ready' : '⏳ More measurements needed',
      message: deskReady
        ? 'Core desk dimensions are recorded. Compare desktop shelves and monitor risers against your recorded surface depth and vertical clearance.'
        : 'Measure desk width, surface depth, and vertical hutch clearance before purchasing desktop organizers or risers.',
    },
    wall: {
      status: wallPolicyComplete ? 'ready' : 'wait',
      badgeLabel: wallPolicyComplete ? '✓ Wall policy check complete' : '⏳ More wall details needed',
      message: wallPolicyComplete
        ? 'Wall material and the school’s permitted mounting method are both recorded.'
        : 'Confirm both the wall material and your housing policy’s permitted mounting method.',
    },
    door: {
      status: doorPolicyComplete ? 'ready' : 'wait',
      outcome: doorHooksAllowed ? 'allowed' : doorHooksProhibited ? 'prohibited' : 'unconfirmed',
      badgeLabel: doorHooksProhibited
        ? '⚠️ Door hooks prohibited'
        : doorHooksAllowed
        ? '✓ Door hooks allowed'
        : '⏳ Door policy needed',
      message: doorHooksProhibited
        ? 'Over-the-door hooks are prohibited by your hall policy (e.g. fire door latch rules).'
        : doorHooksAllowed
        ? 'Over-the-door hook use permitted by your residence hall.'
        : 'Confirm whether over-the-door hooks are permitted on your room or closet doors.',
    },
    wallAndDoor: {
      status: wallAndDoorComplete ? 'ready' : 'wait',
      badgeLabel: doorHooksProhibited
        ? (wallPolicyComplete ? '✓ Wall complete / ⚠️ Door hooks prohibited' : '⚠️ Door hooks prohibited')
        : wallAndDoorComplete
        ? '✓ Policies Verified'
        : '⏳ More policies needed',
      message: doorHooksProhibited
        ? 'Over-the-door hooks are prohibited by your assigned hall policy. Wall mounting may still be used if compliant with rules.'
        : wallAndDoorComplete
        ? 'Wall mounting and door hanging rules confirmed with your assigned residence hall policy.'
        : 'Confirm permitted wall fasteners (e.g. pushpins vs adhesives) and over-the-door hook rules before buying.',
    },
    sharedFloor: {
      status: sharedFloorReady ? 'ready' : 'wait',
      badgeLabel: sharedFloorReady ? '✓ Dimensions Measured' : '⏳ More measurements needed',
      message: sharedFloorReady
        ? 'Shared open floor footprint recorded. Coordinate with your roommate before purchasing rugs or rolling carts.'
        : 'Measure open floor width and length with your roommate before buying area rugs or storage carts.',
    },
    overallReadyCount,
  };
}

export function generateMeasurementSummary(data: DormMeasurements): string {
  const statuses = checkZoneStatuses(data);
  const lines: string[] = [
    '# 📐 DormReady Storage Measurement Summary',
    `Planning Areas Completed: ${statuses.overallReadyCount} of 6 areas recorded or policy-checked\n`,
    'Note: Recorded locally before purchasing rigid storage furniture or wall organizers.\n',
  ];

  // Under-bed
  lines.push(`## 1. Under-Bed Zone [${statuses.underbed.badgeLabel}]`);
  lines.push(`- Vertical Clearance: ${formatMeasurementForSummary(data.underbed.clearanceInches, 'inches')}`);
  lines.push(`- Bed Frame Width: ${formatMeasurementForSummary(data.underbed.widthInches, 'inches')}`);
  lines.push(`- Frame Depth: ${formatMeasurementForSummary(data.underbed.depthInches, 'inches')}`);
  lines.push(`- Lofting Setting: ${data.underbed.loftingSetting}`);
  if (data.underbed.notes.trim()) lines.push(`- Notes: ${data.underbed.notes.trim()}`);
  lines.push('');

  // Closet
  lines.push(`## 2. Closet Zone [${statuses.closet.badgeLabel}]`);
  lines.push(`- Width: ${formatMeasurementForSummary(data.closet.widthInches, 'inches')}`);
  lines.push(`- Depth: ${formatMeasurementForSummary(data.closet.depthInches, 'inches')}`);
  lines.push(`- Hanging Bar Height: ${formatMeasurementForSummary(data.closet.hangingBarHeightInches, 'inches')}`);
  lines.push(`- Top Shelf Clearance: ${formatMeasurementForSummary(data.closet.topShelfClearanceInches, 'inches')}`);
  lines.push(`- Door Style: ${data.closet.doorType}`);
  if (data.closet.notes.trim()) lines.push(`- Notes: ${data.closet.notes.trim()}`);
  lines.push('');

  // Desk
  lines.push(`## 3. Desk & Study Zone [${statuses.desk.badgeLabel}]`);
  lines.push(`- Surface Width: ${formatMeasurementForSummary(data.desk.widthInches, 'inches')}`);
  lines.push(`- Surface Depth: ${formatMeasurementForSummary(data.desk.depthInches, 'inches')}`);
  lines.push(`- Vertical / Hutch Clearance: ${formatMeasurementForSummary(data.desk.hutchClearanceInches, 'inches')}`);
  lines.push(`- Distance to Outlet: ${formatMeasurementForSummary(data.desk.outletDistanceFeet, 'feet')}`);
  if (data.desk.notes.trim()) lines.push(`- Notes: ${data.desk.notes.trim()}`);
  lines.push('');

  // Wall
  lines.push(`## 4. Wall Mounting Policy [${statuses.wall.badgeLabel}]`);
  lines.push(`- Wall Material: ${data.wallAndDoor.wallMaterial}`);
  lines.push(`- School Mounting Rule: ${data.wallAndDoor.mountingPolicy}`);
  if (data.wallAndDoor.notes.trim()) lines.push(`- Notes: ${data.wallAndDoor.notes.trim()}`);
  lines.push('');

  // Door
  lines.push(`## 5. Over-Door Hanging Policy [${statuses.door.badgeLabel}]`);
  lines.push(`- Over-the-Door Hooks Allowed: ${data.wallAndDoor.overDoorHookPermitted}`);
  lines.push('');

  // Shared Floor
  lines.push(`## 6. Roommate Shared Floor Zone [${statuses.sharedFloor.badgeLabel}]`);
  lines.push(`- Open Floor Width: ${formatMeasurementForSummary(data.sharedFloor.openFloorWidthFeet, 'feet')}`);
  lines.push(`- Open Floor Length: ${formatMeasurementForSummary(data.sharedFloor.openFloorLengthFeet, 'feet')}`);
  if (data.sharedFloor.roommateAgreementNotes.trim()) lines.push(`- Roommate Coordination: ${data.sharedFloor.roommateAgreementNotes.trim()}`);
  lines.push('');

  lines.push('Generated locally with DormReady');
  return lines.join('\n');
}
