import { useState, useMemo } from 'react';
import {
  STUDENT_DISCOUNTS,
  DISCOUNT_CATEGORIES,
  type DiscountCategory,
  type VerificationStatus,
} from '../data/discounts';
import { filterStudentDiscounts } from '../lib/discountFilter';

export default function DiscountDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<DiscountCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category counts calculated dynamically from dataset
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: STUDENT_DISCOUNTS.length };
    for (const cat of DISCOUNT_CATEGORIES) {
      counts[cat.key] = STUDENT_DISCOUNTS.filter((d) => d.category === cat.key).length;
    }
    return counts;
  }, []);

  const filteredDiscounts = useMemo(() => {
    return filterStudentDiscounts(STUDENT_DISCOUNTS, {
      query: searchQuery,
      category: selectedCategory,
      status: selectedStatus,
    });
  }, [selectedCategory, selectedStatus, searchQuery]);

  const selectedCategoryLabel = useMemo(() => {
    if (selectedCategory === 'all') return 'all categories';
    const found = DISCOUNT_CATEGORIES.find((c) => c.key === selectedCategory);
    return found ? found.label : selectedCategory;
  }, [selectedCategory]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleShowAllCategories = () => {
    setSelectedCategory('all');
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  const trimmedQuery = searchQuery.trim();

  return (
    <div className="space-y-8">
      {/* Verification Transparency Notice */}
      <div className="p-6 bg-brand-coral-50 border-2 border-brand-coral-200 rounded-3xl text-xs sm:text-sm leading-relaxed space-y-2 text-rose-950 shadow-soft">
        <h2 className="text-base font-black text-rose-950 flex items-center gap-2">
          <span>🛡️</span>
          <span>DormReady Student Discount Verification Policy</span>
        </h2>
        <p>
          Each listing is checked against an official merchant or support page. Verification methods and eligibility requirements vary by provider (including UNiDAYS, SheerID, Student Beans, and direct institutional email).
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 sm:p-6 shadow-soft space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Box */}
          <div>
            <label htmlFor="discount-search" className="block text-xs font-bold text-navy-700 mb-1">
              Search Discounts
            </label>
            <input
              id="discount-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Apple Music, YouTube, Spotify..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-brand-blue focus:outline-none transition-colors"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="discount-cat-select" className="block text-xs font-bold text-navy-700 mb-1">
              Category
            </label>
            <select
              id="discount-cat-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DiscountCategory | 'all')}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-brand-blue focus:outline-none font-medium transition-colors"
            >
              <option value="all">All Categories ({categoryCounts['all']})</option>
              {DISCOUNT_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label} ({categoryCounts[c.key] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label htmlFor="status-select" className="block text-xs font-bold text-navy-700 mb-1">
              Verification Status
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as VerificationStatus | 'all')}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border-2 border-slate-200 rounded-xl focus:border-brand-blue focus:outline-none font-medium transition-colors"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Officially Verified</option>
              <option value="needs_research">Needs Research</option>
              <option value="seasonal">Seasonal</option>
            </select>
          </div>
        </div>

        {/* Results Feedback Counter */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-navy-600">
          <div>
            <span>Showing {filteredDiscounts.length} of {STUDENT_DISCOUNTS.length} offers</span>
            {trimmedQuery !== '' && (
              <span className="text-brand-navy font-bold"> • Results for &ldquo;{trimmedQuery}&rdquo;</span>
            )}
          </div>
          {(trimmedQuery !== '' || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={handleClearAllFilters}
              className="text-xs text-brand-blue hover:text-brand-blue-700 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Live Region */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="space-y-6"
      >
        {filteredDiscounts.length === 0 ? (
          /* Zero Results State Card */
          <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-soft">
            <div className="w-16 h-16 bg-slate-100 text-3xl rounded-full flex items-center justify-center mx-auto">
              🔍
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                No student discount listings match these filters
              </h3>
              <p className="text-xs sm:text-sm text-navy-600 leading-relaxed">
                {trimmedQuery !== '' ? (
                  <>
                    We do not currently have a listing matching &ldquo;<strong>{trimmedQuery}</strong>&rdquo; within <strong>{selectedCategoryLabel}</strong>. Try all categories or clear the active filters.
                  </>
                ) : (
                  <>
                    No listings currently match the active filters within <strong>{selectedCategoryLabel}</strong>. Try clearing filters to see all available student deals.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {trimmedQuery !== '' && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-brand-navy font-bold text-xs hover:bg-slate-50 transition-all shadow-xs cursor-pointer min-h-[40px]"
                >
                  Clear Search
                </button>
              )}
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={handleShowAllCategories}
                  className="px-4 py-2 rounded-xl bg-white border-2 border-slate-200 text-brand-navy font-bold text-xs hover:bg-slate-50 transition-all shadow-xs cursor-pointer min-h-[40px]"
                >
                  Show All Categories
                </button>
              )}
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="px-4 py-2 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-blue-600 transition-all shadow-xs cursor-pointer min-h-[40px]"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          /* Discounts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDiscounts.map((disc) => {
              return (
                <article
                  key={disc.id}
                  className="flex flex-col bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-soft hover:shadow-soft-hover transition-all duration-200 hover:-translate-y-1 justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-brand-blue block">
                          {disc.category}
                        </span>
                        <h3 className="text-xl font-black text-brand-navy font-sans mt-0.5">
                          {disc.brand}
                        </h3>
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-mint-50 text-brand-mint-700 border border-brand-mint-200 shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Audited
                      </span>
                    </div>

                    {/* Headline & Description */}
                    <h4 className="text-sm font-bold text-brand-coral mb-1">
                      {disc.offerSummary}
                    </h4>
                    <p className="text-xs font-black text-brand-navy mb-2">
                      Rate: {disc.priceOrDiscount}
                    </p>
                    <p className="text-xs sm:text-sm text-navy-700 leading-relaxed mb-4">
                      {disc.discountDescription}
                    </p>

                    {/* Offer Details Grid */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2 mb-4">
                      <div>
                        <span className="font-bold text-navy-800">Eligibility:</span>{' '}
                        <span className="text-navy-600">{disc.eligibilitySummary}</span>
                      </div>
                      <div>
                        <span className="font-bold text-navy-800">Verification:</span>{' '}
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-navy-900 font-bold inline-block">
                          {disc.verificationMethod}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-navy-500 pt-1 border-t border-slate-200 text-[11px]">
                        <span>Checked: <time dateTime={disc.checkedAt}>{disc.checkedAt}</time></span>
                        {disc.expirationDate && <span>Expires: {disc.expirationDate}</span>}
                      </div>
                    </div>

                    {disc.notes && (
                      <p className="text-xs text-navy-600 italic mb-4 bg-brand-yellow-50 p-2.5 rounded-xl border border-brand-yellow-200">
                        ℹ️ {disc.notes}
                      </p>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={disc.officialSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-brand-blue-700 group"
                    >
                      <span>Visit Official Offer Page</span>
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <span className="text-[10px] font-semibold text-navy-400">Official Merchant</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
