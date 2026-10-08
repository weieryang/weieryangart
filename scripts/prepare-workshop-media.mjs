import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const run = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.resolve(process.argv[2] || path.join(projectRoot, "..", "图片"));
const outputRoot = path.join(projectRoot, "public", "seo-media");
const manifestPath = path.join(projectRoot, "qa", "2026-10-08-images", "workshop-media-manifest.json");
const selections = [
  ["IMG_5924.JPG", "workshop-metal-whale-overview.webp"],
  ["IMG_5925.JPG", "workshop-metal-whale-surface.webp"],
  ["IMG_5934.JPG", "workshop-metal-hands-assembly.webp"],
  ["IMG_5932.JPG", "workshop-metal-hands-overview.webp"],
  ["IMG_5954.HEIC", "workshop-painted-portrait-overview.webp"],
  ["IMG_5953.HEIC", "workshop-painted-portrait-surface.webp"],
];
const encoding = Object.freeze({ quality: 82, effort: 6, smartSubsample: true });
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const orientedDimensions = metadata => metadata.autoOrient || {
  width: [5, 6, 7, 8].includes(metadata.orientation) ? metadata.height : metadata.width,
  height: [5, 6, 7, 8].includes(metadata.orientation) ? metadata.width : metadata.height,
};

async function exportWebp(input, filename, bounds) {
  const destination = path.join(outputRoot, filename);
  // Sharp's default output strips EXIF/XMP/IPTC; never call withMetadata here.
  await sharp(input).autoOrient().resize({ ...bounds, fit: "inside", withoutEnlargement: true })
    .webp(encoding).toFile(destination);
  const [metadata, bytes] = await Promise.all([sharp(destination).metadata(), fs.readFile(destination)]);
  if (metadata.format !== "webp" || metadata.exif || metadata.xmp || metadata.iptc || metadata.orientation) {
    throw new Error(`Unexpected format or retained private metadata in ${filename}`);
  }
  return {
    file: filename,
    publicPath: `/seo-media/${filename}`,
    width: metadata.width,
    height: metadata.height,
    bytes: bytes.length,
    sha256: digest(bytes),
    metadataStripped: true,
  };
}

await fs.mkdir(outputRoot, { recursive: true });
const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "weieryang-workshop-media-"));
const items = [];
try {
  for (const [sourceName, outputName] of selections) {
    const sourcePath = path.join(sourceRoot, sourceName);
    const sourceBytes = await fs.readFile(sourcePath);
    const sourceSha256 = digest(sourceBytes);
    const sourceMetadata = await sharp(sourcePath).metadata();
    let decodedInput = sourcePath;
    if (/\.heic$/i.test(sourceName)) {
      // The local sharp loader reads HEIC metadata but may fail to decode HEVC.
      // Use the installed macOS decoder, then discard its lossless PNG derivative.
      decodedInput = path.join(temporaryRoot, `${path.parse(sourceName).name}.png`);
      await run("/usr/bin/sips", ["-s", "format", "png", sourcePath, "--out", decodedInput]);
    }
    const decodedMetadata = await sharp(decodedInput).metadata();
    const sourceDisplay = orientedDimensions(sourceMetadata);
    const decodedDisplay = orientedDimensions(decodedMetadata);
    if (sourceDisplay.width !== decodedDisplay.width || sourceDisplay.height !== decodedDisplay.height) {
      throw new Error(`Decoded orientation/dimensions differ from source display metadata for ${sourceName}`);
    }
    const base = await exportWebp(decodedInput, outputName, { width: 1600, height: 1600 });
    const derivatives = [];
    for (const width of [640, 960]) {
      if (width >= base.width) continue;
      const filename = outputName.replace(/\.webp$/, `-${width}w.webp`);
      derivatives.push(await exportWebp(decodedInput, filename, { width }));
    }
    if (digest(await fs.readFile(sourcePath)) !== sourceSha256) {
      throw new Error(`Source changed during preparation: ${sourceName}`);
    }
    items.push({
      source: { filename: sourceName, absolutePath: sourcePath, sha256: sourceSha256, bytes: sourceBytes.length, format: sourceMetadata.format, exifOrientation: sourceMetadata.orientation ?? null, displayDimensions: sourceDisplay },
      evidenceClassification: "operator-confirmed-fabrication",
      decoding: /\.heic$/i.test(sourceName) ? "macOS sips to temporary lossless PNG, then sharp autoOrient" : "sharp autoOrient from original JPEG",
      base,
      derivatives,
      baseBytesSaved: sourceBytes.length - base.bytes,
      baseReductionPercent: Number(((1 - base.bytes / sourceBytes.length) * 100).toFixed(2)),
      sourceUnchanged: true,
    });
    console.log(`${sourceName} -> ${base.file}: ${base.width}x${base.height}, ${base.bytes} bytes; ${derivatives.map(file => `${file.width}w=${file.bytes}`).join(", ")}`);
  }
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}

const sourceBytes = items.reduce((sum, item) => sum + item.source.bytes, 0);
const baseBytes = items.reduce((sum, item) => sum + item.base.bytes, 0);
const allOutputBytes = items.reduce((sum, item) => sum + item.base.bytes + item.derivatives.reduce((subtotal, file) => subtotal + file.bytes, 0), 0);
const manifest = {
  version: 1,
  preparedAt: new Date().toISOString(),
  sourceRoot,
  outputRoot,
  reproducibleCommand: "node scripts/prepare-workshop-media.mjs [optional-source-folder]",
  policy: { framing: "complete original frame; no crop", autoOrient: true, longestEdge: 1600, withoutEnlargement: true, webp: encoding, responsiveWidths: [640, 960], metadata: "EXIF, XMP and IPTC stripped; no original HEIC/JPEG uploaded", sourceModified: false, temporaryFilesCleaned: true, generatedOrRetouched: false },
  operatorEvidence: { classification: "operator-confirmed-fabrication", confirmationDate: "2026-10-08", scope: "Operator confirmed actual fabrication of the photographed whale, hands and painted portrait subjects.", limitations: "This does not establish workshop property ownership, original authorship or reproduction rights, material grades, physical specifications, project completion, client identity or site location." },
  factsBoundary: "Technical image provenance and the specific operator fabrication confirmation above only; do not infer further claims from filenames or image metadata.",
  totals: { sourceCount: items.length, outputCount: items.reduce((sum, item) => sum + 1 + item.derivatives.length, 0), sourceBytes, baseBytes, allOutputBytes, baseBytesSaved: sourceBytes - baseBytes, baseReductionPercent: Number(((1 - baseBytes / sourceBytes) * 100).toFixed(2)), allOutputsBytesSaved: sourceBytes - allOutputBytes, allOutputsReductionPercent: Number(((1 - allOutputBytes / sourceBytes) * 100).toFixed(2)) },
  items,
};
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify({ manifestPath, totals: manifest.totals }, null, 2));
