// Social sharing (Open Graph / Twitter) and structured-data images.
//
// Priority for a page's sharing image:
//   1. "Image for social networks" from the SEO block (explicit override);
//   2. the entry's own title illustration (News, Services) — cropped to 1200×630 JPEG
//      at build time by src/pages/og/[...route].jpg.ts;
//   3. the generated text card (src/pages/og/[...route].png.ts).
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC = path.join(process.cwd(), 'public');

/** File path on disk for a site-relative image (/images/…, /uploads/…), or null if it is external or missing. */
export function coverFile(src?: string): string | null {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return null;
  const file = path.join(PUBLIC, decodeURIComponent(src.split(/[?#]/)[0]));
  if (!file.startsWith(PUBLIC + path.sep)) return null;
  return fs.existsSync(file) ? file : null;
}

/** Route part for the /og/ images, e.g. "/news/foo/" → "news/foo", "/" → "home". */
export const ogRoute = (pathname: string) => (pathname === '/' ? 'home' : pathname.replace(/^\/|\/$/g, ''));

/** Site-relative URL of the 1200×630 crop of the entry's illustration, or null if there is none. */
export const coverOgPath = (pathname: string, cover?: string) =>
  coverFile(cover) ? `/og/${ogRoute(pathname)}.jpg` : null;
