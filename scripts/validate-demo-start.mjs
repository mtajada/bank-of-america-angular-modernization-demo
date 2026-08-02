import { readFileSync } from 'node:fs';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const fail = (message) => {
  console.error(`Demo start policy failed: ${message}`);
  process.exitCode = 1;
};

const packageJson = readJson('package.json');
const policy = readJson('config/demo-start-policy.json');
const registry = readJson('config/downstream-consumers.json');
const channelBoundary = readJson('config/digital-channel-boundaries.json');

const angularVersion = packageJson.dependencies?.['@angular/core'] ?? '';
const angularMajor = Number(angularVersion.match(/\d+/)?.[0]);
const registeredConsumers = registry.consumers ?? [];
const fullApplications = registeredConsumers.filter((consumer) =>
  consumer.validation.includes('full build')
);
const contractFixtures = registeredConsumers.filter(
  (consumer) => consumer.surface === 'contract fixture'
);

if (angularMajor !== policy.startingAngularMajor) {
  fail(`expected Angular ${policy.startingAngularMajor}, found ${angularVersion}`);
}

if (policy.targetAngularMajor !== 18) {
  fail('the interview checkpoint must remain Angular 18');
}

if (packageJson.engines?.node !== policy.requiredNodeVersion) {
  fail(
    `expected Node ${policy.requiredNodeVersion}, found ${packageJson.engines?.node}`
  );
}

if (registeredConsumers.length < policy.minimumRegisteredConsumers) {
  fail(`expected at least ${policy.minimumRegisteredConsumers} consumers`);
}

if (fullApplications.length < policy.minimumFullApplicationConsumers) {
  fail(`expected at least ${policy.minimumFullApplicationConsumers} full applications`);
}

if (contractFixtures.length < policy.minimumContractFixtureConsumers) {
  fail(`expected at least ${policy.minimumContractFixtureConsumers} contract fixtures`);
}

if (policy.runtimeNetwork !== 'forbidden') {
  fail('runtime network access must remain forbidden');
}

if (policy.releaseMode !== 'human-approval-required') {
  fail('the release must stop for human approval');
}

if (
  channelBoundary.angularRuntime?.delivery !== 'browser' ||
  channelBoundary.angularRuntime?.nativeApplication !== false
) {
  fail('the Angular runtime must remain a browser application');
}

if (!process.exitCode) {
  console.log(
    `Demo start policy passed: Angular ${angularMajor}, ${registeredConsumers.length} consumers, browser-only runtime, local integrations and human release approval.`
  );
}
