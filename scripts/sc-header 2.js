document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.sc-appbar');
  if (!header) return;

  const mobileToggle = header.querySelector('[data-menu-toggle]');
  const mobilePanel = header.querySelector('.sc-mobile-panel');
  const microToggle = header.querySelector('[data-micro-toggle]');
  const navLinks = header.querySelectorAll('a[href^="#"], .sc-mobile-panel nav a');

  let lastIsCompact;

  const setHeaderState = () => {
    const compact = window.scrollY > 80;
    header.dataset.state = compact ? 'compact' : 'default';
    if (compact !== lastIsCompact) {
      header.dataset.micro = compact ? 'closed' : 'open';
      lastIsCompact = compact;
    }
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  const toggleMenu = (force) => {
    const isOpen = header.dataset.menu === 'open';
    const nextState = typeof force === 'boolean' ? force : !isOpen;
    header.dataset.menu = nextState ? 'open' : 'closed';
    document.documentElement.classList.toggle('sc-nav-open', nextState);
    document.body.classList.toggle('sc-nav-open', nextState);
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', String(nextState));
    }
    if (!nextState) {
      mobileToggle?.focus({ preventScroll: true });
    }
  };

  mobileToggle?.addEventListener('click', () => toggleMenu());

  mobilePanel?.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('click', () => toggleMenu(false));
  });

  document.addEventListener('keyup', (event) => {
    if (event.key === 'Escape') toggleMenu(false);
  });

  microToggle?.addEventListener('click', () => {
    const isOpen = header.dataset.micro === 'open';
    header.dataset.micro = isOpen ? 'closed' : 'open';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });
});
