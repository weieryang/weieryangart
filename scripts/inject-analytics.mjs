import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dist = path.resolve("dist");
const containerId = "GTM-NV6T388X";
const marker = "<!-- WEIERYANG GTM -->";
const headSnippet = `${marker}
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${containerId}');</script>
    <script src="/analytics-events.js" defer></script>`;
const bodySnippet = `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`;

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(filename);
    return entry.isFile() && entry.name.endsWith(".html") ? [filename] : [];
  }));
  return files.flat();
}

const files = await htmlFiles(dist);
if (files.length === 0) throw new Error("No HTML pages found in dist");

for (const file of files) {
  const html = await readFile(file, "utf8");
  if (html.includes(marker)) continue;
  if (html.includes("googletagmanager.com/gtm.js") || html.includes("googletagmanager.com/ns.html")) {
    throw new Error(`Existing GTM installation needs review: ${file}`);
  }
  if (!/<head(?:\s[^>]*)?>/i.test(html) || !/<body(?:\s[^>]*)?>/i.test(html)) {
    throw new Error(`Missing head or body tag: ${file}`);
  }
  const updated = html
    .replace(/<head(?:\s[^>]*)?>/i, (tag) => `${tag}\n    ${headSnippet}`)
    .replace(/<body(?:\s[^>]*)?>/i, (tag) => `${tag}\n    ${bodySnippet}`);
  await writeFile(file, updated);
}

console.log(`GTM ${containerId} installed on ${files.length} HTML pages`);
