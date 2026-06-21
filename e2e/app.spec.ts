import { test, expect } from '@playwright/test';

test('has title and onboarding', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/sustainable-steps/);

  // Expect onboarding to be visible
  await expect(page.locator('h1')).toContainText('Carbon Footprint Tracker');
});
