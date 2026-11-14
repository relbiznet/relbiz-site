// Social sharing image built from the entry's own title illustration (News, Services):
// the image is cropped to 1200×630 (the Open Graph size) and saved as JPEG, which every
// network accepts. Entries without a local illustration use the generated card ([...route].png.ts).
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { coverFile } from '../../lib/og';

export async function getStaticPaths() {
  const pages: { route: string; file: string }[] = [];
  for (const n of await getCollection('news', (e) => !e.data.draft)) {
    const file = coverFile(n.data.image);
    if (file) pages.push({ route: `news/${n.id}`, file });
  }
  for (const s of await getCollection('services', (e) => !e.data.draft)) {
    const file = coverFile(s.data.image);
    if (file) pages.push({ route: `services/${s.id}`, file });
  }
  return pages.map((p) => ({ params: { route: p.route }, props: p }));
}

export const GET: APIRoute = async ({ props }) => {
  const { file } = props as { file: string };
  const jpg = await sharp(file, { failOn: 'none' })
    .rotate()
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    .flatten({ background: '#FFFFFF' })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
