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
      <div className="bg-brand-coral-50 border-2 border-brand-coral-200 rounded-3xl p-5 sm:p-6 text-rose-950 shadow-soft no-print">
        <div className="flex items-start gap-3.5">
          <span className="text-brand-coral text-2xl font-bold">⚠️</span>
          <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
            <h2 className="text-base font-black text-rose-950">Important Residence Hall Safety &amp; Fire Rules</h2>
            <p>
              Every university housing department enforces strict campus fire policies. Commonly restricted items include <strong>unfused extension cords, candles, incense, halogen floor lamps, toaster ovens, hot plates, portable AC units, and high-wattage space heaters</strong>.
            </p>
            <p className="text-xs text-rose-900/80 font-medium">
              *DormReady never invents institution-specific rules. Always download your university's official Residence Life Handbook before purchasing electrical appliances.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Progress & Controls Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-2 border-brand-blue-100 rounded-3xl p-4 sm:p-6 shadow-soft no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-black text-brand-navy">Your Packing Progress</span>
              <span className="font-bold text-brand-blue">
                {checkedItemsCount} of {totalItemsCount} packed ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-brand-blue via-brand-coral to-brand-mint rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-navy-500 font-medium">
              <span>Auto-saved in browser storage</span>
              {progressPercent >= 100 ? (
                <span className="text-brand-mint font-bold">🎉 Fully Packed &amp; Ready!</span>
              ) : progressPercent >= 50 ? (
                <span className="text-brand-blue font-bold">🚀 Halfway there!</span>
              ) : (
                <span>Starting out</span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-blue-50 border border-brand-blue-200 text-xs sm:text-sm font-bold text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-sm"
              title="Print formatted checklist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Print Checklist</span>
            </button>

            <button
              type="button"
              onClick={resetAll}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              title="Reset all checkboxes"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search box */}
          <div>
            <label htmlFor="checklist-search" className="block text-xs font-bold text-navy-700 mb-1">
              Search Items
            </label>
            <input
              id="checklist-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Twin XL, surge protector..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category-select" className="block text-xs font-bold text-navy-700 mb-1">
              Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors font-medium"
            >
              <option value="all">All 10 Categories ({CHECKLIST_ITEMS.length})</option>
              {CHECKLIST_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div>
            <label htmlFor="priority-filter" className="block text-xs font-bold text-navy-700 mb-1">
              Priority Level
            </label>
            <select
              id="priority-filter"
              value={essentialsOnly ? 'essentials' : 'all'}
              onChange={(e) => setEssentialsOnly(e.target.value === 'essentials')}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors font-medium"
            >
              <option value="all">Show All Items</option>
              <option value="essentials">Essentials Only (Day 1 Non-Negotiables)</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label htmlFor="budget-tier-select" className="block text-xs font-bold text-navy-700 mb-1">
              Budget Tier
            </label>
            <select
              id="budget-tier-select"
              value={selectedBudgetTier}
              onChange={(e) => setSelectedBudgetTier(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue transition-colors font-medium"
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
        <p className="text-sm text-gray-600">Personal preparation checklist. Generated from DormReady</p>
      </div>

      {/* Checklist Sections */}
      {groupedCategories.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-dashed border-slate-300 rounded-3xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-blue-50 flex items-center justify-center text-3xl">
            🔍
          </div>
          <h3 className="text-lg font-black text-brand-navy">No items match your active filters</h3>
          <p className="text-xs sm:text-sm text-navy-600 max-w-sm mx-auto">
            Try clearing your search query or selecting a broader category filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all');
              setEssentialsOnly(false);
              setSelectedBudgetTier('all');
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-600 shadow-sm transition-all"
          >
            Clear All Active Filters
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedCategories.map((group) => {
            const catCheckedCount = group.items.filter((i) => checkedIds[i.id]).length;
            return (
              <section key={group.key} className="bg-white border-2 border-slate-200 rounded-3xl overflow-hidden shadow-soft">
                {/* Category Header */}
                <div className="bg-slate-50/80 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-black text-brand-navy flex items-center gap-2">
                      <span>{group.name}</span>
                    </h3>
                    <p className="text-xs text-navy-600 mt-0.5">{group.description}</p>
                  </div>
                  <span className="text-xs font-bold text-brand-blue self-start sm:self-auto bg-brand-blue-50 px-3 py-1 rounded-full border border-brand-blue-200 shadow-sm">
                    {catCheckedCount} of {group.items.length} packed
                  </span>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {group.items.map((item) => {
                    const isChecked = !!checkedIds[item.id];
                    return (
                      <div
                        key={item.id}
                        className={`checklist-item p-5 transition-colors flex items-start gap-4 ${
                          isChecked ? 'bg-slate-50/70' : 'hover:bg-brand-blue-50/20'
                        }`}
                      >
                        <input
                          id={`item-${item.id}`}
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(item.id)}
                          className="mt-1 w-5 h-5 rounded-lg text-brand-blue border-2 border-slate-300 focus:ring-brand-blue cursor-pointer"
                        />

                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <label
                              htmlFor={`item-${item.id}`}
                              className={`text-sm sm:text-base font-bold cursor-pointer select-none ${
                                isChecked ? 'line-through text-navy-400' : 'text-brand-navy'
                              }`}
                            >
                              {item.name}
                            </label>

                            {item.tier === 'essential' && (
                              <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-brand-mint-50 text-brand-mint-700 border border-brand-mint-200">
                                Essential
                              </span>
                            )}
                            {item.roommateCoordination && (
                              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-brand-coral-50 text-brand-coral-700 border border-brand-coral-200">
                                ⇄ Coordinate Roommate
                              </span>
                            )}
                            {item.buyAfterArrival && (
                              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-brand-yellow-50 text-amber-800 border border-amber-200">
                                🛒 Buy After Arrival
                              </span>
                            )}
                          </div>

                          <p className={`text-xs sm:text-sm leading-relaxed ${isChecked ? 'text-navy-400' : 'text-navy-700'}`}>
                            {item.description}
                          </p>

                          {item.note && (
                            <p className="text-xs text-navy-700 bg-brand-blue-50/60 p-2.5 rounded-xl border-l-4 border-brand-blue font-medium">
                              💡 <strong>Tip:</strong> {item.note}
                            </p>
                          )}

                          {item.prohibitedWarning && (
                            <p className="text-xs text-rose-950 bg-brand-coral-50 p-2.5 rounded-xl border border-brand-coral-200 flex items-start gap-2 font-semibold">
                              <span>⚠️</span>
                              <span><strong>Safety Notice:</strong> {item.prohibitedWarning}</span>
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
