import { json, parseCookies, unseal, whopFetch } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  if (!env.MEDIA_PRIVATE || !env.SESSION_SECRET || !env.WHOP_API_KEY) return json({ error: 'private_media_not_configured' }, 503);
  const key = new URL(request.url).searchParams.get('key') || '';
  if (!key || key.includes('..') || key.startsWith('/')) return json({ error: 'invalid_media_key' }, 400);
  const session = await unseal(parseCookies(request).cortex_session, env.SESSION_SECRET);
  if (!session?.userId) return json({ error: 'authentication_required' }, 401);
  const resourceId = env.WHOP_EXPERIENCE_ID || env.WHOP_PRODUCT_ID;
  if (!resourceId) return json({ error: 'access_resource_not_configured' }, 503);
  const accessResponse = await whopFetch(`/api/v1/users/${encodeURIComponent(session.userId)}/access/${encodeURIComponent(resourceId)}`, env.WHOP_API_KEY, { headers: { 'Api-Version-Date': env.WHOP_API_VERSION_DATE || '2026-08-14' } });
  if (!accessResponse.ok || !(await accessResponse.json()).has_access) return json({ error: 'premium_access_required' }, 403);
  const object = await env.MEDIA_PRIVATE.get(key);
  if (!object) return json({ error: 'media_not_found' }, 404);
  const headers = new Headers(); object.writeHttpMetadata(headers); headers.set('etag', object.httpEtag); headers.set('cache-control', 'private, max-age=300');
  return new Response(object.body, { headers });
}
