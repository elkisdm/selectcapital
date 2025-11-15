(() => {
  const CONFIG = {
    gaKey: 'G-XXXXXXXXXX',
    metaPixel: 'YOUR_PIXEL_ID',
  };

  const GA_EVENT_MAP = {
    cta_click: { name: 'select_cta_click' },
    wizard_step: { name: 'select_wizard_step' },
    wizard_abandon: { name: 'select_wizard_abandon' },
    form_submit_intent: { name: 'select_form_intent' },
    form_submit_success: { name: 'select_form_success' },
    pdf_download: { name: 'select_pdf_download' },
  };

  const META_EVENT_MAP = {
    cta_click: 'ViewContent',
    wizard_step: 'Lead',
    wizard_abandon: 'Lead',
    form_submit_success: 'Lead',
    pdf_download: 'Lead',
  };

  const formatPayload = (detail = {}) => {
    const base = { app_name: 'select_capital' };
    return { ...base, ...detail };
  };

  const pushGA = (eventKey, detail) => {
    const gtag = window.gtag;
    const mapped = GA_EVENT_MAP[eventKey];
    if (!gtag || !CONFIG.gaKey || !mapped) return;
    gtag('event', mapped.name, formatPayload(detail));
  };

  const pushMeta = (eventKey, detail) => {
    const fbq = window.fbq;
    const mapped = META_EVENT_MAP[eventKey];
    if (!fbq || !CONFIG.metaPixel || !mapped) return;
    fbq('trackCustom', mapped, formatPayload(detail));
  };

  const trackEvent = (eventKey, detail = {}) => {
    pushGA(eventKey, detail);
    pushMeta(eventKey, detail);
    document.dispatchEvent(
      new CustomEvent('sc:track', { detail: { eventKey, payload: detail } })
    );
  };

  const handleClick = (event) => {
    const target = event.target.closest('[data-track-event]');
    if (!target) return;
    const name = target.getAttribute('data-track-event');
    if (!name) return;
    try {
      const detailAttr = target.getAttribute('data-track-detail');
      const detail = detailAttr ? JSON.parse(detailAttr) : {};
      trackEvent(name, detail);
    } catch (err) {
      console.error('track detail parse error', err);
      trackEvent(name);
    }
  };

  const bindLifecycleHooks = () => {
    const wizard = document.querySelector('[data-wizard]');
    if (wizard) {
      wizard.addEventListener('sc:wizard:step', (event) => {
        trackEvent('wizard_step', event.detail);
      });
      wizard.addEventListener('sc:wizard:abandon', (event) => {
        trackEvent('wizard_abandon', event.detail);
      });
    }

    const form = document.querySelector('[data-track-form]');
    if (form) {
      form.addEventListener('submit', () => trackEvent('form_submit_intent'));
      form.addEventListener('sc:form:success', (event) => {
        trackEvent('form_submit_success', event.detail);
      });
    }

    const pdfBtn = document.querySelector('[data-pdf-download]');
    if (pdfBtn) {
      pdfBtn.addEventListener('click', () => trackEvent('pdf_download'));
    }
  };

  function initTracking() {
    document.addEventListener('click', handleClick);
    bindLifecycleHooks();
  }

  if (document.readyState !== 'loading') {
    initTracking();
  } else {
    document.addEventListener('DOMContentLoaded', initTracking);
  }

  window.SelectTracking = {
    trackEvent,
  };
})();
