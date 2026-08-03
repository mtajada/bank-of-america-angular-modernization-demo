# API-triggered remediation with automated validation

## Scenario

This is a synthetic banking demonstration. A customer cancels a transfer while an asynchronous MFA challenge is still in flight. A delayed approved response then revives the cancelled operation. The existing contract test detects the regression, providing a credible failed-control trigger without using production systems or customer data.

## Governed kickoff

The existing automation remains the control plane. A manually dispatched GitHub Actions workflow uses a scoped Devin service user to create one bounded session through the API. The request fixes the repository and source branch, applies a five-ACU budget, requires structured evidence and prohibits production access, deployment and merge.

Run the safe preview without a credential:

```bash
npm run devin:dry-run
```

The live workflow reads `DEVIN_API_KEY` and `DEVIN_ORG_ID` only from GitHub Actions secrets. Their values are never committed, printed or uploaded as evidence.

## Automated validation

Devin must investigate the failure rather than receive a prescribed code change. It must preserve the public component contract and execute the repository gates in order: typecheck, lint, unit and downstream contracts, both full application builds, security policy, browser E2E and coverage. Tests may not be skipped, weakened or deleted.

## Evidence and decision

The output is a draft pull request containing the root cause, changed files, exact test results, browser evidence, remaining risks and rollback context. The browser recording is supporting evidence, not a replacement for CI. A human code owner retains review, merge and deployment authority.

## Meeting narration

> The API call is not the differentiator. The existing automation detects and governs the event. Devin takes the bounded engineering step that is difficult to script: it investigates the failing control, changes the smallest compatible slice, reruns the existing checks and returns a draft pull request with evidence. The service user, repository allowlist, budget and human merge gate remain explicit throughout.
