# XTIR Premium Backlog

## Objective
Bring the site to a premium, trustworthy, high-performance level with low regression risk.

## Priority Matrix
| Priority | Theme | Impact | Effort | Status |
|---|---|---:|---:|---|
| P0 | Visual hierarchy (hero, cards, spacing) | High | Medium | In progress |
| P0 | Accessibility baseline (skip link, keyboard states, motion safety) | High | Low | In progress |
| P0 | SEO trust layer (canonical safety + JSON-LD + metadata) | High | Low | In progress |
| P0 | Build and dist guard reliability | High | Low | Active |
| P1 | Catalog and gallery micro-interactions | Medium | Medium | In progress |
| P1 | Performance budget (image sizes, lazy visibility, reduced JS boot pressure) | Medium | Medium | In progress |
| P1 | E2E smoke for critical routes | Medium | Low | In progress |
| P2 | Visual regression snapshots baseline | Medium | Low | In progress |
| P2 | Content trust badges/case studies expansion | Medium | Medium | Planned |
| P2 | Contact form analytics + conversion events | Medium | Medium | Planned |

## Implemented In This Pass
- Header tri-color strip restored as integrated header element.
- Hero readability and depth improvements with lightweight interactive tech canvas.
- Gallery clarity improvements (no dull dimming, subtle depth, gentle desktop tilt).
- Skip-link and keyboard navigation robustness.
- Structured data (`Organization`, `WebSite`) and metadata polish.
- Product catalog interaction/accessibility improvements.
- New smoke and visual baseline scripts using existing Playwright.

## Next Iteration With Screenshots
1. Collect screenshots (desktop/mobile) and mark exact “too much / too little” zones.
2. Tune typography scale, spacing rhythm, and contrast per section.
3. Final polish pass with visual deltas only.
