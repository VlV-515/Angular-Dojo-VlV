# Plantilla de reto

Copia esta carpeta a `challenges/<nivel>-<NN>-<slug-corto>/` (por ejemplo
`challenges/mid-01-zoneless-no-refresca/`) y sigue estos pasos:

1. **`meta.json`** — completa todos los campos. `id` debe ser igual al nombre de la carpeta.
   `level`/`belt`/`order` deben coincidir con el prefijo `<nivel>-<NN>-` de la carpeta.
2. **`CHALLENGE.md`** — síntoma, qué se espera, dónde mirar, criterios de aceptación.
3. **`HINTS.md`** — tres pistas progresivas, formato `## Pista 1` / `## Pista 2` / `## Pista 3`.
4. **`overlay/`** — copia la estructura de `src/` que vas a tocar, con los bugs ya sembrados.
   Esto es lo que recibe quien resuelve el reto (rama `challenge/<nivel>/<slug-corto>`).
5. **`solution/`** — solo los archivos que cambian respecto a `overlay/`, ya arreglados. No dupliques
   archivos que no cambian.
6. **`verify/`** — specs de Jest y/o Playwright que fallan sobre `overlay/` y pasan sobre
   `overlay/` + `solution/`. Nombra los e2e como `*.e2e.spec.ts` para que Playwright los
   reconozca (Jest los ignora por ese mismo patrón).

Cuando termines:

```bash
npm run catalog                                        # valida meta.json y regenera challenges.json
npm run build:branches -- --dry-run --only=<id> --keep  # materializa en una carpeta temporal
npm run ci:check-challenges                             # confirma el invariante: roto FALLA, solución PASA
```

No copies `challenges/` ni `scripts/build-branches.mjs` dentro de `overlay/` o `solution/`: esos
nunca viajan a las ramas generadas (el generador los excluye explícitamente).
