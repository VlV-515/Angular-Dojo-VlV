# Reto: Signals — el contador no cambia

**Cinturón:** blanco · **Tema:** Signals · **Tiempo estimado:** 30 min · **Bugs:** 4

## Síntoma

Abres la "Rutina de hoy" en `/rutina`. Haces click en "+1 repetición" y el número no cambia (peor
aún, ni siquiera se ve como un número). Haces click en "Sumar día de racha" y la racha se queda
pegada en `0`. Subes la meta diaria y el texto sigue mostrando la meta original, aunque el número
por dentro sí cambió. No hay ningún error en la consola: la aplicación compila y corre sin
problema, simplemente no refleja el estado real en pantalla.

## Qué se espera

`src/app/features/junior-05-signals-basico/rutina-diaria.ts` (y su plantilla) manejan tres piezas
de estado con `signal()` y `computed()`:

- Un contador de repeticiones que sube de uno en uno al hacer click.
- Una racha de días que sube de uno en uno al hacer click.
- Una meta diaria (un texto derivado con `computed()`) que refleja el valor actual de la meta cada
  vez que se sube.

## Dónde mirar

Hay cuatro bugs, todos relacionados con cómo se leen y se escriben señales:

- `src/app/features/junior-05-signals-basico/rutina-diaria.html`
- `src/app/features/junior-05-signals-basico/rutina-diaria.ts`

No necesitas tocar `rutina-diaria.scss` ni `app.routes.ts`.

## Criterios de aceptación

- El contador de repeticiones se muestra como un número (no como `[object Object]` ni nada
  parecido) y sube en 1 cada vez que se hace click en "+1 repetición".
- La racha sube en 1 cada vez que se hace click en "Sumar día de racha".
- El texto de la meta diaria muestra el valor actualizado apenas se hace click en "Subir meta +1".

## Cómo verificar

```bash
npm run verify
```

Corre un test de Jest que hace click en cada botón y revisa el texto resultante. Si te atoras,
`npm run hint` da una pista a la vez.
