import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  buildSessionPayload,
  validateConfig,
} from './lib/devin-api-demo.mjs';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const configPath = path.join(
  repositoryRoot,
  'config/devin-api-autotest.json'
);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
validateConfig(config);

const submit = process.argv.includes('--submit');
const payload = buildSessionPayload(config);

if (!submit) {
  console.log(
    JSON.stringify(
      {
        mode: 'dry-run',
        endpoint: 'https://api.devin.ai/v3/organizations/{org_id}/sessions',
        authorization: 'Bearer [redacted service-user credential]',
        payload,
      },
      null,
      2
    )
  );
  process.exit(0);
}

const apiKey = process.env['DEVIN_API_KEY'];
const orgId = process.env['DEVIN_ORG_ID'];
if (!apiKey || !orgId) {
  throw new Error('DEVIN_API_KEY and DEVIN_ORG_ID are required for --submit');
}
if (!/^org-[A-Za-z0-9_-]+$/.test(orgId)) {
  throw new Error('DEVIN_ORG_ID has an unexpected format');
}

const response = await fetch(
  `https://api.devin.ai/v3/organizations/${encodeURIComponent(orgId)}/sessions`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  }
);

if (!response.ok) {
  throw new Error(`Devin API rejected the session kickoff (${response.status})`);
}

const session = await response.json();
const evidence = {
  createdAt: new Date().toISOString(),
  repository: config.repository,
  sourceBranch: config.sourceBranch,
  sessionId: session.session_id,
  sessionUrl: session.url,
  status: session.status ?? 'created',
};
const evidenceDir = path.join(repositoryRoot, 'evidence/devin-api');
fs.mkdirSync(evidenceDir, { recursive: true });
fs.writeFileSync(
  path.join(evidenceDir, 'session.json'),
  `${JSON.stringify(evidence, null, 2)}\n`,
  { mode: 0o600 }
);
console.log(JSON.stringify(evidence, null, 2));
