import React, { useState, useEffect, useMemo } from 'react';

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
      {
        id: 'f-hall',
        title: 'Assigned Residence Hall & Room Number',
        description: 'Confirm building name, room type (standard double, suite, or hall bath), and floor.',
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
        title: 'Mini-Fridge & Microwave (1 unit total)',
        description: 'Decide who purchases/brings the fridge and microwave, or whether to rent a campus unit.',
        checked: false,
        notes: '',
        suggestedAgreement: 'One roommate brings/buys fridge, the other brings microwave or splits rental fee 50/50.',
      },
      {
        id: 'f-rug',
        title: 'Floor Area Rug (3x5 or 4x6 ft)',
        description: 'Decide color, size, and who purchases after measuring usable open floor.',
        checked: false,
        notes: '',
        suggestedAgreement: 'Buy after move-in once room layout is established.',
      },
      {
        id: 'f-clean',
        title: 'Floor Cleaning Tool (Cordless Stick Vac / Swiffer)',
        description: 'One cleaning tool is plenty for a 150 sq ft room.',
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
        description: 'Discuss privacy expectations regarding Alexa/Google smart speakers or ambient recording devices.',
        checked: false,
        notes: '',
        suggestedAgreement: 'No cameras permitted inside private dorm room; smart speakers muted during private phone calls.',
      },
    ],
  },
];

const STORAGE_KEY = 'dormready_roommate_checklist_v1';

export default function RoommateChecklistApp() {
  const [sections, setSections] = useState<ChecklistSection[]>(DEFAULT_SECTIONS);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSections(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load roommate checklist from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections));
    } catch (e) {
      console.warn('Could not save roommate checklist to local storage', e);
    }
  }, [sections, isLoaded]);

  const totalFields = useMemo(() => {
    return sections.reduce((acc, sec) => acc + sec.fields.length, 0);
  }, [sections]);

  const agreedCount = useMemo(() => {
    return sections.reduce(
      (acc, sec) => acc + sec.fields.filter((f) => f.checked).length,
      0
    );
  }, [sections]);

  const progressPercent = totalFields > 0 ? Math.round((agreedCount / totalFields) * 100) : 0;

  const toggleField = (secId: string, fieldId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          fields: sec.fields.map((f) =>
            f.id === fieldId ? { ...f, checked: !f.checked } : f
          ),
        };
      })
    );
  };

  const updateNotes = (secId: string, fieldId: string, value: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          fields: sec.fields.map((f) =>
            f.id === fieldId ? { ...f, notes: value } : f
          ),
        };
      })
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset all roommate checklist agreements and notes back to defaults?')) {
      setSections(DEFAULT_SECTIONS);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleCopySummary = async () => {
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

    const textToCopy = lines.join('\n');
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('Could not copy to clipboard. Please copy manually.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Interactive Toolbar & Progress Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="badge-blue">Local Browser Storage</span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
              Roommate Agreement Progress
            </h2>
            <p className="text-xs text-navy-600">
              {agreedCount} of {totalFields} topics coordinated ({progressPercent}%)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-blue-600 transition-all shadow-xs cursor-pointer"
            >
              <span>{copied ? '✓ Summary Copied!' : '📋 Copy Text Summary'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-brand-navy font-bold text-xs hover:bg-slate-50 transition-all shadow-xs cursor-pointer"
            >
              <span>🖨️ Print Checklist</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-navy-500 hover:text-brand-coral text-xs font-semibold hover:underline cursor-pointer"
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div
            className="bg-brand-mint h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Privacy & Local Storage Note */}
        <div className="text-[11px] text-navy-500 flex items-center gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span>🔒</span>
          <span>
            <strong>100% Private:</strong> All checklist progress and custom notes are stored strictly inside your local browser. No personal roommate data is transmitted to any server.
          </span>
        </div>
      </div>

      {/* Checklist Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <section
            key={section.id}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl" aria-hidden="true">{section.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  {section.title}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-brand-navy self-start sm:self-auto">
                {section.fields.filter((f) => f.checked).length} / {section.fields.length} Agreed
              </span>
            </div>

            <div className="space-y-5">
              {section.fields.map((field) => (
                <div
                  key={field.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    field.checked
                      ? 'border-brand-mint-300 bg-brand-mint-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      id={`cb-${field.id}`}
                      checked={field.checked}
                      onChange={() => toggleField(section.id, field.id)}
                      className="w-5 h-5 mt-0.5 rounded-lg border-2 border-slate-300 text-brand-mint focus:ring-brand-mint cursor-pointer shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor={`cb-${field.id}`}
                          className={`font-black text-sm sm:text-base cursor-pointer select-none ${
                            field.checked ? 'text-emerald-950 line-through opacity-80' : 'text-brand-navy'
                          }`}
                        >
                          {field.title}
                        </label>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            field.checked
                              ? 'bg-brand-mint text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {field.checked ? '✓ Agreed' : 'Pending'}
                        </span>
                      </div>

                      <p className="text-xs text-navy-600 leading-relaxed">
                        {field.description}
                      </p>

                      <div className="text-[11px] text-navy-500 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-bold text-brand-navy">Suggested baseline: </span>
                        <span>{field.suggestedAgreement}</span>
                      </div>

                      {/* Notes Field */}
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder="Add custom agreement or name assignment (e.g. Alex brings fridge, Jordan brings microwave)..."
                          value={field.notes}
                          onChange={(e) => updateNotes(section.id, field.id, e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-navy-900 placeholder:text-slate-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
