// Creates compressed WebP copies of images uploaded through the admin panel (dist/uploads),
// max 1800 px wide. Pages built for production reference these .webp copies (see src/lib/img.ts).
// The originals in the repository are not changed.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve('dist/uploads');
const MAX = 1800;
let files = [];
try { files = await fs.readdir(dir); } catch { process.exit(0); }
for (const f of files) {
  const ext = path.extname(f).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
  const src = path.join(dir, f);
  const out = path.join(dir, f.slice(0, -ext.length) + '.webp');
  const meta = await sharp(src, { failOn: 'none' }).metadata();
  let pipe = sharp(src, { failOn: 'none' }).rotate();
  if ((meta.width ?? 0) > MAX) pipe = pipe.resize({ width: MAX });
  await pipe.webp({ quality: 78 }).toFile(out);
  const a = (await fs.stat(src)).size, b = (await fs.stat(out)).size;
  console.log(`webp ${f}: ${Math.round(a / 1024)} KB → ${Math.round(b / 1024)} KB`);
}
