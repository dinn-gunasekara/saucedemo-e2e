import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Visual regression: catches unintended UI shifts that functional
// assertions wouldn't notice on their own.
test.describe('Visual regression', () => {
  test('login page matches baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('inventory page matches baseline', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveScreenshot('inventory-page.png');
  });
});