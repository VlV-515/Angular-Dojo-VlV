import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('foco al abrir y cerrar el diálogo', () => {
  test('al abrir el diálogo, el foco entra a su primer control', async ({ page }) => {
    await page.goto('/alumnos');

    await page.getByRole('button', { name: 'Nuevo alumno' }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByLabel('Nombre')).toBeFocused();
  });

  test('cerrar con el botón "Cerrar" restaura el foco en "Nuevo alumno"', async ({ page }) => {
    await page.goto('/alumnos');
    const trigger = page.getByRole('button', { name: 'Nuevo alumno' });

    await trigger.click();
    await page.getByRole('button', { name: 'Cerrar' }).click();

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('cerrar con Escape también restaura el foco en "Nuevo alumno"', async ({ page }) => {
    await page.goto('/alumnos');
    const trigger = page.getByRole('button', { name: 'Nuevo alumno' });

    await trigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe('Escape cierra el diálogo', () => {
  test('Escape cierra el diálogo abierto', async ({ page }) => {
    await page.goto('/alumnos');

    await page.getByRole('button', { name: 'Nuevo alumno' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog')).toBeHidden();
  });
});

test.describe('trampa de foco', () => {
  test('Tab desde el último control no escapa del diálogo: vuelve al primero', async ({
    page,
  }) => {
    await page.goto('/alumnos');
    await page.getByRole('button', { name: 'Nuevo alumno' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Arranca desde el último control del diálogo (independiente del bug de foco al abrir).
    await page.getByRole('button', { name: 'Cerrar' }).focus();

    await page.keyboard.press('Tab');

    await expect(page.getByLabel('Nombre')).toBeFocused();
  });

  test('Shift+Tab desde el primer control no escapa del diálogo: vuelve al último', async ({
    page,
  }) => {
    await page.goto('/alumnos');
    await page.getByRole('button', { name: 'Nuevo alumno' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Arranca desde el primer control del diálogo (independiente del bug de foco al abrir).
    await page.getByLabel('Nombre').focus();

    await page.keyboard.press('Shift+Tab');

    await expect(page.getByRole('button', { name: 'Cerrar' })).toBeFocused();
  });
});

test.describe('accesibilidad estática del diálogo', () => {
  test('el diálogo abierto no tiene violaciones de accesibilidad (axe-core)', async ({ page }) => {
    await page.goto('/alumnos');

    await page.getByRole('button', { name: 'Nuevo alumno' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const results = await new AxeBuilder({ page }).include('[role="dialog"]').analyze();

    expect(results.violations).toEqual([]);
  });
});
