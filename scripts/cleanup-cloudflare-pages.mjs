const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const projectName = process.env.CLOUDFLARE_PAGES_PROJECT;
const token = process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !projectName || !token) {
  throw new Error('Missing CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_PAGES_PROJECT or CLOUDFLARE_API_TOKEN');
}

const api = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`;
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

const response = await fetch(api, { headers });
const payload = await response.json();
if (!response.ok) throw new Error(`List deployments failed: ${response.status} ${JSON.stringify(payload.errors)}`);
if (!payload.success) throw new Error(JSON.stringify(payload.errors));

const deployments = payload.result ?? [];
const production = deployments
  .filter((deployment) => deployment.environment === 'production' && deployment.source?.type === 'github')
  .sort((a, b) => new Date(b.created_on) - new Date(a.created_on));
const keep = production.find((deployment) => deployment.latest === true && deployment.deployment_trigger?.type !== 'rollback') ?? production[0];
if (!keep) {
  console.log('No production deployment found; nothing to delete.');
  process.exit(0);
}

const candidates = production.filter((deployment) => deployment.id !== keep.id);
for (const deployment of candidates) {
  const deletion = await fetch(`${api}/${deployment.id}`, { method: 'DELETE', headers });
  if (!deletion.ok) throw new Error(`Delete ${deployment.id} failed: ${deletion.status}`);
  const result = await deletion.json();
  if (!result.success) throw new Error(JSON.stringify(result.errors));
  console.log(`Deleted ${deployment.id}`);
}
console.log(`Kept ${keep.id}; deleted ${candidates.length} older production deployments.`);
