import { onRequestGet as checkAccess } from './api/access.js';
import { redirect, json } from './_lib.js';

// Public marketing and authentication endpoints stay reachable. Course files
// and their metadata require a server-verified membership on every request.
export async function onRequest(context) {
  const path = decodeURIComponent(new URL(context.request.url).pathname);
  const protectedPath = /^\/(?:app|biblioteca)(?:\.html)?\/?$/i.test(path)
    || /^\/(?:libros|Psicologia_Oscura|Caja_Fuerte)(?:\/|$)/i.test(path)
    || (path.startsWith('/js/') && !path.startsWith('/js/visuals/') && path !== '/js/access_guard.js');
  if (!protectedPath) return context.next();
  let access;
  try { access = await checkAccess(context); }
  catch { return json({ error: 'access_verification_unavailable' }, 503); }
  const result = await access.json();
  if (!access.ok || result.allowed !== true) {
    const page = /^\/(?:app|biblioteca)(?:\.html)?\/?$/i.test(path);
    if (page && access.status === 401) return redirect('/api/auth/login');
    return json({ error: result.reason || 'membership_required' }, access.status === 401 ? 401 : access.status >= 500 ? 503 : 403);
  }
  const upstream = await context.next();
  const response = new Response(upstream.body, upstream);
  // Preserve content type, status and other asset headers while forbidding
  // shared/browser caching of paid content across membership changes.
  response.headers.set('cache-control', 'private, no-store');
  response.headers.set('vary', 'Cookie');
  return response;
}
