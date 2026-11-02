# Reto: Ciclo de vida — la memoria crece al navegar

**Cinturón:** negro · **Tema:** Ciclo de vida · **Tiempo estimado:** 120 min · **Bugs:** 3

## Síntoma

Navegas a `/panel-en-vivo`, vuelves a inicio, navegas otra vez, vuelves a inicio... y así veinte
veces. Angular destruye el componente cada vez que sales de la ruta — pero algo dentro de él no
se destruye con él. Cada visita deja algo vivo: un listener de `window`, una suscripción de
RxJS, un efecto que abrió un recurso y nunca lo cerró. Con suficientes visitas, eso es una fuga
de memoria real.

## Qué se espera

`src/app/features/senior-02-memory-leak/panel-en-vivo.ts` muestra un contador de segundos en
vivo y reacciona a que el navegador esté online. Al **destruir** el componente (salir de la
ruta), todo lo que abrió debe cerrarse: el listener de `window`, la suscripción del contador, y
cualquier recurso que haya abierto un `effect`.

## Dónde mirar

Todo el problema vive en el constructor de
`src/app/features/senior-02-memory-leak/panel-en-vivo.ts`:

- Un `window.addEventListener(...)` — ¿se remueve en algún lado?
- Un `interval(...).subscribe(...)` — ¿qué le falta para cerrarse solo con el componente?
- Un `effect(...)` que abre un recurso — ¿usa la función de limpieza que `effect` le ofrece?

El contador exportado `recursosAbiertos` (al final del archivo) existe solo para que los tests
puedan comprobar que no queda nada vivo después de destruir el componente — no es parte del bug,
es la forma de medirlo.

## Criterios de aceptación

- Al crear y destruir el componente repetidamente, `recursosAbiertos` vuelve exactamente al
  mismo valor que tenía antes de crear la primera instancia.
- Navegar 20 veces a `/panel-en-vivo` y volver a inicio no deja listeners ni suscripciones
  colgando.

## Cómo verificar

```bash
npm run verify
```

Corre un test de Jest que crea y destruye el componente varias veces contando los recursos
abiertos, y un e2e de Playwright que navega 20 veces y mide lo mismo desde el navegador. Si te
atoras, `npm run hint` da una pista a la vez.
