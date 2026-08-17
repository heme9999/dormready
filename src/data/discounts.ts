export type DiscountCategory = 'software' | 'hardware' | 'streaming' | 'retail' | 'services' | 'news';
export type VerificationStatus = 'verified' | 'needs_research' | 'seasonal';

export interface StudentDiscount {
  id: string;
  brand: string;
  category: DiscountCategory;
  headline: string;
  discountDescription: string;
  eligibility: string;
  verificationMethod: 'UNiDAYS' | 'SheerID' | 'Student Beans' | '.edu Email' | 'In-store ID' | 'Pending Verification';
  lastCheckedDate: string;
  expirationDate?: string;
  officialSourceUrl: string;
  verificationStatus: VerificationStatus;
  notes?: string;
}

export const DISCOUNT_CATEGORIES: { key: DiscountCategory; label: string }[] = [
  { key: 'software', label: 'Software & Productivity' },
  { key: 'hardware', label: 'Hardware & Tech' },
  { key: 'streaming', label: 'Streaming & Music' },
  { key: 'retail', label: 'Apparel & Retail' },
  { key: 'services', label: 'Travel & Services' },
  { key: 'news', label: 'News & Publishing' },
];

export const STUDENT_DISCOUNTS: StudentDiscount[] = [
  {
    id: 'disc-1',
    brand: 'GitHub Student Developer Pack',
    category: 'software',
    headline: 'Free developer tools, domain credits, and cloud compute',
    discountDescription: 'Free GitHub Pro while a student, plus free tools from JetBrains, Namecheap, DigitalOcean, and more.',
    eligibility: 'Higher education students aged 13+ with school-issued email or enrollment proof.',
    verificationMethod: '.edu Email',
    lastCheckedDate: '2026-08-10',
    officialSourceUrl: 'https://education.github.com/pack',
    verificationStatus: 'verified',
    notes: 'Requires authenticating through GitHub Education with proof of current enrollment (transcript or student ID).',
  },
  {
    id: 'disc-2',
    brand: 'Spotify + Hulu + Showtime Student Bundle',
    category: 'streaming',
    headline: 'Discounted Premium music and streaming tier',
    discountDescription: 'Special monthly student rate for Spotify Premium with ad-supported Hulu.',
    eligibility: 'Enrolled students at accredited Title IV U.S. colleges/universities.',
    verificationMethod: 'SheerID',
    lastCheckedDate: '2026-08-12',
    officialSourceUrl: 'https://www.spotify.com/us/student/',
    verificationStatus: 'verified',
    notes: 'Renewable up to 4 consecutive years with annual SheerID re-verification.',
  },
  {
    id: 'disc-3',
    brand: 'Apple Education Store Pricing',
    category: 'hardware',
    headline: 'Education discount on Mac, iPad, and AppleCare+',
    discountDescription: 'Special pricing on Mac and iPad purchases for newly accepted/current college students and parents.',
    eligibility: 'Current and newly accepted college students, parents buying for students, faculty, and staff.',
    verificationMethod: 'UNiDAYS',
    lastCheckedDate: '2026-08-11',
    officialSourceUrl: 'https://www.apple.com/us-edu/store',
    verificationStatus: 'verified',
    notes: 'Seasonal summer promotion (gift card / free accessories) occurs annually between June and September.',
  },
  {
    id: 'disc-4',
    brand: 'Adobe Creative Cloud for Students',
    category: 'software',
    headline: 'Discounted All Apps plan (over 60% standard rate)',
    discountDescription: 'Access to Photoshop, Illustrator, Premiere Pro, and the complete Adobe suite.',
    eligibility: 'Students aged 13+ enrolled in accredited higher education institutions.',
    verificationMethod: '.edu Email',
    lastCheckedDate: '2026-08-08',
    officialSourceUrl: 'https://www.adobe.com/creativecloud/buy/students.html',
    verificationStatus: 'verified',
    notes: 'Promotional intro rate increases slightly in second and subsequent years; verify recurring cost.',
  },
  {
    id: 'disc-5',
    brand: 'Amazon Prime Student',
    category: 'services',
    headline: '6-Month Trial followed by 50% discount on Prime membership',
    discountDescription: 'Free two-day shipping, Prime Video, and exclusive student grocery & textbook perks.',
    eligibility: 'College students enrolled in at least one course at a 2- or 4-year accredited U.S. college.',
    verificationMethod: '.edu Email',
    lastCheckedDate: '2026-08-09',
    officialSourceUrl: 'https://www.amazon.com/student',
    verificationStatus: 'verified',
    notes: 'Requires providing expected graduation year and active student status verification.',
  },
  {
    id: 'disc-6',
    brand: 'The New York Times Student Subscription',
    category: 'news',
    headline: 'Deeply discounted digital access for academic research',
    discountDescription: '$1/week or special institutional rate with unlimited digital article access.',
    eligibility: 'Enrolled students at eligible colleges.',
    verificationMethod: 'SheerID',
    lastCheckedDate: '2026-08-05',
    officialSourceUrl: 'https://www.nytimes.com/subscription/education/student',
    verificationStatus: 'verified',
    notes: 'Many campus libraries provide 100% free institutional access—check with your university library first.',
  },
  {
    id: 'disc-7',
    brand: 'Sample Retailer Back-to-School Offer [Sample Record]',
    category: 'retail',
    headline: 'Sample unverified 15% in-store student discount placeholder',
    discountDescription: 'Placeholder listing demonstrating our verification criteria and data structure.',
    eligibility: 'Current undergraduate and graduate students with active physical ID card.',
    verificationMethod: 'Pending Verification',
    lastCheckedDate: '2026-08-01',
    officialSourceUrl: 'https://example.com/student-offer',
    verificationStatus: 'needs_research',
    notes: 'EDITORIAL NOTICE: This entry is a placeholder for research pipeline testing. Do not rely on this discount until verified with merchant documentation.',
  },
  {
    id: 'disc-8',
    brand: 'Sample Transit Rail Card [Sample Record]',
    category: 'services',
    headline: 'Sample regional student rail discount placeholder',
    discountDescription: 'Demonstration record for regional student transit and travel passes.',
    eligibility: 'Full-time matriculated students.',
    verificationMethod: 'Pending Verification',
    lastCheckedDate: '2026-08-01',
    officialSourceUrl: 'https://example.com/transit-pass',
    verificationStatus: 'needs_research',
    notes: 'EDITORIAL NOTICE: Pending verification of current academic term transit pass policies across regional operators.',
  },
];
