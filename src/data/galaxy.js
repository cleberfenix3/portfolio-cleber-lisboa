export const galaxyLayout = {
  viewBox: { width: 1000, height: 700 },
  core: { x: 500, y: 350, r: 62 },
  regions: [
    { id: 'architecture', label: 'ARQUITETURA', sublabel: '2026', x: 824, y: 92, color: 'var(--color-ai)' },
    { id: 'systems', label: 'SISTEMATIZAÇÃO', sublabel: '2026', x: 722, y: 610, color: 'var(--color-interaction)' },
    { id: 'experience', label: 'EXPERIÊNCIAS', sublabel: '2025–2026', x: 835, y: 566, color: 'var(--color-experience)' },
    { id: 'lab', label: 'EXPERIMENTAÇÃO', sublabel: '2024–2025', x: 84, y: 560, color: 'var(--color-lab)' }
  ],
  nodes: {
    P01: { x: 610, y: 185, r: 40, labelX: 657, labelY: 171 },
    P02: { x: 735, y: 238, r: 34, labelX: 778, labelY: 224 },
    P03: { x: 812, y: 352, r: 31, labelX: 850, labelY: 340 },
    P04: { x: 738, y: 477, r: 30, labelX: 778, labelY: 465 },
    P05: { x: 620, y: 550, r: 23, labelX: 652, labelY: 542 },
    P06: { x: 500, y: 584, r: 22, labelX: 531, labelY: 589 },
    P07: { x: 375, y: 548, r: 22, labelX: 405, labelY: 554 },
    P08: { x: 272, y: 466, r: 18, labelX: 188, labelY: 496 },
    P09: { x: 202, y: 366, r: 18, labelX: 105, labelY: 360 },
    P10: { x: 242, y: 258, r: 17, labelX: 142, labelY: 247 },
    P11: { x: 334, y: 166, r: 18, labelX: 244, labelY: 139 },
    P12: { x: 454, y: 116, r: 18, labelX: 400, labelY: 82 },
    P13: { x: 150, y: 176, r: 18, labelX: 60, labelY: 150 },
    P14: { x: 870, y: 500, r: 27, labelX: 902, labelY: 488 }
  }
};

export const galaxyRelations = [
  { from: 'P08', to: 'P09', type: 'evolution' },
  { from: 'P08', to: 'P05', type: 'evolution' },
  { from: 'P09', to: 'P02', type: 'evolution' },
  { from: 'P10', to: 'P13', type: 'evolution' },
  { from: 'P11', to: 'P02', type: 'integration' },
  { from: 'P11', to: 'P04', type: 'integration' },
  { from: 'P11', to: 'P05', type: 'integration' },
  { from: 'P12', to: 'P03', type: 'integration' },
  { from: 'P12', to: 'P07', type: 'integration' },
  { from: 'P13', to: 'P01', type: 'evolution' },
  { from: 'P13', to: 'P02', type: 'evolution' },
  { from: 'P05', to: 'P01', type: 'integration' },
  { from: 'P06', to: 'P01', type: 'integration' },
  { from: 'P07', to: 'P01', type: 'integration' },
  { from: 'P03', to: 'P07', type: 'shared' },
  { from: 'P01', to: 'P02', type: 'shared' },
  { from: 'P05', to: 'P14', type: 'integration' },
  { from: 'P06', to: 'P14', type: 'integration' }
];

export const trajectoryStages = [
  {
    title: '2024–2025 — Experimentação',
    short: 'Experimentação',
    note: 'A experimentação começou com geração de imagens e infográficos e evoluiu para prompts especializados aplicados ao cotidiano educacional.',
    projects: ['P08', 'P09', 'P10']
  },
  {
    title: '2025–2026 — Especialização',
    short: 'Especialização',
    note: 'Pesquisa, avaliação e rotinas editoriais começaram a ganhar regras próprias.',
    projects: ['P11', 'P12', 'P13']
  },
  {
    title: '2026 — Sistematização',
    short: 'Sistematização',
    note: 'Os prompts deixaram de executar tarefas isoladas e passaram a formar sistemas especializados.',
    projects: ['P05', 'P06', 'P07']
  },
  {
    title: 'Experiências e transformação',
    short: 'Experiências',
    note: 'O Design Educacional passou a integrar narrativa, gamificação, pesquisa, curadoria e reconstrução de materiais.',
    projects: ['P03', 'P04', 'P14']
  },
  {
    title: '2026 — Arquitetura',
    short: 'Arquitetura',
    note: 'Surgem os sistemas mais maduros: planejamento curricular e transposição educacional com IA.',
    projects: ['P02', 'P01']
  }
];
