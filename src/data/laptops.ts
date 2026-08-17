export type LaptopOS = 'macOS' | 'Windows' | 'ChromeOS';
export type LaptopBudgetTier = 'budget' | 'midrange' | 'premium';
export type MajorCategory = 'general_humanities' | 'stem_engineering' | 'business_finance' | 'design_media' | 'computer_science';
export type BatteryPriority = 'standard' | 'all_day' | 'extreme';
export type PortabilityRating = 'ultralight' | 'compact' | 'desktop_replacement';

export interface LaptopProfile {
  id: string;
  name: string;
  isPlaceholder: boolean;
  editorialStatus: string;
  targetMajor: MajorCategory[];
  os: LaptopOS;
  budgetTier: LaptopBudgetTier;
  estimatedPriceRange: string;
  batteryPriority: BatteryPriority;
  portability: PortabilityRating;
  screenSize: string;
  weightEst: string;
  recommendedSpecs: {
    cpu: string;
    ram: string;
    storage: string;
    display: string;
  };
  whyItFits: string;
  pros: string[];
  cons: string[];
  departmentWarning?: string;
  researchChecklist: string[];
}

export const MAJOR_OPTIONS: { key: MajorCategory; label: string; description: string }[] = [
  { key: 'general_humanities', label: 'General / Humanities / Social Sciences', description: 'Heavy reading, essay drafting, web research, PDF annotation, lightweight multitasking.' },
  { key: 'stem_engineering', label: 'Engineering & Physical Sciences (CAD/MATLAB)', description: 'Requires Windows-compatible x86 hardware or dedicated GPU for SolidWorks, AutoCAD, ANSYS.' },
  { key: 'computer_science', label: 'Computer Science & Software Engineering', description: 'Requires 16GB+ RAM, Unix terminal environment (macOS/Linux/WSL2), fast compile times.' },
  { key: 'business_finance', label: 'Business, Economics & Finance', description: 'Intensive Excel modeling, PowerBI, full Windows Excel plugin compatibility.' },
  { key: 'design_media', label: 'Digital Design, Film & Architecture', description: 'Color-accurate display (100% sRGB/DCI-P3), GPU acceleration for Premiere/Blender.' },
];

export const LAPTOP_PROFILES: LaptopProfile[] = [
  {
    id: 'laptop-profile-macbook',
    name: 'Category A: Ultraportable macOS Reference Profile (e.g. MacBook Air Class)',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION TARGET — Reference Model for College Research',
    targetMajor: ['general_humanities', 'computer_science', 'business_finance', 'design_media'],
    os: 'macOS',
    budgetTier: 'midrange',
    estimatedPriceRange: '$999 – $1,299 (Education Pricing Range)',
    batteryPriority: 'extreme',
    portability: 'ultralight',
    screenSize: '13.6" / 15.3"',
    weightEst: '2.7 – 3.3 lbs',
    recommendedSpecs: {
      cpu: 'Apple Silicon M-Series (M2/M3/M4 Baseline)',
      ram: '16GB Unified Memory (Recommended baseline for 4-year longevity)',
      storage: '512GB SSD',
      display: 'Liquid Retina, 500 nits, P3 Wide Color',
    },
    whyItFits: 'Targeted for all-day classroom battery endurance without needing to carry a power adapter. Silent fanless operation and durable aluminum construction.',
    pros: [
      'Strong energy efficiency during lecture note-taking and study sessions',
      'Solid physical construction and high resale value',
      'Native Unix terminal environment for Computer Science coursework',
    ],
    cons: [
      'Cannot run certain Windows-only engineering applications (e.g. SolidWorks) natively',
      'Unified memory and internal storage are fixed at time of purchase',
    ],
    departmentWarning: 'Check with your academic department: Engineering colleges frequently specify Windows x86 hardware for specialized CAD packages.',
    researchChecklist: [
      'Verify base RAM configuration in the current shipping model year',
      'Check university IT compatibility for campus Wi-Fi and VPN security certificates',
      'Confirm current education store pricing through Apple Education before buying',
    ],
  },
  {
    id: 'laptop-profile-windows-ultrabook',
    name: 'Category B: Thin & Light Windows Student Profile (e.g. XPS / ThinkPad / Yoga Class)',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION TARGET — Reference Model for College Research',
    targetMajor: ['business_finance', 'general_humanities', 'computer_science', 'stem_engineering'],
    os: 'Windows',
    budgetTier: 'midrange',
    estimatedPriceRange: '$799 – $1,199',
    batteryPriority: 'all_day',
    portability: 'ultralight',
    screenSize: '14.0"',
    weightEst: '2.8 – 3.1 lbs',
    recommendedSpecs: {
      cpu: 'Intel Core Ultra / AMD Ryzen 7 / Snapdragon X Plus',
      ram: '16GB DDR5 / LPDDR5X',
      storage: '512GB – 1TB PCIe NVMe SSD',
      display: '1920x1200 or 2.8K OLED / IPS, Anti-Glare',
    },
    whyItFits: 'Broad compatibility with university testing platforms (e.g. LockDown Browser), finance plugins, and general laboratory software.',
    pros: [
      'Broad compatibility with university proctoring tools and specialized software',
      'Varied port options (USB-A, HDMI, USB-C) reducing need for adapters',
      'Replaceable / serviceable M.2 NVMe storage on many models',
    ],
    cons: [
      'Battery endurance varies significantly across processor generations',
      'Trackpad and display quality varies across manufacturers',
    ],
    departmentWarning: 'ARM-based Windows laptops may have emulation caveats with older proctoring software; verify with your campus IT desk.',
    researchChecklist: [
      'Check manufacturer battery capacity rating (54Wh+ recommended)',
      'Confirm keyboard ergonomics for long document drafting sessions',
    ],
  },
  {
    id: 'laptop-profile-budget',
    name: 'Category C: Value-Focused Student Laptop Profile (e.g. Inspiron / IdeaPad Class)',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION TARGET — Reference Model for College Research',
    targetMajor: ['general_humanities'],
    os: 'Windows',
    budgetTier: 'budget',
    estimatedPriceRange: '$399 – $649',
    batteryPriority: 'standard',
    portability: 'compact',
    screenSize: '14.0" – 15.6"',
    weightEst: '3.5 – 3.9 lbs',
    recommendedSpecs: {
      cpu: 'AMD Ryzen 5 / Intel Core i5 (Modern 4-6 Core)',
      ram: '8GB – 16GB RAM',
      storage: '256GB – 512GB SSD',
      display: '1080p FHD IPS (Avoid TN panels)',
    },
    whyItFits: 'Affordable entry point for general coursework, web-based Learning Management Systems (Canvas/Blackboard), and paper writing.',
    pros: [
      'Low upfront financial cost for budget-conscious students',
      'Sufficient performance for web research, streaming, and Office 365',
    ],
    cons: [
      'Plastic chassis requires careful handling in a padded sleeve',
      'Lower screen brightness (typically 250 nits) is less suitable for bright outdoor areas',
    ],
    researchChecklist: [
      'Verify display panel type is IPS rather than low-contrast TN',
      'Check whether RAM is upgradable or soldered',
    ],
  },
  {
    id: 'laptop-profile-workstation',
    name: 'Category D: STEM & Engineering Workstation Profile (e.g. Legion / Precision / ROG Class)',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION TARGET — Reference Model for College Research',
    targetMajor: ['stem_engineering', 'design_media', 'computer_science'],
    os: 'Windows',
    budgetTier: 'premium',
    estimatedPriceRange: '$1,299 – $1,899',
    batteryPriority: 'standard',
    portability: 'desktop_replacement',
    screenSize: '15.6" – 16.0"',
    weightEst: '4.2 – 4.8 lbs',
    recommendedSpecs: {
      cpu: 'Intel Core i7/Ultra 7 or AMD Ryzen 7/9 H-Series',
      ram: '32GB DDR5 RAM',
      storage: '1TB PCIe 4.0 SSD',
      display: '16" 2560x1600 IPS / OLED, 100% sRGB',
    },
    whyItFits: 'Dedicated GPU (NVIDIA RTX series) supports 3D CAD modeling, numerical simulation, and video rendering workloads.',
    pros: [
      'High computing power for mechanical engineering, simulation, and 3D rendering',
      'Expandable RAM slots and multiple SSD storage bays on most models',
    ],
    cons: [
      'Heavier overall weight and larger power adapter in backpack',
      'Battery endurance during intensive compute workloads is limited',
    ],
    departmentWarning: 'Most engineering colleges publish specific minimum GPU and RAM requirements in early summer; always consult their specific spec sheet before buying.',
    researchChecklist: [
      'Confirm university engineering hardware guidelines for your incoming academic class',
      'Review manufacturer thermal performance and cooling under load',
    ],
  },
];
