# Angular Dojo VlV — plan de construcción

## Contexto

`angular-vlv` hoy es un Angular 20.3.34 recién generado por CLI: zoneless ya activo (`provideZonelessChangeDetection`), `strict` + `strictTemplates` + `noPropertyAccessFromIndexSignature`, router sin rutas, sin HttpClient, Karma/Jasmine por defecto y el `app.html` placeholder del CLI.

La meta: convertirlo en una plataforma pública de práctica llamada **Angular Dojo VlV**, donde cada rama git es una app Angular **ya rota** y la persona la repara. Tres cinturones (junior / mid / senior), varios tipos de falla (no compila, pantalla en blanco, bug de runtime, race condition, perf, SSR, a11y). No hay envío ni servidor: la persona clona, elige rama, lee el brief, arregla y corre `npm run verify` para saber si quedó.

El referente del mercado es [tomalaforge/angular-challenges](https://github.com/tomalaforge/angular-challenges): 65 retos, monorepo Nx, carpetas, y el estilo es "construye esta feature". El hueco que llena este proyecto es el opuesto y no existe hoy: **código roto heredado que hay que diagnosticar y reparar, con verificación objetiva local**. Eso es lo que se parece al trabajo real y lo que hace creíble el claim "si pasas los tres niveles, eres muy bueno en Angular".

### Decisiones ya tomadas por el usuario

| Tema | Decisión |
|---|---|
| Nombre | **Angular Dojo VlV** (repo puede seguir llamándose `angular-vlv`) |
| Idioma de docs | Solo español (es-LATAM) |
| Origen de las ramas | Generadas por script desde overlays en `main` |
| Verificación | **Jest** (`jest-preset-angular`, zoneless) + **Playwright** (+ axe) |
| App base | Shell común en `main`, cada reto vive en su feature aislado |
| Soluciones | Ramas `solution/*` publicadas |
| Alcance v1 | Plataforma + 6 retos (2 por cinturón) |

## Arquitectura

### Principio rector: las ramas son un artefacto compilado

Editar 40 ramas a mano muere al primer `ng update`. La fuente única de verdad vive en `main`; un script materializa las ramas.

```
main/
├─ src/                          # SHELL BASE que heredan todas las ramas
│  ├─ main.ts, index.html, styles.scss
│  └─ app/
│     ├─ app.ts | app.html | app.routes.ts | app.config.ts   # layout del dojo + nav
│     ├─ core/mock-api/          # interceptor + fixtures deterministas + latency()/failEvery()
│     ├─ core/ui/                # card, badge, button, spinner (CSS propio, sin librería)
│     └─ features/home/          # catálogo de retos, lee challenges.json
├─ challenges/
│  ├─ _template/                 # plantilla para reto nuevo
│  └─ <slug>/
│     ├─ meta.json               # metadatos + targets de verificación
│     ├─ CHALLENGE.md            # síntoma, qué se espera, criterios de aceptación
│     ├─ HINTS.md                # 3 niveles de pista progresiva
│     ├─ overlay/                # archivos que se copian sobre el shell → estado ROTO
│     ├─ solution/                # archivos que se copian sobre overlay → estado ARREGLADO
│     └─ verify/                 # specs Jest y/o Playwright (idénticos en reto y solución)
├─ scripts/
│  ├─ build-catalog.mjs          # challenges/*/meta.json → challenges.json (valida schema)
│  ├─ build-branches.mjs         # genera challenge/* y solution/* vía git worktree
│  ├─ play.mjs verify.mjs hint.mjs reset.mjs progress.mjs
│  └─ lib/catalog.mjs
├─ challenges.json               # catálogo compilado (lo consumen README, app home y CLI)
├─ jest.config.ts setup-jest.ts playwright.config.ts
└─ .github/workflows/ci.yml
```

### Ramas generadas

- `challenge/<level>/<slug>` = shell base + `overlay/` + `verify/` + `CHALLENGE.md` en la raíz + `.dojo/HINTS.md` + `.challenge.json`
- `solution/<level>/<slug>` = lo mismo + `solution/` aplicado encima

Nacen del tag `base-v1` (commit del shell), un solo commit por rama, regenerables con `--force-with-lease`. El generador **no** copia `challenges/` ni `scripts/build-branches.mjs` a las ramas (si no, el reto trae su propia solución adentro); sí copia `challenges.json` (solo metadatos) para que el CLI funcione dentro de la rama.

### El invariante de calidad (esto es lo que sostiene el proyecto)

CI valida **dos** cosas por reto, no una:

1. En estado solución, `npm run verify` **pasa** → el reto es resoluble.
2. En estado roto, `npm run verify` **falla** → el reto de verdad reta algo.

Si (2) pasa, el reto es decorativo y CI lo rechaza. CI materializa las ramas en worktrees temporales, así que valida **antes** de publicar nada.

### Reparto de runners

- **Jest** (jsdom, `setupZonelessTestEnv()` de `jest-preset-angular` — encaja con la base zoneless): lógica, DI, signals, componentes con TestBed, RouterTestingHarness, fake timers para race conditions.
- **Playwright** (Chromium real): lo que jsdom no puede — hydration SSR, errores de consola en runtime, conteo de nodos DOM, umbrales de interacción, a11y con `@axe-core/playwright`, navegación por teclado.
- **`ng build`**: retos de "no compila" y de budgets de bundle.

Salen: `karma`, `karma-*`, `jasmine-core`, `@types/jasmine` y el target `test` de Karma en `angular.json` (Karma quedó deprecado en v20). Entran: `jest`, `jest-preset-angular`, `@types/jest`, `@playwright/test`, `@axe-core/playwright`.

### Anti-trampa y DX

- `.challenge.json` guarda el hash de cada archivo de `verify/`; `verify.mjs` compara antes de correr y avisa si los tests fueron editados.
- `npm run play` → menú interactivo (cinturón, tema, síntoma, tiempo, estado), hace checkout e imprime el brief. Cero dependencias, `readline` nativo.
- `npm run hint` → pista siguiente, una a una, sin quemar las tres.
- `npm run reset` → restaura el reto al estado original (con confirmación).
- `npm run progress` → lee `.dojo-progress.json` (gitignored) y pinta el avance por cinturón.

### Mock API

`provideHttpClient(withFetch(), withInterceptors([mockApiInterceptor]))` sobre fixtures en memoria con seed fijo. Determinista, offline, y con `latency()` / `failEvery()` para fabricar race conditions y errores reproducibles.

## Catálogo

### Tanda 1 (v1, los 6 que se construyen ahora)

| Rama | Cinturón | Tema | Síntoma | Verifica | Min |
|---|---|---|---|---|---|
| `junior/routing` | blanco | Router | pantalla en blanco | Jest + e2e | 30 |
| `junior/no-compila` | blanco | TS + plantillas | no compila | build + Jest | 25 |
| `mid/zoneless-no-refresca` | azul | Change detection | UI congelada | Jest + e2e | 60 |
| `mid/race-condition` | azul | RxJS | resultados fuera de orden | Jest (timers) + e2e | 70 |
| `senior/perf-lista` | negro | Perf | app se arrastra con 10k filas | e2e + build budget | 120 |
| `senior/memory-leak` | negro | Ciclo de vida | crece la memoria al navegar | Jest + e2e | 120 |

Detalle de bugs sembrados:

- **junior/routing**: `loadComponent` apuntando al export equivocado, `routerLink` con array mal armado, wildcard `**` antes de las rutas hijas, falta `withComponentInputBinding()`, el detalle nunca lee el `id`.
- **junior/no-compila**: 6 errores — import faltante en `imports:`, `@if` mal cerrado, mismatch de tipos que caza `strictTemplates`, `input.required` sin binding, pipe no importado, acceso con punto a index signature (`noPropertyAccessFromIndexSignature` ya está prendido en el tsconfig).
- **mid/zoneless-no-refresca**: array mutado por referencia, objeto mutado bajo `OnPush`, `setTimeout` escribiendo fuera de señales, `computed` que lee estado no reactivo.
- **mid/race-condition**: `mergeMap` donde va `switchMap`, sin debounce, sin cancelación, subscription filtrada. El mock devuelve las queries cortas más lento a propósito, así el orden se rompe siempre igual.
- **senior/perf-lista**: `track $index`, pipe impuro en el template, `computed` recreado por render, sin `@defer` ni virtual scroll, budget de bundle rebasado.
- **senior/memory-leak**: listeners y subscriptions sin liberar, `effect` sin `DestroyRef`, falta `takeUntilDestroyed`. Se verifica con conteo de instancias en Jest y con e2e que navega 20 veces midiendo listeners.

**Nota sobre SSR**: `senior/ssr-hydration` (NG0500/NG0501, `window` en servidor, doble fetch sin transfer state) queda para la tanda 2, no por dificultad sino porque activar SSR en el shell obligaría a todos los demás retos a correr en servidor. Se resuelve así: las dependencias de `@angular/ssr` entran en el `package.json` base, pero SSR se **activa solo desde el overlay** de ese reto. Se prueba cuando el generador ya esté rodado.

### Tanda 2 y 3 (roadmap público en el README, con estado "próximamente")

junior: bindings y control flow · forms básico · signals básico · http con `resource`/`httpResource`
mid: DI y NG0203 · guards + interceptors · forms avanzado con `ControlValueAccessor` · tests rojos
senior: SSR/hydration · API pública de librería (`input()`/`output()`/`model()`) · NG0100/NG0200 · a11y + focus trap · `@defer`/chunks/budgets

## Archivos clave a crear o modificar

- `package.json` — scripts del CLI, fuera Karma, entra Jest + Playwright
- `angular.json` — quitar target `test` de Karma
- `jest.config.ts`, `setup-jest.ts`, `playwright.config.ts` — nuevos
- `src/app/app.*`, `src/app/core/`, `src/app/features/home/` — shell del dojo (reemplaza el placeholder del CLI)
- `scripts/*.mjs` — generador y CLI
- `challenges/_template/`, `challenges/<slug>/` — contenido
- `README.md` — reescrito completo como escaparate
- `CONTRIBUTING.md`, `LICENSE` (MIT), `.github/workflows/ci.yml` — nuevos

## Verificación end-to-end

1. `npm ci && npm run build` en `main` — el shell compila.
2. `npm run test:unit` — smoke del shell en verde con Jest zoneless.
3. `npm run catalog` — `challenges.json` se genera y valida contra el schema.
4. `npm run build:branches -- --dry-run` — materializa worktrees temporales sin tocar ramas remotas.
5. Por cada reto: en el worktree de solución `npm run verify` **pasa**; en el de reto **falla** con mensaje legible.
6. `npx playwright test` — e2e verdes contra el dev server.
7. `npm run play` — lista los 6 retos, hace checkout, imprime el brief. `npm run hint`, `reset`, `progress` responden.
8. `.github/workflows/ci.yml` verde en GitHub, incluyendo el invariante roto-falla / solución-pasa.

---

# Prompts para pegar en sesión nueva

Cada uno es autocontenido. Corre el 1 y el 2 para tener la v1 publicable. El 3 es expansión.

## PROMPT 1 — Plataforma + reto piloto

```
Vamos a construir "Angular Dojo VlV": una plataforma pública de práctica de Angular donde cada rama git es una app ya rota y la persona la repara. Tres cinturones: junior (blanco), mid (azul), senior (negro). No hay servidor ni envíos: se clona, se elige rama, se lee el brief, se arregla y `npm run verify` dice si quedó.

Repo: /Users/vlv/Sites/SideProjects/angular-vlv (Angular 20.3.34 recién generado, zoneless activo, strict + strictTemplates + noPropertyAccessFromIndexSignature). El plan completo está en /Users/vlv/.claude/plans/platiquemos-y-saquemos-la-rustling-mountain.md — léelo primero y cópialo a docs/PLAN.md del repo.

Decisiones ya cerradas, no las re-litigues:
- Toda la documentación en español (es-LATAM), con acentos correctos.
- Las ramas son un ARTEFACTO GENERADO. La fuente única vive en main bajo challenges/<slug>/{meta.json, CHALLENGE.md, HINTS.md, overlay/, solution/, verify/} y un script materializa challenge/<level>/<slug> y solution/<level>/<slug>.
- Testing: Jest con jest-preset-angular usando setupZonelessTestEnv(), más Playwright con @axe-core/playwright. Fuera karma, karma-*, jasmine-core, @types/jasmine y el target test de Karma en angular.json.
- Shell común en main; cada reto vive aislado en src/app/features/<slug>/.
- Se publican ramas solution/*.

En esta sesión entrega:

1. Shell base del dojo en src/: layout con nav, estilos propios sin librerías externas, y src/app/features/home/ que renderiza el catálogo leyendo challenges.json. Reemplaza por completo el app.html placeholder del CLI.
2. Mock API en src/app/core/mock-api/: interceptor sobre provideHttpClient(withFetch(), withInterceptors([...])), fixtures en memoria con seed fijo, y helpers latency() y failEvery() para fabricar latencia y errores deterministas.
3. Migración de testing: jest.config.ts, setup-jest.ts, playwright.config.ts, y conversión del spec existente src/app/app.spec.ts.
4. scripts/build-catalog.mjs: challenges/*/meta.json → challenges.json, validando schema (id, level, belt, order, title, topic, tags, failureModes, timeMinutes, bugs, verify:{unit,e2e,build}, status).
5. scripts/build-branches.mjs: genera las ramas vía git worktree desde el tag base-v1, un commit por rama, con --dry-run que materializa en carpetas temporales sin tocar remotos. NO debe copiar challenges/ ni build-branches.mjs a las ramas; sí copia challenges.json, CHALLENGE.md en la raíz, .dojo/HINTS.md y .challenge.json (que incluye el hash de cada archivo de verify/).
6. CLI sin dependencias, con readline nativo: scripts/play.mjs (menú interactivo que lista cinturón/tema/síntoma/tiempo/estado, hace checkout e imprime el brief), verify.mjs (valida los hashes de verify/, luego corre lo que pida meta.json: jest, playwright, ng build), hint.mjs (pistas de una en una), reset.mjs (restaura con confirmación), progress.mjs (lee .dojo-progress.json, gitignored).
7. Reto piloto completo: challenges/junior-01-routing/. Síntoma "pantalla en blanco". Cinco bugs: loadComponent apuntando al export equivocado, routerLink con array mal armado, wildcard ** antes de las rutas hijas, falta withComponentInputBinding(), y el componente de detalle nunca lee el id. Verificación con Jest (RouterTestingHarness) y un e2e de Playwright que navega lista → detalle. Incluye challenges/_template/ como plantilla para retos futuros.
8. README.md reescrito de cero como escaparate en español que se venda solo: hero de una línea, badges, cómo funciona en 3 pasos, tabla de retos con cinturón/tema/síntoma/tiempo, reglas del dojo, rúbrica de qué significa pasar cada nivel, sección para entrevistadores que quieran usar un reto como live coding, cómo contribuir, FAQ. Incluye el roadmap de los retos de tandas 2 y 3 marcados como próximamente. Más CONTRIBUTING.md y LICENSE MIT.
9. .github/workflows/ci.yml que hace valer el invariante de calidad: por cada reto, en estado solución `verify` debe PASAR, y en estado roto `verify` debe FALLAR. Un reto cuyo estado roto pasa la verificación se rechaza. CI materializa las ramas en worktrees temporales, así que valida antes de publicar. Instala solo chromium.

Al terminar, corre y muéstrame en verde: npm run build, npm run test:unit, npm run catalog, npm run build:branches -- --dry-run, el verify pasando en la solución del piloto y fallando en el reto, npx playwright test, y npm run play listando el catálogo. No hagas push de ramas todavía.
```

## PROMPT 2 — Los 5 retos que faltan de la v1

```
Continuamos "Angular Dojo VlV" en /Users/vlv/Sites/SideProjects/angular-vlv. La plataforma y el reto piloto junior-01-routing ya están. Lee docs/PLAN.md, challenges/_template/ y challenges/junior-01-routing/ para clonar exactamente el patrón establecido.

Construye estos 5 retos, cada uno con meta.json, CHALLENGE.md, HINTS.md con tres pistas progresivas, overlay/, solution/ y verify/. Todo en español. Cada reto vive aislado en su propia feature y no debe romper a los demás.

1. junior-02-no-compila — cinturón blanco, 25 min, síntoma "no compila". Seis errores: import faltante en imports:, @if mal cerrado, mismatch de tipos que caza strictTemplates, input.required sin binding, pipe no importado, y acceso con punto a una index signature (noPropertyAccessFromIndexSignature ya está prendido). Verifica con ng build más un smoke de Jest.

2. mid-01-zoneless-no-refresca — cinturón azul, 60 min, síntoma "la UI se queda congelada". Array mutado por referencia, objeto mutado bajo OnPush, setTimeout escribiendo fuera de señales, computed que lee estado no reactivo. Verifica con tests de componente en Jest y un e2e que hace click y espera el texto nuevo.

3. mid-02-race-condition — cinturón azul, 70 min, síntoma "los resultados de búsqueda llegan fuera de orden". mergeMap donde va switchMap, sin debounce, sin cancelación, subscription filtrada. Configura el mock API para que las queries cortas respondan más lento a propósito, así el orden se rompe de forma reproducible. Verifica con Jest usando fake timers y un e2e que teclea rápido.

4. senior-01-perf-lista — cinturón negro, 120 min, síntoma "la app se arrastra con 10k filas". track $index, pipe impuro en el template, computed recreado por render, sin @defer ni virtual scroll, budget de bundle rebasado. Verifica con Playwright midiendo conteo de nodos DOM y un umbral de tiempo de interacción, más ng build con el budget puesto.

5. senior-02-memory-leak — cinturón negro, 120 min, síntoma "la memoria crece al navegar". Listeners y subscriptions sin liberar, effect sin DestroyRef, falta takeUntilDestroyed. Verifica con conteo de instancias en Jest y un e2e que navega 20 veces midiendo listeners.

Reglas: los umbrales de los tests de perf y memoria deben tener margen para no ser flaky en CI, y cada reto tiene que cumplir el invariante — verify FALLA en estado roto y PASA en estado solución. Corre el CI local completo y muéstrame la matriz de los 6 retos en verde antes de terminar.
```

## PROMPT 3 — Expansión y publicación

```
"Angular Dojo VlV" en /Users/vlv/Sites/SideProjects/angular-vlv ya tiene plataforma y 6 retos. Lee docs/PLAN.md. Ahora la tanda 2 y la publicación.

1. Agrega estos retos siguiendo el patrón existente: junior de bindings y control flow, junior de forms básico, junior de signals básico, junior de http con resource/httpResource, mid de DI con NG0203, mid de guards e interceptors, senior de SSR con errores de hydration (NG0500/NG0501, window en servidor, doble fetch sin transfer state) y senior de a11y con focus trap verificado con @axe-core/playwright.

2. Para el reto de SSR: las dependencias de @angular/ssr van en el package.json base, pero SSR se activa SOLO desde el overlay de ese reto (server.ts y config vienen del overlay), para no obligar a los demás retos a correr en servidor.

3. Publica las ramas: corre el generador de verdad con --force-with-lease y documenta en el README que las ramas se regeneran y que hay que hacer git fetch --all --prune.

4. Graba un GIF o asciinema de npm run play → verify fallando → arreglo → verify verde, y ponlo en el hero del README.

Al final dime qué ramas quedaron publicadas y el estado del CI.
```
