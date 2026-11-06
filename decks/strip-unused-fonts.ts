// Post-render step (run by Quarto after every render; see `post-render` in _quarto.yml).
//
// Every RevealJS deck here is rendered with embed-resources: true, so each deck's
// HTML carries its fonts inline as base64. Quarto's revealjs theme
// (share/formats/revealjs/quarto.scss) imports Source Sans Pro unconditionally,
// and the AURA theme (decks/aura-reveal.scss) never uses it: the slides use
// Archivo, Newsreader, and Spline Sans Mono. The slide-menu plugin names Source
// Sans Pro on its wrapper, but no text in the menu is drawn in it (checked
// 2026-11-06 in Chromium with the menu open: all four faces stayed unloaded, and
// the menu draws in Newsreader). The four faces add about 3 MB to every deck,
// about 131 MB across the site, more than half of the Pages artifact.
//
// This step deletes those @font-face rules from each rendered HTML file. It only
// rewrites a file that contains them, so it is safe to run more than once.
// tools/predeploy-check.ts fails if a deck still carries them.

const STRIP_FAMILIES = ["Source Sans Pro"];

const FACE = /@font-face\s*\{[^}]*\}/g;
const familyPattern = new RegExp(
  `font-family:\\s*['"]?(?:${STRIP_FAMILIES.map((f) => f.replace(/ /g, "\\s+")).join("|")})['"]?\\s*[;}]`,
  "i",
);

function stripCss(css: string): { css: string; removed: number } {
  let removed = 0;
  const out = css.replace(FACE, (block) => {
    if (familyPattern.test(block)) {
      removed++;
      return "";
    }
    return block;
  });
  return { css: out, removed };
}

// Inline CSS appears two ways. Quarto writes embedded stylesheets as percent-encoded
// data:text/css URIs ("%40font%2Dface%20%7B ... %7D"); a block is cut in that encoded
// form, never decoded and re-encoded, because base64 contains no "%" and so an encoded
// block always ends at its first "%7D". Plain <style> text is handled as ordinary CSS.
const ENCODED_FACE = /%40font(?:%2D|-)face(?:%20|\s)*%7B[\s\S]*?%7D/gi;
const STYLE_TAG = /(<style[^>]*>)([\s\S]*?)(<\/style>)/g;

function decodeQuietly(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return "";
  }
}

export function stripHtml(html: string): { html: string; removed: number } {
  let removed = 0;
  let out = html.replace(ENCODED_FACE, (block) => {
    if (!familyPattern.test(decodeQuietly(block))) return block;
    removed++;
    return "";
  });
  out = out.replace(STYLE_TAG, (whole, open: string, body: string, close: string) => {
    if (!familyPattern.test(body)) return whole;
    const r = stripCss(body);
    removed += r.removed;
    return open + r.css + close;
  });
  return { html: out, removed };
}

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const e of Deno.readDir(dir)) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory) yield* walk(p);
    else if (e.isFile && e.name.endsWith(".html")) yield p;
  }
}

async function targets(): Promise<string[]> {
  // Quarto lists what this render wrote; a single-file render lists only that file.
  const listed = Deno.env.get("QUARTO_PROJECT_OUTPUT_FILES");
  if (listed && listed.trim()) {
    return listed.split(/\r?\n/).map((s: string) => s.trim()).filter((s: string) => s.endsWith(".html"));
  }
  const outDir = Deno.args[0] ?? Deno.env.get("QUARTO_PROJECT_OUTPUT_DIR") ?? "docs";
  const files: string[] = [];
  for await (const f of walk(outDir)) files.push(f);
  return files;
}

if (import.meta.main) {
  let files = 0, faces = 0, saved = 0;
  for (const f of await targets()) {
    let html: string;
    try {
      html = await Deno.readTextFile(f);
    } catch {
      continue; // listed but not written (for example, a skipped freeze)
    }
    if (!/Source(?:%20|\s)+Sans/i.test(html)) continue;
    const r = stripHtml(html);
    if (r.removed === 0) continue;
    await Deno.writeTextFile(f, r.html);
    files++;
    faces += r.removed;
    saved += html.length - r.html.length;
  }
  console.log(
    `strip-unused-fonts: removed ${faces} ${STRIP_FAMILIES.join(", ")} @font-face rule(s) from ${files} file(s), ` +
      `${(saved / 1e6).toFixed(1)} MB smaller`,
  );
}
