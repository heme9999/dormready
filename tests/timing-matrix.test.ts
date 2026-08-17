import { describe, it, expect } from 'vitest';
import { TIMING_DATA, filterTimingItems } from '../src/lib/timingMatrix';

describe('Timing Matrix Filtering, Search & Aviation Rule Logic (Shared Module)', () => {
  it('contains exactly 15 verified timing items mapped to 4 core phases', () => {
    expect(TIMING_DATA.length).toBe(15);
    const beforeCount = TIMING_DATA.filter((i) => i.category === 'before').length;
    const assignmentCount = TIMING_DATA.filter((i) => i.category === 'assignment').length;
    const afterCount = TIMING_DATA.filter((i) => i.category === 'after').length;
    const coordinateCount = TIMING_DATA.filter((i) => i.category === 'coordinate').length;

    expect(beforeCount).toBe(6);
    expect(assignmentCount).toBe(3);
    expect(afterCount).toBe(3);
    expect(coordinateCount).toBe(3);
    expect(beforeCount + assignmentCount + afterCount + coordinateCount).toBe(15);
  });

  it('filters items correctly by category tab', () => {
    const all = filterTimingItems(TIMING_DATA, 'all', '');
    expect(all.length).toBe(15);

    const before = filterTimingItems(TIMING_DATA, 'before', '');
    expect(before.length).toBe(6);
    expect(before.every((i) => i.category === 'before')).toBe(true);

    const assignment = filterTimingItems(TIMING_DATA, 'assignment', '');
    expect(assignment.length).toBe(3);
    expect(assignment.every((i) => i.category === 'assignment')).toBe(true);

    const after = filterTimingItems(TIMING_DATA, 'after', '');
    expect(after.length).toBe(3);
    expect(after.every((i) => i.category === 'after')).toBe(true);

    const coordinate = filterTimingItems(TIMING_DATA, 'coordinate', '');
    expect(coordinate.length).toBe(3);
    expect(coordinate.every((i) => i.category === 'coordinate')).toBe(true);
  });

  it('filters items accurately with case-insensitive search queries', () => {
    const searchFridge = filterTimingItems(TIMING_DATA, 'all', 'fridge');
    expect(searchFridge.length).toBe(1);
    expect(searchFridge[0].name).toContain('Mini-Fridge');

    const searchMed = filterTimingItems(TIMING_DATA, 'all', 'prescription');
    expect(searchMed.length).toBe(1);
    expect(searchMed[0].id).toBe('t-1');

    const searchType = filterTimingItems(TIMING_DATA, 'all', 'Cleaning');
    expect(searchType.length).toBe(2); // Detergent & Vacuum
  });

  it('combines category and search filters simultaneously', () => {
    // Search for "cleaning" inside "after" category -> only liquid sprays/detergent
    const filtered = filterTimingItems(TIMING_DATA, 'after', 'cleaning');
    expect(filtered.length).toBe(1);
    expect(filtered[0].id).toBe('t-10');

    // Search for "cleaning" inside "coordinate" category -> only Swiffer/vacuum
    const coordFiltered = filterTimingItems(TIMING_DATA, 'coordinate', 'cleaning');
    expect(coordFiltered.length).toBe(1);
    expect(coordFiltered[0].id).toBe('t-15');
  });

  it('provides precise FAA and TSA aviation guidance without false universal mandates', () => {
    const meds = TIMING_DATA.find((i) => i.id === 't-1');
    expect(meds?.flyingTip).toContain('Keep essential medication accessible in carry-on baggage when practical');
    expect(meds?.flyingTip).toContain('TSA permits medications in carry-on baggage');
    expect(meds?.flyingTip).not.toContain('original labeled pharmacy bottles; never check');

    const laptop = TIMING_DATA.find((i) => i.id === 't-3');
    expect(laptop?.flyingTip).toContain('FAA recommends keeping laptops and other devices containing lithium batteries in accessible carry-on baggage');
    expect(laptop?.flyingTip).toContain('Spare lithium batteries and power banks must remain in carry-on baggage');
    expect(laptop?.flyingTip).not.toBe('Lithium-ion batteries must remain in carry-on luggage per FAA regulations.');

    const liquids = TIMING_DATA.find((i) => i.id === 't-10');
    expect(liquids?.flyingTip).toContain('Bulky cleaning liquids are often easier to purchase after arrival');
    expect(liquids?.flyingTip).toContain('Check TSA, FAA and airline rules before packing');
    expect(liquids?.flyingTip).not.toContain('Never fly with heavy liquid bottles');

    const appliance = TIMING_DATA.find((i) => i.id === 't-13');
    expect(appliance?.reason).toContain('Coordinate shared appliances with your roommate');
    expect(appliance?.reason).not.toContain('electrical capacity for one');
  });
});
