import { cookie, missing, randomToken, redirect } from '../../_lib.js';

export async function onRequestGet({ request, env }) {
  const absent = missing(env, ['WHOP_CLIENT_ID']);
  if (absent.length) return new Response('El login de Whop aún no está configurado.', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  const url = new URL(request.url);
  const redirectUri = env.WHOP_REDIRECT_URI || `${url.origin}/api/auth/callback`;
  const state = randomToken(24);
  const verifier = randomToken(48);
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  const params = new URLSearchParams({ response_type: 'code', client_id: env.WHOP_CLIENT_ID, redirect_uri: redirectUri, scope: env.WHOP_OAUTH_SCOPE || 'openid profile email', state, nonce: randomToken(16), code_challenge: challenge, code_challenge_method: 'S256' });
  return redirect(`https://api.whop.com/oauth/authorize?${params}`, { 'Set-Cookie': [cookie('cortex_oauth_state', state, { maxAge: 600 }), cookie('cortex_oauth_verifier', verifier, { maxAge: 600 })] });
}
