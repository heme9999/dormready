import { useState, useMemo } from 'react';

export type TimingCategory = 'all' | 'before' | 'assignment' | 'after' | 'coordinate';

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

export default function TimingMatrixApp() {
  const [selectedFilter, setSelectedFilter] = useState<TimingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return TIMING_DATA.filter((item) => {
      const matchesCategory =
        selectedFilter === 'all' || item.category === selectedFilter;
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itemType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reason.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'bg-white text-navy-700 hover:bg-slate-200/70 border border-slate-200'
            }`}
          >
            All Timing Steps ({TIMING_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('before')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'before'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'
            }`}
          >
            1. Buy Before (6)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('assignment')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'assignment'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'
            }`}
          >
            2. Wait for Assignment (3)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('after')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'after'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
            }`}
          >
            3. Buy After Arrival (3)
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('coordinate')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              selectedFilter === 'coordinate'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
            }`}
          >
            4. Coordinate Roommates (3)
          </button>
        </div>

        {/* Search Box */}
        <div className="relative min-w-[200px]">
          <input
            type="text"
            placeholder="Search items or reasons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-blue text-navy-900"
          />
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Interactive Table View */}
      <div className="overflow-x-auto rounded-2xl border-2 border-slate-200 shadow-soft bg-white">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 text-brand-navy font-black">
            <tr>
              <th className="p-3.5 border-b border-slate-200">Recommended Item</th>
              <th className="p-3.5 border-b border-slate-200">Category</th>
              <th className="p-3.5 border-b border-slate-200">When to Buy</th>
              <th className="p-3.5 border-b border-slate-200">Decision Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5 font-bold text-navy-900">
                  <span>{item.name}</span>
                  {item.flyingTip && (
                    <span className="block text-[11px] text-brand-blue font-medium mt-0.5">
                      ✈️ Flight tip: {item.flyingTip}
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-navy-600 text-xs whitespace-nowrap">{item.itemType}</td>
                <td className="p-3.5 whitespace-nowrap">
                  <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${item.badgeColor}`}>
                    {item.timingLabel}
                  </span>
                </td>
                <td className="p-3.5 text-navy-700 text-xs leading-relaxed">{item.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
