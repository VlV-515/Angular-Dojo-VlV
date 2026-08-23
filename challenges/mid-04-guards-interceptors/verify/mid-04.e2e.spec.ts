import { expect, test } from '@playwright/test';

test('sin sesión, /panel redirige a la entrada pública', async ({ page }) => {
  await page.goto('/panel');

  await expect(page).toHaveURL(/\/panel-entrada$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Acceso al panel');
});

test('con sesión iniciada, /panel muestra los datos protegidos', async ({ page }) => {
  await page.goto('/panel-entrada');
  await page.getByRole('button', { name: 'Iniciar sesión (falsa)' }).click();

  await page.getByRole('link', { name: 'Ir al panel' }).click();

  await expect(page).toHaveURL(/\/panel$/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Panel del dojo');
  await expect(page.getByRole('listitem').first()).toBeVisible();
});
