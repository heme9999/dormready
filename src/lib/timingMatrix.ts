export type TimingCategory = 'all' | 'before' | 'assignment' | 'after' | 'coordinate';

export interface TimingItem {
  id: string;
  name: string;
  category: 'before' | 'assignment' | 'after' | 'coordinate';
  timingLabel: string;
  badgeColor: string;
  itemType: string;
  reason: string;
  flyingTip?: string;
}

export const TIMING_DATA: TimingItem[] = [
  {
    id: 't-1',
    name: 'Prescription Medications & Healthcare Preparation',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Health & Medical',
    reason: 'Must be arranged with hometown physician and pharmacy prior to moving.',
    flyingTip: 'Keep essential medication accessible in carry-on baggage when practical. TSA permits medications in carry-on baggage, including medically necessary liquids above the usual liquid limit, subject to screening. Prescription-label requirements can vary by destination and state, so check applicable rules and your airline before traveling.',
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
    flyingTip: 'FAA recommends keeping laptops and other devices containing lithium batteries in accessible carry-on baggage. If an airline permits a device in checked baggage, it must be completely powered off and protected from accidental activation and damage. Spare lithium batteries and power banks must remain in carry-on baggage.',
  },
  {
    id: 't-4',
    name: 'Mattress Protector & First-Night Twin XL Sheets',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Bedding',
    reason: 'Having clean sheets ready ensures you can make your bed and sleep comfortably on night one.',
    flyingTip: 'Pack one set inside your carry-on or top of duffel bag.',
  },
  {
    id: 't-5',
    name: 'Shower Shoes & Mesh Shower Caddy',
    category: 'before',
    timingLabel: 'Buy / Pack Before',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    itemType: 'Bathroom',
    reason: 'Essential for hygiene in shared residence hall bathrooms from day one.',
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
    reason: 'Bulky cleaning liquids are heavy and leak-prone during transit.',
    flyingTip: 'Bulky cleaning liquids are often easier to purchase after arrival. Carry-on liquids are subject to TSA limits, while checked-baggage eligibility depends on the product and any hazardous-material restrictions. Check TSA, FAA and airline rules before packing.',
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
    reason: 'Coordinate shared appliances with your roommate. Confirm what the hall provides, what the school permits, and whether the room has suitable space before purchasing.',
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

export function filterTimingItems(items: TimingItem[], category: TimingCategory | string, query: string): TimingItem[] {
  return items.filter((item) => {
    const matchesCategory = category === 'all' || item.category === category;
    const matchesSearch =
      query === '' ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.itemType.toLowerCase().includes(query.toLowerCase()) ||
      item.reason.toLowerCase().includes(query.toLowerCase()) ||
      (item.flyingTip && item.flyingTip.toLowerCase().includes(query.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
}
