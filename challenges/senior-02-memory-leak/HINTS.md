# Pistas — senior-02-memory-leak

## Pista 1

Tres recursos se abren en el constructor de `PanelEnVivo` y ninguno se cierra cuando el
componente se destruye: un listener de `window`, una suscripción de RxJS y algo que abre un
`effect`. Angular te da un mecanismo para registrar "cuando este componente muera, corre esto":
`DestroyRef`.

## Pista 2

Para el listener: inyecta `DestroyRef` y usa `destroyRef.onDestroy(() => window.removeEventListener(...))`.
Para la suscripción del `interval(...)`: en vez de gestionar la desuscripción a mano, usa el
operador `takeUntilDestroyed()` de `@angular/core/rxjs-interop` en el `pipe(...)`, antes del
`.subscribe(...)`.

## Pista 3

`effect(...)` recibe opcionalmente una función `onCleanup` como parámetro de su callback:
`effect((onCleanup) => { /* ... */ onCleanup(() => { /* liberar */ }); })`. Esa función se llama
tanto antes de que el efecto vuelva a ejecutarse como cuando el componente que lo contiene se
destruye — es el lugar correcto para cerrar lo que el efecto abrió.
