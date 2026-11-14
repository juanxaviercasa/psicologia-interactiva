/**
 * Guardia compartida de acceso para rutas internas (biblioteca.html y app.html).
 * Permite previsualización local y mantiene acceso cuando Whop aún no está configurado
 * (`configured: false`), bloqueando en cuanto Whop esté activo en producción.
 */
(function initAccessGuard(globalScope) {
  function isLocalHostname(hostname) {
    return ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1'].includes(hostname);
  }

  function redirectToLanding(loc, reason) {
    loc.replace('/?access=' + encodeURIComponent(reason));
  }

  async function enforcePremiumAccess(options = {}) {
    const win = options.window || globalScope;
    const loc = win.location;
    const fetchFn = options.fetch || win.fetch;
    const doc = options.document !== undefined
      ? options.document
      : (win.document || (typeof document !== 'undefined' ? document : null));
    const rootStyle = doc && doc.documentElement && doc.documentElement.style;
    const reveal = () => {
      if (rootStyle) rootStyle.visibility = '';
    };

    if (!loc || loc.protocol === 'file:') {
      reveal();
      return { allowed: true, mode: 'local_file' };
    }

    const isLocalEnv = isLocalHostname(loc.hostname);
    if (rootStyle) rootStyle.visibility = 'hidden';

    try {
      const response = await fetchFn('/api/access', {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin'
      });
      const contentType = (response.headers && response.headers.get && response.headers.get('content-type')) || '';
      if (!contentType.includes('application/json')) {
        if (isLocalEnv) {
          reveal();
          return { allowed: true, mode: 'local_static' };
        }
        redirectToLanding(loc, 'verification_unavailable');
        return { allowed: false, reason: 'verification_unavailable' };
      }

      const access = await response.json();
      if (isLocalEnv && access && access.configured === false) {
        reveal();
        return { allowed: true, mode: 'not_configured' };
      }
      if (!response.ok || !access || !access.allowed) {
        if (response.status === 401) {
          loc.replace('/api/auth/login');
          return { allowed: false, reason: 'login_required' };
        }
        const reason = (access && access.reason) || (response.status === 401 ? 'login_required' : 'access_denied');
        redirectToLanding(loc, reason);
        return { allowed: false, reason };
      }

      reveal();
      return { allowed: true, mode: 'verified', user: access.user || null };
    } catch {
      if (isLocalEnv) {
        reveal();
        return { allowed: true, mode: 'local_offline' };
      }
      redirectToLanding(loc, 'verification_unavailable');
      return { allowed: false, reason: 'verification_unavailable' };
    }
  }

  globalScope.ZenitAccessGuard = { enforcePremiumAccess };
  if (!globalScope.__SKIP_AUTO_ACCESS_GUARD__) {
    enforcePremiumAccess();
  }
}(typeof window !== 'undefined' ? window : globalThis));
