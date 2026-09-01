# V2V lecture deck style

Decks are Quarto RevealJS, one per class meeting, rendered by the hub website
build into `docs/decks/`. Source lives in `decks/mc451/` and `decks/mc501/`.

## Front matter (copy exactly, changing only title and subtitle)

```yaml
---
title: "Short session title"
subtitle: "S7 · Chapter 4 · MC 451 Research Methods in Mass Media"
author: "Dr. Alex Leith"
format:
  revealjs:
    theme: [default, ../aura-reveal.scss]
    slide-number: c/t
    embed-resources: true
    incremental: false
    center: false
    transition: none
---
```

MC 501 subtitle form: `"Week 7 · Chapter 8 · MC 501 Research Methods for Mass Communications"`

## Length

- **MC 451** session (75 minutes): 12 to 18 content slides.
- **MC 501** week (170 minutes): 20 to 27 content slides.

**Raised 2026-09-01 (owner), from 12-16 and 20-24.** This deliberately reopens a band that
was tightened once before, so do not "restore" the old numbers. The reason: every deck had
been authored to the very top of the old band, which meant the tone rewrite below could only
buy a slide of warmth by deleting a slide of content. The extra room is for pacing, not for
more material.

## Tone, and who these students are

Adopted 2026-09-01 after the owner reported that students were glazing over: the decks read
too technical and too cold to people who dislike VS Code, R, and coding generally.

1. **Open on the student's situation, not the field's.** Slide one answers "what will I be
   able to do by the end of today," in plain words. Not "here is why research is in crisis."
2. **Name the feeling before the tool.** Where something is tedious, slow, or likely to
   break, the slide says so. A student told in advance that installs break for somebody
   every semester does not conclude they are stupid when it breaks for them.
3. **One new named thing per slide.** Never VS Code, R, Quarto, and Git together. Each gets
   its own moment and a one-line answer to "what does this do for me."
4. **Show before you justify.** They see it work, then hear why it matters. Abstraction
   before contact is what makes eyes glaze.
5. **Vary the slide shape.** A single sentence, a two-column contrast, a question, a table.
   Uniform five-bullet density reads as a wall no matter how good the bullets are.
6. **Sell it on their stakes.** Most of these students will not publish, review, or
   replicate. Reproducibility sells on "you will not be able to reconstruct your own numbers
   in six weeks," which is true and personal. The replication crisis is not theirs.
7. **Every code slide carries three things:** what to type, what should appear, and what to
   do when it does not.
8. **No unexplained jargon.** First use gets a plain gloss on the same slide. "Repository",
   "chunk", "render", "commit", and "console" all count.

**Never make a student hand-author a file from a slide.** Ship a starter they open instead:
`starters/` in this repo, and the root of the `v2v-workspace` template. s04 used to show YAML
followed by two bare R lines with no fenced chunk, which does not render if copied literally.

## Density, the hard rule

Every slide must fit without overflowing at a 33px root font. In practice:

- 4 to 6 bullets per slide, each **one or two lines**, never a paragraph.
- If a topic needs more, split it across two slides. Never shrink text.
- Tables: 7 rows maximum, short cells.
- One idea per slide. A slide is a landing point, not a document.

## Voice and formatting

- **No em-dashes anywhere.** Recast with commas, colons, or parentheses.
- Use the tidyverse pipe `%>%`, never `|>`.
- Bold the term being defined, italics sparingly for emphasis.
- Numbers and concrete detail beat adjectives. Prefer "3,178 average viewers"
  to "a lot of viewers".
- Do not label anything as undergraduate or graduate. Do not mention the other
  course. Students only ever see their own deck.

## Required structural elements

1. An **eyebrow label** on a slide or two for orientation:
   `[November 2018]{.eyebrow}` renders as a small red uppercase kicker.
2. A **discussion or activity slide**, placed **early or in the middle**, never
   at the end. Mark it `## Your turn {.discuss}` (451) or
   `## Discussion {.discuss}` (501). Give 2 to 4 real questions plus a short
   italic instruction such as *Two minutes with a neighbor, then we compare.*
3. A closing **"Looking ahead"** or **"Before next time"** slide with concrete
   preparation: what to read, what is due.

## Lab and studio sessions

Sessions marked `[R]`, `lab`, or `studio` are working sessions, not lectures.
Structure those as:

- What we are building today, and why it matters for the White Paper
- The concepts needed, briefly (2 to 3 slides maximum)
- The code, in small readable chunks with a plain-English gloss under each
- Common errors and what they mean
- A checkpoint slide: "you should now have ..."

Code blocks use ```` ```r ```` fences, 6 to 10 lines maximum per block, and every
block gets a one-sentence explanation in plain English.

## MC 501 additions

Each 501 week has an assigned reading (named in the syllabus schedule). Include:

- A slide or two engaging the reading's argument directly, with a **verbatim
  quote** where you have one from the book's graduate extension.
- The `{.discuss}` slide should be built on that reading, with real questions
  about its argument, not logistics.
- Greater depth on assumptions, diagnostics, and interpretation, since the
  graduate distinction is depth rather than additional techniques.

## Source of truth

Draw content from the matching book chapter at
`O:\20-research\aura-lab\v2v-book\chapters\chapterNN.qmd`. The book is the
authority for numbers, examples, and terminology. Do not invent data, findings,
or quotes.

## Pre-commit check

Run `python3 decks/qa_decks.py` before committing any deck. It checks em-dashes,
the native pipe, cross-course references, level labels, discussion count and
placement, front matter, theme path, and the slide-count bands above.
