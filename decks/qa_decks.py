# -*- coding: utf-8 -*-
"""QA every lecture deck against the house rules.

UNIVERSAL as of 2026-08-12. Was mc451/mc501-only and RevealJS-only; now driven by the
PROFILES table below so a new course is a config entry, never a second checker.

Two deck FORMATS, because the courses genuinely differ:
  qmd  - RevealJS decks under the v2v hub (mc451, mc501). Checks unchanged from the
         2026-07-30 version; a clean run stays clean.
  marp - Marp .md decks for the Leith-HP live-teaching stack (fst101). Different
         artifact, different failure modes: presenter notes, HTML comment nesting,
         image licence/alt, leftover placeholders.

Adding a course: add a PROFILES entry. Adding a rule that only one course wants: put it
behind a profile flag rather than an `if course ==` branch in the body.

Structural checks are stdlib-only so this runs on m4's /usr/bin/python3.
`--render` additionally rasterises decks and measures CONTRAST OFF RENDERED PIXELS,
which is the house rule (declared hex is not evidence). That path needs marp-cli and
Pillow, so it is opt-in and normally run from Pythia.

  python3 qa_decks.py                 # every profile that resolves on this host
  python3 qa_decks.py --course fst101
  python3 qa_decks.py --course fst101 --render     # + rendered-pixel contrast
"""
import argparse, os, pathlib, re, sys, subprocess, tempfile

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

EM_DASH = "\u2014"
CONTRAST_FLOOR = 5.0          # house floor. AA (4.5) is NOT the bar. See memory: contrast-floor-5to1

# --------------------------------------------------------------------------- profiles
# roots: first path that exists wins, so the same file runs on m4 and on Pythia.
PROFILES = {
    "mc451": dict(
        fmt="qmd", glob="*.qmd", skip={"index.qmd"},
        roots=["/Volumes/One Touch/20-research/aura-lab/v2v-hub/decks/mc451"],
        bands=(12, 18), other_course="MC 501",
        theme_marker="default, ../aura-reveal.scss",
    ),
    "mc501": dict(
        fmt="qmd", glob="*.qmd", skip={"index.qmd"},
        roots=["/Volumes/One Touch/20-research/aura-lab/v2v-hub/decks/mc501"],
        bands=(20, 27), other_course="MC 451",
        theme_marker="default, ../aura-reveal.scss",
    ),
    "fst101": dict(
        fmt="marp", glob="*.md", skip=set(),
        skip_prefix="_",                 # _TEMPLATE_ and _siue-resources-block are not decks
        skip_glob=["SCHEDULE-DIFF*"],
        roots=["/Volumes/One Touch/10-teaching/2026_Fall/FST101/modules",
               r"C:\pythia\work\fst101-sessions"],
        theme="orator-dark",
        theme_roots=["/Volumes/One Touch/10-teaching/_teaching-system.git",
                     r"C:\pythia\work\theme-work"],
        require_front_matter_keys=["week", "date_t07", "date_t08"],
        discussion_not_in_last_fraction=1/3,
        forbid_phrases=["as we discussed Tuesday", "as we discussed Thursday",
                        "last class", "on Tuesday we", "on Thursday we"],
    ),
}


def resolve_root(prof):
    for r in prof["roots"]:
        p = pathlib.Path(r)
        if p.is_dir():
            return p
    return None


def deck_files(prof, root):
    out = []
    for p in sorted(root.glob(prof["glob"])):
        if p.name in prof.get("skip", set()):
            continue
        if prof.get("skip_prefix") and p.name.startswith(prof["skip_prefix"]):
            continue
        if any(p.match(g) for g in prof.get("skip_glob", [])):
            continue
        out.append(p)
    return out


# --------------------------------------------------------------------------- qmd rules
def check_qmd(p, t, prof):
    """Unchanged semantics from the 2026-07-30 script."""
    n = len(re.findall(r"(?m)^## ", t))
    headings = [l for l in t.split("\n") if l.startswith("## ")]
    heads = [i for i, l in enumerate(headings) if "{.discuss}" in l]
    dpos = (heads[0] + 1) if heads else None
    issues = []
    if t.count(EM_DASH):
        issues.append(f"em-dash x{t.count(EM_DASH)}")
    if "|>" in t:
        issues.append("native pipe")
    if prof["other_course"] in t:
        issues.append("cross-course ref")
    if re.search(r"undergraduate|graduate student", t, re.I):
        issues.append("level label")
    if len(heads) != 1:
        issues.append(f"discuss slides={len(heads)}")
    if dpos == n:
        issues.append("discussion is LAST")
    if not t.startswith("---"):
        issues.append("no front matter")
    if prof["theme_marker"] not in t:
        issues.append("theme path")
    lo, hi = prof["bands"]
    if not (lo <= n <= hi):
        issues.append(f"slides={n} outside {lo}-{hi}")
    return n, dpos, issues


# -------------------------------------------------------------------------- marp rules
def comment_spans(t):
    """Every <!-- ... --> span, plus nesting/unclosed defects.

    HTML comments do not nest. An inner `-->` closes the outer block early and leaks
    the remainder onto the rendered slide. Caught live on 2026-08-12 after it had
    already reached 5 FST decks, which is why this is a hard check and not a lint.
    """
    spans, nested, depth, start = [], 0, 0, None
    for m in re.finditer(r"<!--|-->", t):
        if m.group() == "<!--":
            if depth:
                nested += 1
            else:
                start = m.start()
            depth = 1
        else:
            if depth:
                spans.append((start, m.end()))
                depth = 0
            else:
                nested += 1
    return spans, nested, depth


def check_marp(p, t, prof):
    issues = []
    spans, nested, unclosed = comment_spans(t)

    def in_comment(i):
        return any(a <= i < b for a, b in spans)

    # prose = everything outside HTML comments (presenter notes are authoring text)
    prose = "".join(t[a:b] for a, b in zip([0] + [s[1] for s in spans],
                                           [s[0] for s in spans] + [len(t)]))

    if not t.startswith("---"):
        issues.append("no front matter")
    fm = t.split("---", 2)[1] if t.startswith("---") and t.count("---") >= 2 else ""
    if f"theme: {prof['theme']}" not in fm:
        issues.append(f"theme != {prof['theme']}")
    for k in prof.get("require_front_matter_keys", []):
        m = re.search(rf"(?m)^\s*{k}:\s*(\S+)", fm)
        if not m:
            issues.append(f"front matter missing {k}")
        elif m.group(1) == "null":
            issues.append(f"{k} still null")

    if prose.count(EM_DASH):
        issues.append(f"em-dash x{prose.count(EM_DASH)}")
    if nested:
        issues.append(f"NESTED html comment x{nested}")
    if unclosed:
        issues.append("UNCLOSED html comment")
    if "IMAGE PLACEHOLDER" in t:
        issues.append("IMAGE PLACEHOLDER unfilled")

    for ph in prof.get("forbid_phrases", []):
        if re.search(re.escape(ph), t, re.I):
            issues.append(f"cross-section ref: {ph!r}")

    # slides, presenter notes, discussion position
    slides = re.split(r"(?m)^---\s*$", t.split("---", 2)[2] if t.startswith("---") else t)
    slides = [s for s in slides if s.strip()]
    n = len(slides)
    missing_note = [i + 1 for i, s in enumerate(slides)
                    if not re.search(r"<!--\s*Presenter note", s)]
    if missing_note:
        issues.append("no presenter note on slide(s) " +
                      ",".join(map(str, missing_note[:6])) +
                      ("..." if len(missing_note) > 6 else ""))

    dpos = None
    for i, s in enumerate(slides):
        if re.search(r"_class:\s*statement", s) or re.search(r"DISCUSSION", s):
            dpos = i + 1
            break
    frac = prof.get("discussion_not_in_last_fraction")
    if dpos is None:
        issues.append("no discussion slide found")
    elif frac and n and dpos > n * (1 - frac):
        issues.append(f"discussion at {dpos}/{n} is in the last third")

    # images: alt text required, visible credit required, no NC-ND source
    for m in re.finditer(r"!\[([^\]]*)\]\(([^)]+)\)", t):
        if in_comment(m.start()):
            continue                      # still a placeholder, already flagged above
        alt, src = m.group(1), m.group(2)
        slide = next((s for s in slides if m.group(0) in s), "")
        slide_vis = re.sub(r"<!--.*?-->", "", slide, flags=re.S)
        is_bg = alt.strip().startswith("bg")
        if is_bg:
            # A split background emits a CSS background, not an <img>, so the bracket
            # holds DIRECTIVES and there is no alt attribute to carry. WCAG is satisfied
            # by adjacent visible text, so the caption must describe the image and not
            # merely name the licence. Preferred on dense slides: it cannot overflow.
            cap = " ".join(re.findall(r">([^<]+)<", slide_vis)) or slide_vis
            before_credit = re.split(r"(?i)credit", cap)[0].strip()
            if len(before_credit) < 25:
                issues.append(f"bg image whose caption does not DESCRIBE it: {src}")
        elif not alt.strip():
            issues.append(f"image with EMPTY alt: {src}")
        elif alt.strip().lower().startswith(("image of", "picture of", "photo of")):
            issues.append(f"alt starts with a redundant phrase: {src}")
        # the credit must be VISIBLE text on the slide, in any wrapper, but it does not
        # count if it is only inside a presenter-note comment
        slide_visible = re.sub(r"<!--.*?-->", "", slide, flags=re.S)
        if not re.search(r"credit", slide_visible, re.I):
            issues.append(f"image with NO visible credit line: {src}")
    # NC-ND: the offence is SOURCING an image from Connections Are Everything, not
    # mentioning the book. Judge the credit line, not the deck.
    for m in re.finditer(r"(?i)credit.*", prose):
        if re.search(r"Connections Are Everything|NC-ND|nc-nd", m.group()):
            issues.append("NC-ND SOURCE in an image credit: " + m.group()[:70])

    return n, dpos, issues


# --------------------------------------------------- rendered-pixel contrast (opt-in)
def srgb_lum(rgb):
    def f(c):
        c /= 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = rgb
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)


def ratio(a, b):
    la, lb = srgb_lum(a), srgb_lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def render_contrast(prof, decks, themedir):
    """Rasterise each deck and measure contrast on ACTUAL PIXELS.

    Per-slide: background = the modal colour. Foreground = the modal colour among
    pixels that are far from the background, ignoring the thin antialiased fringe by
    keeping only pixels whose nearest-neighbourhood is uniform. Reports the worst pair
    per deck. This is evidence; the declared hex in the CSS is not.
    """
    try:
        from PIL import Image
    except ImportError:
        return ["Pillow not installed - skipping rendered-pixel contrast"]
    out, tmp = [], pathlib.Path(tempfile.mkdtemp(prefix="qa-render-"))
    marp = "marp.cmd" if os.name == "nt" else "marp"
    for p in decks:
        od = tmp / p.stem
        od.mkdir(parents=True, exist_ok=True)
        cmd = [marp, str(p), "--images", "png", "--image-scale", "1",
               "--allow-local-files", "-o", str(od / "s.png")]
        if themedir:
            cmd[1:1] = ["--theme-set", str(themedir)]
        r = subprocess.run(cmd, capture_output=True, text=True)
        pngs = sorted(od.glob("*.png"))
        if r.returncode != 0 or not pngs:
            out.append(f"{p.name}: RENDER FAILED ({(r.stderr or '').strip()[:120]})")
            continue
        worst, worst_at = 99.0, ""
        for png in pngs:
            im = Image.open(png).convert("RGB")
            im = im.resize((im.width // 2, im.height // 2))
            cols = im.getcolors(maxcolors=1 << 24) or []
            if not cols:
                continue
            cols.sort(reverse=True)
            bg = cols[0][1]
            total = sum(c for c, _ in cols)
            for cnt, col in cols[1:]:
                if cnt < total * 0.004:      # ignore fringe / rare pixels
                    continue
                if ratio(col, bg) < 1.6:     # same surface, not text
                    continue
                rr = ratio(col, bg)
                if rr < worst:
                    worst, worst_at = rr, f"{png.name} rgb{col} on rgb{bg}"
                break
        if worst < 99:
            flag = "PASS" if worst >= CONTRAST_FLOOR else "FAIL"
            out.append(f"{p.name}: worst rendered pair {worst:.2f} [{flag}] {worst_at}")
    return out


# -------------------------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--course", action="append",
                    help="profile name; repeatable. default = all that resolve here")
    ap.add_argument("--render", action="store_true",
                    help="also rasterise and measure contrast on rendered pixels")
    a = ap.parse_args()

    names = a.course or list(PROFILES)
    any_run, total_problems = False, 0

    for name in names:
        prof = PROFILES.get(name)
        if not prof:
            print(f"unknown course profile: {name}")
            continue
        root = resolve_root(prof)
        if not root:
            if a.course:
                print(f"{name}: no root on this host (looked in {prof['roots']})")
            continue
        any_run = True
        decks = deck_files(prof, root)
        rows, problems = [], []
        for p in decks:
            t = p.read_text(encoding="utf-8")
            if prof["fmt"] == "qmd":
                n, dpos, issues = check_qmd(p, t, prof)
            else:
                n, dpos, issues = check_marp(p, t, prof)
            rows.append((p.name, n, dpos))
            if issues:
                problems.append((p.name, issues))

        print(f"\n=== {name} ({prof['fmt']}) — {root}")
        print(f"decks checked: {len(rows)}")
        print(f"decks with issues: {len(problems)}")
        for nm, iss in problems:
            print(f"  {nm}: {', '.join(iss)}")
        if not problems:
            print("  none")
        print("slide counts: " + ", ".join(f"{nm.split('-')[0].split('.')[0]}={c}"
                                           for nm, c, _ in rows))
        total_problems += len(problems)

        if a.render:
            themedir = None
            for r in prof.get("theme_roots", []):
                if pathlib.Path(r).is_dir():
                    cand = list(pathlib.Path(r).rglob("*.css"))
                    if cand:
                        themedir = cand[0].parent
                        break
            print(f"rendered-pixel contrast (floor {CONTRAST_FLOOR}:1, theme={themedir}):")
            for line in render_contrast(prof, decks, themedir):
                print("  " + line)

    if not any_run:
        print("no profile resolved on this host")
    return 1 if total_problems else 0


if __name__ == "__main__":
    sys.exit(main())
