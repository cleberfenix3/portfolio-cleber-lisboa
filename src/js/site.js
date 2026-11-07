const header = document.querySelector('.site-header');
const nav = header?.querySelector('.nav');
const navLinks = header?.querySelector('.nav-links');
const main = document.querySelector('main');

if (main && !main.id) main.id = 'main-content';
if (!document.querySelector('.skip-link') && main) {
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#main-content';
  skip.textContent = 'Pular para o conteúdo';
  document.body.prepend(skip);
}

const brand = header?.querySelector('.brand');
if (brand && !brand.hasAttribute('aria-label')) {
  brand.setAttribute('aria-label', 'Página inicial de Cleber Lisboa');
}

if (nav && navLinks && !nav.querySelector('.menu-toggle')) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'menu-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'primary-navigation');
  button.innerHTML = '<span aria-hidden="true">☰</span><span>Menu</span>';
  navLinks.id = navLinks.id || 'primary-navigation';
  nav.insertBefore(button, navLinks);

  const closeMenu = () => {
    navLinks.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.querySelector('[aria-hidden="true"]').textContent = '☰';
  };
  const openMenu = () => {
    navLinks.classList.add('is-open');
    button.setAttribute('aria-expanded', 'true');
    button.querySelector('[aria-hidden="true"]').textContent = '×';
  };

  button.addEventListener('click', () => {
    button.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      button.focus();
    }
  });
  window.matchMedia('(min-width: 1121px)').addEventListener('change', event => {
    if (event.matches) closeMenu();
  });
}
