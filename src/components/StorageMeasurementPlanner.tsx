import { useState, useEffect, useMemo } from 'react';
import {
  type DormMeasurements,
  STORAGE_KEY,
  getDefaultMeasurements,
  checkZoneStatuses,
  generateMeasurementSummary,
} from '../lib/storagePlanner';

export default function StorageMeasurementPlanner() {
  const [data, setData] = useState<DormMeasurements>(getDefaultMeasurements);
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          setData(parsed);
        }
      }
    } catch (e) {
      console.warn('Could not load storage measurements from local storage', e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save storage measurements to local storage', e);
    }
  }, [data, isLoaded]);

  const statuses = useMemo(() => checkZoneStatuses(data), [data]);

  const handleReset = () => {
    if (window.confirm('Reset all recorded dorm measurements back to blank defaults?')) {
      setData(getDefaultMeasurements());
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  };

  const handleCopySummary = async () => {
    const textToCopy = generateMeasurementSummary(data);
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
      {/* Overview & Action Toolbar Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="badge-mint">Measurement Planner</span>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy">
              Dorm Storage Measurement Log
            </h2>
            <p className="text-xs text-navy-600">
              {statuses.overallReadyCount} of 5 functional zones confirmed ready for shopping
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-xs hover:bg-brand-blue-600 transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              <span>{copied ? '✓ Summary Copied!' : '📋 Copy Measurements'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 text-brand-navy font-bold text-xs hover:bg-slate-50 transition-all shadow-xs cursor-pointer min-h-[44px]"
            >
              <span>🖨️ Print Log</span>
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

        {/* Status Summary Banner */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="font-bold text-brand-navy flex items-center gap-2">
            <span>📐</span>
            <span>Why Measure First?</span>
          </div>
          <p className="text-navy-700 leading-relaxed">
            Dorm bed heights, closet door types, and wall materials vary between residence halls. Fill in measurements when you arrive to avoid buying storage bins that cannot fit or wall hooks that peel dorm paint.
          </p>
        </div>
      </div>

      {/* 5 Zone Measurement Form Cards */}
      <div className="space-y-8">
        {/* Zone 1: Under-Bed */}
        <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden="true">🛏️</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  1. Under-Bed Storage Zone
                </h3>
                <p className="text-xs text-navy-600">Determine maximum tote height, drawer depth, and frame clearance</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                statuses.underbed.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {statuses.underbed.badgeLabel}
            </span>
          </div>

          <p className="text-xs text-navy-700 leading-relaxed">{statuses.underbed.message}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Clearance Height (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 14, 28, 32"
                value={data.underbed.clearanceInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    underbed: { ...prev.underbed, clearanceInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Bed Width (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 38 (Twin XL)"
                value={data.underbed.widthInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    underbed: { ...prev.underbed, widthInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Frame Depth (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 80"
                value={data.underbed.depthInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    underbed: { ...prev.underbed, depthInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Lofting Setting</label>
              <select
                value={data.underbed.loftingSetting}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    underbed: {
                      ...prev.underbed,
                      loftingSetting: e.target.value as DormMeasurements['underbed']['loftingSetting'],
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue bg-white"
              >
                <option value="unconfirmed">Select loft status...</option>
                <option value="fixed-low">Fixed Low Frame (~10-14 in)</option>
                <option value="adjustable">Junior Loft / Adjustable (~20-30 in)</option>
                <option value="lofted">Full High Loft (Desk Underneath)</option>
              </select>
            </div>
          </div>

          {/* Sub-item readiness breakdown */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] space-y-1 text-navy-700">
            <div className="font-bold text-brand-navy">Item-Specific Measurement Guidance:</div>
            <ul className="space-y-1">
              <li>• <strong>Low-profile soft bags:</strong> {statuses.underbed.subDetails?.softBags.ready ? '✓ Clearance recorded' : 'Requires clearance height'}</li>
              <li>• <strong>Rigid bins &amp; drawer units:</strong> {statuses.underbed.subDetails?.rigidBins.ready ? '✓ Width, depth, and clearance recorded' : 'Requires width, depth, and clearance height'}</li>
              <li>• <strong>Bed risers / lofting hardware:</strong> Must not be assumed; verify your assigned hall furniture and safety rules before purchasing.</li>
            </ul>
          </div>

          <div>
            <input
              type="text"
              placeholder="Under-bed notes (e.g. bed adjusted to 2nd highest notch, space for 3 plastic bins)..."
              value={data.underbed.notes}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  underbed: { ...prev.underbed, notes: e.target.value },
                }))
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-navy-900 placeholder:text-slate-400"
            />
          </div>
        </section>

        {/* Zone 2: Closet */}
        <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden="true">🚪</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  2. Closet &amp; Wardrobe Zone
                </h3>
                <p className="text-xs text-navy-600">Determine hanging space, top shelf height, and door style</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                statuses.closet.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {statuses.closet.badgeLabel}
            </span>
          </div>

          <p className="text-xs text-navy-700 leading-relaxed">{statuses.closet.message}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Closet Width (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 36"
                value={data.closet.widthInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    closet: { ...prev.closet, widthInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Closet Depth (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 24"
                value={data.closet.depthInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    closet: { ...prev.closet, depthInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Hanging Bar Height (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 64"
                value={data.closet.hangingBarHeightInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    closet: { ...prev.closet, hangingBarHeightInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Top Shelf Clearance (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 12"
                value={data.closet.topShelfClearanceInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    closet: { ...prev.closet, topShelfClearanceInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Door Type</label>
              <select
                value={data.closet.doorType}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    closet: {
                      ...prev.closet,
                      doorType: e.target.value as DormMeasurements['closet']['doorType'],
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue bg-white"
              >
                <option value="unconfirmed">Select door type...</option>
                <option value="bi-fold">Bi-Fold Accordion Doors</option>
                <option value="hinged">Standard Hinged Swing Door</option>
                <option value="curtain">Curtain Rod Only</option>
                <option value="open">Open Wardrobe Nook (No Door)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Closet Notes</label>
              <input
                type="text"
                placeholder="e.g. 2 drawers built into bottom of wardrobe, requires slim velvet hangers..."
                value={data.closet.notes}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    closet: { ...prev.closet, notes: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-navy-900 placeholder:text-slate-400"
              />
            </div>
          </div>
        </section>

        {/* Zone 3: Desk */}
        <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden="true">🖥️</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  3. Study Desk &amp; Vertical Space
                </h3>
                <p className="text-xs text-navy-600">Determine monitor riser size, desk shelf height, and power cord reach</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                statuses.desk.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {statuses.desk.badgeLabel}
            </span>
          </div>

          <p className="text-xs text-navy-700 leading-relaxed">{statuses.desk.message}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Desk Width (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 42"
                value={data.desk.widthInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    desk: { ...prev.desk, widthInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Desk Depth (inches)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 24"
                value={data.desk.depthInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    desk: { ...prev.desk, depthInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Hutch / Shelf Clearance (inches)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 18 (vertical opening)"
                value={data.desk.hutchClearanceInches}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    desk: { ...prev.desk, hutchClearanceInches: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Distance to Outlet (feet)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 4 (power planning)"
                value={data.desk.outletDistanceFeet}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    desk: { ...prev.desk, outletDistanceFeet: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Desk notes (e.g. fixed bulletin board above desk, center drawer holds pencils)..."
              value={data.desk.notes}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  desk: { ...prev.desk, notes: e.target.value },
                }))
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-navy-900 placeholder:text-slate-400"
            />
          </div>
        </section>

        {/* Zone 4: Wall & Door */}
        <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden="true">📌</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  4. Wall Hanging &amp; Door Regulations
                </h3>
                <p className="text-xs text-navy-600">Verify permitted fasteners and door hook thickness independently</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                statuses.wallAndDoor.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {statuses.wallAndDoor.badgeLabel}
            </span>
          </div>

          <p className="text-xs text-navy-700 leading-relaxed">{statuses.wallAndDoor.message}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Wall Material</label>
              <select
                value={data.wallAndDoor.wallMaterial}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    wallAndDoor: {
                      ...prev.wallAndDoor,
                      wallMaterial: e.target.value as DormMeasurements['wallAndDoor']['wallMaterial'],
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue bg-white"
              >
                <option value="unconfirmed">Select wall type...</option>
                <option value="drywall">Standard Drywall / Sheetrock</option>
                <option value="cinder-block">Painted Cinder Block</option>
                <option value="brick">Exposed Brick</option>
                <option value="plaster">Older Plaster</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">School Mounting Policy</label>
              <select
                value={data.wallAndDoor.mountingPolicy}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    wallAndDoor: {
                      ...prev.wallAndDoor,
                      mountingPolicy: e.target.value as DormMeasurements['wallAndDoor']['mountingPolicy'],
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue bg-white"
              >
                <option value="unconfirmed">Check housing rule...</option>
                <option value="adhesive-allowed">Adhesive Strips Allowed (Command hooks)</option>
                <option value="pushpins-only">Small Pushpins / Thumb Tacks Only</option>
                <option value="t-pins-only">T-Pins (for fabric wall panels)</option>
                <option value="no-adhesives">No Adhesives or Nails Allowed</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Over-the-Door Hooks Allowed?</label>
              <select
                value={data.wallAndDoor.overDoorHookPermitted}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    wallAndDoor: {
                      ...prev.wallAndDoor,
                      overDoorHookPermitted: e.target.value as DormMeasurements['wallAndDoor']['overDoorHookPermitted'],
                    },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue bg-white"
              >
                <option value="unconfirmed">Select permission...</option>
                <option value="yes">Yes (Permitted by housing manual)</option>
                <option value="no">Prohibited (Fire door seal rules)</option>
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Wall notes (e.g. command strips allowed on sheetrock but not on cinder block walls)..."
              value={data.wallAndDoor.notes}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  wallAndDoor: { ...prev.wallAndDoor, notes: e.target.value },
                }))
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-navy-900 placeholder:text-slate-400"
            />
          </div>
        </section>

        {/* Zone 5: Roommate Shared Floor Space */}
        <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden="true">🤝</span>
              <div>
                <h3 className="text-lg sm:text-xl font-black text-brand-navy">
                  5. Shared Floor Space &amp; Rug Area
                </h3>
                <p className="text-xs text-navy-600">Coordinate floor footprint between both beds and desks</p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full border self-start sm:self-auto ${
                statuses.sharedFloor.status === 'ready'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              {statuses.sharedFloor.badgeLabel}
            </span>
          </div>

          <p className="text-xs text-navy-700 leading-relaxed">{statuses.sharedFloor.message}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Open Center Floor Width (feet)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 5"
                value={data.sharedFloor.openFloorWidthFeet}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    sharedFloor: { ...prev.sharedFloor, openFloorWidthFeet: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-brand-navy block">Open Center Floor Length (feet)</label>
              <input
                type="number"
                min="1"
                step="0.5"
                placeholder="e.g. 7"
                value={data.sharedFloor.openFloorLengthFeet}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    sharedFloor: { ...prev.sharedFloor, openFloorLengthFeet: e.target.value },
                  }))
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Shared space notes (e.g. agreed on 4x6 washable rug, shared 3-tier rolling cart placed between desks)..."
              value={data.sharedFloor.roommateAgreementNotes}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  sharedFloor: { ...prev.sharedFloor, roommateAgreementNotes: e.target.value },
                }))
              }
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 text-navy-900 placeholder:text-slate-400"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
