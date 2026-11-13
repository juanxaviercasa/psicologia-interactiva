import { redirect } from '../_lib.js';

export async function onRequestGet({ env }) {
  if (!env.WHOP_CHECKOUT_URL) return new Response('El checkout de Whop aún no está configurado.', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  return redirect(env.WHOP_CHECKOUT_URL);
}
