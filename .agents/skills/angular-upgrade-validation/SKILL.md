---
name: angular-upgrade-validation
description: Validate the Bank of America Angular compatibility slice across consumers, security-sensitive contracts and browser evidence.
---

# Angular upgrade validation

Use this Skill only in the Bank of America modernization demo. It packages the local
evidence routine for the shared Angular slice; it does not grant access, approve
policy, merge a pull request or deploy an application.

## Preconditions

1. Read `AGENTS.md`, `REVIEW.md`,
   `docs/requirements/angular-18-shared-library-upgrade.md` and
   `docs/security/demo-boundary.md` completely.
2. Confirm the current branch and Node version.
3. Stop if the working tree contains unrelated changes, a real credential, an
   external runtime integration or an unapproved public-contract change.

## Validation order

1. Run `./scripts/gate.sh typecheck`.
2. Run `./scripts/gate.sh lint`.
3. Run `./scripts/gate.sh unit`.
4. Run `./scripts/gate.sh build` for both full consumers.
5. Run `./scripts/gate.sh security`.
6. Run `./scripts/gate.sh e2e` for positive, cancel and rejected-MFA paths.
7. Run `git diff --check` and inspect the public exports.

## Required report

Return the current commit, exact commands, pass or fail for each gate, the five
consumer statuses, the analytics and MFA invariants, browser artifact paths,
unresolved risks and the named rollback. Distinguish evidence produced in the
current run from earlier CI evidence. Never describe a skipped check as passing.

## Stop boundary

Stop at a draft pull request. A human code owner must decide whether to approve,
merge or deploy.
