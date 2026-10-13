// Cloudflare Pages Function: serves the widget files (assets/, lang/, embed.html) only to pages whose
// Origin/Referer host is in allowlist.json. "*.example.com" also matches subdomains. Requests with no
// Origin/Referer (direct visits, crawlers) and everything else (docs, demo, example data) are served as usual.
// This deters hotlinking; it is not access control (headers can be omitted or forged).
const GATED = /^\/(assets\/|lang\/|embed\.html$)/;
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
  if (GATED.test(url.pathname)) {
    const caller = hostOf(request.headers.get('Origin') || request.headers.get('Referer') || '');
    if (caller && caller !== url.hostname && !matches(caller, await allowlist(context))) {
      return new Response('Forbidden', { status: 403, headers: { 'Vary': 'Origin, Referer' } });
    }
  }
  const res = await context.next();
  const out = new Response(res.body, res);
  out.headers.set('Access-Control-Allow-Origin', '*');
  out.headers.append('Vary', 'Origin, Referer');
  return out;
}
