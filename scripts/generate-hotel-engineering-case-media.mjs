import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const sourceRoot = process.argv[2];
if (!sourceRoot) {
  throw new Error("Pass the supplied-material folder as the first argument.");
}

const outputRoot = path.join(process.cwd(), "public", "seo-media");
fs.mkdirSync(outputRoot, { recursive: true });

const source = (name) => path.join(sourceRoot, name);
const output = (name) => path.join(outputRoot, name);

async function containedPanel(file, width, height) {
  return sharp(source(file))
    .autoOrient()
    .resize({ width, height, fit: "contain", background: "#11110f" })
    .toBuffer();
}

const [overviewLeft, overviewTop, overviewBottom] = await Promise.all([
  containedPanel("IMG_5241.JPG", 720, 900),
  containedPanel("IMG_5242.JPG", 868, 444),
  containedPanel("IMG_5243.JPG", 868, 444),
]);

await sharp({
  create: { width: 1600, height: 900, channels: 3, background: "#11110f" },
})
  .composite([
    { input: overviewLeft, left: 0, top: 0 },
    { input: overviewTop, left: 732, top: 0 },
    { input: overviewBottom, left: 732, top: 456 },
  ])
  .webp({ quality: 84, smartSubsample: true })
  .toFile(output("hotel-engineering-case-overview.webp"));

await Promise.all([
  sharp(source("IMG_5241.JPG"))
    .autoOrient()
    .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-engineering-case-atrium-scale.webp")),
  sharp(source("IMG_5244.JPG"))
    .autoOrient()
    .resize({ width: 1600, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-engineering-case-reflection-detail.webp")),
  sharp(source("IMG_5245.JPG"))
    .autoOrient()
    .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-engineering-case-close-view.webp")),
]);

console.log("Generated four WebP assets for the hotel engineering case review.");
