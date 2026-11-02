# Pistas — mid-04-guards-interceptors

## Pista 1

En `src/app/app.routes.ts`, la ruta `/panel` carga su componente sin problema, pero compárala con
`/panel-entrada`: ¿tiene algo que de verdad impida entrar a quien no tiene sesión iniciada, o solo
carga el componente y ya?

## Pista 2

En `auth.guard.ts` la lógica está invertida: revisa con cuidado qué rama del `if` devuelve `true`
(dejar pasar) y cuál devuelve el `UrlTree` (redirigir). ¿Corresponde la que deja pasar a tener
sesión, o a no tenerla?

## Pista 3

En `auth.interceptor.ts` se arman los headers nuevos con el token, pero `HttpHeaders` es
inmutable: `.set(...)` devuelve un objeto de headers *nuevo*, no modifica `req.headers` en el
sitio. Falta usar `req.clone({...})` con ese header y mandar la petición **clonada** a
`next(...)`, no la original.

Además, revisa el orden del arreglo en `withInterceptors([...])` de `app.config.ts`:
`mockApiInterceptor` responde (o falla) las rutas que reconoce sin llamar nunca a `next(req)`, así
que si va antes que `authInterceptor` en el arreglo, este último nunca llega a ejecutarse para esas
rutas — el token jamás se agrega, sin importar qué tan bien esté escrito el interceptor.
