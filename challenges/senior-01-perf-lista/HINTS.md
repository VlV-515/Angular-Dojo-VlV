# Pistas — senior-01-perf-lista

## Pista 1

Cinco problemas, cada uno independiente: cómo llegan los datos al bundle (`data.ts`), cómo se
identifica cada fila en el `@for` (`track`), cómo está declarado el pipe de cinturón, cómo se
calcula el texto de "racha" por fila, y cómo se renderiza la lista completa sin ningún tipo de
ventana o carga diferida.

## Pista 2

`data.ts` exporta un arreglo literal de diez mil objetos — eso viaja completo dentro del bundle
de esta feature, sin importar si se usa o no. Genera los datos con una función en tiempo de
ejecución en vez de escribirlos como literal. El pipe `cinturonLabel` tiene `pure: false`: sin
una razón real para serlo, eso lo obliga a recalcularse en cada ciclo de detección de cambios
para las diez mil filas — quítalo, un pipe puro por defecto le basta. Y `track $index` en el
`@for` hace que Angular no pueda identificar de verdad cada fila.

## Pista 3

`resumenRacha(a)` crea un `computed(() => ...)` nuevo **cada vez que se llama** — y se llama una
vez por fila en cada render. No necesita ser un `computed` en absoluto: es una función pura sin
estado propio, basta con que devuelva el valor directamente. Para el DOM: en vez de renderizar
las diez mil filas, renderiza solo las que caben en el contenedor visible (una ventana con
`scrollTop`, tipo "virtual scroll" hecho a mano) y usa `track a.id`. Envuelve el panel de resumen
en `@defer (on viewport)` para no bloquear el render inicial con algo que no es crítico.
