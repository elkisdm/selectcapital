// Select Capital Home - JavaScript

// Turnstile callback
window.onTurnstileSuccess = function(token) {
  const tokenInput = document.getElementById('ts-token');
  const submitBtn = document.getElementById('form-submit-btn');
  if (tokenInput) {
    tokenInput.value = token;
  }
  if (submitBtn) {
    submitBtn.disabled = false;
  }
};

// Update theme icon based on current theme
document.addEventListener('DOMContentLoaded', () => {
  const footerLogoLight = document.querySelector('.footer-logo-light');
  const footerLogoDark = document.querySelector('.footer-logo-dark');
  
  const updateTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    // Update footer logo visibility
    if (footerLogoLight && footerLogoDark) {
      if (currentTheme === 'dark') {
        footerLogoLight.style.display = 'none';
        footerLogoDark.style.display = 'block';
      } else {
        footerLogoLight.style.display = 'block';
        footerLogoDark.style.display = 'none';
      }
    }
  };
  
  // Initial update
  updateTheme();
  
  // Watch for theme changes
  const observer = new MutationObserver(() => {
    updateTheme();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Smooth scroll to form
  const scrollFormBtn = document.querySelector('[data-action="scroll-form"]');
  const heroBtn = document.getElementById('btn-ver-proceso');
  
  const scrollToForm = (e) => {
    if (e) e.preventDefault();
    const formSection = document.getElementById('contacto');
    if (formSection) {
      formSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
  
  if (scrollFormBtn) {
    scrollFormBtn.addEventListener('click', scrollToForm);
  }
  
  // Scroll to proceso section
  if (heroBtn) {
    heroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const procesoSection = document.getElementById('proceso');
      if (procesoSection) {
        procesoSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    });
  }

  // ============================================
  // FORM FIELD HELPERS
  // ============================================
  
  // Format phone: +56 9 xxxx xxxx (on blur)
  function formatPhone(value) {
    if (!value) return '';
    let clean = value.replace(/\D/g, '');
    if (clean.startsWith('56')) clean = clean.slice(2);
    if (clean.startsWith('0')) clean = clean.slice(1);
    if (clean.length < 9) return value;
    clean = clean.slice(-9);
    return `+56 ${clean.slice(0,1)} ${clean.slice(1,5)} ${clean.slice(5,9)}`;
  }
  
  // Capitalize name
  function formatName(value) {
    if (!value) return '';
    const lower = ['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e'];
    return value.trim().split(/\s+/).map((w, i) => {
      if (i > 0 && lower.includes(w.toLowerCase())) return w.toLowerCase();
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
  }
  
  // ============================================
  // APPLY FIELD FORMATTING
  // ============================================
  
  const form = document.querySelector('.form');
  if (form) {
    // Phone formatting
    const phoneInput = form.querySelector('#telefono');
    if (phoneInput) {
      phoneInput.addEventListener('blur', (e) => {
        e.target.value = formatPhone(e.target.value);
      });
    }
    
    // Email normalization
    const emailInput = form.querySelector('#correo');
    if (emailInput) {
      emailInput.addEventListener('blur', (e) => {
        e.target.value = e.target.value.trim().toLowerCase();
      });
    }
    
    // Name capitalization
    const nameInput = form.querySelector('#nombre');
    if (nameInput) {
      nameInput.addEventListener('blur', (e) => {
        e.target.value = formatName(e.target.value);
      });
    }
  }
  
  // ============================================
  // FORM SUBMISSION
  // ============================================
  const submitBtn = document.getElementById('form-submit-btn');
  
  if (form && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const tokenInput = document.getElementById('ts-token');
      if (!tokenInput || !tokenInput.value) {
        showFormMessage('Por favor, completa la verificación de seguridad antes de enviar.', 'error');
        return false;
      }

      // Format fields
      const telefonoInput = form.querySelector('#telefono');
      const correoInput = form.querySelector('#correo');
      const nombreInput = form.querySelector('#nombre');
      
      if (telefonoInput) {
        const formattedPhone = formatPhone(telefonoInput.value);
        telefonoInput.value = formattedPhone;
        
        if (!/^\+56\s9\s\d{4}\s\d{4}$/.test(formattedPhone)) {
          showFormMessage('Por favor, ingresa un número de WhatsApp válido (9 dígitos).', 'error');
          telefonoInput.focus();
          return false;
        }
      }
      
      if (correoInput) correoInput.value = correoInput.value.trim().toLowerCase();
      if (nombreInput) nombreInput.value = formatName(nombreInput.value);

      // Disable button and show loading
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span class="btn-primary-icon">⏳</span><span>Enviando...</span>';
      submitBtn.style.opacity = '0.7';
      submitBtn.style.cursor = 'not-allowed';

      removeFormMessages();

      // Generar event_id único para deduplicación entre Pixel y Conversions API
      const generateEventId = () => {
        const seed = [
          Date.now(),
          form.querySelector('#correo')?.value || '',
          form.querySelector('#telefono')?.value || '',
          form.querySelector('#nombre')?.value || '',
          Math.random().toString(36),
        ];
        // Hash simple usando btoa y slice (compatible con navegadores)
        const str = seed.join('|');
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36) + Date.now().toString(36);
      };
      
      const eventId = generateEventId();

      try {
        
        const formData = new FormData();
        
        // Enviar event_id al backend para deduplicación
        formData.append('meta_event_id', eventId);
        
        // Contact info
        formData.append('nombre', form.querySelector('#nombre')?.value || '');
        formData.append('email', form.querySelector('#correo')?.value || '');
        formData.append('whatsapp', form.querySelector('#telefono')?.value || '');
        
        // Financial qualification
        formData.append('renta_rango', form.querySelector('#renta')?.value || '');
        formData.append('complemento_renta', form.querySelector('#complemento')?.value || '');
        formData.append('situacion_financiera', form.querySelector('#situacion')?.value || '');
        formData.append('capacidad_ahorro', form.querySelector('#ahorro')?.value || '');
        
        // Contact preference
        formData.append('canal_preferido', form.querySelector('#contacto')?.value || 'whatsapp');
        
        // Fixed values
        formData.append('proyecto', 'Asesoría Integral');
        formData.append('objetivo', 'asesoria');
        
        // Consent
        const terminos = form.querySelector('#terminos')?.checked;
        formData.append('consentimiento_privacidad', terminos ? 'si' : 'no');
        formData.append('consentimiento_contacto', terminos ? 'si' : 'no');
        
        // Add Turnstile token
        formData.append('cf-turnstile-response', tokenInput.value);
        
        // Honeypot field (empty)
        formData.append('honey', '');
        
        // Add UTM parameters from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        formData.append('utm_source', urlParams.get('utm_source') || '');
        formData.append('utm_medium', urlParams.get('utm_medium') || '');
        formData.append('utm_campaign', urlParams.get('utm_campaign') || '');
        formData.append('gclid', urlParams.get('gclid') || '');
        formData.append('fbclid', urlParams.get('fbclid') || '');
        formData.append('ttclid', urlParams.get('ttclid') || '');
        
        // Submit form
        const response = await fetch('/submit.php', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (result.ok) {
          // Success - show message or redirect
          showFormMessage('¡Gracias! Te contactaremos en menos de 24 horas.', 'success');
          
          // Track conversion events con event_id para deduplicación
          if (window.fbq) {
            fbq('track', 'Lead', {
              content_name: 'Asesoría Integral',
              content_category: 'Formulario Contacto',
              eventID: eventId // Importante: mismo event_id que se envía al servidor
            });
          }
          if (window.SelectTracking) {
            window.SelectTracking.trackEvent('form_submit_success', { source: 'home' });
          }
          
          form.reset();
          submitBtn.disabled = true;
          const tsInput = document.getElementById('ts-token');
          if (tsInput) tsInput.value = '';
        } else {
          throw new Error(result.message || 'Error al enviar el formulario');
        }
      } catch (error) {
        // Log error in development only
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('dev.')) {
          console.error('Form submission error:', error);
        }
        showFormMessage(
          error.message || 'Hubo un problema al enviar tu solicitud. Por favor intenta nuevamente.',
          'error'
        );
      } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    });
  }

  // Helper functions for form messages
  function showFormMessage(message, type) {
    removeFormMessages();
    
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.innerHTML = `
      <strong>${type === 'success' ? '✓' : '⚠'}</strong>
      <span>${message}</span>
    `;
    messageEl.style.cssText = `
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 14px 18px;
      border-radius: 12px;
      margin: 16px 0;
      font-size: 14px;
      line-height: 1.5;
      ${type === 'success' 
        ? 'background: rgba(34, 197, 94, 0.1); border: 1.5px solid rgba(34, 197, 94, 0.3); color: #16a34a;' 
        : 'background: rgba(248, 113, 113, 0.1); border: 1.5px solid rgba(248, 113, 113, 0.3); color: #dc2626;'
      }
    `;
    
    const formFooter = document.querySelector('.form-footer');
    if (formFooter) {
      formFooter.insertBefore(messageEl, formFooter.firstChild);
    }
  }

  function removeFormMessages() {
    document.querySelectorAll('.form-message').forEach(el => el.remove());
  }
});

// Auto-detect system theme
const setThemeFromSystem = () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = prefersDark ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', theme);
};

// Set initial theme
setThemeFromSystem();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemeFromSystem);

// Smooth scroll for sticky nav links
document.querySelectorAll('.sticky-nav-links a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
});

// Throttle helper para optimizar eventos de scroll
const throttle = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Active section indicator in navigation (throttled)
const updateActiveNavLink = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.sticky-nav-links a');
  const scrollPosition = window.pageYOffset + 150; // Offset for sticky nav
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
  
  // If at top of page, remove all active states
  if (window.pageYOffset < 100) {
    navLinks.forEach(link => link.classList.remove('active'));
  }
};

window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
updateActiveNavLink(); // Initial update

// Scroll Progress Indicator (throttled)
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
  const updateScrollProgress = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    scrollProgress.style.width = `${Math.min(scrollPercentage, 100)}%`;
  };
  
  window.addEventListener('scroll', throttle(updateScrollProgress, 16)); // ~60fps
  updateScrollProgress(); // Initial update
}

// Floating CTA (Mobile Only) - Lazy initialization
const initFloatingCTA = () => {
  const floatingCTA = document.getElementById('floating-cta');
  if (!floatingCTA) return;
  
  const formSection = document.getElementById('contacto');
  
  const updateFloatingCTA = () => {
    if (window.innerWidth > 640) {
      floatingCTA.classList.add('hidden');
      return;
    }
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    
    // Show CTA after scrolling 300px
    if (scrollTop < 300) {
      floatingCTA.classList.add('hidden');
      return;
    }
    
    // Hide CTA when form section is visible
    if (formSection) {
      const formRect = formSection.getBoundingClientRect();
      const formVisible = formRect.top < windowHeight && formRect.bottom > 0;
      
      if (formVisible) {
        floatingCTA.classList.add('hidden');
      } else {
        floatingCTA.classList.remove('hidden');
      }
    } else {
      floatingCTA.classList.remove('hidden');
    }
  };
  
  // Smooth scroll for floating CTA
  floatingCTA.querySelector('a')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (formSection) {
      const offsetTop = formSection.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  });
  
  window.addEventListener('scroll', throttle(updateFloatingCTA, 100));
  window.addEventListener('resize', throttle(updateFloatingCTA, 200));
  updateFloatingCTA(); // Initial update
};

// Lazy init floating CTA after initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initFloatingCTA, 500);
  });
} else {
  setTimeout(initFloatingCTA, 500);
}

