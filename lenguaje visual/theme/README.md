# Theme dual (light / dark)

Este paquete chica incluye:
- `select-capital-theme.css`: tokens base y variantes para `data-theme="dark"` (por defecto) y `data-theme="light"`.
- `theme-toggle.js`: script ESM que sincroniza el atributo `data-theme`, respeta `prefers-color-scheme` y persiste la preferencia.

## Uso rapido

```html
<html lang="es" data-theme="dark">
<head>
  <link rel="stylesheet" href="/lenguaje visual/theme/select-capital-theme.css">
</head>
<body class="sc-noise">
  ... UI ...
  <button data-theme-toggle class="sc-btn-ghost">Cambiar tema</button>
  <script type="module" src="/lenguaje visual/theme/theme-toggle.js"></script>
</body>
</html>
```

- Cualquier nodo puede forzar una variante usando `data-theme="light"` o `data-theme="dark"`. Los componentes anidados heredaran los tokens.
- Usa `data-theme-value="light"` o `data-theme-value="dark"` en botones si prefieres controles separados.

## Tokens expuestos

Variables clave listas para Tailwind/CSS:

| Token | Dark | Light |
| --- | --- | --- |
| `--sc-surface-page` | `#05080F` | `#F6F8FC` |
| `--sc-surface-card` | `rgba(9,13,21,.72)` | `rgba(255,255,255,.78)` |
| `--sc-glass-bg` | `rgba(255,255,255,.06)` | `rgba(14,20,27,.35)` |
| `--sc-border-glass` | `rgba(255,255,255,.14)` | `rgba(15,18,23,.12)` |
| `--sc-text-primary` | `rgba(248,250,252,.96)` | `rgba(15,18,23,.96)` |
| `--sc-text-secondary` | `rgba(248,250,252,.72)` | `rgba(15,18,23,.72)` |
| `--sc-jade-500` | `#35E1A6` | `#09B985` |

Consulta el CSS para ver el resto (shadow, blur, radii y botones). Cada componente puede quedarse en clases Tailwind usando `var(--token)` sin romper diseno.

## Integracion con Tailwind

Agrega las variables en `theme.extend.colors` apuntando a `var(--sc-...)` o crea utilidades personalizadas:

```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        'sc-bg': 'rgb(var(--sc-surface-page))',
        'sc-text': 'var(--sc-text-primary)'
      }
    }
  }
};
```

Recuerda envolver el `body` con `data-theme-transition` si quieres transiciones suaves cuando el usuario cambia de modo.
