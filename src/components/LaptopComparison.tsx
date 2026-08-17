import { useState, useMemo } from 'react';
import {
  LAPTOP_PROFILES,
  MAJOR_OPTIONS,
  type LaptopOS,
  type LaptopBudgetTier,
  type MajorCategory,
  type BatteryPriority,
  type PortabilityRating,
} from '../data/laptops';

export default function LaptopComparison() {
  const [selectedMajor, setSelectedMajor] = useState<MajorCategory | 'all'>('all');
  const [selectedOS, setSelectedOS] = useState<LaptopOS | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<LaptopBudgetTier | 'all'>('all');
  const [selectedBattery, setSelectedBattery] = useState<BatteryPriority | 'all'>('all');
  const [selectedPortability, setSelectedPortability] = useState<PortabilityRating | 'all'>('all');

  const filteredLaptops = useMemo(() => {
    return LAPTOP_PROFILES.filter((item) => {
      if (selectedMajor !== 'all' && !item.targetMajor.includes(selectedMajor)) {
        return false;
      }
      if (selectedOS !== 'all' && item.os !== selectedOS) {
        return false;
      }
      if (selectedBudget !== 'all' && item.budgetTier !== selectedBudget) {
        return false;
      }
      if (selectedBattery !== 'all' && item.batteryPriority !== selectedBattery) {
        return false;
      }
      if (selectedPortability !== 'all' && item.portability !== selectedPortability) {
        return false;
      }
      return true;
    });
  }, [selectedMajor, selectedOS, selectedBudget, selectedBattery, selectedPortability]);

  const resetFilters = () => {
    setSelectedMajor('all');
    setSelectedOS('all');
    setSelectedBudget('all');
    setSelectedBattery('all');
    setSelectedPortability('all');
  };

  return (
    <div className="space-y-8">
      {/* Research Methodology & Transparent Notice Banner */}
      <div className="p-6 bg-brand-blue-50 border-2 border-brand-blue-200 rounded-3xl text-navy-800 text-xs sm:text-sm leading-relaxed space-y-2 shadow-soft">
        <div className="flex items-center gap-2 text-brand-blue font-black">
          <span className="text-xl">💻</span>
          <span className="text-base text-brand-navy font-black">How We Structure College Laptop Requirements</span>
        </div>
        <p>
          Rather than publishing arbitrary product rankings, DormReady structures laptop recommendations around <strong>departmental software compatibility</strong>, <strong>academic workload demands</strong>, and <strong>hardware longevity</strong>.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-brand-navy">Filter by Major &amp; Specs</h3>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-brand-blue hover:underline"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Major Filter */}
          <div>
            <label htmlFor="major-filter" className="block text-xs font-bold text-navy-700 mb-1">
              Academic Major
            </label>
            <select
              id="major-filter"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium"
            >
              <option value="all">All Majors ({LAPTOP_PROFILES.length})</option>
              {MAJOR_OPTIONS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Operating System */}
          <div>
            <label htmlFor="os-filter" className="block text-xs font-bold text-navy-700 mb-1">
              Operating System
            </label>
            <select
              id="os-filter"
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium"
            >
              <option value="all">Any OS</option>
              <option value="macOS">macOS (Apple Silicon)</option>
              <option value="Windows">Windows 11 (x86 / ARM)</option>
              <option value="ChromeOS">ChromeOS</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label htmlFor="budget-filter" className="block text-xs font-bold text-navy-700 mb-1">
              Price Range
            </label>
            <select
              id="budget-filter"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium"
            >
              <option value="all">Any Budget</option>
              <option value="budget">Budget (Under $700)</option>
              <option value="midrange">Mid-Tier ($700–$1,200)</option>
              <option value="premium">Pro Tier ($1,200+)</option>
            </select>
          </div>

          {/* Battery Priority */}
          <div>
            <label htmlFor="battery-filter" className="block text-xs font-bold text-navy-700 mb-1">
              Battery Life
            </label>
            <select
              id="battery-filter"
              value={selectedBattery}
              onChange={(e) => setSelectedBattery(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium"
            >
              <option value="all">Any Battery</option>
              <option value="extreme">All-Day (15+ hrs)</option>
              <option value="all_day">Standard (10–14 hrs)</option>
              <option value="standard">Desktop Class (5–8 hrs)</option>
            </select>
          </div>

          {/* Portability */}
          <div>
            <label htmlFor="portability-filter" className="block text-xs font-bold text-navy-700 mb-1">
              Weight &amp; Size
            </label>
            <select
              id="portability-filter"
              value={selectedPortability}
              onChange={(e) => setSelectedPortability(e.target.value as any)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue font-medium"
            >
              <option value="all">Any Weight</option>
              <option value="ultralight">Under 3.0 lbs</option>
              <option value="compact">3.0 to 4.0 lbs</option>
              <option value="desktop_replacement">4.5+ lbs (Power Rig)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Laptop Profiles Grid */}
      {filteredLaptops.length === 0 ? (
        <div className="p-12 text-center bg-white border-2 border-dashed border-slate-300 rounded-3xl space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-blue-50 flex items-center justify-center text-3xl">
            💻
          </div>
          <h3 className="text-lg font-black text-brand-navy">No hardware profiles match your criteria</h3>
          <p className="text-xs sm:text-sm text-navy-600 max-w-sm mx-auto">
            Try expanding your budget tier or switching between macOS and Windows.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-bold hover:bg-brand-blue-600 transition-all shadow-sm"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLaptops.map((laptop) => (
            <div
              key={laptop.id}
              className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="badge-blue">
                    {laptop.os}
                  </span>
                  <span className="text-xs font-bold text-navy-900 bg-slate-100 px-3 py-1 rounded-full">
                    {laptop.estimatedPriceRange}
                  </span>
                </div>

                <h4 className="text-xl font-black text-brand-navy mb-1">{laptop.name}</h4>
                <p className="text-xs font-semibold text-brand-coral mb-3">{laptop.editorialStatus}</p>
                <p className="text-xs sm:text-sm text-navy-700 leading-relaxed mb-4">{laptop.whyItFits}</p>

                {/* Specs Box */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-navy-800 mb-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-navy-500">CPU / Platform:</span>
                    <span className="font-semibold text-right">{laptop.recommendedSpecs.cpu}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-navy-500">Memory:</span>
                    <span className="font-semibold">{laptop.recommendedSpecs.ram}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-navy-500">Storage:</span>
                    <span className="font-semibold">{laptop.recommendedSpecs.storage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-navy-500">Display:</span>
                    <span className="font-semibold">{laptop.recommendedSpecs.display} ({laptop.screenSize})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-navy-500">Est. Weight:</span>
                    <span className="font-semibold">{laptop.weightEst}</span>
                  </div>
                </div>

                {laptop.departmentWarning && (
                  <p className="text-xs text-rose-950 bg-brand-coral-50 p-2.5 rounded-xl border border-brand-coral-200 mb-4 font-semibold">
                    ⚠️ {laptop.departmentWarning}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-navy-600">
                <span>Majors: {laptop.targetMajor.join(', ')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
