# Pistas — junior-03-bindings-control-flow

## Pista 1

Hay cinco bugs y están repartidos entre `calentamiento.html` y `calentamiento.ts`. Revisa uno
por uno, en orden, cada elemento de la fila de un ejercicio (la casilla, el nombre, el botón de
quitar) y cada pieza del formulario de "agregar". También revisa el `@if` que controla el banner
de arriba. Ninguno de los cinco bugs rompe la compilación: el proyecto corre, solo se comporta
mal.

## Pista 2

- El banner de "completo": ¿el `@if` está mirando la señal correcta? Hay una señal que cuenta
  cuántos ejercicios hay en total y otra que dice si **todos** están hechos — son cosas distintas.
- La clase `completado` en cada fila: ¿está escrita como texto fijo en el atributo `class`, o
  como un binding que depende de `item.hecho`?
- El `@for`: fíjate en qué usa como `track`. Si el "identificador" de cada fila es su posición en
  el arreglo (`$index`) en vez de algo propio del ejercicio (como `item.id`), Angular puede
  reciclar el elemento del DOM equivocado cuando el arreglo cambia de tamaño.
- El contador "X de Y hechos" y el método que marca una casilla como hecha: ¿ese método cambia
  la señal `items` con `.set(...)`/`.update(...)`, o solo modifica el objeto que ya tenía adentro?
- El input de "nuevo ejercicio": ¿su evento `(input)` termina escribiendo en la señal
  `nuevoNombre`, o en otra variable que nadie más lee?

## Pista 3

- Cambia `@if (total())` por `@if (todosListos())` — `total()` solo dice si hay ejercicios en la
  lista, no si ya se hicieron todos.
- Cambia el `class="item completado"` fijo por `class="item" [class.completado]="item.hecho"`.
- Cambia `track $index` por `track item.id` en el `@for`.
- En el método que marca la casilla, no mutes el objeto encontrado con `.find(...)`: usa
  `this.items.update((lista) => lista.map(...))` devolviendo un nuevo objeto para el ítem que
  cambió.
- En el manejador del input de "nuevo ejercicio", cambia la asignación a la variable local por
  `this.nuevoNombre.set((event.target as HTMLInputElement).value)`.
