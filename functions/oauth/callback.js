// Completes the GitHub OAuth flow and hands the token back to the admin window.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = (request.headers.get('Cookie') || '').match(/oauth_state=([^;]+)/)?.[1];

  let status = 'error';
  let content = { message: 'Authorization failed' };

  if (code && state && cookieState && state === cookieState) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'User-Agent': 'relbiz-admin' },
      body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code }),
    });
    const data = await res.json();
    if (data.access_token) {
      status = 'success';
      content = { token: data.access_token, provider: 'github' };
    } else {
      content = { message: data.error_description || 'No access token received' };
    }
  }

  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const html = `<!doctype html><html><body><script>
    (function () {
      function receive(e) {
        window.opener.postMessage(${JSON.stringify(message)}, e.origin);
        window.removeEventListener('message', receive, false);
      }
      window.addEventListener('message', receive, false);
      window.opener.postMessage('authorizing:github', '*');
    })();
  </script><p>Signing in…</p></body></html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Set-Cookie': 'oauth_state=; Path=/oauth; Max-Age=0' },
  });
}
