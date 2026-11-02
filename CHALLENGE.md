# Reto: Perf — la lista se arrastra con 10k filas

**Cinturón:** negro · **Tema:** Perf · **Tiempo estimado:** 120 min · **Bugs:** 5

## Síntoma

Abres el padrón del dojo en `/padron`: diez mil alumnos. Escribir en el buscador se siente con
retraso, el navegador tarda en pintar, y `npm run build` ni siquiera termina — truena por
presupuesto de bundle excedido. Nada de esto es un bug de comportamiento: todo funciona, todo es
**lento**, y eso también cuenta como roto.

## Qué se espera

`src/app/features/senior-01-perf-lista/padron-list.ts` debe mostrar los diez mil alumnos,
permitir filtrarlos por nombre y ver un resumen (total y cuántos están "en racha"), todo sin que
el navegador tenga que crear diez mil nodos DOM de golpe ni recalcular trabajo redundante en cada
ciclo de detección de cambios. Y `ng build` debe terminar dentro del presupuesto configurado.

## Dónde mirar

- `src/app/features/senior-01-perf-lista/data.ts` — cómo llegan los diez mil alumnos al bundle.
- `src/app/features/senior-01-perf-lista/padron-list.ts` y `.html` — cómo se renderizan y se
  calcula el resumen.
- `src/app/features/senior-01-perf-lista/cinturon-label.pipe.ts` — cómo está declarado el pipe.
- `angular.json` — el presupuesto (`budgets`) que `ng build` tiene que respetar.

## Criterios de aceptación

- `ng build` termina dentro del presupuesto configurado (tipo `any`, por chunk).
- Con el filtro vacío o con texto, el número de filas realmente presentes en el DOM se mantiene
  bajo, sin importar cuántos alumnos calcen el filtro.
- Escribir en el buscador y ver la lista actualizada toma un tiempo razonable, no varios
  segundos.

## Cómo verificar

```bash
npm run verify
```

Corre un e2e de Playwright que mide cuántos nodos `.fila` hay en el DOM y cuánto tarda una
interacción de filtrado, más `ng build` con el presupuesto puesto. Si te atoras, `npm run hint`
da una pista a la vez.
