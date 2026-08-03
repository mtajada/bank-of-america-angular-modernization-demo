# Devin API Autotest Demo — Implementation Plan

1. Keep the demonstration entirely inside the personal synthetic repository. Do not use Farmetrik or Bank of America systems, data, credentials, logos or proprietary assets.
2. Create a reproducible late-MFA regression on an isolated `demo/` branch.
3. Provide a testable API kickoff contract that uses a scoped service user, a fixed repository and branch, an ACU budget, explicit validation commands, structured output and a human merge boundary.
4. Provide a manually dispatched GitHub Actions route that can hand the failing scenario to Devin without storing credentials in the repository.
5. Require Devin to diagnose, repair and run typecheck, lint, unit, build, security, E2E and coverage checks before it opens a draft pull request.
6. Preserve the failing-seed evidence, the repaired PR evidence and a presentation-ready explanation of the control model.
