import { redirect } from '../_lib.js';

export async function onRequestGet({ env }) {
  if (!env.WHOP_CHECKOUT_URL) return new Response('El checkout de Whop aún no está configurado.', { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' } });
  // Preserve deployments with the previous business slug while using the
  // verified current product URL. Other configured checkouts remain unchanged.
  const checkoutUrl = env.WHOP_CHECKOUT_URL.replace(
    /^https:\/\/whop\.com\/quimica\/cortex-4d\/?$/,
    'https://whop.com/fenix357/cortex-4d/'
  );
  return redirect(checkoutUrl);
}
