# Reto: Router — pantalla en blanco

**Cinturón:** blanco · **Tema:** Router · **Tiempo estimado:** 30 min · **Bugs:** 5

## Síntoma

Corres `npm start`, abres el navegador y la página de inicio funciona bien. Pero en cuanto
navegas a "Técnicas" (`/tecnicas`) la pantalla se queda **en blanco**. No hay ningún error en la
consola que apunte directo al problema — el router simplemente no está haciendo lo que debería.

## Qué se espera

La feature de "Técnicas del dojo" vive en `src/app/features/junior-01-routing/`:

- `/tecnicas` — una lista de técnicas con su nombre y su cinturón.
- `/tecnicas/:id` — el detalle de **esa** técnica específica (no siempre la misma).

Cada técnica de la lista debe enlazar a su propio detalle, y el detalle debe leer el `id` de la
URL para mostrar la técnica correcta.

## Dónde mirar

Hay cinco bugs, todos relacionados con el router de Angular:

- `src/app/app.routes.ts`
- `src/app/app.config.ts`
- `src/app/features/junior-01-routing/tecnicas-list.html`
- `src/app/features/junior-01-routing/tecnicas-detail.ts`

No necesitas tocar `data.ts` ni los archivos `.scss`.

## Criterios de aceptación

- `/tecnicas` muestra la lista completa de técnicas.
- Cada técnica de la lista enlaza a su propio `/tecnicas/:id`.
- `/tecnicas/:id` muestra la técnica correspondiente a **ese** id, no siempre la misma.
- La navegación lista → detalle funciona con un click real (lo comprueba un e2e de Playwright).

## Cómo verificar

```bash
npm run verify
```

Corre Jest (rutas y el componente de detalle aislado) y un e2e de Playwright que navega de la
lista al detalle. Si te atoras, `npm run hint` da una pista a la vez.
