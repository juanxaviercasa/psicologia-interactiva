import { json } from '../_lib.js';

export async function onRequestGet({ env }) {
  const configured = Boolean(env.WHOP_CHECKOUT_URL);
  return json(configured ? { configured: true, label: env.OFFER_LABEL || 'Acceso premium', description: env.OFFER_DESCRIPTION || 'Acceso educativo verificado con Whop.', cta: env.OFFER_CTA || 'Obtener acceso' } : { configured: false });
}
