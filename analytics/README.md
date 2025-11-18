# Medición GA4 + Meta

Este módulo define los eventos mínimos para el funnel del landing (hero CTA → wizard → formulario → PDF).

## Eventos
| Event key | GA4 | Meta | Cuándo | Parámetros recomendados |
| --- | --- | --- | --- | --- |
| `cta_click` | `select_cta_click` | `ViewContent` | Click en CTA primario (Reservar / WhatsApp) | `label`, `cta_id`, `position`, `utm_source` |
| `wizard_step` | `select_wizard_step` | `Lead` | Usuario avanza paso del wizard | `step`, `direction`, `progress` |
| `wizard_abandon` | `select_wizard_abandon` | `Lead` | Usuario cierra wizard con pasos incompletos | `step`, `progress`, `reason` |
| `form_submit_intent` | `select_form_intent` | — | Submit del form (antes de Turnstile/backend) | `ingresos`, `utm_source` |
| `form_submit_success` | `select_form_success` | `Lead` | Backend responde 200 | `source` (landing/simulador), `valor_proyecto` |
| `pdf_download` | `select_pdf_download` | `Lead` | PDF generado y descarga iniciada | `project_name`, `ticket` |

## Helpers JS
- `analytics/sc-tracking.js` expone `window.SelectTracking.trackEvent(name, detail)` y data-atributos (`data-track-event`).
- El script escucha eventos personalizados (`sc:wizard:*`, `sc:form:success`) para evitar duplicar lógica.

### Hook en HTML
```html
<script src="/analytics/sc-tracking.js" defer></script>
<a data-track-event="cta_click" data-track-detail='{"cta_id":"hero_primary"}'>Reservar</a>
```

### Hook manual (React/TS)
```ts
SelectTracking.trackEvent('pdf_download', {
  project_name: 'Mirador La Florida',
  ticket: 'UF2600'
});
```

## Meta Pixel / GA4
- Mantén `G-XXXXXXXXXX` y `YOUR_PIXEL_ID` sincronizados con producción (o sobrescribe `CONFIG` antes de cargar).
- En ambientes donde no se pueda exponer IDs reales, setéalos a vacío para que los helpers no hagan nada.

## QA
1. Revisa en GA DebugView que los eventos nazcan con los parámetros esperados.
2. En Meta Pixel Helper valida que `Lead`/`ViewContent` se disparen solo una vez por interacción.
3. Usa el evento `sc:track` (CustomEvent) para agregar logs locales sin tocar los mapas de GA/Meta.
