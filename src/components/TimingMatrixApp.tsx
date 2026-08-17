import { useState, useMemo } from 'react';
import {
  type TimingCategory,
  TIMING_DATA,
  filterTimingItems,
} from '../lib/timingMatrix';

export default function TimingMatrixApp() {
  const [selectedFilter, setSelectedFilter] = useState<TimingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return filterTimingItems(TIMING_DATA, selectedFilter, searchQuery);
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
