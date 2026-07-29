# -*- coding: utf-8 -*-
"""QA every lecture deck against the house rules."""
import pathlib, re

D = pathlib.Path("/Volumes/One Touch/20-research/aura-lab/v2v-hub/decks")
problems, rows = [], []

for course in ("mc451", "mc501"):
    for p in sorted((D / course).glob("*.qmd")):
        if p.name == "index.qmd":
            continue
        t = p.read_text(encoding="utf-8")
        slides = re.findall(r"(?m)^## ", t)
        n = len(slides)
        heads = [i for i, l in enumerate([l for l in t.split("\n") if l.startswith("## ")])
                 if "{.discuss}" in [l for l in t.split("\n") if l.startswith("## ")][i]]
        dpos = (heads[0] + 1) if heads else None
        issues = []
        if t.count("—"): issues.append(f"em-dash x{t.count(chr(8212))}")
        if "|>" in t: issues.append("native pipe")
        other = "MC 501" if course == "mc451" else "MC 451"
        if other in t: issues.append("cross-course ref")
        if re.search(r"undergraduate|graduate student", t, re.I): issues.append("level label")
        if len(heads) != 1: issues.append(f"discuss slides={len(heads)}")
        if dpos == n: issues.append("discussion is LAST")
        if not t.startswith("---"): issues.append("no front matter")
        if "default, ../aura-reveal.scss" not in t: issues.append("theme path")
        lo, hi = (12, 16) if course == "mc451" else (20, 24)  # DECK-STYLE.md
        if not (lo <= n <= hi): issues.append(f"slides={n} outside {lo}-{hi}")
        rows.append((p.name, n, dpos))
        if issues:
            problems.append((p.name, issues))

print(f"decks checked: {len(rows)}")
print(f"decks with issues: {len(problems)}")
for name, iss in problems:
    print(f"  {name}: {', '.join(iss)}")
if not problems:
    print("  none")
print("\nslide counts:", ", ".join(f"{n.split('-')[0]}={c}" for n, c, _ in rows))
