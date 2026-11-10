"""Run every S23 / S24 / W12 code step in one real R session and save what the R terminal prints.

Why: each code slide in S23 (MC 451) and W12 (MC 501) is followed by an output slide that must
show exactly what VS Code's R terminal prints, checked on the day it is taught. This script feeds
the step files in steps/ to R on standard input, so R echoes each typed line with its own "> " and
"+ " prompts, and writes one transcript per step to out/ plus one PNG per plot step to figs/.

Usage, from an empty workspace folder that holds data/twitch_analysis.RDS
(build it with build-analysis.R):

    python <repo>/decks/run-outputs/run.py            # run and write out/ and figs/
    python <repo>/decks/run-outputs/run.py --check    # run, then compare against the decks

--check exits 1 if any ```{.term} block in the two decks no longer matches its transcript.
The repo's _quarto.yml does not render this folder (only .qmd files render).
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
STEPS = HERE / "steps"
OUT = HERE / "out"
FIGS = HERE / "figs"
DECKS = [HERE.parent / "mc451" / "s23-describing-data.qmd", HERE.parent / "mc451" / "s24-describing-lab.qmd",
         HERE.parent / "mc501" / "w12-describing.qmd"]
WIDTH = 72  # characters; the terminal width the transcripts are printed at
HIDE = "#@@hide"


def build_stdin(steps: list[Path]) -> str:
    lines = [f"options(width = {WIDTH}, cli.unicode = TRUE)  {HIDE}"]
    for step in steps:
        lines.append(f"#@@step {step.stem}")
        plot = "-plot-" in step.stem
        if plot:
            png = (FIGS / f"{step.stem}.png").as_posix()
            lines.append(f'png("{png}", width = 1600, height = 900, res = 160)  {HIDE}')
        lines.extend(step.read_text(encoding="utf-8").rstrip("\n").split("\n"))
        if plot:
            lines.append(f"invisible(dev.off())  {HIDE}")
    lines.append("#@@step END")
    return "\n".join(lines) + "\n"


def split_transcript(text: str) -> dict[str, str]:
    blocks: dict[str, list[str]] = {}
    current = None
    for line in text.splitlines():
        # output that ends without a newline leaves the next prompt on the same line
        m = re.search(r"> #@@step (\S+)$", line)
        if m:
            tail = line[: m.start()].rstrip()
            if tail and current is not None:
                blocks[current].append(tail)
            current = m.group(1)
            blocks[current] = []
            continue
        if HIDE in line or current is None:
            continue
        blocks[current].append(line.rstrip())
    blocks.pop("END", None)
    return {k: "\n".join(v).strip("\n") for k, v in blocks.items()}


def run() -> dict[str, str]:
    OUT.mkdir(exist_ok=True)
    FIGS.mkdir(exist_ok=True)
    steps = sorted(STEPS.glob("*.R"))
    # Messages go to stderr; fold it into stdout so they sit where the terminal shows them.
    proc = subprocess.run(
        ["R", "--quiet", "--no-save", "--no-restore"],
        input=build_stdin(steps), stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
        text=True, encoding="utf-8",
    )
    if proc.returncode != 0:
        sys.exit(f"R exited {proc.returncode}\n{proc.stdout[-2000:]}")
    blocks = split_transcript(proc.stdout)
    for name, body in blocks.items():
        (OUT / f"{name}.txt").write_text(body + "\n", encoding="utf-8", newline="\n")
    return blocks


TERM_BLOCK = re.compile(r"(```\{\.term[^}]*step=\"([^\"]+)\"[^}]*\}\n)(.*?)(\n?```)", re.S)


def fill(blocks: dict[str, str]) -> None:
    """Write each transcript into the deck's matching ```{.term step=...} block."""
    for deck in DECKS:
        text = deck.read_text(encoding="utf-8")
        missing = [s for _, s, _, _ in TERM_BLOCK.findall(text) if s not in blocks]
        if missing:
            sys.exit(f"{deck.name}: no transcript for {missing}")
        new = TERM_BLOCK.sub(lambda m: m.group(1) + blocks[m.group(2)] + "\n```", text)
        deck.write_text(new, encoding="utf-8", newline="\n")
        print(f"filled {len(TERM_BLOCK.findall(new))} blocks in {deck.name}")
    for fig in FIGS.glob("*.png"):  # copy each figure next to the deck that shows it
        for deck in DECKS:
            if fig.name in deck.read_text(encoding="utf-8"):
                dest = deck.parent / "images" / "run-2026-11-05" / fig.name
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(fig.read_bytes())


def check(blocks: dict[str, str]) -> int:
    bad = 0
    pattern = re.compile(r"```\{\.term[^}]*step=\"([^\"]+)\"[^}]*\}\n(.*?)\n```", re.S)
    for deck in DECKS:
        text = deck.read_text(encoding="utf-8")
        for step, body in pattern.findall(text):
            want = blocks.get(step)
            if want is None:
                print(f"MISSING {deck.name}: step {step} has no transcript")
                bad += 1
            elif body.strip("\n") != want:
                print(f"DIFFERS {deck.name}: step {step}")
                bad += 1
            else:
                print(f"ok      {deck.name}: step {step}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--fill", action="store_true", help="write the transcripts into the decks")
    args = ap.parse_args()
    b = run()
    print(f"{len(b)} transcripts in {OUT}, figures in {FIGS}")
    if args.fill:
        fill(b)
    if args.check:
        sys.exit(check(b))
