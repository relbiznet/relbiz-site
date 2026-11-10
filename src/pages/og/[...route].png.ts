// Generates a 1200×630 social sharing image for every page at build time.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const font600 = fs.readFileSync(path.join(root, 'src/fonts/Manrope-600.ttf'));
const font800 = fs.readFileSync(path.join(root, 'src/fonts/Manrope-800.ttf'));
const logo = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(root, 'public/images/relbiz-logo.svg')).toString('base64');

export async function getStaticPaths() {
  const pages = [
    { route: 'home', section: 'B2B network since 2015', title: 'Trusted partners across borders — introduced by their own associations' },
    { route: 'services', section: 'Services', title: 'Services and offers for international business' },
    { route: 'countries', section: 'Countries', title: 'Partner associations in 19 countries' },
    { route: 'news', section: 'News', title: 'News, offers and opportunities' },
    { route: 'contacts', section: 'Contacts', title: 'We are ready to help — in your language' },
    { route: 'privacy', section: 'Legal', title: 'Privacy and cookie policy' },
    { route: '404', section: 'RelBiz.NET', title: 'Page not found' },
  ];
  for (const s of await getCollection('services')) pages.push({ route: `services/${s.id}`, section: s.data.category, title: s.data.title });
  for (const n of await getCollection('news')) pages.push({ route: `news/${n.id}`, section: n.data.tag ?? 'News', title: n.data.title });
  for (const c of await getCollection('countries')) pages.push({ route: `countries/${c.id}`, section: c.data.region, title: `Business partners in ${c.data.name}` });
  return pages.map((p) => ({ params: { route: p.route }, props: p }));
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export const GET: APIRoute = async ({ props }) => {
  const { section, title } = props as { section: string; title: string };
  const size = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: '#F3F6FA', fontFamily: 'Manrope', position: 'relative' }, [
    h('div', { position: 'absolute', left: 0, top: 0, width: 16, height: 630, background: '#1F4FBF', display: 'flex' }),
    h('div', { position: 'absolute', right: -120, top: -120, width: 460, height: 460, borderRadius: 460, border: '2px solid #DCE4EF', display: 'flex' }),
    { type: 'img', props: { src: logo, width: 342, height: 80 } },
    h('div', { display: 'flex', flexDirection: 'column' }, [
      h('div', { fontSize: 30, fontWeight: 600, color: '#1F4FBF', marginBottom: 18, display: 'flex' }, section),
      h('div', { fontSize: size, fontWeight: 800, color: '#0B1F3A', lineHeight: 1.08, letterSpacing: -1.5, display: 'flex', maxWidth: 1020 }, title),
    ]),
    h('div', { display: 'flex', alignItems: 'center', gap: 14, fontSize: 26, fontWeight: 600, color: '#3A4A63' }, [
      h('div', { width: 14, height: 14, borderRadius: 14, background: '#E8B400', display: 'flex' }),
      h('div', { display: 'flex' }, 'relbiz.net · Built within the EU programme East Invest 2'),
    ]),
  ]);
  const svg = await satori(tree as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Manrope', data: font600, weight: 600, style: 'normal' },
      { name: 'Manrope', data: font800, weight: 800, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
