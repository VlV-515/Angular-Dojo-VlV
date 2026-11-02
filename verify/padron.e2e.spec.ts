import { expect, test } from '@playwright/test';

test('la lista no crea miles de nodos DOM de golpe', async ({ page }) => {
  await page.goto('/padron');
  await expect(page.locator('.fila').first()).toBeVisible();

  const filas = await page.locator('.fila').count();
  expect(filas).toBeLessThan(200);
});

test('filtrar la lista de 10k alumnos responde en un tiempo razonable', async ({ page }) => {
  await page.goto('/padron');
  await expect(page.locator('.fila').first()).toBeVisible();

  const inicio = Date.now();
  await page.getByPlaceholder('Buscar alumno...').fill('Alumno 09999');
  await expect(page.getByText('Alumno 09999')).toBeVisible();
  const duracion = Date.now() - inicio;

  expect(duracion).toBeLessThan(2000);
});
