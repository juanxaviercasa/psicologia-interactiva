import { json, parseCookies, unseal, whopFetch } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  if (!env.MEDIA_PRIVATE || !env.SESSION_SECRET || !env.WHOP_API_KEY) return json({ error: 'private_media_not_configured' }, 503);
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!key || key.includes('..') || key.startsWith('/') || /[\\\x00-\x1f]/.test(key)) return json({ error: 'invalid_media_key' }, 400);
  const session = await unseal(parseCookies(request).cortex_session, env.SESSION_SECRET);
  if (!session?.userId) return json({ error: 'authentication_required' }, 401);
  const resourceId = env.WHOP_EXPERIENCE_ID || env.WHOP_PRODUCT_ID;
  if (!resourceId) return json({ error: 'access_resource_not_configured' }, 503);
  const accessResponse = await whopFetch(`/api/v1/users/${encodeURIComponent(session.userId)}/access/${encodeURIComponent(resourceId)}`, env.WHOP_API_KEY, { headers: { 'Api-Version-Date': env.WHOP_API_VERSION_DATE || '2026-08-14' } });
  if (!accessResponse.ok || !(await accessResponse.json()).has_access) return json({ error: 'premium_access_required' }, 403);
  const metadata = await env.MEDIA_PRIVATE.head(key);
  if (!metadata) return json({ error: 'media_not_found' }, 404);
  const rangeHeader = request.headers.get('range');
  let range;
  if (rangeHeader) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
    const invalid = () => new Response(null, { status: 416, headers: { 'content-range': `bytes */${metadata.size}`, 'cache-control': 'no-store' } });
    if (!match || (!match[1] && !match[2])) return invalid();
    const start = match[1] ? Number(match[1]) : Math.max(0, metadata.size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), metadata.size - 1) : metadata.size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= metadata.size) return invalid();
    range = { offset: start, length: end - start + 1 };
  }
  const object = await env.MEDIA_PRIVATE.get(key, range ? { range } : undefined);
  if (!object) return json({ error: 'media_not_found' }, 404);
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set('etag', object.httpEtag); headers.set('cache-control', 'private, no-store');
  headers.set('accept-ranges', 'bytes');
  headers.set('x-content-type-options', 'nosniff');
  headers.set('vary', 'Cookie, Range');
  headers.set('content-length', String(range ? range.length : metadata.size));
  if (range) headers.set('content-range', `bytes ${range.offset}-${range.offset + range.length - 1}/${metadata.size}`);
  return new Response(object.body, { status: range ? 206 : 200, headers });
}
