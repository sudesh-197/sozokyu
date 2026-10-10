// Builds /public/assets/images/<id>.webp for every image the app uses.
//
//   npm install
//   npm run images
//
// For each image id found in src/data/*.js it:
//   1. skips it if the .webp already exists
//   2. converts assets-source/<id>.(png|jpg|jpeg|avif) if you put the original there
//   3. otherwise downloads it from Figma and converts it
// 4. makes a small <id>-640.webp copy of each image (thumbnails, ticker, phones) and writes
//    src/data/image-manifest.json (real width/height) used for responsive <img srcset>.
// Figma links expire after ~7 days: any that fail are listed at the end. Export those
// from Figma, drop the files in assets-source/ named <id>.png, and run this again.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, 'public/assets/images');
const srcDir = path.join(root, 'assets-source');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(srcDir, { recursive: true });

const figmaUrls = fs.existsSync(path.join(root, 'scripts/figma-assets.json'))
  ? JSON.parse(fs.readFileSync(path.join(root, 'scripts/figma-assets.json'), 'utf8')) : {};
const ids = new Set();
for (const f of fs.readdirSync(path.join(root, 'src/data'))) {
  const text = fs.readFileSync(path.join(root, 'src/data', f), 'utf8');
  for (const m of text.matchAll(/A\('([0-9a-f-]{36})'\)/g)) ids.add(m[1]);
}

const MAX_WIDTH = 1920; // plenty for the full-bleed heroes
const QUALITY = 80;
const failed = [];
let done = 0, skipped = 0;

for (const id of ids) {
  const target = path.join(out, `${id}.webp`);
  if (fs.existsSync(target)) { skipped++; continue; }
  try {
    let input;
    const local = ['png', 'jpg', 'jpeg', 'avif', 'webp']
      .map((e) => path.join(srcDir, `${id}.${e}`)).find((p) => fs.existsSync(p));
    if (local) {
      input = fs.readFileSync(local);
    } else {
      const res = await fetch(figmaUrls[id] || `https://www.figma.com/api/mcp/asset/${id}.png`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      input = Buffer.from(await res.arrayBuffer());
    }
    await sharp(input).rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY }).toFile(target);
    const kb = (fs.statSync(target).size / 1024).toFixed(0);
    console.log(`ok   ${id}.webp (${kb} KB)`);
    done++;
  } catch (e) {
    failed.push(`${id}  (${e.message})`);
  }
}

// ---- small copies + manifest (works offline, from the full-size .webp files) ----
const SMALL = 640;
const manifest = {};
for (const id of [...ids].sort()) {
  const full = path.join(out, `${id}.webp`);
  if (!fs.existsSync(full)) continue;
  const meta = await sharp(full).metadata();
  manifest[id] = { w: meta.width, h: meta.height };
  const small = path.join(out, `${id}-${SMALL}.webp`);
  if (!fs.existsSync(small) && meta.width > SMALL) {
    await sharp(full).resize({ width: SMALL }).webp({ quality: 76 }).toFile(small);
  } else if (!fs.existsSync(small)) {
    fs.copyFileSync(full, small); // already small
  }
}
fs.writeFileSync(path.join(root, 'src/data/image-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');

console.log(`\n${ids.size} images: ${done} converted, ${skipped} already done, ${failed.length} failed`);
if (failed.length) {
  console.log('\nMissing - export these from Figma into assets-source/<id>.png and re-run:');
  failed.forEach((f) => console.log('  ' + f));
  process.exitCode = 1;
}
