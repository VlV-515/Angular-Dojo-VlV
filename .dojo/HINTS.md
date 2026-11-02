# Pistas — junior-04-forms-basico

## Pista 1

Mira `inscripcion-form.html` con calma, campo por campo. Uno de los tres controles del
formulario (nombre, cinturón, acepto-reglamento) no está conectado al `FormGroup` de la forma
habitual (`[formControl]` / `formControlName`) — está usando otro mecanismo por su cuenta.
Mientras ese control no cambie, el `FormGroup` nunca se entera de lo que la persona hace con esa
parte del formulario.

## Pista 2

Revisa el `[disabled]` del botón "Inscribirme": ¿se deshabilita cuando el formulario **es**
válido, o cuando **no** lo es? Y en `inscripcion-form.ts`, mira los `Validators` del control
`aceptoReglamento` — a un checkbox obligatorio le corresponde `Validators.requiredTrue`, no
`Validators.required` (que ni siquiera aplica bien a un booleano) ni ningún validador.

## Pista 3

En `inscripcion-form.ts`, busca dónde se lee el valor del formulario para armar la confirmación
que se muestra tras enviar. Si ese valor se guarda en una propiedad que se calcula **una sola
vez**, en el constructor, siempre va a reflejar el formulario vacío con el que arrancó el
componente. La lectura del valor tiene que pasar dentro de `onSubmit()`, usando `this.form.value`
(o `this.form.getRawValue()`) en el momento del envío.
