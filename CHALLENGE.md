# Reto: Zoneless — la UI no refresca

**Cinturón:** azul · **Tema:** Change detection · **Tiempo estimado:** 60 min · **Bugs:** 4

## Síntoma

Abres el tablero de asistencia del dojo en `/asistencia`. Marcas a un alumno como presente y...
nada. El contador de presentes no cambia. Agregas un alumno nuevo y no aparece en la lista.
Arrancas el cronómetro y el número se queda pegado en `0s`. No hay ningún error en la consola —
la aplicación simplemente no vuelve a pintar después de la primera carga.

Este proyecto corre sin Zone.js (`provideZonelessChangeDetection()`). Sin Zone.js parchando
`setTimeout`/eventos globales para avisarle a Angular "algo cambió, revisa la vista", la única
forma en que Angular sabe que debe repintar es que una **señal que se está leyendo en la
plantilla cambie de valor** (con `.set()` o `.update()`, nunca mutando en sitio).

## Qué se espera

`src/app/features/mid-01-zoneless-no-refresca/asistencia-board.ts` debe:

- Marcar a un alumno como presente y ver el contador y su fila actualizarse al instante.
- Agregar un alumno nuevo y verlo aparecer en la lista.
- Iniciar el cronómetro y ver el contador de segundos avanzar cada segundo, con el texto de
  abajo reflejando el segundo actual.

## Dónde mirar

- `src/app/features/mid-01-zoneless-no-refresca/asistencia-board.ts` — los cuatro bugs viven aquí.
- `src/app/features/mid-01-zoneless-no-refresca/alumno-row.ts` — es un componente `OnPush`, no
  necesitas tocarlo, pero entender por qué es `OnPush` ayuda a entender el segundo bug.

## Criterios de aceptación

- Al hacer click en "Marcar presente" de un alumno, su estado cambia a "Presente" y el contador
  de arriba se actualiza sin recargar la página.
- Al agregar un alumno con el formulario, aparece en la lista de inmediato.
- Al iniciar el cronómetro, el texto `Ns transcurridos` avanza cada segundo real.

## Cómo verificar

```bash
npm run verify
```

Corre tests de componente en Jest (incluyendo el cronómetro con temporizadores simulados) y un
e2e de Playwright que hace click y espera el texto nuevo. Si te atoras, `npm run hint` da una
pista a la vez.
