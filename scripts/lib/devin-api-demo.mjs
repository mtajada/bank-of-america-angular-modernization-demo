const repositoryUrl = (repository) => `https://github.com/${repository}`;

export function buildPrompt(config) {
  const numbered = (items) =>
    items.map((item, index) => `${index + 1}. ${item}`).join('\n');

  return [
    'You are handling a bounded synthetic banking regression in a public demo repository.',
    `Repository: ${config.repository}`,
    `Start from branch: ${config.sourceBranch}`,
    '',
    'Task',
    config.task,
    '',
    'Acceptance criteria',
    numbered(config.acceptanceCriteria),
    '',
    'Required validation, in this order',
    numbered(config.validationCommands),
    '',
    'Stop conditions',
    numbered(config.stopConditions),
    '',
    'Read AGENTS.md, REVIEW.md, the repository validation skill and the security boundary before editing. Investigate the failing test rather than assuming the fix. Preserve exact command results and browser evidence in the draft pull request. Return the root cause, changed files, test results, remaining risks and draft pull request URL as structured output.',
  ].join('\n');
}

export function buildSessionPayload(config) {
  return {
    title: config.title,
    prompt: buildPrompt(config),
    repos: [repositoryUrl(config.repository)],
    max_acu_limit: config.maxAcuLimit,
    bypass_approval: false,
    resumable: true,
    tags: config.tags,
    structured_output_required: true,
    structured_output_schema: {
      type: 'object',
      additionalProperties: false,
      required: [
        'summary',
        'root_cause',
        'changed_files',
        'tests',
        'remaining_risks',
        'pull_request_url',
      ],
      properties: {
        summary: { type: 'string' },
        root_cause: { type: 'string' },
        changed_files: { type: 'array', items: { type: 'string' } },
        tests: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            required: ['command', 'result'],
            properties: {
              command: { type: 'string' },
              result: { type: 'string', enum: ['passed', 'failed', 'blocked'] },
            },
          },
        },
        remaining_risks: { type: 'array', items: { type: 'string' } },
        pull_request_url: { type: ['string', 'null'] },
      },
    },
  };
}

export function validateConfig(config) {
  if (config.schemaVersion !== 1) throw new Error('Unsupported config schema');
  if (!/^[-\w]+\/[-\w.]+$/.test(config.repository)) {
    throw new Error('Repository must use owner/name format');
  }
  if (!config.sourceBranch?.startsWith('demo/')) {
    throw new Error('Source branch must be isolated under demo/');
  }
  if (!Number.isInteger(config.maxAcuLimit) || config.maxAcuLimit < 1) {
    throw new Error('maxAcuLimit must be a positive integer');
  }
  if (!Array.isArray(config.validationCommands) || config.validationCommands.length < 5) {
    throw new Error('The demo requires a complete validation command set');
  }
}
