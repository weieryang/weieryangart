import path from "node:path";
import sharp from "sharp";

// User-provided references only; preserve the complete frame.
const source = path.resolve(process.argv[2] || "../9.22小红薯雕塑素材");
for (const [original, file, width] of [
  ["IMG_5190.JPG", "hotel-lobby-whale-spatial-reference.webp", 1080],
  ["IMG_5175.JPG", "hotel-arrival-metal-tree-reference.webp", 1200],
]) {
  const result = await sharp(path.join(source, original)).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(path.resolve("public/seo-media", file));
  console.log(`${file}: ${result.width}×${result.height}, ${result.size} bytes`);
}
