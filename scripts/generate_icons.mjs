// Renders the raster icons from assets/images/favicon.svg.
//
// Two things here are deliberate and were decided by looking at the pixels,
// not by reasoning about them.
//
// Each size is rendered AT its size. Downsampling from one large render — the
// obvious approach — averages the mark's white hairlines against the dark tile
// into mid-grey, and at 16px that read worse than the aliasing it replaced.
//
// And the small sizes are drawn with the path STROKED in its own colour, which
// dilates every line. A 16px grid has fewer rows than this drawing has strokes,
// so the only currency it has is ink. The weight falls as the grid grows and
// reaches zero by 48px, where the artwork already reads as itself.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "assets/images/favicon.svg");
const outputDir = resolve(root, "assets/images/icons");

// size -> extra stroke width, in the artwork's own 1200-unit coordinates.
const SIZES = new Map([[16, 20], [32, 8], [48, 0], [180, 0], [192, 0], [512, 0]]);

const svg = readFileSync(source, "utf8");
const path = svg.match(/\bd="([^"]+)"/)?.[1];
if (!path) throw new Error("favicon.svg no longer contains a single path to render");
const tile = svg.match(/<rect[^>]*fill="(#[0-9A-Fa-f]{6})"/)?.[1];
if (!tile) throw new Error("favicon.svg no longer carries its own ground");
const transform = svg.match(/<g transform="([^"]+)"/)?.[1] ?? "";

mkdirSync(outputDir, { recursive: true });
const temporary = resolve(outputDir, ".render.svg");
for (const [size, weight] of SIZES) {
  writeFileSync(temporary,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200">` +
    `<rect width="1200" height="1200" rx="150" fill="${tile}"/>` +
    `<g transform="${transform}">` +
    `<path fill="#FFFFFF" fill-rule="evenodd" stroke="#FFFFFF" stroke-width="${weight}" ` +
    `stroke-linejoin="round" d="${path}"/></g></svg>`);
  execFileSync("rsvg-convert", ["-w", String(size), "-h", String(size), temporary,
    "-o", resolve(outputDir, `icon-${size}.png`)]);
  process.stdout.write(`icon-${size}.png  stroke +${weight}\n`);
}
rmSync(temporary, { force: true });
