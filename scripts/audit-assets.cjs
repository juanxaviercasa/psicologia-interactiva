const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.join(__dirname, '..');
const assetRoot = path.join(root, 'assets');
const hashes = new Map();
let files = 0;
let totalBytes = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile()) {
      const stat = fs.statSync(full);
      const hash = crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex');
      const relative = path.relative(root, full);
      files += 1;
      totalBytes += stat.size;
      if (!hashes.has(hash)) hashes.set(hash, []);
      hashes.get(hash).push({ relative, bytes: stat.size });
    }
  }
}

walk(assetRoot);
const duplicateGroups = [...hashes.values()].filter(group => group.length > 1);
const duplicateBytes = duplicateGroups.reduce((sum, group) => sum + group.slice(1).reduce((n, item) => n + item.bytes, 0), 0);

console.log(JSON.stringify({
  files,
  totalBytes,
  totalMiB: Number((totalBytes / 1048576).toFixed(2)),
  duplicateGroups: duplicateGroups.length,
  duplicateBytes,
  duplicateMiB: Number((duplicateBytes / 1048576).toFixed(2)),
  groups: duplicateGroups.slice(0, 20)
}, null, 2));
