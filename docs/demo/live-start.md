# Angular 14 live starting point

This branch is the clean starting point for the Bank of America interview
simulation. It keeps the customer-facing and servicing interfaces at the final
visual standard while preserving the Angular 14 framework, Node 16 runtime and
legacy Angular Material boundary that Devin must migrate.

## Start the live task

```bash
git switch demo/angular-14-ready
git pull --ff-only
git switch -c demo/live-angular-18-YYYYMMDD
./scripts/gate.sh start-state
```

The live branch should change only the Angular compatibility slice described in
`docs/requirements/angular-18-shared-library-upgrade.md`. The prepared Angular
18 branch and draft pull request remain separate evidence. Do not present them
as output from the live session.

## Baseline evidence

On August 2, 2026, a clean `npm ci` with Node 16.20.2 completed. Typecheck,
lint, fourteen unit and contract tests, both production builds and the local
security scan passed after the Angular 14 Material theme aliases were restored.

The browser exercise then confirmed:

- approved MFA records one redacted analytics event in Retail Banking;
- cancellation in Customer Servicing creates no transfer or analytics side
  effect;
- both applications report no browser console errors;
- desktop, 390-pixel and 320-pixel responsive-web layouts have no clipped
  controls or horizontal overflow.

Screenshots are stored in `evidence/browser/angular-14-ready/`. They are
current-run evidence for this branch, not evidence of a native mobile
application or a production Bank of America system.
