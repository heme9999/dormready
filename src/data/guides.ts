export interface GuideMeta {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: 'checklists' | 'packing' | 'tech' | 'budget' | 'discounts' | 'roommate';
  categoryLabel: string;
  lastUpdated: string;
  readingTimeMinutes: number;
  featured?: boolean;
  budgetCap?: number;
  summaryPoints: string[];
}

export const EDITORIAL_GUIDES: GuideMeta[] = [
  {
    slug: 'college-dorm-checklist',
    href: '/college-dorm-checklist/',
    title: 'The Master College Dorm Checklist: Category-by-Category Guide',
    description: 'An interactive, comprehensive checklist covering all 10 dorm categories with printable progress, local browser storage, and prohibited item warnings.',
    category: 'checklists',
    categoryLabel: 'Interactive Checklist',
    lastUpdated: '2026-08-15',
    readingTimeMinutes: 8,
    featured: true,
    summaryPoints: [
      'Interactive item tracking saved to local browser storage',
      'Filterable by essential baseline vs optional comfort items',
      'Clear residence hall safety and prohibited item indicators',
      'One-click print-friendly version for shopping trips',
    ],
  },
  {
    slug: 'college-packing-list',
    href: '/college-packing-list/',
    title: 'Strategic College Packing List: What to Bring, Buy There & Leave Behind',
    description: 'Practical packing logic for freshmen: carry-on move-in essentials, roommate coordination guidelines, and items you should buy after arriving on campus.',
    category: 'packing',
    categoryLabel: 'Packing Strategy',
    lastUpdated: '2026-08-14',
    readingTimeMinutes: 10,
    featured: true,
    summaryPoints: [
      'The 5-layer packing system from carry-on to long-term storage',
      'Items to purchase in your college town rather than haul across state lines',
      'Roommate pre-arrival checklist to avoid duplicate microwave and fridge purchases',
      'Top 7 items freshmen consistently regret bringing',
    ],
  },
  {
    slug: 'dorm-room-essentials',
    href: '/dorm-room-essentials/',
    title: 'Dorm Room Essentials Organized by Real Daily Need',
    description: 'A realistic, practical room setup guide focusing on sleep hygiene, study ergonomics, and functional storage rather than aesthetic clutter.',
    category: 'checklists',
    categoryLabel: 'Essentials Guide',
    lastUpdated: '2026-08-12',
    readingTimeMinutes: 9,
    featured: true,
    summaryPoints: [
      'Addressing the Twin XL mattress problem with mattress toppers and encasements',
      'Managing shared bathroom logistics with quick-dry textiles',
      'Power management: surge protector safety vs fire code violations',
      'Under-bed and vertical storage optimization in small doubles',
    ],
  },
  {
    slug: 'best-laptops-for-college-students',
    href: '/best-laptops-for-college-students/',
    title: 'How to Choose a College Laptop: Major-by-Major Guide & Comparison Matrix',
    description: 'Hardware requirements broken down by academic major, battery life realities, operating system compatibility, and research-backed buying criteria.',
    category: 'tech',
    categoryLabel: 'Tech & Hardware',
    lastUpdated: '2026-08-11',
    readingTimeMinutes: 12,
    featured: true,
    summaryPoints: [
      'Interactive filter by major, OS, battery priority, and budget',
      'Mac vs Windows departmental requirements (Engineering vs CS vs Business)',
      'Why 16GB RAM is the new minimum for a 4-year undergraduate lifecycle',
      'Specification reference profiles clearly labeled for 2026 research',
    ],
  },
  {
    slug: 'under-300-dorm-setup',
    href: '/budget/under-300-dorm-setup/',
    title: 'The Under $300 Budget Dorm Setup: Survival Essentials on a Strict Budget',
    description: 'How to get genuine sleep comfort, basic hygiene, and reliable power while spending under $300 total for the entire semester.',
    category: 'budget',
    categoryLabel: 'Budget Guide',
    lastUpdated: '2026-08-10',
    readingTimeMinutes: 7,
    budgetCap: 300,
    featured: true,
    summaryPoints: [
      'Where to spend (mattress comfort & surge safety) vs where to save (stationery & decor)',
      'Zero-cost alternatives utilizing campus resources and library infrastructure',
      'Line-item budget breakdown totaling ~$265',
      'What you can safely delay until month two',
    ],
  },
  {
    slug: 'under-500-dorm-setup',
    href: '/budget/under-500-dorm-setup/',
    title: 'The Under $500 Dorm Setup: Balanced Comfort, Organization & Longevity',
    description: 'The sweet spot for dorm comfort: premium high-density foam topper, full laundry system, multi-port GaN charging, and organized storage.',
    category: 'budget',
    categoryLabel: 'Budget Guide',
    lastUpdated: '2026-08-10',
    readingTimeMinutes: 8,
    budgetCap: 500,
    featured: false,
    summaryPoints: [
      'Line-item breakdown totaling ~$485 with quality-of-life upgrades',
      'High-durability storage containers that survive sophomore move-out',
      'Desk ergonomics and study lighting upgrades',
      'Micro-kitchen starter kit for budget meal prep',
    ],
  },
  {
    slug: 'under-1000-complete-setup',
    href: '/budget/under-1000-complete-setup/',
    title: 'The Under $1,000 Complete Dorm Setup: All-Inclusive Comfort & Workstation',
    description: 'A comprehensive dorm room investment covering shared mini-fridge/microwave contributions, premium noise isolation, active ergonomics, and year-round climate prep.',
    category: 'budget',
    categoryLabel: 'Budget Guide',
    lastUpdated: '2026-08-09',
    readingTimeMinutes: 9,
    budgetCap: 1000,
    featured: false,
    summaryPoints: [
      'Full line-item equipment breakdown totaling ~$940',
      'Noise-cancelling audio and secondary display productivity setup',
      'Room climate control and air filtration within dorm regulations',
      'Split-cost calculations for shared appliances',
    ],
  },
  {
    slug: 'student-discounts',
    href: '/student-discounts/',
    title: 'Verified Student Discounts Directory: Software, Tech, and Services',
    description: 'A transparent directory of student discount programs with required verification platforms, eligibility rules, and explicit research status.',
    category: 'discounts',
    categoryLabel: 'Student Discounts',
    lastUpdated: '2026-08-12',
    readingTimeMinutes: 6,
    featured: true,
    summaryPoints: [
      'Filter discounts by software, hardware, streaming, and services',
      'Clear eligibility criteria and verification methods (UNiDAYS, SheerID, .edu)',
      'Transparent verification audit trail with last checked dates',
      'Free institutional software alternatives via university licensing',
    ],
  },
];
