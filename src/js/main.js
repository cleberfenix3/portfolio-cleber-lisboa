import { projects } from '../data/projects.js';

const featuredIds = ['P01','P02','P03','P04'];
const featuredRoot = document.querySelector('#featured-projects-grid');

if (featuredRoot) {
  featuredRoot.innerHTML = projects
    .filter(project => featuredIds.includes(project.id))
    .map(project => `
      <article class="project-card" style="--card-color:${project.color}">
        <div class="planet" aria-hidden="true"></div>
        <div class="project-meta">${project.year}${project.level === 'anchor' ? ' · Projeto em destaque' : ''}</div>
        <h3>${project.title}</h3>
        <p>${project.summary}</p>
        <div class="project-footer">
          <span>${project.category}</span>
          <a href="${project.href}" aria-label="Abrir projeto ${project.title}">→</a>
        </div>
      </article>
    `)
    .join('');
}

const orbitalSystem = document.querySelector('.orbital-system');
const orbitalNodes = orbitalSystem?.querySelectorAll('.orbital-node') || [];

function clearOrbitHighlight() {
  if (!orbitalSystem) return;
  orbitalSystem.querySelectorAll('.orbit-ring').forEach(ring => {
    ring.classList.remove('is-active');
    ring.style.removeProperty('--active-orbit-color');
  });
}

function highlightOrbit(node) {
  if (!orbitalSystem) return;
  clearOrbitHighlight();
  const ring = orbitalSystem.querySelector(`[data-orbit-ring="${node.dataset.orbit}"]`);
  if (!ring) return;
  ring.style.setProperty('--active-orbit-color', getComputedStyle(node).getPropertyValue('--node-color'));
  ring.classList.add('is-active');
}

orbitalNodes.forEach(node => {
  node.addEventListener('mouseenter', () => highlightOrbit(node));
  node.addEventListener('focus', () => highlightOrbit(node));
  node.addEventListener('mouseleave', () => {
    if (!node.matches(':focus-visible')) clearOrbitHighlight();
  });
  node.addEventListener('blur', clearOrbitHighlight);
});
