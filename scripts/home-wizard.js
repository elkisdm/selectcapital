const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const form = document.querySelector('[data-home-wizard]');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');
const params = new URLSearchParams(window.location.search);
const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'gclid', 'fbclid', 'ttclid'];

utmFields.forEach((key) => {
  const input = form?.querySelector(`[name="${key}"]`);
  if (input) input.value = params.get(key) || '';
});

const tsToken = document.getElementById('ts-token');
const tsError = document.getElementById('t-error');

window.onTurnstileSuccess = function onTurnstileSuccess(token) {
  if (tsToken) tsToken.value = token;
  if (tsError) {
    tsError.setAttribute('aria-hidden', 'true');
  }
};

const reCL = /^(?:\+?56)?9\d{8}$/;
const STEP_ERROR_MSG = 'Completa los campos del paso actual para seguir.';

function initHomeWizard() {
  if (!form) return;

  const wInput = document.getElementById('whatsapp');
  const eInput = document.getElementById('email');
  const rutInput = document.getElementById('rut');
  const wError = document.getElementById('w-error');
  const eError = document.getElementById('e-error');
  const rutError = document.getElementById('r-error');
  const rentaError = document.getElementById('renta-error');
  const ahorroError = document.getElementById('ahorro-error');
  const communeError = document.getElementById('comunas-error');
  const submitBtn = document.getElementById('submitBtn');
  const sText = document.getElementById('s-text');
  const sLoad = document.getElementById('s-load');
  const wizard = form.querySelector('[data-form-wizard]');
  const wizardViewport = wizard ? wizard.querySelector('.form-wizard-viewport') : null;
  const stepPanels = wizard ? Array.from(wizard.querySelectorAll('[data-step-panel]')) : [];
  const stepPills = wizard ? Array.from(wizard.querySelectorAll('[data-step-pill]')) : [];
  const stepPrevButtons = stepPanels.map((panel) => panel.querySelector('[data-step-prev]'));
  const stepNextButtons = stepPanels.map((panel) => panel.querySelector('[data-step-next]'));
  const progressBar = wizard ? wizard.querySelector('[data-progress-bar]') : null;
  const progressValue = wizard ? wizard.querySelector('[data-progress-value]') : null;
  const progressLabel = wizard ? wizard.querySelector('[data-progress-label]') : null;
  const summaryLabel = wizard ? wizard.querySelector('[data-step-summary]') : null;
  const moneyInputs = form.querySelectorAll('[data-money-input]');
  const moneyStores = {};

  moneyInputs.forEach((input) => {
    const key = input.dataset.moneyInput;
    moneyStores[key] = { input, normalized: '' };
  });

  const chipStores = form.querySelectorAll('[data-chip-store]');
  const chipGroups = {};
  const chipErrors = {};

  chipStores.forEach((store) => {
    const name = store.dataset.chipStore;
    chipGroups[name] = form.querySelector(`[data-chip-group="${name}"]`);
    chipErrors[name] = form.querySelector(`[data-chip-error="${name}"]`);
  });

  const cardInputs = form.querySelectorAll('[data-card-input]');
  const ingresoExtras = form.querySelectorAll('[data-ingreso-extra]');
  const communeStore = form.querySelector('[data-commune-store]');
  const communeInput = form.querySelector('[data-commune-input]');
  const communeSelected = form.querySelector('[data-commune-selected]');
  const communePills = form.querySelectorAll('[data-commune-pill]');
  const communeSelections = new Map();
  let currentStep = 0;

  function updateError(node, shouldShow, message) {
    if (!node) return;
    if (message) node.textContent = message;
    node.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  }

  function setFieldValidity(field, isValid) {
    if (!field) return;
    if (isValid) {
      field.removeAttribute('data-invalid');
      field.removeAttribute('aria-invalid');
    } else {
      field.setAttribute('data-invalid', 'true');
      field.setAttribute('aria-invalid', 'true');
    }
  }

  function updateWizardViewportHeight(targetIndex = currentStep) {
    if (!wizardViewport) return;
    if (!stepPanels.length) return;
    const normalizedIndex = Math.max(0, Math.min(stepPanels.length - 1, typeof targetIndex === 'number' ? targetIndex : currentStep));
    const panel = stepPanels[normalizedIndex];
    if (!panel) return;
    wizardViewport.style.height = `${panel.offsetHeight}px`;
  }

  function refreshWizardViewportHeight(targetIndex = currentStep) {
    window.requestAnimationFrame(() => updateWizardViewportHeight(targetIndex));
  }

  function chunkThousands(value) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  function formatMoneyInput(input) {
    const key = input.dataset.moneyInput;
    const store = moneyStores[key];
    if (!store) return;
    const digits = (input.value.match(/\d+/g) || []).join('');
    if (!digits) {
      input.value = '';
      store.normalized = '';
      return;
    }
    store.normalized = digits;
    input.value = `$ ${chunkThousands(digits)}`;
    setFieldValidity(input, true);
    if (key === 'renta_liquida') updateError(rentaError, false);
    if (key === 'monto_ahorro') updateError(ahorroError, false);
  }

  function normalizeCommune(raw) {
    if (!raw) return null;
    const clean = raw.trim();
    if (!clean) return null;
    const collapsed = clean.replace(/\s+/g, ' ');
    const words = collapsed.split(' ');
    const label = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    const key = collapsed.toLocaleLowerCase('es-CL');
    return { key, label };
  }

  function syncCommuneUI() {
    if (communeStore) {
      const communesArray = Array.from(communeSelections.values());
      communeStore.value = communesArray.join(', ');
      if (communesArray.length > 0) {
        setFieldValidity(communeStore, true);
        updateError(communeError, false);
      } else if (communeStore.hasAttribute('data-step-required')) {
        setFieldValidity(communeStore, false);
      }
    }
    if (communeSelected) {
      communeSelected.innerHTML = '';
      if (!communeSelections.size) {
        const empty = document.createElement('p');
        empty.className = 'sc-hint';
        empty.textContent = 'Selecciona una o mas comunas.';
        communeSelected.appendChild(empty);
      } else {
        communeSelections.forEach((label, key) => {
          const tag = document.createElement('span');
          tag.className = 'commune-tag';
          const text = document.createElement('span');
          text.textContent = label;
          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.dataset.removeCommune = key;
          removeBtn.setAttribute('aria-label', `Quitar ${label}`);
          removeBtn.textContent = '×';
          tag.appendChild(text);
          tag.appendChild(removeBtn);
          communeSelected.appendChild(tag);
        });
      }
    }
    communePills.forEach((pill) => {
      const normalized = normalizeCommune(pill.dataset.communePill);
      const isActive = normalized && communeSelections.has(normalized.key);
      pill.classList.toggle('is-selected', Boolean(isActive));
      pill.setAttribute('aria-pressed', String(Boolean(isActive)));
    });
    if (communeSelections.size > 0) {
      const communesArray = Array.from(communeSelections.values());
      if (communeStore) {
        communeStore.value = communesArray.join(', ');
        setFieldValidity(communeStore, true);
      }
      updateError(communeError, false);
    } else if (communeStore) {
      communeStore.value = '';
      setFieldValidity(communeStore, false);
    }
  }

  function addCommune(raw) {
    const normalized = normalizeCommune(raw);
    if (!normalized) return;
    communeSelections.set(normalized.key, normalized.label);
    syncCommuneUI();
  }

  function toggleCommune(raw) {
    const normalized = normalizeCommune(raw);
    if (!normalized) return;
    if (communeSelections.has(normalized.key)) {
      communeSelections.delete(normalized.key);
    } else {
      communeSelections.set(normalized.key, normalized.label);
    }
    syncCommuneUI();
  }

  function chipIsRequired(store) {
    const condition = store.dataset.requiredWhen;
    if (!condition) return true;
    const [fieldName, expectedValue] = condition.split('=');
    const selected = form.querySelector(`input[name="${fieldName}"]:checked`);
    if (!selected) return false;
    return selected.value === expectedValue;
  }

  function validateChipStore(store) {
    const groupName = store.dataset.chipStore;
    const required = chipIsRequired(store);
    const group = chipGroups[groupName];
    const errorNode = chipErrors[groupName];
    if (!required) {
      updateError(errorNode, false);
      if (group) group.classList.remove('has-error');
      return true;
    }
    const hasValue = Boolean(store.value);
    updateError(errorNode, !hasValue, 'Selecciona una opcion.');
    if (group) {
      group.classList.toggle('has-error', !hasValue);
    }
    return hasValue;
  }

  function validateField(field) {
    if (!field) return true;
    if (field === eInput) {
      const valid = Boolean(field.value.trim()) && field.checkValidity();
      setFieldValidity(field, valid);
      updateError(eError, !valid, 'Ingresa un correo valido.');
      return valid;
    }
    if (field === wInput) {
      const normalized = (wInput.dataset.maskNormalized || '').replace(/\D/g, '');
      const valid = reCL.test(normalized);
      setFieldValidity(field, valid);
      updateError(wError, !valid, 'Formato +56 9 1234 5678');
      return valid;
    }
    if (field === rutInput) {
      const value = field.value.trim();
      const valid = Boolean(value) && field.dataset.maskValid === 'true';
      setFieldValidity(field, valid);
      updateError(rutError, !valid, value ? 'Ingresa un RUT valido.' : 'El RUT es obligatorio.');
      return valid;
    }
    if (field.dataset.moneyInput === 'renta_liquida') {
      const store = moneyStores.renta_liquida;
      const valid = Boolean(store && store.normalized);
      setFieldValidity(field, valid);
      updateError(rentaError, !valid, 'Ingresa tu renta liquida aproximada.');
      return valid;
    }
    if (field.dataset.moneyInput === 'monto_ahorro') {
      const store = moneyStores.monto_ahorro;
      const valid = Boolean(store && store.normalized);
      setFieldValidity(field, valid);
      updateError(ahorroError, !valid, 'Ingresa el monto ahorrado.');
      return valid;
    }
    if (field.hasAttribute('data-commune-store')) {
      const valid = communeSelections.size > 0 || Boolean(field.value && field.value.trim());
      setFieldValidity(field, valid);
      updateError(communeError, !valid, 'Selecciona al menos una comuna.');
      return valid;
    }
    if (field.type === 'checkbox') {
      const valid = field.checked;
      setFieldValidity(field, valid);
      return valid;
    }
    if (field.type === 'radio') {
      const groupInputs = form.querySelectorAll(`input[name="${field.name}"]`);
      const anyChecked = Array.from(groupInputs).some((radio) => radio.checked);
      groupInputs.forEach((radio) => {
        const card = radio.closest('[data-card]');
        if (card) {
          card.classList.toggle('has-error', !anyChecked);
        }
      });
      return anyChecked;
    }
    const value = field.value.trim();
    const valid = Boolean(value);
    setFieldValidity(field, valid);
    return valid;
  }

  function validateStep(stepIndex, options = {}) {
    if (!stepPanels[stepIndex]) return true;
    let isValid = true;
    let firstInvalid = null;
    const panel = stepPanels[stepIndex];
    const required = panel.querySelectorAll('[data-step-required]');

    required.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalid) {
          if (field.type === 'hidden') {
            const parentField = field.closest('.sc-field');
            const proxy = parentField ? parentField.querySelector('input, textarea, button') : null;
            firstInvalid = proxy || communeInput || field;
          } else {
            firstInvalid = field;
          }
        }
      }
    });

    const chipStoresInPanel = panel.querySelectorAll('[data-chip-store]');
    chipStoresInPanel.forEach((store) => {
      const chipValid = validateChipStore(store);
      if (!chipValid) {
        isValid = false;
        if (!firstInvalid) {
          firstInvalid = chipGroups[store.dataset.chipStore] || store;
        }
      }
    });

    if (stepIndex === 2 && panel.querySelector('[data-commune-store]')) {
      const communeValid = communeSelections.size > 0 || (communeStore && communeStore.value && communeStore.value.trim());
      if (!communeValid) {
        isValid = false;
        if (!firstInvalid) {
          firstInvalid = communeInput || communeStore || panel.querySelector('[data-commune-enhanced]');
        }
        updateError(communeError, true, 'Selecciona al menos una comuna.');
        if (communeStore) setFieldValidity(communeStore, false);
      } else {
        updateError(communeError, false);
        if (communeStore) setFieldValidity(communeStore, true);
      }
    }

    if (!isValid) {
      if (formError) {
        formError.textContent = STEP_ERROR_MSG;
        formError.setAttribute('aria-hidden', 'false');
      }
      if (options.focus && firstInvalid && typeof firstInvalid.focus === 'function') {
        firstInvalid.focus();
      }
    } else if (stepIndex === currentStep && formError) {
      formError.setAttribute('aria-hidden', 'true');
    }
    return isValid;
  }

  function validateAllSteps() {
    let firstInvalid = -1;
    stepPanels.forEach((_, idx) => {
      if (firstInvalid === -1 && !validateStep(idx)) {
        firstInvalid = idx;
      }
    });
    if (firstInvalid >= 0) {
      goToStep(firstInvalid);
      return false;
    }
    return true;
  }

  function goToStep(index) {
    if (!stepPanels.length) return;
    const targetStep = Math.max(0, Math.min(stepPanels.length - 1, index));
    const totalSteps = stepPanels.length || 1;
    const progressPercent = totalSteps > 1 ? targetStep / (totalSteps - 1) : 1;
    currentStep = targetStep;

    stepPanels.forEach((panel, idx) => {
      panel.setAttribute('aria-hidden', String(idx !== targetStep));
      panel.classList.toggle('is-active', idx === targetStep);
    });
    stepPills.forEach((pill, idx) => {
      pill.classList.toggle('is-active', idx === targetStep);
      pill.classList.toggle('is-complete', idx < targetStep);
    });

    const isLastStep = targetStep === stepPanels.length - 1;
    stepPrevButtons.forEach((btn, idx) => {
      if (!btn) return;
      const isCurrent = idx === targetStep;
      const shouldHide = targetStep === 0 || !isCurrent;
      btn.hidden = shouldHide;
      btn.disabled = shouldHide;
    });
    stepNextButtons.forEach((btn, idx) => {
      if (!btn) return;
      const isCurrent = idx === targetStep;
      const shouldHide = !isCurrent || isLastStep;
      btn.hidden = shouldHide;
      btn.disabled = shouldHide;
      if (isCurrent && !isLastStep) {
        const label = stepPanels[targetStep].dataset.nextLabel || 'Continuar';
        btn.textContent = label;
      }
    });

    if (submitBtn) submitBtn.hidden = targetStep !== stepPanels.length - 1;
    if (progressValue) {
      const bounded = Math.max(0, Math.min(1, progressPercent));
      progressValue.style.setProperty('--wizard-progress', `${(bounded * 100).toFixed(2)}%`);
    }
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(targetStep + 1));
      progressBar.setAttribute('aria-valuemax', String(totalSteps));
      progressBar.setAttribute('aria-valuetext', `Paso ${targetStep + 1} de ${totalSteps}`);
    }
    if (progressLabel) {
      progressLabel.textContent = `Paso ${targetStep + 1} de ${totalSteps}`;
    }
    if (summaryLabel) {
      const heading = stepPanels[targetStep].querySelector('h3');
      summaryLabel.textContent = heading ? heading.textContent : `Paso ${targetStep + 1}`;
    }
    const focusTarget = stepPanels[targetStep].querySelector('[data-step-required]:not([type="hidden"]), input:not([type="hidden"]), textarea');
    if (focusTarget && typeof focusTarget.focus === 'function') {
      window.requestAnimationFrame(() => focusTarget.focus());
    }
    refreshWizardViewportHeight(targetStep);
  }

  moneyInputs.forEach((input) => {
    input.addEventListener('input', () => formatMoneyInput(input));
    input.addEventListener('blur', () => formatMoneyInput(input));
  });

  if (eInput) {
    eInput.addEventListener('input', () => {
      if (eInput.validity.valid) {
        updateError(eError, false);
        setFieldValidity(eInput, true);
      }
    });
  }
  if (wInput) {
    wInput.addEventListener('input', () => {
      updateError(wError, false);
      setFieldValidity(wInput, true);
    });
    wInput.addEventListener('blur', () => validateField(wInput));
  }
  if (rutInput) {
    rutInput.addEventListener('blur', () => validateField(rutInput));
  }

  cardInputs.forEach((input) => {
    const card = input.closest('[data-card]');
    if (card && input.checked) {
      card.classList.add('is-selected');
    }
    input.addEventListener('change', () => {
      const group = form.querySelectorAll(`input[name="${input.name}"]`);
      group.forEach((radio) => {
        const radioCard = radio.closest('[data-card]');
        if (radioCard) {
          radioCard.classList.toggle('is-selected', radio.checked);
          radioCard.classList.remove('has-error');
        }
      });
      if (input.name === 'tipo_ingreso') {
        handleIngresoExtras(input.value);
      }
    });
  });

  Object.entries(chipGroups).forEach(([name, group]) => {
    if (!group) return;
    const store = form.querySelector(`[data-chip-store="${name}"]`);
    group.addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      event.preventDefault();
      group.querySelectorAll('.chip').forEach((btn) => {
        btn.classList.toggle('is-selected', btn === chip);
      });
      if (store) store.value = chip.dataset.chipValue || '';
      updateError(chipErrors[name], false);
      group.classList.remove('has-error');
    });
  });

  if (communeSelected) {
    communeSelected.addEventListener('click', (event) => {
      const removeBtn = event.target.closest('[data-remove-commune]');
      if (!removeBtn) return;
      communeSelections.delete(removeBtn.dataset.removeCommune);
      syncCommuneUI();
    });
  }

  communePills.forEach((pill) => {
    pill.addEventListener('click', (event) => {
      event.preventDefault();
      toggleCommune(pill.dataset.communePill);
    });
  });

  if (communeInput) {
    communeInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        addCommune(communeInput.value);
        communeInput.value = '';
      }
    });
    communeInput.addEventListener('blur', () => {
      if (communeInput.value.trim()) {
        addCommune(communeInput.value);
        communeInput.value = '';
      }
    });
  }

  function handleIngresoExtras(selectedValue) {
    const normalized = (selectedValue || '').toLowerCase();
    ingresoExtras.forEach((block) => {
      const match = block.dataset.ingresoExtra;
      const isActive = normalized && match === normalized;
      block.hidden = !isActive;
      block.setAttribute('aria-hidden', String(!isActive));
      block.classList.toggle('is-visible', isActive);
      if (!isActive) {
        const store = block.querySelector('[data-chip-store]');
        if (store) {
          store.value = '';
          const chipName = store.dataset.chipStore;
          const group = chipGroups[chipName];
          if (group) {
            group.querySelectorAll('.chip').forEach((chip) => chip.classList.remove('is-selected'));
            group.classList.remove('has-error');
          }
          updateError(chipErrors[chipName], false);
        }
      }
    });
    refreshWizardViewportHeight();
  }

  const initialIngreso = form.querySelector('input[name="tipo_ingreso"]:checked');
  handleIngresoExtras(initialIngreso ? initialIngreso.value : '');
  syncCommuneUI();
  moneyInputs.forEach((input) => formatMoneyInput(input));
  if (wizard) wizard.setAttribute('data-wizard-ready', 'true');
  if (stepPanels.length) goToStep(0);

  stepNextButtons.forEach((btn, index) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (formSuccess) formSuccess.classList.remove('show');
      currentStep = index;
      if (validateStep(index, { focus: true })) {
        goToStep(index + 1);
      } else {
        goToStep(index);
      }
    });
  });

  stepPrevButtons.forEach((btn, index) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const targetStep = Math.max(0, index - 1);
      goToStep(targetStep);
    });
  });

  stepPills.forEach((pill, index) => {
    pill.addEventListener('click', () => {
      if (index < currentStep) {
        goToStep(index);
      }
    });
  });

  if (window.ResizeObserver && wizardViewport) {
    const stepResizeObserver = new ResizeObserver(() => refreshWizardViewportHeight());
    stepPanels.forEach((panel) => stepResizeObserver.observe(panel));
  }
  window.addEventListener('resize', () => refreshWizardViewportHeight());

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    if (form.querySelector('[name="honey"]').value) return;
    if (formSuccess) formSuccess.classList.remove('show');
    if (!validateAllSteps()) return;
    if (!tsToken || !tsToken.value) {
      updateError(tsError, true, 'Confirma que no eres un bot');
      if (formError) {
        formError.textContent = 'Confirma el captcha antes de enviar.';
        formError.setAttribute('aria-hidden', 'false');
      }
      return;
    }
    if (formError) formError.setAttribute('aria-hidden', 'true');
    if (submitBtn) submitBtn.disabled = true;
    if (sText) sText.style.display = 'none';
    if (sLoad) sLoad.style.display = 'inline';
    const data = new FormData(form);
    Object.entries(moneyStores).forEach(([key, store]) => {
      if (store && store.normalized) {
        const fieldName = store.input.name || key;
        data.set(fieldName, store.normalized);
      }
    });
    try {
      const res = await fetch(form.action, { method: 'POST', body: data });
      if (!res.ok) throw new Error('submit_failed');
      form.reset();
      communeSelections.clear();
      syncCommuneUI();
      moneyInputs.forEach((input) => {
        input.value = '';
        const store = moneyStores[input.dataset.moneyInput];
        if (store) store.normalized = '';
      });
      cardInputs.forEach((input) => {
        const card = input.closest('[data-card]');
        if (card) card.classList.remove('is-selected');
      });
      handleIngresoExtras('');
      goToStep(0);
      if (tsToken) tsToken.value = '';
      if (tsError) tsError.setAttribute('aria-hidden', 'true');
      if (formSuccess) {
        formSuccess.classList.add('show');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (window.SelectTracking) {
        window.SelectTracking.trackEvent('form_submit_success', { source: 'home_landing' });
      }
      form.dispatchEvent(new CustomEvent('sc:form:success', { detail: { source: 'home_landing' }, bubbles: true }));
    } catch (err) {
      console.error('form_submit_error', err);
      if (formError) {
        formError.textContent = 'No pudimos registrar tu solicitud. Intenta nuevamente en unos segundos.';
        formError.setAttribute('aria-hidden', 'false');
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
      if (sText) sText.style.display = 'inline';
      if (sLoad) sLoad.style.display = 'none';
    }
  });
}

initHomeWizard();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function handleAnchor(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

