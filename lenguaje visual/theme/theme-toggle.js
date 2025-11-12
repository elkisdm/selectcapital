const STORAGE_KEY = 'select-capital:theme';
const THEMES = ['light', 'dark'];
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function getDocEl() {
  return document.documentElement;
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch (_) {
    /* noop */
  }
}

function readStoredTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    return null;
  }
}

export function applySelectTheme(theme) {
  if (!THEMES.includes(theme)) return;
  const el = getDocEl();
  el.setAttribute('data-theme', theme);
  el.style.setProperty('color-scheme', theme === 'dark' ? 'dark' : 'light');
  persistTheme(theme);
}

export function getCurrentSelectTheme() {
  const el = getDocEl();
  const attr = el.getAttribute('data-theme');
  if (attr && THEMES.includes(attr)) return attr;
  return null;
}

export function toggleSelectTheme() {
  const current = getCurrentSelectTheme() || 'dark';
  applySelectTheme(current === 'dark' ? 'light' : 'dark');
}

export function initSelectTheme(options = {}) {
  const {
    defaultTheme = 'dark',
    respectSystem = true,
    enablePrefersChange = true,
    toggleSelector = '[data-theme-toggle]',
    valueSelector = '[data-theme-value]'
  } = options;

  const stored = readStoredTheme();
  const system = prefersDark.matches ? 'dark' : 'light';
  const initial = stored || (respectSystem ? system : null) || defaultTheme;
  applySelectTheme(initial);

  if (enablePrefersChange) {
    prefersDark.addEventListener('change', (event) => {
      const explicit = readStoredTheme();
      if (explicit) return; // user already chose manually
      applySelectTheme(event.matches ? 'dark' : 'light');
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest(toggleSelector);
    if (target) {
      event.preventDefault();
      toggleSelectTheme();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest(valueSelector);
    if (target) {
      event.preventDefault();
      const next = target.getAttribute('data-theme-value');
      if (THEMES.includes(next)) {
        applySelectTheme(next);
      }
    }
  });
}

if (document.readyState !== 'loading') {
  initSelectTheme();
} else {
  document.addEventListener('DOMContentLoaded', () => initSelectTheme());
}
