# DormReady 🎓

> Practical, trustworthy, and budget-conscious college dorm planning, packing strategies, tech buying guides, and verified student discounts for U.S. college freshmen and parents.

DormReady is a production-grade, fast, accessible static editorial platform built with Astro, TypeScript in strict mode, and Tailwind CSS. It is architected for long-term organic search authority, zero-database simplicity, and seamless deployment to Cloudflare Pages.

---

## 🚀 Technology Stack

- **Framework**: [Astro 5.x](https://astro.build/) (Static Site Generation `output: 'static'`)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with accessible custom warm palette
- **Interactive Islands**: [React 18](https://react.dev/) (Used strictly for the interactive checklist, filter matrices, and search)
- **Testing**: [Vitest](https://vitest.dev/) for unit & data integrity testing
- **SEO & Structured Data**: Native JSON-LD (Organization, WebSite, BreadcrumbList, Article, FAQPage), `@astrojs/sitemap`, OpenGraph & Twitter Cards
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) with static asset caching and preview-mode indexing protection

---

## 📁 Project Structure

```text
dormready/
├── public/
│   ├── _headers                    # Cloudflare Pages security & noindex headers
│   ├── favicon.svg                 # Scalable brand vector icon
│   └── robots.txt                  # Robots directive (Disallow in preview mode)
├── src/
│   ├── components/
│   │   ├── AffiliateDisclosure.astro # Reusable FTC-compliant disclosure banner
│   │   ├── Breadcrumbs.astro       # Accessible semantic breadcrumbs with schema
│   │   ├── ChecklistApp.tsx        # Interactive checklist island (localStorage & print)
│   │   ├── DiscountDirectory.tsx   # Verified student discounts directory island
│   │   ├── LaptopComparison.tsx    # Major-by-major laptop filter matrix island
│   │   ├── GuideCard.astro         # Card component for guide archives
│   │   ├── Header.astro            # Responsive navigation bar with mobile drawer
│   │   ├── Footer.astro            # Structured footer with last-audit timestamps
│   │   └── SeoHead.astro           # Dynamic metadata, canonical, OpenGraph & JSON-LD
│   ├── data/
│   │   ├── checklist.ts            # Typed dorm checklist items across 10 categories
│   │   ├── discounts.ts            # Verified & pending student discount records
│   │   ├── laptops.ts              # Hardware comparison reference profiles
│   │   ├── guides.ts               # Editorial metadata, categories, and reading times
│   │   └── site.ts                 # Global metadata, navigation & env config
│   ├── layouts/
│   │   ├── BaseLayout.astro        # HTML root layout
│   │   └── GuideLayout.astro       # Longform editorial layout with TOC & related guides
│   ├── pages/
│   │   ├── 404.astro               # Custom 404 error page
│   │   ├── about.astro             # Mission & audience standards
│   │   ├── best-laptops-for-college-students.astro # Hardware comparison matrix
│   │   ├── budget/
│   │   │   ├── index.astro         # Budget setups overview ($300, $500, $1,000)
│   │   │   ├── under-300-dorm-setup.astro
│   │   │   ├── under-500-dorm-setup.astro
│   │   │   └── under-1000-complete-setup.astro
│   │   ├── college-dorm-checklist.astro # Interactive master dorm checklist
│   │   ├── college-packing-list.astro   # Packing strategy & carry-on guide
│   │   ├── dorm-room-essentials.astro   # Essentials organized by real daily need
│   │   ├── editorial-policy.astro  # Research methodology & correction policy
│   │   ├── guides/
│   │   │   └── index.astro         # Browsable guide archive with category filters
│   │   ├── index.astro             # Homepage
│   │   ├── privacy.astro           # Starter privacy policy (marked for legal review)
│   │   ├── student-discounts.astro # Verified discount directory
│   │   └── terms.astro             # Starter terms of use (marked for legal review)
│   └── styles/
│       └── global.css              # Global styles, variables, focus rings & print media
├── tests/
│   ├── checklist.test.ts           # Checklist data integrity & fire safety tests
│   ├── discounts.test.ts           # Discount verification tests
│   ├── laptops.test.ts             # Laptop specification tests
│   └── site.test.ts                # Route & slug validation
├── astro.config.mjs
├── package.json
├── tailwind.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10.x or newer

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/heme9999/dormready.git
cd dormready

# Install dependencies cleanly
npm install
```

### 3. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 4. Running Quality Checks
```bash
# Run Vitest test suite
npm run test

# Run TypeScript strict type checking
npm run typecheck

# Run Astro project diagnostics
npm run check

# Run production build
npm run build
```

---

## 🌐 Cloudflare Pages Deployment

### Build Configuration Settings
When connecting the GitHub repository to Cloudflare Pages:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | `Astro` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Node.js Version** | `20` (or `22`) |
| **Root directory** | `/` |

### Environment Variables
- `PUBLIC_SITE_ENV=preview` (Default for preview deployments; activates `noindex, nofollow`, `robots.txt Disallow: /`, and `X-Robots-Tag` header)

---

## 🔒 Indexing Protection & Production Switch Instructions

### Preview Mode (Current Status)
To prevent search engines from indexing the temporary `*.pages.dev` preview domain:
1. `PUBLIC_SITE_ENV` defaults to `preview`.
2. `public/_headers` serves `X-Robots-Tag: noindex, nofollow`.
3. `public/robots.txt` specifies `Disallow: /`.
4. `SeoHead.astro` injects `<meta name="robots" content="noindex, nofollow" />`.

### Switching to Public Production Mode (Custom Domain Launch)
When ready to launch on your official custom domain (e.g., `https://dormready.org`):

1. **Cloudflare Pages Environment Variable**:
   Set `PUBLIC_SITE_ENV=production` in the Cloudflare Pages project settings (Production environment).
2. **Update `public/robots.txt`**:
   ```txt
   User-agent: *
   Allow: /

   Sitemap: https://dormready.org/sitemap-index.xml
   ```
3. **Update `public/_headers`**:
   Remove the `X-Robots-Tag: noindex, nofollow` line from `/*`.
4. **Update `astro.config.mjs`**:
   Set `site: 'https://dormready.org'`.

---

## 📝 Content Editing Workflow

1. **Adding/Editing Checklist Items**: Edit [`src/data/checklist.ts`](file:///src/data/checklist.ts). Each item supports category, need tier (`essential` | `recommended` | `optional`), budget tier (`low` | `mid` | `high`), prohibited item warnings, and roommate coordination tags.
2. **Updating Student Discounts**: Edit [`src/data/discounts.ts`](file:///src/data/discounts.ts). Include brand, verification method (e.g. SheerID, UNiDAYS, .edu), last checked date, and official URL.
3. **Adding Editorial Guides**: Add metadata to [`src/data/guides.ts`](file:///src/data/guides.ts) and create the corresponding page in `src/pages/` using `<GuideLayout>`.

---

## 🔍 Known Placeholders & Items Awaiting Research

In accordance with our [Editorial Policy](file:///src/pages/editorial-policy.astro), no fake specifications, ratings, or testing claims are published:
- **Laptop Hardware Profiles**: Marked as `SPECIFICATION PLACEHOLDER — Pending 2026-2027 Model Testing` with hardware reference baselines.
- **Sample Retail Discounts**: Discount entries `disc-7` and `disc-8` are flagged as `needs_research` for testing the verification workflow.
- **Privacy Policy & Terms**: Starter templates clearly flagged `Starter Policy — Pending Legal Review`.

---

## 📄 License

© 2026 DormReady Editorial Team. All rights reserved.
