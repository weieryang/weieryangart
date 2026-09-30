import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("dist");
const header = `<header class="wy-top"><div class="wy-top-inner"><a class="wy-brand" href="/" aria-label="WEIERYANG home">WEIERYANG</a><nav class="wy-nav" aria-label="Main navigation"><a href="/resort-sculpture/">Hotel sculpture</a><a href="/projects/">Projects &amp; studies</a><a href="/materials/">Materials</a><a href="/process/">Process</a><a href="/insights/">Insights</a><a href="mailto:tangkelian@weieryang.com">Contact Us</a><a href="/commission/?route=resort-sculpture">Project brief</a><span class="wy-language-label" lang="en" title="This guide is in English. Other interface languages are available on the studio homepage.">EN</span></nav></div></header>`;
const footer = `<footer class="wy-footer"><div class="wy-footer-inner">
<div><h2>WEIERYANG</h2><p>Custom sculpture for hotels, resorts and public spaces. Design, fabrication, export packing and overseas installation guidance.</p><p>U.S. project inquiries welcome. Delivery and local installation responsibilities are agreed for each commission.</p></div>
<div><h2>Sculpture routes</h2><a href="/resort-sculpture/">Hotel &amp; resort sculpture</a><a href="/custom-sculpture/">Custom sculpture</a><a href="/garden-sculpture/">Garden sculpture</a><a href="/public-art/">Public art</a><a href="/water-feature-sculpture/">Water feature sculpture</a></div>
<div><h2>Materials &amp; evidence</h2><a href="/stainless-steel-sculpture/">Stainless steel</a><a href="/bronze-sculpture/">Bronze</a><a href="/stone-sculpture/">Stone</a><a href="/projects/">Projects &amp; reference studies</a><a href="/process/">Process</a><a href="/insights/">Buyer guides</a></div>
<div><h2>Project entry</h2><a href="/custom-outdoor-sculpture-supplier/#us-procurement">U.S. procurement checklist</a><a href="/commission/">Request a project review</a><a href="mailto:tangkelian@weieryang.com">Contact Us — email</a><a href="https://wa.me/8613317178019" rel="noreferrer" target="_blank">WhatsApp (optional)</a><a href="/privacy/">Privacy &amp; project information</a><p>weieryangart.com</p></div>
</div></footer>`;

async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory() ? htmlFiles(path.join(dir, entry.name)) : entry.name.endsWith(".html") ? [path.join(dir, entry.name)] : []))).flat();
}
const variants = new Map();
async function responsiveAttributes(src) {
  if (variants.has(src)) return variants.get(src);
  const filename = path.join(root, src);
  const { width } = await sharp(filename).metadata();
  const candidates = [];
  for (const targetWidth of [640, 960]) {
    if (targetWidth >= width) continue;
    const target = src.replace(/\.webp$/, `-${targetWidth}w.webp`);
    await sharp(filename).resize({ width: targetWidth, withoutEnlargement: true }).webp({ quality: 80, smartSubsample: true }).toFile(path.join(root, target));
    candidates.push(`${target} ${targetWidth}w`);
  }
  candidates.push(`${src} ${width}w`);
  const attributes = `srcset="${candidates.join(", ")}" sizes="(max-width: 820px) calc(100vw - 36px), 880px"`;
  variants.set(src, attributes);
  return attributes;
}

let pages = 0, images = 0;
for (const file of await htmlFiles(root)) {
  let html = await fs.readFile(file, "utf8");
  if (html.includes('class="wy-top"')) {
    html = html.replace(/<header\b[^>]*class="wy-top"[^>]*>[\s\S]*?<\/header>/, header);
    html = /<footer\b[^>]*class="wy-footer"/.test(html)
      ? html.replace(/<footer\b[^>]*class="wy-footer"[^>]*>[\s\S]*?<\/footer>/, footer)
      : html.replace("</body>", `${footer}\n</body>`);
    pages++;
  }
  // Only first-party WebP images, preserving every original and its framing.
  for (const match of [...html.matchAll(/<img\b[^>]*\bsrc="(\/seo-media\/[a-z0-9-]+\.webp)"[^>]*>/gi)]) {
    if (/\bsrcset=/.test(match[0])) continue;
    // The geometry-locked hero keeps its approved loading/transition behavior.
    if (match[1].includes("hero-plaza-")) continue;
    const attributes = await responsiveAttributes(match[1]);
    html = html.replace(match[0], match[0].replace(/\s*\/?>$/, ` ${attributes} />`));
    images++;
  }
  await fs.writeFile(file, html);
}
console.log(`Shared navigation/footer on ${pages} static pages; responsive WebP attributes on ${images} images (${variants.size} unique sources).`);
