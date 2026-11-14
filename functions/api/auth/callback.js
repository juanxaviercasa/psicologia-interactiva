import { cookie, json, parseCookies, redirect, seal } from '../../_lib.js';

export async function onRequestGet({ request, env }) {
  if (!env.WHOP_CLIENT_ID || !env.SESSION_SECRET) return new Response('La autenticación aún no está configurada.', { status: 503 });
  const url = new URL(request.url); const params = url.searchParams; const cookies = parseCookies(request);
  if (params.get('error')) return redirect(`/?auth_error=${encodeURIComponent(params.get('error_description') || params.get('error'))}`);
  if (!params.get('code') || !params.get('state') || params.get('state') !== cookies.cortex_oauth_state || !cookies.cortex_oauth_verifier) return new Response('Solicitud OAuth inválida o expirada.', { status: 400 });
  const redirectUri = env.WHOP_REDIRECT_URI || `${url.origin}/api/auth/callback`;
  const tokenResponse = await fetch('https://api.whop.com/oauth/token', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ grant_type: 'authorization_code', code: params.get('code'), redirect_uri: redirectUri, client_id: env.WHOP_CLIENT_ID, client_secret: env.WHOP_CLIENT_SECRET, code_verifier: cookies.cortex_oauth_verifier }) });
  if (!tokenResponse.ok) return new Response('No se pudo completar el login con Whop.', { status: 502 });
  const tokens = await tokenResponse.json();
  const infoResponse = await fetch('https://api.whop.com/oauth/userinfo', { headers: { authorization: `Bearer ${tokens.access_token}`, accept: 'application/json' } });
  if (!infoResponse.ok) return new Response('No se pudo verificar el usuario de Whop.', { status: 502 });
  const user = await infoResponse.json();
  const session = { userId: user.sub, name: user.name || user.preferred_username || '', email: user.email || '', accessToken: tokens.access_token, refreshToken: tokens.refresh_token || '', expiresAt: Date.now() + Number(tokens.expires_in || 3600) * 1000 };
  const value = await seal(session, env.SESSION_SECRET);
  return redirect('/biblioteca.html', { 'Set-Cookie': [cookie('cortex_session', value, { maxAge: 60 * 60 * 24 * 30 }), cookie('cortex_oauth_state', '', { maxAge: 0 }), cookie('cortex_oauth_verifier', '', { maxAge: 0 })] });
}
