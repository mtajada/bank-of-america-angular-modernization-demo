# AGENTS.md

## Purpose

This is a synthetic Bank of America interview environment for an Angular
modernization conversation. It contains no production code, customer data,
credentials, official logos or confidential design assets. Treat every fixture
as non-production.

## Working rules

- Use the Node version declared by the active branch.
- Keep `SecureTransferConfirmation` backward compatible for both consumers.
- Do not add network calls, secrets, telemetry exporters or production access.
- Do not include account, routing, transfer or customer identifiers in
  analytics payloads.
- Keep Retail Banking and Customer Servicing green before opening a pull
  request.
- Prefer one reviewable compatibility slice over a broad framework rewrite.
- Record build, unit, contract and browser evidence in the pull request.
- Write repository-facing analysis, pull-request text and review comments in
  English.
- Stop at a draft pull request. Never merge or deploy without a human code
  owner.

## Required gates

Run `./scripts/gate.sh all`. The compliance gate must keep Angular 18, all five
registered consumers, local-only runtime and human release approval intact.
Record each command and distinguish current-run results from earlier CI
evidence.
