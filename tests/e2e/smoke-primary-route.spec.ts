import { test, expect } from '@playwright/test';

const primaryRoute = process.env.PRIMARY_UI_ROUTE || '/';

test('E2E smoke: primary UI route loads', async ({ page }) => {
  const res = await page.goto(primaryRoute, { waitUntil: 'domcontentloaded' });
  expect(res?.status() || 200).toBeLessThan(500);

  // Basic sanity: title exists and body is visible
  await expect(page.locator('body')).toBeVisible();
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});
