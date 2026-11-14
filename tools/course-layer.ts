// Post-render: the course layer (2026-11-14, design direction B, owner q-20261114-0005).
//
//   quarto run tools/course-layer.ts            runs on docs/ (Quarto runs it after every render)
//   quarto run tools/course-layer.ts --dir=X    runs on another rendered folder
//   V2V_NO_PAGEFIND=1                           skips the search index (a quick local check)
// The search index is rebuilt on a full render (QUARTO_PROJECT_RENDER_ALL=1) or a --dir= run.
//
// For every page Quarto rendered, by its address:
//   1. a course bar under the site navbar (MC 451, MC 501, or MC 427). Pages both courses share
//      (help, cheat sheets, setup) carry one bar per course plus one that names both, and
//      _includes/site-head.html shows the bar for the course the student last used;
//   2. a breadcrumb at the top of the page, naming the course;
//   3. the course in the browser-tab title ("Guide 08: Wrangle Your Own Data (MC 451)");
//   4. on phones, a "Steps on this page" list copied from the contents list Quarto shows only on
//      wide screens;
//   5. search tags for Pagefind: what to index, a course filter, a kind filter, slides weighted
//      down; each section id moves from its <section> onto its heading, so a result can land on
//      the section (Pagefind reads ids on headings only);
//   6. the week-by-week list on each course home (mc451/index.html, mc501/index.html), built from
//      the rendered syllabus schedule, the lab-weeks table, the slides index, and the self-checks,
//      so the syllabus stays the one place the schedule is written.
// Then it builds the search index: npx pagefind (version pinned below) on the whole folder.
//
// Idempotent: a page that already carries <meta name="v2v-layer"> is left alone, so a partial
// render only touches the pages it rebuilt. Course homes are rebuilt every time.

const OUT = Deno.args.find((a) => a.startsWith("--dir="))?.slice(6) ??
  Deno.env.get("QUARTO_PROJECT_OUTPUT_DIR") ?? "docs";
const PAGEFIND = "pagefind@1.3.0";
const MARK = '<meta name="v2v-layer" content="2026-11-14">';

type Course = "mc451" | "mc501" | "mc427";
const NAME: Record<Course, string> = { mc451: "MC 451", mc501: "MC 501", mc427: "MC 427" };
type Crumb = [string, string | null]; // [label, href from the site root, or null for this page]
interface Info {
  course: Course | null; // null = shared by the courses
  kind: string; // Pagefind kind filter and the search page's grouping
  courses: string[]; // Pagefind course filter values
  crumbs: Crumb[];
  title?: string; // browser-tab title, without the site name
  bar: boolean;
  deck: boolean;
  current?: string; // which course-bar item is this page
}

const BOTH = ["MC 451", "MC 501"];
const ALL = ["MC 451", "MC 501", "MC 427"];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function text(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").replace(/&amp;/g, "&").trim();
}
function h1Of(s: string): string {
  const m = s.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  return m ? text(m[1].replace(/<span class="header-section-number">[\s\S]*?<\/span>/, "")) : "";
}
function tabTitle(s: string): string {
  const m = s.match(/<title>([^<]*)<\/title>/);
  if (!m) return "";
  return text(m[1]).replace(/^V2V Hub – /, "").replace(/ – V2V Hub$/, "");
}

function classify(rel: string, s: string): Info {
  const h1 = h1Of(s) || tabTitle(s);
  const base: Info = { course: null, kind: "Page", courses: ALL, crumbs: [[h1, null]], bar: true, deck: false };
  let m: RegExpMatchArray | null;
  if (rel === "index.html") return { ...base, crumbs: [], bar: false, kind: "Course page", title: "Home" };
  if (rel === "search.html") return { ...base, crumbs: [["Search", null]], kind: "Search" };
  if ((m = rel.match(/^(mc451|mc501)\/index\.html$/))) {
    const c = m[1] as Course;
    return { ...base, course: c, courses: [NAME[c]], kind: "Course page", crumbs: [[NAME[c], null]], title: `${NAME[c]} course home`, current: "week" };
  }
  if (rel === "syllabus.html" || rel === "mc501-syllabus.html") {
    const c: Course = rel === "syllabus.html" ? "mc451" : "mc501";
    return { ...base, course: c, courses: [NAME[c]], kind: "Syllabus", crumbs: [[NAME[c], `${c}/index.html`], ["Syllabus", null]], current: "syllabus" };
  }
  if ((m = rel.match(/^(mc451|mc501)-(assignments|prospectus-template|research-proposal-template)\.html$/))) {
    const c = m[1] as Course;
    const crumbs: Crumb[] = m[2] === "assignments"
      ? [[NAME[c], `${c}/index.html`], ["Assignments", null]]
      : [[NAME[c], `${c}/index.html`], ["Assignments", `${c}-assignments.html`], [h1, null]];
    return { ...base, course: c, courses: [NAME[c]], kind: "Assignment", crumbs, current: "assignments" };
  }
  if ((m = rel.match(/^guides\/(mc451|mc501|mc427)\/(.+)\.html$/))) {
    const c = m[1] as Course;
    const home: Crumb = c === "mc427" ? ["MC 427 R guides", "guides/mc427/index.html"] : [NAME[c], `${c}/index.html`];
    if (m[2] === "index") {
      return { ...base, course: c, courses: [NAME[c]], kind: "Guide",
        crumbs: c === "mc427" ? [["MC 427 R guides", null]] : [home, ["Guides", null]],
        title: c === "mc427" ? "MC 427 R guides" : `${NAME[c]} guides`, current: "guides" };
    }
    const n = m[2].match(/^(\d\d)-/);
    if (c === "mc427") {
      return { ...base, course: c, courses: [NAME[c]], kind: "Guide", crumbs: [home, [h1, null]], title: `${h1} (MC 427)`, current: m[2] };
    }
    const label = n ? `Guide ${n[1]}` : h1;
    return { ...base, course: c, courses: [NAME[c]], kind: "Guide",
      crumbs: [home, ["Guides", `guides/${c}/index.html`], [label, null]],
      title: n ? `Guide ${n[1]}: ${h1} (${NAME[c]})` : `${h1} (${NAME[c]})`, current: "guides" };
  }
  if ((m = rel.match(/^decks\/(mc451|mc501)\/(.+)\.html$/))) {
    const c = m[1] as Course;
    if (m[2] === "index") {
      return { ...base, course: c, courses: [NAME[c]], kind: "Slides", crumbs: [[NAME[c], `${c}/index.html`], ["Slides", null]], title: `${NAME[c]} slides`, current: "slides" };
    }
    const deckTitle = tabTitle(s);
    const sub = s.match(/<p class="subtitle"[^>]*>([\s\S]*?)<\/p>/);
    const which = sub ? (text(sub[1]).match(/^(S\d+|Week \d+)/)?.[1] ?? "") : "";
    return { ...base, course: c, courses: [NAME[c]], kind: "Slides", crumbs: [], bar: false, deck: true,
      title: which ? `${NAME[c]} ${which}: ${deckTitle}` : `${NAME[c]}: ${deckTitle}` };
  }
  if ((m = rel.match(/^self-checks\/(mc451|mc501)-week(\d+)\.html$/))) {
    const c = m[1] as Course;
    return { ...base, course: c, courses: [NAME[c]], kind: "Self-check",
      crumbs: [[NAME[c], `${c}/index.html`], [`Week ${m[2]} self-check`, null]], title: `Week ${m[2]} Self-Check (${NAME[c]})`, current: "week" };
  }
  const help: Crumb = ["Help and resources", "resources/index.html"];
  if (rel === "resources/index.html") return { ...base, kind: "Help", crumbs: [["Help and resources", null]], title: "Help and resources", current: "help" };
  if (/^resources\/(help|risks)\//.test(rel) || rel === "resources/fix-it.html") {
    return { ...base, kind: "Help", courses: BOTH, crumbs: [help, [h1, null]], current: "help" };
  }
  if (rel.startsWith("resources/cheat-sheets/")) {
    const crumbs: Crumb[] = rel.endsWith("/index.html") ? [help, [h1, null]] : [help, ["Cheat sheets", "resources/cheat-sheets/index.html"], [h1, null]];
    return { ...base, kind: "Reference", courses: BOTH, crumbs, current: "help" };
  }
  if (rel.startsWith("workbook/")) {
    const crumbs: Crumb[] = rel === "workbook/index.html" ? [help, [h1, null]] : [help, ["R Workbook", "workbook/index.html"], [h1, null]];
    return { ...base, kind: "Reference", courses: BOTH, crumbs, current: "help" };
  }
  if (rel.startsWith("examples/")) return { ...base, kind: "Reference", courses: BOTH, crumbs: [help, [h1, null]], current: "help" };
  const start: Crumb = ["Getting started", "setup.html"];
  if (rel === "setup.html") return { ...base, kind: "Setup", crumbs: [["Getting started", null]], current: "start" };
  if (/^resources\/(install-|workspace-setup|github-|vscode-|copilot-)/.test(rel) || rel === "workspace.html") {
    return { ...base, kind: "Setup", crumbs: [start, [h1, null]], current: "start" };
  }
  if (rel.startsWith("modules/")) return { ...base, kind: "Textbook part", courses: BOTH };
  return base;
}

// ---------- course bar ----------
const ITEMS: Record<"mc451" | "mc501", [string, string, string][]> = {
  mc451: [["week", "This week", "mc451/index.html#this-week"], ["assignments", "Assignments", "mc451-assignments.html"],
    ["guides", "Guides", "guides/mc451/index.html"], ["slides", "Slides", "decks/mc451/index.html"],
    ["help", "Help", "resources/index.html"], ["syllabus", "Syllabus", "syllabus.html"]],
  mc501: [["week", "This week", "mc501/index.html#this-week"], ["assignments", "Assignments", "mc501-assignments.html"],
    ["guides", "Guides", "guides/mc501/index.html"], ["slides", "Slides", "decks/mc501/index.html"],
    ["help", "Help", "resources/index.html"], ["syllabus", "Syllabus", "mc501-syllabus.html"]],
};
const ITEMS_427: [string, string, string][] = [["index", "R guides", "guides/mc427/index.html"],
  ["r-field-guide", "R Field Guide", "guides/mc427/r-field-guide.html"], ["r-quick-reference", "R Quick Reference", "guides/mc427/r-quick-reference.html"]];

function searchForm(p: string, id: string, course: Course | null): string {
  const label = course ? `Search ${NAME[course]}` : "Search the hub";
  return `<form class="v2v-search" role="search" action="${p}search.html">` +
    `<label class="visually-hidden" for="v2v-q-${id}">${label}</label>` +
    `<input id="v2v-q-${id}" type="search" name="q" placeholder="${label}" autocomplete="off">` +
    (course ? `<input type="hidden" name="course" value="${course}">` : "") +
    `<button type="submit">Search</button></form>`;
}
function bar(p: string, which: Course | "none", current: string | undefined, shared: boolean): string {
  const li = (key: string, label: string, href: string) =>
    `<li><a href="${p}${href}"${key === current ? ' aria-current="page"' : ""}>${label}</a></li>`;
  if (which === "none") {
    return `<nav class="v2v-coursebar" data-course="none" aria-label="Courses"><div class="v2v-coursebar-inner">` +
      `<span class="v2v-course-name">Your course</span><ul>${li("", "MC 451", "mc451/index.html")}${li("", "MC 501", "mc501/index.html")}</ul>` +
      searchForm(p, "none", null) + `</div></nav>`;
  }
  const items = which === "mc427" ? ITEMS_427 : ITEMS[which];
  const other = which === "mc451" ? "mc501" : "mc451";
  const swap = shared && which !== "mc427"
    ? `<a class="v2v-course-swap" href="?edition=${other}">Switch to ${NAME[other as Course]}</a>` : "";
  const home = which === "mc427" ? "guides/mc427/index.html" : `${which}/index.html`;
  return `<nav class="v2v-coursebar${shared ? "" : " v2v-coursebar-only"}" data-course="${which}" aria-label="${NAME[which]}"><div class="v2v-coursebar-inner">` +
    `<a class="v2v-course-name" href="${p}${home}">${NAME[which]}</a><ul>` +
    items.map(([k, l, h]) => li(k, l, h)).join("") + `</ul>${swap}` +
    searchForm(p, which, which === "mc427" ? null : which) + `</div></nav>`;
}

function crumbsHtml(p: string, crumbs: Crumb[]): string {
  if (!crumbs.length) return "";
  return `<nav class="v2v-crumbs" aria-label="Breadcrumb"><ol>` + crumbs.map(([l, h]) =>
    h ? `<li><a href="${p}${h}">${esc(l)}</a></li>` : `<li aria-current="page">${esc(l)}</li>`).join("") + `</ol></nav>`;
}

function stepsHtml(s: string): string {
  const m = s.match(/<nav id="TOC"[^>]*>([\s\S]*?)<\/nav>/);
  if (!m) return "";
  const ul = m[1].replace(/<h2[^>]*>[\s\S]*?<\/h2>/, "").trim();
  if ((ul.match(/<a /g) ?? []).length < 3) return "";
  const copy = ul.replace(/\s(id|class|data-scroll-target)="[^"]*"/g, "");
  return `<details class="v2v-steps"><summary>Steps on this page</summary><nav aria-label="Steps on this page">${copy}</nav></details>`;
}

function tags(info: Info, s: string): string {
  const t = info.title ?? (h1Of(s) || tabTitle(s));
  return `<span hidden data-pagefind-meta="title">${esc(t)}</span>` +
    info.courses.map((c) => `<span hidden data-pagefind-filter="course">${c}</span>`).join("") +
    `<span hidden data-pagefind-filter="kind">${info.kind}</span>`;
}

function layer(rel: string, s: string): string {
  if (s.includes(MARK)) return s;
  const info = classify(rel, s);
  const depth = rel.split("/").length - 1;
  const p = "../".repeat(depth);
  let out = s.replace("</head>", `${MARK}\n</head>`);
  if (info.title !== undefined) {
    out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(info.title)} – V2V Hub</title>`);
  }
  if (info.deck) {
    // The tags sit inside .reveal but outside .slides, where reveal.js looks only for sections.
    return out.replace(/<div class="reveal"([^>]*)>/, (_m, a) =>
      `<div class="reveal"${a} data-pagefind-body data-pagefind-weight="0.3">${tags(info, s)}`);
  }
  if (info.bar) {
    const bars = info.course
      ? bar(p, info.course, info.current, false)
      : bar(p, "none", info.current, true) + bar(p, "mc451", info.current, true) + bar(p, "mc501", info.current, true);
    out = out.replace(/(<header id="quarto-header"[\s\S]*?<\/header>)/, `$1\n${bars}`);
  }
  const main = /<main([^>]*)>/;
  const searchable = rel !== "search.html";
  out = out.replace(main, (_m, a) =>
    `<main${a}${searchable ? " data-pagefind-body" : ""}>${crumbsHtml(p, info.crumbs)}${searchable ? tags(info, s) : ""}`);
  const steps = stepsHtml(out);
  if (steps) out = out.replace(/(<section id="[^"]+" class="level2)/, `${steps}\n$1`);
  // Section ids onto headings (moved, not copied: an id appears once).
  out = out.replace(/<section id="([^"]+)"([^>]*)>(\s*)<h([1-6])(?![^>]*\sid=)([^>]*)>/g,
    (_m, id, rest, ws, n, h) => `<section${rest}>${ws}<h${n} id="${id}"${h}>`);
  return out;
}

// ---------- course homes: the weeks ----------
function tables(s: string): { head: string[]; rows: string[][] }[] {
  const out: { head: string[]; rows: string[][] }[] = [];
  for (const t of s.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/g)) {
    const head = [...t[1].matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((h) => text(h[1]));
    const body = t[1].split(/<\/thead>/).pop() ?? "";
    const rows = [...body.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
      .map((r) => [...r[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((c) => c[1].trim()));
    out.push({ head, rows: rows.filter((r) => r.length) });
  }
  return out;
}
const MON: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
function monday(dates: string, year: number): string {
  const m = text(dates).match(/^([A-Z][a-z]{2})\s+(\d{1,2})/);
  if (!m) return "";
  const d = new Date(Date.UTC(year, MON[m[1]], +m[2]));
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}
function relink(cell: string, fromRoot: string): string {
  // Cells come from root-level pages; the course home sits one folder down.
  return cell.replace(/href="(?!https?:|#|mailto:)(?:\.\/)?([^"]*)"/g, `href="../${fromRoot}$1"`)
    .replace(/href="#([^"]*)"/g, `href="../${fromRoot}PAGE#$1"`)
    .replace(/\s+·\s+/g, ", ");
}
async function read(path: string): Promise<string> {
  try { return await Deno.readTextFile(path); } catch { return ""; }
}
async function exists(path: string): Promise<boolean> {
  try { await Deno.stat(path); return true; } catch { return false; }
}

async function weeks(course: "mc451" | "mc501"): Promise<string> {
  const sylPage = course === "mc451" ? "syllabus.html" : "mc501-syllabus.html";
  const syl = await read(`${OUT}/${sylPage}`);
  const decks = await read(`${OUT}/decks/${course}/index.html`);
  if (!syl) throw new Error(`course-layer: ${OUT}/${sylPage} is missing; the ${NAME[course]} weeks cannot be built`);
  const ts = tables(syl);
  const sched = ts.find((t) => t.head[0] === "Week" && (t.head.includes("Dates") || t.head.includes("Wed")));
  const lab = ts.find((t) => t.head[0] === "Week" && /^Walkthrough/.test(t.head[1] ?? ""));
  const reading = ts.find((t) => t.head[0] === "Week" && t.head[1] === "Reading");
  if (!sched) throw new Error(`course-layer: no schedule table in ${sylPage}`);
  const deckBy: Record<string, string> = {};
  for (const t of tables(decks)) {
    for (const r of t.rows) {
      const key = course === "mc451" ? text(r[1] ?? "") : `Week ${text(r[0] ?? "")}`;
      const a = (r[r.length - 1] ?? "").match(/href="([^"]+)"/);
      if (a) deckBy[key] = `../decks/${course}/${a[1].replace(/^\.\//, "")}`;
    }
  }
  const labBy: Record<string, string[]> = {};
  for (const r of lab?.rows ?? []) labBy[text(r[0])] = [relink(r[1], ""), relink(r[2], "")];
  const readBy: Record<string, string> = {};
  for (const r of reading?.rows ?? []) readBy[text(r[0])] = `${r[1]} ${relink(r[2], "")}`;
  const year = 2026;
  const blocks: string[] = [];
  for (const r of sched.rows) {
    const wk = text(r[0]);
    if (!/^\d+$/.test(wk)) continue;
    const dl: string[] = [];
    const slot = (label: string, html: string) => { if (text(html)) dl.push(`<dt>${label}</dt><dd>${html}</dd>`); };
    let dates: string;
    if (course === "mc451") {
      dates = text(r[1]);
      for (const [day, cell] of [["Tuesday", r[2]], ["Thursday", r[3]]] as const) {
        const sess = text(cell).match(/^S(\d+)/);
        const deck = sess && deckBy[`S${sess[1]}`];
        slot(day, relink(cell, "").replace(/^(S\d+), /, "$1: ") + (deck ? ` <a href="${deck}">Slides for ${sess![0]}</a>` : ""));
      }
      if (labBy[wk]) { slot("Watch before Thursday", labBy[wk][0]); slot("Guides", labBy[wk][1]); }
      slot("Due", relink(r[4] ?? "", ""));
    } else {
      dates = text(r[1]);
      const deck = deckBy[`Week ${wk}`];
      slot("Wednesday", relink(r[2], "") + (deck ? ` <a href="${deck}">Slides for Week ${wk}</a>` : ""));
      if (readBy[wk]) slot("Reading", readBy[wk]);
      if (labBy[wk]) { slot("Watch for the lab time", labBy[wk][0]); slot("Guides", labBy[wk][1]); }
      slot("Due", relink(r[3] ?? "", ""));
    }
    if (await exists(`${OUT}/self-checks/${course}-week${wk}.html`)) {
      slot("Self-check", `<a href="../self-checks/${course}-week${wk}.html">Week ${wk} Self-Check</a>`);
    }
    const mon = monday(dates, year);
    blocks.push(`<details class="v2v-week" id="week-${wk}" data-monday="${mon}">` +
      `<summary><span class="v2v-week-name">Week ${wk}</span> <span class="v2v-week-dates">${esc(dates)}</span></summary>` +
      `<dl>${dl.join("")}</dl></details>`);
  }
  return blocks.join("\n").replaceAll("PAGE#", `${sylPage}#`);
}

const THIS_WEEK_JS = `<script>
/* this-week-2026-11-14: open the current week and copy it into "This week". With scripting
   off, every week stays in the list below and the box says so. */
(function(){
  var weeks = [].slice.call(document.querySelectorAll('details.v2v-week[data-monday]'));
  var box = document.getElementById('v2v-this-week');
  if (!weeks.length || !box) return;
  var now = new Date(); var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  function start(w){ var p = w.getAttribute('data-monday').split('-'); return new Date(+p[0], +p[1]-1, +p[2]); }
  var pick = null, note = '';
  for (var i = 0; i < weeks.length; i++) {
    var s = start(weeks[i]), e = new Date(s); e.setDate(e.getDate() + 7);
    if (today >= s && today < e) { pick = weeks[i]; break; }
    if (today < s) { pick = weeks[i]; note = 'The next week of class:'; break; }
  }
  if (!pick) { pick = weeks[weeks.length - 1]; note = 'The semester is over. Its last week:'; }
  pick.open = true; pick.classList.add('v2v-week-current');
  var h = document.createElement('h3');
  h.textContent = pick.querySelector('.v2v-week-name').textContent + ', ' + pick.querySelector('.v2v-week-dates').textContent;
  box.innerHTML = '';
  if (note) { var p = document.createElement('p'); p.textContent = note; box.appendChild(p); }
  box.appendChild(h);
  box.appendChild(pick.querySelector('dl').cloneNode(true));
  var a = document.createElement('a'); a.href = '#' + pick.id; a.textContent = 'This week in the full list';
  var p2 = document.createElement('p'); p2.appendChild(a); box.appendChild(p2);
})();
</script>`;

async function courseHome(course: "mc451" | "mc501"): Promise<void> {
  const path = `${OUT}/${course}/index.html`;
  const s = await read(path);
  if (!s) return; // not rendered in this pass
  // The placeholder is a <div id="v2v-weeks"> with one line of text; the list built here holds
  // no <div>, so the first </div> closes it on the first run and on every run after.
  const slot = /<div id="v2v-weeks"[^>]*>[\s\S]*?<\/div>/;
  if (!slot.test(s)) throw new Error(`course-layer: ${path} has no <div id="v2v-weeks"> placeholder`);
  const list = await weeks(course);
  if (list.includes("<div")) throw new Error("course-layer: a week cell holds a <div>; the placeholder rule needs a change");
  const out = s.replace(slot, () => `<div id="v2v-weeks" data-course="${course}">${list}</div>`)
    .replace("</body>", () => `${s.includes("this-week-2026-11-14") ? "" : THIS_WEEK_JS}
</body>`);
  await Deno.writeTextFile(path, out);
  console.log(`course-layer: ${NAME[course]} weeks: ${(list.match(/class="v2v-week"/g) ?? []).length}`);
}

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const e of Deno.readDir(dir)) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory) { if (e.name !== "site_libs" && e.name !== "pagefind") yield* walk(p); }
    else if (e.isFile && e.name.endsWith(".html")) yield p;
  }
}

async function main(): Promise<void> {
  let n = 0;
  for await (const f of walk(OUT)) {
    const rel = f.slice(OUT.length + 1);
    const s = await Deno.readTextFile(f);
    if (!s.includes("<html") || /<title>reveal\.js - Speaker View<\/title>/.test(s.slice(0, 4000))) continue;
    if (!s.includes('id="quarto-header"') && !s.includes('class="reveal"')) continue; // not a site page
    const out = layer(rel, s);
    if (out !== s) { await Deno.writeTextFile(f, out); n++; }
  }
  console.log(`course-layer: ${n} pages layered`);
  await courseHome("mc451");
  await courseHome("mc501");
  // The index covers the whole site, so a partial render (one page) leaves the last one in place.
  const manual = Deno.args.some((a) => a.startsWith("--dir="));
  if (Deno.env.get("V2V_NO_PAGEFIND") === "1" || (!manual && Deno.env.get("QUARTO_PROJECT_RENDER_ALL") !== "1")) {
    console.log("course-layer: search index not rebuilt (partial render, or V2V_NO_PAGEFIND=1)");
    return;
  }
  const win = Deno.build.os === "windows";
  const cmd = new Deno.Command(win ? "cmd" : "npx", {
    args: [...(win ? ["/c", "npx"] : []), "-y", PAGEFIND, "--site", OUT], stdout: "piped", stderr: "piped" });
  const r = await cmd.output();
  const log = new TextDecoder().decode(r.stdout) + new TextDecoder().decode(r.stderr);
  const pages = log.match(/Indexed (\d+) pages?/);
  console.log(`course-layer: ${PAGEFIND}: ${pages ? pages[0] : log.trim().split("\n").slice(-3).join(" | ")}`);
  if (r.code !== 0) { console.error(log); Deno.exit(r.code); }
}

await main();
