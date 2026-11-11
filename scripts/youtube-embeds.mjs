// After the build: a paragraph in news or service text that holds only a YouTube link
// becomes a video player (see src/lib/youtube.js). Links inside a sentence stay links.
import fs from 'node:fs/promises';
import path from 'node:path';
import { parseYouTube, youTubeHtml } from '../src/lib/youtube.js';

const roots = ['dist/news', 'dist/services'];
const unescape = (s) => s.replace(/&amp;/g, '&');
const P = /<p>\s*(?:<a [^>]*href="([^"]+)"[^>]*>[^<]*<\/a>|(https?:\/\/[^\s<]+))\s*<\/p>/g;

async function* htmlFiles(dir) {
  let items = [];
  try { items = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const it of items) {
    const p = path.join(dir, it.name);
    if (it.isDirectory()) yield* htmlFiles(p);
    else if (it.name.endsWith('.html')) yield p;
  }
}

let count = 0;
for (const root of roots) {
  for await (const file of htmlFiles(root)) {
    const html = await fs.readFile(file, 'utf8');
    const out = html.replace(P, (m, href, bare) => {
      const ref = parseYouTube(unescape(href ?? bare));
      if (!ref) return m;
      count++;
      return youTubeHtml(ref);
    });
    if (out !== html) await fs.writeFile(file, out);
  }
}
if (count) console.log(`youtube: ${count} video link(s) turned into players`);
