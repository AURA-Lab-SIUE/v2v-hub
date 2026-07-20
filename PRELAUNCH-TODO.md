# V2V Hub: Pre-Semester TODO

Tracking everything that must be addressed before Fall 2026, beyond the
2026-05-26 redesign + Obsidian-to-VS-Code migration. Items are tagged, not yet
done. Grouped by type. Update as items close.

## Hyperlinks: resolved or stubbed (done 2026-05-26)

- [x] Stale book links `sim-lab-siue.github.io/vibes-to-variables` repointed to the live book `aura-lab-siue.github.io/v2v`.
- [x] `v2v-methods-vault` template repo created as a public stub (more to come): https://github.com/AURA-Lab-SIUE/v2v-methods-vault . The hero "Use this template" link now resolves.

## Content staleness (coursepackR / RStudio / dataset / chapter count)

The Obsidian sweep covered 9 files; these still carry pre-pivot content and need a
content pass (blocked on the `v2v` R package API, so do not fabricate function names):

- [ ] **`coursepackR` -> `v2v`** rename across: `modules/03_builder`, `modules/04_analyst` (+ `practice-wrangling.qmd`), `modules/05_publisher`, `workbook/03-meet-r.qmd`, `workbook/05-describing-data.qmd`, `workbook/07-publishing.qmd`, `workbook/index.qmd`, `chapters/18b-seeing-patterns-lab.qmd`, `textbook-preview.qmd`, `resources/install-r-rstudio.qmd`, `resources/install-vscode.qmd`.
- [ ] **`unified_music` dataset -> Twitch working corpus** in modules 03/04/05 and the workbook labs (the book moved to the Twitch corpus; figures/captions say "Spotify API via coursepackR").
- [ ] **Chapter numbering**: modules reference "Chapters 8-16 / 17-20 / 21-22" (old 22-chapter book). Remap to the 14-chapter structure.
- [x] **RStudio -> VS Code** removed everywhere (2026-05-26): 55 references across 7 files cleared. `install-r-rstudio.qmd` rewritten and renamed to `install-r.qmd` (old archived); `install-vscode.qmd` reframed as the course-standard R IDE; `workbook/03-meet-r.qmd` and `07-publishing.qmd` moved off `.Rproj`/RStudio panes to the VS Code open-folder + R-extension workflow; all `install-r-rstudio.qmd` links repointed. `grep -ri rstudio` over live `.qmd` returns zero.
- [ ] **`download_week()`** and `remotes::install_github("SIM-Lab-SIUE/coursepackR")` references: replace with the real `v2v` workflow once the package API is frozen.
- [ ] **`about.qmd` / `textbook-preview.qmd`**: still say "2nd edition / 22 chapters." Update to 3rd edition / 14 chapters.

## Dead or no-equivalent links

- [ ] **coursepackR doc-site links** (`sim-lab-siue.github.io/coursepackR`, 3 spots in modules + `resources/index.qmd`) and the **`bookdown.org/alex_leith/mc451`** link (`install-r-rstudio.qmd`): no live `v2v` equivalent. Either build a `v2v` package pkgdown site or repoint to the package repo, then update link text.
- [ ] **Deep chapter links** in `chapters/18a-seeing-patterns-lecture.qmd` and `chapters/19-surprise-detector.qmd` were collapsed to the book root (the 22->14 renumber broke exact-chapter mapping). Repoint to the correct new chapters once the book is final.
- [ ] Confirm the example placeholder links in `resources/github-setup.qmd` (`example.com`, `yourwebsite.com`, `linkedin.com/in/yourprofile`) are intended as template examples (they appear inside a sample profile README).

## Assets

- [ ] **`resources/Methods_Vault.zip`** is the retired Obsidian vault. No longer linked; archive or delete (currently still in the repo).
- [ ] Verify `resources/Syllabus_Contract.pdf` and `resources/annotation-example.pdf` are current for Fall 2026.

## Methods Vault template repo (flesh out the stub)

- [ ] Write `00_START_HERE.md` walkthrough.
- [ ] Add lab starter files and a codebook template under `_templates/`.
- [ ] Populate `05_Textbook/` with links to the 14 chapters.
- [ ] Test the full "Use this template -> clone -> install extensions" flow on a clean machine.

## Book dependency (separate repo: `AURA-Lab-SIUE/v2v`)

- [ ] Textbook chapters 7-14 are stubs; the Hub sidebar links to them resolve to thin pages. Confirm chapter completion before semester (tracked in the OER Courseware project).

## Deploy

- [ ] Full `quarto render` of the Hub (needs R + the `v2v` package installed, since workbook labs execute code), then commit + push. Pages changed on 2026-05-26 were rendered individually; the site has not had a full rebuild.
- [ ] Same render + deploy for the textbook repo.

## Design (done 2026-05-26, for reference)

- [x] AURA editorial theme (Fraunces + Instrument Sans + JetBrains Mono, violet/amber on chalk), dark mode, all legacy classes restyled.
- [x] Editorial hero, on-brand cards/buttons, five-phase arc map, pedagogical callout taxonomy.
- [x] Obsidian fully removed from live pages; Methods Vault redefined as a VS Code workspace.
