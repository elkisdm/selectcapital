# SC Form kit + masks

Incluye estilos base y utilidades JS para inputs con formato chileno (RUT, UF y telefono). Todo funciona con `data-` atributos para integrarse con HTML/Tailwind.

## Archivos
- `sc-forms.css`: tokens para labels, inputs glass, hints, errores y grids responsivos.
- `sc-masks.js`: mascara y validacion para `data-mask="rut|uf|phone"`.

## Uso basico

```html
<link rel="stylesheet" href="/lenguaje visual/forms/sc-forms.css">
<script type="module" src="/lenguaje visual/forms/sc-masks.js"></script>

<div class="sc-field">
  <label class="sc-label" for="rut">RUT</label>
  <input id="rut" name="rut" data-mask="rut" class="sc-input" placeholder="12.345.678-5" required>
  <p class="sc-error" id="rut-error" aria-hidden="true">Revisa el RUT</p>
</div>
```

`sc-masks.js` inicializa solo; cada input expone:
- `data-mask-normalized`: valor limpio (`12345678-5`, `2600.5`, `+56912345678`).
- `data-mask-complete`: `true` cuando se ingreso todo el valor.
- `data-mask-valid`: `true/false` (solo `rut` y `phone` verifican DV/largo).

Escucha el evento `sc:mask` si necesitas reaccionar:

```js
document.addEventListener('sc:mask', (event) => {
  const { type, isValid } = event.detail;
  if (type === 'rut') {
    event.target.closest('.sc-field')
      ?.querySelector('.sc-error')
      ?.setAttribute('aria-hidden', String(isValid));
  }
});
```

### Inputs combinados

Usa `.sc-input-affix` para monedas o sufijos:

```html
<label class="sc-label">Ahorro UF</label>
<div class="sc-input-affix" data-invalid="false">
  <input type="text" data-mask="uf" inputmode="decimal" placeholder="2.600">
  <span>UF</span>
</div>
```

`data-invalid="true"` pinta borde rojo con los tokens del theme.

## Checklist UX
1. Prefiere `inputmode="numeric"` para RUT/UF en mobile.
2. Muestra helper con formato esperado (`+56 9 xxxx xxxx`).
3. Usa `aria-live="polite"` para errores (`.sc-error`).
4. Cuando `data-mask-valid="false"` en blur, agrega mensaje contextual y evita submit.
