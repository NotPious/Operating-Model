import { test, expect } from '@playwright/test';

test('Operating Model button', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/index.html');

  // Click the Operating Model button
  await page.getByRole('button', { name: 'Operating Model' }).click();

  // Expects active div for Operating Model
  await expect(page.locator('div.view.active')).toHaveId('operating-model-view');
});

test('Demand Planning button', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/index.html');

  // Click the Demand Planning button
  await page.getByRole('button', { name: 'Demand Planning' }).click();

  // Expects active div for Demand Planning
  await expect(page.locator('div.view.active')).toHaveId('demand-planning-view');
});

test('Capacity Analysis button', async ({ page }) => {
  await page.goto('http://127.0.0.1:5500/index.html');

  // Click the Capacity Analysis button
  await page.getByRole('button', { name: 'Capacity Analysis' }).click();

  // Expects active div for Capacity Analysis
  await expect(page.locator('div.view.active')).toHaveId('capacity-analysis-view');
});