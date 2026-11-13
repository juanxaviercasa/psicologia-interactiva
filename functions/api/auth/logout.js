import { cookie, parseCookies, redirect, unseal } from '../../_lib.js';

export async function onRequestGet({ request, env }) {
  const cookies = parseCookies(request); const session = await unseal(cookies.cortex_session, env.SESSION_SECRET);
  if (session?.refreshToken && env.WHOP_CLIENT_ID) await fetch('https://api.whop.com/oauth/revoke', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ token: session.refreshToken, client_id: env.WHOP_CLIENT_ID }) }).catch(() => {});
  return redirect('/', { 'Set-Cookie': cookie('cortex_session', '', { maxAge: 0 }) });
}
