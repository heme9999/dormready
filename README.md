# DormReady 🎓

> Practical, trustworthy, and budget-conscious college dorm planning, packing strategies, tech buying guides, and verified student discounts for U.S. college freshmen and parents.

DormReady is a fast, accessible static editorial platform built with Astro 7.x, TypeScript in strict mode, and Tailwind CSS. It is architected for long-term organic search authority, zero-database simplicity, and seamless deployment to Cloudflare Pages.

---

## 🚀 Technology Stack & Runtime

- **Framework**: [Astro 7.x](https://astro.build/) (Static Site Generation `output: 'static'`)
- **Runtime**: Node.js `>=22.12.0` (Pinned via `.nvmrc` to Node 22 LTS)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with accessible custom warm palette
- **Interactive Islands**: [React 18](https://react.dev/) (Used strictly for the interactive checklist, filter matrices, and search)
- **Testing**: [Vitest](https://vitest.dev/) for unit, integration, and build artifact auditing
- **SEO & Structured Data**: Native JSON-LD (Organization, WebSite, BreadcrumbList, Article, FAQPage), `@astrojs/sitemap`, OpenGraph (1200×630) & Twitter Cards
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) with dynamic build-time indexing and security headers

---

## 📁 Project Structure

```text
dormready/
├── public/
│   ├── favicon.svg                 # Scalable brand vector icon
│   └── images/
│       └── dormready-og.png        # 1200x630 Open Graph sharing image
├── src/
│   ├── components/
│   │   ├── AffiliateDisclosure.astro # Reusable FTC-compliant disclosure banner
│   │   ├── Breadcrumbs.astro       # Accessible semantic breadcrumbs with schema
│   │   ├── ChecklistApp.tsx        # Interactive checklist island (localStorage & print)
│   │   ├── DiscountDirectory.tsx   # Verified student discounts directory island
│   │   ├── LaptopComparison.tsx    # Major-by-major laptop filter matrix island
│   │   ├── GuideCard.astro         # Card component for guide archives
│   │   ├── Header.astro            # Responsive navigation bar with mobile drawer
│   │   ├── Footer.astro            # Structured footer with audit timestamps & repo links
│   │   └── SeoHead.astro           # Dynamic metadata, canonical, OpenGraph & JSON-LD
│   ├── data/
│   │   ├── checklist.ts            # Typed dorm checklist items across 10 categories
│   │   ├── discounts.ts            # Audited student discount records
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
│   ├── checklist-logic.test.ts     # Checklist math, filtering & state tests
│   ├── discounts.test.ts           # Discount verification tests (no example.com, audited fields)
│   ├── dist-html-audit.test.ts     # Rendered HTML audit (internal links, no fake alert, OG tags)
│   ├── indexing-build.test.ts      # Preview vs production build output verification
│   ├── laptops.test.ts             # Laptop specification target tests
│   └── site.test.ts                # Route & slug validation
├── .nvmrc                          # Pinned to Node 22 LTS (22.23.1)
├── astro.config.mjs                # Astro configuration with build-time indexing hook
├── package.json
├── postcss.config.cjs
├── tailwind.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

---

## 💻 Local Development

### 1. Prerequisites
- **Node.js**: `v22.12.0+` (Run `nvm use` to activate `.nvmrc`)
- **npm**: `v10.x` or newer

### 2. Clean Installation
```bash
npm ci
```

### 3. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### 4. Running Quality Checks
```bash
# Run Vitest automated test suite (24 tests)
npm run test

# Run TypeScript strict type checking
npm run typecheck

# Run Astro project diagnostics
npm run check

# Run production static build
npm run build

# Run security audit (0 vulnerabilities)
npm run audit
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
| **Root directory** | `/` |

### Environment Variables
Set the following environment variables in Cloudflare Pages (**Settings > Environment variables**):

| Variable | Preview Value | Production Value | Purpose |
| :--- | :--- | :--- | :--- |
| `NODE_VERSION` | `22` | `22` | Sets Cloudflare build environment to Node 22 LTS |
| `PUBLIC_SITE_ENV` | `preview` | `production` | **Single source of truth** for robots, headers & meta indexing |
| `PUBLIC_SITE_URL` | `https://dormready-preview.pages.dev` | `https://dormready.org` | Sets canonical URLs and XML sitemap |

---

## 🔒 Indexing Protection & Launch Instructions

### Preview Mode (Default)
When `PUBLIC_SITE_ENV=preview` (or unset), the build hook automatically generates:
1. `dist/robots.txt` containing `User-agent: *\nDisallow: /`
2. `dist/_headers` containing `X-Robots-Tag: noindex, nofollow`
3. HTML `<meta name="robots" content="noindex, nofollow" />` on every page

### Switching to Public Production Mode (Custom Domain Launch)
To switch the site to indexable production, **no manual code edits are required across files**:

1. In the Cloudflare Pages dashboard for the production environment, set:
   ```env
   PUBLIC_SITE_ENV=production
   PUBLIC_SITE_URL=https://dormready.org
   NODE_VERSION=22
   ```
2. Trigger a production build.
3. The build hook will automatically output:
   - `dist/robots.txt` with `User-agent: *\nAllow: /\n\nSitemap: https://dormready.org/sitemap-index.xml`
   - `dist/_headers` with NO `X-Robots-Tag` header
   - HTML `<meta name="robots" content="index, follow..." />`

---

## 📝 Content Editing Workflow

1. **Checklist Items**: Edit [`src/data/checklist.ts`](file:///src/data/checklist.ts).
2. **Student Discounts**: Edit [`src/data/discounts.ts`](file:///src/data/discounts.ts). All entries must include `checkedAt`, `officialSourceUrl`, `offerSummary`, `priceOrDiscount`, and `eligibilitySummary`.
3. **Hardware Profiles**: Edit [`src/data/laptops.ts`](file:///src/data/laptops.ts). Profiles are labeled as specification targets for student research.
4. **Editorial Guides**: Add metadata to [`src/data/guides.ts`](file:///src/data/guides.ts) and create the corresponding page in `src/pages/`.

---

## 📄 License

© 2026 DormReady Editorial Team. All rights reserved.
