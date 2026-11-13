import { json } from '../_lib.js';

export async function onRequestGet({ env }) {
  const configured = Boolean(env.WHOP_CHECKOUT_URL);
  return json(configured ? { configured: true, label: env.OFFER_LABEL || 'Acceso premium', description: env.OFFER_DESCRIPTION || 'Biblioteca, rutas interactivas y práctica guiada para aprender a tu ritmo.', cta: env.OFFER_CTA || 'Empezar ahora' } : { configured: false });
}
