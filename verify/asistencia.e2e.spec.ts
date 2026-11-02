import { expect, test } from '@playwright/test';

test('marcar presente actualiza la fila y el contador sin recargar', async ({ page }) => {
  await page.goto('/asistencia');
  await expect(page.getByText('1 de 3 presentes')).toBeVisible();

  await page.getByRole('button', { name: 'Marcar presente' }).first().click();

  await expect(page.getByText('2 de 3 presentes')).toBeVisible();
  await expect(page.getByText('Presente').first()).toBeVisible();
});

test('agregar un alumno lo muestra de inmediato en la lista', async ({ page }) => {
  await page.goto('/asistencia');
  await page.getByPlaceholder('Nombre del alumno').fill('Diego Reyes');
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(page.getByText('Diego Reyes')).toBeVisible();
  await expect(page.getByText('1 de 4 presentes')).toBeVisible();
});
