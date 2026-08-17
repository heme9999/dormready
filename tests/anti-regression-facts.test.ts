import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

function getAllSourceFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getAllSourceFiles(filePath, fileList);
    } else if (/\.(astro|tsx|ts|html|css|md)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

describe('Anti-Regression Truth & Factual Integrity Scan', () => {
  const srcDir = path.resolve(__dirname, '../src');
  const sourceFiles = getAllSourceFiles(srcDir);

  const BANNED_PATTERNS = [
    { pattern: /virtually all U\.S\./i, label: 'virtually all U.S.' },
    { pattern: /standard 130–180/i, label: 'standard 130–180' },
    { pattern: /150 sq ft/i, label: '150 sq ft' },
    { pattern: /10x easier/i, label: '10x easier' },
    { pattern: /10 to 36 inches/i, label: '10 to 36 inches' },
    { pattern: /10–12ft/i, label: '10–12ft' },
    { pattern: /frequently run out/i, label: 'frequently run out' },
    { pattern: /must remain in carry-on luggage/i, label: 'must remain in carry-on luggage' },
    { pattern: /original labeled pharmacy bottles; never check/i, label: 'original labeled pharmacy bottles; never check' },
    { pattern: /Never fly with heavy liquid bottles/i, label: 'Never fly with heavy liquid bottles' },
    { pattern: /electrical capacity for one mini-fridge/i, label: 'electrical capacity for one mini-fridge' },
    { pattern: /Generated locally via DormReady \(https:\/\/dormready\.org\)/i, label: 'Generated locally via DormReady (https://dormready.org)' },
    { pattern: /Mini Scissors \/ Box Cutter/i, label: 'Mini Scissors / Box Cutter' },
    { pattern: /Must be arranged with hometown physician/i, label: 'Must be arranged with hometown physician' },
    { pattern: /Required on Day 1 for campus residence check-in and student employment/i, label: 'Required on Day 1 for campus residence check-in and student employment' },
    { pattern: /typically 4 suitemates/i, label: 'typically 4 suitemates' },
    { pattern: /2 full bath towels/i, label: '2 full bath towels' },
    { pattern: /2 washcloths/i, label: '2 washcloths' },
    { pattern: /doors lock automatically/i, label: 'doors lock automatically' },
    { pattern: /outlets in communal baths are limited/i, label: 'outlets in communal baths are limited' },
    { pattern: /10-pound/i, label: '10-pound' },
    { pattern: /2-minute/i, label: '2-minute' },
    { pattern: /used 1x daily/i, label: 'used 1x daily' },
    { pattern: /used 2–3x daily/i, label: 'used 2–3x daily' },
    { pattern: /humidity degrades sensitive products/i, label: 'humidity degrades sensitive products' },
    { pattern: /protects your security deposit/i, label: 'protects your security deposit' },
    { pattern: /protects your housing deposit/i, label: 'protects your housing deposit' },
  ];

  it('ensures no banned ungrounded generalizations or unverified assertions exist in src/', () => {
    const violations: { file: string; match: string }[] = [];

    for (const filePath of sourceFiles) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const { pattern, label } of BANNED_PATTERNS) {
        if (pattern.test(content)) {
          violations.push({ file: path.relative(srcDir, filePath), match: label });
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('verifies that all Sprint 1 and Sprint 2 pages include the PolicyNotice component', () => {
    const allSprintFiles = [
      path.join(srcDir, 'pages/what-not-to-bring-to-college-dorm.astro'),
      path.join(srcDir, 'pages/what-to-buy-before-vs-after-moving-into-dorm.astro'),
      path.join(srcDir, 'pages/college-dorm-roommate-checklist.astro'),
      path.join(srcDir, 'pages/college-move-in-day-checklist.astro'),
      path.join(srcDir, 'pages/community-bathroom-college-essentials.astro'),
      path.join(srcDir, 'pages/small-dorm-room-storage-ideas.astro'),
    ];

    for (const filePath of allSprintFiles) {
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content).toContain('<PolicyNotice');
    }
  });

  it('verifies what-not-to-bring page contains verified university citations with checked dates', () => {
    const pagePath = path.join(srcDir, 'pages/what-not-to-bring-to-college-dorm.astro');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('University of Illinois');
    expect(content).toContain('University of Michigan');
    expect(content).toContain('UT Austin');
    expect(content).toContain('Checked August 17, 2026');
  });

  it('verifies what-to-buy-before-vs-after page contains FAA, TSA, and TSA utility knives regulatory references', () => {
    const pagePath = path.join(srcDir, 'pages/what-to-buy-before-vs-after-moving-into-dorm.astro');
    const content = fs.readFileSync(pagePath, 'utf-8');

    expect(content).toContain('https://www.faa.gov/hazmat/packsafe/portable-electronic-devices-with-batteries');
    expect(content).toContain('https://www.tsa.gov/news/press/factsheets/tsa-travel-tips');
    expect(content).toContain('https://www.tsa.gov/travel/security-screening/whatcanibring/items/utility-knivesknife');
    expect(content).toContain('Box cutters and utility knives are not permitted in carry-on baggage');
    expect(content).toContain('Checked August 17, 2026');

    // Ensure Night-One Checklist does NOT recommend box cutter or scissors
    const nightOneMatch = content.match(/title="The Essential 'Night-One Carry-On' Checklist"[\s\S]*?<\/VisualCallout>/);
    expect(nightOneMatch).not.toBeNull();
    const nightOneText = nightOneMatch![0];
    expect(nightOneText).not.toContain('Box Cutter');
    expect(nightOneText).not.toContain('Mini Scissors');
    expect(nightOneText).toContain('✓ Packing Tape');

    // Generated file must not contain the old item string
    expect(content).not.toContain('Mini Scissors / Box Cutter');
    expect(content).not.toContain('Box Cutter & Tape');
  });
});
