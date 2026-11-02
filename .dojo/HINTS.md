# Pistas — mid-02-race-condition

## Pista 1

En el constructor de `Buscador`, el `Subject` de consultas se conecta al `HttpClient` con
`mergeMap`. `mergeMap` deja correr **todas** las peticiones en paralelo y emite cada respuesta en
cuanto llega, sin importar cuál se disparó primero. Hay un operador de RxJS pensado exactamente
para "solo me importa la respuesta de la última petición, cancela las anteriores".

## Pista 2

Cambiar a `switchMap` arregla el orden, pero todavía falta agregar un `debounceTime(...)` antes
del `switchMap`: sin él, cada tecla dispara una petición nueva, aunque la persona todavía esté
escribiendo.

## Pista 3

El `.subscribe(...)` al final de la cadena nunca se limpia. Agrega `takeUntilDestroyed()` (de
`@angular/core/rxjs-interop`) justo antes del `.subscribe(...)` para que la suscripción se cierre
sola cuando el componente se destruye — así el pipeline completo queda:
`debounceTime(...)`, `switchMap(...)`, `takeUntilDestroyed()`.
