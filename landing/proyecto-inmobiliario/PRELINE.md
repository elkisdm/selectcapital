# 🎨 Preline UI - Guía de Integración

Preline es una biblioteca de componentes UI moderna y accesible que hemos integrado en el sistema de landings.

---

## 📦 Instalación

Preline ya está instalado en el proyecto:

```bash
npm install preline --save
```

**Versión instalada:** 3.2.3

---

## 🔧 Configuración

### En cada Landing HTML

```html
<!-- En el <head> -->
<link rel="stylesheet" href="/node_modules/preline/dist/preline.css" />

<!-- Antes de cerrar </body> -->
<script src="/node_modules/preline/dist/preline.js"></script>
```

✅ **Ya configurado en:**
- `viva-marin.html`

---

## 🎨 Componentes Disponibles

Preline ofrece componentes listos para usar:

### 1. **Accordion (Acordeón)**
Perfecto para FAQ y contenido colapsable.

```html
<div class="hs-accordion-group">
  <div class="hs-accordion active" id="hs-basic-heading-one">
    <button class="hs-accordion-toggle" aria-controls="hs-basic-collapse-one">
      Pregunta 1
      <svg class="hs-accordion-active:hidden block" />
      <svg class="hs-accordion-active:block hidden" />
    </button>
    <div id="hs-basic-collapse-one" class="hs-accordion-content">
      <p>Respuesta 1</p>
    </div>
  </div>
</div>
```

### 2. **Modal (Diálogo)**
Para mostrar contenido en ventanas emergentes.

```html
<button data-hs-overlay="#hs-basic-modal">
  Abrir Modal
</button>

<div id="hs-basic-modal" class="hs-overlay hidden">
  <div class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500">
    <div class="hs-overlay-backdrop"></div>
    <div class="hs-overlay-content">
      <!-- Contenido del modal -->
    </div>
  </div>
</div>
```

### 3. **Tabs (Pestañas)**
Para organizar contenido en pestañas.

```html
<nav class="flex space-x-2" aria-label="Tabs" role="tablist">
  <button type="button" class="hs-tab-active:bg-white" data-hs-tab="#tabs-1">
    Tab 1
  </button>
  <button type="button" data-hs-tab="#tabs-2">
    Tab 2
  </button>
</nav>

<div id="tabs-1" role="tabpanel">
  Contenido Tab 1
</div>
<div id="tabs-2" role="tabpanel" class="hidden">
  Contenido Tab 2
</div>
```

### 4. **Dropdown (Menú Desplegable)**
Para menús y opciones.

```html
<div class="hs-dropdown relative inline-flex">
  <button type="button" class="hs-dropdown-toggle">
    Menú
  </button>
  <div class="hs-dropdown-menu hidden">
    <a href="#">Opción 1</a>
    <a href="#">Opción 2</a>
  </div>
</div>
```

### 5. **Tooltip (Información Emergente)**
Para mostrar información adicional.

```html
<button type="button" class="hs-tooltip-toggle">
  Hover me
  <span class="hs-tooltip-content" role="tooltip">
    Información adicional
  </span>
</button>
```

### 6. **Collapse (Colapsar)**
Para mostrar/ocultar contenido.

```html
<button type="button" data-hs-collapse="#collapse-1">
  Toggle
</button>
<div id="collapse-1" class="hs-collapse hidden">
  Contenido colapsable
</div>
```

### 7. **Carousel (Carrusel)**
Para galerías de imágenes.

```html
<div data-hs-carousel>
  <div class="hs-carousel-body">
    <div class="hs-carousel-slide">Slide 1</div>
    <div class="hs-carousel-slide">Slide 2</div>
  </div>
</div>
```

---

## 🎯 Casos de Uso en Landings

### FAQ Section (Usar Accordion)

```html
<div class="hs-accordion-group">
  <div class="hs-accordion" id="faq-1">
    <button class="hs-accordion-toggle w-full text-left p-4 flex justify-between items-center">
      <span>¿Cómo se divide el pie 10%?</span>
      <svg class="hs-accordion-active:rotate-180 w-4 h-4 transition-transform" />
    </button>
    <div class="hs-accordion-content hidden">
      <div class="p-4">
        7,5% en 36 cuotas + 2,5% en 12 post‑escritura.
      </div>
    </div>
  </div>
</div>
```

### Galería con Modal

```html
<!-- Thumbnail -->
<img src="imagen.jpg" data-hs-overlay="#lightbox-1" class="cursor-pointer" />

<!-- Modal Lightbox -->
<div id="lightbox-1" class="hs-overlay hidden">
  <div class="hs-overlay-content">
    <img src="imagen-grande.jpg" />
  </div>
</div>
```

### Tipologías con Tabs

```html
<nav class="flex space-x-4 mb-6" role="tablist">
  <button data-hs-tab="#tipo-estudio" class="hs-tab-active:border-b-2">
    Estudio
  </button>
  <button data-hs-tab="#tipo-1d">
    1 Dormitorio
  </button>
  <button data-hs-tab="#tipo-2d">
    2 Dormitorios
  </button>
</nav>

<div id="tipo-estudio">
  <!-- Info Estudio -->
</div>
<div id="tipo-1d" class="hidden">
  <!-- Info 1D -->
</div>
<div id="tipo-2d" class="hidden">
  <!-- Info 2D -->
</div>
```

---

## 🎨 Personalización con Nuestro Sistema de Temas

Preline funciona perfectamente con nuestras variables de tema:

```css
/* Personalizar accordion */
.hs-accordion-toggle {
  background: var(--theme-bg-surface);
  color: var(--theme-text-primary);
  border: 1px solid var(--theme-border-soft);
  transition: all 0.3s ease;
}

.hs-accordion-toggle:hover {
  background: var(--theme-bg-elevated);
}

/* Personalizar modal */
.hs-overlay-backdrop {
  background: rgba(0, 0, 0, 0.5);
}

[data-theme='light'] .hs-overlay-backdrop {
  background: rgba(0, 0, 0, 0.3);
}

.hs-overlay-content {
  background: var(--theme-bg-elevated);
  border: 1px solid var(--theme-border-soft);
  box-shadow: var(--theme-shadow-lg);
}
```

---

## 🚀 Migración de Componentes Existentes

### FAQ: De HTML Estático a Accordion

**Antes:**
```html
<details>
  <summary>¿Pregunta?</summary>
  <p>Respuesta</p>
</details>
```

**Después (con Preline):**
```html
<div class="hs-accordion">
  <button class="hs-accordion-toggle">
    ¿Pregunta?
  </button>
  <div class="hs-accordion-content hidden">
    <p>Respuesta</p>
  </div>
</div>
```

### Galería: De Estático a Modal

**Antes:**
```html
<img src="imagen.jpg" />
```

**Después (con Preline):**
```html
<img src="imagen-thumb.jpg" data-hs-overlay="#modal-img" class="cursor-pointer" />

<div id="modal-img" class="hs-overlay hidden">
  <img src="imagen-full.jpg" />
</div>
```

---

## 📱 Responsive y Accesibilidad

Preline incluye:
- ✅ Soporte completo de teclado
- ✅ Atributos ARIA correctos
- ✅ Responsive por defecto
- ✅ Animaciones suaves
- ✅ Focus states visibles

---

## 🔧 API JavaScript

Preline expone una API global para control programático:

```javascript
// Abrir modal
HSOverlay.open(document.querySelector('#my-modal'));

// Cerrar modal
HSOverlay.close(document.querySelector('#my-modal'));

// Abrir accordion
HSAccordion.show(document.querySelector('#my-accordion'));

// Cambiar tab
HSTab.show(document.querySelector('[data-hs-tab="#tab-2"]'));

// Inicializar componentes dinámicos
window.HSStaticMethods.autoInit();
```

---

## 🎯 Integración con Nuestro Sistema

### En viva-marin.js

```javascript
// Después de renderizar contenido dinámico
const renderFAQ = () => {
  const faqContainer = document.querySelector('.faq-container');
  
  // Renderizar FAQ con Preline
  faqContainer.innerHTML = state.config.faq.map((item, i) => `
    <div class="hs-accordion" id="faq-${i}">
      <button class="hs-accordion-toggle">
        ${item.question}
      </button>
      <div class="hs-accordion-content hidden">
        <p>${item.answer}</p>
      </div>
    </div>
  `).join('');
  
  // Re-inicializar Preline
  window.HSStaticMethods.autoInit(['accordion']);
};
```

---

## 📚 Recursos

### Documentación Oficial
- **Sitio web:** https://preline.co/
- **Componentes:** https://preline.co/docs/
- **GitHub:** https://github.com/htmlstreamofficial/preline

### Componentes Más Útiles para Landings
1. **Accordion** - FAQ
2. **Modal** - Galería lightbox, formularios
3. **Tabs** - Tipologías, comparativas
4. **Carousel** - Galería de imágenes
5. **Tooltip** - Información adicional
6. **Dropdown** - Menús, filtros

---

## 🎨 Ejemplos Completos

### FAQ Completo con Preline

```html
<section class="section" id="faq">
  <div class="page-shell">
    <header class="section__header">
      <h2 class="section__title">Preguntas Frecuentes</h2>
    </header>
    
    <div class="hs-accordion-group space-y-4">
      <div class="hs-accordion surface" id="faq-1">
        <button class="hs-accordion-toggle w-full text-left p-6 flex justify-between items-center">
          <span class="text-lg font-semibold">¿Cómo se divide el pie 10%?</span>
          <svg class="hs-accordion-active:rotate-180 w-5 h-5 transition-transform" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="hs-accordion-content hidden overflow-hidden transition-all duration-300">
          <div class="p-6 pt-0">
            <p class="text-base">7,5% en 36 cuotas + 2,5% en 12 post‑escritura.</p>
          </div>
        </div>
      </div>
      
      <!-- Más preguntas... -->
    </div>
  </div>
</section>
```

### Galería con Lightbox

```html
<section class="section" id="galeria">
  <div class="page-shell">
    <div class="gallery-grid-large">
      <figure class="gallery-item-large cursor-pointer" data-hs-overlay="#lightbox-1">
        <img src="/images/viva-marin/fachada.png" alt="Fachada" />
        <figcaption>Fachada principal</figcaption>
      </figure>
      <!-- Más imágenes... -->
    </div>
  </div>
</section>

<!-- Modales Lightbox -->
<div id="lightbox-1" class="hs-overlay hidden fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto">
  <div class="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 transition-all">
    <div class="hs-overlay-backdrop fixed inset-0 bg-black bg-opacity-75"></div>
    <div class="hs-overlay-content relative flex items-center justify-center min-h-screen p-4">
      <div class="relative max-w-4xl w-full">
        <button type="button" class="absolute top-4 right-4 text-white" data-hs-overlay="#lightbox-1">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img src="/images/viva-marin/fachada.png" class="w-full rounded-lg" />
      </div>
    </div>
  </div>
</div>
```

---

## ✅ Checklist de Migración

Para migrar un proyecto a Preline:

- [ ] Instalar Preline: `npm install preline`
- [ ] Incluir CSS en `<head>`
- [ ] Incluir JS antes de cerrar `</body>`
- [ ] Identificar componentes a migrar
- [ ] Reemplazar HTML con componentes Preline
- [ ] Personalizar estilos con variables de tema
- [ ] Probar en todos los navegadores
- [ ] Verificar accesibilidad
- [ ] Re-inicializar después de contenido dinámico

---

## 🎯 Ventajas de Usar Preline

✅ **Componentes Listos** - No reinventar la rueda  
✅ **Accesibilidad** - ARIA y teclado incluidos  
✅ **Responsive** - Funciona en todos los dispositivos  
✅ **Ligero** - Sin dependencias pesadas  
✅ **Personalizable** - Se integra con nuestro sistema de temas  
✅ **Bien Documentado** - Ejemplos claros  
✅ **Activamente Mantenido** - Actualizaciones regulares  

---

## 🚨 Consideraciones

### Inicialización Dinámica
Si agregas componentes dinámicamente con JavaScript:

```javascript
// Después de agregar HTML
window.HSStaticMethods.autoInit();

// O específico
window.HSStaticMethods.autoInit(['accordion', 'modal']);
```

### Conflictos de Estilos
Preline usa clases con prefijo `hs-`, lo que evita conflictos con nuestros estilos existentes.

### Performance
Preline es ligero (~15KB gzipped), no afecta significativamente el rendimiento.

---

**Última actualización:** Noviembre 2024  
**Versión de Preline:** 3.2.3  
**Estado:** ✅ Integrado y listo para usar

