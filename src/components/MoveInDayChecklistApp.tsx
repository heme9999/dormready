import { useState, useEffect, useMemo } from 'react';
import {
  type MoveInStage,
  STORAGE_KEY,
  getDefaultStages,
  calculateProgress,
  generateSummaryText,
} from '../lib/moveInDayChecklist';

export default function MoveInDayChecklistApp() {
  const [stages, setStages] = useState<MoveInStage[]>(getDefaultStages);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStages(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load move-in checklist from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
    } catch (e) {
      console.warn('Could not save move-in checklist to local storage', e);
    }
  }, [stages, isLoaded]);

  const { totalSteps, completedSteps, percent, stageProgress } = useMemo(() => {
    return calculateProgress(stages);
  }, [stages]);

  const toggleStep = (stageId: string, stepId: string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          steps: stage.steps.map((s) =>
            s.id === stepId ? { ...s, completed: !s.completed } : s
          ),
        };
      })
    );
  };

  const updateNotes = (stageId: string, stepId: string, value: string) => {
    setStages((prev) =>
      prev.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          steps: stage.steps.map((s) =>
            s.id === stepId ? { ...s, notes: value } : s
          ),
        };
      })
    );
  };

  const handleReset = () => {
    if (window.confirm('Reset all move-in day progress and notes back to defaults?')) {
      setStages(getDefaultStages());
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleCopySummary = async () => {
    const textToCopy = generateSummaryText(stages);
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
      {/* Interactive Progress & Toolbar Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="badge-blue">Move-In Day Timeline</span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
              Arrival Execution Milestones
            </h2>
            <p className="text-xs text-navy-600">
              {completedSteps} of {totalSteps} milestones completed ({percent}%)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-blue-600 transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              <span>{copied ? '✓ Summary Copied!' : '📋 Copy Text Summary'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-brand-navy font-bold text-xs hover:bg-slate-50 transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              <span>🖨️ Print Checklist</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-navy-500 hover:text-brand-coral text-xs font-semibold hover:underline cursor-pointer min-h-[44px]"
            >
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
          <div
            className="bg-brand-mint h-full transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        {/* Stage Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {stages.map((stage) => {
            const prog = stageProgress[stage.id];
            const isFullyDone = prog && prog.completed === prog.total;
            return (
              <div
                key={stage.id}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isFullyDone
                    ? 'bg-brand-mint-50 border-brand-mint-300 text-brand-mint-800'
                    : prog && prog.completed > 0
                    ? 'bg-brand-blue-50 border-brand-blue-200 text-brand-blue-900'
                    : 'bg-slate-50 border-slate-200 text-navy-600'
                }`}
              >
                <div className="text-xs font-bold truncate">{stage.badge}</div>
                <div className="text-[11px] font-medium opacity-80">
                  {prog ? `${prog.completed}/${prog.total}` : ''}
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy Note */}
        <div className="text-[11px] text-navy-500 flex items-center gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
          <span>🔒</span>
          <span>
            <strong>100% Private:</strong> Checklist data is saved strictly inside your local browser. No move-in details are sent to any external server.
          </span>
        </div>
      </div>

      {/* Checklist Stages */}
      <div className="space-y-8">
        {stages.map((stage) => (
          <section
            key={stage.id}
            className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl" aria-hidden="true">{stage.icon}</span>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  {stage.title}
                </h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-brand-navy self-start sm:self-auto">
                {stage.steps.filter((s) => s.completed).length} / {stage.steps.length} Done
              </span>
            </div>

            <div className="space-y-4">
              {stage.steps.map((step) => (
                <div
                  key={step.id}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
                    step.completed
                      ? 'border-brand-mint-300 bg-brand-mint-50/30'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <input
                      type="checkbox"
                      id={`cb-${step.id}`}
                      checked={step.completed}
                      onChange={() => toggleStep(stage.id, step.id)}
                      className="w-5 h-5 mt-0.5 rounded-lg border-2 border-slate-300 text-brand-mint focus:ring-brand-mint cursor-pointer shrink-0"
                    />
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label
                          htmlFor={`cb-${step.id}`}
                          className={`font-black text-sm sm:text-base cursor-pointer select-none ${
                            step.completed ? 'text-emerald-950 line-through opacity-80' : 'text-brand-navy'
                          }`}
                        >
                          {step.title}
                        </label>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            step.completed
                              ? 'bg-brand-mint text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {step.completed ? '✓ Completed' : 'Pending'}
                        </span>
                      </div>

                      <p className="text-xs text-navy-600 leading-relaxed">
                        {step.description}
                      </p>

                      {step.tip && (
                        <div className="text-[11px] text-brand-blue font-medium bg-brand-blue-50/50 p-2.5 rounded-xl border border-brand-blue-100">
                          <span className="font-bold text-brand-navy">Pro Tip: </span>
                          <span>{step.tip}</span>
                        </div>
                      )}

                      {/* Notes Input */}
                      <div className="pt-1">
                        <input
                          type="text"
                          placeholder="Add custom notes (e.g. check-in at arena, vehicle permit #, key code)..."
                          value={step.notes}
                          onChange={(e) => updateNotes(stage.id, step.id, e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue text-navy-900 placeholder:text-slate-400 min-h-[36px]"
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
