# Angular Dojo VlV

**Cada rama es una app de Angular ya rota. Tu trabajo es repararla — y `npm run verify` te dice si lo lograste.**

[![Angular](https://img.shields.io/badge/Angular-20.3-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![Zoneless](https://img.shields.io/badge/change_detection-zoneless-06b6d4)](https://angular.dev/guide/zoneless)
[![TypeScript strict](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tested with Jest](https://img.shields.io/badge/tested_with-Jest-c21325?logo=jest&logoColor=white)](https://jestjs.io)
[![E2E Playwright](https://img.shields.io/badge/e2e-Playwright-2ead33?logo=playwright&logoColor=white)](https://playwright.dev)
[![CI](https://github.com/VlV-515/Angular-Dojo-VlV/actions/workflows/ci.yml/badge.svg)](https://github.com/VlV-515/Angular-Dojo-VlV/actions/workflows/ci.yml)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-yellow.svg)](LICENSE)

No hay backend, no hay envíos, no hay ranking en la nube. Clonas el repo, eliges un reto,
lees el brief, arreglas el código en tu editor y corres un comando. Así de simple, y así de
honesto: si `npm run verify` queda en verde, lo resolviste. Si no, todavía no.

## Cómo funciona

**1. Clona y elige un reto**

```bash
git clone https://github.com/VlV-515/Angular-Dojo-VlV.git
cd Angular-Dojo-VlV
npm install
npm run play
```

`npm run play` abre un menú: cinturón, tema, síntoma, tiempo estimado y tu estado. Al elegir uno
hace `git switch` a esa rama y te imprime el brief (`CHALLENGE.md`) directo en la terminal.

**2. Arregla el código**

Cada rama es una app de Angular real y completa — no un fragmento aislado. Algo está roto: no
compila, la pantalla queda en blanco, la UI se congela, la app se pone lenta con muchos datos...
Tú decides cómo arreglarlo. No hay un único camino correcto, solo un resultado verificable.

```bash
npm start   # para verla correr mientras trabajas
```

**3. Verifica**

```bash
npm run verify
```

Corre lo que ese reto necesite — Jest, Playwright, `ng build`, o una combinación — y te dice
exactamente qué falta. ¿Atorado? `npm run hint` te da una pista a la vez, nunca las tres de
un jalón. ¿Quieres empezar de nuevo? `npm run reset`.

## Catálogo de retos

| Rama | Cinturón | Tema | Síntoma | Verifica | Tiempo | Estado |
|---|---|---|---|---|---|---|
| `challenge/junior/routing` | blanco | Router | "pantalla en blanco" | Jest + Playwright | 30 min | **disponible** |
| `challenge/junior/no-compila` | blanco | TS + plantillas | "no compila" | `ng build` + Jest | 25 min | próximamente |
| `challenge/mid/zoneless-no-refresca` | azul | Change detection | "la UI se congela" | Jest + Playwright | 60 min | próximamente |
| `challenge/mid/race-condition` | azul | RxJS | "resultados fuera de orden" | Jest (fake timers) + Playwright | 70 min | próximamente |
| `challenge/senior/perf-lista` | negro | Performance | "se arrastra con 10k filas" | Playwright + budget de build | 120 min | próximamente |
| `challenge/senior/memory-leak` | negro | Ciclo de vida | "la memoria crece al navegar" | Jest + Playwright | 120 min | próximamente |

Por cada `challenge/<nivel>/<tema>` existe su contraparte `solution/<nivel>/<tema>` — el mismo
reto, ya resuelto, publicada para que compares tu enfoque después de intentarlo (no antes).

> El catálogo completo, con metadatos, vive en [`challenges.json`](challenges.json) y se genera
> con `npm run catalog` a partir de `challenges/*/meta.json`.

## Reglas del dojo

1. **No mires `solution/*` antes de intentarlo.** Si te rendiste, está bien mirarla — pero
   después de pelear un rato, no antes.
2. **No edites nada dentro de `verify/`.** Es la parte que califica el reto, no el reto en sí.
   `npm run verify` compara el hash de esos archivos contra el original y te avisa si no coinciden.
3. **Un reto a la vez.** Termina o resetea (`npm run reset`) antes de saltar a otro; el CLI te
   avisa si tienes cambios sin commitear.
4. **Las pistas se piden, no se buscan en el código fuente.** `npm run hint` existe para eso.
5. **El objetivo es entender el porqué, no solo poner `verify` en verde.** Usa las herramientas
   que quieras para investigar — pero si solo copias sin entender, el próximo reto te va a costar
   el doble.

## Rúbrica: qué significa pasar cada cinturón

| Cinturón | Retos que lo componen | Lo que demuestra |
|---|---|---|
| **Blanco (junior)** | routing, no-compila | Lees un error de TypeScript con `strictTemplates` y sabes qué te está diciendo. Entiendes cómo Angular resuelve rutas, `loadComponent` y el orden en que se evalúan. |
| **Azul (mid)** | zoneless-no-refresca, race-condition | Sabes por qué una mutación no dispara change detection en una app zoneless, y qué operador de RxJS usar (y cuál no) cuando el orden de las respuestas importa. |
| **Negro (senior)** | perf-lista, memory-leak | Puedes perfilar por qué una lista de 10 000 filas se arrastra y arreglarlo sin reescribir la app, y encontrar una suscripción que nadie liberó antes de que se note en producción. |

`npm run progress` pinta tu avance por cinturón en cualquier momento.

## Para entrevistadores

Un reto de este repo funciona bien como ejercicio de live coding porque **no lo escribiste tú**:
es código ajeno, con un bug real y una verificación objetiva, no una opinión sobre el estilo de
quien lo resuelve.

Sugerencia de uso:

1. Elige un reto acorde al nivel de la vacante (la tabla de arriba trae cinturón y tiempo estimado).
2. Comparte solo la rama `challenge/<nivel>/<tema>` — la de `solution/*` es pública, así que si te
   importa que no la vean antes, dales un checkout específico en vez del repo completo.
3. Dales el tiempo estimado de `meta.json` más un margen razonable. `npm run verify` es el
   criterio objetivo; cómo llegaron ahí es lo que evalúas tú.
4. `npm run hint` está disponible para la persona candidata igual que en cualquier trabajo real:
   usarlo no es trampa, ignorarlo tampoco es un plus.

## Cómo contribuir

¿Quieres agregar un reto nuevo? Lee [`CONTRIBUTING.md`](CONTRIBUTING.md) — el resumen corto es:
copia `challenges/_template/`, siembra los bugs en `overlay/`, arréglalos en `solution/`, escribe
`verify/` para que falle en uno y pase en el otro, y corre `npm run ci:check-challenges` antes de
abrir el PR.

## Roadmap

**Tanda 1 (v1)** — en progreso, ver tabla de arriba.

**Tanda 2 — próximamente**

- junior: bindings y control flow · forms básico · signals básico · HTTP con `resource`/`httpResource`
- mid: inyección de dependencias y `NG0203` · guards e interceptors · forms avanzado con `ControlValueAccessor`
- senior: SSR con errores de hydration (`NG0500`/`NG0501`) · API pública de librería (`input()`/`output()`/`model()`) · `NG0100`/`NG0200` · a11y con focus trap

**Tanda 3 — próximamente**

- Expansión según lo que pida la comunidad. Abre un issue si tienes un bug real de Angular que
  te haya dolido y creas que merece ser un reto.

## FAQ

**¿Tengo que enviar mi solución a algún lado?**
No. No hay servidor, no hay cuenta, no hay ranking. `npm run verify` corre en tu máquina y el
resultado es tuyo.

**¿Puedo usar un asistente de IA para resolver los retos?**
Es tu tiempo. El punto de estos retos no es que `verify` quede en verde — es que la próxima vez
que veas ese mismo bug en un código real, lo reconozcas en segundos. Usa las herramientas que
quieras, pero no te hagas trampa a ti mismo.

**Edité algo en `verify/` sin querer, ¿ahora qué?**
`npm run reset` restaura el reto completo a su estado original (con confirmación antes de
descartar tus cambios).

**¿Por qué Jest y no Karma/Jasmine?**
Karma quedó deprecado a partir de Angular v20. Jest con `jest-preset-angular` corre en Node,
arranca más rápido y tiene mejor soporte para fake timers, útil para los retos de condiciones de
carrera.

**¿Por qué las ramas no se editan a mano?**
Con 6+ retos y una sola plataforma base, un cambio en el shell (una versión de Angular, un ajuste
de estilos) tendría que replicarse a mano en cada rama. En vez de eso, `main` es la única fuente
de verdad y `scripts/build-branches.mjs` regenera las ramas desde ahí.

## Stack técnico

- **Angular 20** — standalone components, signals, `provideZonelessChangeDetection()`, nuevo
  control flow (`@if`/`@for`), `httpResource()`.
- **TypeScript strict** — `strict`, `strictTemplates`, `noPropertyAccessFromIndexSignature`.
- **Jest** + `jest-preset-angular` (`setupZonelessTestEnv()`) para unit e integración con TestBed.
- **Playwright** + `@axe-core/playwright` para e2e y accesibilidad contra Chromium real.
- **Cero dependencias en el CLI del dojo** — `scripts/*.mjs` usa solo `node:*` (incluido
  `readline/promises` para los menús interactivos).
- Mock API en memoria con semilla fija (`src/app/core/mock-api/`) para fixtures y errores
  deterministas, sin red real.

## Licencia

[MIT](LICENSE) — usa esto para practicar, para entrevistar, para enseñar. Si armas tu propio
dojo a partir de este repo, un crédito se agradece pero no se exige.
