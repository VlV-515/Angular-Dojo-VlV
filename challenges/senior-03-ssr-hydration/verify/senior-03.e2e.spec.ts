import { expect, test } from '@playwright/test';

test('SSR de /practica-ssr no truena, no rompe hidratación y no duplica la petición', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(err.message);
  });

  const response = await page.goto('/practica-ssr');

  // Bug del `window` sin guardia: si sigue roto, el servidor Express responde con un error 500
  // (su stack de error incluye "window is not defined") en vez de la página renderizada.
  expect(response?.status()).toBe(200);

  // El fixture del mock API devuelve un identificador distinto en cada llamada (contador + token
  // aleatorio). Se lee el HTML **crudo** que mandó el servidor (antes de que corra ni una línea
  // de JS en el navegador) para no correr una carrera contra el posible doble fetch del cliente,
  // que podría pisar el valor en el DOM antes de que Playwright llegue a leerlo.
  const htmlDelServidor = await response!.text();
  const idServidor = /data-testid="peticion-id"[^>]*>([^<]+)</.exec(htmlDelServidor)?.[1];
  expect(idServidor).toBeTruthy();

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Panel de práctica');

  // Deja tiempo de sobra para que, si la petición duplicada sigue viva, ya haya llegado y pisado
  // el valor que trajo el servidor.
  await page.waitForTimeout(700);

  const idEstable = await page.getByTestId('peticion-id').textContent();
  expect(idEstable).toBe(idServidor);

  const mensajes = [...consoleErrors, ...pageErrors].join('\n');
  expect(mensajes).not.toContain('NG0500');
  expect(mensajes).not.toContain('NG0501');
  expect(mensajes.toLowerCase()).not.toContain('window is not defined');
});
