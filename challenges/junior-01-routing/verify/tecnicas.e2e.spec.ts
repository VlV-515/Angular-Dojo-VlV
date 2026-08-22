import { expect, test } from '@playwright/test';

test('navega de la lista de técnicas al detalle correcto', async ({ page }) => {
  await page.goto('/tecnicas');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Técnicas');

  await page.getByRole('link', { name: 'Mae geri' }).click();

  await expect(page).toHaveURL(/\/tecnicas\/mae-geri$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mae geri');
});
