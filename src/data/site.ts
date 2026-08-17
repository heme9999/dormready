export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

const siteEnv = (typeof process !== 'undefined' && process.env.PUBLIC_SITE_ENV) || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SITE_ENV) || 'preview';
const isProduction = siteEnv === 'production';
const siteUrl = (typeof process !== 'undefined' && process.env.PUBLIC_SITE_URL) || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.PUBLIC_SITE_URL) || (isProduction ? 'https://dormready.org' : 'https://dormready-preview.pages.dev');

export const SITE_CONFIG = {
  name: 'DormReady',
  tagline: 'Practical, honest dorm planning for U.S. college freshmen and families.',
  description: 'Evidence-based dorm checklists, packing strategies, tech buying guides, and verified student discounts. No affiliate fluff, no inflated lists.',
  url: siteUrl,
  env: siteEnv,
  isNoIndex: !isProduction,
  githubRepoUrl: 'https://github.com/heme9999/dormready',
  contactNotice: 'For questions, policy updates, or corrections, submit an issue via our GitHub repository.',
  lastSiteUpdate: '2026-08-17',
  author: {
    name: 'DormReady Editorial Team',
    url: `${siteUrl}/about/`,
  },
  nav: [
    { label: 'Checklist', href: '/college-dorm-checklist/' },
    { label: 'Packing Guide', href: '/college-packing-list/' },
    { label: 'Essentials', href: '/dorm-room-essentials/' },
    { label: 'Laptops', href: '/best-laptops-for-college-students/' },
    { label: 'Budget Setups', href: '/budget/' },
    { label: 'Discounts', href: '/student-discounts/' },
    { label: 'All Guides', href: '/guides/' },
  ] as NavItem[],
  footerNav: {
    essentials: [
      { label: 'Interactive Dorm Checklist', href: '/college-dorm-checklist/' },
      { label: 'College Packing Guide', href: '/college-packing-list/' },
      { label: 'Dorm Room Essentials', href: '/dorm-room-essentials/' },
      { label: 'Best Laptops for Students', href: '/best-laptops-for-college-students/' },
    ],
    budgets: [
      { label: 'Under $300 Dorm Setup', href: '/budget/under-300-dorm-setup/' },
      { label: 'Under $500 Dorm Setup', href: '/budget/under-500-dorm-setup/' },
      { label: 'Under $1,000 Complete Setup', href: '/budget/under-1000-complete-setup/' },
      { label: 'Student Discounts Directory', href: '/student-discounts/' },
    ],
    editorial: [
      { label: 'About DormReady', href: '/about/' },
      { label: 'Editorial Policy & Standards', href: '/editorial-policy/' },
      { label: 'Privacy Policy', href: '/privacy/' },
      { label: 'Terms of Use', href: '/terms/' },
    ],
  },
};
