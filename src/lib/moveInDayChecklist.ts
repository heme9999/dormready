export interface MoveInStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  notes: string;
  tip?: string;
}

export interface MoveInStage {
  id: string;
  stageNumber: number;
  title: string;
  badge: string;
  icon: string;
  color: string;
  steps: MoveInStep[];
}

export const STORAGE_KEY = 'dormready_movein_checklist_v1';

export const DEFAULT_MOVEIN_STAGES: MoveInStage[] = [
  {
    id: 'stage-pre-departure',
    stageNumber: 1,
    title: '1. Before Leaving Home',
    badge: 'Pre-Arrival',
    icon: '📋',
    color: 'border-brand-blue-200 bg-brand-blue-50/40 text-brand-blue-900',
    steps: [
      {
        id: 'step-timeslot',
        title: 'Confirm Scheduled Move-In Slot & Housing Portal Check-In',
        description: 'Verify your assigned date and time window in your university housing portal. Many schools assign staggered time slots to prevent traffic gridlock.',
        completed: false,
        notes: '',
        tip: 'If delayed by traffic or flight cancellations, check your school housing office late-arrival protocol.',
      },
      {
        id: 'step-checkin-loc',
        title: 'Confirm Exact Key Pickup Location',
        description: 'Do not assume check-in happens at your dormitory front desk. Universities often use central hubs (dining halls, sports arenas, or campus centers) for move-in day key distribution.',
        completed: false,
        notes: '',
        tip: 'Examples: UT Austin and UIUC publish designated centralized check-in hubs for specific halls.',
      },
      {
        id: 'step-parking-rules',
        title: 'Review Temporary Unloading Parking & Cart Policies',
        description: 'Print your temporary unloading parking permit (if provided) and review designated 15-to-30-minute unloading zone rules and moving cart availability.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-required-id',
        title: 'Prepare School-Mandated Identification',
        description: 'Place government-issued photo ID (driver license/passport) and your student ID card (or mobile credential) in an easily accessible front pocket.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-separate-docs',
        title: 'Keep Check-In Documents Separate from Packed Luggage',
        description: 'Keep housing assignment paperwork, vehicle permits, and immunization records in your personal backpack—never packed deep inside taped moving boxes.',
        completed: false,
        notes: '',
      },
    ],
  },
  {
    id: 'stage-checkin',
    stageNumber: 2,
    title: '2. At Check-In & Arrival',
    badge: 'Arrival Hub',
    icon: '🔑',
    color: 'border-brand-coral-200 bg-brand-coral-50/40 text-brand-coral-900',
    steps: [
      {
        id: 'step-keys',
        title: 'Pick Up Keys, Fob & Student ID First',
        description: 'Collect your room key, exterior door fob, mail key, and room condition form before bringing boxes from the car to the hallway.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-loc-orientation',
        title: 'Locate RA Desk, Emergency Exits & Hallway Facilities',
        description: 'Identify your Resident Advisor (RA) room, emergency exit stairs, trash chute, communal bathroom, and laundry room locations.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-park-relocate',
        title: 'Relocate Vehicle to Long-Term Move-In Parking',
        description: 'Once boxes are staged in the room or hallway landing, immediately move the vehicle out of the temporary unloading zone to free space for other families.',
        completed: false,
        notes: '',
      },
    ],
  },
  {
    id: 'stage-before-unpacking',
    stageNumber: 3,
    title: '3. Before Unpacking (Room Inspection)',
    badge: 'Critical Step',
    icon: '📸',
    color: 'border-brand-yellow-200 bg-brand-yellow-50/50 text-amber-950',
    steps: [
      {
        id: 'step-photos',
        title: 'Take Date-Stamped Photos of All Existing Damage',
        description: 'Photograph paint chips, wall scuffs, torn window screens, mattress stains, chipped desk edges, and existing scratches before placing items in the room.',
        completed: false,
        notes: '',
        tip: 'Save these photos to a cloud folder; this protects your security deposit and prevents unfair move-out repair fees in May.',
      },
      {
        id: 'step-rcf-inventory',
        title: 'Complete the University Room Condition Report (RCR)',
        description: 'Fill out and submit your school online or paper Room Inventory / Condition Form noting all pre-existing flaws.',
        completed: false,
        notes: '',
        tip: 'Submission deadlines vary (e.g. UMich allows 48 hours for inventory review); check your specific school deadline.',
      },
      {
        id: 'step-work-order',
        title: 'Submit Maintenance Requests for Immediate Deficiencies',
        description: 'Report broken window latches, burned-out overhead lights, faulty air conditioning, or stuck dresser drawers through your student housing portal.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-quick-wipe',
        title: 'Quick Wipe Down of Primary High-Touch Surfaces',
        description: 'Wipe desk surface, mattress vinyl, drawer interiors, and closet shelves with disinfectant wipes before setting down clean bedding and clothes.',
        completed: false,
        notes: '',
      },
    ],
  },
  {
    id: 'stage-unload-sequence',
    stageNumber: 4,
    title: '4. Unloading in the Correct Sequence',
    badge: 'Unload Flow',
    icon: '📦',
    color: 'border-brand-mint-200 bg-brand-mint-50/40 text-brand-mint-900',
    steps: [
      {
        id: 'step-stage-nightone',
        title: '1st: Set Aside Night-One Essentials Bag',
        description: 'Place your night-one backpack (sheets, toiletries, change of clothes, phone charger) on your desk chair so it does not get buried.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-make-bed',
        title: '2nd: Assemble Mattress Topper & Make Bed First',
        description: 'Put on your mattress encasement, foam topper, and sheets while the room still has floor space and before physical fatigue sets in.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-power-fan',
        title: '3rd: Connect Power Strip, Desk Lamp & Fan',
        description: 'Plug your UL-listed surge protector directly into the wall and set up airflow. August move-in days get warm quickly.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-hanging-clothes',
        title: '4th: Hang Wardrobe & Unpack Closet',
        description: 'Transfer hanging clothes directly from garment bags into the closet to free up floor space and moving bags immediately.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-desk-tech',
        title: '5th: Set Up Study Desk & Tech Basics',
        description: 'Place laptop, desk organizers, and academic supplies on your workspace.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-breakdown-boxes',
        title: '6th: Collapse Boxes & Recycle Packaging',
        description: 'Break down cardboard boxes and dispose of packaging in designated hall recycling dumpsters to keep hallway clear.',
        completed: false,
        notes: '',
      },
    ],
  },
  {
    id: 'stage-before-family-leaves',
    stageNumber: 5,
    title: '5. Before Family / Helpers Leave',
    badge: 'Final Check',
    icon: '👋',
    color: 'border-purple-200 bg-purple-50/40 text-purple-900',
    steps: [
      {
        id: 'step-test-locks',
        title: 'Test Key and Door Access Independently',
        description: 'Step outside the room, lock the door, and verify that both your physical key and digital card/app open the door smoothly.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-test-outlets',
        title: 'Test All Room Power Outlets & Wi-Fi Connection',
        description: 'Plug your phone charger into every available wall receptacle and connect your laptop to the official campus Wi-Fi network.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-roommate-sync',
        title: 'Brief Initial Check-In with Roommate & Family',
        description: 'Exchange phone numbers with your roommate, coordinate temperature/lighting preferences for night one, and confirm any missing supplies.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-last-store-run',
        title: 'Compile Final List for Farewell Grocery / Store Run',
        description: 'Identify any urgent missing items (bottled water, trash bags, bath towel, hangers) to purchase together before helpers depart.',
        completed: false,
        notes: '',
      },
    ],
  },
  {
    id: 'stage-first-48-hours',
    stageNumber: 6,
    title: '6. First Night & First 48 Hours',
    badge: 'Settling In',
    icon: '🌙',
    color: 'border-slate-300 bg-slate-50 text-brand-navy',
    steps: [
      {
        id: 'step-submit-rcr',
        title: 'Submit Room Inventory & Inspection Verification',
        description: 'Review your photos and submit final room condition documentation within your school official review window.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-meet-ra',
        title: 'Introduce Yourself to Your Resident Advisor (RA)',
        description: 'Meet your RA, note their on-duty contact hours, and attend your floor mandatory orientation meeting.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-mail-address',
        title: 'Confirm Proper Campus Mailing & Package Address Format',
        description: 'Check how packages must be addressed (student legal name, box number, residence hall name) to prevent returned shipments.',
        completed: false,
        notes: '',
      },
      {
        id: 'step-locate-essentials',
        title: 'Walk to Campus Dining, Laundry & Health Center',
        description: 'Locate your nearest dining hall, test your laundry card/app, and identify the campus student health center location.',
        completed: false,
        notes: '',
      },
    ],
  },
];

export function getDefaultStages(): MoveInStage[] {
  return JSON.parse(JSON.stringify(DEFAULT_MOVEIN_STAGES));
}

export function calculateProgress(stages: MoveInStage[]): {
  totalSteps: number;
  completedSteps: number;
  percent: number;
  stageProgress: Record<string, { total: number; completed: number; percent: number }>;
} {
  let totalSteps = 0;
  let completedSteps = 0;
  const stageProgress: Record<string, { total: number; completed: number; percent: number }> = {};

  stages.forEach((stage) => {
    const total = stage.steps.length;
    const completed = stage.steps.filter((s) => s.completed).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    totalSteps += total;
    completedSteps += completed;
    stageProgress[stage.id] = { total, completed, percent };
  });

  const percent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  return { totalSteps, completedSteps, percent, stageProgress };
}

export function generateSummaryText(stages: MoveInStage[]): string {
  const { totalSteps, completedSteps, percent } = calculateProgress(stages);
  const lines: string[] = [
    '# 🎓 DormReady Move-In Day Execution Summary',
    `Progress: ${completedSteps} of ${totalSteps} milestones completed (${percent}%)\n`,
    'Note: Institutional procedures, check-in hubs, and deadlines always supersede generic timelines.\n',
  ];

  stages.forEach((stage) => {
    lines.push(`## ${stage.title}`);
    stage.steps.forEach((step) => {
      const status = step.completed ? '✅ [DONE]' : '⏳ [PENDING]';
      lines.push(`- ${status} **${step.title}**`);
      if (step.notes && step.notes.trim()) {
        lines.push(`  • Note: ${step.notes.trim()}`);
      }
    });
    lines.push('');
  });

  lines.push('Generated locally with DormReady');
  return lines.join('\n');
}
