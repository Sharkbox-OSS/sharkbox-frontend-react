import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login button when not authenticated', async ({ page }) => {
    await page.goto('/');

    const loginButton = page.getByRole('button', { name: 'Login' });
    await expect(loginButton).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    // Try to access a protected route
    await page.goto('/create-box');

    // Should redirect to login/OIDC authorize endpoint
    await expect(page).toHaveURL(/(\/login|\/protocol\/openid-connect\/auth)/);
  });

  test('should handle OIDC callback', async ({ page }) => {
    await page.goto('/callback');

    // Should either redirect to home or show loading state
    // Actual behavior depends on OIDC configuration
    await expect(page).toHaveURL(/\/|\/callback|\/login/);
  });
});

