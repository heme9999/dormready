export interface ChecklistField {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  notes: string;
  suggestedAgreement: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  badge: string;
  icon: string;
  color: string;
  fields: ChecklistField[];
}

export const STORAGE_KEY = 'dormready_roommate_checklist_v1';

export const DEFAULT_SECTIONS: ChecklistSection[] = [
  {
    id: 'sec-facts',
    title: '1. School & Room Baseline Facts',
    badge: 'Logistics',
    icon: '🏢',
    color: 'border-brand-blue-200 bg-brand-blue-50/40 text-brand-blue-900',
    fields: [
      {
        id: 'f-hall',
        title: 'Assigned Residence Hall & Room Number',
        description: 'Confirm building name, room layout (double, suite, or hall bath), and floor.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Verify room floor plan on housing portal together.',
      },
      {
        id: 'f-provided',
        title: 'Provided Room Inventory & MicroFridge Check',
        description: 'Check if hall provides a MicroFridge, trash cans, or built-in lighting.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Confirm whether university supplies appliances before ordering.',
      },
      {
        id: 'f-slot',
        title: 'Move-in Date & Scheduled Time Slot',
        description: 'Coordinate arrival times so two families do not unload in the room at the exact same hour.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Stagger move-in slots by 1–2 hours if possible to avoid hallway congestion.',
      },
      {
        id: 'f-policy',
        title: 'University Prohibited Items Policy Link',
        description: 'Review the campus housing rules regarding wattage caps, candles, and cooking tools.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Agree to adhere to official residence hall fire safety guidelines.',
      },
    ],
  },
  {
    id: 'sec-purchases',
    title: '2. Shared Purchases & Appliances',
    badge: 'Gear Split',
    icon: '🔌',
    color: 'border-brand-coral-200 bg-brand-coral-50/40 text-brand-coral-900',
    fields: [
      {
        id: 'f-fridge',
        title: 'Mini-Fridge & Microwave',
        description: 'Coordinate who brings what, or whether to rent a campus MicroFridge unit together.',
        checked: false,
        notes: '',
        suggestedAgreement: 'One roommate brings/buys fridge, the other brings microwave or splits rental fee 50/50.',
      },
      {
        id: 'f-rug',
        title: 'Floor Area Rug',
        description: 'Decide color, size, and who purchases after measuring usable open floor in your room.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Buy after move-in once room layout is established.',
      },
      {
        id: 'f-clean',
        title: 'Floor Cleaning Tool (Cordless Stick Vac / Swiffer)',
        description: 'One cleaning tool is sufficient for a shared room.',
        checked: false,
        notes: '',
        suggestedAgreement: 'One roommate provides the cleaning tool; both share replacement pads/filters.',
      },
      {
        id: 'f-tv',
        title: 'TV / Streaming Monitor / Gaming Screen (Optional)',
        description: 'Discuss if a shared display is desired and where it will sit.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Must have headphone agreement during study hours.',
      },
      {
        id: 'f-mirror',
        title: 'Full-Length Over-the-Door Mirror',
        description: 'Avoid bringing two bulky hanging mirrors.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Hang one on the main entry door or inside closet door.',
      },
    ],
  },
  {
    id: 'sec-space',
    title: '3. Space Allocation & Furniture Layout',
    badge: 'Layout',
    icon: '📐',
    color: 'border-brand-mint-200 bg-brand-mint-50/40 text-brand-mint-900',
    fields: [
      {
        id: 'f-bedheight',
        title: 'Bed Frame Lofting & Height Agreement',
        description: 'Decide if beds will be low, junior-lofted (storage underneath), or high-lofted (desk underneath).',
        checked: false,
        notes: '',
        suggestedAgreement: 'Check if university maintenance must adjust bed heights or if lofting kits are needed.',
      },
      {
        id: 'f-sides',
        title: 'Bed, Desk & Closet Side Allocation',
        description: 'Discuss window side vs door side preferences amicably.',
        checked: false,
        notes: '',
        suggestedAgreement: 'First to arrive takes designated side or coin flip before move-in.',
      },
      {
        id: 'f-underbed',
        title: 'Under-Bed Storage Boundaries',
        description: 'Ensure each person has clear dedicated floor zones for storage totes.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Keep storage bins strictly underneath your own bed frame.',
      },
    ],
  },
  {
    id: 'sec-habits',
    title: '4. Daily Habits & Living Boundaries',
    badge: 'Lifestyle',
    icon: '⏰',
    color: 'border-amber-200 bg-brand-yellow-50/50 text-amber-950',
    fields: [
      {
        id: 'f-sleep',
        title: 'Sleep & Wake Schedules (Weekdays vs Weekends)',
        description: 'Discuss morning alarm etiquette, snoozing habits, and approximate bedtime targets.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Turn off alarms after 1 snooze; use phone vibration or smartwatch silent alarms for early classes.',
      },
      {
        id: 'f-study',
        title: 'In-Room Studying vs Library & Lighting Protocol',
        description: 'Determine late-night lighting rules (desk task lamps vs main overhead room light).',
        checked: false,
        notes: '',
        suggestedAgreement: 'Main room light turns off at 11:00 PM; use personal desk lamp with warm light afterward.',
      },
      {
        id: 'f-guests',
        title: 'Guests, Socializing & Overnight Visitors Policy',
        description: 'Agree on advance notice for visitors, study groups, and overnight guest boundaries.',
        checked: false,
        notes: '',
        suggestedAgreement: '24-hour advance text message notice for any overnight guests; unanimous consent required.',
      },
      {
        id: 'f-temp',
        title: 'Thermostat / Window & Fan Preferences',
        description: 'Discuss sleeping temperature comfort (cool vs warm, open window preferences).',
        checked: false,
        notes: '',
        suggestedAgreement: 'Aim for 68°F–72°F if adjustable; use personal clip-on fans or extra blankets for individual comfort.',
      },
      {
        id: 'f-chores',
        title: 'Trash Removal & Room Cleaning Rotation',
        description: 'Who takes out the room trash to the hall chute and when.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Alternate weekly trash duty and do a 15-minute shared room tidy every Sunday evening.',
      },
    ],
  },
  {
    id: 'sec-costs',
    title: '5. Financials & Move-Out Ownership',
    badge: 'Cost Split',
    icon: '💵',
    color: 'border-slate-300 bg-slate-50 text-brand-navy',
    fields: [
      {
        id: 'f-appliance-ownership',
        title: 'Appliance Ownership & Move-Out Plan',
        description: 'Establish who keeps the fridge or rug at the end of the school year in May.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Buyer retains sole ownership, or co-payer has option to buy out at 50% depreciated value at year end.',
      },
      {
        id: 'f-consumables',
        title: 'Shared Consumables (Trash Bags, Paper Towels, Soap)',
        description: 'Decide how to split everyday room consumables.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Alternate buying 12-packs of paper towels and dish soap, or split via Splitwise/Venmo.',
      },
    ],
  },
  {
    id: 'sec-safety',
    title: '6. Safety, Privacy & Emergency Protocol',
    badge: 'Safety',
    icon: '🛡️',
    color: 'border-brand-coral-200 bg-brand-coral-50/40 text-brand-coral-900',
    fields: [
      {
        id: 'f-allergies',
        title: 'Severe Food Allergies & Medical Disclosures (Voluntary)',
        description: 'Disclose peanut, tree nut, latex, or scent/perfume allergies for room safety.',
        checked: false,
        notes: '',
        suggestedAgreement: 'No peanut products or strong aerosol sprays inside the room if allergies exist.',
      },
      {
        id: 'f-emergency',
        title: 'Emergency Contact Numbers Sharing',
        description: 'Exchange parent/guardian contact info in case of acute illness or hospitalization.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Save roommate emergency contact in phone address book.',
      },
      {
        id: 'f-smartdevices',
        title: 'Smart Speakers & Cameras Consent',
        description: 'Discuss privacy expectations regarding smart speakers or ambient recording devices.',
        checked: false,
        notes: '',
        suggestedAgreement: 'No cameras permitted inside private dorm room; smart speakers muted during private phone calls.',
      },
    ],
  },
];

export function getDefaultSections(): ChecklistSection[] {
  return JSON.parse(JSON.stringify(DEFAULT_SECTIONS));
}

export function calculateProgress(sections: ChecklistSection[]): { total: number; agreed: number; percent: number } {
  const total = sections.reduce((acc, sec) => acc + sec.fields.length, 0);
  const agreed = sections.reduce((acc, sec) => acc + sec.fields.filter((f) => f.checked).length, 0);
  const percent = total > 0 ? Math.round((agreed / total) * 100) : 0;
  return { total, agreed, percent };
}

export function generateSummaryText(sections: ChecklistSection[]): string {
  const { total, agreed, percent } = calculateProgress(sections);
  const lines: string[] = [
    '# 🎓 DormReady Roommate Coordination Summary',
    `Progress: ${agreed} of ${total} items coordinated (${percent}%)\n`,
  ];

  sections.forEach((sec) => {
    lines.push(`## ${sec.title}`);
    sec.fields.forEach((f) => {
      const status = f.checked ? '✅ [AGREED]' : '⏳ [PENDING]';
      lines.push(`- ${status} **${f.title}**`);
      if (f.notes && f.notes.trim()) {
        lines.push(`  • Note: ${f.notes.trim()}`);
      } else {
        lines.push(`  • Baseline: ${f.suggestedAgreement}`);
      }
    });
    lines.push('');
  });

  lines.push('Generated locally with DormReady');
  return lines.join('\n');
}
