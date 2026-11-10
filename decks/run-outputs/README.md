# Run outputs for S23 and S24 (MC 451) and W12 (MC 501)

Every code slide in these two decks is followed by an output slide that shows exactly what the R
terminal in VS Code prints, or the chart the code draws. The output slides are pasted from a real
run, never typed by hand, so they can be re-checked on the day the deck is taught.

Not rendered: the site renders only `.qmd` files, and this folder holds none.

## What is here

- `build-analysis.R` rebuilds `data/twitch_analysis.RDS` exactly as the Data Wrangling worksheet
  (starters/11-wrangling-data.qmd) does, with the instructor's thirty codes from
  `examples/r-worksheets-2026-10/keydata/make-key-form.R`. It stops if the class draw ever stops
  matching those thirty ids.
- `steps/` holds one file per code slide, in deck order, typed exactly as the slide shows it.
  `zz-verify-cramers-v.R` is not on a slide: it checks the W12 example "Cramer's V of 0.15".
- `run.py` feeds the steps to one R session on standard input, so R echoes each line with its own
  `> ` and `+ ` prompts, and writes one transcript per step to `out/` and one PNG per plot step to
  `figs/` (not committed; `--fill` copies each figure into the deck's `images/run-2026-11-05/`).
- `out/` holds the transcripts from the run recorded below.

## Re-check on the day

From an empty folder (PowerShell, with R on PATH):

```
cd $env:TEMP
mkdir s23-check; cd s23-check
Rscript C:\path\to\v2v-hub\decks\run-outputs\build-analysis.R
python C:\path\to\v2v-hub\decks\run-outputs\run.py --check
```

`--check` prints `ok` for every terminal block that still matches and exits 1 if any differs.
`--fill` writes the new transcripts into both decks (then re-render and re-run web_qa).

## The run behind the current slides

- 2026-11-05, Pythia (Windows 11), R 4.5.2, v2v 0.3.9, tidyverse 2.0.0 (dplyr 1.1.4,
  ggplot2 4.0.1), effectsize 1.0.3; terminal width 72 characters.
- 35,267 rows and 16 columns in `twitch_analysis.RDS`; the thirty codes split 17 commentary,
  13 reaction.
- Every one of the 21 terminal blocks (10 in S23, 11 in W12) matched its transcript
  (`run.py --check`).

## The run behind the Week 12 additions (2026-11-09)

- Steps `20` to `28` (finishing Data Wrangling and the stability check) and `30` to `33` (S24's
  figures) were added for S23, S24, and W12. `build-week12-files.R` adds what they read: the
  workspace's top-level names, `data/coding-form.csv` with the instructor's thirty codes, and in
  `../wk12-fixtures/` the same sheet with a title line above the headers (what Numbers writes with
  **Include table names** ticked) and guide 07's example passes lined up as
  `pilot-both-passes.csv`. Lines ending in `#@@hide` copy those fixtures in and out of `data/`;
  they run but never reach a transcript.
- Pythia, R 4.5.2, v2v 0.3.9, tidyverse 2.0.0, irr 0.85. All 46 terminal blocks (12 in S23,
  14 in S24, 20 in W12) matched (`run.py --check`); the 21 blocks from 2026-11-05 reproduced byte
  for byte.
- Two Quarto Render blocks have no `step` and are not checked by `run.py`; their transcripts are
  `out/render-top-tail.txt` (the last line of `quarto render 11-wrangling-data.qmd` on a filled
  worksheet in the top folder) and `out/render-subfolder-error.txt` (the same worksheet saved in
  `03_Project`, Quarto 1.9.38).
