import { test, expect } from '@playwright/test';

// A lightweight non-functional check — not a substitute for real load
// testing, but demonstrates awareness that "does it work" and "does it
// work fast enough" are different questions.
//
// This budget is intentionally generous (10s), and the test is most
// meaningful run in isolation or in CI, where each browser gets its own
// dedicated runner. Under heavy local parallel load — multiple browsers
// competing for one machine's resources — timing swings wildly; that's
// system contention, not a defect in the page. For a clean local read:
// npx playwright test performance.spec.ts --workers=1
test('login page loads within an acceptable time budget', async ({ page }) => {
  const start = Date.now();
  await page.goto('/', { waitUntil: 'load' });
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(10000); // 10s — generous; see note above
});