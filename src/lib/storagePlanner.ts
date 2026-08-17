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

/**
 * Validates that an input is a finite, strictly positive number (> 0).
 * Rejects empty strings, 0, negative values, NaN, and Infinity.
 */
export function isValidPositiveNumber(val: string): boolean {
  if (!val || typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (trimmed === '') return false;
  const num = Number(trimmed);
  return !Number.isNaN(num) && Number.isFinite(num) && num > 0;
}

export interface ZoneStatus {
  status: 'ready' | 'wait';
  badgeLabel: string;
  message: string;
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
  wallAndDoor: ZoneStatus;
  sharedFloor: ZoneStatus;
  overallReadyCount: number;
} {
  let overallReadyCount = 0;

  // 1. Under-bed Zone
  const underbedClearanceValid = isValidPositiveNumber(data.underbed.clearanceInches);
  const underbedWidthValid = isValidPositiveNumber(data.underbed.widthInches);
  const underbedDepthValid = isValidPositiveNumber(data.underbed.depthInches);
  const underbedLoftingConfirmed = data.underbed.loftingSetting !== 'unconfirmed';

  const softBagsReady = underbedClearanceValid;
  const rigidBinsReady = underbedWidthValid && underbedDepthValid && underbedClearanceValid;
  const underbedReady = rigidBinsReady && underbedLoftingConfirmed;
  if (underbedReady) overallReadyCount++;

  // 2. Closet Zone
  const closetWidthValid = isValidPositiveNumber(data.closet.widthInches);
  const closetDepthValid = isValidPositiveNumber(data.closet.depthInches);
  const closetDoorConfirmed = data.closet.doorType !== 'unconfirmed';
  const closetHangingBarValid = isValidPositiveNumber(data.closet.hangingBarHeightInches);
  const closetTopShelfValid = isValidPositiveNumber(data.closet.topShelfClearanceInches);

  const closetCoreReady = closetWidthValid && closetDepthValid && closetDoorConfirmed;
  const hangingShelvesReady = closetCoreReady && closetHangingBarValid;
  const topShelfBinsReady = closetCoreReady && closetTopShelfValid;
  const closetReady = closetCoreReady;
  if (closetReady) overallReadyCount++;

  // 3. Desk Zone
  const deskWidthValid = isValidPositiveNumber(data.desk.widthInches);
  const deskDepthValid = isValidPositiveNumber(data.desk.depthInches);
  const deskHutchValid = isValidPositiveNumber(data.desk.hutchClearanceInches);

  const deskReady = deskWidthValid && deskDepthValid && deskHutchValid;
  if (deskReady) overallReadyCount++;

  // 4. Wall and Door Zone
  const wallMountingConfirmed = data.wallAndDoor.mountingPolicy !== 'unconfirmed';
  const doorHookProhibited = data.wallAndDoor.overDoorHookPermitted === 'no';
  const doorHookPermitted = data.wallAndDoor.overDoorHookPermitted === 'yes';

  // Overall wall & door is ready only if mounting policy is confirmed and door hook policy is confirmed without prohibition
  const wallAndDoorReady = wallMountingConfirmed && doorHookPermitted;
  if (wallAndDoorReady) overallReadyCount++;

  // 5. Shared Floor Zone
  const floorWidthValid = isValidPositiveNumber(data.sharedFloor.openFloorWidthFeet);
  const floorLengthValid = isValidPositiveNumber(data.sharedFloor.openFloorLengthFeet);

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
    wallAndDoor: {
      status: wallAndDoorReady ? 'ready' : 'wait',
      badgeLabel: doorHookProhibited
        ? '⚠️ Over-Door Hooks Prohibited'
        : wallAndDoorReady
        ? '✓ Policies Verified'
        : '⏳ More policies needed',
      message: doorHookProhibited
        ? 'Over-the-door hooks are prohibited by your assigned hall policy. Wall mounting may still be used if compliant with rules.'
        : wallAndDoorReady
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
    `Zones Measured: ${statuses.overallReadyCount} of 5 zones ready\n`,
    'Note: Recorded locally before purchasing rigid storage furniture or wall organizers.\n',
  ];

  // Under-bed
  lines.push(`## 1. Under-Bed Zone [${statuses.underbed.badgeLabel}]`);
  lines.push(`- Vertical Clearance: ${isValidPositiveNumber(data.underbed.clearanceInches) ? `${data.underbed.clearanceInches} in` : 'Unmeasured'}`);
  lines.push(`- Bed Frame Width: ${isValidPositiveNumber(data.underbed.widthInches) ? `${data.underbed.widthInches} in` : 'Unmeasured'}`);
  lines.push(`- Frame Depth: ${isValidPositiveNumber(data.underbed.depthInches) ? `${data.underbed.depthInches} in` : 'Unmeasured'}`);
  lines.push(`- Lofting Setting: ${data.underbed.loftingSetting}`);
  if (data.underbed.notes.trim()) lines.push(`- Notes: ${data.underbed.notes.trim()}`);
  lines.push('');

  // Closet
  lines.push(`## 2. Closet Zone [${statuses.closet.badgeLabel}]`);
  lines.push(`- Width: ${isValidPositiveNumber(data.closet.widthInches) ? `${data.closet.widthInches} in` : 'Unmeasured'}`);
  lines.push(`- Depth: ${isValidPositiveNumber(data.closet.depthInches) ? `${data.closet.depthInches} in` : 'Unmeasured'}`);
  lines.push(`- Hanging Bar Height: ${isValidPositiveNumber(data.closet.hangingBarHeightInches) ? `${data.closet.hangingBarHeightInches} in` : 'Unmeasured'}`);
  lines.push(`- Top Shelf Clearance: ${isValidPositiveNumber(data.closet.topShelfClearanceInches) ? `${data.closet.topShelfClearanceInches} in` : 'Unmeasured'}`);
  lines.push(`- Door Style: ${data.closet.doorType}`);
  if (data.closet.notes.trim()) lines.push(`- Notes: ${data.closet.notes.trim()}`);
  lines.push('');

  // Desk
  lines.push(`## 3. Desk & Study Zone [${statuses.desk.badgeLabel}]`);
  lines.push(`- Surface Width: ${isValidPositiveNumber(data.desk.widthInches) ? `${data.desk.widthInches} in` : 'Unmeasured'}`);
  lines.push(`- Surface Depth: ${isValidPositiveNumber(data.desk.depthInches) ? `${data.desk.depthInches} in` : 'Unmeasured'}`);
  lines.push(`- Vertical / Hutch Clearance: ${isValidPositiveNumber(data.desk.hutchClearanceInches) ? `${data.desk.hutchClearanceInches} in` : 'Unmeasured'}`);
  lines.push(`- Distance to Outlet: ${isValidPositiveNumber(data.desk.outletDistanceFeet) ? `${data.desk.outletDistanceFeet} ft` : 'Unmeasured'}`);
  if (data.desk.notes.trim()) lines.push(`- Notes: ${data.desk.notes.trim()}`);
  lines.push('');

  // Wall and Door
  lines.push(`## 4. Wall & Door Zone [${statuses.wallAndDoor.badgeLabel}]`);
  lines.push(`- Wall Material: ${data.wallAndDoor.wallMaterial}`);
  lines.push(`- School Mounting Rule: ${data.wallAndDoor.mountingPolicy}`);
  lines.push(`- Over-the-Door Hooks Allowed: ${data.wallAndDoor.overDoorHookPermitted}`);
  if (data.wallAndDoor.notes.trim()) lines.push(`- Notes: ${data.wallAndDoor.notes.trim()}`);
  lines.push('');

  // Shared Floor
  lines.push(`## 5. Roommate Shared Floor Zone [${statuses.sharedFloor.badgeLabel}]`);
  lines.push(`- Open Floor Space: ${isValidPositiveNumber(data.sharedFloor.openFloorWidthFeet) && isValidPositiveNumber(data.sharedFloor.openFloorLengthFeet) ? `${data.sharedFloor.openFloorWidthFeet} x ${data.sharedFloor.openFloorLengthFeet} ft` : 'Unmeasured'}`);
  if (data.sharedFloor.roommateAgreementNotes.trim()) lines.push(`- Roommate Coordination: ${data.sharedFloor.roommateAgreementNotes.trim()}`);
  lines.push('');

  lines.push('Generated locally with DormReady');
  return lines.join('\n');
}
