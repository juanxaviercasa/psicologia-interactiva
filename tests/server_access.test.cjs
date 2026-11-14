const { test } = require('node:test');
const assert = require('node:assert/strict');

test('Server blocks internal pages and course assets without configuration', async () => {
  const { onRequest } = await import('../functions/_middleware.js');
  for (const path of ['/app.html', '/biblioteca', '/js/books/example_data.js', '/js/coleccion_data.js', '/libros/example.pdf']) {
    let served = false;
    const response = await onRequest({ request: new Request('https://cortex.sistemazenit.com' + path), env: {}, next: () => { served = true; return new Response('private'); } });
    assert.equal(served, false, path);
    assert.equal(response.status, 503, path);
  }
});

test('Server keeps landing, checkout, OAuth and marketing images public', async () => {
  const { onRequest } = await import('../functions/_middleware.js');
  for (const path of ['/', '/api/checkout', '/api/auth/login', '/api/auth/callback', '/js/visuals/cortex-open-doors.png']) {
    const response = await onRequest({ request: new Request('https://cortex.sistemazenit.com' + path), env: {}, next: () => new Response('public') });
    assert.equal(await response.text(), 'public', path);
  }
});
