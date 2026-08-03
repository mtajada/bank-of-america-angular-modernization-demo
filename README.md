# Bank of America Digital Banking — Angular Modernization Simulation

This synthetic repository supports a live Angular modernization conversation.
It models one shared transfer-confirmation component used by two independently
recognisable consumers: Retail Banking and Customer Servicing. Three additional
teams compile against the public contract to make downstream compatibility a
real gate rather than a line in the script.

This public repository is an independent synthetic interview simulation. It is
not affiliated with or endorsed by Bank of America and contains no Bank of
America production code, customer data, credentials, systems, logos or
proprietary design assets. Every user, transfer, MFA challenge, provider
response and analytics event is a local fixture.

## Why this unit

`SecureTransferConfirmation` is deliberately small enough to review in a
meeting, but it crosses the boundaries that make a framework upgrade difficult
in a bank:

- a custom design system over Angular Material;
- a stable public component contract;
- two downstream consumers;
- MFA and financial-data adapters;
- analytics with a strict identifier policy;
- unit, contract and browser evidence;
- a human code-owner and rollback gate.

The public `main` branch preserves the Angular 14 implementation. The feature
branch moves the same slice to the Angular 18 checkpoint named in the interview
brief. That checkpoint is not presented as the final supported destination;
the broader target is a discovery decision.

The brief describes a customer surface used by millions of retail customers
and a compliance policy that does not permit unsupported frameworks in
production. The lab responds with blast-radius mapping, rollback and consumer
evidence. It does not claim to reproduce production scale.

The Angular runtime is deliberately a browser-based Online Banking surface.
Narrow-viewport tests validate responsive web behaviour; they are not presented
as evidence for Bank of America's native iOS or Android applications. Those
channels remain adjacent, with only the identity, transaction, analytics and
provider contracts represented in this lab.

## Baseline commands

```bash
nvm use
npm ci
./scripts/gate.sh all
```

Run the consumers separately:

```bash
npm run start:retail
npm run start:servicing
```

Retail uses `http://localhost:4200`. Customer Servicing uses
`http://localhost:4300`.

## Repository map

- `apps/retail-banking`: customer self-service consumer.
- `apps/customer-servicing`: assisted-service consumer.
- `libs/shared/design-system`: Material boundary and theme surface.
- `libs/shared/secure-transfer`: public component and its behaviour.
- `libs/shared/integrations`: deterministic MFA, analytics and quote adapters.
- `config/digital-channel-boundaries.json`: executable web, responsive and
  adjacent-native scope.
- `docs/requirements`: the customer scenario, scope and acceptance criteria.
- `docs/architecture`: the dependency and rollback boundaries.
- `docs/security`: the allowed actions and local-only integration policy.

Start with [the architecture map](docs/architecture/transfer-confirmation.md)
and [the security boundary](docs/security/demo-boundary.md), then read the
[Angular 18 upgrade requirements](docs/requirements/angular-18-shared-library-upgrade.md).

The isolated API-remediation rehearsal is documented in the
[Devin API autotest runbook](docs/demo/devin-api-autotest-runbook.md). Its
scenario branch deliberately fails the late-MFA cancellation contract so an
existing automation can start a bounded Devin session and return a tested draft
pull request. It is not a deployment or autonomous merge path.
