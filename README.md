# relbiz.net

Website of RelBiz.NET — built with [Astro](https://astro.build), hosted on Cloudflare Pages, edited through the admin panel at `/admin/` (Sveltia CMS, Decap-compatible).

## Editing content
Open `https://relbiz.net/admin/`, sign in with GitHub and edit **News**, **Services**, **Countries** or **Site settings**. Every save is a commit to this repository; Cloudflare Pages rebuilds the site in about a minute.

## Local development
```
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

## Structure
- `src/content/news|services|countries` — content (Markdown with front matter)
- `src/data/site.json` — contacts, legal details, analytics IDs, form key
- `src/pages` — page templates; `src/pages/og` generates social sharing images
- `public/_redirects` — 301 redirects from the old Joomla URLs
- `functions/oauth` — GitHub sign-in for the admin panel (needs `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Cloudflare Pages → Settings → Variables)

## Cloudflare Pages settings
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `NODE_VERSION = 22`
