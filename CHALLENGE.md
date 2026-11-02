# Reto: DI — NG0203 al programar un recordatorio

**Cinturón:** azul · **Tema:** Dependency Injection · **Tiempo estimado:** 55 min · **Bugs:** 3

## Síntoma

Entras a `/mid-03-di-ng0203` y ves el panel de avisos sin problema. Le das clic a "Programar
recordatorio" y, por un par de segundos, todo parece normal... hasta que se cumple el plazo: la
consola escupe un error de Angular (`NG0203`) y el recordatorio nunca llega a registrarse.

Eso no es lo único raro. Aunque arreglaras ese error, el historial de avisos de abajo se queda
vacío para siempre, como si nunca se guardara nada. Y el título del panel muestra un emoji que no
tiene nada que ver con el que se supone que configura la ruta.

## Qué se espera

`src/app/features/mid-03-di-ng0203/` implementa un panelito de avisos:

- Un botón "Programar recordatorio" agenda un aviso que debe registrarse un rato después (sin
  romper nada cuando se cumple el plazo).
- El historial de abajo (`HistorialAvisos`) debe mostrar los avisos según se van registrando,
  vengan de donde vengan.
- El título del panel debe mostrar el prefijo que configura la ruta en `app.routes.ts` — no un
  valor fijo que ignora esa configuración.

## Dónde mirar

Hay tres bugs, todos relacionados con cómo y dónde se usa la inyección de dependencias:

- `src/app/features/mid-03-di-ng0203/panel-avisos.ts`
- `src/app/features/mid-03-di-ng0203/historial-avisos.ts`

No necesitas tocar `avisos.service.ts` ni `app.routes.ts` — ya están bien, son la referencia
contra la que se comparan los otros dos archivos.

## Criterios de aceptación

- Programar un recordatorio y esperar a que se cumpla el plazo no debe lanzar ningún error en
  consola, y el aviso debe terminar registrado.
- El historial debe reflejar los avisos que registra el resto de la app, no quedarse siempre
  vacío.
- El prefijo del título debe ser el que configura la ruta, no un valor que nadie más provee.

## Cómo verificar

```bash
npm run verify
```

Corre un test de Jest que programa un recordatorio con timers falsos, revisa el historial y
comprueba el prefijo del título. Si te atoras, `npm run hint` da una pista a la vez.
