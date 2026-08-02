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

Run `./scripts/gate.sh start-state` before changing files, then run
`./scripts/gate.sh all`. This branch must begin on Angular 14 with five
registered consumers, a browser-only Angular surface, local integrations and a
human release gate. The Angular 18 branch adds its migration compliance and
Playwright gates. State the exact commands and results in the pull request.
