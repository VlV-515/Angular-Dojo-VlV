# Pistas — mid-03-di-ng0203

## Pista 1

Mira con calma el método que se dispara al hacer clic en "Programar recordatorio", dentro de
`panel-avisos.ts`. ¿Qué corre inmediatamente cuando haces clic, y qué corre después, cuando se
cumple el plazo del `setTimeout`? `inject()` solo funciona mientras Angular todavía está
"armando" algo — constructor, inicializador de campo, fábrica de un provider. ¿En cuál de esos
dos momentos se está llamando aquí?

## Pista 2

Para el error de consola: la solución no es mover el `inject()` a otro lugar dentro del
callback, es no llamarlo ahí en absoluto. Angular ya te da una referencia al servicio si la
capturas en el momento correcto de la vida del componente — guárdala en un campo y úsala después,
en vez de volver a inyectar.

Aparte de eso hay otros dos problemas, independientes del error de consola:

- En `historial-avisos.ts`, revisa el arreglo `providers` del `@Component`. ¿Qué efecto tiene
  declarar ahí un servicio que ya está `providedIn: 'root'`?
- En `panel-avisos.ts`, busca de dónde sale el token que define el prefijo del título. ¿Viene
  realmente de `avisos.service.ts`, o hay una segunda declaración por ahí?

## Pista 3

- `historial-avisos.ts`: quita el `providers: [AvisosService]` del `@Component`. Sin eso, el
  componente resuelve el servicio desde el injector del árbol (el mismo que usa todo lo demás),
  en vez de crear su propia instancia aislada.
- `panel-avisos.ts`: borra el `InjectionToken` que se declara ahí mismo con el mismo nombre que
  `PREFIJO_AVISO`, e importa el de verdad desde `./avisos.service`. Son dos objetos distintos
  aunque se llamen igual — solo uno es al que la ruta le está configurando un valor.
- Para el `setTimeout`: guarda el resultado de `inject(AvisosService)` en un campo de la clase
  (junto a `prefijo`) y usa ese campo (`this.avisos`) dentro del callback, en vez de escribir
  `inject(AvisosService)` otra vez ahí adentro.
