import { expect, test } from '@playwright/test';

test('la búsqueda muestra los resultados de la última consulta, no de una anterior más lenta', async ({
  page,
}) => {
  await page.goto('/buscador');

  const input = page.getByPlaceholder('Buscar técnica...');
  await input.fill('ma');
  await input.fill('mae geri');

  // Deja tiempo de sobra para que AMBAS respuestas hayan llegado (la de "ma" es la más lenta,
  // hasta ~420ms) antes de leer el estado ya estable — si no, se podría atrapar un instante
  // transitorio en el que la respuesta correcta ya llegó pero la vieja todavía no la pisa.
  await page.waitForTimeout(700);

  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('listitem').first()).toContainText('Mae geri');
});
