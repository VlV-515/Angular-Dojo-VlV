# Reto: Guard e interceptor: cualquiera entra al panel

**Cinturón:** azul · **Tema:** Guards e interceptors · **Tiempo estimado:** 60 min · **Bugs:** 4

## Síntoma

Sin haber iniciado sesión, escribes `/panel` directo en la barra de direcciones — y el panel se
abre igual, como si tuvieras una sesión activa. Y cuando sí inicias la sesión falsa desde
`/panel-entrada` y entras al panel, las peticiones que hace esa pantalla fallan **siempre** con un
error de autorización, como si el token nunca se hubiera enviado.

## Qué se espera

La feature vive en `src/app/features/mid-04-guards-interceptors/`:

- `/panel-entrada` — landing pública con un botón para iniciar o cerrar una sesión falsa
  (`AuthState`, un servicio con una señal y un token de mentira).
- `/panel` — zona protegida: solo debe poder entrar quien tiene esa sesión falsa iniciada. Quien
  no la tiene debe terminar de vuelta en `/panel-entrada`.
- Las peticiones que `/panel` hace al mock API deben llevar el token falso en el header
  `Authorization`. Sin ese header (o con uno incorrecto), el mock API responde con un 401
  simulado.

## Dónde mirar

Hay cuatro bugs, todos de lógica en tiempo de ejecución (el proyecto compila sin problema):

- `src/app/features/mid-04-guards-interceptors/auth.guard.ts`
- `src/app/features/mid-04-guards-interceptors/auth.interceptor.ts`
- `src/app/app.routes.ts`
- `src/app/app.config.ts`

No necesitas tocar `auth-state.ts`, los componentes `panel.ts`/`panel-entrada.ts`, ni el mock API
(`src/app/core/mock-api/fixtures/panel.ts`).

## Criterios de aceptación

- Sin sesión iniciada, entrar a `/panel` termina en `/panel-entrada`.
- Con sesión iniciada, `/panel` muestra los datos del panel — no un error de autorización.
- El guard, probado de forma aislada (sin pasar por el router), deja pasar cuando hay sesión y
  redirige cuando no la hay.

## Cómo verificar

```bash
npm run verify
```

Corre Jest (el guard aislado y el interceptor contra el mock API) y un e2e de Playwright que
navega a `/panel` sin sesión y con sesión. Si te atoras, `npm run hint` da una pista a la vez.
