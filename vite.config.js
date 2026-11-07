import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: true },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: resolve(__dirname, 'index.html'),
        galaxia: resolve(__dirname, 'galaxia.html'),
        projetos: resolve(__dirname, 'projetos.html'),
        trajetoria: resolve(__dirname, 'trajetoria.html'),
        sobre: resolve(__dirname, 'sobre.html'),
        contato: resolve(__dirname, 'contato.html'),
        sistemas: resolve(__dirname, 'sistemas.html'),
        laboratorio: resolve(__dirname, 'laboratorio.html'),
        caseTransposicao: resolve(__dirname, 'cases/gerador-transposicao.html'),
        casePlanoDisciplina: resolve(__dirname, 'cases/plano-disciplina.html'),
        caseNivelamento: resolve(__dirname, 'cases/nivelamento.html'),
        caseDisciplinasTecnicas: resolve(__dirname, 'cases/disciplinas-tecnicas.html'),
        caseEducarComIa: resolve(__dirname, 'cases/educar-com-ia.html')
      }
    }
  }
});
