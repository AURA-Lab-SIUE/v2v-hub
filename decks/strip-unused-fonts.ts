// Post-render step (2026-11-05): remove the unused Source Sans Pro faces from every rendered revealjs page.
//
// Quarto's revealjs base theme (share/formats/revealjs/quarto.scss) imports Source Sans Pro
// unconditionally. The decks set their own fonts in aura-reveal.scss, so it is never displayed,
// but embed-resources inlines all four faces in four formats: about 2.9 MB of each ~4.6 MB deck,
// and about 120 MB of the Pages artifact, which made deploys time out in `syncing_files`.
// The decks stay single self-contained files (offline teaching); only these @font-face rules go.
// aura-reveal.scss sets the slide-menu font, the one rule that named Source Sans Pro.

export {};

async function* htmlFiles(dir: string): AsyncGenerator<string> {
  for await (const e of Deno.readDir(dir)) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory) yield* htmlFiles(p);
    else if (e.isFile && e.name.endsWith(".html")) yield p;
  }
}

function stripFaces(css: string): string {
  return css.replace(/@font-face\s*\{[^}]*Source Sans Pro[^}]*\}/g, "");
}

let files = 0;
let saved = 0;
// Every revealjs page with embed-resources: the decks and the worked-example walkthroughs.
for await (const path of htmlFiles("docs")) {
  const html = await Deno.readTextFile(path);
  const out = html.replace(/href="data:text\/css,([^"]*)"/g, (whole: string, enc: string) => {
    if (!enc.includes("Source%20Sans%20Pro")) return whole;
    const css = decodeURIComponent(enc);
    const trimmed = stripFaces(css);
    return trimmed === css ? whole : `href="data:text/css,${encodeURIComponent(trimmed)}"`;
  });
  if (out !== html) {
    await Deno.writeTextFile(path, out);
    files++;
    saved += html.length - out.length;
  }
}
console.log(`strip-unused-fonts: ${files} page(s), ${(saved / 1e6).toFixed(1)} MB removed`);
