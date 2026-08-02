---
name: angular-upgrade-validation
description: Validate the synthetic Bank of America Angular compatibility slice before and after the Angular 14-to-18 change.
---

# Angular upgrade validation

Use this Skill only in this synthetic modernization repository. It provides a
local evidence routine. It does not grant access, approve policy, merge a pull
request or deploy an application.

## Before editing

1. Read `AGENTS.md`, `REVIEW.md`,
   `docs/requirements/angular-18-shared-library-upgrade.md` and
   `docs/security/demo-boundary.md` completely.
2. Confirm the current branch, working-tree state and Node version.
3. Run `./scripts/gate.sh start-state` and record the result.
4. Stop if the repository contains unrelated changes, a credential, external
   runtime traffic or an unapproved public-contract change.

## Required validation

1. Run typecheck and lint.
2. Run the unit and downstream contract tests.
3. Build Retail Banking and Customer Servicing.
4. Run the secret and production-identifier scan.
5. Exercise approved MFA, rejected MFA and cancellation in the browser. Keep
   narrow-viewport evidence labelled responsive web.
6. Inspect the public exports and run `git diff --check`.

## Required report

Return the current commit, exact commands, result of each gate, five consumer
statuses, analytics and MFA invariants, browser artifact paths, unresolved
risks and the named Angular 14 rollback. Separate current-run evidence from
earlier CI or prepared material. Never describe a skipped check as passing.

## Stop boundary

Open only a draft pull request. A human code owner must decide whether to
approve, merge or deploy.
