const { test } = require('node:test');
const assert = require('node:assert/strict');
test('Private media requires configuration and validates keys', async () => {
  const { onRequestGet } = await import('../functions/api/media.js');
  assert.equal((await onRequestGet({ request: new Request('https://example.com/api/media?key=a'), env: {} })).status, 503);
  assert.equal((await onRequestGet({ request: new Request('https://example.com/api/media?key=../a'), env: { MEDIA_PRIVATE: {}, SESSION_SECRET: 'test', WHOP_API_KEY: 'test' } })).status, 400);
});
test('Authorized private audio supports byte ranges and refuses anonymous access', async () => {
  const { onRequestGet } = await import('../functions/api/media.js');
  const { seal } = await import('../functions/_lib.js');
  const token = await seal({ userId: 'user_test' }, 'test');
  const env = { SESSION_SECRET: 'test', WHOP_API_KEY: 'test', WHOP_PRODUCT_ID: 'prod_test', MEDIA_PRIVATE: { head: async () => ({ size: 10 }), get: async (key, options) => ({ body: '234', httpEtag: 'test', writeHttpMetadata: h => h.set('content-type', 'audio/mp4') }) } };
  const original = global.fetch;
  global.fetch = async () => Response.json({ has_access: true });
  try {
    assert.equal((await onRequestGet({ request: new Request('https://example.com/api/media?key=audio.m4a'), env })).status, 401);
    const response = await onRequestGet({ request: new Request('https://example.com/api/media?key=audio.m4a', { headers: { cookie: 'cortex_session=' + token, range: 'bytes=2-4' } }), env });
    assert.equal(response.status, 206);
    assert.equal(response.headers.get('content-range'), 'bytes 2-4/10');
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
  } finally { global.fetch = original; }
});
