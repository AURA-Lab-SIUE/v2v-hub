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

Note: the `redesign/unify-2026-07` branches were merged and retired on 2026-07-31. The
work described above is on `main` in all three repos.

## CLOSED: the music to Twitch corpus rebuild (2026-07-28)

Done. The hub, the workbook, and the book all teach the Twitch corpus
(`twitch_chat_sample`, `twitch_streams_sample`). The 11 remaining hub files were
converted off the retired Spotify/Billboard/Genius `unified_music` dataset in the
2026-07-28 build-out session.

Verified 2026-07-31: a sweep of the hub source for `unified_music`, `coursepackR`,
`music_data_raw`, Spotify, Billboard, Genius, song, and lyric returns **zero hits**
outside one `.bak` file.

- [x] Hub modules `04_analyst` assignments and the `data(unified_music)` load block.
- [x] Hub workbook labs `01-codebook.qmd`, `05-describing-data.qmd`, `03-meet-r.qmd`.
- [x] Book chapters and README.
- [x] Twitch sample vendored for the workbook.
- [x] Module weekly-breakdown chapter numbers remapped to the 14-chapter structure.

## Other pre-launch

- [x] **Rename the GitHub repo** `v2v-methods-vault` -> `v2v-workspace`. Done; the repo
  resolves under the new name and the hub's links work.
- [x] **Flesh out the `v2v-workspace` template repo** (2026-07-31). It had still been
  shipping the pre-redesign Obsidian/Foam "Methods Vault": a README banner reading
  "Status: stub", Foam pinned as a recommended extension, `[[wiki-links]]` in the
  journal template, and a dead link to the renamed setup guide. Rebuilt to match what
  the hub teaches: Course Workspace README, the three extensions the hub names (Quarto,
  R, GitLens), a shared `settings.json`, a per-folder README explaining what belongs in
  each, the codebook template the hub had promised since May, and `05_Textbook/`
  removed. Repo description updated. Hub tree block re-cased to match the repo exactly.
- [x] Full `quarto render` of the hub and deploy; same for the book. Both live.
- [x] Automated a11y pass on the rendered hub. axe-core sweep 2026-07-30: 90 pages,
  0 violations, after fixing failures inherited from Quarto and RevealJS defaults.
- [x] Superseded branches retired 2026-07-31, all verified 0 ahead of `main`:
  `v2v/redesign/unify-2026-07`, `v2v/a11y/2026-07`, `v2v-r/a11y/2026-07`,
  `v2v-hub/redesign/unify-2026-07`.

## Still open

- [ ] Consider deleting the 4 orphan `chapters/18-20*.qmd` files (now unrendered).
- [ ] Orphaned artifacts in `resources/`: `Methods_Vault.zip` and `05_Textbook.zip` are
  no longer linked from any page. Delete, or keep deliberately.
- [ ] Two branches carry **unmerged** commits and need a decision rather than a delete:
  `v2v-r/fix/install-refs` (1 commit, repoints install and badge refs to the canonical
  `aura-lab-siue/v2v-r`) and `v2v-hub/fall-2026-reconciliation` (2 commits from
  2026-07-06, now 32 behind `main` and almost certainly superseded by the unify
  redesign).
- [ ] **Naming trap, worth fixing or at least documenting.** The local directory names
  on m4 are inverted against the GitHub repo names: local `v2v` is GitHub `v2v-r` (the
  package), and local `v2v-book` is GitHub `v2v` (the book). Anyone reasoning from one
  set of names to the other will edit the wrong repo.
- [ ] Owner review of the **White Paper rubric** and the **syllabus contract terms**.
  Both were derived rather than authored, both now ship inside the Blackboard shells,
  and students are held to them.
