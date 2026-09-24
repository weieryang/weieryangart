import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(root, "src", "assets", "studio-material-desk.webp");
const output = path.join(root, "src", "assets", "studio-material-desk-blueprint.webp");

await sharp(input)
  .resize({ width: 1920, withoutEnlargement: true })
  .greyscale()
  .normalise()
  .convolve({
    width: 3,
    height: 3,
    kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    scale: 1,
    offset: 0,
  })
  .linear(2.2, -32)
  .negate()
  .tint({ r: 203, g: 207, b: 202 })
  .webp({ quality: 84, effort: 5 })
  .toFile(output);

console.log(`Generated ${output}`);
