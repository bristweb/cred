// Optional Cloudflare Pages Function (same file for the widget repo and data repos). With an empty or missing
// allowlist.json every request is served, with Access-Control-Allow-Origin: *. With hosts listed, a request whose
// Origin/Referer is another, unlisted host gets 403; "*.example.com" also matches subdomains. Requests with no
// Origin/Referer (direct visits, crawlers) and from the host itself are always served.
// This deters hotlinking; it is not access control (headers can be omitted or forged).
let cached;
async function allowlist(context) {
  if (!cached) {
    try {
      const res = await context.env.ASSETS.fetch(new URL('/allowlist.json', context.request.url));
      cached = (await res.json()).allowed_origins || [];
    } catch { cached = []; }
  }
  return cached;
}
const hostOf = v => { try { return new URL(v).hostname.toLowerCase(); } catch { return null; } };
const matches = (host, list) => list.some(e => {
  e = String(e).toLowerCase();
  return e.startsWith('*.') ? host.endsWith(e.slice(1)) : host === e;
});

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const list = await allowlist(context);
  const caller = hostOf(request.headers.get('Origin') || request.headers.get('Referer') || '');
  if (list.length && caller && caller !== url.hostname && !matches(caller, list)) {
    return new Response('Forbidden', { status: 403, headers: { 'Vary': 'Origin, Referer' } });
  }
  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set('Access-Control-Allow-Origin', '*');
  out.headers.append('Vary', 'Origin, Referer');
  return out;
}
