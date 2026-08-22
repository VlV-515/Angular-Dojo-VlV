# Pistas — mid-01-zoneless-no-refresca

## Pista 1

Sin Zone.js, Angular no "adivina" que algo cambió: solo repinta cuando una señal que la plantilla
lee efectivamente cambia de valor. Busca en `asistencia-board.ts` todos los lugares donde se
modifica un arreglo o un objeto **sin llamar a `.set(...)` ni a `.update(...)`** sobre la señal
correspondiente.

## Pista 2

`marcarPresente` busca el alumno dentro del arreglo y le cambia `presente` directo sobre el
objeto (`alumno.presente = true`). Esa fila vive en un componente `AlumnoRow` con
`changeDetection: OnPush`: para que ese componente vuelva a pintar, su `@Input() alumno` tiene
que recibir una **referencia nueva**, no el mismo objeto mutado. `agregarAlumno` tiene el mismo
problema pero con el arreglo completo (`this.alumnos().push(...)`).

## Pista 3

El cronómetro tiene dos bugs relacionados: `segundosTranscurridos` es una propiedad de clase
normal, no una señal, así que escribirle dentro del `setTimeout` no dispara nada — tiene que ser
`signal(0)` y actualizarse con `.update(s => s + 1)`. Y `cronometroTexto` es un `computed(...)`
que lee `this.segundosTranscurridos` como propiedad plana: un `computed` solo vuelve a calcularse
cuando una **señal** que lee cambia — si no lee ninguna señal, se congela en su primer valor para
siempre, sin importar qué tan reactivo sea el resto.
