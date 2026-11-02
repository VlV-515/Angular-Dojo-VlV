import { expect, test } from '@playwright/test';

test('elegir otra ficha actualiza el contenido a la técnica seleccionada', async ({ page }) => {
  await page.goto('/ficha-tecnica');

  await expect(page.getByRole('heading', { name: 'Zenkutsu dachi' })).toBeVisible();

  await page.getByRole('button', { name: 'Gyaku zuki' }).click();

  await expect(page.getByRole('heading', { name: 'Gyaku zuki' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Zenkutsu dachi' })).not.toBeVisible();
});

test('elegir una ficha que no existe muestra un mensaje de error visible', async ({ page }) => {
  await page.goto('/ficha-tecnica');
  await expect(page.getByRole('heading', { name: 'Zenkutsu dachi' })).toBeVisible();

  await page.getByRole('button', { name: 'Kata fantasma (no existe)' }).click();

  await expect(page.getByRole('alert')).toBeVisible();
});
