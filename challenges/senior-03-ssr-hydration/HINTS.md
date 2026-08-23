# Pistas — senior-03-ssr-hydration

## Pista 1

Empieza por el crash del servidor. En
`src/app/features/senior-03-ssr-hydration/panel-practica.ts` hay un campo que se inicializa
leyendo `window.localStorage` directamente, fuera de cualquier guardia. Ese inicializador corre
tanto en el navegador como en el servidor (durante el SSR) — y en el servidor no existe `window`.
Busca `afterNextRender` (de `@angular/core`): te deja ejecutar código que solo corre en el
navegador, después de que el primer render ya pasó.

## Pista 2

Con el crash resuelto, la página carga pero la consola tira `NG0500` apenas hidrata. En el
constructor de `PanelPractica` hay un bloque que, si estás en el navegador, mete un `<p>` de
bienvenida directo en el DOM con `insertAdjacentHTML(...)` — sin pasar por el template de
Angular. Angular no tiene idea de que ese nodo existe: cuando el navegador arranca e hidrata, se
encuentra un hijo extra al principio del componente que el HTML del servidor no tenía, y todo lo
que viene después ya no calza. La solución no es "guardar mejor" ese código — es no tocar el DOM
a mano: conviértelo en una señal más, pintada por el propio template con `@if`, que arranque en
`false` en los dos lados y solo cambie a `true` **después** de que la hidratación ya haya
terminado (`afterNextRender` es exactamente para esto).

## Pista 3

Por último, la petición a `/api/dojo/practica` se dispara dos veces: una para armar el HTML en el
servidor, otra al arrancar el cliente. Nada guarda ese primer resultado para que el cliente lo
reaproveche. Angular trae `TransferState` (de `@angular/core`, junto con `makeStateKey`)
pensado exactamente para esto: en el servidor, guarda el dato que ya trajiste con
`transferState.set(...)`; en el cliente, antes de pedirlo de nuevo, revisa con
`transferState.get(...)` si ya está ahí — si está, úsalo y no llames a `HttpClient` otra vez.
`isPlatformServer`/`isPlatformBrowser` (de `@angular/common`) te dicen en qué lado estás parado.
