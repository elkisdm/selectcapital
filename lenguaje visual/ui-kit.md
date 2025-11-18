# Select Capital UI Kit — Liquid Glass

> Documentación técnica para aterrizar el lenguaje visual “Liquid Glass” de Select Capital en productos digitales. Pensado para diseñadores, front-end y product managers.

## 1. ADN visual y principios

- **Sensación base:** financiero premium, silenciosamente tecnológico, preciso, de ritmo tranquilo.
- **Metáfora:** vidrio curado + arcos del isotipo → claridad, curaduría y dirección.
- **Palabras clave:** transparencia, profundidad contenida, calma, precisión.
- **Principios de diseño:**
  - Transparencia útil: el vidrio estructura y ordena, no es decorativo.
  - Profundidad contenida: blur + luz direccional para jerarquías, sin ruido.
  - Arco Select: cuarto de círculo presente en esquinas, recortes, iconografía.
  - Tipografía sin fricción: jerarquía clara, tracking cómodo, números tabulares.
  - Microinteracciones con intención: 80–200 ms, easings físicas, brillos especulares sutiles.

## 2. Tokens fundamentales

Todos los tokens viven en `lenguaje visual/theme/select-capital-theme.css` y se consumen vía CSS variables, Tailwind o frameworks equivalentes.

### 2.1 Colores

| Token | Dark | Light | Uso |
| --- | --- | --- | --- |
| `--sc-ink-950` | `#0B0E12` | igual | Texto sobre fondos claros, fondos sólidos. |
| `--sc-graphite-900` | `#10151B` | `#111827` | Fondos secundarios, bordes fuertes. |
| `--sc-slate-700` | `#3A4654` | `#4B5563` | Separadores, iconos medios. |
| `--sc-mist-200` | `#E4E8EE` | `#D4DAE4` | Tipografía secundaria en dark, fondos tenues en light. |
| `--sc-snow` | `#FFFFFF` | igual | Texto sobre superficies oscuras, highlights. |
| `--sc-jade-500` | `#35E1A6` | `#09B985` | CTA principal, indicadores de éxito. |
| `--sc-cobre-400` | `#CBA07A` | `#B9825F` | Detalle premium, hover secundarios. |
| Estados | `--sc-success-500`, `--sc-warning-500`, `--sc-danger-500`, `--sc-info-500` | Ajustados por modo | Estados de formularios, alertas, badges. |

**Buenas prácticas**
- Mantener contraste ≥ 4.5:1 en texto sobre paneles glass (ajusta opacidad si es necesario).
- Jade es el acento principal; cobre se usa para subrayar momentos premium (nunca ambos juntos en la misma jerarquía).
- Para fondos grandes, mezcla gradientes radiales con ruido sutil (`.sc-noise`) para evitar banding.

### 2.2 Tipografía y escala

- **Familia base:** `Inter` (web safe) o `SF Pro` si la licencia lo permite.
- **Escala fluida recomendada:**
  - Display: `clamp(36px, 6.5vw, 64px)` · `font-weight:600` · `line-height:1.05`
  - H1: `clamp(28px, 4.5vw, 44px)` · `fw:600` · `lh:1.1`
  - H2: `clamp(22px, 3.5vw, 32px)` · `fw:600` · `lh:1.15`
  - Body: 16–18px · `fw:400–500` · `lh:1.5`
- **Números:** activa `font-variant-numeric: tabular-nums;` para KPIs y tablas.
- Uso en componentes:
  - CTA: 16–18px, `fw:600` para lectura rápida.
  - Labels formulario: uppercase, tracking 0.3em, 12px aprox (`.sc-label`).
  - Chips: 12–13px `fw:600` para contraste en superficies glass pequeñas.

### 2.3 Espaciado y grid

- **Baseline 8 pt** → multiplícalos (8/16/24/32/40px) para márgenes y paddings.
- **Grid desktop:** 12 columnas, contenedor 1200–1280px.
- **Gutters:** 24px en desktop, 16px en mobile.
- **Stack vertical:** usa 32–40px entre secciones hero; 16–24px dentro de tarjetas.
- **Field grid formularios:** utilizar [`data-field-grid`](lenguaje visual/forms/sc-forms.css) para distribuir inputs a 2 o 3 columnas a partir de 768px.

### 2.4 Radios y profundidad

- Radios disponibles: 12, 16, **24, 28, 36**. El look de referencia usa 28px para cards primarias.
- Blurs: `--sc-glass-blur-sm` 8px, `md` 16px, `lg` 24px.
- Sombras:
  - `--sc-shadow-e1`: `0 8px 24px rgba(0,0,0,0.35)` (elevación base).
  - `--sc-shadow-e2`: `0 30px 90px rgba(2,6,23,0.65)` (modales o hero).
- Bordes: `--sc-border-glass` para vidrio, `--sc-border-strong` para superficies sólidas.

## 3. Superficies de vidrio

Las superficies glass balancean transparencia, blur y highlight especular.

- Usa `.sc-glass` o `.sc-surface-card` como base (ver tokens en el CSS).
- Paneles principales: opacidad 0.06–0.08 en dark, 0.35 en light.
- Siempre agrega highlight radial (`::before`) y rim interior (inset 1px) para reforzar el efecto vidrio.
- Nunca apiles más de dos capas glass sin separarlas con un sólido opaco o sombras diferenciadas.
- Para fallback sin soporte a `backdrop-filter`, cambia a `--sc-glass-bg-heavy` (sólido).

## 4. Layout y estructuras

- Hero y secciones clave combinan grid 12 columnas con cards glass XL.
- Mantén el arco del isotipo en un plano: aplica máscaras (`.arc-mask`) en imágenes o placeholders.
- Navegación en desktop fija con blur 16px (`data-theme="dark"` por defecto).
- En mobile, prioriza CTA persistente (WhatsApp/Agenda) dentro de la navbar glass.
- Usa parallax suave (2–4px) en fondos para dar profundidad controlada.

## 5. Componentes

Cada componente hereda tokens desde las variables globales. Ajusta color y blur solo mediante CSS custom properties.

### 5.1 Buttons (CTA)

- **Primario (`.sc-btn-primary`):**
  - Fondo jade 500, texto `--sc-ink-950`, borde invisible.
  - Hover: `filter:brightness(1.05)` + elevación ligera, glow jade `rgba(53,225,166,0.16)`.
  - Active: desplazamiento `translateY(1px)`, sombra reducida.
- **Secundario / ghost (`.sc-btn-ghost`):**
  - Vidrio fino (blur 8px, opacidad 0.05), texto blanco 90%.
  - Hover: incremento de brillo y leve elevación.
- **Terciario (text link):**
  - Texto + subrayado animado en jade.
- Estados focus: `box-shadow: 0 0 0 3px rgba(53,225,166,0.25)`; respeta accesibilidad.

### 5.2 Cards

- Radio 28px, doble sombra (`var(--sc-shadow-e1)` + inset highlight).
- Bordes 1px glass; separadores internos 1px `--sc-slate-700`.
- Reservar esquina superior derecha para `corner-pill` (estado, cupos, badge).
- Contenido: Título, body, métricas en grid 3 columnas (en mobile stack).
- Para KPIs, usa `.sc-glass` anidados con `font-variant-numeric: tabular-nums`.

### 5.3 Chips y badges

- Vidrio 6–8px blur, padding compacto (.5rem × .9rem aprox).
- Estados:
  - Pie en cuotas: jade 500 + texto `--sc-ink-950`.
  - Descuento: cobre 400 + texto blanco.
  - Garantía: glass neutro con borde jade.
- Iconografía: trazo 1.5px, estilo Lucide/Feather, sin rellenos sólidos.

### 5.4 Inputs y formularios

- Usa los estilos de `lenguaje visual/forms/sc-forms.css`.
- Inputs base: `.sc-input` (glass), `.sc-input-affix` para prefijos/sufijos.
- Foco: border jade + focus ring 3px (`--sc-focus-ring`).
- Errores: `data-invalid="true"` pinta borde rojo + ring `rgba(239,68,68,0.2)`.
- Labels uppercase 12px; helper `.sc-hint` 12px regular.
- Validaciones chilenas con `sc-masks.js` (`data-mask="rut|uf|phone"`) → expone `data-mask-normalized`, `data-mask-valid`.
- Recuerda `aria-live="polite"` en `.sc-error` y helpers de formato visible (ej: “+56 9 xxxx xxxx”).

### 5.5 Navbar y navegación

- Barra fija `position:sticky top:16px` sobre fondo glass (blur 16px, opacidad 0.04).
- Logotipo dentro de `.arc-mask`; tagline uppercase `tracking-wide`.
- En mobile añade CTA persistente (WhatsApp o Agenda).
- Usa toggle de tema como botón ghost con icono sol/luna.

### 5.6 Modales

- Scrim negro 40% (`rgba(0,0,0,0.4)`), modal glass radio 24px.
- Animación entrada: `opacity 160ms ease-out + scale 0.98→1`.
- Cerrar con icono en esquina, focus trap y scroll lock.
- Usa `max-width: 640px` para formularios, 900px para fichas de proyecto.

### 5.7 Datos y visualizaciones

- Líneas gráficas 2px jade 500; puntos 3px blancos 90%.
- Grid 1px `--sc-slate-700` al 30% de opacidad.
- Bandas de confianza: degradado jade 12→0% de opacidad.
- KPI cards: números tabulares, prefijo de unidad alineado a baseline.
- Sparklines en cards, preferir `stroke-linecap:round` para suavidad.

### 5.8 “Corner Pill”

- Píldora en esquina superior derecha de cards glass.
- Fondo glass 0.07, borde `--sc-border-glass`, sombra `0 6px 18px rgba(0,0,0,.28)`.
- Etiquetas típicas: “Próximo lanzamiento”, “Cupos 12/50”, “Guardar”.

## 6. Motion y microinteracciones

- **Duraciones:** entrada 160–220 ms, hover 120 ms, salida 140 ms.
- **Easings:** `cubic-bezier(.22,.61,.36,1)` (Out) y `cubic-bezier(.12,0,.39,0)` (In).
- **Brillos especulares:** en hover de botones, highlight recorre el borde 15°→195° en 350 ms.
- **Parallax:** capas de fondo se desplazan 2–4 px en scroll para dar profundidad.
- **Feedback inputs:** vibración leve (translateX ±2px) 80 ms al fallo en desktop.

## 7. Accesibilidad y performance

- Contraste AA para texto (ajusta opacidades de panel si es necesario).
- Fallback sin blur: usa `--sc-glass-bg-heavy`.
- `prefers-reduced-motion`: desactiva parallax y animaciones de brillo (`@media (prefers-reduced-motion: reduce)`).
- Optimiza LCP < 1.5 s: imágenes AVIF/WebP, máscaras SVG livianas, evita overlays gigantes.
- Focus visibles para todos los componentes interactivos.

## 8. Integración técnica

### 8.1 Tokens CSS (`select-capital-theme.css`)

Importa una vez en la raíz. Expone variables para colores, radii, sombras y blur.

```88:181:lenguaje visual/theme/select-capital-theme.css
body {
  font-family: var(--sc-font-sans);
  background-color: var(--sc-surface-page);
  color: var(--sc-text-primary);
  transition: var(--sc-transition-theme);
}
```

- Añade `data-theme="dark|light"` en `<html>` o contenedores para forzar modo.
- Usa `data-theme-transition` cuando necesites animaciones suaves en el cambio de modo.

### 8.2 Formularios (`sc-forms.css` + `sc-masks.js`)

- Importa CSS para heredar estilos glass en inputs y etiquetas.
- Inicializa máscaras automáticamente; escucha el evento `sc:mask` si necesitas sincronizar estado personalizado.

```1:126:lenguaje visual/forms/sc-masks.js
export function initScMasks(root = document) {
  const inputs = root.querySelectorAll(`input[${THEME_ATTR}]`);
  inputs.forEach((el) => {
    const handler = () => applyMask(el);
    el.addEventListener('input', handler);
    el.addEventListener('blur', handler);
    handler();
  });
}
```

### 8.3 Toggle de tema (`theme-toggle.js`)

- Modo dual listo para producción: respeta `prefers-color-scheme`, persiste en `localStorage` y expone helpers (`applySelectTheme`, `toggleSelectTheme`).
- Agrega `data-theme-toggle` a cualquier control o `data-theme-value="light|dark"` para botones directos.

```25:84:lenguaje visual/theme/theme-toggle.js
export function toggleSelectTheme() {
  const current = getCurrentSelectTheme() || 'dark';
  applySelectTheme(current === 'dark' ? 'light' : 'dark');
}
```

### 8.4 Ejemplo Tailwind + HTML

El archivo de referencia combina tokens y componentes listos para copiar.

- Tailwind extiende colores y sombras con los tokens (`tailwind.config` inline).
- `div.glass` encapsula hero, cards KPI y modales.
- Usa la estructura hero → métricas → cards → calculadora como blueprint.

Consulta `select_capital_liquid_glass_design_system_v_1.md` sección **Ejemplo funcional** para obtener el HTML completo.

## 9. Patrones recomendados

### 9.1 Hero de inversión

- Card glass XL con `corner-pill` destacando lanzamiento o beneficio.
- Copy: H1 + subtítulo + CTA dual (Agenda / WhatsApp).
- Banda de confianza: logos de bancos o métricas (colócalos en `.sc-glass` compactos).
- Fondo: foto con bokeh + gradientes radiales + grano (`.sc-noise`).

### 9.2 Card de proyecto

- Imagen superior con mascara arco + degradado overlay 40%.
- Badges de estado (`En obra`, `Entrega inmediata`) ubicados sobre la imagen.
- Cuerpo: rentabilidad, ticket UF, tesis resumida, CTA “Ver propuesta”.
- Chips de beneficios (pie en cuotas, descuento, garantía).

### 9.3 Calculadora / flujo

- Grid 2×2 de inputs `data-field-grid="two"`; resultados en card KPI con sparkline.
- CTA doble: “Revisar con tu banco” + “Enviar a WhatsApp”.
- Mostrar helper y validación visual inmediata al usar máscaras RUT/UF.

## 10. Checklist de implementación

- [ ] Importar tokens de theme y definir modo inicial (`data-theme` en `<html>`).
- [ ] Configurar Tailwind (o equivalente) para consumir variables (`var(--sc-...)`).
- [ ] Aplicar `.sc-glass` y highlight en todas las superficies principales.
- [ ] Verificar contraste y focus visible en CTA, links y formularios.
- [ ] Integrar `sc-masks.js` en formularios con datos chilenos.
- [ ] Añadir toggle de tema en navbar o footer.
- [ ] Testear microinteracciones y motion en desktop + mobile.
- [ ] Ajustar fallback sin blur y pruebas `prefers-reduced-motion`.


