import { projects } from '../data/projects.js';

const grid = document.querySelector('#all-projects-grid');
const filters = document.querySelectorAll('[data-filter]');

const labels = {
  all: 'Todos', ai: 'Sistemas com IA', experience: 'Experiências', curation: 'Curadoria', interaction: 'Interatividade', lab: 'Laboratório'
};

function render(filter = 'all') {
  if (!grid) return;
  const list = filter === 'all' ? projects : projects.filter(p => p.sector === filter);
  grid.innerHTML = list.map(project => `
    <article class="project-list-card" id="${project.id}" style="--card-color:${project.color}">
      <div class="project-list-top"><span>${project.id}</span><span>${project.year}</span></div>
      <h2>${project.title}</h2>
      <p>${project.summary}</p>
      <div class="detail-tags">${(project.roles || []).map(role => `<span>${role}</span>`).join('')}</div>
      <a class="text-link" href="${project.href}">Explorar ${project.id} →</a>
    </article>`).join('');
}

filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(item => { item.classList.remove('is-current'); item.setAttribute('aria-pressed','false'); });
  button.classList.add('is-current');
  button.setAttribute('aria-pressed','true');
  render(button.dataset.filter);
}));

render();
