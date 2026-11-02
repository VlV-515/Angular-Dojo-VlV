# Pistas — senior-04-a11y-focus-trap

## Pista 1

Hay cinco problemas y todos viven en `registro-alumnos.ts` / `.html`. Uno es estático (algo que
`axe-core` detecta con el diálogo cerrado con solo mirar los atributos ARIA del `role="dialog"`)
y los otros cuatro son de comportamiento: qué pasa con el foco al abrir, qué pasa con `Tab` /
`Shift+Tab` adentro del diálogo, qué pasa con `Escape`, y qué pasa con el foco al cerrar.

## Pista 2

Para el bug estático: un elemento con `role="dialog"` necesita un nombre accesible
(`aria-labelledby` apuntando al `id` de su título, o `aria-label`) y debería anunciarse como
modal con `aria-modal="true"`. Para el foco al abrir: `abrirDialogo()` cambia el signal pero
nunca llama a `.focus()` sobre ningún control de adentro — necesitas una forma de esperar a que
el diálogo ya esté renderizado (`viewChild` + `effect`, por ejemplo) antes de enfocar su primer
campo.

## Pista 3

Para la trampa de foco: el diálogo no tiene ningún manejador de `(keydown)`. Necesitas escuchar
`Tab` y `Shift+Tab` sobre la raíz del diálogo, calcular cuáles son el primer y el último elemento
enfocable (`querySelectorAll` con un selector de elementos enfocables), y cuando el foco esté en
el último y se presione `Tab` (o en el primero y se presione `Shift+Tab`), hacer
`event.preventDefault()` y mover el foco manualmente al otro extremo. El mismo manejador es un
buen lugar para escuchar `Escape` y cerrar el diálogo. Para restaurar el foco al cerrar: guarda
una referencia al elemento que tenía el foco justo antes de abrir el diálogo (por ejemplo,
`document.activeElement` al momento de abrir) y llama a `.focus()` sobre esa referencia en
`cerrarDialogo()`.
