# Reto: A11y — el foco se escapa del diálogo

**Cinturón:** negro · **Tema:** Accesibilidad: focus trap · **Tiempo estimado:** 90 min · **Bugs:** 5

## Síntoma

Entras a `/alumnos` y apachurras "Nuevo alumno" con el mouse: se ve un diálogo con un
formulario. Hasta ahí, todo bien. Pero si intentas hacerlo **solo con teclado** (como lo haría
alguien que depende de un lector de pantalla o que no puede usar mouse), las cosas se rompen:

- Al abrir el diálogo, el foco se queda parado en el botón que apretaste — nunca "entra" al
  diálogo.
- Si le das `Tab` varias veces dentro del diálogo, en algún momento el foco **se escapa** hacia
  el link del fondo de la página, como si el diálogo no existiera.
- La tecla `Escape`, que en cualquier diálogo del mundo real cierra la ventana, aquí no hace
  nada.
- Si logras cerrar el diálogo con el botón "Cerrar", el foco no vuelve a "Nuevo alumno": se
  pierde.

Además, una herramienta de auditoría de accesibilidad (axe-core) marca el diálogo como
inaccesible incluso antes de tocar el teclado.

## Qué se espera

`src/app/features/senior-04-a11y-focus-trap/registro-alumnos.ts` (y su plantilla) implementan
un diálogo (`role="dialog"`) que se comporta como cualquier diálogo accesible:

- Al abrirse, el foco entra automáticamente a su primer control.
- Mientras está abierto, `Tab` y `Shift+Tab` **ciclan** entre los controles del diálogo sin
  escapar nunca hacia el fondo de la página (trampa de foco).
- `Escape` cierra el diálogo.
- Al cerrarse (por el botón "Cerrar" o por `Escape`), el foco vuelve al botón que lo abrió.
- El diálogo tiene un nombre accesible (`aria-labelledby` apuntando a su título) y está
  correctamente marcado como modal (`aria-modal="true"`), para que axe-core no reporte
  violaciones sobre él.

## Dónde mirar

Todo el reto vive en:

- `src/app/features/senior-04-a11y-focus-trap/registro-alumnos.ts`
- `src/app/features/senior-04-a11y-focus-trap/registro-alumnos.html`

No necesitas tocar el `.scss` ni las rutas.

## Criterios de aceptación

- Al abrir el diálogo con clic o teclado, el foco queda dentro de él (en su primer control).
- `Tab` desde el último control del diálogo vuelve al primero; `Shift+Tab` desde el primero
  vuelve al último. En ningún caso el foco llega a un elemento fuera del diálogo mientras está
  abierto.
- `Escape` cierra el diálogo.
- Al cerrar el diálogo (por cualquier vía), el foco vuelve al botón "Nuevo alumno".
- Con el diálogo abierto, `axe-core` no reporta violaciones sobre su contenido.

## Cómo verificar

```bash
npm run verify
```

Corre un e2e de Playwright (incluye una auditoría con `@axe-core/playwright`) que abre el
diálogo, navega con teclado y comprueba que el foco nunca se escapa. Si te atoras, `npm run hint`
da una pista a la vez.
