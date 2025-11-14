const els = {
  form: document.getElementById('simForm'),
  income: document.getElementById('income'),
  loadPctSlider: document.getElementById('loadPct'),
  loadPctInput: document.getElementById('loadPctInput'),
  loadPctValue: document.getElementById('loadPctValue'),
  rate: document.getElementById('rate'),
  years: document.getElementById('years'),
  ltvPct: document.getElementById('ltvPct'),
  advancedToggle: document.getElementById('advancedToggle'),
  advancedSection: document.getElementById('advancedSection'),
  ufToggle: document.getElementById('ufToggle'),
  ufValue: document.getElementById('ufValue'),
  overrideDividend: document.getElementById('overrideDividend'),
  coIncome: document.getElementById('coIncome'),
  outputs: {
    dividend: document.getElementById('outDividend'),
    loan: document.getElementById('outLoan'),
    propertyClp: document.getElementById('outPropertyClp'),
    propertyUf: document.getElementById('outPropertyUf'),
    downpayment: document.getElementById('outDownpayment'),
  },
  propertyUfRow: document.getElementById('propertyUfRow'),
  resultTip: document.getElementById('resultTip'),
  resultsLive: document.getElementById('resultsLive'),
  errorNodes: document.querySelectorAll('[data-error-for]'),
};

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

const plainNumberFormatter = new Intl.NumberFormat('es-CL', {
  maximumFractionDigits: 0,
});

const ufFormatter = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseCurrency = (value) => {
  if (value === '' || value === null || value === undefined) return 0;
  const normalized = value
    .toString()
    .replace(/[^0-9,.-]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
};

const formatCurrency = (value) =>
  Number.isFinite(value) && value > 0 ? currencyFormatter.format(Math.round(value)) : '—';

const formatUF = (value) =>
  Number.isFinite(value) && value > 0 ? `≈ UF ${ufFormatter.format(value)}` : '—';

const formatPlain = (value) =>
  Number.isFinite(value) && value > 0 ? plainNumberFormatter.format(Math.round(value)) : '';

const getInputs = () => {
  const income = parseCurrency(els.income.value);
  const coIncome = parseCurrency(els.coIncome.value);
  const overrideDividend = parseCurrency(els.overrideDividend.value);
  const ufValue = parseCurrency(els.ufValue.value);

  return {
    income,
    coIncome,
    totalIncome: income + coIncome,
    loadPct: Number(els.loadPctSlider.value),
    rate: Number(els.rate.value),
    years: Number(els.years.value),
    ltvPct: Number(els.ltvPct.value),
    advancedEnabled: els.advancedToggle.checked,
    ufEnabled: els.advancedToggle.checked && els.ufToggle.checked,
    ufValue,
    overrideDividend,
  };
};

const validateInputs = (state) => {
  const errors = {};

  if (state.income <= 0 && state.overrideDividend <= 0) errors.income = 'Ingresa una renta válida.';
  if (state.loadPct < 20 || state.loadPct > 35) errors.loadPct = 'Debe estar entre 20% y 35%.';
  if (state.rate < 1 || state.rate > 8) errors.rate = 'Tasa entre 1% y 8%.';
  if (state.years <= 0) errors.years = 'Selecciona un plazo válido.';
  if (state.ltvPct < 70 || state.ltvPct > 90) errors.ltvPct = 'Financiamiento entre 70% y 90%.';
  if (state.coIncome < 0) errors.coIncome = 'Valor no puede ser negativo.';
  if (state.overrideDividend < 0) errors.overrideDividend = 'Valor no puede ser negativo.';
  if (state.advancedEnabled && state.ufEnabled && state.ufValue <= 0)
    errors.ufValue = 'Ingresa un valor UF válido.';
  if (state.overrideDividend <= 0 && state.totalIncome <= 0)
    errors.income = 'Se requiere al menos una renta.';

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

const calculateDividend = (state) =>
  state.overrideDividend > 0
    ? state.overrideDividend
    : state.totalIncome * (state.loadPct / 100);

// Fórmula de anualidad: P = D / (r * (1 - (1 + r)^-n))
const calculateLoan = (dividend, annualRate, years) => {
  const monthlyRate = annualRate / 12 / 100;
  const n = years * 12;
  if (monthlyRate === 0) return dividend * n;
  const denominator = monthlyRate * (1 - Math.pow(1 + monthlyRate, -n));
  return denominator <= 0 ? 0 : dividend / denominator;
};

const calculateProperty = (loanAmount, ltvPct) => {
  const ratio = ltvPct / 100;
  return ratio > 0 ? loanAmount / ratio : 0;
};

const calculateDownpayment = (propertyValue, ltvPct) => propertyValue * (1 - ltvPct / 100);

const renderErrors = (errors) => {
  els.errorNodes.forEach((node) => {
    const field = node.dataset.errorFor;
    node.textContent = errors[field] || '';
  });

  const trackedFields = ['income', 'rate', 'years', 'ltvPct', 'ufValue', 'overrideDividend', 'coIncome'];
  trackedFields.forEach((field) => {
    const control = document.getElementById(field);
    if (!control) return;
    if (errors[field]) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  });

  const loadHasError = Boolean(errors.loadPct);
  [els.loadPctSlider, els.loadPctInput].forEach((control) => {
    if (!control) return;
    if (loadHasError) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  });
};

const resetResults = (message) => {
  Object.values(els.outputs).forEach((node) => {
    node.textContent = '—';
  });
  els.propertyUfRow.hidden = true;
  els.resultTip.hidden = true;
  els.resultsLive.textContent = message || 'Resultados no disponibles.';
};

const updateResults = (outputs, state) => {
  els.outputs.dividend.textContent = formatCurrency(outputs.dividend);
  els.outputs.loan.textContent = formatCurrency(outputs.loan);
  els.outputs.propertyClp.textContent = formatCurrency(outputs.propertyClp);
  els.outputs.downpayment.textContent = formatCurrency(outputs.downpayment);

  const showUf = state.ufEnabled && state.ufValue > 0;
  if (showUf) {
    const propertyUf = outputs.propertyClp / state.ufValue;
    els.propertyUfRow.hidden = false;
    els.outputs.propertyUf.textContent = formatUF(propertyUf);
  } else {
    els.propertyUfRow.hidden = true;
  }

  const showTip = outputs.propertyClp > 0 && outputs.propertyClp < 10_000_000;
  els.resultTip.hidden = !showTip;

  els.resultsLive.textContent = `Dividendo ${formatCurrency(outputs.dividend)}, crédito ${formatCurrency(
    outputs.loan,
  )}, propiedad ${formatCurrency(outputs.propertyClp)}. ${showTip ? 'Tip: considera aumentar tu pie.' : ''}`;
};

const recalculate = () => {
  const state = getInputs();
  const validation = validateInputs(state);
  renderErrors(validation.errors);

  if (!validation.isValid) {
    resetResults('Completa los campos requeridos para ver los resultados.');
    return;
  }

  const dividend = calculateDividend(state);
  const loan = calculateLoan(dividend, state.rate, state.years);
  const propertyClp = calculateProperty(loan, state.ltvPct);
  const downpayment = calculateDownpayment(propertyClp, state.ltvPct);

  updateResults({ dividend, loan, propertyClp, downpayment }, state);
};

const syncLoadPct = (value) => {
  const normalized = clamp(Number(value) || 0, 20, 35);
  els.loadPctSlider.value = normalized;
  els.loadPctInput.value = normalized;
  els.loadPctValue.textContent = `${normalized}%`;
};

const setupCurrencyInputs = () => {
  const currencyInputs = els.form.querySelectorAll('[data-format="currency"]');
  currencyInputs.forEach((input) => {
    input.value = formatPlain(parseCurrency(input.value));

    input.addEventListener('focus', () => {
      const value = parseCurrency(input.value);
      input.value = value > 0 ? String(Math.round(value)) : '';
    });

    input.addEventListener('blur', () => {
      const value = parseCurrency(input.value);
      input.value = formatPlain(value);
      recalculate();
    });

    input.addEventListener('input', () => {
      recalculate();
    });
  });
};

const toggleAdvancedSection = () => {
  const shouldShow = els.advancedToggle.checked;
  els.advancedSection.hidden = !shouldShow;
  if (!shouldShow) {
    els.ufToggle.checked = false;
  }
  recalculate();
};

const bindEvents = () => {
  els.loadPctSlider.addEventListener('input', () => {
    syncLoadPct(els.loadPctSlider.value);
    recalculate();
  });

  els.loadPctInput.addEventListener('input', () => {
    syncLoadPct(els.loadPctInput.value);
    recalculate();
  });

  ['rate', 'years', 'ltvPct'].forEach((id) => {
    const control = document.getElementById(id);
    control.addEventListener('input', recalculate);
    control.addEventListener('change', recalculate);
    control.addEventListener('blur', recalculate);
  });

  els.advancedToggle.addEventListener('change', toggleAdvancedSection);
  els.ufToggle.addEventListener('change', recalculate);

  setupCurrencyInputs();
};

const init = () => {
  syncLoadPct(els.loadPctSlider.value);
  bindEvents();
  resetResults('Completa los campos para ver resultados.');
};

init();
