# Reto: Bindings y @if/@for — la lista no reacciona

**Cinturón:** blanco · **Tema:** Bindings y control flow · **Tiempo estimado:** 30 min · **Bugs:** 5

## Síntoma

Abres `/calentamiento`: una lista de ejercicios de calentamiento con casillas para marcarlos
como hechos, un botón para quitar ejercicios y un formulario para agregar uno nuevo. A simple
vista compila, corre y no tira ningún error en consola. Pero casi nada funciona como debería:

- Un banner de "¡Calentamiento completo!" aparece **desde el primer segundo**, antes de marcar
  nada.
- Los ejercicios se ven todos con el mismo estilo, sin importar si están hechos o no.
- El contador de "X de Y hechos" no cambia cuando marcas una casilla.
- Si quitas un ejercicio de la lista, algún campo de texto que tenías enfocado termina mostrando
  el nombre de **otro** ejercicio.
- Escribes el nombre de un ejercicio nuevo, le das a "Agregar" y no pasa nada.

## Qué se espera

La feature vive en `src/app/features/junior-03-bindings-control-flow/`. Ya arreglada debería:

- Mostrar el banner de "completo" únicamente cuando **todos** los ejercicios están hechos.
- Reflejar visualmente qué ejercicios están hechos y cuáles no.
- Actualizar el contador de hechos al marcar o desmarcar una casilla.
- Al quitar un ejercicio de la lista, mantener el resto de las filas asociadas a su propio
  ejercicio (nombre, foco, lo que sea que tuvieran) sin mezclarse entre sí.
- Agregar un ejercicio nuevo a la lista al escribir su nombre y presionar "Agregar".

## Dónde mirar

Hay cinco bugs, cada uno relacionado con una forma distinta de binding o control de flujo en
plantillas de Angular:

- `src/app/features/junior-03-bindings-control-flow/calentamiento.html`
- `src/app/features/junior-03-bindings-control-flow/calentamiento.ts`

No necesitas tocar `calentamiento.scss` ni `app.routes.ts`.

## Criterios de aceptación

- El banner de "completo" no aparece si queda al menos un ejercicio sin hacer.
- Un ejercicio sin hacer no tiene el estilo visual de "completado".
- Marcar una casilla actualiza el contador de "X de Y hechos" de inmediato.
- Quitar un ejercicio no mezcla el nombre de una fila con el de otra.
- Escribir un nombre nuevo y presionar "Agregar" lo agrega a la lista.

## Cómo verificar

```bash
npm run verify
```

Corre los tests de Jest sobre el componente. Si te atoras, `npm run hint` da una pista a la vez.
