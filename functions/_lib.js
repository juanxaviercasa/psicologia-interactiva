const enc = new TextEncoder();
const dec = new TextDecoder();

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
}

export function redirect(location, headers = {}) {
  const result = new Headers({ Location: location, 'cache-control': 'no-store' });
  for (const [name, value] of Object.entries(headers)) {
    for (const item of Array.isArray(value) ? value : [value]) result.append(name, item);
  }
  return new Response(null, { status: 302, headers: result });
}

export function parseCookies(request) {
  return Object.fromEntries((request.headers.get('cookie') || '').split(';').map(v => v.trim()).filter(Boolean).map(v => { const i = v.indexOf('='); return [i > -1 ? v.slice(0, i) : v, i > -1 ? decodeURIComponent(v.slice(i + 1)) : '']; }));
}

export function cookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  parts.push(`Path=${options.path || '/'}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.secure !== false) parts.push('Secure');
  parts.push(`SameSite=${options.sameSite || 'Lax'}`);
  return parts.join('; ');
}

function b64(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, ''); }
function unb64(value) { const s = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '='); return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }
export function randomToken(size = 32) { const bytes = crypto.getRandomValues(new Uint8Array(size)); return b64(bytes); }

async function keyFromSecret(secret) { const digest = await crypto.subtle.digest('SHA-256', enc.encode(secret)); return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']); }
export async function seal(value, secret) { const iv = crypto.getRandomValues(new Uint8Array(12)); const key = await keyFromSecret(secret); const body = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(JSON.stringify(value))); return `${b64(iv)}.${b64(body)}`; }
export async function unseal(value, secret) { if (!value || !secret) return null; try { const [iv, body] = value.split('.'); const key = await keyFromSecret(secret); const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(iv) }, key, unb64(body)); return JSON.parse(dec.decode(plain)); } catch { return null; } }

export async function whopFetch(path, token, init = {}) {
  const headers = new Headers(init.headers || {}); headers.set('authorization', `Bearer ${token}`); headers.set('accept', 'application/json');
  return fetch(`https://api.whop.com${path}`, { ...init, headers });
}

export function originOf(request) { return new URL(request.url).origin; }
export function missing(env, names) { return names.filter(name => !env[name]); }
