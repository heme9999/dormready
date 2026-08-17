import { useState, useMemo } from 'react';
import {
  STUDENT_DISCOUNTS,
  DISCOUNT_CATEGORIES,
  type DiscountCategory,
  type VerificationStatus,
} from '../data/discounts';

export default function DiscountDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<DiscountCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDiscounts = useMemo(() => {
    return STUDENT_DISCOUNTS.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedStatus !== 'all' && item.verificationStatus !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesHeadline = item.offerSummary.toLowerCase().includes(q);
        const matchesDesc = item.discountDescription.toLowerCase().includes(q);
        if (!matchesBrand && !matchesHeadline && !matchesDesc) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedStatus, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Verification Transparency Notice */}
      <div className="p-5 sm:p-6 bg-cream-100 border border-cream-300 rounded-2xl text-sm leading-relaxed space-y-2 text-navy-800">
        <h2 className="text-base font-bold text-navy-900 flex items-center gap-2">
          <span>🛡️</span>
          <span>DormReady Student Discount Verification Policy</span>
        </h2>
        <p>
          Unlike aggregators that publish unverified coupon codes, DormReady strictly records the <strong>official verification provider (SheerID, UNiDAYS, or institution .edu address)</strong>, required documentation, and direct official merchant links.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-cream-300 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Search Box */}
          <div>
            <label htmlFor="discount-search" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Search Discounts
            </label>
            <input
              id="discount-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. GitHub, Apple, Spotify..."
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="discount-cat-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Category
            </label>
            <select
              id="discount-cat-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">All Categories ({STUDENT_DISCOUNTS.length})</option>
              {DISCOUNT_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label htmlFor="status-select" className="block text-xs font-bold uppercase tracking-wider text-navy-700 mb-1">
              Verification Status
            </label>
            <select
              id="status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-cream-50 border border-cream-300 rounded-lg focus:border-forest-800 focus:outline-none"
            >
              <option value="all">All Verified Offers</option>
              <option value="verified">Officially Verified</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDiscounts.map((disc) => {
          return (
            <article
              key={disc.id}
              className="flex flex-col bg-white border border-cream-300 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-forest-700/50 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-navy-500 block">
                    {disc.category}
                  </span>
                  <h3 className="text-xl font-bold text-navy-900 font-sans mt-0.5">
                    {disc.brand}
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shrink-0">
                  <svg className="w-3.5 h-3.5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Verified
                </span>
              </div>

              {/* Headline & Description */}
              <h4 className="text-sm font-semibold text-forest-900 mb-1">
                {disc.offerSummary}
              </h4>
              <p className="text-xs font-bold text-navy-800 mb-2">
                Rate: {disc.priceOrDiscount}
              </p>
              <p className="text-sm text-navy-700 leading-relaxed mb-4 flex-1">
                {disc.discountDescription}
              </p>

              {/* Offer Details Grid */}
              <div className="p-3.5 bg-cream-50 rounded-xl border border-cream-200 text-xs space-y-2 mb-4">
                <div>
                  <span className="font-bold text-navy-800">Eligibility:</span>{' '}
                  <span className="text-navy-600">{disc.eligibilitySummary}</span>
                </div>
                <div>
                  <span className="font-bold text-navy-800">Verification Platform:</span>{' '}
                  <span className="px-2 py-0.5 rounded bg-cream-200 text-navy-900 font-medium inline-block">
                    {disc.verificationMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between text-navy-500 pt-1 border-t border-cream-200">
                  <span>Last audited: <time dateTime={disc.checkedAt}>{disc.checkedAt}</time></span>
                  {disc.expirationDate && <span>Expires: {disc.expirationDate}</span>}
                </div>
              </div>

              {disc.notes && (
                <p className="text-xs text-navy-500 italic mb-4">
                  ℹ️ {disc.notes}
                </p>
              )}

              {/* Action Link */}
              <div className="mt-auto pt-3 border-t border-cream-200 flex items-center justify-between">
                <a
                  href={disc.officialSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-900 group"
                >
                  <span>Visit Official Offer Page</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <span className="text-[11px] text-navy-400">Official Source</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
