import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Content Sprint 2 Routes & Policy Guardrails Audit', () => {
  const pagesDir = path.resolve(__dirname, '../src/pages');

  it('verifies the existence of all 3 Sprint 2 pages', () => {
    const expectedPages = [
      'college-move-in-day-checklist.astro',
      'community-bathroom-college-essentials.astro',
      'small-dorm-room-storage-ideas.astro',
    ];

    for (const page of expectedPages) {
      const fullPath = path.join(pagesDir, page);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });

  it('ensures all 3 Sprint 2 pages include the PolicyNotice component', () => {
    const sprint2Files = [
      'college-move-in-day-checklist.astro',
      'community-bathroom-college-essentials.astro',
      'small-dorm-room-storage-ideas.astro',
    ];

    for (const file of sprint2Files) {
      const content = fs.readFileSync(path.join(pagesDir, file), 'utf-8');
      expect(content).toContain('<PolicyNotice');
    }
  });

  it('verifies move-in-day page includes official campus sources and correct SVG diagram', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'college-move-in-day-checklist.astro'), 'utf-8');
    expect(content).toContain('UT Austin');
    expect(content).toContain('University of Illinois');
    expect(content).toContain('University of Michigan');
    expect(content).toContain('Checked August 17, 2026');
    expect(content).toContain('/images/diagrams/movein-timeline.svg');
  });

  it('verifies community-bathroom page includes verified sources and avoids medical/count claims', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'community-bathroom-college-essentials.astro'), 'utf-8');
    expect(content).toContain('UT Austin Housing');
    expect(content).toContain('University of Illinois Housing');
    expect(content).toContain('ACT College Planning Resources');
    expect(content).toContain('Checked August 17, 2026');
    expect(content).toContain('/images/diagrams/bathroom-routine.svg');

    // Truth boundary checks: no medical guarantees or fixed people counts
    expect(content).not.toContain('prevent foot fungus');
    expect(content).not.toContain('guaranteed to stop infections');
    expect(content).not.toContain('shared by exactly');
  });

  it('verifies small-dorm-storage page includes IKEA & housing sources and avoids blanket dimensions', () => {
    const content = fs.readFileSync(path.join(pagesDir, 'small-dorm-room-storage-ideas.astro'), 'utf-8');
    expect(content).toContain('IKEA Small Space Organization Principles');
    expect(content).toContain('University of Illinois Housing');
    expect(content).toContain('UT Austin Residence Hall Resources');
    expect(content).toContain('Checked August 17, 2026');
    expect(content).toContain('/images/diagrams/storage-measurement.svg');

    // Truth boundary checks: no nationalized blanket dimensions
    expect(content).not.toContain('standard 150 sq ft');
    expect(content).not.toContain('standard bed clearance is 14 inches');
  });
});
