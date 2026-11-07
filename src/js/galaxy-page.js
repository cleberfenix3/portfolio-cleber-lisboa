import { projects } from '../data/projects.js';
import { galaxyLayout, galaxyRelations, trajectoryStages } from '../data/galaxy.js';

const NS = 'http://www.w3.org/2000/svg';
const svg = document.querySelector('#galaxy-map-full');
const panel = document.querySelector('#galaxy-detail');
const stageStatus = document.querySelector('#trajectory-status');
const progress = document.querySelector('#trajectory-progress');
const exploreBtn = document.querySelector('[data-mode="explore"]');
const trajectoryBtn = document.querySelector('[data-mode="trajectory"]');
const nextBtn = document.querySelector('#trajectory-next');
const prevBtn = document.querySelector('#trajectory-prev');
const playBtn = document.querySelector('#trajectory-play');
const resetBtn = document.querySelector('#galaxy-reset');
const zoomInBtn = document.querySelector('#zoom-in');
const zoomOutBtn = document.querySelector('#zoom-out');
const zoomResetBtn = document.querySelector('#zoom-reset');
const mobileList = document.querySelector('#galaxy-mobile-list');
const mobileMapToggle = document.querySelector('#mobile-map-toggle');

let selectedId = null;
let trajectoryIndex = -1;
let trajectoryTimer = null;
let trajectoryPlaying = false;
let zoomLevel = 1;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const baseViewBox = { x: 0, y: 0, width: galaxyLayout.viewBox.width, height: galaxyLayout.viewBox.height };

const getProject = id => projects.find(project => project.id === id);

function el(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function resolveColor(color) {
  if (!color?.startsWith('var(')) return color;
  const varName = color.slice(4, -1).trim();
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#D6B35A';
}

function relationLabel(type) {
  return ({ evolution: 'Evolução', integration: 'Integração', shared: 'Competência compartilhada' })[type] || type;
}

function curvePath(a, b, index) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.max(Math.hypot(dx, dy), 1);
  const nx = -dy / length;
  const ny = dx / length;
  const direction = index % 2 === 0 ? 1 : -1;
  const bend = Math.min(38, Math.max(12, length * 0.075)) * direction;
  const cx = (a.x + b.x) / 2 + nx * bend;
  const cy = (a.y + b.y) / 2 + ny * bend;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function renderBase() {
  if (!svg) return;
  svg.setAttribute('viewBox', `0 0 ${baseViewBox.width} ${baseViewBox.height}`);

  const defs = el('defs');
  defs.innerHTML = `
    <radialGradient id="fullCoreGradient"><stop offset="0" stop-color="#F5F6F8"/><stop offset=".18" stop-color="#E4C978"/><stop offset=".58" stop-color="#D6B35A"/><stop offset="1" stop-color="#5D4013"/></radialGradient>
    <filter id="fullGlow" x="-200%" y="-200%" width="400%" height="400%"><feGaussianBlur stdDeviation="13" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="nodeGlow" x="-120%" y="-120%" width="340%" height="340%"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <marker id="arrow-evolution" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#E981C9" opacity=".8"/></marker>
    <marker id="arrow-integration" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#4FD9E8" opacity=".8"/></marker>`;

  projects.forEach(project => {
    const color = resolveColor(project.color);
    const grad = el('radialGradient', { id: `planet-${project.id}`, cx: '.34', cy: '.27', r: '.78' });
    grad.innerHTML = `<stop offset="0" stop-color="#ffffff" stop-opacity=".82"/><stop offset=".13" stop-color="${color}" stop-opacity="1"/><stop offset=".68" stop-color="${color}" stop-opacity=".92"/><stop offset="1" stop-color="#02050a" stop-opacity=".9"/>`;
    defs.append(grad);
  });
  svg.append(defs);

  const stars = el('g', { class: 'galaxy-stars', 'aria-hidden': 'true' });
  const starPoints = [[70,90],[120,540],[183,92],[232,620],[320,80],[355,665],[530,78],[606,635],[702,90],[810,142],[875,555],[934,308],[895,82],[92,320],[950,620],[735,628],[52,440],[842,255],[562,615],[412,46],[665,50],[970,120],[40,180],[920,450],[292,56],[752,660],[108,660],[980,570]];
  starPoints.forEach(([cx,cy], i) => stars.append(el('circle', { cx, cy, r: i % 6 === 0 ? 1.8 : i % 3 === 0 ? 1.25 : .85, class: 'star' })));
  svg.append(stars);

  const regionGroup = el('g', { class: 'galaxy-regions', 'aria-hidden': 'true' });
  galaxyLayout.regions.forEach(region => {
    const label = el('text', { x: region.x, y: region.y, class: 'region-label', fill: region.color });
    label.textContent = region.label;
    const sub = el('text', { x: region.x, y: region.y + 16, class: 'region-sublabel' });
    sub.textContent = region.sublabel;
    regionGroup.append(label, sub);
  });
  svg.append(regionGroup);

  const orbitGroup = el('g', { class: 'full-orbits', 'aria-hidden': 'true' });
  [[135,95,'orbit orbit-1'],[230,165,'orbit orbit-2'],[330,235,'orbit orbit-3'],[430,300,'orbit orbit-4']].forEach(([rx,ry,cls]) => {
    orbitGroup.append(el('ellipse', { cx:500, cy:350, rx, ry, class:cls }));
  });
  svg.append(orbitGroup);

  const relationGroup = el('g', { class: 'relations', 'aria-hidden': 'true' });
  galaxyRelations.forEach((rel, index) => {
    const a = galaxyLayout.nodes[rel.from];
    const b = galaxyLayout.nodes[rel.to];
    if (!a || !b) return;
    const pathAttrs = {
      d: curvePath(a, b, index),
      class:`relation relation-${rel.type}`,
      'data-from':rel.from,
      'data-to':rel.to
    };
    if (rel.type === 'evolution') pathAttrs['marker-end'] = 'url(#arrow-evolution)';
    if (rel.type === 'integration') pathAttrs['marker-end'] = 'url(#arrow-integration)';
    relationGroup.append(el('path', pathAttrs));
  });
  svg.append(relationGroup);

  const core = el('g', { class:'full-core', tabindex:'0', role:'img', 'aria-label':'Núcleo: Design Educacional, Design Instrucional e IA aplicada à Educação' });
  core.append(el('circle', { cx:500, cy:350, r:114, class:'core-halo core-halo-outer' }));
  core.append(el('circle', { cx:500, cy:350, r:92, class:'core-halo' }));
  core.append(el('circle', { cx:500, cy:350, r:galaxyLayout.core.r, class:'core-star' }));
  const coreTitle1 = el('text', { x:500, y:342, class:'core-title' }); coreTitle1.textContent = 'DESIGN';
  const coreTitle2 = el('text', { x:500, y:364, class:'core-title' }); coreTitle2.textContent = 'EDUCACIONAL';
  const coreSub = el('text', { x:500, y:388, class:'core-small' }); coreSub.textContent = 'DESIGN INSTRUCIONAL + IA';
  core.append(coreTitle1, coreTitle2, coreSub);
  svg.append(core);

  const nodesGroup = el('g', { class:'full-nodes' });
  projects.forEach(project => {
    const pos = galaxyLayout.nodes[project.id];
    if (!pos) return;
    const group = el('g', {
      class:`galaxy-project galaxy-project-${project.level}`,
      'data-project':project.id,
      tabindex:'0',
      role:'button',
      'aria-pressed':'false',
      'aria-label':`${project.id}: ${project.title}. ${project.year}.`
    });
    const halo = el('circle', { cx:pos.x, cy:pos.y, r:pos.r + 10, class:'project-halo', fill:project.color });
    const planet = el('circle', { cx:pos.x, cy:pos.y, r:pos.r, class:'project-planet', fill:`url(#planet-${project.id})` });
    const ring = el('ellipse', { cx:pos.x, cy:pos.y, rx:pos.r * 1.36, ry:Math.max(4, pos.r * .34), class:'project-ring', transform:`rotate(-18 ${pos.x} ${pos.y})`, stroke:project.color });
    const shine = el('circle', { cx:pos.x - pos.r*.27, cy:pos.y - pos.r*.3, r:Math.max(3, pos.r*.17), class:'project-shine' });
    const idText = el('text', { x:pos.labelX, y:pos.labelY, class:'project-id', fill:project.color }); idText.textContent = project.id;
    const titleText = el('text', { x:pos.labelX, y:pos.labelY + 19, class:'project-label' });
    const splitLabels = { P04:['Disciplinas','Técnicas'], P13:['Ferramentas','Editoriais'] };
    const labelLines = splitLabels[project.id] || [project.shortTitle];
    labelLines.forEach((line, lineIndex) => {
      const tspan = el('tspan', { x:pos.labelX, dy:lineIndex === 0 ? 0 : 14 });
      tspan.textContent = line;
      titleText.append(tspan);
    });
    group.append(halo, ring, planet, shine, idText, titleText);
    nodesGroup.append(group);
  });
  svg.append(nodesGroup);
}

function renderProgress() {
  if (!progress) return;
  progress.innerHTML = trajectoryStages.map((stage, index) => `
    <button type="button" class="trajectory-dot" data-stage="${index}" aria-label="Ir para ${stage.title}" aria-pressed="false">
      <span>${index + 1}</span><small>${stage.short}</small>
    </button>`).join('');
  progress.querySelectorAll('[data-stage]').forEach(button => {
    button.addEventListener('click', () => {
      pauseTrajectory();
      showStage(Number(button.dataset.stage));
    });
  });
}

function renderMobileList() {
  if (!mobileList) return;
  mobileList.innerHTML = trajectoryStages.map((stage, stageIndex) => `
    <section class="mobile-stage" aria-labelledby="mobile-stage-${stageIndex}">
      <div class="mobile-stage-head">
        <span class="mobile-stage-number">0${stageIndex + 1}</span>
        <div><h2 id="mobile-stage-${stageIndex}">${stage.title}</h2><p>${stage.note}</p></div>
      </div>
      <div class="mobile-stage-projects">
        ${stage.projects.map(id => {
          const project = getProject(id);
          return `<button class="mobile-project-card" type="button" data-mobile-project="${id}" style="--mobile-project-color:${project.color}">
            <span class="mobile-project-id">${id}</span>
            <span class="mobile-project-title">${project.shortTitle}</span>
            <span class="mobile-project-category">${project.category}</span>
            <span class="mobile-project-arrow" aria-hidden="true">→</span>
          </button>`;
        }).join('')}
      </div>
    </section>`).join('');

  mobileList.querySelectorAll('[data-mobile-project]').forEach(button => {
    button.addEventListener('click', () => {
      selectProject(button.dataset.mobileProject, { focusPanel: true });
      panel?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });
}

function relatedRelations(id) {
  return galaxyRelations.filter(rel => rel.from === id || rel.to === id);
}

function relatedIds(id) {
  const set = new Set();
  relatedRelations(id).forEach(rel => {
    if (rel.from === id) set.add(rel.to);
    if (rel.to === id) set.add(rel.from);
  });
  return set;
}

function connectionMarkup(project) {
  const rels = relatedRelations(project.id);
  if (!rels.length) return '';
  return `<div class="detail-connections"><h3>Conexões</h3>${rels.map(rel => {
    const otherId = rel.from === project.id ? rel.to : rel.from;
    const other = getProject(otherId);
    return `<button type="button" class="connection-chip" data-related-project="${otherId}"><span>${otherId}</span><strong>${other?.shortTitle || otherId}</strong><small>${relationLabel(rel.type)}</small></button>`;
  }).join('')}</div>`;
}

function updatePanel(project) {
  if (!panel || !project) return;
  panel.style.setProperty('--project-color', project.color);
  panel.innerHTML = `
    <div class="detail-kicker">${project.id} · ${project.year}</div>
    <div class="detail-orbit">${project.category}</div>
    <h2>${project.title}</h2>
    <p>${project.summary}</p>
    <div class="detail-tags">${(project.roles || []).map(role => `<span>${role}</span>`).join('')}</div>
    ${connectionMarkup(project)}
    <div class="detail-actions">
      <a class="btn btn-primary" href="${project.href}">Explorar projeto <span aria-hidden="true">→</span></a>
      <button class="btn btn-ghost" type="button" id="detail-clear">Limpar seleção</button>
    </div>`;
  panel.querySelector('#detail-clear')?.addEventListener('click', resetGalaxy);
  panel.querySelectorAll('[data-related-project]').forEach(button => {
    button.addEventListener('click', () => selectProject(button.dataset.relatedProject));
  });
}

function setNodeStates(id, related) {
  svg?.querySelectorAll('.galaxy-project').forEach(node => {
    const nodeId = node.dataset.project;
    const active = nodeId === id;
    node.classList.toggle('is-active', active);
    node.classList.toggle('is-related', related.has(nodeId));
    node.classList.toggle('is-dimmed', !active && !related.has(nodeId));
    node.setAttribute('aria-pressed', String(active));
  });
  mobileList?.querySelectorAll('[data-mobile-project]').forEach(node => {
    const nodeId = node.dataset.mobileProject;
    node.classList.toggle('is-active', nodeId === id);
    node.classList.toggle('is-related', related.has(nodeId));
  });
}

function selectProject(id, { focusPanel = false } = {}) {
  if (!getProject(id)) return;
  stopTrajectory(false);
  setMode('explore');
  selectedId = id;
  const related = relatedIds(id);
  setNodeStates(id, related);

  svg?.querySelectorAll('.relation').forEach(line => {
    const active = line.dataset.from === id || line.dataset.to === id;
    line.classList.toggle('is-active', active);
    line.classList.toggle('is-dimmed', !active);
  });

  updatePanel(getProject(id));
  if (stageStatus) stageStatus.textContent = `${getProject(id).title} selecionado. ${related.size} conexão${related.size === 1 ? '' : 'ões'} destacada${related.size === 1 ? '' : 's'}.`;
  if (focusPanel) panel?.focus({ preventScroll:true });
}

function resetGalaxy() {
  stopTrajectory(false);
  selectedId = null;
  trajectoryIndex = -1;
  svg?.querySelectorAll('.is-active,.is-related,.is-dimmed').forEach(node => node.classList.remove('is-active','is-related','is-dimmed'));
  svg?.querySelectorAll('.galaxy-project').forEach(node => node.setAttribute('aria-pressed', 'false'));
  mobileList?.querySelectorAll('.is-active,.is-related').forEach(node => node.classList.remove('is-active','is-related'));
  progress?.querySelectorAll('.trajectory-dot').forEach(dot => dot.setAttribute('aria-pressed', 'false'));
  if (panel) {
    panel.style.removeProperty('--project-color');
    panel.innerHTML = `<div class="detail-kicker">Mapa interativo</div><div class="detail-orbit">P01–P14</div><h2>Explore a Galáxia</h2><p>Selecione um projeto para descobrir sua função, competências e relações com outros trabalhos. O mapa foi desenhado para mostrar não apenas o que foi produzido, mas como as ideias foram se conectando.</p><div class="detail-hint">Dica: no mapa espacial, use <kbd>Tab</kbd> ou as setas ← → para percorrer os projetos.</div>`;
  }
  if (stageStatus) stageStatus.textContent = 'Modo explorar ativo.';
  setMode('explore');
  updatePlayButton();
}

function setMode(mode) {
  exploreBtn?.classList.toggle('is-current', mode === 'explore');
  trajectoryBtn?.classList.toggle('is-current', mode === 'trajectory');
  exploreBtn?.setAttribute('aria-pressed', String(mode === 'explore'));
  trajectoryBtn?.setAttribute('aria-pressed', String(mode === 'trajectory'));
  document.body.dataset.galaxyMode = mode;
}

function showStage(index) {
  const stage = trajectoryStages[index];
  if (!stage || !svg) return;
  selectedId = null;
  trajectoryIndex = index;
  setMode('trajectory');
  const stageSet = new Set(stage.projects);
  svg.querySelectorAll('.galaxy-project').forEach(node => {
    node.classList.remove('is-related');
    node.classList.toggle('is-active', stageSet.has(node.dataset.project));
    node.classList.toggle('is-dimmed', !stageSet.has(node.dataset.project));
    node.setAttribute('aria-pressed', String(stageSet.has(node.dataset.project)));
  });
  svg.querySelectorAll('.relation').forEach(line => {
    const stageLine = stageSet.has(line.dataset.from) && stageSet.has(line.dataset.to);
    line.classList.toggle('is-active', stageLine);
    line.classList.toggle('is-dimmed', !stageLine);
  });
  mobileList?.querySelectorAll('[data-mobile-project]').forEach(node => {
    node.classList.toggle('is-active', stageSet.has(node.dataset.mobileProject));
    node.classList.remove('is-related');
  });
  progress?.querySelectorAll('.trajectory-dot').forEach((dot, dotIndex) => {
    dot.classList.toggle('is-current', dotIndex === index);
    dot.setAttribute('aria-pressed', String(dotIndex === index));
  });
  if (panel) {
    panel.style.setProperty('--project-color', 'var(--color-gold)');
    panel.innerHTML = `<div class="detail-kicker">Etapa ${index + 1} de ${trajectoryStages.length}</div><div class="detail-orbit">Trajetória profissional</div><h2>${stage.title}</h2><p>${stage.note}</p><div class="detail-tags">${stage.projects.map(id => `<span>${id} · ${getProject(id)?.shortTitle || ''}</span>`).join('')}</div>`;
  }
  if (stageStatus) stageStatus.textContent = `${stage.title}. ${stage.note}`;
}

function nextStage() { showStage((trajectoryIndex + 1) % trajectoryStages.length); }
function prevStage() { showStage((trajectoryIndex - 1 + trajectoryStages.length) % trajectoryStages.length); }

function updatePlayButton() {
  if (!playBtn) return;
  if (reduceMotion) {
    playBtn.textContent = 'Modo manual';
    playBtn.disabled = true;
    playBtn.title = 'A reprodução automática foi desativada porque seu sistema prefere movimento reduzido.';
    return;
  }
  playBtn.disabled = false;
  playBtn.textContent = trajectoryPlaying ? 'Pausar' : 'Reproduzir';
}

function playTrajectory() {
  if (reduceMotion) return;
  if (trajectoryIndex < 0) showStage(0);
  if (trajectoryTimer) window.clearInterval(trajectoryTimer);
  trajectoryPlaying = true;
  trajectoryTimer = window.setInterval(nextStage, 4300);
  updatePlayButton();
}

function pauseTrajectory() {
  if (trajectoryTimer) window.clearInterval(trajectoryTimer);
  trajectoryTimer = null;
  trajectoryPlaying = false;
  updatePlayButton();
}

function stopTrajectory(resetMode = true) {
  pauseTrajectory();
  if (resetMode) setMode('explore');
}

function startTrajectory() {
  stopTrajectory(false);
  showStage(trajectoryIndex < 0 ? 0 : trajectoryIndex);
  if (!reduceMotion) playTrajectory();
}

function applyZoom() {
  if (!svg) return;
  const width = baseViewBox.width / zoomLevel;
  const height = baseViewBox.height / zoomLevel;
  const x = galaxyLayout.core.x - width / 2;
  const y = galaxyLayout.core.y - height / 2;
  svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
  zoomOutBtn?.toggleAttribute('disabled', zoomLevel <= .9);
  zoomInBtn?.toggleAttribute('disabled', zoomLevel >= 1.45);
}

function zoomBy(delta) {
  zoomLevel = Math.max(.9, Math.min(1.45, Number((zoomLevel + delta).toFixed(2))));
  applyZoom();
}

function resetZoom() {
  zoomLevel = 1;
  applyZoom();
}

function toggleMobileMap() {
  const open = !document.body.classList.contains('mobile-map-open');
  document.body.classList.toggle('mobile-map-open', open);
  mobileMapToggle?.setAttribute('aria-pressed', String(open));
  if (mobileMapToggle) mobileMapToggle.textContent = open ? 'Ver lista de projetos' : 'Abrir mapa espacial';
  if (open) document.querySelector('#galaxy-canvas-wrap')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}

function focusAdjacentNode(currentNode, direction) {
  const nodes = [...svg.querySelectorAll('.galaxy-project')];
  const index = nodes.indexOf(currentNode);
  if (index < 0) return;
  const next = nodes[(index + direction + nodes.length) % nodes.length];
  next?.focus();
}

renderBase();
renderProgress();
renderMobileList();
resetGalaxy();
resetZoom();

svg?.querySelectorAll('.galaxy-project').forEach(node => {
  node.addEventListener('mouseenter', () => {
    if (document.body.dataset.galaxyMode !== 'trajectory') selectProject(node.dataset.project);
  });
  node.addEventListener('focus', () => {
    if (document.body.dataset.galaxyMode !== 'trajectory') selectProject(node.dataset.project);
  });
  node.addEventListener('click', () => selectProject(node.dataset.project));
  node.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const project = getProject(node.dataset.project);
      if (project?.href) window.location.href = project.href;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusAdjacentNode(node, 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusAdjacentNode(node, -1);
    }
  });
});

exploreBtn?.addEventListener('click', resetGalaxy);
trajectoryBtn?.addEventListener('click', () => {
  if (document.body.dataset.galaxyMode === 'trajectory') {
    resetGalaxy();
  } else startTrajectory();
});
playBtn?.addEventListener('click', () => trajectoryPlaying ? pauseTrajectory() : playTrajectory());
nextBtn?.addEventListener('click', () => { pauseTrajectory(); if (trajectoryIndex < 0) showStage(0); else nextStage(); });
prevBtn?.addEventListener('click', () => { pauseTrajectory(); if (trajectoryIndex < 0) showStage(trajectoryStages.length - 1); else prevStage(); });
resetBtn?.addEventListener('click', () => { resetGalaxy(); resetZoom(); });
zoomInBtn?.addEventListener('click', () => zoomBy(.15));
zoomOutBtn?.addEventListener('click', () => zoomBy(-.15));
zoomResetBtn?.addEventListener('click', resetZoom);
mobileMapToggle?.addEventListener('click', toggleMobileMap);
