# XTIR Release Checklist

## Pre-Release
1. `npm run type-check`
2. `npm run verify:both`
3. `npm run e2e:smoke`
4. `npm run visual:baseline` (optional for visual audit)

## Manual QA
1. Desktop and mobile check: `/`, `/products/`, `/gallery/`, `/contact/`
2. Header: tri-color strip stays 6px and does not affect layout height.
3. Hero: text remains dominant and fully readable.
4. Gallery: hover/tilt is subtle and disabled for reduced motion and touch devices.
5. Keyboard navigation: skip-link, menu button, focus visibility.

## Regression Safety
1. Canonical URLs point to `https://x-tir.ru`.
2. No root-relative leaks in GH base mode.
3. Dist internal links and anchors are valid.
4. `withBase` semantics are unchanged.

## Deploy
1. Merge to `main`.
2. Verify GitHub Actions build artifacts.
3. Post-deploy spot check production homepage and products page.
