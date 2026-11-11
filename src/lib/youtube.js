// YouTube support: turns a YouTube link into a privacy-friendly player.
// Nothing is loaded from YouTube until the visitor presses play (the same approach as the map on Contacts).
// Used by the "YouTube video" field in News and Services (src/components/YouTube.astro) and by
// scripts/youtube-embeds.mjs, which turns a YouTube link on a line of its own in the text into a player.

const ID = /^[A-Za-z0-9_-]{11}$/;

function seconds(t) {
  if (!t) return 0;
  if (/^\d+$/.test(t)) return Number(t);
  const m = t.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  return m ? Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0) : 0;
}

export function parseYouTube(raw) {
  if (!raw) return null;
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^(www\.|m\.|music\.)/, '');
  let id = '';
  let short = false;
  if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'watch') id = u.searchParams.get('v') ?? '';
    else if (['embed', 'live', 'shorts', 'v'].includes(parts[0])) {
      id = parts[1] ?? '';
      short = parts[0] === 'shorts';
    }
  }
  if (!ID.test(id)) return null;
  return { id, start: seconds(u.searchParams.get('t') ?? u.searchParams.get('start')), short };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function youTubeHtml(ref, title = 'Video') {
  const t = esc(title);
  return (
    `<div class="yt${ref.short ? ' yt--short' : ''}">` +
    `<button type="button" class="yt__play" data-yt="${ref.id}" data-start="${ref.start}" data-title="${t}" aria-label="Play video: ${t}">` +
    `<span class="yt__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>` +
    `<span class="yt__label">Play video</span>` +
    `<span class="yt__note">The video loads from YouTube when you press play.</span>` +
    `</button></div>`
  );
}

export function youTubeThumb(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

