# Cómo contribuir

Gracias por sumar algo a Angular Dojo VlV. Hay dos formas de contribuir: agregando un reto nuevo,
o mejorando la plataforma (el shell, el mock API, el CLI). Esta guía cubre ambas.

## Agregar un reto nuevo

Un reto vive en `challenges/<nivel>-<NN>-<slug-corto>/` y **nunca** se edita directamente en una
rama — las ramas son un artefacto generado desde `main`. Ver [`docs/PLAN.md`](docs/PLAN.md) para
la arquitectura completa si te la saltaste.

1. **Copia la plantilla:**

   ```bash
   cp -R challenges/_template challenges/mid-03-mi-reto-nuevo
   ```

   El nombre de la carpeta importa: `<nivel>` es `junior`, `mid` o `senior`; `<NN>` es un número de
   dos dígitos único dentro de ese nivel; `<slug-corto>` es el nombre que va a usar la rama
   (`challenge/<nivel>/<slug-corto>`).

2. **Completa `meta.json`.** `id` debe ser idéntico al nombre de la carpeta. `level`/`belt`/`order`
   deben coincidir con el prefijo de la carpeta — `npm run catalog` lo valida y te dice
   exactamente qué campo está mal si algo no cuadra.

3. **Escribe `CHALLENGE.md`.** Síntoma primero (cómo se ve el problema desde afuera, sin
   spoilear la causa), después qué se espera, dónde mirar, y los criterios de aceptación.

4. **Escribe `HINTS.md`** con tres pistas progresivas (`## Pista 1`, `## Pista 2`, `## Pista 3`),
   de la más general a la más específica. La última pista puede casi regalar la respuesta; la
   primera no debería decir más que "mira este archivo".

5. **Siembra los bugs en `overlay/`.** Esta carpeta espeja la estructura de `src/` y solo incluye
   los archivos que el reto necesita nuevos o modificados respecto al shell base. Esto es lo que
   recibe quien va a resolver el reto.

6. **Arregla los bugs en `solution/`.** Solo los archivos que cambian respecto a `overlay/` — si
   un archivo de `overlay/` no necesita cambiar para la solución, no lo dupliques acá.

7. **Escribe `verify/`.** Specs de Jest (`*.spec.ts`) y/o Playwright (`*.e2e.spec.ts`, con ese
   sufijo exacto para que Playwright los reconozca y Jest los ignore). Estos archivos se copian
   sin cambios a la rama del reto y a la de la solución: tienen que fallar sobre `overlay/` y
   pasar sobre `overlay/` + `solution/`.

8. **Valida el invariante antes de abrir el PR:**

   ```bash
   npm run catalog
   npm run ci:check-challenges
   ```

   El segundo comando materializa tu reto en ambos estados y confirma que `verify` falla en el
   roto y pasa en la solución. Si no cumple esto, CI lo va a rechazar igual — mejor detectarlo local.

9. Abre el PR. Incluye en la descripción qué bugs sembraste y por qué elegiste ese nivel/tiempo
   estimado.

### Reglas de diseño para un buen reto

- **Un síntoma, varias causas.** El síntoma que ve quien resuelve debe ser simple de describir
  ("pantalla en blanco", "la UI se congela"); los bugs de fondo pueden ser varios.
- **Nada de trampas de sintaxis oscuras.** El reto pone a prueba conceptos de Angular, no cuánto
  conoces trivia de TypeScript.
- **Los umbrales de perf/memoria necesitan margen.** Si tu `verify` mide tiempos o conteos,
  déjale aire para no ser flaky en un CI más lento que tu máquina.
- **No dupliques `data.ts` ni archivos sin cambios entre `overlay/` y `solution/`.** El generador
  aplica `overlay/` y luego `solution/` encima; solo necesitas lo que realmente cambia.

## Mejorar la plataforma

Cambios al shell (`src/app/app.*`, `src/app/core/`, `src/app/features/home/`), al mock API o al
CLI (`scripts/`) siguen el flujo normal de PR. Antes de abrir uno:

```bash
npm run build
npm run test:unit
npm run catalog
npm run build:branches -- --dry-run
npx playwright test
```

Si tu cambio afecta el shell base, acuérdate de que **todas** las ramas lo heredan — probar en
`main` no basta, corre también `npm run ci:check-challenges` para confirmar que ningún reto
existente se rompió.

El sitio de GitHub Pages vive en `site/` (HTML + JS sin build) y lee `challenges.json`; se
publica solo con `.github/workflows/pages.yml` al hacer push a `main`. No viaja a las ramas de
reto. Los escudos de cinturón salen de `site/belts.mjs`; si cambias sus colores, corre
`node scripts/build-belts.mjs` para regenerar `site/favicon.svg` y `docs/belts/*.svg`. `.devcontainer/` sí viaja: si lo cambias, mueve `base-v1` y regenera las ramas
(`npm run build:branches -- --push`) para que Codespaces lo tome.

## Estilo de código y de commits

- Todo el texto para quien usa el dojo (docs, briefs, mensajes del CLI) va en español (es-LATAM).
- Sin librerías de UI externas en el shell — CSS propio.
- Mensajes de commit en el estilo `tipo(alcance): qué y por qué`, por ejemplo
  `feat(mid-01): agrega reto de zoneless` o `fix(verify): corrige hash de archivos con CRLF`.

## ¿Dudas?

Abre un issue. Si es sobre un reto específico que te gustaría ver, cuéntanos qué bug de Angular
real te dolió — los mejores retos de este repo salen de ahí.
