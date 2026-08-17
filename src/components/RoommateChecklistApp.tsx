import { useState, useEffect, useMemo } from 'react';
import {
  type ChecklistSection,
  STORAGE_KEY,
  getDefaultSections,
  calculateProgress,
  generateSummaryText,
} from '../lib/roommateChecklist';

export default function RoommateChecklistApp() {
  const [sections, setSections] = useState<ChecklistSection[]>(getDefaultSections);
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

  const { total: totalFields, agreed: agreedCount, percent: progressPercent } = useMemo(() => {
    return calculateProgress(sections);
  }, [sections]);

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
      setSections(getDefaultSections());
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleCopySummary = async () => {
    const textToCopy = generateSummaryText(sections);
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
