import { expect, test } from '@playwright/test';

test('navegar 20 veces al panel en vivo no acumula listeners ni suscripciones', async ({
  page,
}) => {
  // `page.goto` hace una recarga completa del navegador — reiniciaría el estado que queremos
  // medir. Para navegar de ida y vuelta SIN recargar (como lo haría una persona real, con el
  // router de Angular) usamos el link del encabezado y el botón "atrás" del navegador.
  await page.goto('/panel-en-vivo');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel en vivo');

  for (let i = 0; i < 20; i += 1) {
    await page.getByRole('link', { name: 'Catálogo' }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goBack();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Panel en vivo');
  }

  const recursos = await page.evaluate(
    () => (window as unknown as { __dojoRecursosAbiertos?: Record<string, number> })
      .__dojoRecursosAbiertos,
  );

  expect(recursos).toBeTruthy();
  expect(recursos!['listeners']).toBeLessThanOrEqual(2);
  expect(recursos!['subscripciones']).toBeLessThanOrEqual(2);
  expect(recursos!['efectos']).toBeLessThanOrEqual(2);
});
