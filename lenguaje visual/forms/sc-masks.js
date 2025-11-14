const THEME_ATTR = 'data-mask';

const chunkThousands = (value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const cleanRut = (value) => value.replace(/[^0-9kK]/g, '').toUpperCase();

const rutVerifier = (body) => {
  if (!body) return null;
  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const mod = 11 - (sum % 11);
  if (mod === 11) return '0';
  if (mod === 10) return 'K';
  return String(mod);
};

export function formatRut(value) {
  const clean = cleanRut(value);
  if (!clean) return { formatted: '', normalized: '', isComplete: false, isValid: false };
  const body = clean.slice(0, -1);
  const verifier = clean.slice(-1);
  if (!body) {
    return { formatted: verifier, normalized: verifier, isComplete: false, isValid: false };
  }
  const formattedBody = chunkThousands(body);
  const formatted = `${formattedBody}-${verifier}`;
  const normalized = `${body}-${verifier}`;
  const isComplete = body.length >= 6 && verifier.length === 1;
  const isValid = isComplete && rutVerifier(body) === verifier;
  return { formatted, normalized, isComplete, isValid };
}

export function formatUF(value, options = {}) {
  const { decimals = 2 } = options;
  const clean = value.replace(/[^0-9.,]/g, '').replace(',', '.');
  const [rawInt = '', rawDecimal = ''] = clean.split('.');
  const intPart = rawInt.replace(/\D/g, '');
  const decimalPart = rawDecimal.replace(/\D/g, '').slice(0, decimals);
  if (!intPart) {
    return { formatted: '', normalized: '', isComplete: false, isValid: false };
  }
  const formattedInt = chunkThousands(intPart);
  const formatted = decimalPart ? `${formattedInt},${decimalPart}` : formattedInt;
  const normalized = decimalPart ? `${intPart}.${decimalPart}` : intPart;
  return { formatted, normalized, isComplete: true, isValid: true };
}

const cleanPhoneDigits = (value) => value.replace(/\D/g, '');

export function formatCLPhone(value) {
  let digits = cleanPhoneDigits(value);
  if (digits.startsWith('56')) {
    digits = digits.slice(2);
  }
  if (digits.length && !digits.startsWith('9')) {
    digits = `9${digits}`;
  }
  digits = digits.slice(0, 9);
  if (!digits) {
    return { formatted: '', normalized: '', isComplete: false, isValid: false };
  }
  const first = digits.slice(0, 1);
  const mid = digits.slice(1, 5);
  const last = digits.slice(5);
  let formatted = `+56 ${first}`;
  if (mid) formatted += ` ${mid}`;
  if (last) formatted += ` ${last}`;
  const normalized = `+569${digits.slice(1)}`;
  const isComplete = digits.length === 9;
  return { formatted, normalized, isComplete, isValid: isComplete };
}

const MASKERS = {
  rut: formatRut,
  uf: formatUF,
  phone: formatCLPhone,
};

function applyMask(el) {
  const type = el.getAttribute(THEME_ATTR);
  const masker = MASKERS[type];
  if (!masker) return;
  const { formatted, normalized, isComplete, isValid } = masker(el.value || '');
  el.value = formatted;
  if (normalized) {
    el.dataset.maskNormalized = normalized;
  } else {
    delete el.dataset.maskNormalized;
  }
  el.dataset.maskComplete = String(isComplete);
  el.dataset.maskValid = String(isValid);
  if (formatted) {
    el.setAttribute('aria-invalid', String(!isValid));
    el.dataset.invalid = String(!isValid);
  } else {
    el.removeAttribute('aria-invalid');
    delete el.dataset.invalid;
  }
  el.dispatchEvent(
    new CustomEvent('sc:mask', {
      detail: { type, formatted, normalized, isComplete, isValid },
      bubbles: true,
    })
  );
}

export function initScMasks(root = document) {
  const inputs = root.querySelectorAll(`input[${THEME_ATTR}]`);
  inputs.forEach((el) => {
    const handler = () => applyMask(el);
    el.addEventListener('input', handler);
    el.addEventListener('blur', handler);
    handler();
  });
}

if (typeof document !== 'undefined') {
  if (document.readyState !== 'loading') {
    initScMasks();
  } else {
    document.addEventListener('DOMContentLoaded', () => initScMasks());
  }
}
