import { describe, it, expect } from 'vitest';

interface TimingItem {
  id: string;
  name: string;
  category: 'before' | 'assignment' | 'after' | 'coordinate';
  timingLabel: string;
  badgeColor: string;
  itemType: string;
  reason: string;
  flyingTip?: string;
}

const TIMING_DATA: TimingItem[] = [
  {
    id: 't-1',
    name: 'Prescription Medications & 90-Day Refill Plan',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Health & Medical',
    reason: 'Must be arranged with hometown physician and pharmacy prior to moving out of state.',
    flyingTip: 'Always carry on plane in original labeled pharmacy bottles; never check.',
  },
  {
    id: 't-2',
    name: 'Government ID, Passport & Health Insurance Card',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Documents',
    reason: 'Required on Day 1 for campus residence check-in and student employment (I-9 verification).',
    flyingTip: 'Carry in personal backpack; keep in a secure folder.',
  },
  {
    id: 't-3',
    name: 'Laptop, Charger & Backup Storage',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Technology',
    reason: 'Need computer set up with campus 2-factor authentication before orientation week.',
    flyingTip: 'Lithium-ion batteries must remain in carry-on luggage per FAA regulations.',
  },
  {
    id: 't-4',
    name: 'Mattress Protector & First-Night Twin XL Sheets',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Bedding',
    reason: 'You cannot sleep on a bare institutional vinyl mattress on move-in night after stores close.',
    flyingTip: 'Pack one set inside your carry-on or top of duffel bag.',
  },
  {
    id: 't-5',
    name: 'Shower Shoes & Mesh Shower Caddy',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Bathroom',
    reason: 'You will need an immediate shower after hours of unloading boxes in August heat.',
    flyingTip: 'Mesh caddies pack flat; place slides in an outer bag pocket.',
  },
  {
    id: 't-6',
    name: 'UL-Listed Surge Protector with Circuit Breaker',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Power',
    reason: 'Needed immediately to charge phone, lamp, and fan on night one.',
  },
  {
    id: 't-7',
    name: 'Under-Bed Storage Totes & Drawers',
    category: 'assignment',
    timingLabel: 'Wait for Room Assignment',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    itemType: 'Storage',
    reason: 'Clearance under dorm beds varies depending on whether bed frames are fixed or lofted.',
    flyingTip: 'Do not pack rigid bins on flights; buy collapsible fabric totes or purchase locally.',
  },
  {
    id: 't-8',
    name: 'Extra-Long Ethernet & Power Extension Cables',
    category: 'assignment',
    timingLabel: 'Wait for Room Assignment',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    itemType: 'Technology',
    reason: 'Outlet and data port positions vary depending on room corner and bed placement.',
  },
  {
    id: 't-9',
    name: 'Window Curtains / Blackout Panels',
    category: 'assignment',
    timingLabel: 'Wait for Room Assignment',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    itemType: 'Decor',
    reason: 'Many halls provide built-in roller blinds or prohibit tension curtain rods.',
  },
  {
    id: 't-10',
    name: 'Liquid Cleaning Sprays, Disinfectant & Detergent',
    category: 'after',
    timingLabel: 'Buy After Arrival',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    itemType: 'Cleaning',
    reason: 'Heavy liquid jugs leak in suitcases and consume critical car trunk space.',
    flyingTip: 'Never fly with heavy liquid bottles; purchase at a local store on arrival day.',
  },
  {
    id: 't-11',
    name: 'Room Floor Area Rug (3x5 or 4x6 ft)',
    category: 'after',
    timingLabel: 'Buy After Arrival',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    itemType: 'Comfort',
    reason: 'Bulky to haul; best chosen after measuring usable open floor between desks with roommate.',
  },
  {
    id: 't-12',
    name: 'Snacks, Bottled Water & Beverage Cases',
    category: 'after',
    timingLabel: 'Buy After Arrival',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    itemType: 'Kitchen',
    reason: 'Perishables and heavy liquids should be purchased during your first grocery run.',
  },
  {
    id: 't-13',
    name: 'Shared Mini-Fridge & Microwave',
    category: 'coordinate',
    timingLabel: 'Coordinate with Roommate',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    itemType: 'Appliance',
    reason: 'Double rooms only have physical space and electrical capacity for one unit. Check if hall already provides a MicroFridge.',
  },
  {
    id: 't-14',
    name: 'Full-Length Over-the-Door Mirror',
    category: 'coordinate',
    timingLabel: 'Coordinate with Roommate',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    itemType: 'Living',
    reason: 'A single over-the-door mirror serves both roommates; avoid purchasing two.',
  },
  {
    id: 't-15',
    name: 'Floor Cleaning Tool (Swiffer / Vacuum)',
    category: 'coordinate',
    timingLabel: 'Coordinate with Roommate',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    itemType: 'Cleaning',
    reason: 'One cordless stick vacuum or Swiffer kit is sufficient for a shared room.',
  },
];

function filterTimingItems(category: string, query: string): TimingItem[] {
  return TIMING_DATA.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesSearch =
      query === '' ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.itemType.toLowerCase().includes(query.toLowerCase()) ||
      item.reason.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

describe('Timing Matrix Filtering & Search Logic', () => {
  it('contains exactly 15 verified timing items mapped to 4 core phases', () => {
    expect(TIMING_DATA.length).toBe(15);
    const beforeCount = TIMING_DATA.filter((i) => i.category === 'before').length;
    const assignmentCount = TIMING_DATA.filter((i) => i.category === 'assignment').length;
    const afterCount = TIMING_DATA.filter((i) => i.category === 'after').length;
    const coordinateCount = TIMING_DATA.filter((i) => i.category === 'coordinate').length;

    expect(beforeCount).toBe(6);
    expect(assignmentCount).toBe(3);
    expect(afterCount).toBe(3);
    expect(coordinateCount).toBe(3);
    expect(beforeCount + assignmentCount + afterCount + coordinateCount).toBe(15);
  });

  it('filters items correctly by category tab', () => {
    const all = filterTimingItems('all', '');
    expect(all.length).toBe(15);

    const before = filterTimingItems('before', '');
    expect(before.length).toBe(6);
    expect(before.every((i) => i.category === 'before')).toBe(true);

    const assignment = filterTimingItems('assignment', '');
    expect(assignment.length).toBe(3);
    expect(assignment.every((i) => i.category === 'assignment')).toBe(true);

    const after = filterTimingItems('after', '');
    expect(after.length).toBe(3);
    expect(after.every((i) => i.category === 'after')).toBe(true);

    const coordinate = filterTimingItems('coordinate', '');
    expect(coordinate.length).toBe(3);
    expect(coordinate.every((i) => i.category === 'coordinate')).toBe(true);
  });

  it('filters items accurately with case-insensitive search queries', () => {
    const searchFridge = filterTimingItems('all', 'fridge');
    expect(searchFridge.length).toBe(1);
    expect(searchFridge[0].name).toContain('Mini-Fridge');

    const searchMed = filterTimingItems('all', 'prescription');
    expect(searchMed.length).toBe(1);
    expect(searchMed[0].id).toBe('t-1');

    const searchType = filterTimingItems('all', 'Cleaning');
    expect(searchType.length).toBe(2); // Detergent & Vacuum
  });

  it('combines category and search filters simultaneously', () => {
    // Search for "cleaning" inside "after" category -> only liquid sprays/detergent
    const filtered = filterTimingItems('after', 'cleaning');
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('t-10');

    // Search for "cleaning" inside "coordinate" category -> only Swiffer/vacuum
    const coordFiltered = filterTimingItems('coordinate', 'cleaning');
    expect(coordFiltered.length).toBe(1);
    expect(coordFiltered[0].id).toBe('t-15');
  });

  it('provides practical flight tips for high-risk airline travel items', () => {
    const itemsWithFlightTips = TIMING_DATA.filter((i) => i.flyingTip !== undefined);
    expect(itemsWithFlightTips.length).toBeGreaterThanOrEqual(6);

    const meds = TIMING_DATA.find((i) => i.id === 't-1');
    expect(meds?.flyingTip).toContain('Always carry on plane in original labeled pharmacy bottles');

    const laptop = TIMING_DATA.find((i) => i.id === 't-3');
    expect(laptop?.flyingTip).toContain('Lithium-ion batteries must remain in carry-on');

    const liquids = TIMING_DATA.find((i) => i.id === 't-10');
    expect(liquids?.flyingTip).toContain('Never fly with heavy liquid bottles');
  });
});
