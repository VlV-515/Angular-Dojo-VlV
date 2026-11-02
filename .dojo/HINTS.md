# Pistas — junior-01-routing

## Pista 1

Mira el orden de las rutas en `src/app/app.routes.ts`. El router de Angular evalúa las rutas
**en el orden en que aparecen** en el arreglo y se queda con la primera que calza. ¿Alguna ruta
podría estar "comiéndose" a las que vienen después, sin que se note en `/`?

## Pista 2

Ya deberías ver algo en `/tecnicas`, pero probablemente no lo correcto: revisa con cuidado a qué
`loadComponent` apunta cada una de las rutas `tecnicas` y `tecnicas/:id` en
`src/app/app.routes.ts`. Y en `tecnicas-list.html`, fíjate qué le estás pasando exactamente al
arreglo de `routerLink` — ¿es el `id` de la técnica, o es el objeto técnica completo?

## Pista 3

Para que un componente reciba automáticamente el parámetro de la URL como `input()`, el router
necesita la característica `withComponentInputBinding()` dentro de `provideRouter(...)` en
`app.config.ts`. Y aunque la agregues, `TecnicasDetail` todavía necesita **declarar** ese input y
usarlo para buscar la técnica correcta en `TECNICAS` — ahora mismo no lo hace.
