import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to home page', async ({ page }) => {
    const homeLink = page.getByRole('link', { name: 'Home', exact: true });
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('should navigate to boxes page', async ({ page }) => {
    const boxesLink = page.getByRole('link', { name: 'Boxes' });
    await boxesLink.click();
    await expect(page).toHaveURL('/boxes');
  });

  test('should show logo link to home', async ({ page }) => {
    const logo = page.getByRole('heading', { name: 'Sharkbox' }).locator('..');
    await logo.click();
    await expect(page).toHaveURL('/');
  });
});

