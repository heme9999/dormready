export type DiscountCategory = 'software' | 'hardware' | 'streaming' | 'retail' | 'services' | 'news';
export type VerificationStatus = 'verified' | 'needs_research' | 'seasonal';

export interface StudentDiscount {
  id: string;
  brand: string;
  category: DiscountCategory;
  offerSummary: string;
  discountDescription: string;
  priceOrDiscount: string;
  eligibilitySummary: string;
  verificationMethod: 'UNiDAYS' | 'SheerID' | 'Student Beans' | '.edu Email' | 'In-store ID' | 'Pending Verification';
  checkedAt: string;
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
    id: 'disc-github',
    brand: 'GitHub Student Developer Pack',
    category: 'software',
    offerSummary: 'Free developer tools, domain vouchers, and cloud credits',
    discountDescription: 'Provides complimentary GitHub Pro while enrolled, along with developer tools from JetBrains, Namecheap, DigitalOcean, and partner companies.',
    priceOrDiscount: '100% Free during enrollment',
    eligibilitySummary: 'Students aged 13+ enrolled in a degree- or diploma-granting course of study with demonstrable student status.',
    verificationMethod: '.edu Email',
    checkedAt: '2026-08-16',
    officialSourceUrl: 'https://education.github.com/pack',
    verificationStatus: 'verified',
    notes: 'Requires uploading student ID, enrollment verification letter, or official transcript if .edu email is unlinked.',
  },
  {
    id: 'disc-spotify',
    brand: 'Spotify Premium Student with Hulu',
    category: 'streaming',
    offerSummary: 'Discounted ad-free Spotify Premium bundled with ad-supported Hulu',
    discountDescription: 'Spotify offers qualifying higher-education students discounted monthly Premium access bundled with Hulu (With Ads).',
    priceOrDiscount: '$5.99/month (Standard rate: $11.99/mo)',
    eligibilitySummary: 'Enrolled students aged 18+ at an accredited Title IV college or university in the United States. Valid for up to 4 years.',
    verificationMethod: 'SheerID',
    checkedAt: '2026-08-16',
    officialSourceUrl: 'https://www.spotify.com/us/student/',
    verificationStatus: 'verified',
    notes: 'Requires annual re-verification through SheerID. Hulu plan is ad-supported and valid only in the U.S.',
  },
  {
    id: 'disc-apple',
    brand: 'Apple Education Store',
    category: 'hardware',
    offerSummary: 'Year-round educational discounts on Mac, iPad, and AppleCare+',
    discountDescription: 'Special pricing on Mac and iPad purchases for college students, newly accepted freshmen, parents buying for students, faculty, and staff.',
    priceOrDiscount: 'Approx. 5% - 10% off retail MSRP',
    eligibilitySummary: 'Current and newly accepted college students, parents purchasing on behalf of students, and university faculty/staff.',
    verificationMethod: 'UNiDAYS',
    checkedAt: '2026-08-16',
    officialSourceUrl: 'https://www.apple.com/us-edu/store',
    verificationStatus: 'verified',
    notes: 'Annual summer promotions (typically June–September) often include promotional gift cards with Mac and iPad purchases.',
  },
  {
    id: 'disc-adobe',
    brand: 'Adobe Creative Cloud for Students',
    category: 'software',
    offerSummary: 'Discounted All Apps plan for Photoshop, Illustrator, and Premiere',
    discountDescription: 'Access to 20+ creative desktop and mobile applications including Photoshop, Acrobat Pro, InDesign, and Premiere Pro.',
    priceOrDiscount: '$19.99/month for year 1 (~60% off standard rate)',
    eligibilitySummary: 'Students aged 13+ enrolled in accredited universities, colleges, or primary/secondary schools.',
    verificationMethod: '.edu Email',
    checkedAt: '2026-08-16',
    officialSourceUrl: 'https://www.adobe.com/creativecloud/buy/students.html',
    verificationStatus: 'verified',
    notes: 'Check with your college IT helpdesk first; many design and engineering schools provide free institutional enterprise licenses.',
  },
  {
    id: 'disc-amazon',
    brand: 'Amazon Prime Student',
    category: 'services',
    offerSummary: '6-month trial followed by 50% discount on Prime membership',
    discountDescription: 'Fast shipping on textbooks and dorm gear, Prime Video streaming, and exclusive student grocery deals.',
    priceOrDiscount: '6-Month Free Trial, then $7.49/month or $69/year',
    eligibilitySummary: 'Students enrolled in at least one college course at an accredited 2-year or 4-year U.S. institution with a valid .edu email.',
    verificationMethod: '.edu Email',
    checkedAt: '2026-08-16',
    officialSourceUrl: 'https://www.amazon.com/student',
    verificationStatus: 'verified',
    notes: 'Valid for up to 4 years or until graduation, whichever comes first.',
  },
  {
    id: 'disc-nytimes',
    brand: 'The New York Times Student Rate',
    category: 'news',
    offerSummary: 'Subsidized digital access for academic research',
    discountDescription: 'Full digital access to NYTimes articles, news archives, and analysis.',
    priceOrDiscount: '$1.00/week ($4/month)',
    eligibilitySummary: 'Enrolled students at eligible higher-education institutions.',
    verificationMethod: 'SheerID',
    checkedAt: '2026-08-16',
    officialSourceUrl: 'https://www.nytimes.com/subscription/education/student',
    verificationStatus: 'verified',
    notes: 'Most university libraries provide 100% free digital access through campus network credentials. Check your library catalog first.',
  },
];
