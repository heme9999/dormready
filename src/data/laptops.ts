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
    id: 'laptop-placeholder-1',
    name: 'Class A: Ultraportable Apple Silicon MacBook Profile [Reference Model]',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION PLACEHOLDER — Pending 2026-2027 Model Testing',
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
    whyItFits: 'Class-leading 15+ hour real-world battery life enables full days on campus without a charger. Silent fanless design and sturdy aluminum chassis.',
    pros: [
      'Exceptional battery efficiency during lecture notes and study sessions',
      'High resale value and durable physical construction',
      'Native Unix terminal environment for CS students',
    ],
    cons: [
      'Cannot run certain Windows-only engineering software natively (e.g., SolidWorks)',
      'RAM and SSD cannot be upgraded after purchase',
    ],
    departmentWarning: 'Check with your academic department: Engineering schools frequently require Windows-native hardware for CAD packages.',
    researchChecklist: [
      'Verify base RAM standard in current shipping model year',
      'Audit campus testing on latest macOS release vs university VPN protocols',
      'Confirm current Apple Education discount trade-in values',
    ],
  },
  {
    id: 'laptop-placeholder-2',
    name: 'Class B: Windows Thin & Light Business/Student Profile [Reference Model]',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION PLACEHOLDER — Pending 2026-2027 Model Testing',
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
    whyItFits: 'Maximum compatibility with university testing software (LockDown Browser), specialized economics software, and standard college labs.',
    pros: [
      '100% native compatibility with financial modeling tools and legacy exam software',
      'Generous port selection (USB-A, HDMI, USB-C) avoiding dongle clutter',
      'Replaceable / serviceable M.2 NVMe storage on most enterprise models',
    ],
    cons: [
      'Battery life varies widely depending on processor architecture',
      'Trackpad precision varies across different manufacturers',
    ],
    departmentWarning: 'ARM-based Windows laptops (Snapdragon) may have emulation caveats with older proctoring software; verify compatibility.',
    researchChecklist: [
      'Benchmark battery life under 150-nit web browsing test conditions',
      'Test keyboard key travel and palm rejection quality for long papers',
    ],
  },
  {
    id: 'laptop-placeholder-3',
    name: 'Class C: Budget-Friendly High-Value Windows/Chromebook Profile [Reference Model]',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION PLACEHOLDER — Pending 2026-2027 Model Testing',
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
    whyItFits: 'Affordable entry point for general education coursework, web-based Learning Management Systems (Canvas/Blackboard), and document drafting.',
    pros: [
      'Low upfront financial risk for budget-conscious freshmen',
      'Sufficient performance for web research, streaming, and Office 365',
    ],
    cons: [
      'Plastic build quality requires careful transport in a padded sleeve',
      'Dimmer screen (typically 250 nits) makes outdoor campus studying difficult',
    ],
    researchChecklist: [
      'Verify screen panel type to ensure readers avoid low-contrast TN displays',
      'Verify whether RAM is soldered or user-upgradable',
    ],
  },
  {
    id: 'laptop-placeholder-4',
    name: 'Class D: High-Performance STEM & Engineering Workstation Profile [Reference Model]',
    isPlaceholder: true,
    editorialStatus: 'SPECIFICATION PLACEHOLDER — Pending 2026-2027 Model Testing',
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
    whyItFits: 'Dedicated discrete GPU (NVIDIA RTX 4060 class or workstation equivalent) handles 3D CAD modeling, machine learning training, and rendering pipelines.',
    pros: [
      'Unrestricted performance for mechanical engineering, aerospace, and 3D animation',
      'Expandable RAM slots and secondary M.2 slots for storage expansion',
    ],
    cons: [
      'Heavier weight and larger power adapter in backpack',
      'Battery life under heavy load typically lasts 4–6 hours',
    ],
    departmentWarning: 'Most engineering colleges publish mandatory laptop minimum requirements in early summer; always consult their specific spec sheet before buying.',
    researchChecklist: [
      'Confirm official university engineering hardware guidelines for the incoming academic year',
      'Test thermal performance and fan noise during simulated CAD workloads',
    ],
  },
];
