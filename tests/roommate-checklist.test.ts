import { describe, it, expect, beforeEach } from 'vitest';

// Simulated localStorage mock
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const STORAGE_KEY = 'dormready_roommate_checklist_v1';

interface ChecklistField {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  notes: string;
  suggestedAgreement: string;
}

interface ChecklistSection {
  id: string;
  title: string;
  badge: string;
  icon: string;
  color: string;
  fields: ChecklistField[];
}

const DEFAULT_SECTIONS: ChecklistSection[] = [
  {
    id: 'sec-facts',
    title: '1. School & Room Baseline Facts',
    badge: 'Logistics',
    icon: '🏢',
    color: 'border-brand-blue-200 bg-brand-blue-50/40 text-brand-blue-900',
    fields: [
      { id: 'f-hall', title: 'Assigned Residence Hall & Room Number', description: '', checked: false, notes: '', suggestedAgreement: 'Verify room floor plan on housing portal together.' },
      { id: 'f-provided', title: 'Provided Room Inventory & MicroFridge Check', description: '', checked: false, notes: '', suggestedAgreement: 'Confirm whether university supplies appliances before ordering.' },
      { id: 'f-slot', title: 'Move-in Date & Scheduled Time Slot', description: '', checked: false, notes: '', suggestedAgreement: 'Stagger move-in slots by 1–2 hours if possible to avoid hallway congestion.' },
      { id: 'f-policy', title: 'University Prohibited Items Policy Link', description: '', checked: false, notes: '', suggestedAgreement: 'Agree to adhere to official residence hall fire safety guidelines.' },
    ],
  },
  {
    id: 'sec-purchases',
    title: '2. Shared Purchases & Appliances',
    badge: 'Gear Split',
    icon: '🔌',
    color: 'border-brand-coral-200 bg-brand-coral-50/40 text-brand-coral-900',
    fields: [
      { id: 'f-fridge', title: 'Mini-Fridge & Microwave (1 unit total)', description: '', checked: false, notes: '', suggestedAgreement: 'One roommate brings/buys fridge, the other brings microwave or splits rental fee 50/50.' },
      { id: 'f-rug', title: 'Floor Area Rug (3x5 or 4x6 ft)', description: '', checked: false, notes: '', suggestedAgreement: 'Buy after move-in once room layout is established.' },
      { id: 'f-clean', title: 'Floor Cleaning Tool (Cordless Stick Vac / Swiffer)', description: '', checked: false, notes: '', suggestedAgreement: 'One roommate provides the cleaning tool; both share replacement pads/filters.' },
      { id: 'f-tv', title: 'TV / Streaming Monitor / Gaming Screen (Optional)', description: '', checked: false, notes: '', suggestedAgreement: 'Must have headphone agreement during study hours.' },
      { id: 'f-mirror', title: 'Full-Length Over-the-Door Mirror', description: '', checked: false, notes: '', suggestedAgreement: 'Hang one on the main entry door or inside closet door.' },
    ],
  },
  {
    id: 'sec-space',
    title: '3. Space Allocation & Furniture Layout',
    badge: 'Layout',
    icon: '📐',
    color: 'border-brand-mint-200 bg-brand-mint-50/40 text-brand-mint-900',
    fields: [
      { id: 'f-bedheight', title: 'Bed Frame Lofting & Height Agreement', description: '', checked: false, notes: '', suggestedAgreement: 'Check if university maintenance must adjust bed heights or if lofting kits are needed.' },
      { id: 'f-sides', title: 'Bed, Desk & Closet Side Allocation', description: '', checked: false, notes: '', suggestedAgreement: 'First to arrive takes designated side or coin flip before move-in.' },
      { id: 'f-underbed', title: 'Under-Bed Storage Boundaries', description: '', checked: false, notes: '', suggestedAgreement: 'Keep storage bins strictly underneath your own bed frame.' },
    ],
  },
  {
    id: 'sec-habits',
    title: '4. Daily Habits & Living Boundaries',
    badge: 'Lifestyle',
    icon: '⏰',
    color: 'border-amber-200 bg-brand-yellow-50/50 text-amber-950',
    fields: [
      { id: 'f-sleep', title: 'Sleep & Wake Schedules (Weekdays vs Weekends)', description: '', checked: false, notes: '', suggestedAgreement: 'Turn off alarms after 1 snooze; use phone vibration or smartwatch silent alarms for early classes.' },
      { id: 'f-study', title: 'In-Room Studying vs Library & Lighting Protocol', description: '', checked: false, notes: '', suggestedAgreement: 'Main room light turns off at 11:00 PM; use personal desk lamp with warm light afterward.' },
      { id: 'f-guests', title: 'Guests, Socializing & Overnight Visitors Policy', description: '', checked: false, notes: '', suggestedAgreement: '24-hour advance text message notice for any overnight guests; unanimous consent required.' },
      { id: 'f-temp', title: 'Thermostat / Window & Fan Preferences', description: '', checked: false, notes: '', suggestedAgreement: 'Aim for 68°F–72°F if adjustable; use personal clip-on fans or extra blankets for individual comfort.' },
      { id: 'f-chores', title: 'Trash Removal & Room Cleaning Rotation', description: '', checked: false, notes: '', suggestedAgreement: 'Alternate weekly trash duty and do a 15-minute shared room tidy every Sunday evening.' },
    ],
  },
  {
    id: 'sec-costs',
    title: '5. Financials & Move-Out Ownership',
    badge: 'Cost Split',
    icon: '💵',
    color: 'border-slate-300 bg-slate-50 text-brand-navy',
    fields: [
      { id: 'f-appliance-ownership', title: 'Appliance Ownership & Move-Out Plan', description: '', checked: false, notes: '', suggestedAgreement: 'Buyer retains sole ownership, or co-payer has option to buy out at 50% depreciated value at year end.' },
      { id: 'f-consumables', title: 'Shared Consumables (Trash Bags, Paper Towels, Soap)', description: '', checked: false, notes: '', suggestedAgreement: 'Alternate buying 12-packs of paper towels and dish soap, or split via Splitwise/Venmo.' },
    ],
  },
  {
    id: 'sec-safety',
    title: '6. Safety, Privacy & Emergency Protocol',
    badge: 'Safety',
    icon: '🛡️',
    color: 'border-brand-coral-200 bg-brand-coral-50/40 text-brand-coral-900',
    fields: [
      { id: 'f-allergies', title: 'Severe Food Allergies & Medical Disclosures (Voluntary)', description: '', checked: false, notes: '', suggestedAgreement: 'No peanut products or strong aerosol sprays inside the room if allergies exist.' },
      { id: 'f-emergency', title: 'Emergency Contact Numbers Sharing', description: '', checked: false, notes: '', suggestedAgreement: 'Save roommate emergency contact in phone address book.' },
      { id: 'f-smartdevices', title: 'Smart Speakers & Cameras Consent', description: '', checked: false, notes: '', suggestedAgreement: 'No cameras permitted inside private dorm room; smart speakers muted during private phone calls.' },
    ],
  },
];

function generateSummaryText(sections: ChecklistSection[], agreedCount: number, totalFields: number): string {
  const progressPercent = totalFields > 0 ? Math.round((agreedCount / totalFields) * 100) : 0;
  const lines: string[] = [
    '# 🎓 DormReady Roommate Coordination Summary',
    `Progress: ${agreedCount} of ${totalFields} items coordinated (${progressPercent}%)\n`,
  ];

  sections.forEach((sec) => {
    lines.push(`## ${sec.title}`);
    sec.fields.forEach((f) => {
      const status = f.checked ? '✅ [AGREED]' : '⏳ [PENDING]';
      lines.push(`- ${status} **${f.title}**`);
      if (f.notes.trim()) {
        lines.push(`  • Note: ${f.notes.trim()}`);
      } else {
        lines.push(`  • Baseline: ${f.suggestedAgreement}`);
      }
    });
    lines.push('');
  });

  lines.push('Generated locally via DormReady (https://dormready.org)');
  return lines.join('\n');
}

describe('Roommate Checklist State, LocalStorage & Summary Operations', () => {
  let localStorageMock: MockLocalStorage;

  beforeEach(() => {
    localStorageMock = new MockLocalStorage();
  });

  it('calculates total topics and completion counts accurately', () => {
    const total = DEFAULT_SECTIONS.reduce((acc, sec) => acc + sec.fields.length, 0);
    expect(total).toBe(22);

    // Initial count is 0
    let agreed = DEFAULT_SECTIONS.reduce(
      (acc, sec) => acc + sec.fields.filter((f) => f.checked).length,
      0
    );
    expect(agreed).toBe(0);

    // Clone and check 7 items
    const modified = JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) as ChecklistSection[];
    modified[0].fields[0].checked = true;
    modified[0].fields[1].checked = true;
    modified[1].fields[0].checked = true;
    modified[2].fields[0].checked = true;
    modified[3].fields[0].checked = true;
    modified[4].fields[0].checked = true;
    modified[5].fields[0].checked = true;

    agreed = modified.reduce(
      (acc, sec) => acc + sec.fields.filter((f) => f.checked).length,
      0
    );
    expect(agreed).toBe(7);
    const percent = Math.round((agreed / total) * 100);
    expect(percent).toBe(32);
  });

  it('persists and retrieves modified sections to and from localStorage', () => {
    const modified = JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) as ChecklistSection[];
    modified[1].fields[0].checked = true;
    modified[1].fields[0].notes = 'Alex will bring the mini fridge; Jordan brings microwave';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(modified));

    const retrieved = localStorageMock.getItem(STORAGE_KEY);
    expect(retrieved).not.toBeNull();

    const parsed: ChecklistSection[] = JSON.parse(retrieved!);
    expect(parsed[1].fields[0].checked).toBe(true);
    expect(parsed[1].fields[0].notes).toBe('Alex will bring the mini fridge; Jordan brings microwave');
  });

  it('generates formatted Markdown copy summary with custom notes and status badges', () => {
    const modified = JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) as ChecklistSection[];
    modified[1].fields[0].checked = true;
    modified[1].fields[0].notes = 'Alex brings fridge, Jordan brings microwave';

    const agreedCount = 1;
    const total = 22;
    const summary = generateSummaryText(modified, agreedCount, total);

    expect(summary).toContain('# 🎓 DormReady Roommate Coordination Summary');
    expect(summary).toContain('Progress: 1 of 22 items coordinated (5%)');
    expect(summary).toContain('## 2. Shared Purchases & Appliances');
    expect(summary).toContain('✅ [AGREED] **Mini-Fridge & Microwave (1 unit total)**');
    expect(summary).toContain('• Note: Alex brings fridge, Jordan brings microwave');
    expect(summary).toContain('⏳ [PENDING] **Floor Area Rug (3x5 or 4x6 ft)**');
    expect(summary).toContain('• Baseline: Buy after move-in once room layout is established.');
  });

  it('resets modified checklist back to default state and removes localStorage key', () => {
    const modified = JSON.parse(JSON.stringify(DEFAULT_SECTIONS)) as ChecklistSection[];
    modified[0].fields[0].checked = true;
    modified[0].fields[0].notes = 'Custom note here';

    localStorageMock.setItem(STORAGE_KEY, JSON.stringify(modified));
    expect(localStorageMock.getItem(STORAGE_KEY)).not.toBeNull();

    // Perform Reset
    let state = DEFAULT_SECTIONS;
    localStorageMock.removeItem(STORAGE_KEY);

    expect(localStorageMock.getItem(STORAGE_KEY)).toBeNull();
    expect(state[0].fields[0].checked).toBe(false);
    expect(state[0].fields[0].notes).toBe('');
  });
});
