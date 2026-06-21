import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('Checkout Flow', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    await inventoryPage.addItemByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.proceedToCheckout();
  });

  test('@smoke completes full checkout successfully', async () => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '12345');
    await checkoutPage.finish();
    await expect(checkoutPage.successMessage).toContainText('Thank you for your order');
  });

  test('shows error when first name is missing', async () => {
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await expect(checkoutPage.errorMessage).toContainText('First Name is required');
  });

  test('shows error when last name is missing', async () => {
    await checkoutPage.fillShippingInfo('John', '', '12345');
    await expect(checkoutPage.errorMessage).toContainText('Last Name is required');
  });

  test('shows error when postal code is missing', async () => {
    await checkoutPage.fillShippingInfo('John', 'Doe', '');
    await expect(checkoutPage.errorMessage).toContainText('Postal Code is required');
  });
});