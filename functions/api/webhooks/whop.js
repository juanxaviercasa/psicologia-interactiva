import { json } from '../../_lib.js';

const enc = new TextEncoder();
function hexOrBytes(value) { return value instanceof Uint8Array ? value : enc.encode(value); }
async function verify(payload, headers, secret) {
  const id = headers.get('webhook-id'); const timestamp = headers.get('webhook-timestamp'); const signature = headers.get('webhook-signature') || '';
  if (!id || !timestamp || !signature) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp)); if (!Number.isFinite(age) || age > 300) return false;
  const key = await crypto.subtle.importKey('raw', hexOrBytes(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(`${id}.${timestamp}.${payload}`)));
  const expected = btoa(String.fromCharCode(...digest));
  return signature.split(' ').some(part => part.startsWith('v1,') && part.slice(3) === expected);
}

export async function onRequestPost({ request, env }) {
  if (!env.WHOP_WEBHOOK_SECRET) return json({ ok: false, error: 'webhook_not_configured' }, 503);
  const payload = await request.text();
  if (!await verify(payload, request.headers, env.WHOP_WEBHOOK_SECRET)) return json({ ok: false, error: 'invalid_signature' }, 401);
  let event; try { event = JSON.parse(payload); } catch { return json({ ok: false, error: 'invalid_json' }, 400); }
  if (env.CORTEX_EVENTS?.put && event.id) await env.CORTEX_EVENTS.put(`whop:${event.id}`, JSON.stringify({ type: event.type, receivedAt: new Date().toISOString() }), { expirationTtl: 60 * 60 * 24 * 90 }).catch(() => {});
  return json({ ok: true, accepted: event.type || 'unknown' });
}
