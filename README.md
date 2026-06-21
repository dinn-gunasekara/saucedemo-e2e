# SauceDemo E2E Test Suite

Automated end-to-end test suite for [SauceDemo](https://www.saucedemo.com), built with Playwright and TypeScript. Covers functional, visual regression, accessibility, and basic non-functional testing across three browsers.

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

Tests are built on the **Page Object Model** — each page of the app has a class holding its locators and actions, keeping selectors out of the test files and in one maintainable place.

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

```bash
npm test                  # full regression suite, headless
npm run test:smoke        # fast smoke subset only
npm run test:headed       # see the browser
npm run test:report       # open HTML report
```

## A note on visual regression in CI

Screenshot baselines were generated locally and may need regenerating if you fork this repo, since rendering can differ slightly across operating systems. A `maxDiffPixelRatio` tolerance is configured to absorb minor anti-aliasing differences. For guaranteed pixel-for-pixel consistency, generate baselines inside the same environment CI runs in (e.g. the official Playwright Docker image).

## CI

On every push and PR: a `smoke` job runs first as a fast gate, then a `regression` job runs the full suite across all three browsers.