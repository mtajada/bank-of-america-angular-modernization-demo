import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

function readJson(relativePath) {
  return JSON.parse(
    fs.readFileSync(path.join(repositoryRoot, relativePath), 'utf8')
  );
}

function fail(message) {
  console.error(`Demo scenario validation failed: ${message}`);
  process.exit(1);
}

function major(version, label) {
  const match = String(version).match(/(?:^|[^0-9])(\d+)\./);
  if (!match) fail(`${label} has an unreadable version: ${version}`);
  return Number(match[1]);
}

const policy = readJson('config/demo-scenario-policy.json');
const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');
const consumerRegistry = readJson('config/downstream-consumers.json');
const channelBoundaries = readJson('config/digital-channel-boundaries.json');
const nodeVersion = fs
  .readFileSync(path.join(repositoryRoot, '.nvmrc'), 'utf8')
  .trim();

if (policy.schemaVersion !== 1) fail('unsupported policy schema version');
if (policy.runtimeNetwork !== 'forbidden')
  fail('runtime network must remain forbidden');
if (policy.releaseMode !== 'human-approval-required') {
  fail('the release mode must retain a human approval gate');
}
if (channelBoundaries.schemaVersion !== 1) {
  fail('unsupported digital channel boundary schema version');
}
if (channelBoundaries.angularRuntime?.delivery !== 'browser') {
  fail('the Angular runtime must remain a browser surface');
}
if (channelBoundaries.angularRuntime?.nativeApplication !== false) {
  fail('the Angular runtime must not be presented as a native application');
}
if (channelBoundaries.angularRuntime?.responsiveMobileValidation !== true) {
  fail('the browser surface must retain responsive mobile validation');
}

const adjacentChannels = channelBoundaries.adjacentChannels;
if (!Array.isArray(adjacentChannels) || adjacentChannels.length !== 2) {
  fail('the iOS and Android adjacent-channel boundaries must both be declared');
}
const adjacentSurfaces = new Set(
  adjacentChannels.map(({ surface }) => surface)
);
if (
  !adjacentSurfaces.has('mobile-banking-ios') ||
  !adjacentSurfaces.has('mobile-banking-android')
) {
  fail('the adjacent channel registry must name iOS and Android');
}
if (
  adjacentChannels.some(
    ({ delivery, implementation, angularConsumer }) =>
      delivery !== 'native application' ||
      implementation !== 'not asserted' ||
      angularConsumer !== false
  )
) {
  fail('native channels must remain adjacent and must not consume Angular');
}

const requiredCrossChannelContracts = [
  'identity-session-assurance',
  'transaction-step-up',
  'transfer-domain-contract',
  'analytics-event-schema',
  'financial-data-provider-contract',
];
const sharedCrossChannelContracts = new Set(
  channelBoundaries.sharedCrossChannelContracts
);
for (const contract of requiredCrossChannelContracts) {
  if (!sharedCrossChannelContracts.has(contract)) {
    fail(`cross-channel contract is missing: ${contract}`);
  }
}
if (nodeVersion !== policy.requiredNodeVersion) {
  fail(`.nvmrc is ${nodeVersion}; expected ${policy.requiredNodeVersion}`);
}

const angularPackages = [
  '@angular/animations',
  '@angular/cdk',
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/forms',
  '@angular/material',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
];

for (const packageName of angularPackages) {
  const declaredVersion = packageJson.dependencies?.[packageName];
  if (!declaredVersion)
    fail(`${packageName} is not declared as a direct dependency`);
  if (
    major(declaredVersion, `${packageName} declaration`) !==
    policy.requiredAngularMajor
  ) {
    fail(
      `${packageName} declares ${declaredVersion}; expected Angular ${policy.requiredAngularMajor}`
    );
  }

  const lockedVersion =
    packageLock.packages?.[`node_modules/${packageName}`]?.version;
  if (!lockedVersion) fail(`${packageName} is missing from the lockfile`);
  if (
    major(lockedVersion, `${packageName} lockfile entry`) !==
    policy.requiredAngularMajor
  ) {
    fail(
      `${packageName} resolves to ${lockedVersion}; expected Angular ${policy.requiredAngularMajor}`
    );
  }

  if (
    policy.forbiddenAngularMajors.includes(major(lockedVersion, packageName))
  ) {
    fail(`${packageName} resolves to a forbidden framework major`);
  }
}

const consumers = consumerRegistry.consumers;
if (!Array.isArray(consumers)) fail('downstream consumer registry is missing');
if (consumers.length < policy.minimumRegisteredConsumers) {
  fail(`only ${consumers.length} consumers are registered`);
}

const uniqueTeams = new Set(consumers.map(({ team }) => team));
if (uniqueTeams.size !== consumers.length)
  fail('consumer team names must be unique');

const fullApplications = consumers.filter(({ validation }) =>
  validation.toLowerCase().includes('full build')
);
const contractFixtures = consumers.filter(
  ({ surface }) => surface === 'contract fixture'
);

if (fullApplications.length < policy.minimumFullApplicationConsumers) {
  fail('the registry must retain two full application consumers');
}
if (contractFixtures.length < policy.minimumContractFixtureConsumers) {
  fail('the registry must retain three contract-fixture consumers');
}

for (const { surface } of fullApplications) {
  if (
    !fs.existsSync(path.join(repositoryRoot, 'apps', surface, 'project.json'))
  ) {
    fail(`registered application consumer does not exist: ${surface}`);
  }
}

console.log(
  `Demo scenario policy validated: Angular ${policy.requiredAngularMajor}, ` +
    `Node ${policy.requiredNodeVersion}, ${consumers.length} consumers, ` +
    'browser-only Angular scope, adjacent native channels, local-only runtime ' +
    'and human release approval.'
);
