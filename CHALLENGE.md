# Reto: SSR — NG0500 y doble fetch al hidratar

**Cinturón:** negro · **Tema:** SSR e hidratación · **Tiempo estimado:** 100 min · **Bugs:** 3

## Síntoma

Esta rama sí corre con Server-Side Rendering: `npm start` ya no solo levanta un dev-server que
sirve un bundle vacío, arranca un servidor Express que renderiza cada página en el servidor antes
de mandarla al navegador. El catálogo (`/`) funciona bien, pero en cuanto abres
`/practica-ssr` las cosas se ponen feas:

- La terminal donde corre `npm start` (o `npm run build` seguido de correr el servidor de
  producción) puede mostrar un error del servidor que menciona `window is not defined` al pedir
  esa ruta — la página nunca llega a renderizarse.
- Si arreglas eso y recargas, la consola del navegador tira `NG0500` o `NG0501` apenas la página
  termina de cargar — Angular se queja de que lo que hidrata no calza con el HTML que mandó el
  servidor.
- Y aunque no haya ningún error a la vista, si abres la pestaña de red ves que la misma petición
  a `/api/dojo/practica` se dispara **dos veces** por cada carga de página: una en el servidor,
  otra en el navegador al arrancar.

## Qué se espera

La feature vive en `src/app/features/senior-03-ssr-hydration/` (ruta `/practica-ssr`): un panel
de práctica sencillo que muestra si estás en modo servidor o navegador, trae un consejo del mock
API, y deja marcar la página como "vista" guardando algo en `localStorage`. Arreglada, esta
página debería:

- Renderizarse en el servidor sin reventar, sin tocar `window`/`localStorage` ahí donde no
  existen.
- Hidratar sin errores `NG0500`/`NG0501`: lo que el servidor mandó y lo que el cliente espera
  encontrar en el DOM tienen que calzar en el primer render.
- Pedir el consejo al mock API **una sola vez** por carga de página, no una vez en el servidor y
  otra en el cliente.

## Dónde mirar

Los tres bugs viven en `src/app/features/senior-03-ssr-hydration/panel-practica.ts`: cómo se lee
el estado de "visto", cómo se arma el mensaje de bienvenida, y cómo se pide el consejo al mock
API. No necesitas tocar `src/app/app.config.ts` ni
`src/app/core/mock-api/fixtures/practica.ts` — este último te sirve para entender cómo se puede
notar la petición duplicada (cada llamada devuelve un identificador distinto).

## Criterios de aceptación

- `npm run build` y el servidor SSR resultante sirven `/practica-ssr` con status 200, sin
  excepciones de servidor por acceder a `window`/`document`/`localStorage` sin guardia.
- La consola del navegador no muestra `NG0500` ni `NG0501` al cargar `/practica-ssr`.
- El consejo mostrado en pantalla no cambia entre el HTML inicial (SSR) y el estado ya hidratado:
  solo se pidió una vez.

## Cómo verificar

```bash
npm run verify
```

Corre `ng build` (para confirmar que el build de producción con SSR compila) y un e2e de
Playwright que navega a `/practica-ssr`, revisa la consola/errores de página y compara el
consejo mostrado antes y después de que la hidratación termine. Si te atoras, `npm run hint` da
una pista a la vez.
