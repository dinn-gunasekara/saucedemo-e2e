import { test, expect } from '@playwright/test';

// A lightweight non-functional check — not a substitute for real load
// testing, but demonstrates awareness that "does it work" and "does it
// work fast enough" are different questions.
test('login page loads within an acceptable time budget', async ({ page }) => {
  const start = Date.now();
  await page.goto('/', { waitUntil: 'load' });
  const loadTime = Date.now() - start;
  expect(loadTime).toBeLessThan(3000); // 3 second budget
});