const tocLinks = [...document.querySelectorAll('.case-toc a[href^="#"]')];
const sections = tocLinks
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    tocLinks.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.4, 0.7] });

  sections.forEach(section => observer.observe(section));
}

// Comparadores acessíveis Antes × Depois (P04 e futuros projetos)
document.querySelectorAll('.compare').forEach(compare => {
  const range = compare.querySelector('.compare-range');
  if (!range) return;
  const update = () => compare.style.setProperty('--position', `${range.value}%`);
  range.addEventListener('input', update);
  update();
});
