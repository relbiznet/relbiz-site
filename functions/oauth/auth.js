// GitHub OAuth for the admin panel (Cloudflare Pages Function).
// Needs environment variables GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in Cloudflare Pages settings.
export async function onRequestGet({ request, env }) {
  if (!env.GITHUB_CLIENT_ID) return new Response('GITHUB_CLIENT_ID is not configured', { status: 500 });
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    redirect_uri: `${url.origin}/oauth/callback`,
    scope: url.searchParams.get('scope') || 'repo,user',
    state,
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: `https://github.com/login/oauth/authorize?${params}`,
      'Set-Cookie': `oauth_state=${state}; Path=/oauth; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
