import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should display homepage with navigation', async ({ page }) => {
    await page.goto('/');

    // Check navigation elements
    await expect(page.getByRole('heading', { name: 'Sharkbox' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Home', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Boxes' })).toBeVisible();
  });

  test('should show login button when not authenticated', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('should navigate to login page when login button is clicked', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await loginButton.click();

    // Should redirect to login/OIDC flow (Keycloak or generic OIDC authorize URL)
    await expect(page).toHaveURL(/(\/login|\/protocol\/openid-connect\/auth)/);
  });

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeButton).toBeVisible();
  });

  test('should toggle theme when theme button is clicked', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.getByRole('button', { name: 'Toggle theme' });
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    
    await themeButton.click();
    
    await page.waitForTimeout(100); // Wait for theme change
    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    
    expect(newTheme).not.toBe(initialTheme);
  });
});

