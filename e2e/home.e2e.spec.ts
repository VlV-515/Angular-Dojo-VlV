import { expect, test } from '@playwright/test';

test('la portada muestra el catálogo del dojo', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('app rota');
  await expect(page.locator('.challenge-card').first()).toBeVisible();
});
