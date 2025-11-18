# Select Capital — Liquid Glass Design System v1.0

> **Meta**: Lenguaje UI/UX basado en “liquid glass” + arcos del isotipo de Select Capital. Incluye principios, tokens, componentes, motion y ejemplo funcional (HTML + Tailwind) listo para copiar.

---

## 1) North Star (ADN visual)
**Sensación:** financiero‑premium, minimal, confiable, silenciosamente tecnológico.  
**Metáfora:** vidrio curado + arcos (cuadrantes del logo) = claridad + dirección.  
**Palabras clave:** transparencia, curaduría, precisión, calma, profundidad.

## 2) Principios de diseño
1. **Transparencia útil** — el vidrio no adorna: organiza jerarquía y contexto.  
2. **Profundidad contenida** — blur + luz direccional para estratificar sin ruido.  
3. **Arco Select** — el cuarto de círculo del isotipo vive en esquinas, recortes, máscaras, íconos.  
4. **Tipografía sin fricción** — jerarquía clara, tracking cómodo, números tabulares.  
5. **Micro‑interacciones con intención** — 80–200 ms, easings físicas, brillos especulares sutiles.

---

## 3) Sistema de color (light/dark + semánticos)
> Paleta neutra principal con **acento jade** (crecimiento) y **secundario cobre** (lujo cálido).

**Neutros**
- `Ink-950` #0B0E12 (fondo dark)
- `Graphite-900` #10151B
- `Slate-700` #3A4654
- `Mist-200` #E4E8EE
- `Snow-000` #FFFFFF

**Acentos**
- `Jade-500` #35E1A6 (acento principal)
- `Cobre-400` #CBA07A (detalle premium)

**Estados**
- `Success` #22C55E · `Warning` #F59E0B · `Danger` #EF4444 · `Info` #38BDF8

**Contraste**
- Objetivo WCAG AA: texto sobre vidrio ≥ 4.5:1 (eleva opacidad del panel si hace falta).

---

## 4) Tipografía
- **Familia:** Inter (web‑safe y precisa) o SF Pro si hay licencia.  
- **Escala** (clamp):
  - Display: `clamp(36px, 6.5vw, 64px)` / 1.05 / 600  
  - H1: `clamp(28px, 4.5vw, 44px)` / 1.1 / 600  
  - H2: `clamp(22px, 3.5vw, 32px)` / 1.15 / 600  
  - Body: 16–18px / 1.5 / 400–500  
- **Numerales tabulares:** `font-variant-numeric: tabular-nums;`

---

## 5) Layout & grid
- **Grid 12 col** (desktop) con **contenedor 1200–1280px**; gutters 24px.  
- **Baseline 8pt** (espaciado 8/16/24/32…).  
- **Radii:** 12 / 16 / **24 / 28 / 36**. Usa **28** para cards primarias (look de referencia).  
- **Arco Select** (90°) para: recortes (masks) en hero, imágenes y charts; esquinas en botones/etiquetas; patrones.

---

## 6) Tokens de vidrio (núcleo del look)
**Opacidad panel**  
- `glass.bg` rgba(255,255,255, **0.06**) (dark) / rgba(14,20,27, **0.35**) (light sobre foto)  
**Blur**  
- `glass.blur.sm` 8px · `md` **16px** · `lg` 24px  
**Saturación**  
- `glass.sat` 1.15–1.25  
**Borde**  
- `glass.stroke` 1px **linear‑gradient** (blanco 18% → transparente) + “rim” inferior negro 20% (bisel)  
**Highlight**  
- especular radial top‑left (blanco 12–18%); **glow jade** sutil 0 0 40px rgba(53,225,166,0.16) en activo  
**Grain**  
- ruido sutil 1.5–2% para romper banding en superficies grandes.

---

## 7) Componentes (UI Kit)
### 7.1 Cards (Superficie primaria)
- **Uso:** hero containers, KPIs, property cards, modales.  
- **Specs:** radius 28; `backdrop-filter: blur(16px) saturate(1.2)`; opacidad 0.06–0.08; doble trazo (highlight + rim); sombra doble: `0 8px 24px rgba(0,0,0,.35)` + `inset 0 1px rgba(255,255,255,.18)`.  
- **Slot superior derecho:** **Píldora** (p. ej. “Guardar” / “Cupos”).  
- **Separador**: 1px `Slate-700` a 24px del borde (como la referencia).

### 7.2 Botones
- **Primario (Sólido‑Jade):** jade‑500 → hover jade‑400; texto Ink‑950.  
- **Secundario (Glass‑Ghost):** panel glass fino (0.04–0.06) + trazo claro + texto blanco 90%.  
- **Terciario (Text):** texto + subrayado animado (accent).  
- **Forma:** píldora 9999 o `arc‑20` (consistencia con el isotipo).  
- **Feedback:** “ripple” de brillo lineal + elevación + foco con ring jade 32–48px muy suave.

### 7.3 Chips / Badges
- Mini‑glass con blur 6–8px; icono 1.5 px stroke (Lucide‑like); estados: “Pie en cuotas”, “Descuento”, “Garantía”.

### 7.4 Inputs
- Campo glass con **interior más claro** en foco; placeholders 70%; máscaras para **RUT, teléfono, UF**.  
- Errores con **borde cobre/danger** + micro‑vibración 80 ms (solo desktop).

### 7.5 Navbar
- Barra glass fija (blur 16, opacidad 0.04) con **CTA persistente** en móvil (WhatsApp/Agenda).

### 7.6 Modales
- Fondo `scrim` negro 40% + **glass modal** 24px radius, entrada **scale 0.98 → 1** y fade 160 ms.

### 7.7 Data‑viz (para inversión)
- Líneas 2 px `Jade‑500`, puntos 3 px blancos 90%; grid 1 px `Slate‑700` 30%.  
- **Sparklines** en KPIs; **bandas de confianza** con degradado jade 12–0% opacidad.  
- KPI cards: **renta neta**, **yield**, **plusvalía comuna**, **flujo mensual** (tabular‑nums siempre).

### 7.8 “Corner Pill” (de la referencia)
- Píldora superior‑derecha con leve **bevel** y sombra propia: “Guardar”, “Cupos 12/50”, etc.

---

## 8) Motion (micro‑física del vidrio)
- **Duraciones:** entrada 160–220 ms; hover 120 ms; salida 140 ms.  
- **Easings:** `cubic-bezier(.22,.61,.36,1)` (Out) · `(.12,0,.39,0)` (In).  
- **Brillos especulares:** al hover de botones, **borde viaja** 15°→195° en 350 ms (reflejo).  
- **Parallax leve:** 2–4 px en capas de fondo para profundidad en hero.

---

## 9) Accesibilidad & performance
- **Fallback sin blur**: usar sólido `Graphite‑900/85%`.  
- **Texto sobre vidrio** ≥ 4.5:1.  
- **LCP < 1.5 s**: AVIF/WebP, máscaras SVG livianas, evitar overlays enormes.

---

## 10) Integración del logo (Sistema de Arcos)
- **Motivo “Select Arc”** — cuarto de círculo del isotipo como:  
  - máscara para fotos/métricas (hero con **arc‑mask** inferior)  
  - bullets de listas (mini arcos)  
  - contenedores de íconos (íconos dentro de un arco)  
- **Separadores** con **arco**: líneas que terminan en cuarto de círculo (guiño a la marca).

---

## 11) Patrones clave
### 11.1 Hero (registro/asesoría)
Card glass XL con: H1 + sub + **2 CTAs** (Agenda / WhatsApp) + cinta de confianza (logos, métricas).  
“Corner pill”: **Próximo lanzamiento | 11/11**.  
Fondo: foto con bokeh y **hotspot** superior‑izquierdo.

### 11.2 Card de proyecto (inversión)
Mini‑hero glass con: **Desde UF**, **pie mensual** (badge), **renta neta estimada**, **entrega** (blanco/verde), **chips** de beneficios; **CTA** “Ver propuesta”.

### 11.3 Calculadora (dividendo/flujo)
Inputs en grid 2×2; resultados como **KPI card** + sparkline.  
CTAs “Revisar con tu banco” / “Enviar a WhatsApp”.

---

## 12) Tokenización (CSS variables)
```css
:root {
  /* Color */
  --sc-ink-950:#0B0E12; --sc-graphite-900:#10151B; --sc-slate-700:#3A4654;
  --sc-mist-200:#E4E8EE; --sc-snow:#FFFFFF;
  --sc-jade-500:#35E1A6; --sc-cobre-400:#CBA07A;

  /* Glass */
  --sc-glass-bg: rgba(255,255,255,.06);
  --sc-glass-blur: 16px;
  --sc-glass-sat: 1.2;

  /* Radii */
  --sc-radii-24:24px; --sc-radii-28:28px; --sc-radii-36:36px;

  /* Shadows */
  --sc-shadow-e2: 0 8px 24px rgba(0,0,0,.35);
  --sc-inset-highlight: inset 0 1px rgba(255,255,255,.18);
}
.glass {
  background: var(--sc-glass-bg);
  -webkit-backdrop-filter: blur(var(--sc-glass-blur)) saturate(var(--sc-glass-sat));
          backdrop-filter: blur(var(--sc-glass-blur)) saturate(var(--sc-glass-sat));
  border-radius: var(--sc-radii-28);
  box-shadow: var(--sc-shadow-e2), var(--sc-inset-highlight);
  position: relative;
  border: 1px solid rgba(255,255,255,.14);
}
.glass::before{ /* specular highlight */
  content:""; position:absolute; inset:0; border-radius:inherit;
  background: radial-gradient(120% 80% at 8% 6%, rgba(255,255,255,.14), transparent 60%);
  pointer-events:none;
}
.btn-primary{
  background: var(--sc-jade-500); color: var(--sc-ink-950);
  border-radius: 9999px; padding:.8rem 1.2rem; font-weight:600;
  transition: transform .12s ease, filter .12s ease, box-shadow .12s ease;
}
.btn-primary:hover{ transform: translateY(-1px); filter: brightness(1.05); }
.btn-ghost{
  background: rgba(255,255,255,.05); color: var(--sc-snow);
  -webkit-backdrop-filter: blur(8px) saturate(1.1); backdrop-filter: blur(8px) saturate(1.1);
  border:1px solid rgba(255,255,255,.18); border-radius:9999px; padding:.7rem 1.1rem;
}
.corner-pill{
  position:absolute; top:16px; right:16px; padding:.5rem .9rem;
  background: rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.18);
  border-radius: 16px; box-shadow: 0 6px 18px rgba(0,0,0,.28), inset 0 1px rgba(255,255,255,.16);
}
```

---

## 13) Tailwind (extend básico)
```js
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        ink: { 950:'#0B0E12' },
        graphite:{ 900:'#10151B' },
        slate: { 700:'#3A4654' },
        mist: { 200:'#E4E8EE' },
        jade: { 500:'#35E1A6', 400:'#57E7B9' },
        cobre:{ 400:'#CBA07A' }
      },
      boxShadow:{
        e2:'0 8px 24px rgba(0,0,0,.35)',
        'inset-hl':'inset 0 1px rgba(255,255,255,.18)'
      },
      borderRadius:{ 24:'24px', 28:'28px', 36:'36px' },
    }
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.glass':{
          background:'rgba(255,255,255,.06)',
          backdropFilter:'blur(16px) saturate(1.2)',
          WebkitBackdropFilter:'blur(16px) saturate(1.2)',
          border:'1px solid rgba(255,255,255,.14)',
          borderRadius:'28px',
          boxShadow:'0 8px 24px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.18)',
          position:'relative'
        }
      })
    }
  ]
}
```

---

## 14) Ejemplo funcional (HTML + Tailwind CDN)
> **Incluye:** Hero + Card de proyecto + Calculadora (dividendo/flujo). Copia el archivo y ábrelo en el navegador.

```html
<!doctype html>
<html lang="es" class="h-full">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Select Capital — Liquid Glass DS</title>

  <!-- Inter (opcional) -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
  <script>
    tailwind.config = {
      theme: {
        container: { center: true, padding: '1rem' },
        extend: {
          fontFamily: { sans: ['Inter','ui-sans-serif','system-ui'] },
          colors: {
            ink: { 950:'#0B0E12' },
            graphite:{ 900:'#10151B' },
            slate: { 700:'#3A4654' },
            mist: { 200:'#E4E8EE' },
            snow: { DEFAULT:'#FFFFFF' },
            jade: { 500:'#35E1A6', 400:'#57E7B9' },
            cobre:{ 400:'#CBA07A' }
          },
          boxShadow: {
            e2:'0 8px 24px rgba(0,0,0,.35)',
            'inset-hl':'inset 0 1px rgba(255,255,255,.18)'
          },
          borderRadius:{ 24:'24px', 28:'28px', 36:'36px' },
        }
      }
    }
  </script>

  <style>
    :root{
      --sc-glass-bg: rgba(255,255,255,.06);
      --sc-glass-blur: 16px;
      --sc-glass-sat: 1.2;
    }
    .glass{
      background: var(--sc-glass-bg);
      -webkit-backdrop-filter: blur(var(--sc-glass-blur)) saturate(var(--sc-glass-sat));
              backdrop-filter: blur(var(--sc-glass-blur)) saturate(var(--sc-glass-sat));
      border-radius: 28px;
      border: 1px solid rgba(255,255,255,.14);
      box-shadow: 0 8px 24px rgba(0,0,0,.35), inset 0 1px rgba(255,255,255,.18);
      position: relative;
      overflow: hidden;
    }
    .glass::before{
      content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
      background: radial-gradient(120% 80% at 8% 6%, rgba(255,255,255,.14), transparent 60%);
    }
    .corner-pill{
      position:absolute; top:16px; right:16px; padding:.5rem .9rem;
      background: rgba(255,255,255,.07);
      border:1px solid rgba(255,255,255,.18);
      border-radius: 16px;
      box-shadow: 0 6px 18px rgba(0,0,0,.28), inset 0 1px rgba(255,255,255,.16);
      color:#fff; font-weight:500;
    }
    /* “Arc” decorativo (cuarto de círculo del logo) */
    .arc-mask{
      -webkit-mask: radial-gradient(120px at 0 100%, #000 98%, transparent 100%);
              mask: radial-gradient(120px at 0 100%, #000 98%, transparent 100%);
    }
    .btn-primary{
      background:#35E1A6; color:#0B0E12; border-radius:9999px; font-weight:600;
      padding:.85rem 1.25rem; transition:transform .12s ease, filter .12s ease, box-shadow .12s ease;
      box-shadow: 0 0 0 rgba(53,225,166,0);
    }
    .btn-primary:hover{ transform:translateY(-1px); filter:brightness(1.05); box-shadow:0 0 40px rgba(53,225,166,.16); }
    .btn-ghost{
      background: rgba(255,255,255,.05); color:#fff; border-radius:9999px;
      -webkit-backdrop-filter: blur(8px) saturate(1.1); backdrop-filter: blur(8px) saturate(1.1);
      border:1px solid rgba(255,255,255,.18); padding:.8rem 1.2rem; font-weight:600;
      transition: transform .12s ease, filter .12s ease;
    }
    .btn-ghost:hover{ transform: translateY(-1px); filter: brightness(1.05); }
  </style>
</head>

<body class="h-full bg-ink-950 text-snow antialiased selection:bg-jade-500 selection:text-ink-950">
  <!-- Fondo: gradiente + grano sutil -->
  <div class="fixed inset-0 -z-10">
    <div class="absolute inset-0 bg-[radial-gradient(1000px_600px_at_10%_10%,rgba(255,255,255,.06),transparent_60%)]"></div>
    <div class="absolute inset-0 bg-[radial-gradient(800px_500px_at_80%_20%,rgba(53,225,166,.05),transparent_60%)]"></div>
    <div class="absolute inset-0 opacity-[.06] mix-blend-soft-light"
         style="background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%228%22 viewBox=%220 0 8 8%22><path fill=%22%23fff%22 fill-opacity=%220.7%22 d=%22M0 0h1v1H0z%22/></svg>')"></div>
  </div>

  <header class="container pt-6 md:pt-8">
    <nav class="glass flex items-center justify-between px-4 md:px-6 py-3">
      <div class="flex items-center gap-3">
        <!-- Reemplaza por tu SVG: /assets/select-capital-logo.svg -->
        <img src="" alt="Select Capital" class="h-8 w-8 rounded arc-mask bg-snow/90" />
        <span class="hidden sm:inline text-mist-200/90 font-medium tracking-wide">SELECT CAPITAL</span>
      </div>
      <div class="flex items-center gap-2">
        <a href="#agendar" class="btn-ghost">Agenda tu asesoría</a>
        <a href="https://wa.me/56993481594" target="_blank" class="btn-primary">WhatsApp</a>
      </div>
    </nav>
  </header>

  <!-- HERO -->
  <section class="container mt-8 md:mt-12">
    <div class="grid lg:grid-cols-12 gap-6 items-stretch">
      <div class="lg:col-span-7 glass p-6 md:p-10 relative">
        <div class="corner-pill">Próximo lanzamiento</div>
        <div class="flex items-center gap-3 mb-6">
          <div class="h-10 w-10 bg-snow/90 rounded arc-mask"></div>
          <div>
            <p class="text-mist-200/80 text-sm">Inversión Inmobiliaria</p>
            <h1 class="text-3xl md:text-5xl font-semibold leading-tight">Invierte con datos, condiciones negociadas y acompañamiento 360°, <span class="text-jade-500">sin pagar comisión</span>.</h1>
          </div>
        </div>

        <p class="text-mist-200/90 max-w-2xl">
          Acceso a proyectos seleccionados, beneficios como <span class="text-snow">pie en cuotas</span> y <span class="text-snow">descuentos de lanzamiento</span>, más una guía clara desde la preaprobación hasta el primer arriendo.
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <a id="agendar" href="#form" class="btn-primary">Agenda tu asesoría</a>
          <a href="#calculadora" class="btn-ghost">Calcula tu dividendo</a>
          <a href="#proyectos" class="btn-ghost">Ver proyectos con tu perfil</a>
        </div>

        <div class="mt-8 grid grid-cols-3 gap-4 text-center">
          <div class="glass p-4">
            <p class="text-2xl font-semibold">+250</p>
            <p class="text-mist-200/80 text-sm">Proyectos</p>
          </div>
          <div class="glass p-4">
            <p class="text-2xl font-semibold">36–54</p>
            <p class="text-mist-200/80 text-sm">Cuotas de pie</p>
          </div>
          <div class="glass p-4">
            <p class="text-2xl font-semibold">15&nbsp;min</p>
            <p class="text-mist-200/80 text-sm">Asesoría inicial</p>
          </div>
        </div>
      </div>

      <!-- CARD DE PROYECTO -->
      <div id="proyectos" class="lg:col-span-5 glass p-6 md:p-8 flex flex-col">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Proyecto — La Florida</h2>
          <span class="btn-ghost px-3 py-1 text-sm">Guardar</span>
        </div>
        <p class="text-mist-200/90 mt-1">Entrega futura · 2029</p>

        <div class="mt-5 grid grid-cols-2 gap-4">
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Desde</p>
            <p class="text-xl font-semibold">UF 2.429</p>
          </div>
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Pie mensual estimado*</p>
            <p id="uiPieMensualDemo" class="text-xl font-semibold">$ 105.000</p>
          </div>
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Renta neta estimada</p>
            <p class="text-xl font-semibold">—</p>
          </div>
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Plusvalía histórica comuna</p>
            <p class="text-xl font-semibold">—</p>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-2">
          <span class="btn-ghost px-3 py-1 text-sm">Pie en cuotas</span>
          <span class="btn-ghost px-3 py-1 text-sm">Descuento lanzamiento</span>
          <span class="btn-ghost px-3 py-1 text-sm">Arriendo garantizado</span>
        </div>

        <div class="mt-auto pt-6 flex gap-3">
          <a href="#" class="btn-primary">Ver propuesta</a>
          <a href="#calculadora" class="btn-ghost">Probar en calculadora</a>
        </div>
        <p class="text-xs text-mist-200/70 mt-3">*Ejemplo referencial; confirmar condiciones vigentes.</p>
      </div>
    </div>
  </section>

  <!-- CALCULADORA -->
  <section id="calculadora" class="container mt-10 md:mt-16 mb-16">
    <div class="glass p-6 md:p-8">
      <div class="flex items-center justify-between gap-3 flex-wrap">
        <h3 class="text-2xl font-semibold">Calculadora — Dividendo & Flujo</h3>
        <a href="https://calendly.com/" class="btn-ghost">Revisar con tu banco</a>
      </div>

      <div class="mt-6 grid md:grid-cols-2 gap-6">
        <!-- Inputs -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <label class="block">
              <span class="text-sm text-mist-200/80">Precio (UF)</span>
              <input id="precioUF" type="number" step="0.01" value="2429" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950 placeholder:text-slate-700/70" placeholder="Ej: 2600">
            </label>
            <label class="block">
              <span class="text-sm text-mist-200/80">% Pie</span>
              <input id="piePct" type="number" step="0.5" value="20" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-sm text-mist-200/80">Tasa anual (%)</span>
              <input id="tasaAnual" type="number" step="0.01" value="3.5" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
            <label class="block">
              <span class="text-sm text-mist-200/80">Plazo (años)</span>
              <input id="plazo" type="number" value="30" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
            <label class="block">
              <span class="text-sm text-mist-200/80">Valor UF (CLP)</span>
              <input id="valorUF" type="number" value="38000" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <label class="block">
              <span class="text-sm text-mist-200/80">Arriendo estimado (CLP)</span>
              <input id="arriendo" type="number" value="360000" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
            <label class="block">
              <span class="text-sm text-mist-200/80">Gastos mensuales (CLP)</span>
              <input id="gastos" type="number" value="60000" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
            <label class="block">
              <span class="text-sm text-mist-200/80">Cuotas de pie (meses)</span>
              <input id="cuotasPie" type="number" value="36" class="mt-1 w-full glass border-none focus:ring-0 p-3 text-ink-950" />
            </label>
          </div>
        </div>

        <!-- Resultados -->
        <div class="grid sm:grid-cols-2 gap-4 content-start">
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Crédito (UF)</p>
            <p id="outCreditoUF" class="text-2xl font-semibold">—</p>
          </div>
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Pie total (CLP)</p>
            <p id="outPieCLP" class="text-2xl font-semibold">—</p>
          </div>
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Pie mensual (CLP)</p>
            <p id="outPieMensual" class="text-2xl font-semibold">—</p>
          </div>
          <div class="glass p-4">
            <p class="text-sm text-mist-200/80">Dividendo (CLP)</p>
            <p id="outDividendo" class="text-2xl font-semibold">—</p>
          </div>
          <div class="glass p-4 sm:col-span-2">
            <p class="text-sm text-mist-200/80">Flujo mensual (CLP) = Arriendo − Dividendo − Gastos</p>
            <p id="outFlujo" class="text-3xl font-semibold">—</p>
          </div>
          <div class="sm:col-span-2 flex gap-3">
            <a href="https://wa.me/56993481594?text=Quiero%20revisar%20mi%20preaprobaci%C3%B3n" class="btn-primary">Enviar por WhatsApp</a>
            <a href="#" class="btn-ghost">Descargar propuesta (PDF)</a>
          </div>
        </div>
      </div>
      <p class="text-xs text-mist-200/70 mt-3">Los valores son aproximados y no constituyen oferta. Verifica tasa y condiciones con tu banco.</p>
    </div>
  </section>

  <footer class="border-t border-white/10 py-10 text-center text-mist-200/70">
    <p>© Select Capital — Inversión Inmobiliaria</p>
  </footer>

  <script>
    const $ = id => document.getElementById(id);
    const fmt = n => n.toLocaleString('es-CL', { style:'currency', currency:'CLP', maximumFractionDigits:0 });

    function calc(){
      const precioUF = +$('precioUF').value || 0;
      const piePct    = (+$('piePct').value || 0) / 100;
      const tasaAnual = (+$('tasaAnual').value || 0) / 100;
      const plazo     = +$('plazo').value || 0;
      const valorUF   = +$('valorUF').value || 0;
      const arriendo  = +$('arriendo').value || 0;
      const gastos    = +$('gastos').value || 0;
      const cuotasPie = +$('cuotasPie').value || 1;

      const pieUF = precioUF * piePct;
      const pieCLP = pieUF * valorUF;
      const pieMensual = pieCLP / cuotasPie;

      const creditoUF = precioUF - pieUF;
      const creditoCLP = creditoUF * valorUF;

      const r = (tasaAnual / 12);
      const n = plazo * 12;
      const dividendo = (r > 0 && n > 0)
        ? (creditoCLP * r) / (1 - Math.pow(1 + r, -n))
        : 0;

      const flujo = arriendo - dividendo - gastos;

      // Output
      $('outCreditoUF').textContent = creditoUF.toFixed(2) + ' UF';
      $('outPieCLP').textContent = fmt(pieCLP);
      $('outPieMensual').textContent = fmt(pieMensual);
      $('outDividendo').textContent = fmt(dividendo);
      $('outFlujo').textContent = (flujo>=0?'+ ':'') + fmt(flujo);

      // Demo en card de proyecto
      const demo = document.getElementById('uiPieMensualDemo');
      if(demo) demo.textContent = fmt(pieMensual);
    }

    ['precioUF','piePct','tasaAnual','plazo','valorUF','arriendo','gastos','cuotasPie']
      .forEach(id => $(id).addEventListener('input', calc));

    calc();
  </script>
</body>
</html>
```

---

## 15) Theme dual (data-theme)
**Objetivo:** permitir modo light/dark sin duplicar componentes, solo alterando tokens CSS desde el atributo `data-theme`.

1. **Tokens centralizados** — `lenguaje visual/theme/select-capital-theme.css` define todos los `--sc-*` (color, glass, sombras, radii) con default dark y overrides para `[data-theme="light"]`. Incluye helpers `.sc-glass`, `.sc-btn-primary`, `.sc-noise`, etc.
2. **Hook JS** — `lenguaje visual/theme/theme-toggle.js` expone `initSelectTheme`, respeta `prefers-color-scheme`, persiste la elección (`localStorage`) y escucha controles con `data-theme-toggle` (toggle) o `data-theme-value="light|dark"`.
3. **Bootstrap mínimo**
   ```html
   <html lang="es" data-theme="dark">
   <head>
     <link rel="stylesheet" href="/lenguaje visual/theme/select-capital-theme.css">
   </head>
   <body class="sc-noise">
     <!-- UI -->
     <button data-theme-toggle class="sc-btn-ghost">Tema</button>
     <script type="module" src="/lenguaje visual/theme/theme-toggle.js"></script>
   </body>
   </html>
   ```
4. **Tailwind/React** — usa las variables en `tailwind.config.js` (`colors: { 'sc-bg': 'var(--sc-surface-page)' }`) o pásalas vía `style={{ background: 'var(--sc-glass-bg)' }}` para componentes React.
5. **Islas con tema propio** — cualquier contenedor puede forzar `data-theme="light"` (por ejemplo un modal sobre layout dark). Los hijos heredan los tokens sin recalcular CSS global.

## 16) Componentes de formulario + máscaras
**Archivos:** `lenguaje visual/forms/sc-forms.css` + `lenguaje visual/forms/sc-masks.js`.

1. **Primitivas visuales** — `.sc-field`, `.sc-label`, `.sc-input`, `.sc-input-affix`, `.sc-error` usan los tokens de glass (`--sc-glass-bg`, `--sc-border-glass`, `--sc-jade-500`, etc.) y radii 28px para mantener consistencia con cards/heroes.
2. **Máscaras declarativas** — `data-mask="rut|uf|phone"` activa formatos + normaliza valores. Cada input recibe `data-mask-normalized`, `data-mask-complete` y `data-mask-valid` para lógica de negocio sin manipular DOM extra.
3. **JS auto-init** — `sc-masks.js` exporta `initScMasks(root)` pero también corre solo al cargar (ESM). Emite evento `sc:mask` con `{ type, formatted, normalized, isComplete, isValid }`.
4. **Markup recomendado**
   ```html
   <div class="sc-field">
     <label class="sc-label" for="rut">RUT</label>
     <input id="rut" name="rut" data-mask="rut" class="sc-input"
            placeholder="12.345.678-5" autocomplete="off" inputmode="numeric" required>
     <p class="sc-error" id="rut-error" aria-hidden="true">Revisa el RUT</p>
   </div>
   <div class="sc-field">
     <label class="sc-label" for="phone">WhatsApp</label>
     <input id="phone" name="phone" data-mask="phone" class="sc-input"
            placeholder="+56 9 xxxx xxxx" inputmode="tel" required>
   </div>
   <div class="sc-field">
     <label class="sc-label" for="uf">Monto UF <span class="sc-optional">(aprox)</span></label>
     <div class="sc-input-affix">
       <input id="uf" data-mask="uf" inputmode="decimal" placeholder="2.600">
       <span>UF</span>
     </div>
   </div>
   ```
5. **Validación** — si `data-mask-valid="false"` tras `blur`, marca el contenedor con `data-invalid="true"` y muestra `.sc-error` (`aria-hidden="false"`). Para RUT se valida dígito verificador; para teléfono se exige los 9 dígitos móviles (`+56 9 xxxx xxxx`).

## 17) PDF server-side (“Descargar propuesta”)
**Objetivo:** entregar un PDF estilizado con el look Liquid Glass usando Next.js + Playwright/Puppeteer.

1. **API route** — `app/api/proposal-pdf/route.ts` (o `pages/api/...`) recibe un JSON con los cálculos del simulador (valores ya formateados). Referencia: `pdf/app-route-example.ts`.
2. **Templating** — `pdf/proposal-template.ts` usa Handlebars con la misma jerarquía visual del hero/card (radii 28px, badges, grid de KPIs). `pdf/proposal-template.html` sirve para iterar el layout con CSS antes de compilarlo a string.
3. **Render headless** — se lanza Chromium headless (`playwright-core`) con `--no-sandbox`, se inyecta el HTML y se genera PDF A4 (`printBackground: true`, márgenes 0.6 in). Salida directa (`Content-Disposition: attachment`) o subida a S3/R2.
4. **Payload sugerido**
   ```json
   {
     "clientName": "Ana Pérez",
     "clientRut": "12.345.678-5",
     "projectName": "Mirador La Florida",
     "priceUF": "2.600",
     "priceCLP": "$95.000.000",
     "downPaymentUF": "520",
     "downPaymentCLP": "$19.000.000",
     "loanUF": "2.080",
     "loanCLP": "$76.000.000",
     "dividendCLP": "$480.000",
     "dividendUF": "13.1",
     "rentCLP": "$520.000",
     "netFlow": "+$20.000",
     "rate": "4,5%",
     "term": 30,
     "notes": "Incluye administración Select Capital 12 meses",
     "logoUrl": "https://selectcapital.cl/logo.png",
     "issuedAt": "11/11/2025"
   }
   ```
5. **Integración con CTA** — al click en “Descargar propuesta” se hace `fetch` al endpoint, se crea un Blob y se dispara la descarga. Loggea evento GA4 (`pdf_download`) y Meta (`Lead`) cuando la promesa resuelva.

## 18) Medición (GA4 + Meta)
**Archivos:** `analytics/sc-tracking.js` + `analytics/README.md`.

1. **Eventos estandarizados** — claves (`cta_click`, `wizard_step`, `wizard_abandon`, `form_submit_intent`, `form_submit_success`, `pdf_download`) se traducen a GA4 (`select_*`) y Meta (`Lead` / `ViewContent`). Tabla completa en `analytics/README.md`.
2. **Helpers de tracking** — el script expone `window.SelectTracking.trackEvent(name, detail)` y escucha `data-track-event` / `data-track-detail`. También despacha `sc:track` para debug.
3. **Integraciones declarativas**
   ```html
   <script src="/analytics/sc-tracking.js" defer></script>
   <a data-track-event="cta_click" data-track-detail='{"cta_id":"hero_primary"}'>Reservar</a>
   <form data-track-form>
     <!-- al submit → form_submit_intent -->
   </form>
   <button data-pdf-download>Descargar propuesta</button>
   ```
4. **Eventos personalizados** — wizard y formulario deben emitir `sc:wizard:step`, `sc:wizard:abandon` y `sc:form:success` para que el helper no duplique lógica del negocio. El CTA de PDF dispara `pdf_download` cuando el blob se genera exitosamente (idealmente tras `await fetch`).
5. **IDs productivos** — los placeholders `G-XXXXXXXXXX` / `YOUR_PIXEL_ID` se sobreescriben antes de subir a prod; en dev déjalos vacíos para evitar ruido en analítica real.

## 19) Dashboard de insights (conversión)
**Archivo:** `dashboard/insights-dashboard.html`.

1. **Layout** — grid 2 columnas (sidebar + main) apoyado en tokens del theme (`--sc-glass-bg`, `--sc-border-glass`). Sidebar fija muestra filtros (Funnel/Proyectos/Campañas) y sirve de patrón para futuras vistas.
2. **KPIs** — cartas glass (`.kpi-card`) con numerales tabulares, badges y estado/trend. Ejemplo: sesiones, CTA, formularios y PDFs (todas métricas clave del funnel).
3. **Embudo visual** — placeholder `.chart-placeholder` pensado para inyectar sparkline/área desde librerías (Recharts/ECharts). Mantener radii 22px para consistencia con cards.
4. **Tabla de eventos** — typography uppercase para headers, `border-top` suave y notas contextuales; ideal para listar los eventos GA4 definidos en la sección 18.
5. **Uso sugerido** — incrustar el HTML como referencia en Figma o convertirlo en layout React/Next (server components) leyendo datos reales (BigQuery/GA4 API). Reutiliza `SelectTracking` para mantener naming entre UI y dashboard.

## 20) Próximos pasos sugeridos
- **Automatización CRM**: integrar los eventos (`form_submit_success`, `pdf_download`) con la base de leads (HubSpot/Notion) para cerrar el ciclo operativo.

## 21) Header & Footer global (v1)
### 21.1 Header — “Liquid Glass AppBar”
> Barra fija de 2 niveles, con micro‑mensaje de confianza y navegación principal enfocada en conversión (Agenda + WhatsApp).

1. **Capas**
   - **Microbar** (36 px alto, texto 13 px, fondo `graphite-900/85%` + ruido): izquierda `“Inversión inmobiliaria curada · Más de 250 proyectos evaluados”`; derecha íconos de contacto (`tel`, `mail`, `WhatsApp`) + selector de idioma (`ES | EN`). En mobile se convierte en carrusel autoscroll o se oculta tras plegar el header.
   - **AppBar principal** (72 px desktop / 60 px comprimido): glass (`blur 16`, opacidad 0.04, borde 1 px blanco 18%) con sombra `e2`. Padding `24px 32px` desktop, `16px 20px` tablet, `12px 16px` mobile.

2. **Arquitectura desktop (≥1024 px)**
   | Slot | Contenido | Tokens |
   | --- | --- | --- |
   | Brand cluster | Logo isotipo (32 px) dentro de `arc-mask` + wordmark “Select Capital” uppercase 14 px tracking +1 | `text-mist-200/90`, `font-medium` |
   | Nav list | 5 links (“Proyectos”, “Simulador”, “Servicios”, “Casos”, “Recursos”) centrados; separación 24 px | `text-mist-200/80`, hover `text-snow`, subrayado líquido (`linear-gradient jade`) |
   | Status pill | Badge glass (radius 16) “Nueva preventa · Ñuñoa” o “Cupos limitados” | `.corner-pill` |
   | CTA cluster | `btn-ghost` “WhatsApp” + `btn-primary` “Agenda tu asesoría” (prioridad). En pantallas XL se suma CTA terciario “Ingresar” (clientes). | Tokens de botones (secc. 7.2) |

3. **Estados**
   - **Default**: `data-state="default"` con transparencia 0.04.
   - **Scrolled** (>80 px): `data-state="compact"` → altura 60 px, opacidad 0.08, microbar plegada (se muestra como pill clickable). Sombra aumenta (`0 12px 32px rgba(0,0,0,.45)`).
   - **Active link**: bottom border 2 px `jade-500` con animación `clip-path` 200 ms; bullet arco detrás del texto.
   - **Focus/keyboard**: resalta link con `outline` jade 2 px + offset 4 px.

4. **Responsive**
   - **Tablet (768–1023 px)**: nav se convierte en carrusel horizontal con `mask-image` para degradar extremos; CTA primario permanece visible; microbar muestra solo icono WhatsApp + texto corto.
   - **Mobile (<768 px)**: branding + botón menú (icono arco). Al desplegar, menú ocupa toda la pantalla con fondo `glass.bg` + blur 20; enlaces en columna con badges y descritores cortos (“Simulador · calcula tu dividendo”). CTA primaria pasa a sticky bottom (`btn-primary` ancho completo). WhatsApp se fija como botón flotante circular (56 px).

5. **Interacción + tracking**
   - `data-track-event="nav_click"` con `data-track-detail='{"item":"proyectos"}'`.
   - Microbar iconos: `tel:` abre marcador, `mailto:` prellena asunto “Quiero evaluar mi inversión”.
   - `aria-current="page"` para link activo; menú móvil usa `aria-modal="true"`, `role="dialog"`.

6. **Snippet sugerido**
   ```html
   <header class="sc-appbar" data-state="default">
     <div class="sc-microbar">
       <span>Inversión inmobiliaria curada · +250 proyectos evaluados</span>
       <div class="sc-micro-actions">
         <a href="tel:+56228401000" data-track-event="micro_contact" data-track-detail='{"type":"phone"}'>+56 2 8401 000</a>
         <a href="mailto:hola@selectcapital.cl" data-track-detail='{"type":"mail"}'>hola@selectcapital.cl</a>
         <a href="https://wa.me/56993481594" class="whatsapp" data-track-detail='{"type":"whatsapp"}'>WhatsApp</a>
       </div>
     </div>
     <div class="sc-appbar-main glass">
       <a class="sc-brand" href="/">
         <img src="/images/logo-arc.svg" alt="Select Capital">
         <span>SELECT CAPITAL</span>
       </a>
       <nav aria-label="Principal">
         <a href="/proyectos" aria-current="page">Proyectos</a>
         <a href="/simulador">Simulador</a>
         <a href="/servicios">Servicios</a>
         <a href="/casos">Casos</a>
         <a href="/recursos">Recursos</a>
       </nav>
       <div class="sc-cta-cluster">
         <a class="btn-ghost" href="https://wa.me/56993481594">WhatsApp</a>
         <a class="btn-primary" href="#agenda">Agenda tu asesoría</a>
       </div>
     </div>
   </header>
   ```

### 21.2 Footer — “Depth Stack”
> Pie de página de 3 bloques (CTA · contenido · legal) con transiciones suaves y motivo de arco en separators.

1. **Capa CTA (hero final)**
   - Fondo degradado `Ink-950 → Graphite-900` + blur 18 + ruido 2%.
   - Layout 2 columnas: izquierda titular `H2` “¿Listo para curar tu próxima inversión?” + párrafo 18 px; derecha stack de CTAs (`btn-primary` Agenda, `btn-ghost` WhatsApp, link texto “Descargar brochure”). En mobile, columna única y CTA primaria ocupa ancho completo; secundario pasa a `btn-text`.
   - Incluye chips de confianza (ej. `“+1.200 asesorías 2023”`, `“Sin costo para el inversionista”`).

2. **Cuerpo principal (grid 4 columnas / 2 columnas tablet)**
   - **Columna 1 · Brand & propósito**: logo + claim, párrafo corto, lista de sellos (Notarios, Tasadores) con íconos de arco. Botón “Ver manifiesto”.
   - **Columna 2 · Navegación**: lista jerárquica (Inversión residencial, Multifamily, Créditos, Calculadora, Blog). Headings 13 px uppercase, enlaces 15–16 px.
   - **Columna 3 · Recursos & soporte**: links a PDF, dashboard, press kit, formulario. Añade badge `Nuevo` en recursos recientes.
   - **Columna 4 · Contacto**: datos (dirección, teléfono, WhatsApp, correo), horarios, redes (LinkedIn, Instagram, YouTube) usando íconos monocromos dentro de `arc-mask`. Botón pequeño “Agendar visita presencial”.
   - Separadores verticales con `border-image` arco en desktop; en mobile los bloques se apilan con `accordion` opcional.

3. **Franja legal**
   - Altura 56 px, `border-top` blanco 8% + highlight 1 px. Contiene: ©, RUT, política de privacidad, aviso legal (“No constituye oferta de valores”), selector de idioma. El aviso se despliega en tooltip glass (`data-legal="tooltip"`).

4. **Comportamiento**
   - `data-track-event="footer_link"` en cada enlace (detalle: categoría/slug).
   - Al hacer scroll al footer se dispara `intersectionObserver` para animar counters y chips.
   - Componentes accesibles: listas usan `<nav aria-label="Footer">`, redes agrupadas en `<ul>` con descripciones ocultas (`sr-only`).

5. **Responsive & dark/light**
   - En light mode el fondo pasa a `Snow` con textura suave, pero los paneles del grid mantienen glass oscuro (`rgba(14,20,27,.35)`) para conservar contraste.
   - En mobile se habilita “sticky utility bar” (botones Agenda / WhatsApp) justo encima del footer para evitar scrollear hasta CTAs.

6. **Wire rápido (texto)**
   ```
   [CTA Hero]
   ┌────────────────────────────────────────────┬───────────────┐
   │ ¿Listo para curar tu próxima inversión?    │ [Agenda CTA]  │
   │ Subcopy + chips                             │ [WhatsApp]    │
   └────────────────────────────────────────────┴───────────────┘

   [Grid]
   ┌Brand & propósito┬Navegación┬Recursos┬Contacto/Redes┐
   │story + sello    │links     │descargas│dirección    │
   └────────────────────────────────────────────────────┘

   [Legal bar]  © Select Capital · Política · Aviso Legal · ES/EN
   ```

---

> **Nota:** Este documento define la **v1.0** del Design System. Iteraremos con ejemplos reales (landing, cards de proyectos, dashboard de inversión) y añadiremos librería de íconos e ilustraciones con el **motivo de arco** del isotipo.
