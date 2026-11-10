// Pre-merge check for the GitHub Pages deploy. Run it before opening any pull request:
//
//   quarto run tools/predeploy-check.ts              full render, then check docs/
//   quarto run tools/predeploy-check.ts --no-render  check the docs/ already rendered
//
// It exits nonzero when any check fails. CI runs the same script with --no-render on
// every pull request (.github/workflows/pr-check.yml) after rendering the site.
//
// Checks:
//   1. Size budget: the whole Pages artifact (docs/) and every single file in it.
//   2. Every RevealJS deck is self-contained, so it opens offline in the classroom:
//      no stylesheet, script, image, or font fetched over the network.
//   3. Every deck embeds the three AURA faces (Archivo, Newsreader, Spline Sans Mono)
//      and none of the unused Source Sans Pro faces (decks/strip-unused-fonts.ts).
//   5. Every file students download (.qmd, .R, .Rmd, .md, .txt in docs/) links with full
//      addresses on one host, so its links open from a local copy
//      (tools/absolute-download-links.ts).
//
// Budgets (2026-11-06). The artifact was 238 MB, 194 MB of it in 44 decks that each
// carried about 3 MB of unused Source Sans Pro. With that stripped the site is about
// 107 MB and the largest file is 2.3 MB (search.json). The budgets leave about 40 percent
// headroom for the rest of the term and fail if the fonts come back:
//   total 150 MB  (with the fonts back: about 238 MB)
//   file    4 MB  (a deck with the fonts back: 4.6 to 5.2 MB)
// Raise a budget only on purpose, in this file, with the reason beside it.

import { downloads, findDownloadLinkProblems } from "./absolute-download-links.ts";

const TOTAL_BUDGET_MB = 150;
const FILE_BUDGET_MB = 4;
const OUT_DIR = Deno.args.find((a: string) => a.startsWith("--dir="))?.slice(6) ?? "docs"; // --dir= checks another folder
const REQUIRED_FAMILIES = ["Archivo", "Newsreader", "Spline Sans Mono"];
const FORBIDDEN_FAMILIES = ["Source Sans Pro"];

const MB = 1e6;
const args = new Set(Deno.args);
const failures: string[] = [];

async function render(): Promise<void> {
  const quarto = Deno.env.get("QUARTO_BIN_PATH")
    ? `${Deno.env.get("QUARTO_BIN_PATH")}/quarto${Deno.build.os === "windows" ? ".exe" : ""}`
    : "quarto";
  console.log(`Rendering the whole site (${quarto} render). This takes several minutes.`);
  const { code } = await new Deno.Command(quarto, { args: ["render"], stdout: "inherit", stderr: "inherit" })
    .output();
  if (code !== 0) {
    console.error(`quarto render failed with exit code ${code}.`);
    Deno.exit(code);
  }
}

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const e of Deno.readDir(dir)) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory) yield* walk(p);
    else if (e.isFile) yield p;
  }
}

function decodeQuietly(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

// The CSS Quarto embeds in a deck: percent-encoded data:text/css URIs plus <style> blocks.
function embeddedCss(html: string): string {
  const parts: string[] = [];
  for (const m of html.matchAll(/data:text\/css,([^"']*)/g)) parts.push(decodeQuietly(m[1]));
  for (const m of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) parts.push(m[1]);
  return parts.join("\n");
}

function faceFamilies(css: string): Set<string> {
  const fams = new Set<string>();
  for (const m of css.matchAll(/@font-face\s*\{[^}]*?font-family:\s*['"]?([^;'"}]+)/g)) fams.add(m[1].trim());
  return fams;
}

function checkDeck(path: string, html: string): void {
  // 2. offline: nothing loaded from the network
  const remote = [
    ...html.matchAll(/<(?:script|img|iframe|video|audio|source)\b[^>]*\ssrc="https?:\/\/[^"]*"/gi),
    ...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="https?:\/\/[^"]*"/gi),
    ...html.matchAll(/<link\b[^>]*href="https?:\/\/[^"]*"[^>]*rel="stylesheet"/gi),
  ].map((m) => m[0].slice(0, 120));
  const css = embeddedCss(html);
  for (const m of css.matchAll(/(?:@import\s+(?:url\()?|url\()\s*['"]?(https?:\/\/[^)'"\s]+)/g)) {
    remote.push(`css ${m[1].slice(0, 100)}`);
  }
  if (remote.length) failures.push(`${path}: loads ${remote.length} resource(s) over the network, so it will not open offline: ${remote[0]}`);

  // 3. fonts
  const fams = faceFamilies(css);
  for (const f of REQUIRED_FAMILIES) {
    if (!fams.has(f)) failures.push(`${path}: the ${f} font is not embedded (the deck would fall back to a system font offline)`);
  }
  for (const f of FORBIDDEN_FAMILIES) {
    if (fams.has(f)) failures.push(`${path}: still embeds ${f}; decks/strip-unused-fonts.ts did not run (is post-render in _quarto.yml?)`);
  }
}

if (!args.has("--no-render")) await render();

try {
  await Deno.stat(OUT_DIR);
} catch {
  console.error(`${OUT_DIR}/ does not exist. Render first: quarto run tools/predeploy-check.ts`);
  Deno.exit(2);
}

let total = 0;
let decks = 0;
const sizes: Array<[number, string]> = [];
for await (const f of walk(OUT_DIR)) {
  const { size } = await Deno.stat(f);
  total += size;
  sizes.push([size, f]);
  if (size > FILE_BUDGET_MB * MB) failures.push(`${f}: ${(size / MB).toFixed(2)} MB is over the ${FILE_BUDGET_MB} MB per-file budget`);
  if (f.endsWith(".html")) {
    const html = await Deno.readTextFile(f);
    // decks/mc451/index.html and decks/mc501/index.html inherit the folder's revealjs format
    // but are listing pages, not class decks, and are not rendered self-contained.
    if (/<div class="reveal"/.test(html) && !f.endsWith("/index.html")) {
      decks++;
      checkDeck(f, html);
    }
  }
}
if (total > TOTAL_BUDGET_MB * MB) {
  failures.push(`${OUT_DIR}/ totals ${(total / MB).toFixed(1)} MB, over the ${TOTAL_BUDGET_MB} MB Pages artifact budget`);
}

sizes.sort((a, b) => b[0] - a[0]);
console.log(`\nPages artifact (${OUT_DIR}/): ${(total / MB).toFixed(1)} MB in ${sizes.length} files; budget ${TOTAL_BUDGET_MB} MB total, ${FILE_BUDGET_MB} MB per file.`);
console.log("Largest files:");
for (const [s, f] of sizes.slice(0, 10)) console.log(`  ${(s / MB).toFixed(2).padStart(6)} MB  ${f}`);
console.log(`Decks checked for offline use and fonts: ${decks}`);

if (decks === 0) failures.push(`no RevealJS decks found under ${OUT_DIR}/; the deck checks did not run`);

// 5. Downloaded files open from a student's own computer: no relative links, one host.
const downloadProblems = await findDownloadLinkProblems(OUT_DIR);
let downloadCount = 0;
for await (const _ of downloads(OUT_DIR)) downloadCount++;
console.log(`Downloaded files checked for full-address links: ${downloadCount}`);
failures.push(...downloadProblems);

if (failures.length) {
  console.error(`\nFAIL: ${failures.length} problem(s)`);
  for (const f of failures) console.error(`  - ${f}`);
  Deno.exit(1);
}
console.log("\nPASS: within budget, every deck is self-contained and embeds the AURA fonts.");
