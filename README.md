# V2V Hub

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Quarto Website](https://img.shields.io/badge/Built_with-Quarto-blue)](https://quarto.org)

Central course website for **MC 451 Research Methods in Mass Media** and **MC 501** at Southern Illinois University Edwardsville. The Hub ties together the textbook, the R workbook, the `v2v` R package, and the course workspace into a single VS Code-first site.

## Part of From Vibes to Variables

[From Vibes to Variables (V2V)](https://aura-lab.siue.edu/v2v/) is the AURA Lab's open methods package for teaching media research at Southern Illinois University Edwardsville. Its parts are built to be used together:

- [Textbook](https://aura-lab.siue.edu/v2v/) ([source](https://github.com/AURA-Lab-SIUE/v2v)): the open textbook that carries the arc from research question to published report.
- [Course hub](https://aura-lab.siue.edu/v2v-hub/) ([source](https://github.com/AURA-Lab-SIUE/v2v-hub), this repository): the course website for MC 451 and MC 501 that sequences the textbook, the labs, and the setup guides.
- [v2v R package](https://github.com/AURA-Lab-SIUE/v2v-r): the companion package with the Twitch practice corpus and the helpers the textbook introduces chapter by chapter.
- [Course workspace](https://github.com/AURA-Lab-SIUE/v2v-workspace): the VS Code template students copy for journals, reading notes, and project work.
- [R Companion](https://github.com/AURA-Lab-SIUE/r-companion): the VS Code extension that checks each student's R setup, installs what is missing, and explains common R errors.

A sibling template, [mc427-codespace](https://github.com/AURA-Lab-SIUE/mc427-codespace), gives MC 427 Social Media Analytics the same VS Code and R toolchain in a GitHub Codespace; the R Companion serves MC 427 as well, and the v2v package is not used there.

**Instructor:** Dr. Alex P. Leith (aleith@siue.edu)

---

## The single platform: VS Code

Students in this course are first-time researchers and first-time coders. To keep the cognitive load low, everything happens in **one tool, VS Code**: writing (Markdown), analysis (R), rendering (Quarto), and version control (Git). There is no separate note-taking app and no personal-knowledge-management layer to learn. Optional [GitHub Education Copilot](resources/copilot-setup.qmd) provides supervised code completion.

---

## Site structure

| Section | Description |
|---------|-------------|
| **Home** | Course overview, quick-start cards, ecosystem map |
| **Syllabus** | MC 451 and MC 501 (Fall 2026) |
| **Phases** | Five progressive modules: Journalist, Architect, Builder, Analyst, Publisher |
| **Workbook** | 7-lab R workbook with narrated video walkthroughs (embedded) |
| **Course Workspace** | VS Code template repo: journals, project folders, Git |
| **Resources** | Software install guides, VS Code customization, Copilot, FAQ |

### The five phases

| Phase | Role | Focus | Chapters |
|-------|------|-------|----------|
| I | The Journalist | Reading journals, critical thinking, GitHub setup | 1 to 3 |
| II | The Architect | Literature, theory, the research prospectus | 4 to 6 |
| III | The Builder | Qualitative immersion, codebook, data collection | 7 to 9 |
| IV | The Analyst | Sampling, data wrangling, visualization | 10 to 12 |
| V | The Publisher | Statistical inference, the one-click report | 13 to 14 |

### R workbook (embedded)

The workbook lives inside the site at `workbook/` with a docked sidebar. Each lab opens with a narrated video walkthrough. The labs use the **`v2v`** R package and its sampled **Twitch chat/stream corpus**.

| Lab | Title |
|-----|-------|
| 1 | Building Your Quantitative Codebook |
| 2 | Data Collection: Consistency at Scale |
| 3 | Meet R |
| 4 | Data Wrangling: Import, Diagnose, Clean, Export |
| 5 | Describing Data: Tables and Visualizations |
| 6 | Inferencing Data: Testing Relationships |
| 7 | Publishing Your Research: Quarto + GitHub Pages |

---

## Building locally

### Prerequisites

- [Quarto](https://quarto.org/docs/get-started/) (v1.4 or later)
- R (>= 4.1) with the `v2v` package installed (the workbook labs execute R code):

  ```r
  # install.packages("remotes")
  remotes::install_github("AURA-Lab-SIUE/v2v-r")
  ```

### Render the site

```bash
quarto render
```

Output goes to `docs/`. Open `docs/index.html` in your browser. Use `quarto preview` for live reload.

---

## Design

The Hub uses the **moderated AURA Lab design system** (`custom-styling.scss`): the lab's violet + amber palette and Source Sans 3 / Source Serif 4 type on a warm chalk reading surface, with the AURA dark canvas as a toggle. It is a calmer variant of the lab's public identity, tuned for long reading and daily coursework, and every color pair meets **WCAG 2.1/2.2 AA**. Tokens are kept in sync with the textbook's `_brand.yml`.

---

## License

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).
