import { PROJECT_CONFIG } from './project-data-viva-marin.js';

const state = {
  config: PROJECT_CONFIG,
  simulation: null,
  selectedTypology: null,
};

const currencyFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

const ufFormatter = new Intl.NumberFormat('es-CL', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('es-CL', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const incomeSubtypeOptions = {
  dependiente: [
    { value: 'indefinido', label: 'Contrato indefinido' },
    { value: 'plazo_fijo', label: 'Contrato a plazo fijo' },
    { value: 'informal', label: 'Sin contrato (informal)' },
  ],
  independiente: [
    { value: 'honorarios', label: 'Boletas de honorarios' },
    { value: 'retiros', label: 'Retiros de empresa' },
  ],
  mixto: [
    { value: 'indefinido_honorarios', label: 'Contrato + boletas' },
    { value: 'indefinido_retiros', label: 'Contrato + retiros' },
  ],
};

const sectionEvents = {
  hero: 'view_hero',
  highlights: 'view_highlights',
  gallery: 'view_gallery',
  tipologias: 'view_typologies',
  simulador: 'view_simulator',
  ubicacion: 'view_location',
  'porque-ahora': 'view_why_now',
  acompanamiento: 'view_accompaniment',
  testimonios: 'view_testimonials',
  faq: 'view_faq',
  formulario: 'view_form',
};

const selectSlot = (slot) => document.querySelector(`[data-slot="${slot}"]`);
const selectSection = (name) =>
  document.querySelector(`[data-section="${name}"]`);

const trackEvent = (eventName, params = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const scrollToForm = () => {
  const target = document.getElementById('formulario');
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const setMetaTags = () => {
  const {
    project: { name, commune, stage, delivery, slug },
    highlights,
  } = state.config;

  const metaTitle = `Proyecto ${name} en ${commune} — Desde ${highlights?.[0]?.value ?? 'UF'} | Entrega ${delivery}`;
  const metaDescription = `Invierte en ${name} (${commune}) etapa ${stage}. Pie en cuotas, entrega ${delivery}, asesoría sin costo. Solicita tu propuesta personalizada hoy.`;

  const titleNode = document.querySelector('[data-meta="title"]');
  if (titleNode) titleNode.textContent = metaTitle;
  document.title = metaTitle;

  const descNode = document.querySelector('[data-meta="description"]');
  if (descNode) descNode.setAttribute('content', metaDescription);

  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = `${window.location.origin}/proyectos/${slug}`;
    document.head.appendChild(link);
  }
};

const renderHero = () => {
  const { project, badges, highlights, whyNow } = state.config;
  const stageNode = selectSlot('hero-stage');
  const titleNode = selectSlot('hero-title');
  const subtitleNode = selectSlot('hero-subtitle');
  const badgesContainer = selectSlot('hero-badges');
  const ctasContainer = document.querySelector('[data-slot="hero-ctas"]');
  const heroMedia = selectSlot('hero-media');
  const statsContainer = selectSlot('hero-stats');
  const pointsContainer = selectSlot('hero-points');

  if (stageNode) {
    stageNode.textContent = `${project.stage} · Entrega ${project.delivery}`;
    stageNode.hidden = false;
  }

  const highlightDesde = highlights?.find((item) =>
    item.label.toLowerCase().includes('desde')
  );

  if (titleNode) {
    const desde = highlightDesde ? highlightDesde.value : '';
    titleNode.textContent = `Invierte en ${project.name} en ${project.commune} desde ${desde}`;
  }

  if (subtitleNode) {
    subtitleNode.textContent = `Lanzamiento con Promoción 10% + Descuento 5%. Pie 10%: 7,5% en 36 cuotas (TOKU) + 2,5% en 12 cuotas post-escritura. Entrega ${project.delivery}.`;
  }

  if (badgesContainer) {
    badgesContainer.innerHTML = '';
    badges?.forEach((badge) => {
      const span = document.createElement('span');
      span.textContent = badge;
      badgesContainer.appendChild(span);
    });
  }

  if (ctasContainer) {
    const primary = ctasContainer.querySelector('[data-action="scroll-form"]');
    const secondary = ctasContainer.querySelector('[data-action="download-ficha"]');
    if (primary) {
      primary.textContent = project.ctaPrimary;
    }
    if (secondary) {
      secondary.textContent = project.ctaSecondary;
      secondary.href = `/pdf/proposal-template.html?project=${project.slug}`;
    }
  }

  if (statsContainer) {
    statsContainer.innerHTML = '';
    highlights?.slice(0, 3).forEach(({ label, value }) => {
      const stat = document.createElement('dl');
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      stat.append(dt, dd);
      statsContainer.appendChild(stat);
    });
  }

  if (pointsContainer) {
    pointsContainer.innerHTML = '';
    const heroPoints = (whyNow?.length
      ? whyNow.slice(0, 3)
      : badges?.slice(0, 3).map((text) => ({ title: text }))) ?? [];

    pointsContainer.hidden = heroPoints.length === 0;
    if (heroPoints.length === 0) {
      return;
    }

    heroPoints.forEach(({ title, description, link }) => {
      const item = document.createElement('li');
      const wrapper = document.createElement('div');
      const heading = document.createElement('strong');
      heading.textContent = title;
      wrapper.append(heading);
      if (description) {
        const body = document.createElement('span');
        body.textContent = description;
        wrapper.appendChild(body);
      }
      if (link) {
        const action = document.createElement('a');
        action.href = link;
        action.target = '_blank';
        action.rel = 'noopener noreferrer';
        action.textContent = 'Ver fuente';
        action.className = 'hero__point-link';
        wrapper.appendChild(action);
      }
      item.appendChild(wrapper);
      pointsContainer.appendChild(item);
    });
  }

  if (heroMedia) {
    heroMedia.innerHTML = '';
    const { heroVideo, heroImageFallback } = project;
    if (heroVideo?.src) {
      const video = document.createElement('video');
      video.className = 'hero__video';
      video.poster = heroVideo.poster ?? heroImageFallback;
      video.autoPlay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('aria-label', `Video del proyecto ${project.name}`);

      const source = document.createElement('source');
      source.src = heroVideo.src;
      source.type = heroVideo.type ?? 'video/mp4';
      video.appendChild(source);

      const fallbackImg = document.createElement('img');
      fallbackImg.src = heroImageFallback;
      fallbackImg.alt = `Vista del proyecto ${project.name}`;
      fallbackImg.className = 'hero__image';
      fallbackImg.loading = 'lazy';
      video.appendChild(fallbackImg);

      heroMedia.appendChild(video);
    } else if (heroImageFallback) {
      const img = document.createElement('img');
      img.src = heroImageFallback;
      img.alt = `Vista del proyecto ${project.name}`;
      img.className = 'hero__image';
      img.loading = 'lazy';
      heroMedia.appendChild(img);
    }

    const overlay = document.createElement('div');
    overlay.className = 'hero__overlay';
    overlay.innerHTML = `<strong>${project.name}</strong><p>${project.commune} · ${project.stage}</p><p>Entrega ${project.delivery}</p>`;
    overlay.style.display = 'block';
    heroMedia.appendChild(overlay);
  }
};

const renderHighlights = () => {
  const container = selectSlot('highlights-grid');
  if (!container) return;

  container.innerHTML = '';
  state.config.highlights?.forEach(({ label, value }) => {
    const card = document.createElement('article');
    card.className = 'highlight-card';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    const valueEl = document.createElement('strong');
    valueEl.textContent = value;

    card.append(labelEl, valueEl);
    container.appendChild(card);
  });
};

const renderGallery = () => {
  const container = selectSlot('gallery-grid');
  if (!container) return;
  container.innerHTML = '';

  state.config.gallery?.forEach((item, index) => {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';
    figure.dataset.index = String(index);
    figure.dataset.type = item.type ?? 'image';

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      video.controls = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = 'metadata';
      video.setAttribute('aria-label', item.alt ?? 'Video del proyecto');
      figure.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.alt ?? 'Imagen del proyecto';
      img.loading = 'lazy';
      figure.appendChild(img);
    }

    if (item.caption) {
      const caption = document.createElement('figcaption');
      caption.textContent = item.caption;
      figure.appendChild(caption);
    }

    figure.addEventListener('click', () => openLightbox(index));
    container.appendChild(figure);
  });
};

const renderTypologies = () => {
  const container = selectSlot('typology-grid');
  if (!container) return;
  container.innerHTML = '';

  state.config.typologies?.forEach((typology) => {
    const card = document.createElement('article');
    card.className = 'typology-card';
    card.dataset.typologyId = typology.id;

    const title = document.createElement('h3');
    title.textContent = typology.name;

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = 'Promo 10% + Descuento 5% aplicado';
    card.appendChild(badge);

    const metrics = document.createElement('div');
    metrics.className = 'typology-metrics';

    const priceRow = document.createElement('span');
    priceRow.innerHTML = `<span>UF promedio ref.:</span><strong>UF ${ufFormatter.format(typology.ufPrice)}</strong>`;
    metrics.appendChild(priceRow);

    const downRow = document.createElement('span');
    downRow.innerHTML = `<span>Pie 10%:</span><strong>UF ${ufFormatter.format(typology.downPaymentUF)}</strong>`;
    metrics.appendChild(downRow);

    const cuotaRow = document.createElement('span');
    cuotaRow.innerHTML = `<span>7,5% en 36 cuotas:</span><strong>UF ${ufFormatter.format(Math.round(typology.downPaymentUF * 0.75))}</strong>`;
    metrics.appendChild(cuotaRow);

    const postRow = document.createElement('span');
    postRow.innerHTML = `<span>2,5% en 12 cuotas:</span><strong>UF ${ufFormatter.format(Math.round(typology.downPaymentUF * 0.25))}</strong>`;
    metrics.appendChild(postRow);

    if (typology.rentCLP) {
      const rentRow = document.createElement('span');
      rentRow.innerHTML = `<span>Arriendo estimado:</span><strong>${currencyFormatter.format(
        typology.rentCLP
      )}</strong>`;
      rentRow.dataset.tooltip = typology.rentSource ?? '';
      metrics.appendChild(rentRow);
    }

    const actions = document.createElement('div');
    actions.className = 'typology-actions';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-primary';
    button.textContent = 'Quiero esta tipología';
    button.addEventListener('click', () => {
      state.selectedTypology = typology;
      highlightSelectedTypology(typology.id);
      populateTypologyInForm(typology);
      trackEvent('select_typology', {
        tipologia: typology.id,
        uf: typology.ufPrice,
        m2: typology.areaM2,
      });
      scrollToForm();
    });

    if (typology.rentSource) {
      button.setAttribute('aria-describedby', `rent-source-${typology.id}`);
    }

    actions.appendChild(button);

    card.append(title, metrics, actions);

    if (typology.rentSource) {
      const hint = document.createElement('p');
      hint.className = 'field-hint';
      hint.id = `rent-source-${typology.id}`;
      hint.textContent = `Fuente: ${typology.rentSource}`;
      card.appendChild(hint);
    }

    container.appendChild(card);
  });
};

const highlightSelectedTypology = (id) => {
  document
    .querySelectorAll('.typology-card')
    .forEach((card) =>
      card.classList.toggle('is-selected', card.dataset.typologyId === id)
    );
};

const populateTypologyInForm = (typology) => {
  const hidden = document.querySelector('input[name="tipologia_interes"]');
  if (hidden) hidden.value = typology?.id ?? '';
};

const parseNumberInput = (value) => {
  if (!value) return 0;
  const normalized = value
    .toString()
    .replace(/\./g, '')
    .replace(/[^0-9]/g, '');
  return Number(normalized) || 0;
};

const calculateSimulation = () => {
  const form = document.getElementById('miniSimulatorForm');
  if (!form) return null;

  const income = parseNumberInput(form.income.value);
  const loadPercent = clamp(Number(form.loadPercent.value) || 0, 10, 45);
  const years = Number(form.years.value) || state.config.financials.defaultYears;
  const financing = Number(form.financing.value) || state.config.financials.defaultFinancing;

  if (!income || income <= 0) return null;

  const {
    financials: {
      annualRate,
      expensesPercent = 0,
      insurancePercent = 0,
      ufValue,
      financingOptions,
    },
  } = state.config;

  const allowedDividend = income * (loadPercent / 100);
  const monthlyRate = annualRate / 12;
  const periods = years * 12;

  let annuityFactor;
  if (monthlyRate === 0) {
    annuityFactor = 1 / periods;
  } else {
    const pow = Math.pow(1 + monthlyRate, periods);
    annuityFactor = (monthlyRate * pow) / (pow - 1);
  }

  const extraFactor = (expensesPercent + insurancePercent) / 12;
  const totalFactor = annuityFactor + extraFactor;
  const selectedOptions = financingOptions?.length ? financingOptions : [financing];

  const ranges = selectedOptions.map((ltv) => {
    const loan = allowedDividend / totalFactor;
    const propertyCLP = loan / ltv;
    const propertyUF = propertyCLP / ufValue;
    return {
      ltv,
      loan,
      propertyCLP,
      propertyUF,
    };
  });

  const ufValues = ranges.map((item) => item.propertyUF);
  const minUF = Math.min(...ufValues);
  const maxUF = Math.max(...ufValues);

  const suggestedTypologies = state.config.typologies?.filter(
    (typology) => typology.ufPrice >= minUF * 0.95 && typology.ufPrice <= maxUF * 1.05
  );

  return {
    income,
    loadPercent,
    years,
    financing,
    dividend: allowedDividend,
    ranges,
    minUF,
    maxUF,
    suggestedTypologies,
  };
};

const renderSimulation = () => {
  const resultsContainer = selectSlot('sim-results');
  const summaryList = selectSlot('sim-summary');
  const actionButton = document.querySelector('[data-action="open-simulation-form"]');

  if (!resultsContainer || !summaryList) return;

  const result = calculateSimulation();
  state.simulation = result;

  summaryList.innerHTML = '';

  if (!result) {
    resultsContainer.querySelector('strong').textContent = 'Comienza la simulación';
    resultsContainer.querySelector('p').textContent =
      'Ajusta los valores y descubre qué unidades puedes alcanzar con tu renta actual.';
    if (actionButton) actionButton.disabled = true;
    return;
  }

  const { dividend, minUF, maxUF, suggestedTypologies, ranges } = result;

  resultsContainer.querySelector('strong').textContent = 'Resultados estimados';
  resultsContainer.querySelector('p').textContent =
    'Con estos valores puedes proyectar tu compra. Los montos pueden variar según evaluación bancaria.';

  const dividendItem = document.createElement('li');
  dividendItem.innerHTML = `<span>Dividendo estimado:</span> <strong>${currencyFormatter.format(
    dividend
  )}</strong>`;
  summaryList.appendChild(dividendItem);

  const rangeItem = document.createElement('li');
  rangeItem.innerHTML = `<span>Rango UF aproximado:</span> <strong>UF ${ufFormatter.format(
    minUF
  )} – UF ${ufFormatter.format(maxUF)}</strong>`;
  summaryList.appendChild(rangeItem);

  const loadItem = document.createElement('li');
  loadItem.innerHTML = `<span>% Carga:</span> <strong>${percentFormatter.format(
    result.loadPercent / 100
  )}</strong>`;
  summaryList.appendChild(loadItem);

  const financingItem = document.createElement('li');
  financingItem.innerHTML = `<span>Financiamiento:</span> <strong>${percentFormatter.format(
    result.financing
  )} crédito</strong>`;
  summaryList.appendChild(financingItem);

  if (ranges.length > 1) {
    ranges.forEach((entry) => {
      const node = document.createElement('li');
      node.innerHTML = `<span>${percentFormatter.format(
        entry.ltv
      )} crédito:</span> <strong>UF ${ufFormatter.format(
        entry.propertyUF
      )}</strong>`;
      summaryList.appendChild(node);
    });
  }

  if (suggestedTypologies?.length) {
    const suggestionItem = document.createElement('li');
    suggestionItem.innerHTML = `<span>Tipologías sugeridas:</span> <strong>${suggestedTypologies
      .map((t) => t.name.split('—')[0].trim())
      .join(', ')}</strong>`;
    summaryList.appendChild(suggestionItem);
  }

  if (actionButton) actionButton.disabled = false;

  trackEvent('simulate_result', {
    renta: result.income,
    carga_pct: result.loadPercent,
    plazo_anos: result.years,
    financiamiento: result.financing,
    rango_uf_min: Math.round(minUF),
    rango_uf_max: Math.round(maxUF),
  });
};

const bindSimulator = () => {
  const incomeSlider = document.getElementById('sim-income');
  const downpaymentSlider = document.getElementById('sim-downpayment');
  const yearsSelect = document.getElementById('sim-years');
  const resultsContainer = document.querySelector('[data-simulator-results]');
  const resultsLoading = document.querySelector('[data-results-loading]');
  const resultsContent = document.querySelector('[data-results-content]');

  if (!incomeSlider || !downpaymentSlider || !resultsContainer) return;

  // Initialize display values
  updateDisplayValues();

  // Bind slider events
  incomeSlider.addEventListener('input', () => {
    updateDisplayValues();
    calculateAndDisplayResults();
    trackEvent('simulator_interact', { field: 'income', value: incomeSlider.value });
  });

  downpaymentSlider.addEventListener('input', () => {
    updateDisplayValues();
    calculateAndDisplayResults();
    trackEvent('simulator_interact', { field: 'downpayment', value: downpaymentSlider.value });
  });

  yearsSelect.addEventListener('change', () => {
    updateDisplayValues();
    calculateAndDisplayResults();
    trackEvent('simulator_interact', { field: 'years', value: yearsSelect.value });
  });

  // Initial calculation
  calculateAndDisplayResults();

  function updateDisplayValues() {
    const incomeDisplay = document.querySelector('[data-income-display]');
    const downpaymentDisplay = document.querySelector('[data-downpayment-display]');
    const yearsDisplay = document.querySelector('[data-years-display]');

    if (incomeDisplay) {
      incomeDisplay.textContent = currencyFormatter.format(Number(incomeSlider.value));
    }
    if (downpaymentDisplay) {
      downpaymentDisplay.textContent = `${downpaymentSlider.value} UF`;
    }
    if (yearsDisplay) {
      yearsDisplay.textContent = `${yearsSelect.value} años`;
    }
  }

  function calculateAndDisplayResults() {
    // Show loading state
    if (resultsLoading) resultsLoading.style.display = 'flex';
    if (resultsContent) resultsContent.style.display = 'none';

    // Simulate calculation delay for better UX
    setTimeout(() => {
      const results = calculateInteractiveSimulation();
      displayResults(results);

      if (resultsLoading) resultsLoading.style.display = 'none';
      if (resultsContent) resultsContent.style.display = 'block';
    }, 800);
  }

  function calculateInteractiveSimulation() {
    const income = Number(incomeSlider.value);
    const downpaymentUF = Number(downpaymentSlider.value);
    const years = Number(yearsSelect.value);

    const { financials } = state.config;
    const ufValue = financials.ufValue;
    const downpaymentCLP = downpaymentUF * ufValue;

    // Calculate maximum affordable property value
    // Using 25% of income as default load, 80% financing
    const maxMonthlyPayment = income * 0.25;
    const financingAmount = maxMonthlyPayment * 12 * years / (1 - 0.8); // Present value of annuity
    const maxPropertyValue = financingAmount + downpaymentCLP;

    const maxUF = Math.floor(maxPropertyValue / ufValue);
    const minUF = Math.max(0, maxUF - 500); // Show range

    // Calculate monthly payment for max affordable
    const monthlyPayment = calculateMonthlyPayment(maxPropertyValue - downpaymentCLP, years);

    return {
      income,
      downpaymentUF,
      downpaymentCLP,
      years,
      maxUF,
      minUF,
      monthlyPayment,
      maxPropertyValue
    };
  }

  function calculateMonthlyPayment(principal, years) {
    const monthlyRate = 0.049 / 12; // 4.9% annual
    const periods = years * 12;
    const annuityFactor = monthlyRate * Math.pow(1 + monthlyRate, periods) / (Math.pow(1 + monthlyRate, periods) - 1);
    return Math.round(principal * annuityFactor);
  }

  function displayResults(results) {
    const { maxUF, minUF, monthlyPayment } = results;

    // Update summary metrics
    const monthlyPaymentEl = document.querySelector('[data-monthly-payment]');
    const investmentRangeEl = document.querySelector('[data-investment-range]');
    const rentEstimateEl = document.querySelector('[data-rent-estimate]');

    if (monthlyPaymentEl) {
      monthlyPaymentEl.textContent = currencyFormatter.format(monthlyPayment);
    }
    if (investmentRangeEl) {
      investmentRangeEl.textContent = `UF ${ufFormatter.format(minUF)} - ${ufFormatter.format(maxUF)}`;
    }
    if (rentEstimateEl) {
      // Estimate rent as 0.15-0.25% of property value
      const minRent = Math.round((minUF * state.config.financials.ufValue) * 0.0015 / 100);
      const maxRent = Math.round((maxUF * state.config.financials.ufValue) * 0.0025 / 100);
      rentEstimateEl.textContent = `${currencyFormatter.format(minRent)} - ${currencyFormatter.format(maxRent)}`;
    }

    // Display affordable properties
    displayAffordableProperties(results);
  }

  function displayAffordableProperties(results) {
    const propertiesContainer = document.querySelector('[data-affordable-properties] .properties-grid');
    if (!propertiesContainer) return;

    propertiesContainer.innerHTML = '';

    state.config.typologies?.forEach(typology => {
      const isAffordable = typology.ufPrice <= results.maxUF;
      const isMaybeAffordable = typology.ufPrice <= results.maxUF + 200;

      if (isAffordable || isMaybeAffordable) {
        const card = document.createElement('div');
        card.className = `property-card ${isAffordable ? 'affordable' : 'maybe-affordable'}`;

        card.innerHTML = `
          <div class="property-name">${typology.name}</div>
          <div class="property-details">
            ${typology.areaM2}m² · Pie UF ${typology.downPaymentUF} (${typology.downPaymentInstallments} cuotas)
          </div>
          <div class="property-price">UF ${ufFormatter.format(typology.ufPrice)}</div>
        `;

        card.addEventListener('click', () => {
          state.selectedTypology = typology;
          highlightSelectedTypology(typology.id);
          populateTypologyInForm(typology);
          scrollToForm();
          trackEvent('select_typology_from_simulator', {
            tipologia: typology.id,
            uf: typology.ufPrice,
            m2: typology.areaM2,
          });
        });

        propertiesContainer.appendChild(card);
      }
    });
  }
};

const renderLocation = () => {
  const mapContainer = selectSlot('location-map');
  const chipsContainer = selectSlot('location-chips');
  const plusvalia = selectSlot('location-plusvalia');
  const { location } = state.config;
  if (!location) return;

  if (mapContainer && location.mapEmbed) {
    mapContainer.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.src = location.mapEmbed;
    iframe.title = `Mapa del proyecto en ${location.address}`;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    mapContainer.appendChild(iframe);
  }

  if (chipsContainer) {
    chipsContainer.innerHTML = '';
    location.chips?.forEach((chip) => {
      const node = document.createElement('span');
      node.className = 'chip';
      node.textContent = `${chip.title}: ${chip.detail}`;
      chipsContainer.appendChild(node);
    });
  }

  if (plusvalia) {
    plusvalia.textContent = location.plusvalia ?? '';
  }
};

const renderWhyNow = () => {
  const container = selectSlot('why-now');
  if (!container) return;
  container.innerHTML = '';

  state.config.whyNow?.forEach((item) => {
    const block = document.createElement('article');
    block.className = 'why-now__item';

    const title = document.createElement('h3');
    title.textContent = item.title;

    const desc = document.createElement('p');
    desc.textContent = item.description;

    block.append(title, desc);

    if (item.link) {
      const link = document.createElement('a');
      link.href = item.link;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Ver fuente';
      block.appendChild(link);
    }

    container.appendChild(block);
  });
};

const renderAccompaniment = () => {
  const container = selectSlot('accompaniment-steps');
  const badge = selectSlot('accompaniment-badge');
  if (!container) return;

  container.innerHTML = '';
  state.config.accompanimentSteps?.forEach((step, index) => {
    const node = document.createElement('article');
    node.className = 'timeline-step';

    const number = document.createElement('span');
    number.textContent = String(index + 1);

    const title = document.createElement('h3');
    title.textContent = step.title;

    const desc = document.createElement('p');
    desc.textContent = step.description;

    node.append(number, title, desc);
    container.appendChild(node);
  });

  if (badge) {
    badge.textContent = 'Te guiamos end-to-end; tú decides con números y fechas claras';
  }
};

const renderTestimonials = () => {
  const testimonialsContainer = selectSlot('testimonials-grid');
  const partnersContainer = selectSlot('partners');
  if (testimonialsContainer) {
    testimonialsContainer.innerHTML = '';
    state.config.testimonials?.forEach((testimonial) => {
      const card = document.createElement('article');
      card.className = 'testimonial-card';

      const name = document.createElement('strong');
      name.textContent = testimonial.name;

      const quote = document.createElement('p');
      quote.textContent = testimonial.quote;

      card.append(name, quote);
      testimonialsContainer.appendChild(card);
    });
  }

  if (partnersContainer) {
    partnersContainer.innerHTML = '';
    state.config.partners?.forEach((logo) => {
      const img = document.createElement('img');
      img.src = logo;
      img.alt = 'Partner Select Capital';
      img.loading = 'lazy';
      partnersContainer.appendChild(img);
    });
  }
};

const renderFAQ = () => {
  const container = selectSlot('faq-list');
  if (!container) return;

  container.innerHTML = '';
  state.config.faq?.forEach((entry, index) => {
    const details = document.createElement('details');
    details.className = 'faq-item';

    const summary = document.createElement('summary');
    summary.innerHTML = `<span>${entry.question}</span>`;
    summary.dataset.analytics = 'faq_open';
    summary.dataset.faqId = `faq-${index}`;
    summary.addEventListener('click', () => {
      trackEvent('faq_open', { pregunta_id: summary.dataset.faqId });
    });

    const answer = document.createElement('div');
    answer.className = 'faq-answer';
    answer.innerHTML = `<p>${entry.answer}</p>`;

    details.append(summary, answer);
    container.appendChild(details);
  });
};

const renderLegal = () => {
  const legalLinks = selectSlot('legal-links');
  const legalContact = selectSlot('legal-contact');
  const legalNotes = selectSlot('legal-notes');
  const footerYear = selectSlot('footer-year');
  const { legal, simulationDisclaimers } = state.config;

  if (legalLinks) {
    legalLinks.innerHTML = '';
    const link = document.createElement('a');
    link.href = legal.policiesUrl ?? '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Política de privacidad';
    legalLinks.appendChild(link);
  }

  if (legalContact) {
    const whatsappNumber = legal.whatsapp.replace(/\D/g, '');
    legalContact.innerHTML = `
      <div class="agent-card__contact-item">
        <span>📍</span>
        <span>${legal.address}</span>
      </div>
      <div class="agent-card__contact-item">
        <span>💬</span>
        <a href="https://wa.me/${whatsappNumber}" target="_blank" rel="noopener noreferrer">${legal.whatsapp}</a>
      </div>
      <div class="agent-card__contact-item">
        <span>✉️</span>
        <a href="mailto:${legal.email}">${legal.email}</a>
      </div>
    `;
  }

  // Configurar imagen del agente si existe en la configuración
  const agentImage = document.querySelector('[data-slot="agent-image"]');
  const agentName = document.querySelector('[data-slot="agent-name"]');
  const agentRole = document.querySelector('[data-slot="agent-role"]');

  if (state.config.agent) {
    if (agentImage && state.config.agent.image) {
      // Reemplazar placeholder con imagen real
      const img = document.createElement('img');
      img.src = state.config.agent.image;
      img.alt = state.config.agent.name || 'Agente Select Capital';
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '12px';
      agentImage.innerHTML = '';
      agentImage.appendChild(img);
    }
    // El placeholder ya tiene formato 4:3 en CSS

    if (agentName && state.config.agent.name) {
      agentName.textContent = state.config.agent.name;
    }
    if (agentRole && state.config.agent.role) {
      agentRole.textContent = state.config.agent.role;
    }
  }

  if (legalNotes) {
    const notes = [
      'Promociones y descuentos válidos para unidades y plazos definidos por el desarrollador.',
      'Precios en UF. Entrega estimada sujeta a modificaciones del plan de obra.',
      'La promesa requiere preaprobación bancaria vigente.',
      ...(simulationDisclaimers ?? []),
    ];
    legalNotes.innerHTML = '';
    notes.forEach((note) => {
      const li = document.createElement('li');
      li.textContent = note;
      legalNotes.appendChild(li);
    });
  }

  if (footerYear) {
    footerYear.textContent = String(new Date().getFullYear());
  }
};

const populateHiddenFields = () => {
  const {
    project: { name, commune, stage },
  } = state.config;
  const projectField = document.querySelector('input[data-slot="hidden-project"]');
  const communeField = document.querySelector('input[data-slot="hidden-commune"]');
  const stageField = document.querySelector('input[data-slot="hidden-stage"]');

  if (projectField) projectField.value = name;
  if (communeField) communeField.value = commune;
  if (stageField) stageField.value = stage;
};

const initIncomeSubtype = () => {
  const typeSelect = document.querySelector('[data-field="income-type"]');
  const subtypeWrapper = document.querySelector('[data-field="income-subtype"]');
  const subtypeSelect = document.getElementById('lead-income-subtype');
  if (!typeSelect || !subtypeWrapper || !subtypeSelect) return;

  const setOptions = (type) => {
    const options = incomeSubtypeOptions[type] ?? [];
    subtypeSelect.innerHTML = '<option value="" disabled selected>Selecciona</option>';
    options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      subtypeSelect.appendChild(option);
    });
    subtypeWrapper.hidden = options.length === 0;
    subtypeSelect.required = options.length > 0;
  };

  setOptions(typeSelect.value);

  typeSelect.addEventListener('change', () => {
    setOptions(typeSelect.value);
  });
};

const initFloatingCTA = () => {
  const floating = document.querySelector('[data-component="floating-cta"]');
  const heroSection = selectSection('hero');
  if (!floating || !heroSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        floating.classList.toggle('is-visible', !entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );
  observer.observe(heroSection);
};

const initSectionObservers = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const eventName = sectionEvents[entry.target.id];
          if (eventName) {
            trackEvent(eventName, {
              proyecto: state.config.project.slug,
              comuna: state.config.project.commune,
            });
            observer.unobserve(entry.target);
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  Object.keys(sectionEvents).forEach((id) => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
};

const initCTAListeners = () => {
  document.querySelectorAll('[data-action="scroll-form"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      trackEvent('cta_click', {
        position: btn.dataset.ctaContext ?? 'hero',
        proyecto: state.config.project.slug,
      });
      scrollToForm();
    });
  });

  const download = document.querySelector('[data-action="download-ficha"]');
  if (download) {
    download.addEventListener('click', () => {
      trackEvent('cta_click', {
        position: 'ficha_pdf',
        proyecto: state.config.project.slug,
      });
    });
  }

  const simulationCTA = document.querySelector('[data-action="open-simulation-form"]');
  if (simulationCTA) {
    simulationCTA.addEventListener('click', () => {
      if (!state.simulation) return;
      populateSimulationInForm();
      trackEvent('cta_click', {
        position: 'simulator',
        proyecto: state.config.project.slug,
      });
      scrollToForm();
    });
  }
};

const populateSimulationInForm = () => {
  if (!state.simulation) return;
  const form = document.getElementById('leadForm');
  if (!form) return;

  const dividendField = form.querySelector('input[name="simulador_dividendo"]');
  const rangeField = form.querySelector('input[name="simulador_rango_uf"]');
  const tipsField = form.querySelector('input[name="simulador_tipologias"]');

  if (dividendField) dividendField.value = Math.round(state.simulation.dividend);
  if (rangeField) {
    rangeField.value = `${Math.round(state.simulation.minUF)}-${Math.round(
      state.simulation.maxUF
    )}`;
  }
  if (tipsField) {
    tipsField.value = (state.simulation.suggestedTypologies ?? [])
      .map((t) => t.id)
      .join(',');
  }
};

const parseQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const fieldNames = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_id',
    'gclid',
    'fbclid',
    'ttclid',
  ];
  fieldNames.forEach((field) => {
    const value = params.get(field);
    if (value) {
      const input = document.querySelector(`input[name="${field}"]`);
      if (input) input.value = value;
    }
  });
};

const initLightbox = () => {
  const dialog = document.querySelector('[data-component="gallery-lightbox"]');
  const figure = selectSlot('lightbox-figure');
  const closeBtn = dialog?.querySelector('.gallery-lightbox__close');
  if (!dialog || !figure || !closeBtn) return;

  closeBtn.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog.open) dialog.close();
  });
};

const openLightbox = (index) => {
  const dialog = document.querySelector('[data-component="gallery-lightbox"]');
  const figure = selectSlot('lightbox-figure');
  if (!dialog || !figure) return;

  const item = state.config.gallery?.[index];
  if (!item) return;

  figure.innerHTML = '';
  if (item.type === 'video') {
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
    video.src = item.src;
    video.setAttribute('aria-label', item.alt ?? 'Video del proyecto');
    figure.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt ?? 'Imagen del proyecto';
    img.loading = 'lazy';
    figure.appendChild(img);
  }

  if (item.caption) {
    const caption = document.createElement('figcaption');
    caption.textContent = item.caption;
    figure.appendChild(caption);
  }

  dialog.showModal();
};

const initForm = () => {
  populateHiddenFields();
  initIncomeSubtype();
  parseQueryParams();
  initWizardForm();
};

const initWizardForm = () => {
  const form = document.getElementById('leadForm');
  if (!form) return;

  const wizard = {
    currentStep: 1,
    totalSteps: 3,
    steps: [1, 2, 3]
  };

  const updateWizardUI = () => {
    // Update step indicators
    document.querySelectorAll('[data-step]').forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.classList.toggle('active', stepNum === wizard.currentStep);
      step.classList.toggle('completed', stepNum < wizard.currentStep);
    });

    // Update step content
    document.querySelectorAll('[data-step-content]').forEach(content => {
      const stepNum = parseInt(content.dataset.stepContent);
      content.classList.toggle('active', stepNum === wizard.currentStep);
    });

    // Update progress bar
    const progressFill = document.querySelector('[data-progress-fill]');
    if (progressFill) {
      const progress = (wizard.currentStep / wizard.totalSteps) * 100;
      progressFill.style.width = `${progress}%`;
    }

    // Update navigation buttons
    const prevBtn = document.querySelector('[data-wizard-prev]');
    const nextBtn = document.querySelector('[data-wizard-next]');
    const submitBtn = document.querySelector('[data-wizard-submit]');

    if (prevBtn) {
      prevBtn.style.display = wizard.currentStep > 1 ? 'block' : 'none';
    }

    if (nextBtn) {
      nextBtn.style.display = wizard.currentStep < wizard.totalSteps ? 'block' : 'none';
    }

    if (submitBtn) {
      submitBtn.style.display = wizard.currentStep === wizard.totalSteps ? 'block' : 'none';
    }
  };

  const validateCurrentStep = () => {
    const currentContent = document.querySelector(`[data-step-content="${wizard.currentStep}"]`);
    if (!currentContent) return true;

    const requiredFields = currentContent.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    // Clear previous errors
    currentContent.querySelectorAll('.field-error').forEach(error => error.remove());
    currentContent.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

    requiredFields.forEach(field => {
      const fieldValid = validateField(field);
      if (!fieldValid.isValid) {
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;

        // Add error class and message
        field.classList.add('error');

        // Create and insert error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'field-error';
        errorMsg.textContent = fieldValid.message;
        field.parentNode.insertBefore(errorMsg, field.nextSibling);
      }
    });

    // Focus first invalid field
    if (firstInvalidField && !isValid) {
      setTimeout(() => firstInvalidField.focus(), 100);
    }

    return isValid;
  };

  const validateField = (field) => {
    const value = field.value.trim();

    // Required field check
    if (field.hasAttribute('required') && !value) {
      return {
        isValid: false,
        message: 'Este campo es obligatorio.'
      };
    }

    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return {
          isValid: false,
          message: 'Ingresa un correo electrónico válido.'
        };
      }
    }

    // Phone validation
    if (field.name === 'telefono' && value) {
      const cleanPhone = value.replace(/\s+/g, '').replace(/\+/g, '');
      const phoneRegex = /^569\d{8}$/;
      if (!phoneRegex.test(cleanPhone)) {
        return {
          isValid: false,
          message: 'Ingresa un número chileno válido (ej: +56 9 1234 5678).'
        };
      }
    }

    // Renta validation
    if (field.name === 'renta_liquida_clp' && value) {
      const numericValue = parseInt(value.replace(/\./g, ''));
      if (isNaN(numericValue) || numericValue < 300000) {
        return {
          isValid: false,
          message: 'Ingresa una renta líquida válida (mínimo $300.000).'
        };
      }
    }

    // Ahorro validation
    if (field.name === 'ahorro_uf' && value) {
      const numericValue = parseFloat(value);
      if (isNaN(numericValue) || numericValue < 0) {
        return {
          isValid: false,
          message: 'Ingresa un monto de ahorro válido.'
        };
      }
    }

    return { isValid: true };
  };

  const goToStep = (step) => {
    if (step < 1 || step > wizard.totalSteps) return;

    wizard.currentStep = step;
    updateWizardUI();

    // Scroll to form
    const formSection = document.getElementById('formulario');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    trackEvent('wizard_step_view', {
      step: wizard.currentStep,
      proyecto: state.config.project.slug,
    });
  };

  // Event listeners
  document.addEventListener('click', (e) => {
    if (e.target.matches('[data-wizard-next]')) {
      e.preventDefault();
      if (validateCurrentStep()) {
        goToStep(wizard.currentStep + 1);
      } else {
        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-error-message';
        errorMsg.textContent = 'Por favor completa todos los campos requeridos.';
        errorMsg.style.cssText = `
          color: #f87171;
          font-size: 0.9rem;
          margin-top: 1rem;
          text-align: center;
        `;

        // Remove existing error messages
        document.querySelectorAll('.form-error-message').forEach(el => el.remove());

        const currentStep = document.querySelector(`[data-step-content="${wizard.currentStep}"]`);
        if (currentStep) {
          currentStep.appendChild(errorMsg);
          setTimeout(() => errorMsg.remove(), 3000);
        }
      }
    }

    if (e.target.matches('[data-wizard-prev]')) {
      e.preventDefault();
      goToStep(wizard.currentStep - 1);
    }
  });

  // Real-time validation
  form.addEventListener('input', (e) => {
    if (e.target.classList.contains('error')) {
      if (e.target.value.trim()) {
        e.target.classList.remove('error');
      }
    }
  });

  // Initialize wizard
  updateWizardUI();

  // Enhanced form submission with error handling
  const leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = leadForm.querySelector('[data-wizard-submit]');
      if (submitBtn) {
        addLoadingState(submitBtn);
      }

      try {
        // Validate all steps before submission
        let allStepsValid = true;
        for (let step = 1; step <= wizard.totalSteps; step++) {
          wizard.currentStep = step;
          if (!validateCurrentStep()) {
            allStepsValid = false;
            goToStep(step);
            break;
          }
        }

        if (!allStepsValid) {
          removeLoadingState(submitBtn);
          return;
        }

        // Prepare form data
        const formData = new FormData(leadForm);

        // Add any additional data
        if (state.simulation) {
          formData.set('simulador_dividendo', Math.round(state.simulation.dividend));
          formData.set('simulador_rango_uf', `${Math.round(state.simulation.minUF)}-${Math.round(state.simulation.maxUF)}`);
          if (state.simulation.suggestedTypologies) {
            formData.set('simulador_tipologias', state.simulation.suggestedTypologies.map(t => t.id).join(','));
          }
        }

        // Submit form
        const response = await fetch('/submit.php', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          // Success - redirect or show success message
          trackEvent('form_submit_success', {
            proyecto: state.config.project.slug,
            step: wizard.currentStep
          });

          // Show success animation
          showSuccessAnimation(leadForm);

          // Redirect after short delay
          setTimeout(() => {
            window.location.href = result.redirect || '/gracias.html';
          }, 1500);
        } else {
          throw new Error(result.message || 'Error al enviar el formulario');
        }

      } catch (error) {
        console.error('Form submission error:', error);

        // Show error message
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-error-message';
        errorMsg.innerHTML = `
          <strong>Error al enviar el formulario</strong><br>
          ${error.message || 'Por favor intenta nuevamente en unos momentos.'}
        `;
        errorMsg.style.cssText = `
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid #f87171;
          color: #f87171;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        `;

        // Remove existing error messages
        document.querySelectorAll('.form-error-message').forEach(el => el.remove());

        const formContainer = document.querySelector('.form-shell');
        if (formContainer) {
          formContainer.appendChild(errorMsg);
          setTimeout(() => errorMsg.remove(), 5000);
        }

        trackEvent('form_submit_error', {
          error: error.message,
          proyecto: state.config.project.slug
        });

      } finally {
        removeLoadingState(submitBtn);
      }
    });
  }
};

const initPieModal = () => {
  const modal = document.querySelector('[data-component="pie-modal"]');
  const closeBtn = modal?.querySelector('.pie-modal__close');
  const openLink = document.querySelector('.pie-modal-link');

  if (!modal || !closeBtn || !openLink) return;

  openLink.addEventListener('click', (e) => {
    e.preventDefault();
    modal.showModal();
    trackEvent('open_pie_modal');
  });

  closeBtn.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.open) modal.close();
  });
};

// Utility functions for micro-interactions
const addLoadingState = (element) => {
  if (element) {
    element.classList.add('btn-loading');
    element.disabled = true;
  }
};

const removeLoadingState = (element) => {
  if (element) {
    element.classList.remove('btn-loading');
    element.disabled = false;
  }
};

const showSuccessAnimation = (element) => {
  if (element) {
    element.classList.add('form-success-animation');
    setTimeout(() => {
      element.classList.remove('form-success-animation');
    }, 600);
  }
};

// Enhanced button interactions
const enhanceButtons = () => {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
      btn.style.transform = 'scale(0.98)';
    });

    btn.addEventListener('mouseup', () => {
      btn.style.transform = '';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
};

// Progressive image loading with Intersection Observer
const initLazyLoading = () => {
  const lazyImages = document.querySelectorAll('.lazy-image');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      // Create blur placeholder
      createImagePlaceholder(img);
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without Intersection Observer
    lazyImages.forEach(img => {
      createImagePlaceholder(img);
      loadImage(img);
    });
  }
};

const createImagePlaceholder = (img) => {
  const placeholder = document.createElement('div');
  placeholder.className = 'image-placeholder skeleton';
  placeholder.setAttribute('aria-hidden', 'true');

  // Set placeholder dimensions
  const rect = img.getBoundingClientRect();
  placeholder.style.width = img.offsetWidth ? `${img.offsetWidth}px` : '100%';
  placeholder.style.height = img.offsetHeight ? `${img.offsetHeight}px` : '200px';
  placeholder.style.borderRadius = getComputedStyle(img).borderRadius || '12px';

  // Add loading text
  placeholder.innerHTML = '<span>Cargando imagen...</span>';

  // Insert placeholder before image
  if (img.parentNode) {
    img.parentNode.insertBefore(placeholder, img);
    img.style.opacity = '0';
    img.style.position = 'absolute';
    img.style.inset = '0';
  }
};

const loadImage = (img) => {
  const src = img.dataset.src;
  if (!src) return;

  // Create a new image to preload
  const preloadImg = new Image();

  preloadImg.onload = () => {
    // Image loaded successfully
    img.src = src;
    img.style.opacity = '1';
    img.style.position = 'relative';

    // Remove placeholder with fade effect
    const placeholder = img.previousElementSibling;
    if (placeholder && placeholder.classList.contains('image-placeholder')) {
      placeholder.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        placeholder.remove();
      }, 300);
    }

    // Add loaded class for additional styling
    img.classList.add('image-loaded');
  };

  preloadImg.onerror = () => {
    // Handle load error
    const placeholder = img.previousElementSibling;
    if (placeholder && placeholder.classList.contains('image-placeholder')) {
      placeholder.classList.remove('skeleton');
      placeholder.innerHTML = '<span>Error al cargar</span>';
      placeholder.style.background = 'rgba(248, 113, 113, 0.1)';
      placeholder.style.color = '#f87171';
      placeholder.style.border = '1px solid rgba(248, 113, 113, 0.3)';
    }
  };

  // Start loading
  preloadImg.src = src;
};

const initGlobalListeners = () => {
  initCTAListeners();
  initFloatingCTA();
  initSectionObservers();
  initLightbox();
  initPieModal();
};

const init = () => {
  setMetaTags();
  renderHero();
  renderHighlights();
  renderGallery();
  renderTypologies();
  bindSimulator();
  renderLocation();
  renderWhyNow();
  renderAccompaniment();
  renderTestimonials();
  renderFAQ();
  renderLegal();
  initForm();
  initGlobalListeners();
  enhanceButtons();
  initLazyLoading();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

window.SC_LANDING = {
  getState: () => ({
    simulation: state.simulation,
    selectedTypology: state.selectedTypology,
  }),
};