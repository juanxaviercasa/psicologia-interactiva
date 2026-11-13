import { json, parseCookies, unseal } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  const session = await unseal(parseCookies(request).cortex_session, env.SESSION_SECRET);
  if (!session) return json({ authenticated: false });
  return json({ authenticated: true, user: { id: session.userId, name: session.name, email: session.email }, expiresAt: session.expiresAt });
}
