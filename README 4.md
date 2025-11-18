# Selec Capital Web Assets

## Home Page Structure
- `home.html` is generated from `templates/home.template.html` using Handlebars-style placeholders.
- Content blocks live in `partials/home/*.html`; edit these partials and run the build script to regenerate the page.
- Global form styling resides in `lenguaje visual/forms/sc-forms.css`; home-specific overrides are in `lenguaje visual/theme/home.css`.

## Build Workflow
- Install dependencies once: `npm install` (currently only used for build utilities).
- Rebuild the home page after editing partials or template:
  - `npm run build:home`
  - The script `scripts/build-home.js` reads the template, injects partials, and writes the assembled `home.html`.
- The wizard logic is now modularized in `scripts/home-wizard.js` (loaded as an ES module).

## Development Notes
- The Cloudflare Turnstile callback remains exposed via `window.onTurnstileSuccess` inside `scripts/home-wizard.js`.
- Keep anchor IDs in sync between partials to preserve intra-page navigation.
- When adding new sections, create a matching partial, reference it in the template, and update `scripts/build-home.js` if new naming patterns are required.
