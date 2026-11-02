# Pistas — junior-02-no-compila

## Pista 1

Lee el mensaje de error completo de `ng build`, de arriba hacia abajo — TypeScript y el compilador
de Angular normalmente te dicen el archivo, la línea y hasta qué esperaban en vez de lo que
encontraron. No hay truco oculto: son seis errores independientes, cada uno bastante literal.

## Pista 2

Revisa uno por uno: ¿`ItemBadge` está en el arreglo `imports:` de `InventarioList`, si se usa en
su plantilla? ¿El bloque `@if` de la alerta de stock tiene su `}` de cierre? ¿Qué tipo espera
`[nivel]` en `app-item-badge` y qué tipo le estás pasando? ¿`app-item-detail` declara un
`input.required<string>()` — le estás dando un valor?

## Pista 3

Los dos que quedan: el pipe `number` no está en `imports:` (es de `@angular/common`, hay que
importarlo explícitamente). Y en `stockMinimo(categoria)`, `STOCK_MINIMO_POR_CATEGORIA` es un
`Record<string, number>` — con `noPropertyAccessFromIndexSignature` activo no puedes leerlo con
`.categoria`, tienes que usar `STOCK_MINIMO_POR_CATEGORIA[categoria]`.
