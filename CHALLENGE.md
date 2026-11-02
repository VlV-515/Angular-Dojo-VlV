# Reto: TS y plantillas — no compila

**Cinturón:** blanco · **Tema:** TypeScript + plantillas · **Tiempo estimado:** 25 min · **Bugs:** 6

## Síntoma

Corres `npm start` o `npm run build` y no levanta nada: la terminal se llena de errores de
TypeScript y del compilador de plantillas de Angular. No es un bug de comportamiento — el
proyecto ni siquiera compila.

## Qué se espera

La feature de "Inventario del dojo" vive en `src/app/features/junior-02-no-compila/`: una lista
de equipo (karategi, cinturones, protecciones) con su cantidad en stock, una insignia de nivel por
artículo y un panel de detalle. Una vez arreglado, `ng build` debe terminar sin errores y la lista
debe renderizar correctamente.

## Dónde mirar

Seis errores, todos en:

- `src/app/features/junior-02-no-compila/inventario-list.ts`
- `src/app/features/junior-02-no-compila/inventario-list.html`

No necesitas tocar `item-badge.*`, `item-detail.*` ni `data.ts` — sus contratos ya están bien
definidos, el problema es cómo los usa `inventario-list`.

## Criterios de aceptación

- `ng build` termina en verde, sin errores de TypeScript ni de plantillas.
- La lista de inventario renderiza cada artículo con su nombre, cantidad e insignia de nivel.
- El panel de detalle muestra un artículo válido.

## Cómo verificar

```bash
npm run verify
```

Corre `ng build` y un smoke de Jest sobre el componente de la lista. Si te atoras, `npm run hint`
da una pista a la vez.
