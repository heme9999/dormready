import { useState, useEffect, useMemo } from 'react';
import {
  CHECKLIST_CATEGORIES,
  CHECKLIST_ITEMS,
  type ChecklistCategoryKey,
  type BudgetTier,
  type ChecklistItem,
} from '../data/checklist';

const STORAGE_KEY = 'dormready_checklist_state_v1';

export default function ChecklistApp() {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<ChecklistCategoryKey | 'all'>('all');
  const [essentialsOnly, setEssentialsOnly] = useState<boolean>(false);
  const [selectedBudgetTier, setSelectedBudgetTier] = useState<BudgetTier | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load state from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCheckedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not load checklist state from localStorage', e);
    }
  }, []);

  // Save to localStorage when state changes
  const toggleItem = (id: string) => {
    setCheckedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Could not save checklist state to localStorage', e);
      }
      return next;
    });
  };

  const resetAll = () => {
    if (window.confirm('Are you sure you want to reset all checked items in your checklist?')) {
      setCheckedIds({});
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Filtered items
  const filteredItems = useMemo(() => {
    return CHECKLIST_ITEMS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (essentialsOnly && item.tier !== 'essential') {
        return false;
      }
      if (selectedBudgetTier !== 'all' && item.budgetTier !== selectedBudgetTier) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesNote = item.note ? item.note.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesDesc && !matchesNote) return false;
      }
      return true;
    });
  }, [selectedCategory, essentialsOnly, selectedBudgetTier, searchQuery]);

  // Overall completion stats
  const totalItemsCount = CHECKLIST_ITEMS.length;
  const checkedItemsCount = Object.keys(checkedIds).filter((id) => checkedIds[id]).length;
  const progressPercent = totalItemsCount > 0 ? Math.round((checkedItemsCount / totalItemsCount) * 100) : 0;

  // Category grouped items for render
  const groupedCategories = useMemo(() => {
    const map = new Map<ChecklistCategoryKey, ChecklistItem[]>();
    for (const cat of CHECKLIST_CATEGORIES) {
      map.set(cat.key, []);
    }
    for (const item of filteredItems) {
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    }
    return CHECKLIST_CATEGORIES.map((cat) => ({
      ...cat,
      items: map.get(cat.key) || [],
    })).filter((cat) => cat.items.length > 0);
  }, [filteredItems]);

  return (
    <div className="space-y-8">
      {/* Safety Warning Banner (Universally Applicable Notice) */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 sm:p-6 text-navy-900 shadow-sm no-print">
        <div className="flex items-start gap-3.5">
          <span className="text-amber-800 text-xl font-bold">⚠️</span>
          <div className="space-y-1.5 text-sm leading-relaxed">
            <h2 className="text-base font-bold text-amber-950">Important Residence Hall Safety & Rules Notice</h2>
            <p>
              Every university housing department enforces distinct fire and safety policies. Commonly restricted items include <strong>unfused extension cords, candles, incense, halogen floor lamps, toaster ovens, hot plates, portable AC units, and high-wattage space heaters</strong>.
            </p>
            <p className="text-xs text-navy-700">
              *DormReady never invents institution-specific rules. Always download and review your university's official Residence Life Handbook before purchasing electrical appliances or wall mounts.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Progress & Controls Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-cream-50/95 backdrop-blur-md border border-cream-300 rounded-2xl p-4 sm:p-6 shadow-sm no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-bold text-navy-900">Your Packing Progress</span>
              <span className="font-semibold text-forest-800">
                {checkedItemsCount} of {totalItemsCount} items packed ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-800 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <p className="text-xs text-navy-500">Progress automatically saved in your browser.</p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-cream-300 text-xs sm:text-sm font-semibold text-navy-800 hover:bg-cream-100 transition-colors shadow-sm"
              title="Print formatted checklist"
            >
              <svg className="w-4 h-4 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Checklist</span>
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
              title="Reset all checkboxes"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 pt-4 border-t border-cream-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div>
            <label htmlFor="checklist-search" className="block text-xs font-semibold text-navy-700 mb-1">
              Search Items
            </label>
            <input
              id="checklist-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Twin XL, surge protector..."
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:border-forest-800"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category-select" className="block text-xs font-semibold text-navy-700 mb-1">
              Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:border-forest-800"
            >
              <option value="all">All Categories ({CHECKLIST_ITEMS.length})</option>
              {CHECKLIST_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label htmlFor="priority-filter" className="block text-xs font-semibold text-navy-700 mb-1">
              Need Level
            </label>
            <select
              id="priority-filter"
              value={essentialsOnly ? 'essentials' : 'all'}
              onChange={(e) => setEssentialsOnly(e.target.value === 'essentials')}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:border-forest-800"
            >
              <option value="all">Show All Items</option>
              <option value="essentials">Essentials Only (Day 1 Non-Negotiables)</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label htmlFor="budget-tier-select" className="block text-xs font-semibold text-navy-700 mb-1">
              Budget Tier
            </label>
            <select
              id="budget-tier-select"
              value={selectedBudgetTier}
              onChange={(e) => setSelectedBudgetTier(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg focus:outline-none focus:border-forest-800"
            >
              <option value="all">All Budget Tiers</option>
              <option value="low">Budget / Economy ($)</option>
              <option value="mid">Mid-Range ($$)</option>
              <option value="high">Investment ($$$)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print-only mb-6 text-center">
        <h1 className="text-2xl font-bold">DormReady Master College Dorm Checklist</h1>
        <p className="text-sm text-gray-600">Personal preparation checklist. Generated from DormReady.org</p>
      </div>

      {/* Checklist Sections */}
      {groupedCategories.length === 0 ? (
        <div className="p-12 text-center bg-white border border-cream-300 rounded-xl space-y-3">
          <p className="text-base font-semibold text-navy-800">No items match your active filters.</p>
          <p className="text-sm text-navy-500">Try clearing the search query or changing the category filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setEssentialsOnly(false);
              setSelectedBudgetTier('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-cream-200 text-forest-900 rounded-lg text-sm font-semibold hover:bg-cream-300"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedCategories.map((group) => {
            const catCheckedCount = group.items.filter((i) => checkedIds[i.id]).length;
            return (
              <section key={group.key} className="bg-white border border-cream-300 rounded-2xl overflow-hidden shadow-sm">
                {/* Category Header */}
                <div className="bg-cream-100 border-b border-cream-300 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-navy-900 flex items-center gap-2">
                      <span>{group.name}</span>
                    </h3>
                    <p className="text-xs text-navy-600 mt-0.5">{group.description}</p>
                  </div>
                  <span className="text-xs font-semibold text-forest-800 self-start sm:self-auto bg-forest-50 px-2.5 py-1 rounded-full border border-forest-100">
                    {catCheckedCount} of {group.items.length} packed
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-cream-200">
                  {group.items.map((item) => {
                    const isChecked = !!checkedIds[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`checklist-item p-4 sm:p-5 transition-colors flex items-start gap-4 ${
                          isChecked ? 'bg-cream-50/60' : 'hover:bg-cream-50/40'
                        }`}
                      >
                        <input
                          id={`item-${item.id}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          className="mt-1 w-5 h-5 rounded text-forest-800 border-cream-300 focus:ring-forest-800 cursor-pointer"
                        />

                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <label
                              htmlFor={`item-${item.id}`}
                              className={`text-base font-semibold cursor-pointer select-none ${
                                isChecked ? 'line-through text-navy-500' : 'text-navy-900'
                              }`}
                            >
                              {item.name}
                            </label>

                            {item.tier === 'essential' && (
                              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded bg-forest-100 text-forest-900">
                                Essential
                              </span>
                            )}
                            {item.roommateCoordination && (
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200">
                                Coordinate w/ Roommate
                              </span>
                            )}
                            {item.buyAfterArrival && (
                              <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-purple-50 text-purple-800 border border-purple-200">
                                Buy After Arrival
                              </span>
                            )}
                          </div>

                          <p className={`text-sm leading-relaxed ${isChecked ? 'text-navy-400' : 'text-navy-600'}`}>
                            {item.description}
                          </p>

                          {item.note && (
                            <p className="text-xs text-navy-500 italic bg-cream-100/80 p-2 rounded border-l-2 border-forest-700">
                              💡 <strong>Tip:</strong> {item.note}
                            </p>
                          )}

                          {item.prohibitedWarning && (
                            <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-start gap-1.5 font-medium">
                              <span>⚠️</span>
                              <span><strong>Safety rule:</strong> {item.prohibitedWarning}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
