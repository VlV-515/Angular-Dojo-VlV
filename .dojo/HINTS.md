# Pistas — junior-06-http-resource

## Pista 1

Mira cómo está armado `httpResource(...)` en `ficha-tecnica.ts`. La reactividad de
`httpResource()` (y de `resource()` en general) depende **exclusivamente** de qué señales se
leen dentro de la función de request (o de URL) que le pasas — no de qué señales existen en el
componente. Compárala con la señal `seleccionado`: ¿la función que arma la URL la está leyendo?

## Pista 2

Ahora mira `ficha-tecnica.html`. `ficha.value()`, `ficha.isLoading()` y `ficha.error()` son
señales: hay que **llamarlas** para leer su valor. El template actual llama a `ficha.value()`
directo, sin preguntar antes si todavía está cargando o si hubo un error. Cuando el estado es
`'error'`, leer `ficha.value()` no devuelve `undefined`: **lanza una excepción**. Por eso, cuando
pides una ficha que no existe, la pantalla se rompe en silencio en vez de mostrar algo.

## Pista 3

Casi la respuesta:

- En `ficha-tecnica.ts`, la función de `httpResource(...)` debe construir la URL con
  `this.seleccionado()`, no con un id fijo.
- En `ficha-tecnica.html`, encadena las comprobaciones en este orden:
  `@if (ficha.error()) {...} @else if (ficha.isLoading()) {...} @else if (ficha.value(); as f) {...}`.
  Así nunca se llega a leer `ficha.value()` cuando el estado es de error.
- `reintentar()` debe llamar a `this.ficha.reload()`. Ahora mismo solo hace
  `this.seleccionado.set(this.seleccionado())`, y como el valor "nuevo" es igual al que ya
  tenía, Angular no considera que la señal cambió — no se dispara ninguna recarga.
