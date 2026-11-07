# Portfólio — Cleber Lisboa

Portfólio profissional em **Design Educacional, Design Instrucional, Curadoria de Conteúdos e IA aplicada à Educação**.

## Versão atual

**V1.14 — versão final de design**

- Home com sistema orbital interativo;
- Galáxia Profissional P01–P14;
- Projetos, Sistemas Especializados e Laboratório;
- páginas Trajetória, Sobre e Contato;
- fotografia profissional na página Sobre;
- navegação responsiva desktop/mobile;
- suporte a teclado e `prefers-reduced-motion`;
- terminologia pública com **Validação Acadêmica**;
- LinkedIn apresentado como `Perfil no LinkedIn ↗`.

## Desenvolvimento

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

O Vite gera a versão final em `dist/`.

## Publicação planejada

- **GitHub** — código, versionamento e histórico;
- **Firebase Hosting** — produção;
- **Domínio próprio** — endereço definitivo;
- **Netlify** — previews/testes quando necessário.

O arquivo `firebase.json` está configurado para publicar `dist/`.

## Privacidade e propriedade intelectual

O portfólio público evita dados pessoais desnecessários e materiais institucionais protegidos.

---

# Portfólio Cleber Lisboa — V1

Portfólio profissional em **Design Educacional, Design Instrucional e IA aplicada à Educação**, com identidade visual **Cosmos Editorial**.

## Estado da V1

- Home responsiva com quatro projetos em destaque.
- Galáxia Profissional P01–P14 com relações, seleção, zoom e modo trajetória.
- Projetos detalhados P01–P04.
- Sistemas especializados P05–P07.
- Laboratório de IA e constelações P08–P13.
- Páginas Trajetória, Sobre, Projetos e Contato.
- Navegação móvel, foco por teclado, link “Pular para o conteúdo” e suporte a `prefers-reduced-motion`.
- Metadados SEO básicos, Open Graph textual, favicon e `robots.txt`.

## Identidade

- Fundo: `#090D16`
- Branco: `#F5F6F8`
- Dourado: `#D6B35A`
- Nome: Sora 700
- Títulos: Manrope
- Corpo/interface: Inter

## Desenvolvimento

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

### Prévia sem instalar dependências

Como o projeto usa módulos ES nativos, também é possível conferir a V1 diretamente com um servidor local simples:

```bash
python -m http.server 4173
```

Depois abra `http://localhost:4173/`.

## Publicação

A V1 é estática e pode ser publicada em Vercel, Netlify ou GitHub Pages. Para a primeira publicação, Vercel ou Netlify evitam ajustes extras de caminho.

Depois de escolher a URL/domínio final, complete os metadados que dependem do endereço público: `canonical`, `og:url`, `og:image` absoluta e `sitemap.xml`.

Consulte também `DEPLOY.md`.

## Privacidade

O site público não inclui endereço residencial, telefone, data de nascimento, estado civil ou outros dados pessoais desnecessários.


## V1.1 — Refinamento visual e de conteúdo

A V1.1 consolida a revisão feita após testes da versão publicada:
- hierarquia tipográfica refinada em Home, Galáxia, Projetos, Trajetória, Sobre e Contato;
- núcleo da Galáxia com texto branco e contorno escuro de alto contraste sobre o Sol dourado;
- início da fase de experimentação com IA atualizado para 2024–2025;
- elementos visuais autorais baseados no núcleo da Galáxia na Home e na Trajetória;
- nova seção Formação Contínua na página Sobre;
- e-mail profissional atualizado para cleber.curadoria@gmail.com;
- ajustes responsivos específicos para títulos em telas menores.

Próxima etapa editorial: seleção de evidências públicas dos projetos (prompts, imagens, fluxos e exemplos de saída), preservando materiais institucionais e proprietários.

## V1.3 — evidências P01
- Removida a montagem estática de visão geral da seção de evidências do P01.
- Cinco evidências autorais agora usam comparadores interativos Antes × Depois.
- Comparadores padronizados para Antes à esquerda e Depois à direita, inclusive no P04.

## V1.4 — P02 Gerador de Plano da Disciplina
- Hero do P02 atualizado com captura real do gerador.
- Nomenclatura pública consolidada como “Gerador de Plano da Disciplina”.
- Diagrama orbital movido para 03 · Arquitetura do sistema e núcleo P02/PLANO em branco.
- Hierarquia tipográfica do P02 alinhada ao P01, com títulos menores e marcadores de seção mais visíveis.
- 08 · Evidências atualizado com Plano da Disciplina demonstrativo autoral sobre clima urbano, ilhas de calor e cidades resilientes.
- Captura do gerador tratada para não exibir nomenclaturas institucionais internas.


## V1.5 — P03 Cursos de Nivelamento
- Hierarquia tipográfica do P03 alinhada aos projetos anteriores, com título de Hero menor e marcadores de seção mais visíveis.
- Infográfico do Hero com textos internos em branco e maior legibilidade.
- Frames de vídeos e screenshots de games institucionais removidos do pacote público.
- Interpretação de Texto passa a usar três ilustrações autorais para os níveis básico, intermediário e avançado.
- Raciocínio Lógico passa a usar quatro visualizações conceituais autorais, uma para cada investigação.
- Gamificação demonstrada por dois fluxos autorais e cartões de mecânica: narrativa, progressão, feedback, desafio e retomada conceitual.
- Seção de evidências reformulada para mostrar decisões de Design Educacional sem reproduzir interfaces ou assets institucionais.
- P02: “TEMA 03” substituído por “ESTRUTURA DE UM TEMA”.

## V1.7 — P04 autoral
- P04: substituídos os comparadores institucionais por três demonstrações autorais próprias do portfólio.
- Novos comparadores: contextualização profissional, reorganização pedagógica e aprimoramento técnico-editorial.
- Removidos fisicamente do pacote público os screenshots antigos de Anatomia Sistêmica, Higiene Ocupacional e Urgência e Emergência.
- Mantido o componente Antes × Depois com controle deslizante e aviso explícito de demonstração autoral.
