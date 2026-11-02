# Reto: RxJS — resultados fuera de orden

**Cinturón:** azul · **Tema:** RxJS · **Tiempo estimado:** 70 min · **Bugs:** 4

## Síntoma

Abres el buscador de técnicas en `/buscador` y escribes rápido, como escribe cualquier persona:
primero "ma", te arrepientes y completas a "mae geri". La lista de resultados parpadea y al
final se queda mostrando **los resultados de "ma"** (una lista larga, con técnicas que no
buscaste) en vez de los de "mae geri". La búsqueda corta, más genérica, tarda más en responder
que la larga y específica — y como no hay nada que cancele la petición vieja, la respuesta lenta
llega tarde y pisa a la que sí querías.

## Qué se espera

`src/app/features/mid-02-race-condition/buscador.ts` dispara una petición al mock API por cada
consulta. Sin importar en qué orden **respondan** las peticiones, la lista visible siempre debe
corresponder a la **última consulta que la persona escribió**.

## Dónde mirar

Todo el problema vive en el constructor de
`src/app/features/mid-02-race-condition/buscador.ts`, en cómo se conecta el `Subject` de
consultas con el `HttpClient`:

- ¿Qué operador de aplanado se usa para pasar de la consulta al `HttpClient.get(...)`? ¿Cancela
  la petición anterior cuando llega una nueva, o deja que todas sigan corriendo?
- ¿Hay algo que agrupe las teclas que se escriben rápido antes de disparar la petición?
- ¿Qué pasa con la suscripción si el componente se destruye mientras una petición sigue en
  vuelo?

No necesitas tocar el mock API (`src/app/core/mock-api/`): la latencia deliberadamente más lenta
para consultas cortas ya está configurada ahí, a propósito, para que la condición de carrera se
reproduzca siempre igual.

## Criterios de aceptación

- Al escribir varias consultas rápido, la lista final muestra los resultados de la **última**
  consulta, sin importar el orden de llegada de las respuestas.
- No se dispara una petición por cada tecla: hay una espera corta antes de buscar.
- Al destruir el componente con una petición en vuelo, no hay fugas de suscripción.

## Cómo verificar

```bash
npm run verify
```

Corre un test de Jest con temporizadores simulados que reproduce la carrera de forma
determinista, y un e2e de Playwright que teclea rápido de verdad. Si te atoras, `npm run hint` da
una pista a la vez.
