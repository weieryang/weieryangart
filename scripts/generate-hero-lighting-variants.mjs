import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const width = 1920;
const height = 1080;
const source = path.resolve("src/assets/hero-plaza-master-v4.webp");
const assetDirectory = path.resolve("src/assets");
const seoDirectory = path.resolve("public/seo-media");

await mkdir(seoDirectory, { recursive: true });

const variants = [
  {
    name: "hero-plaza-blue-hour-v4.webp",
    brightness: 0.72,
    saturation: 0.82,
    overlay: `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#08264b" stop-opacity=".58"/>
            <stop offset=".58" stop-color="#16314c" stop-opacity=".32"/>
            <stop offset="1" stop-color="#071421" stop-opacity=".30"/>
          </linearGradient>
          <radialGradient id="afterglow" cx="80%" cy="29%" r="46%">
            <stop offset="0" stop-color="#d7a878" stop-opacity=".22"/>
            <stop offset=".42" stop-color="#8b6f69" stop-opacity=".08"/>
            <stop offset="1" stop-color="#172d48" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="water" cx="70%" cy="88%" r="42%">
            <stop offset="0" stop-color="#8ea7bd" stop-opacity=".12"/>
            <stop offset="1" stop-color="#0a1724" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#sky)"/>
        <rect width="${width}" height="${height}" fill="url(#afterglow)"/>
        <rect width="${width}" height="${height}" fill="url(#water)"/>
      </svg>`,
  },
  {
    name: "hero-plaza-night-v4.webp",
    brightness: 0.56,
    saturation: 0.78,
    overlay: `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="night" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#021326" stop-opacity=".62"/>
            <stop offset=".58" stop-color="#061726" stop-opacity=".43"/>
            <stop offset="1" stop-color="#020a11" stop-opacity=".50"/>
          </linearGradient>
          <radialGradient id="architecture" cx="86%" cy="39%" r="31%">
            <stop offset="0" stop-color="#d69b5f" stop-opacity=".20"/>
            <stop offset=".42" stop-color="#9f714a" stop-opacity=".08"/>
            <stop offset="1" stop-color="#091725" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="sculpture" cx="68%" cy="66%" r="31%">
            <stop offset="0" stop-color="#e6bd8a" stop-opacity=".20"/>
            <stop offset=".34" stop-color="#c38e5e" stop-opacity=".08"/>
            <stop offset="1" stop-color="#061421" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="reflection" cx="69%" cy="91%" r="35%">
            <stop offset="0" stop-color="#e0ad78" stop-opacity=".22"/>
            <stop offset=".52" stop-color="#31506a" stop-opacity=".07"/>
            <stop offset="1" stop-color="#06111b" stop-opacity="0"/>
          </radialGradient>
          <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="13"/>
          </filter>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#night)"/>
        <rect width="${width}" height="${height}" fill="url(#architecture)"/>
        <rect width="${width}" height="${height}" fill="url(#sculpture)"/>
        <rect width="${width}" height="${height}" fill="url(#reflection)"/>
        <g fill="#f2bd79" opacity=".34" filter="url(#glow)">
          <ellipse cx="1234" cy="890" rx="42" ry="10"/>
          <ellipse cx="1337" cy="900" rx="42" ry="10"/>
          <ellipse cx="1450" cy="903" rx="34" ry="9"/>
          <rect x="1472" y="337" width="330" height="7" rx="3.5"/>
          <rect x="49" y="415" width="215" height="6" rx="3"/>
        </g>
        <g fill="#ffd49b" opacity=".58">
          <ellipse cx="1234" cy="889" rx="8" ry="2.5"/>
          <ellipse cx="1337" cy="899" rx="8" ry="2.5"/>
          <ellipse cx="1450" cy="902" rx="7" ry="2.2"/>
          <rect x="1472" y="337" width="330" height="1.5" rx=".75"/>
          <rect x="49" y="415" width="215" height="1.4" rx=".7"/>
        </g>
      </svg>`,
  },
];

for (const variant of variants) {
  const output = path.join(assetDirectory, variant.name);
  await sharp(source)
    .modulate({ brightness: variant.brightness, saturation: variant.saturation })
    .composite([{ input: Buffer.from(variant.overlay), blend: "over" }])
    .sharpen({ sigma: 0.65, m1: 0.45, m2: 1.2 })
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(output);
  await sharp(output)
    .webp({ quality: 88, effort: 6, smartSubsample: true })
    .toFile(path.join(seoDirectory, variant.name));
  console.log(variant.name);
}
