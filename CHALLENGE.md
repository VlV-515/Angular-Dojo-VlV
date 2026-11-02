# Reto: Formulario reactivo: nunca valida

**Cinturón:** blanco · **Tema:** Formularios reactivos · **Tiempo estimado:** 35 min · **Bugs:** 4

## Síntoma

Abres `/inscripcion` para anotarte al dojo: escribes tu nombre, eliges tu cinturón y marcas la
casilla de "Acepto el reglamento del dojo". El botón "Inscribirme" debería habilitarse en cuanto
el formulario está completo... pero se queda deshabilitado para siempre. Y si logras forzar el
envío, lo que aparece en la confirmación no es lo que acabas de escribir.

## Qué se espera

`src/app/features/junior-04-forms-basico/inscripcion-form.ts` es un formulario reactivo
(`FormGroup` + `FormControl` + `Validators`) con tres campos:

- **Nombre** — texto, obligatorio.
- **Cinturón** — selección, obligatoria.
- **Acepto el reglamento del dojo** — casilla, debe estar marcada para poder enviar.

El botón "Inscribirme" debe estar deshabilitado mientras el formulario no sea válido, y
habilitarse en cuanto lo sea. Al enviar, debe mostrarse una confirmación con los datos que la
persona **acaba de escribir**.

## Dónde mirar

Los cuatro bugs viven en:

- `src/app/features/junior-04-forms-basico/inscripcion-form.ts`
- `src/app/features/junior-04-forms-basico/inscripcion-form.html`

No necesitas tocar `inscripcion-form.scss` ni `app.routes.ts`.

## Criterios de aceptación

- El botón "Inscribirme" está deshabilitado mientras el formulario no es válido, y habilitado
  cuando sí lo es.
- El formulario no se marca como válido si nadie aceptó el reglamento.
- Marcar la casilla "Acepto el reglamento del dojo" realmente actualiza el formulario reactivo,
  no solo lo que se ve en pantalla.
- Al enviar, la confirmación muestra los datos que la persona acaba de escribir, no datos de
  cuando se creó el componente.

## Cómo verificar

```bash
npm run verify
```

Si te atoras, `npm run hint` da una pista a la vez.
