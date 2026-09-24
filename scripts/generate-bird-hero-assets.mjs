import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "src", "assets", "hero-bird-studio-v2.png");
const photo = path.join(root, "src", "assets", "hero-bird-studio-v2.webp");
const blueprint = path.join(root, "src", "assets", "hero-bird-blueprint-v2.webp");

await sharp(source)
  .resize(1920, 1080, { fit: "cover", position: "centre" })
  .webp({ quality: 91, effort: 6 })
  .toFile(photo);

await sharp(source)
  .resize(1920, 1080, { fit: "cover", position: "centre" })
  .greyscale()
  .convolve({
    width: 3,
    height: 3,
    kernel: [-1, -1, -1, -1, 8, -1, -1, -1, -1],
    scale: 1,
    offset: 0,
  })
  .normalise()
  .linear(2.35, -22)
  .tint({ r: 196, g: 206, b: 208 })
  .webp({ quality: 88, effort: 6 })
  .toFile(blueprint);

console.log(JSON.stringify({ photo, blueprint }, null, 2));
