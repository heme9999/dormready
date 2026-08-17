# DormReady Visual Asset Manifest

This document records the ownership, creation methodology, dimensions, and licensing status for every static graphic and illustration asset stored under `public/images/`.

All custom illustrations and vector infographics in this project were designed and authored directly as code for DormReady.

---

## Complete Asset Inventory

| File Path | Dimensions | Creator / Owner | Creation Method | License | Commercial-Use Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `public/images/hero-dorm-movein.svg` | 720 × 520 px | DormReady Project | Handcrafted SVG Code (Tailwind & custom geometry) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady website, editorial guides, and official social sharing. |
| `public/images/dormready-og.png` | 1200 × 630 px | DormReady Project | Generated Open Graph Social Card | Copyright © 2026 DormReady. All rights reserved. | Approved for social media link previews and metadata. |
| `public/images/guides/checklist-box.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/what-not-to-bring.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code (Prohibited items shield) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/before-vs-after.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code (Buy before vs after comparison) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/roommate-checklist.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code (Roommate coordination cards) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/packing-luggage.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/dorm-essentials.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code (5 Functional Zones Blueprint) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/laptop-desk.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/budget-planner.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/guides/student-discounts.svg` | 640 × 360 px (16:9) | DormReady Project | Handcrafted SVG Code | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady guides, checklists, and editorial cards. |
| `public/images/diagrams/carryon-bag.svg` | 600 × 380 px | DormReady Project | Handcrafted SVG Code (Night-One Survival Diagram) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady packing guides and printable aids. |
| `public/images/diagrams/editorial-flow.svg` | 680 × 140 px | DormReady Project | Handcrafted SVG Code (3-Stage Review Process) | Copyright © 2026 DormReady. All rights reserved. | Approved for DormReady editorial policy and about pages. |

---

## Usage Guidelines & Standards

1. **No External Image CDNs**: All images must remain local static files served directly by the Cloudflare Pages edge.
2. **Scalability**: All diagram and thumbnail assets are written in pure vector SVG format to ensure razor-sharp rendering on high-DPI (Retina) screens without rasterization artifacts.
3. **Accessibility**: Every image embedded in an Astro template must include descriptive, contextual `alt` text explaining the diagram's content to screen readers.
4. **Dimensions & Aspect Ratios**: All guide thumbnails strictly adhere to the 16:9 aspect ratio (`640 × 360 px`) to guarantee predictable layout rendering and prevent Cumulative Layout Shift (CLS).
