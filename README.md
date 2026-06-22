# SauceDemo E2E Test Suite

Automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com), built with
Playwright and TypeScript. Covers functional, visual regression, accessibility, and basic
non-functional testing across three browsers.

## Testing types covered
- **Functional / black-box** — login, cart, and checkout flows
- **Smoke** — a fast subset (`@smoke`-tagged) covering the critical happy path: login → add to cart → checkout
- **Regression** — the full suite, run on every push and pull request
- **Negative / boundary** — invalid credentials, empty fields, locked-out users
- **Cross-browser** — Chromium, Firefox, and WebKit via Playwright's multi-browser config
- **Visual regression** — screenshot comparison on the login and inventory pages
- **Accessibility** — automated WCAG checks via axe-core, filtered to critical/serious violations
- **Non-functional (basic)** — a page-load time budget check

## Architecture
Tests are built on the **Page Object Model** — each page of the app has a class holding
its locators and actions, keeping selectors out of the test files and in one maintainable place.

## Tech stack
- [Playwright](https://playwright.dev/) — browser automation
- TypeScript
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) — accessibility scanning
- GitHub Actions — CI, with a smoke-gate-then-regression pipeline

## Setup
```bash
npm install
npx playwright install
```

## Run tests

### Via npm scripts
```bash
npm test                   # full regression suite, headless, all 3 browsers
npm run test:smoke         # fast smoke subset only
npm run test:headed        # watch the browser as tests run
npm run test:report        # open the last HTML report
```

### Direct commands (useful when debugging)
```bash
npx playwright test                                          # full suite
npx playwright test --grep @smoke                            # smoke tests only
npx playwright test --project=chromium                       # one browser at a time
npx playwright test cart.spec.ts --project=chromium          # one spec file
npx playwright test cart.spec.ts --workers=1 --project=chromium  # fully isolated run
npx playwright test performance.spec.ts --workers=1          # performance check in isolation
npx playwright show-report                                   # open HTML report
```

> The suite runs sequentially (`workers: 1`) by default since it hits a live external
> site — parallel runs can produce timing-related flakiness unrelated to actual defects.

## A note on visual regression in CI
Screenshot baselines are OS-specific — Playwright names them `*-linux.png` on CI and
`*-win32.png` locally. This repo includes both sets. If you fork this repo and need to
regenerate the Linux baselines, use the **Update Visual Snapshots** workflow under the
Actions tab (triggers manually via `workflow_dispatch`). It generates and commits the
correct Linux PNGs in one step.

## CI
On every push and PR: a `smoke` job runs first as a fast gate, then a `regression` job
runs the full suite across all three browsers. Regression jobs only run if smoke passes.