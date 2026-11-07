import { profile, timeline } from '../data/profile.js';

const accentMap = {
  ai: 'var(--color-ai)',
  experience: 'var(--color-experience)',
  curation: 'var(--color-curation)',
  interaction: 'var(--color-interaction)',
  lab: 'var(--color-lab)',
  gold: 'var(--color-gold)'
};

function renderTimeline() {
  const root = document.querySelector('[data-timeline]');
  if (!root) return;

  root.innerHTML = timeline.map((item, index) => `
    <article class="timeline-item" style="--timeline-color:${accentMap[item.accent] || accentMap.gold}">
      <div class="timeline-marker" aria-hidden="true"><span>${String(index + 1).padStart(2, '0')}</span></div>
      <div class="timeline-card">
        <div class="timeline-meta"><span>${item.period}</span><span>${item.phase}</span></div>
        <h2>${item.title}</h2>
        <p>${item.text}</p>
      </div>
    </article>
  `).join('');
}

function renderEducation() {
  const root = document.querySelector('[data-education]');
  if (!root) return;

  root.innerHTML = profile.education.map(item => `
    <article class="education-card">
      <div class="education-year">${item.year}</div>
      <div class="education-type">${item.type}</div>
      <h3>${item.title}</h3>
      <p>${item.institution}</p>
    </article>
  `).join('');
}


function renderContinuingEducation() {
  const root = document.querySelector('[data-continuing-education]');
  if (!root) return;

  root.innerHTML = profile.continuingEducation.map(item => `
    <article class="learning-card">
      <div class="learning-topline">
        ${item.year ? `<span class="learning-year">${item.year}</span>` : '<span class="learning-year">FORMAÇÃO</span>'}
        ${item.meta ? `<span class="learning-hours">${item.meta}</span>` : ''}
      </div>
      <h3>${item.title}</h3>
      <p class="learning-institution">${item.institution}</p>
      <div class="learning-tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
    </article>
  `).join('');
}

function renderComplementaryTraining() {
  const root = document.querySelector('[data-complementary-training]');
  if (!root) return;

  root.innerHTML = profile.complementaryTraining.map(item => `
    <div class="training-row">
      <span class="training-year">${item.year}</span>
      <strong>${item.title}</strong>
      <span>${item.institution}</span>
      <small>${item.meta}</small>
    </div>
  `).join('');
}

function renderPrinciples() {
  const root = document.querySelector('[data-principles]');
  if (!root) return;

  root.innerHTML = profile.principles.map(item => `
    <article class="principle-card">
      <span class="principle-number">${item.number}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderCompetencies() {
  const root = document.querySelector('[data-competencies]');
  if (!root) return;
  root.innerHTML = profile.competencies.map(item => `<span class="competency-chip">${item}</span>`).join('');
}

function renderAboutCopy() {
  const root = document.querySelector('[data-about-copy]');
  if (!root) return;
  root.innerHTML = profile.about.map(p => `<p>${p}</p>`).join('');
}

function renderContact() {
  const emailLinks = document.querySelectorAll('[data-email-link]');
  emailLinks.forEach(link => {
    link.href = `mailto:${profile.email}`;
    const target = link.querySelector('[data-email-value]');
    if (target) target.textContent = profile.email;
  });

  document.querySelectorAll('[data-location]').forEach(el => {
    el.textContent = profile.locationLabel;
  });
}

renderTimeline();
renderEducation();
renderContinuingEducation();
renderComplementaryTraining();
renderPrinciples();
renderCompetencies();
renderAboutCopy();
renderContact();
