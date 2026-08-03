import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPrompt,
  buildSessionPayload,
  validateConfig,
} from './lib/devin-api-demo.mjs';

const config = {
  schemaVersion: 1,
  repository: 'mtajada/bank-of-america-angular-modernization-demo',
  sourceBranch: 'demo/devin-api-autotest-scenario',
  title: 'Synthetic regression',
  maxAcuLimit: 5,
  tags: ['synthetic', 'api-kickoff'],
  task: 'Repair the regression.',
  acceptanceCriteria: ['Keep cancellation terminal.', 'Do not merge.'],
  validationCommands: [
    './scripts/gate.sh typecheck',
    './scripts/gate.sh lint',
    './scripts/gate.sh unit',
    './scripts/gate.sh build',
    './scripts/gate.sh security',
  ],
  stopConditions: ['No production access.', 'Stop at a draft pull request.'],
};

test('builds a bounded session payload without embedding credentials', () => {
  validateConfig(config);
  const payload = buildSessionPayload(config);
  const serialized = JSON.stringify(payload);

  assert.equal(payload.max_acu_limit, 5);
  assert.equal(payload.bypass_approval, false);
  assert.deepEqual(payload.repos, [
    'https://github.com/mtajada/bank-of-america-angular-modernization-demo',
  ]);
  assert.equal(payload.structured_output_required, true);
  assert.doesNotMatch(serialized, /DEVIN_API_KEY|Bearer|cog_/);
});

test('preserves the security, test and human-review boundaries in the prompt', () => {
  const prompt = buildPrompt(config);

  assert.match(prompt, /Keep cancellation terminal/);
  assert.match(prompt, /No production access/);
  assert.match(prompt, /draft pull request/);
  assert.match(prompt, /gate\.sh unit/);
  assert.match(prompt, /Return the root cause/);
});

test('rejects a non-demo source branch', () => {
  assert.throws(
    () => validateConfig({ ...config, sourceBranch: 'main' }),
    /isolated under demo/
  );
});
