export type ChecklistCategoryKey =
  | 'bedding'
  | 'bathroom'
  | 'laundry'
  | 'study'
  | 'technology'
  | 'kitchen'
  | 'clothing'
  | 'health'
  | 'documents'
  | 'optional';

export type PriorityTier = 'essential' | 'recommended' | 'optional';
export type BudgetTier = 'low' | 'mid' | 'high';

export interface ChecklistItem {
  id: string;
  name: string;
  category: ChecklistCategoryKey;
  tier: PriorityTier;
  budgetTier: BudgetTier;
  description: string;
  note?: string;
  prohibitedWarning?: string;
  roommateCoordination?: boolean;
  buyAfterArrival?: boolean;
}

export interface ChecklistCategory {
  key: ChecklistCategoryKey;
  name: string;
  description: string;
  icon: string;
}

export const CHECKLIST_CATEGORIES: ChecklistCategory[] = [
  { key: 'bedding', name: 'Bedding & Sleep', description: 'Standard Twin XL dimensions and sleep comfort', icon: 'Bed' },
  { key: 'bathroom', name: 'Bathroom & Shower', description: 'Caddies, quick-dry towels, and shared bath prep', icon: 'ShowerHead' },
  { key: 'laundry', name: 'Laundry & Clothing Care', description: 'Hamper bags, detergent sheets, and drying racks', icon: 'Shirt' },
  { key: 'study', name: 'Desk & Study Essentials', description: 'Ergonomics, task lighting, and academic supplies', icon: 'BookOpen' },
  { key: 'technology', name: 'Technology & Power', description: 'UL-listed surge protectors, cables, and backup', icon: 'Laptop' },
  { key: 'kitchen', name: 'Snack & Micro-Kitchen', description: 'Hydration, microwave-safe dishware, and food storage', icon: 'Utensils' },
  { key: 'clothing', name: 'Clothing & Storage', description: 'Seasonal rotation, slim hangers, and shoe organizers', icon: 'Folder' },
  { key: 'health', name: 'Health & First Aid', description: 'Basic medications, thermometer, and personal care', icon: 'HeartPulse' },
  { key: 'documents', name: 'Documents & Security', description: 'IDs, health insurance cards, and locked lockbox', icon: 'ShieldCheck' },
  { key: 'optional', name: 'Comfort & Extras', description: 'Lighting accents, rugs, and decorative items', icon: 'Sparkles' },
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  // Bedding
  {
    id: 'bed-1',
    name: 'Twin XL Sheet Set (2 sets)',
    category: 'bedding',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Most U.S. dorm mattresses are Twin XL (38" x 80"), 5 inches longer than standard Twin. Two sets allow easy laundry rotation.',
    note: 'Check your university housing portal to verify mattress size before purchasing.',
  },
  {
    id: 'bed-2',
    name: 'Mattress Protector (Waterproof & Encasement)',
    category: 'bedding',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Protects against dust mites, spills, and previous years of dorm mattress wear. Essential for hygiene.',
  },
  {
    id: 'bed-3',
    name: 'Mattress Topper (2-3 inch foam or latex)',
    category: 'bedding',
    tier: 'essential',
    budgetTier: 'mid',
    description: 'Institutional vinyl dorm mattresses are notoriously firm. A high-density 2-3 inch topper dramatically improves sleep quality.',
  },
  {
    id: 'bed-4',
    name: 'Bed Pillows (1-2) with Washable Covers',
    category: 'bedding',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Standard size pillows with zippered protective covers for easy weekly washing.',
  },
  {
    id: 'bed-5',
    name: 'Comforter / Duvet Insert & Cover',
    category: 'bedding',
    tier: 'recommended',
    budgetTier: 'mid',
    description: 'Duvet covers are much easier to wash in dorm commercial washers than bulky single-piece comforters.',
  },
  {
    id: 'bed-6',
    name: 'Throw Blanket',
    category: 'bedding',
    tier: 'optional',
    budgetTier: 'low',
    description: 'Extra warmth for drafty rooms or lounging at the desk.',
  },

  // Bathroom
  {
    id: 'bath-1',
    name: 'Mesh Shower Caddy with Drainage Holes',
    category: 'bathroom',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Quick-drying mesh caddies resist mildew much better than rigid plastic tubs with standing water.',
  },
  {
    id: 'bath-2',
    name: 'Shower Shoes / Waterproof Slides',
    category: 'bathroom',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Mandatory hygiene protection against communal bathroom floor fungi and plantar warts.',
  },
  {
    id: 'bath-3',
    name: 'Quick-Dry Bath Towels (2-3) + Washcloths',
    category: 'bathroom',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Waffle-weave or Turkish cotton towels dry significantly faster in low-airflow dorm rooms.',
  },
  {
    id: 'bath-4',
    name: 'Toiletry Travel Bottles & Personal Care Set',
    category: 'bathroom',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Shampoo, body wash, toothbrush holder with ventilation cap, toothpaste, deodorant.',
    buyAfterArrival: true,
  },
  {
    id: 'bath-5',
    name: 'Bathrobe or Terry Wrap',
    category: 'bathroom',
    tier: 'recommended',
    budgetTier: 'mid',
    description: 'Convenient for walking down hall corridors to and from communal bathrooms.',
  },

  // Laundry
  {
    id: 'laun-1',
    name: 'Backpack-Style Laundry Bag or Rolling Hamper',
    category: 'laundry',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Padded shoulder straps make carrying 20 lbs of clothes down basement stairwells effortless.',
  },
  {
    id: 'laun-2',
    name: 'Detergent Sheets or Pods',
    category: 'laundry',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Liquid detergent jugs are heavy and leak easily. Detergent sheets take zero shelf space and eliminate mess.',
    note: 'If using pods, place in the bottom of the drum before clothes in commercial front-loaders.',
  },
  {
    id: 'laun-3',
    name: 'Collapsible Drying Rack',
    category: 'laundry',
    tier: 'recommended',
    budgetTier: 'mid',
    description: 'Prevents shrinking delicate clothing and saves money on dryer cycles.',
  },
  {
    id: 'laun-4',
    name: 'Stain Remover Pen (Tide To Go or similar)',
    category: 'laundry',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Fast spot treatment for coffee spills and food stains between laundry days.',
  },

  // Study
  {
    id: 'stu-1',
    name: 'LED Desk Lamp with USB Charging Port',
    category: 'study',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Adjustable color temperature lamp allows studying late without waking roommates.',
    prohibitedWarning: 'Halogen lamps and incandescent bulbs over certain wattages are strictly banned in almost all residence halls.',
  },
  {
    id: 'stu-2',
    name: 'Lap Desk or Bed Cushion Tray',
    category: 'study',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Allows comfortable typing and reading from your bed or dorm chair.',
  },
  {
    id: 'stu-3',
    name: 'Basic Academic Supplies (Notebooks, Pens, Highlighters)',
    category: 'study',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Minimal starter stationery. Most coursework is digital; buy only what syllabus specifies.',
  },
  {
    id: 'stu-4',
    name: 'Backpack with Padded Laptop Compartment',
    category: 'study',
    tier: 'essential',
    budgetTier: 'mid',
    description: 'Water-resistant, ergonomic daypack with dedicated protective sleeve.',
  },

  // Technology
  {
    id: 'tech-1',
    name: 'UL-Listed Surge Protector with 6-10 ft Cord (1-2)',
    category: 'technology',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Dorm outlets are frequently placed in awkward corners far from beds and desks.',
    prohibitedWarning: 'Unfused extension cords, multi-plug cubes without surge switches, and daisy-chained power strips violate fire codes in residence halls.',
  },
  {
    id: 'tech-2',
    name: 'Laptop & Charger + Spare 65W/100W USB-C Charger',
    category: 'technology',
    tier: 'essential',
    budgetTier: 'high',
    description: 'A compact GaN charger stays in your backpack while the primary brick stays at your desk.',
  },
  {
    id: 'tech-3',
    name: 'Extra Long (10 ft) Braided Phone Charging Cable',
    category: 'technology',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Standard 3 ft cords rarely reach lofted beds from wall sockets.',
  },
  {
    id: 'tech-4',
    name: 'Noise-Cancelling Headphones or Earbuds',
    category: 'technology',
    tier: 'recommended',
    budgetTier: 'mid',
    description: 'Indispensable for studying in noisy lounges, libraries, and sharing a room with different sleep schedules.',
  },
  {
    id: 'tech-5',
    name: 'Ethernet Cable (Cat6, 14-25 ft)',
    category: 'technology',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Campus Wi-Fi can get saturated during peak exam hours; dorm wall jacks often deliver stable 500+ Mbps.',
  },
  {
    id: 'tech-6',
    name: 'Portable Power Bank (10,000–20,000 mAh)',
    category: 'technology',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Keeps phone and accessories charged during 10-hour lecture and lab days.',
  },

  // Kitchen
  {
    id: 'kitch-1',
    name: 'Insulated Water Bottle (24–32 oz)',
    category: 'kitchen',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Durable stainless steel bottle for campus bottle-filling hydration stations.',
  },
  {
    id: 'kitch-2',
    name: 'Microwave-Safe Mug, Bowl, and Spoon/Fork Set',
    category: 'kitchen',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Reusable set for oatmeal, ramen, soup, and reheating leftovers.',
  },
  {
    id: 'kitch-3',
    name: 'Dish Soap, Scrub Sponge, and Microfiber Towel',
    category: 'kitchen',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Compact kit to wash personal dishes in the common floor kitchenette.',
    buyAfterArrival: true,
  },
  {
    id: 'kitch-4',
    name: 'Mini Fridge / Microwave (Verify Specs)',
    category: 'kitchen',
    tier: 'recommended',
    budgetTier: 'high',
    description: 'Coordinate with roommate so you do not duplicate appliances.',
    roommateCoordination: true,
    prohibitedWarning: 'Most colleges restrict wattage (e.g. max 1000W) and capacity (under 4.0 cu ft). Standalone hot plates, toaster ovens, and electric grills with exposed coils are banned.',
    buyAfterArrival: true,
  },
  {
    id: 'kitch-5',
    name: 'Electric Kettle with Auto-Shutoff',
    category: 'kitchen',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Fast boiling for tea, pour-over coffee, and instant meals.',
    prohibitedWarning: 'Check housing policy; models without concealed heating elements or auto-shutoff may be prohibited.',
  },

  // Clothing & Storage
  {
    id: 'cloth-1',
    name: 'Slim Velvet Hangers (30–40 pack)',
    category: 'clothing',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Takes 50% less closet bar space than thick wooden or plastic tubular hangers.',
  },
  {
    id: 'cloth-2',
    name: 'Under-Bed Storage Totes or Zippered Fabric Bags',
    category: 'clothing',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Under-bed clearance is prime storage for out-of-season clothes and winter gear.',
  },
  {
    id: 'cloth-3',
    name: 'Over-the-Door Hooks (Verify door thickness)',
    category: 'clothing',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Instant hanging space for damp towels, winter coats, and backpacks.',
    prohibitedWarning: 'Do not screw hooks into university doors; use padded over-door brackets or damage-free hooks.',
  },
  {
    id: 'cloth-4',
    name: 'Weather-Appropriate Raincoat & Compact Umbrella',
    category: 'clothing',
    tier: 'essential',
    budgetTier: 'low',
    description: 'You will walk between classes regardless of heavy rain or cold snaps.',
  },

  // Health
  {
    id: 'health-1',
    name: 'First Aid Kit & OTC Medication Caddy',
    category: 'health',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Bandages, antiseptic ointment, pain reliever/fever reducer (ibuprofen/acetaminophen), antihistamines, antacids.',
  },
  {
    id: 'health-2',
    name: 'Digital Oral Thermometer',
    category: 'health',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Crucial for assessing fevers before contacting campus health services.',
  },
  {
    id: 'health-3',
    name: 'Prescription Medication (90-day supply & refill plan)',
    category: 'health',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Coordinate with your hometown doctor and campus pharmacy prior to move-in.',
  },
  {
    id: 'health-4',
    name: 'Small Personal First Aid / Cold Relief Kit',
    category: 'health',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Cough drops, electrolyte packets, decongestants, saline nasal spray.',
  },

  // Documents
  {
    id: 'doc-1',
    name: 'Government Photo ID (Driver License / State ID / Passport)',
    category: 'documents',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Required for campus check-in, financial aid verification, employment on campus (Form I-9).',
  },
  {
    id: 'doc-2',
    name: 'Health Insurance Card & Prescription Card (Front & Back Copy)',
    category: 'documents',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Required for clinic visits, emergency care, and campus athletic clearance.',
  },
  {
    id: 'doc-3',
    name: 'Lockable Document Box or Small Safe',
    category: 'documents',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Stores passport, Social Security card (if needed for work), spare cards, and emergency cash.',
  },
  {
    id: 'doc-4',
    name: 'Financial & Campus Credentials Emergency Contact Sheet',
    category: 'documents',
    tier: 'essential',
    budgetTier: 'low',
    description: 'Printed contact numbers for student health, campus security, family, and primary bank.',
  },

  // Optional / Comfort
  {
    id: 'opt-1',
    name: 'Small Area Rug (3x5 or 4x6 ft)',
    category: 'optional',
    tier: 'optional',
    budgetTier: 'low',
    description: 'Softens cold linoleum dorm tile floors. Buy after checking room layout with roommate.',
    roommateCoordination: true,
    buyAfterArrival: true,
  },
  {
    id: 'opt-2',
    name: 'Bedside Caddy or Hanging Shelf',
    category: 'optional',
    tier: 'optional',
    budgetTier: 'low',
    description: 'Attaches to bed frame rails to hold water, phone, glasses for lofted beds.',
  },
  {
    id: 'opt-3',
    name: 'Full-Length Hanging Mirror',
    category: 'optional',
    tier: 'optional',
    budgetTier: 'low',
    description: 'Over-the-door hanging mirror. Coordinate with roommate.',
    roommateCoordination: true,
    buyAfterArrival: true,
  },
  {
    id: 'opt-4',
    name: 'Clip-on Bed Fan or Small Desk Fan',
    category: 'optional',
    tier: 'recommended',
    budgetTier: 'low',
    description: 'Essential in older dorms without individual room air conditioning during August/September.',
  },
];
