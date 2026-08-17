import type { StudentDiscount, DiscountCategory, VerificationStatus } from '../data/discounts';

export interface FilterStudentDiscountsOptions {
  query?: string;
  category?: DiscountCategory | 'all';
  status?: VerificationStatus | 'all';
}

/**
 * Pure search and filtering function for the student discount directory.
 * Supports case-insensitive multi-word AND search across brand, summaries, description, eligibility, and notes.
 */
export function filterStudentDiscounts(
  items: StudentDiscount[],
  options: FilterStudentDiscountsOptions = {}
): StudentDiscount[] {
  const { query = '', category = 'all', status = 'all' } = options;

  const normalizedTokens = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);

  return items.filter((item) => {
    // 1. Category filter
    if (category !== 'all' && item.category !== category) {
      return false;
    }

    // 2. Status filter
    if (status !== 'all' && item.verificationStatus !== status) {
      return false;
    }

    // 3. Multi-word search with AND semantics
    if (normalizedTokens.length > 0) {
      const searchableBlob = [
        item.brand,
        item.offerSummary,
        item.discountDescription,
        item.eligibilitySummary,
        item.notes || '',
      ]
        .join(' ')
        .toLowerCase();

      const allTokensMatch = normalizedTokens.every((token) => searchableBlob.includes(token));
      if (!allTokensMatch) {
        return false;
      }
    }

    return true;
  });
}
