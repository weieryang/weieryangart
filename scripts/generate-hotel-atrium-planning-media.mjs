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
    .resize({ width, height, fit: "cover", position: "attention" })
    .toBuffer();
}

const [leftPanel, centrePanel, rightPanel] = await Promise.all([
  containedPanel("IMG_5312.JPG", 526, 900),
  containedPanel("IMG_5316.JPG", 526, 900),
  containedPanel("IMG_5320.JPG", 524, 900),
]);

await sharp({
  create: { width: 1600, height: 900, channels: 3, background: "#11110f" },
})
  .composite([
    { input: leftPanel, left: 0, top: 0 },
    { input: centrePanel, left: 538, top: 0 },
    { input: rightPanel, left: 1076, top: 0 },
  ])
  .webp({ quality: 84, smartSubsample: true })
  .toFile(output("hotel-atrium-sculpture-planning-overview.webp"));

await Promise.all([
  sharp(source("IMG_5312.JPG"))
    .autoOrient()
    .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-atrium-sculpture-multilevel-reference.webp")),
  sharp(source("IMG_5315.JPG"))
    .autoOrient()
    .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-atrium-sculpture-upper-level-view.webp")),
  sharp(source("IMG_5316.JPG"))
    .autoOrient()
    .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-atrium-sculpture-base-clearance.webp")),
  sharp(source("IMG_5320.JPG"))
    .autoOrient()
    .resize({ width: 1200, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, smartSubsample: true })
    .toFile(output("hotel-atrium-sculpture-cross-level-sightline.webp")),
]);

console.log("Generated five WebP assets for the large hotel atrium sculpture planning guide.");
