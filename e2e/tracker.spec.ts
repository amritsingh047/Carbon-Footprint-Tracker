import { test, expect } from '@playwright/test';

test.describe('Carbon Footprint Tracker E2E', () => {
  test('should load onboarding and log an action', async ({ page }) => {
    // Navigate to app
    await page.goto('/');

    // Check onboarding title
    await expect(page.locator('h1')).toContainText('Carbon Footprint Tracker');

    // Fill onboarding form
    await page.getByLabel('Monthly Electricity').fill('300');
    await page.getByLabel('Weekly Driving').fill('50');
    await page.getByLabel('Round-trip Flights').fill('2');
    
    // Submit onboarding
    const getStartedBtn = page.locator('button', { hasText: 'Get Started' });
    await getStartedBtn.click();

    // Verify dashboard loads
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Switch to Actions tab
    await page.locator('button', { hasText: 'Daily Actions' }).click();

    // Log an action (e.g. Vegetarian Meal)
    await page.locator('button', { hasText: 'Vegetarian Meal' }).click();

    // Verify streak or points updated (streak starts at 1)
    await expect(page.locator('text=1 days')).toBeVisible();
    
    // Switch to Dashboard to see chart
    await page.locator('button', { hasText: 'Dashboard' }).click();
    
    // Chart should be visible (we look for the aria-label on the chart container)
    await expect(page.locator('[aria-label*="line chart"]')).toBeVisible();
  });
});
