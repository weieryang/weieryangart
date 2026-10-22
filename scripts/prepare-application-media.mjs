import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { applicationMediaGeometry } from '../src/applicationMedia.js';

const run = promisify(execFile);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.resolve(process.argv[2] || path.join(projectRoot, '..'));
const outputRoot = path.join(projectRoot, 'public', 'seo-media');
const manifestPath = path.join(projectRoot, 'qa', '2026-10-22-category-oem', 'media-manifest.json');
const selections = [
  ['goldAbstract', '图片(1)', 'IMG_6583.JPG'],
  ['suspendedFish', '图片(2)', 'IMG_7038.JPG'],
  ['petalDisplay', '图片(1)', 'IMG_6604.JPG'],
  ['warmAbstract', '图片(2)', 'IMG_7001.JPG'],
  ['litPortrait', '图片(1)', 'IMG_6632.JPG'],
  ['leafFace', '图片(1)', 'IMG_6650.HEIC'],
  ['layeredHorse', '图片(1)', 'IMG_6587.JPG'],
  ['outdoorHorse', '图片(1)', 'IMG_6601.JPG'],
];
const encoding = Object.freeze({ quality: 82, effort: 6, smartSubsample: true });
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const displayDimensions = metadata => metadata.autoOrient || {
  width: [5, 6, 7, 8].includes(metadata.orientation) ? metadata.height : metadata.width,
  height: [5, 6, 7, 8].includes(metadata.orientation) ? metadata.width : metadata.height,
};

async function exportWebp(input, filename, bounds) {
  const destination = path.join(outputRoot, filename);
  const bytes = await sharp(input).autoOrient()
    .resize({ ...bounds, fit: 'inside', withoutEnlargement: true })
    .webp(encoding).toBuffer();
  // Sharp strips private metadata by default. Do not call withMetadata/keepMetadata.
  const metadata = await sharp(bytes).metadata();
  if (metadata.format !== 'webp' || metadata.exif || metadata.xmp || metadata.iptc || metadata.orientation) {
    throw new Error(`Unexpected format or private metadata in ${filename}`);
  }
  // A rerun must never silently overwrite a previously prepared different file.
  try {
    const previous = await fs.readFile(destination);
    if (!previous.equals(bytes)) throw new Error(`Existing output differs: ${filename}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.writeFile(destination, bytes, { flag: 'wx' });
  }
  return { file: filename, publicPath: `/seo-media/${filename}`, width: metadata.width,
    height: metadata.height, bytes: bytes.length, sha256: digest(bytes), metadataStripped: true };
}

await fs.mkdir(outputRoot, { recursive: true });
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'weieryang-application-media-'));
const items = [];
try {
  for (const [id, folder, filename] of selections) {
    const geometry = applicationMediaGeometry.find(image => image.id === id);
    if (!geometry || !/^application-[a-z-]+\.webp$/.test(geometry.file)) throw new Error(`Invalid geometry for ${id}`);
    const sourcePath = path.join(sourceRoot, folder, filename);
    const sourceBytes = await fs.readFile(sourcePath);
    const sourceSha256 = digest(sourceBytes);
    const sourceMetadata = await sharp(sourcePath).metadata();
    let input = sourcePath;
    if (/\.heic$/i.test(filename)) {
      input = path.join(temporaryRoot, `${id}.png`);
      await run('/usr/bin/sips', ['-s', 'format', 'png', sourcePath, '--out', input]);
    }
    const sourceDisplay = displayDimensions(sourceMetadata);
    const decodedDisplay = displayDimensions(await sharp(input).metadata());
    if (sourceDisplay.width !== decodedDisplay.width || sourceDisplay.height !== decodedDisplay.height) {
      throw new Error(`Decoded dimensions or orientation changed for ${filename}`);
    }
    const base = await exportWebp(input, geometry.file, { width: 1600, height: 1600 });
    if (base.width !== geometry.width || base.height !== geometry.height) {
      throw new Error(`Web image geometry does not match applicationMedia.js for ${id}: ${base.width}x${base.height}`);
    }
    const derivatives = [];
    for (const width of [640, 960]) {
      if (width >= base.width) continue;
      derivatives.push(await exportWebp(input, geometry.file.replace(/\.webp$/, `-${width}w.webp`), { width }));
    }
    if (digest(await fs.readFile(sourcePath)) !== sourceSha256) throw new Error(`Original changed: ${filename}`);
    items.push({ id, categoryId: geometry.categoryId,
      source: { absolutePath: sourcePath, folder, filename, bytes: sourceBytes.length, sha256: sourceSha256,
        format: sourceMetadata.format, exifOrientation: sourceMetadata.orientation ?? null, displayDimensions: sourceDisplay },
      decoding: /\.heic$/i.test(filename) ? 'macOS sips to temporary lossless PNG, then sharp autoOrient' : 'sharp autoOrient from original',
      evidenceClassification: 'operator-confirmed-actual-production-record', sourceUnchanged: true, base, derivatives });
    console.log(`${filename} -> ${base.file} ${base.width}x${base.height}, ${base.bytes} bytes`);
  }
} finally {
  await fs.rm(temporaryRoot, { recursive: true, force: true });
}

const totals = {
  sourceCount: items.length,
  outputCount: items.reduce((sum, item) => sum + 1 + item.derivatives.length, 0),
  sourceBytes: items.reduce((sum, item) => sum + item.source.bytes, 0),
  baseBytes: items.reduce((sum, item) => sum + item.base.bytes, 0),
  allOutputBytes: items.reduce((sum, item) => sum + item.base.bytes + item.derivatives.reduce((n, file) => n + file.bytes, 0), 0),
};
const manifest = { version: 1, preparedAt: new Date().toISOString(), sourceRoot, outputRoot,
  reproducibleCommand: 'node scripts/prepare-application-media.mjs [optional-parent-of-image-folders]',
  policy: { framing: 'complete original frame; no crop', autoOrient: true, longestEdge: 1600,
    withoutEnlargement: true, webp: encoding, responsiveWidths: [640, 960],
    metadata: 'EXIF/XMP/IPTC stripped; no originals published', sourceModified: false,
    temporaryFilesCleaned: true, generatedOrRetouched: false, existingDifferentOutputsOverwritten: false },
  operatorEvidence: { confirmationDate: '2026-10-22', classification: 'operator-confirmed-actual-production-record',
    scope: 'Operator confirmed works in the two new image folders as actual production.',
    limitations: 'Does not establish original design/reproduction rights, premises ownership, material grade, physical dimensions, client/site identity, certifications, completed delivery or installation scope. Photos are not combined into one project.' },
  totals, items };
await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify({ manifestPath, totals }, null, 2));
