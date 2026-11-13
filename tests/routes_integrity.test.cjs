const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

async function runAccessGuard({ url, fetchImpl }) {
  const script = fs.readFileSync('js/access_guard.js', 'utf8');
  const parsed = new URL(url);
  const replaced = [];
  const docStyle = { visibility: '' };
  const context = vm.createContext({
    encodeURIComponent,
    fetch: fetchImpl,
    window: {
      __SKIP_AUTO_ACCESS_GUARD__: true,
      document: { documentElement: { style: docStyle } },
      location: {
        protocol: parsed.protocol,
        hostname: parsed.hostname,
        replace(target) {
          replaced.push(target);
        }
      }
    },
    document: { documentElement: { style: docStyle } }
  });
  vm.runInContext(script, context);
  const result = await context.window.ZenitAccessGuard.enforcePremiumAccess({ fetch: fetchImpl });
  return { replaced, visibility: docStyle.visibility, result };
}

test('La portada index.html no expone el catálogo público y enlaza oferta + login Whop', () => {
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const sitemapXml = fs.readFileSync('sitemap.xml', 'utf8');
  const robotsTxt = fs.readFileSync('robots.txt', 'utf8');

  assert.match(indexHtml, /<link rel="canonical" href="https:\/\/cortex\.sistemazenit\.com\/">/);
  assert.doesNotMatch(indexHtml, /id="catalog-grid"/);
  assert.doesNotMatch(indexHtml, /js\/coleccion_data\.js/);
  assert.match(indexHtml, /href="\/api\/auth\/login"/);
  assert.match(indexHtml, /href="#oferta"/);

  assert.equal(fs.existsSync('landing.html'), false);
  assert.doesNotMatch(sitemapXml, /biblioteca\.html|landing\.html|app\.html/);
  assert.match(sitemapXml, /https:\/\/cortex\.sistemazenit\.com\/<\/loc>/);
  assert.match(robotsTxt, /Disallow:\s*\/biblioteca/);
  assert.match(robotsTxt, /Disallow:\s*\/app/);
});

test('Las rutas internas biblioteca.html y app.html usan access_guard.js, noindex y navegación interna coherente', () => {
  const bibHtml = fs.readFileSync('biblioteca.html', 'utf8');
  const appHtml = fs.readFileSync('app.html', 'utf8');
  const callbackJs = fs.readFileSync('functions/api/auth/callback.js', 'utf8');

  for (const html of [bibHtml, appHtml]) {
    assert.match(html, /<meta name="robots" content="noindex,follow">/);
    assert.match(html, /src="js\/access_guard\.js\?v=1\.0"/);
  }
  assert.match(bibHtml, /href="app\.html"/);
  assert.match(bibHtml, /href="\/api\/auth\/logout"/);
  assert.match(appHtml, /href="biblioteca\.html"/);
  assert.match(callbackJs, /redirect\('\/biblioteca\.html'/);
});

test('No quedan URLs rotas con Introducción.webp ni referencias locales assets/ en HTML/JS publicados', () => {
  const dirs = ['.', 'js', 'js/books'];
  for (const dir of dirs) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (!fs.statSync(full).isFile() || !/\.(html|js|css|xml)$/i.test(file)) continue;
      const content = fs.readFileSync(full, 'utf8');
      assert.equal(content.includes('Introducción.webp'), false, `URL rota Introducción.webp en ${full}`);
      const localAsset = content.match(/['"`](?:\.\/|\/)?assets\/[^'"`\\]+/);
      assert.equal(localAsset, null, `Ruta local assets/ sin CDN en ${full}: ${localAsset?.[0]}`);
    }
  }
});

test('Las flashcards sin arte propio hacen fallback a la portada del libro en vez de pedir tarjetas 404', () => {
  const wrapperClassList = new Set();
  const imgEl = {
    attributes: {},
    parentElement: {
      classList: {
        add(c) { wrapperClassList.add(c); },
        remove(c) { wrapperClassList.delete(c); }
      }
    },
    removeAttribute(k) { delete this.attributes[k]; this.src = ''; }
  };
  const elements = {
    fcFrontText: { textContent: '' },
    fcBackText: { textContent: '' },
    fcMnemonicText: { textContent: '' },
    fcCounterText: { textContent: '' },
    fcCategoryBadge: { textContent: '' },
    fcFrontImg: imgEl,
    mainFlashcard: { classList: { remove() {} } },
    fcFlipToggle: { setAttribute() {} }
  };
  const context = vm.createContext({
    console,
    document: { addEventListener() {}, getElementById(id) { return elements[id] || null; } },
    window: {
      ACTIVE_BOOK_DATA: { coverImage: 'https://cdn.cortex.sistemazenit.com/assets/img/covers/cover_book_col-021.webp' },
      location: { search: '' },
      scrollTo() {}
    },
    localStorage: { getItem() { return null; }, setItem() {} },
    sessionStorage: { getItem() { return null; } },
    URLSearchParams,
    Date,
    Math,
    JSON
  });
  vm.runInContext(fs.readFileSync('js/app.js', 'utf8'), context);
  const app = vm.runInContext('App', context);

  app.state.filteredFlashcards = [{ id: 'fc1', front: 'Q1', back: 'A1' }, { id: 'f1', front: 'Q2', back: 'A2' }];
  app.state.currentFlashcardIndex = 0;
  app.renderCurrentFlashcard();
  assert.equal(imgEl.src, 'https://cdn.cortex.sistemazenit.com/assets/img/covers/cover_book_col-021.webp');
  assert.equal(wrapperClassList.has('hidden'), false);

  app.state.currentFlashcardIndex = 1;
  app.renderCurrentFlashcard();
  assert.equal(imgEl.src, 'https://cdn.cortex.sistemazenit.com/assets/img/psicologia_obscura_6en1/flashcards/f1.jpg');

  imgEl.onerror();
  assert.equal(imgEl.src, 'https://cdn.cortex.sistemazenit.com/assets/img/covers/cover_book_col-021.webp');
  imgEl.onerror();
  assert.equal(wrapperClassList.has('hidden'), true);
});

test('ZenitAccessGuard oculta flicker durante verificación, permite local/no-configurado y bloquea si Whop deniega', async () => {
  const fileRes = await runAccessGuard({
    url: 'file:///C:/biblioteca.html',
    fetchImpl: async () => { throw new Error('should not fetch'); }
  });
  assert.deepEqual(fileRes.replaced, []);
  assert.equal(fileRes.visibility, '');

  const localRes = await runAccessGuard({
    url: 'http://localhost:8080/biblioteca.html',
    fetchImpl: async () => ({
      ok: false,
      status: 404,
      headers: { get: () => 'text/html; charset=utf-8' }
    })
  });
  assert.deepEqual(localRes.replaced, []);
  assert.equal(localRes.visibility, '');

  const uncfgRes = await runAccessGuard({
    url: 'https://cortex.sistemazenit.com/biblioteca',
    fetchImpl: async () => ({
      ok: false,
      status: 503,
      headers: { get: () => 'application/json' },
      json: async () => ({ allowed: false, configured: false, reason: 'access_not_configured' })
    })
  });
  assert.deepEqual(uncfgRes.replaced, []);
  assert.equal(uncfgRes.visibility, '');

  const deniedRes = await runAccessGuard({
    url: 'https://cortex.sistemazenit.com/biblioteca',
    fetchImpl: async () => ({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ allowed: false, authenticated: false })
    })
  });
  assert.deepEqual(deniedRes.replaced, ['/?access=login_required']);
  assert.equal(deniedRes.visibility, 'hidden');

  const okRes = await runAccessGuard({
    url: 'https://cortex.sistemazenit.com/app',
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ allowed: true, authenticated: true })
    })
  });
  assert.deepEqual(okRes.replaced, []);
  assert.equal(okRes.visibility, '');
});
