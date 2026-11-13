const { readdir } = require('node:fs/promises');
const { join, relative } = require('node:path');
const { pathToFileURL } = require('node:url');

async function files(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await files(path));
    else if (entry.name.endsWith('.js')) out.push(path);
  }
  return out;
}

(async () => {
  const root = join(process.cwd(), 'functions');
  const paths = await files(root);
  for (const path of paths) await import(`${pathToFileURL(path).href}?check=${Date.now()}`);
  console.log(`Validated ${paths.length} Pages Functions`);
})().catch(error => { console.error(error); process.exit(1); });
