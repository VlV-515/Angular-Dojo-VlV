# Reto: httpResource — la ficha no cambia

**Cinturón:** blanco · **Tema:** HTTP con resource/httpResource · **Tiempo estimado:** 35 min · **Bugs:** 4

## Síntoma

Abres la ficha técnica en `/ficha-tecnica`. Se ve la primera técnica de la lista ("Zenkutsu
dachi") con su descripción. Haces clic en cualquier otro botón del selector ("Gyaku zuki",
"Ushiro geri"...) y no pasa nada: la ficha mostrada sigue siendo siempre la misma. Si además
haces clic en "Kata fantasma (no existe)" — la única opción que a propósito no existe en el
mock API — la pantalla tampoco avisa de nada raro. Y si intentas el botón "Reintentar", tampoco
cambia nada.

## Qué se espera

`src/app/features/junior-06-http-resource/ficha-tecnica.ts` usa `httpResource()` para traer los
datos de una ficha técnica del mock API, según la técnica elegida en un selector de botones.

- Al elegir una técnica distinta, la ficha mostrada debe corresponder a **esa** técnica, no
  siempre a la primera.
- Mientras se está cargando una ficha, debe verse un indicador de carga, no datos vacíos o
  desactualizados sin avisar.
- Si la ficha pedida no existe, debe verse un mensaje de error visible, no una pantalla en
  blanco.
- El botón "Reintentar" debe volver a pedir los datos de verdad.

## Dónde mirar

Todo el problema vive en la feature de `src/app/features/junior-06-http-resource/`:

- `ficha-tecnica.ts` — cómo se arma la función de `httpResource(...)` y qué hace `reintentar()`.
- `ficha-tecnica.html` — qué se lee del `httpResource` y en qué orden.

No necesitas tocar el mock API (`src/app/core/mock-api/`): los datos y la latencia simulada ya
están listos ahí para que el reto se reproduzca siempre igual.

Preguntas que te pueden ayudar:

- La reactividad de `httpResource()` depende únicamente de qué señales lee la función que le
  pasas. ¿Esa función lee de verdad la selección actual?
- `ResourceRef` expone `.value()`, `.isLoading()` y `.error()` como señales (hay que
  **llamarlas**, no leerlas como propiedades). ¿Se consultan todas antes de mostrar algo?
- `reload()` fuerza una recarga real. ¿El botón "Reintentar" la está llamando, o solo está
  tocando una señal que ya tenía ese mismo valor?

## Criterios de aceptación

- Al elegir otra ficha en el selector, el contenido mostrado cambia a la técnica elegida.
- Mientras carga, se ve un indicador de carga.
- Si la ficha no existe, se ve un mensaje de error visible.
- "Reintentar" dispara una nueva petición de verdad.

## Cómo verificar

```bash
npm run verify
```

Corre un test de Jest que ejercita los tres comportamientos y un e2e de Playwright que cambia
la selección de verdad en el navegador. Si te atoras, `npm run hint` da una pista a la vez.
