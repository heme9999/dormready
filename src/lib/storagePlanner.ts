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

export interface ZoneStatus {
  status: 'ready' | 'wait';
  badgeLabel: string;
  message: string;
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

  // Underbed: Ready if clearance height is entered and lofting setting is not unconfirmed
  const underbedReady = Boolean(
    data.underbed.clearanceInches.trim() && data.underbed.loftingSetting !== 'unconfirmed'
  );
  if (underbedReady) overallReadyCount++;

  // Closet: Ready if width or hangingBarHeight is entered and doorType is not unconfirmed
  const closetReady = Boolean(
    (data.closet.widthInches.trim() || data.closet.hangingBarHeightInches.trim()) &&
      data.closet.doorType !== 'unconfirmed'
  );
  if (closetReady) overallReadyCount++;

  // Desk: Ready if width and hutch clearance is entered
  const deskReady = Boolean(data.desk.widthInches.trim() && data.desk.hutchClearanceInches.trim());
  if (deskReady) overallReadyCount++;

  // Wall & Door: Ready if mounting policy is not unconfirmed and door hook is not unconfirmed
  const wallReady = Boolean(
    data.wallAndDoor.mountingPolicy !== 'unconfirmed' &&
      data.wallAndDoor.overDoorHookPermitted !== 'unconfirmed'
  );
  if (wallReady) overallReadyCount++;

  // Shared Floor: Ready if floor dimensions or notes are entered
  const sharedReady = Boolean(
    (data.sharedFloor.openFloorWidthFeet.trim() && data.sharedFloor.openFloorLengthFeet.trim()) ||
      data.sharedFloor.roommateAgreementNotes.trim()
  );
  if (sharedReady) overallReadyCount++;

  return {
    underbed: {
      status: underbedReady ? 'ready' : 'wait',
      badgeLabel: underbedReady ? '✓ Ready to shop' : '⏳ Wait before buying',
      message: underbedReady
        ? 'Vertical clearance recorded. You can now safely buy storage totes or drawer organizers.'
        : 'Do not buy rigid under-bed storage containers until you measure the actual bed clearance after arrival.',
    },
    closet: {
      status: closetReady ? 'ready' : 'wait',
      badgeLabel: closetReady ? '✓ Ready to shop' : '⏳ Wait before buying',
      message: closetReady
        ? 'Closet dimensions confirmed. Ready to select hanging shelves, organizers, and shoe racks.'
        : 'Wait to purchase hanging tiered shelves or shoe organizers until you confirm closet door style and bar height.',
    },
    desk: {
      status: deskReady ? 'ready' : 'wait',
      badgeLabel: deskReady ? '✓ Ready to shop' : '⏳ Wait before buying',
      message: deskReady
        ? 'Desk clearance measured. Ready to buy monitor risers, desk shelving, and desk hutches.'
        : 'Check whether the desk includes a fixed hutch before purchasing tall desktop shelves or monitor risers.',
    },
    wallAndDoor: {
      status: wallReady ? 'ready' : 'wait',
      badgeLabel: wallReady ? '✓ Ready to shop' : '⏳ Wait before buying',
      message: wallReady
        ? 'Wall mounting and door policy verified against your assigned hall policy.'
        : 'Confirm your residence hall wall hanging rules before buying adhesive strips or over-the-door hooks.',
    },
    sharedFloor: {
      status: sharedReady ? 'ready' : 'wait',
      badgeLabel: sharedReady ? '✓ Ready to shop' : '⏳ Wait before buying',
      message: sharedReady
        ? 'Shared floor footprint and rug allocation coordinated with roommate.'
        : 'Wait to buy area rugs or extra storage carts until you and your roommate measure usable open floor space.',
    },
    overallReadyCount,
  };
}

export function generateMeasurementSummary(data: DormMeasurements): string {
  const statuses = checkZoneStatuses(data);
  const lines: string[] = [
    '# 📐 DormReady Storage Measurement Summary',
    `Zones Confirmed: ${statuses.overallReadyCount} of 5 zones ready\n`,
    'Note: Recorded locally before purchasing rigid storage furniture or wall organizers.\n',
  ];

  // Under-bed
  lines.push(`## 1. Under-Bed Zone [${statuses.underbed.badgeLabel}]`);
  lines.push(`- Vertical Clearance: ${data.underbed.clearanceInches ? `${data.underbed.clearanceInches} in` : 'Unmeasured'}`);
  lines.push(`- Bed Frame Width: ${data.underbed.widthInches ? `${data.underbed.widthInches} in` : 'Unmeasured'}`);
  lines.push(`- Frame Depth: ${data.underbed.depthInches ? `${data.underbed.depthInches} in` : 'Unmeasured'}`);
  lines.push(`- Lofting Setting: ${data.underbed.loftingSetting}`);
  if (data.underbed.notes.trim()) lines.push(`- Notes: ${data.underbed.notes.trim()}`);
  lines.push('');

  // Closet
  lines.push(`## 2. Closet Zone [${statuses.closet.badgeLabel}]`);
  lines.push(`- Width: ${data.closet.widthInches ? `${data.closet.widthInches} in` : 'Unmeasured'}`);
  lines.push(`- Depth: ${data.closet.depthInches ? `${data.closet.depthInches} in` : 'Unmeasured'}`);
  lines.push(`- Hanging Bar Height: ${data.closet.hangingBarHeightInches ? `${data.closet.hangingBarHeightInches} in` : 'Unmeasured'}`);
  lines.push(`- Top Shelf Clearance: ${data.closet.topShelfClearanceInches ? `${data.closet.topShelfClearanceInches} in` : 'Unmeasured'}`);
  lines.push(`- Door Style: ${data.closet.doorType}`);
  if (data.closet.notes.trim()) lines.push(`- Notes: ${data.closet.notes.trim()}`);
  lines.push('');

  // Desk
  lines.push(`## 3. Desk & Study Zone [${statuses.desk.badgeLabel}]`);
  lines.push(`- Surface Width: ${data.desk.widthInches ? `${data.desk.widthInches} in` : 'Unmeasured'}`);
  lines.push(`- Surface Depth: ${data.desk.depthInches ? `${data.desk.depthInches} in` : 'Unmeasured'}`);
  lines.push(`- Vertical / Hutch Clearance: ${data.desk.hutchClearanceInches ? `${data.desk.hutchClearanceInches} in` : 'Unmeasured'}`);
  lines.push(`- Distance to Outlet: ${data.desk.outletDistanceFeet ? `${data.desk.outletDistanceFeet} ft` : 'Unmeasured'}`);
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
  lines.push(`- Open Floor Space: ${data.sharedFloor.openFloorWidthFeet && data.sharedFloor.openFloorLengthFeet ? `${data.sharedFloor.openFloorWidthFeet} x ${data.sharedFloor.openFloorLengthFeet} ft` : 'Unmeasured'}`);
  if (data.sharedFloor.roommateAgreementNotes.trim()) lines.push(`- Roommate Coordination: ${data.sharedFloor.roommateAgreementNotes.trim()}`);
  lines.push('');

  lines.push('Generated locally with DormReady');
  return lines.join('\n');
}
