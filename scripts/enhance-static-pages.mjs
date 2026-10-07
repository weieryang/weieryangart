import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("dist");
import { staticHeader as header, staticFooter as footer } from "./static-frame.mjs";

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
  for (const match of [...html.matchAll(/<img\b[^>]*\bsrc="((?:(?:\.\.?\/)+|\/)seo-media\/[a-z0-9-]+\.webp)"[^>]*>/gi)]) {
    if (/\bsrcset=/.test(match[0])) continue;
    // The geometry-locked hero keeps its approved loading/transition behavior.
    if (match[1].includes("hero-plaza-")) continue;
    // Vite's relative base rewrites root images to ./seo-media/ and nested
    // pages to ../seo-media/. Resolve them before generating the same variants.
    const pageUrl = `https://weieryangart.com/${path.relative(root, file).replaceAll(path.sep, "/")}`;
    const src = new URL(match[1], pageUrl).pathname;
    const attributes = await responsiveAttributes(src);
    html = html.replace(match[0], match[0].replace(/\s*\/?>$/, ` ${attributes} />`));
    images++;
  }
  await fs.writeFile(file, html);
}
console.log(`Shared navigation/footer on ${pages} static pages; responsive WebP attributes on ${images} images (${variants.size} unique sources).`);
