// Post-render step (run by Quarto after every render; see `post-render` in _quarto.yml).
//
// Students download the files listed under `resources:` in _quarto.yml (the starters, the codebook
// templates, the example scripts) and open them from their own computer. A link inside a downloaded
// file has no site around it there: a relative link such as ../guides/mc451/14-put-a-worksheet-in-your-workspace.html
// points into the student's Downloads folder and opens nothing. So every link in a downloaded text
// file must be a full address on a host that is up.
//
// This step rewrites the downloaded copies in docs/ (the sources are left as written):
//   1. a relative link (Markdown, href, or src) becomes a full address on SITE_HOST, resolved from
//      the file's own place on the site; a link to a page's .qmd or .md becomes its .html;
//   2. a full address on either AURA Lab host becomes the same path on SITE_HOST.
// It only rewrites a file that changes, so it is safe to run more than once.
// tools/predeploy-check.ts runs findDownloadLinkProblems() and fails if any download still carries a
// relative link or a link to the other host.

// The host every downloaded file links to. aura-lab.siue.edu and aura-lab-siue.github.io serve the
// same site; downloads use the SIUE address (owner, 2026-11-10).
export const SITE_HOST = "https://aura-lab.siue.edu";
const AURA_HOSTS = /https?:\/\/(?:aura-lab\.siue\.edu|aura-lab-siue\.github\.io)(?=[/\s)"'<>\]`]|$)/gi;
const SITE_ROOT = "/v2v-hub/"; // where docs/ is served on SITE_HOST
export const DOWNLOAD_EXT = [".qmd", ".R", ".Rmd", ".md", ".txt"];

// ](target)  href="target"  src="target"  ; target is relative when it has no scheme, is not an
// in-page #anchor, and is not an absolute /path (those get SITE_HOST put in front instead).
const LINK = /(\]\(\s*<?|(?:href|src)=["'])([^)"'\s>]+)/g;
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;

function posixJoin(dir: string, rel: string): string {
  const parts = (dir + rel).split("/");
  const out: string[] = [];
  for (const p of parts) {
    if (p === "..") out.pop();
    else if (p !== "." && p !== "") out.push(p);
  }
  return "/" + out.join("/");
}

async function exists(p: string): Promise<boolean> {
  try {
    await Deno.stat(p);
    return true;
  } catch {
    return false;
  }
}

// sitePath: the file's path inside docs/, e.g. "starters/11-wrangling-data.qmd".
export async function absolutize(text: string, sitePath: string, outDir: string): Promise<string> {
  const dir = SITE_ROOT + sitePath.replace(/[^/]*$/, "");
  const links: string[] = []; // one replacement per LINK match, in order
  for (const m of text.matchAll(LINK)) {
    const target = m[2];
    if (HAS_SCHEME.test(target) || target.startsWith("#")) {
      links.push(m[0]);
      continue;
    }
    const [base, frag] = target.split(/#(.*)/s);
    let abs = base.startsWith("/") ? base : posixJoin(dir, base);
    const inDocs = abs.startsWith(SITE_ROOT) ? `${outDir}/${abs.slice(SITE_ROOT.length)}` : "";
    if (inDocs && !(await exists(inDocs)) && /\.(qmd|md)$/.test(abs)) {
      const page = abs.replace(/\.(qmd|md)$/, ".html");
      if (await exists(`${outDir}/${page.slice(SITE_ROOT.length)}`)) abs = page;
    }
    links.push(m[1] + SITE_HOST + abs + (frag !== undefined ? "#" + frag : ""));
  }
  let i = 0;
  return text.replace(LINK, () => links[i++]).replace(AURA_HOSTS, SITE_HOST);
}

export async function* downloads(outDir: string, dir = outDir): AsyncGenerator<string> {
  for await (const e of Deno.readDir(dir)) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory) yield* downloads(outDir, p);
    else if (e.isFile && DOWNLOAD_EXT.some((x) => e.name.endsWith(x))) yield p;
  }
}

// For tools/predeploy-check.ts: every relative link, and every link to the other AURA host, left in a download.
export async function findDownloadLinkProblems(outDir: string): Promise<string[]> {
  const problems: string[] = [];
  const other = SITE_HOST.includes("github.io") ? /https?:\/\/aura-lab\.siue\.edu/i : /https?:\/\/aura-lab-siue\.github\.io/i;
  for await (const f of downloads(outDir)) {
    const text = await Deno.readTextFile(f);
    for (const m of text.matchAll(LINK)) {
      if (!HAS_SCHEME.test(m[2]) && !m[2].startsWith("#")) problems.push(`${f}: relative link ${m[2]} opens nothing from a downloaded copy`);
    }
    const o = text.match(other);
    if (o) problems.push(`${f}: links to ${o[0]}; downloads link to ${SITE_HOST} (tools/absolute-download-links.ts did not run?)`);
  }
  return problems;
}

if (import.meta.main) {
  const outDir = Deno.env.get("QUARTO_PROJECT_OUTPUT_DIR") ?? Deno.args[0] ?? "docs";
  let changed = 0;
  for await (const f of downloads(outDir)) {
    const text = await Deno.readTextFile(f);
    const out = await absolutize(text, f.slice(outDir.length + 1), outDir);
    if (out !== text) {
      await Deno.writeTextFile(f, out);
      changed++;
    }
  }
  console.log(`absolute-download-links: ${changed} downloaded file(s) rewritten to ${SITE_HOST}`);
}
