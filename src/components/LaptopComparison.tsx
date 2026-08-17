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
      <div className="p-5 sm:p-6 bg-cream-100 border border-cream-300 rounded-2xl text-navy-800 text-sm leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-forest-800 font-bold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-base text-navy-900">How We Structure College Laptop Requirements</span>
        </div>
        <p>
          Unlike generic review websites that fabricate benchmarks or push affiliate kickbacks, DormReady evaluates laptops through <strong>departmental software compatibility</strong>, <strong>battery longevity during 8-hour classroom days</strong>, and <strong>repairability</strong>.
        </p>
        <p className="text-xs text-navy-600">
          *Note: The hardware entries below are <em>structured specification reference profiles</em> designed to guide your university shopping. Always check your university department's mandatory spec sheet before purchasing.
        </p>
      </div>

      {/* Interactive Filter Matrix */}
      <div className="bg-white border border-cream-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-900">Filter by Your College Requirements</h2>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-forest-800 hover:text-forest-900 underline"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Major / Field of Study */}
          <div>
            <label htmlFor="major-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Field of Study / Major
            </label>
            <select
              id="major-select"
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">All Majors / General Use</option>
              {MAJOR_OPTIONS.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* Operating System */}
          <div>
            <label htmlFor="os-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Operating System
            </label>
            <select
              id="os-select"
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">Any Operating System</option>
              <option value="macOS">macOS (Apple Silicon)</option>
              <option value="Windows">Windows 11</option>
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label htmlFor="budget-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Budget Range
            </label>
            <select
              id="budget-select"
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">Any Budget Tier</option>
              <option value="budget">Budget ($399 - $649)</option>
              <option value="midrange">Mid-Range ($799 - $1,299)</option>
              <option value="premium">Engineering Workstation ($1,300+)</option>
            </select>
          </div>

          {/* Battery Priority */}
          <div>
            <label htmlFor="battery-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Battery Endurance
            </label>
            <select
              id="battery-select"
              value={selectedBattery}
              onChange={(e) => setSelectedBattery(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">Any Battery Endurance</option>
              <option value="all_day">All-Day Class Life (8-12 hrs)</option>
              <option value="extreme">Extreme Efficiency (14+ hrs)</option>
              <option value="standard">Standard (4-8 hrs / plugged-in workstation)</option>
            </select>
          </div>

          {/* Portability */}
          <div>
            <label htmlFor="portability-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Portability / Weight
            </label>
            <select
              id="portability-select"
              value={selectedPortability}
              onChange={(e) => setSelectedPortability(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">Any Form Factor</option>
              <option value="ultralight">Ultralight (&lt; 3.0 lbs)</option>
              <option value="compact">Compact (3.0 - 3.9 lbs)</option>
              <option value="desktop_replacement">Desktop Replacement (4.0+ lbs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm font-semibold text-navy-700">
        Showing {filteredLaptops.length} specification profile{filteredLaptops.length === 1 ? '' : 's'}
      </div>

      {/* Laptop Profiles List */}
      <div className="space-y-8">
        {filteredLaptops.map((profile) => (
          <article
            key={profile.id}
            className="bg-white border border-cream-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
          >
            {/* Header & Badges */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  {profile.editorialStatus}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cream-200 text-navy-800">
                  OS: {profile.os}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-100">
                  Est: {profile.estimatedPriceRange}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-navy-900 font-sans">
                {profile.name}
              </h3>
              <p className="mt-2 text-sm text-navy-700 leading-relaxed font-medium">
                {profile.whyItFits}
              </p>
            </div>

            {/* Spec Matrix Table */}
            <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-navy-700 mb-3">Recommended Target Hardware Configuration</h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <dt className="font-semibold text-navy-500">Processor (CPU)</dt>
                  <dd className="font-medium text-navy-900 mt-0.5">{profile.recommendedSpecs.cpu}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-500">Memory (RAM)</dt>
                  <dd className="font-medium text-navy-900 mt-0.5">{profile.recommendedSpecs.ram}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-500">Internal Storage</dt>
                  <dd className="font-medium text-navy-900 mt-0.5">{profile.recommendedSpecs.storage}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-navy-500">Display & Panel</dt>
                  <dd className="font-medium text-navy-900 mt-0.5">{profile.recommendedSpecs.display}</dd>
                </div>
              </dl>
            </div>

            {/* Department Warning if applicable */}
            {profile.departmentWarning && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs sm:text-sm text-amber-950 flex items-start gap-2">
                <span className="font-bold text-amber-800">⚠️</span>
                <span><strong>Department Policy Notice:</strong> {profile.departmentWarning}</span>
              </div>
            )}

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <h4 className="font-bold text-emerald-950 mb-2">Key Advantages</h4>
                <ul className="space-y-1.5 list-disc list-inside text-emerald-900">
                  {profile.pros.map((pro, idx) => (
                    <li key={idx}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl">
                <h4 className="font-bold text-rose-950 mb-2">Trade-offs & Limitations</h4>
                <ul className="space-y-1.5 list-disc list-inside text-rose-900">
                  {profile.cons.map((con, idx) => (
                    <li key={idx}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Research Checklist */}
            <div className="pt-4 border-t border-cream-200 text-xs text-navy-600">
              <span className="font-bold text-navy-800 block mb-1">Our Testing & Verification Criteria:</span>
              <ul className="space-y-0.5 list-disc list-inside">
                {profile.researchChecklist.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
