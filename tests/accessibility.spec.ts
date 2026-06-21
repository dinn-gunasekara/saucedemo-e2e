import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { LoginPage } from '../pages/LoginPage';

// Accessibility testing: confirms pages meet baseline WCAG rules
// (colour contrast, alt text, ARIA roles, label associations).
// This is non-functional testing — a page can "work" perfectly
// and still be unusable with a screen reader.
test.describe('Accessibility', () => {
  test('login page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(critical).toEqual([]);
  });

  test('inventory page has no unexpected critical accessibility violations', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    const results = await new AxeBuilder({ page }).analyze();
    const critical = results.violations.filter(
      v => v.impact === 'critical' || v.impact === 'serious'
    );

    // Known, pre-existing issue in SauceDemo itself: the sort dropdown has
    // no accessible name (no <label>, aria-label, or title attribute).
    // This is a real WCAG violation in the site under test, not something
    // this suite can fix. Documenting it explicitly here — rather than
    // loosening the assertion generally — keeps the test honest: it still
    // fails on any NEW critical/serious violation that shows up.
    const knownIssueIds = ['select-name'];
    const unexpected = critical.filter(v => !knownIssueIds.includes(v.id));

    expect(unexpected).toEqual([]);
  });
});