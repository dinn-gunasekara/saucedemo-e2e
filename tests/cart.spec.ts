import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

test.describe('Shopping Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('@smoke adds one item to cart', async () => {
    await inventoryPage.addItemByIndex(0);
    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('cart badge reflects multiple items', async () => {
    await inventoryPage.addItemByIndex(0);
    await inventoryPage.addItemByIndex(1);
    await inventoryPage.addItemByIndex(2);
    await expect(inventoryPage.cartBadge).toHaveText('3');
  });

  test('removes an item from cart page', async () => {
    await inventoryPage.addItemByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.removeItemByIndex(0);
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('cart is empty when no items added', async () => {
    await inventoryPage.goToCart();
    await expect(cartPage.cartItems).toHaveCount(0);
  });

  test('sort by price low to high', async () => {
    await inventoryPage.sortBy('lohi');

    await expect.poll(async () => {
      const prices = await inventoryPage.getItemPrices();
      return prices.every((price, i) => i === 0 || price >= prices[i - 1]);
    }, {
      message: 'Expected prices to be sorted in ascending order',
    }).toBe(true);
  });
});