// Deck overlap check: two class sessions in the same course must not show the same slides.
//
//   quarto run tools/deck-overlap.ts               check decks/mc451 and decks/mc501
//   quarto run tools/deck-overlap.ts --report      print every pair's numbers, worst first
//   quarto run tools/deck-overlap.ts --self-test   run the built-in duplicate and distinct pairs
//
// predeploy-check.ts runs the same check (check 4), so CI blocks a pull request that adds one.
//
// Why (2026-11-12): MC 451's Thursday deck (S24) repeated Tuesday's (S23). Batch edits on
// 11-09 and 11-11 applied the same "finish Data Wrangling" block to S23, S24, and W12, and
// nothing compared two decks of one course, so a repeat reached the room.
//
// How it measures, per pair of decks in one course folder:
//   titles  shared content-slide titles / the smaller deck's content-slide titles
//   body    shared 8-word runs of slide text and code / the smaller deck's 8-word runs
// A content slide is any slide whose title is not structural. A title is structural when it
// is in the fixed list below or appears in more than a quarter of the course's decks
// (Today's Agenda, Upcoming Assignments, Questions?). Titles are compared lowercased, with
// attributes such as {.discuss} and a trailing "(cont.)" removed.
//
// Thresholds, from the measured pairs (2026-11-12; table in the Teaching outbox note
// 2026-11-12-mc451-duplicate-deck-root-cause.md). Every distinct pair in both courses measured
// at most 21% titles (S24 and S26 share their lab scaffolding) and 10% text (S21 and S22).
// S23 and S24 measured 19 to 23% titles and 36 to 38% text from 11-09 to 11-12, and 13% text
// after the repair. A pair FAILS at 35% shared titles or 20% shared text: the text limit is
// twice the worst distinct pair and about half the measured repeat; the title limit guards a
// copy whose slides were reworded. Titles alone did not separate the 11-12 repeat; text did.
// Two decks can share slides on purpose (a recap); list the pair in ALLOWED with the reason.

export const TITLE_LIMIT = 0.35;
export const BODY_LIMIT = 0.20;
const SHINGLE = 8;
const COURSES = ["decks/mc451", "decks/mc501"];
const STRUCTURAL = new Set([
  "today's agenda",
  "upcoming assignments",
  "questions?",
  "questions",
  "before next time",
  "exercise",
]);
// "course/a.qmd|course/b.qmd" (sorted) -> reason. Keep this empty unless a repeat is deliberate.
const ALLOWED: Record<string, string> = {};

export interface Slide {
  title: string;
  body: string;
}

export function normTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/\{[^}]*\}/g, "")
    .replace(/\(cont\.?\)/g, "")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

// Split a Quarto RevealJS source into slides at level-2 headings outside code fences.
export function parseDeck(src: string): Slide[] {
  let text = src.replace(/\r\n/g, "\n");
  const fm = text.match(/^---\n[\s\S]*?\n---\n/);
  if (fm) text = text.slice(fm[0].length);
  const slides: Slide[] = [];
  let cur: Slide | null = null;
  let fence: string | null = null;
  for (const line of text.split("\n")) {
    const f = line.match(/^\s*(`{3,}|~{3,})/);
    if (f) {
      if (fence === null) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
    }
    if (fence === null && /^##\s+/.test(line)) {
      cur = { title: line.replace(/^##\s+/, "").trim(), body: "" };
      slides.push(cur);
      continue;
    }
    if (cur) cur.body += line + "\n";
  }
  return slides;
}

function words(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/<[^>]+>/g, " ")
    .replace(/\]\([^)]*\)/g, "]")
    .replace(/[^a-z0-9_%>.$]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function shingles(slides: Slide[]): Set<string> {
  const out = new Set<string>();
  for (const s of slides) {
    const w = words(s.body);
    for (let i = 0; i + SHINGLE <= w.length; i++) out.add(w.slice(i, i + SHINGLE).join(" "));
  }
  return out;
}

function containment(a: Set<string>, b: Set<string>): number {
  const small = a.size <= b.size ? a : b;
  const big = small === a ? b : a;
  if (small.size === 0) return 0;
  let n = 0;
  for (const x of small) if (big.has(x)) n++;
  return n / small.size;
}

export interface PairResult {
  a: string;
  b: string;
  titles: number;
  body: number;
  shared: string[];
  fail: boolean;
  allowed?: string;
}

export function comparePairs(decks: Array<{ name: string; src: string }>): PairResult[] {
  const parsed = decks.map((d) => ({ name: d.name, slides: parseDeck(d.src) }));
  // a title in more than a quarter of the decks is course scaffolding, not content
  const freq = new Map<string, number>();
  for (const d of parsed) {
    for (const t of new Set(d.slides.map((s) => normTitle(s.title)))) freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  const structural = (t: string) =>
    STRUCTURAL.has(t) || t.startsWith("exercise") || (parsed.length >= 8 && (freq.get(t) ?? 0) > parsed.length / 4);
  const content = parsed.map((d) => {
    const slides = d.slides.filter((s) => !structural(normTitle(s.title)));
    return { name: d.name, titles: new Set(slides.map((s) => normTitle(s.title))), sh: shingles(slides) };
  });
  const out: PairResult[] = [];
  for (let i = 0; i < content.length; i++) {
    for (let j = i + 1; j < content.length; j++) {
      const A = content[i], B = content[j];
      const small = A.titles.size <= B.titles.size ? A.titles : B.titles;
      const big = small === A.titles ? B.titles : A.titles;
      const shared = [...small].filter((t) => big.has(t));
      const titles = small.size ? shared.length / small.size : 0;
      const body = containment(A.sh, B.sh);
      const key = [A.name, B.name].sort().join("|");
      const allowed = ALLOWED[key];
      out.push({
        a: A.name,
        b: B.name,
        titles,
        body,
        shared,
        fail: !allowed && (titles >= TITLE_LIMIT || body >= BODY_LIMIT),
        allowed,
      });
    }
  }
  return out.sort((x, y) => Math.max(y.titles, y.body) - Math.max(x.titles, x.body));
}

export async function checkCourses(root = "."): Promise<{ results: PairResult[]; failures: string[] }> {
  const results: PairResult[] = [];
  for (const dir of COURSES) {
    const decks: Array<{ name: string; src: string }> = [];
    try {
      for await (const e of Deno.readDir(`${root}/${dir}`)) {
        if (e.isFile && e.name.endsWith(".qmd") && e.name !== "index.qmd") {
          decks.push({ name: `${dir}/${e.name}`, src: await Deno.readTextFile(`${root}/${dir}/${e.name}`) });
        }
      }
    } catch {
      continue;
    }
    results.push(...comparePairs(decks));
  }
  const missing = results.length === 0 ? [`no deck pairs found under ${root}/decks/mc451 or ${root}/decks/mc501, so the overlap check did not run`] : [];
  const failures = missing.concat(results
    .filter((r) => r.fail)
    .map((r) =>
      `${r.a} and ${r.b} repeat each other: ${pct(r.titles)} of content-slide titles and ${pct(r.body)} of slide text shared ` +
      `(limits ${pct(TITLE_LIMIT)} and ${pct(BODY_LIMIT)}). Shared titles: ${r.shared.slice(0, 8).join("; ")}` +
      `${r.shared.length > 8 ? "; ..." : ""}. Give each session its own job, or list the pair in ALLOWED in tools/deck-overlap.ts with the reason.`
    ));
  return { results, failures };
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

function selfTest(): number {
  const intro = "## Today's Agenda\n\n- Coming up\n\n## Upcoming Assignments\n\n| What | Due |\n";
  const block = (n: number) =>
    Array.from({ length: n }, (_, i) =>
      `## Step ${i + 1} of the Wrangling Job\n\n- Open the worksheet and run chunk ${i + 1} to build table ${i + 1}\n` +
      "- The output prints a tibble with the message, the hour, and the viewer count for each row\n").join("\n");
  // distinct prose: every word carries the deck's tag, so two tags share no 8-word run
  const other = (tag: string, n: number) =>
    Array.from({ length: n }, (_, i) =>
      `## ${tag} Idea ${i + 1}\n\n- ${Array.from({ length: 14 }, (_, k) => `${tag}${i}w${k}`).join(" ")}\n`).join("\n");
  const filler = Array.from({ length: 8 }, (_, i) => ({ name: `f${i}.qmd`, src: intro + other(`Filler${i}`, 6) }));
  const cases: Array<[string, Array<{ name: string; src: string }>, boolean]> = [
    ["duplicate pair (same block in both decks) must FAIL",
      [{ name: "tue.qmd", src: intro + block(6) + other("Tuesday", 4) }, { name: "thu.qmd", src: intro + block(6) + other("Thursday", 4) }, ...filler], true],
    ["distinct pair sharing only the agenda and assignments slides must PASS",
      [{ name: "tue.qmd", src: intro + other("Tuesday", 10) }, { name: "thu.qmd", src: intro + other("Thursday", 10) }, ...filler], false],
    ["body repeated under new titles must FAIL",
      [{ name: "tue.qmd", src: intro + block(6) + other("Tuesday", 4) },
        { name: "thu.qmd", src: intro + block(6).replace(/## Step (\d+) of the Wrangling Job/g, "## Renamed $1") + other("Thursday", 4) }, ...filler], true],
  ];
  let bad = 0;
  for (const [label, decks, expectFail] of cases) {
    const r = comparePairs(decks).find((p) => [p.a, p.b].sort().join("|") === "thu.qmd|tue.qmd")!;
    const ok = r.fail === expectFail;
    if (!ok) bad++;
    console.log(`${ok ? "ok  " : "FAIL"} ${label} (titles ${pct(r.titles)}, body ${pct(r.body)})`);
  }
  console.log(bad ? `\nself-test FAILED: ${bad} case(s)` : "\nself-test passed");
  return bad ? 1 : 0;
}

if (import.meta.main) {
  const args = new Set(Deno.args);
  if (args.has("--self-test")) Deno.exit(selfTest());
  const root = Deno.args.find((a) => a.startsWith("--root="))?.slice(7) ?? ".";
  const { results, failures } = await checkCourses(root);
  if (args.has("--report")) {
    console.log("titles  body   pair");
    for (const r of results) console.log(`${pct(r.titles).padStart(5)}  ${pct(r.body).padStart(5)}  ${r.a} | ${r.b}${r.fail ? "  FAIL" : ""}${r.allowed ? "  (allowed)" : ""}`);
  }
  if (failures.length) {
    console.error(`\nFAIL: ${failures.length} deck overlap problem(s)`);
    for (const f of failures) console.error(`  - ${f}`);
    Deno.exit(1);
  }
  console.log(`\nPASS: ${results.length} deck pairs checked; none over ${pct(TITLE_LIMIT)} shared titles or ${pct(BODY_LIMIT)} shared text.`);
}
