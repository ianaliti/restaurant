import { test, expect } from '@playwright/test';

test('should navigate to restaurants and view dishes', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/restaurants');

  await expect(page).toHaveTitle(/Restaurants/);

  const restaurantLink = page.locator('a[href*="/restaurants/"]').first();
  await restaurantLink.click();

  await expect(page).toHaveURL(/\/restaurants\/\d+/);
});

test('should add dish to cart from dish detail page', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/restaurants');

  const restaurantLink = page.locator('a[href*="/restaurants/"]').first();
  await restaurantLink.click();

  await page.waitForURL(/\/restaurants\/\d+/);

  const dishLink = page.locator('a[href*="/plat/"]').first();
  if (await dishLink.isVisible()) {
    await dishLink.click();
    await page.waitForURL(/\/plat\/\d+/);

    const addToCartButton = page.getByRole('button', { name: /Ajouter|Add/ });
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
    }
  }
});

test('should view cart page', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/cart');

  await expect(page).toHaveURL(/\/cart/);
});

test('should navigate to restaurant detail page', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/restaurants');

  const restaurantLink = page.locator('a[href*="/restaurants/"]').first();
  await restaurantLink.click();

  await expect(page).toHaveURL(/\/restaurants\/\d+/);
});

test('should access login page', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/login');

  await expect(page).toHaveURL(/\/login/);
  
  const emailInput = page.locator('input[type="email"]');
  await expect(emailInput).toBeVisible();
});

test('should access register page', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/login/register');

  await expect(page).toHaveURL(/\/register/);
  
  const nameInput = page.locator('input').first();
  await expect(nameInput).toBeVisible();
});

test('should allow language switching', async ({ page }) => {
  await page.goto('http://localhost:3000/fr/restaurants');

  const langButton = page.getByRole('button', { name: /EN|FR/ });
  if (await langButton.isVisible()) {
    await langButton.click();
    await expect(page).toHaveURL(/\/en\//);
  }
});


test.describe('Customer Journey - Browse, Add to Cart, and Order', () => {
  test('should complete full customer journey: browse restaurants, add dish to cart, and view cart', async ({ page }) => {
    await page.goto('http://localhost:3000/fr/restaurants');

    await expect(page).toHaveTitle(/Restaurants/);

    const restaurantLink = page.locator('a[href*="/restaurants/"]').first();
    await restaurantLink.click();

    await page.waitForURL(/\/restaurants\/\d+/);

    const dishLink = page.locator('a[href*="/plat/"]').first();
    if (await dishLink.isVisible()) {
      await dishLink.click();
      await page.waitForURL(/\/plat\/\d+/);

      const addToCartButton = page.getByRole('button', { name: /Ajouter|Add/ });
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
      }

      await page.goto('http://localhost:3000/fr/cart');
      await expect(page).toHaveURL(/\/cart/);
    }
  });
});

test.describe('Admin Journey - Manage Restaurateurs', () => {
  test('should login as admin, view restaurateurs, and navigate to create restaurateur page', async ({ page }) => {
    await page.goto('http://localhost:3000/fr/login');

    await page.fill('input[type="email"]', 'admin@restodigital.com');
    await page.fill('input[type="password"]', 'admin123');
    
    const loginButton = page.locator('button[type="submit"]').or(page.getByRole('button', { name: /Connexion|Login/ }));
    await loginButton.click();

    await page.waitForURL(/\/admin/, { timeout: 15000 });

    await expect(page).toHaveURL(/\/admin/);

    const restaurateursTable = page.locator('table');
    await expect(restaurateursTable).toBeVisible();

    const addRestaurateurLink = page.locator('a[href*="/new-restaurant"]');
    if (await addRestaurateurLink.isVisible()) {
      await addRestaurateurLink.click();
      await page.waitForURL(/\/new-restaurant/);
      await expect(page).toHaveURL(/\/new-restaurant/);
    }
  });
});

test.describe('Restaurateur Journey - Manage Plats and View Orders', () => {
  test('should login as restaurateur, view plats, navigate to create plat page, and view orders', async ({ page }) => {
    await page.goto('http://localhost:3000/fr/login');

    await page.fill('input[type="email"]', 'restaurateur@restodigital.com');
    await page.fill('input[type="password"]', 'resto123');
    
    const loginButton = page.locator('button[type="submit"]').or(page.getByRole('button', { name: /Connexion|Login/ }));
    await loginButton.click();

    await page.waitForURL(/\/restaurateur/, { timeout: 15000 });

    await expect(page).toHaveURL(/\/restaurateur/);

    const platsLink = page.locator('a[href*="/plats"]').first();
    if (await platsLink.isVisible()) {
      await platsLink.click();
      await page.waitForURL(/\/plats/);

      const addPlatLink = page.locator('a[href*="/new-plat"]').first();
      if (await addPlatLink.isVisible()) {
        await addPlatLink.click();
        await page.waitForURL(/\/new-plat/);
        await expect(page).toHaveURL(/\/new-plat/);
      }

      const ordersLink = page.locator('a[href*="/commandes"]').first();
      if (await ordersLink.isVisible()) {
        await ordersLink.click();
        await page.waitForURL(/\/commandes/);
        await expect(page).toHaveURL(/\/commandes/);
      }
    }
  });
});
