# Pistas — junior-05-signals-basico

## Pista 1

Una señal (`signal(...)`) no es un valor, es una función que **devuelve** el valor. Revisa cada
lugar donde `rutina-diaria.html` muestra un número: ¿en todos los casos se está llamando a la
señal con `()`, o hay alguno donde se interpola la señal misma?

## Pista 2

`incrementar()`, `sumarRacha()` y `subirMeta()` en `rutina-diaria.ts` tienen tres formas distintas
de fallar al actualizar el estado:

- Una de ellas nunca llama a `.set()` ni a `.update()` sobre la señal — solo hace cuentas con una
  variable local que se descarta al terminar el método.
- Otra sí llama a `.update()`, pero la función que le pasa no le suma nada al valor recibido.

## Pista 3

`metaDiaria` no es una señal, es una propiedad de clase normal (`protected metaDiaria = 5`), y
`metaTexto` es un `computed(...)` que solo lee esa propiedad. Un `computed` únicamente vuelve a
calcularse cuando cambia una **señal** de la que depende — si no lee ninguna señal, Angular lo
calcula una vez y lo deja en caché para siempre, sin importar cuántas veces reasignes
`this.metaDiaria` después. La solución pasa por convertir `metaDiaria` en una señal (y actualizarla
con `.update()`, no con `+=`).
