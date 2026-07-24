# V2V Hub: Pre-Semester TODO

Status tracker for the Fall 2026 launch. Grouped by type. Update as items close.

## 2026-07-20 unify + redesign session (branch `redesign/unify-2026-07`, all 3 repos)

Done and pushed to `AURA-Lab-SIUE/{v2v-hub, v2v-r, v2v}`:

- [x] **Moderated AURA design system** rebuilt (`custom-styling.scss`) on the shared
  `_brand.yml` tokens. Light chalk reading surface default + AURA dark canvas toggle,
  calmer than the prior "editorial field-guide" look. Every colour pair verified
  **WCAG 2.1/2.2 AA**; visible focus, >=24px targets, non-colour cues, reduced-motion.
- [x] **Obsidian/Foam fully removed.** "Methods Vault" -> plain **Course Workspace**
  (VS Code + Markdown + Git, no wiki-link/graph PKM). Files renamed
  `methods-vault(.qmd|-setup)` -> `workspace(.qmd|-setup)`; repo `v2v-methods-vault`
  -> `v2v-workspace` in all references.
- [x] **Two new guides:** `resources/copilot-setup.qmd` (GitHub Education Copilot as a
  supervised aid) and `resources/vscode-customization.qmd` (settings/themes/keys/profiles).
- [x] **Naming/facts:** "Open Methods Hub" -> "V2V Hub"; `textbook-preview.qmd` rewritten
  to the real 14-chapter 3rd-edition structure; dead `coursepackR` pkgdown links ->
  `AURA-Lab-SIUE/v2v-r`; em dashes removed from touched pages.
- [x] **Book + package alignment:** shared AA-safe brand tokens (`muted #52525B`);
  org/link staleness fixed in the `v2v-r` README, book README, and book `_brand.yml`.
- [x] Orphaned `chapters/18-20*.qmd` (pre-migration music-dataset drafts, unlinked)
  dropped from the render.
- [x] `.gitattributes` (LF) added to all three repos; line-ending noise normalized.

## OPEN: the music -> Twitch corpus rebuild (the big remaining workstream)

The package now ships the **Twitch chat/stream corpus** (`twitch_chat_sample`,
`twitch_streams_sample`), but the following still teach the retired Spotify/Billboard/
Genius **`unified_music`** dataset. Converting is a real lab/chapter rebuild (new data,
new worked examples, new figures), not a find-replace, so it was deliberately NOT
half-converted:

- [ ] **Hub modules** `04_analyst` assignments (30-song sample, 1,792 songs) and the
  `library(coursepackR); data(unified_music)` load block.
- [ ] **Hub workbook labs** `01-codebook.qmd`, `05-describing-data.qmd` (ggplot examples
  on `workbook/data/music_data_raw.csv`) and `03-meet-r.qmd` (install command).
- [ ] **Book chapters + README** (line ~119 `unified_music` description; `data(unified_music)`).
- [ ] Vendor a Twitch sample CSV for the workbook (export from `v2v::twitch_chat_sample`).
- [ ] Module weekly-breakdown chapter numbers/titles still use the old 22-ch scheme;
  remap to the 14-ch structure.
- Twitch schema is known: chat = `id, channel, sender, message, date` (Unix ms, use
  `clean_dates()`); 50 channels, 8 anchors. Coordinate with the **MC451/501 accessibility**
  remediation (the ~68 R figures need `fig-alt` anyway).

## Other pre-launch

- [ ] Flesh out the `v2v-workspace` template repo: `README.md`, `_templates/`
  (journal + codebook), `.vscode/` recommended set (Quarto, R, GitLens), test the
  "Use this template -> clone -> install extensions" flow.
- [ ] **Rename the GitHub repo** `v2v-methods-vault` -> `v2v-workspace` (owner action;
  hub already points at the new name).
- [ ] Full `quarto render` of the hub (needs R + `v2v` installed) + deploy; same for the book.
- [ ] Optional: automated axe/pa11y a11y pass on the rendered hub for belt-and-suspenders.
- [ ] Consider deleting the 4 orphan `chapters/18-20*.qmd` files (now unrendered).
