import { json, missing, parseCookies, unseal, whopFetch } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  const absent = missing(env, ['SESSION_SECRET', 'WHOP_API_KEY']);
  if (absent.length) return json({ allowed: false, configured: false, reason: 'access_not_configured' }, 503);
  const session = await unseal(parseCookies(request).cortex_session, env.SESSION_SECRET);
  if (!session?.userId) return json({ allowed: false, authenticated: false }, 401);
  const resourceId = env.WHOP_EXPERIENCE_ID || env.WHOP_PRODUCT_ID;
  if (!resourceId) return json({ allowed: false, configured: false, reason: 'resource_not_configured' }, 503);
  const response = await whopFetch(`/api/v1/users/${encodeURIComponent(session.userId)}/access/${encodeURIComponent(resourceId)}`, env.WHOP_API_KEY, { headers: { 'Api-Version-Date': env.WHOP_API_VERSION_DATE || '2026-08-14' } });
  if (!response.ok) return json({ allowed: false, reason: 'whop_check_failed' }, 502);
  const data = await response.json();
  return json({ allowed: Boolean(data.has_access), authenticated: true, accessLevel: data.access_level || 'no_access', user: { name: session.name, email: session.email } });
}
