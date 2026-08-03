# Seed failure evidence

- Branch: `demo/devin-api-autotest-scenario`
- Base: `origin/feature/angular-18-shared-library-upgrade` at `b64297a`
- Node: `20.19.5`
- Command: `npx nx test shared-secure-transfer --runInBand --testNamePattern="keeps cancellation terminal when MFA resolves later"`
- Expected: transfer status remains `cancelled` after the delayed MFA response.
- Observed: transfer status becomes `confirmed`.
- Scope: one focused test failed; ten unrelated tests in the project were skipped by the name filter.

This is the intentional failed-control trigger for the API remediation rehearsal. It contains only synthetic fixtures and must not be merged or deployed.
