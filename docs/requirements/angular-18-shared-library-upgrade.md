# Angular 14 compliance exit for digital banking

> This public repository is an independent synthetic interview simulation. It
> is not affiliated with or endorsed by Bank of America and contains no Bank of
> America production code, customer data, credentials, systems, logos or
> proprietary design assets.

## Business context

Bank of America needs to move a large customer-facing digital banking
application from Angular 14 to Angular 18. The application serves millions of
retail banking customers. Angular 14 has reached end of life, and the scenario's
internal security policy prohibits unsupported frameworks in production. The
programme therefore has a hard compliance deadline.

The application depends on a shared internal component library. A custom design
system sits over Angular Material, and several downstream teams build against
the shared public API. The upgrade cannot break their applications or force an
unplanned coordinated release.

The affected flow also crosses four integration boundaries:

- internal SSO session assurance;
- MFA step-up before a transfer is confirmed;
- a proprietary analytics SDK with a strict identifier allowlist;
- several third-party financial-data providers.

## Change requested

Move the shared transfer-confirmation slice from the reproducible Angular 14
baseline to the Angular 18 checkpoint. Preserve the public component contract,
the custom design-system boundary and every security-sensitive behaviour.

This pull request represents one rollback-sized part of the larger programme.
It does not claim that a digital banking estate used by millions of customers
can be upgraded in one task.

## Consumers in scope

- Retail Banking, a complete customer-facing application.
- Customer Servicing, a complete assisted-service application.
- Scheduled Payments, a compiled public-contract fixture.
- Disputes and Claims, a compiled public-contract fixture.
- Financial Wellness, a compiled public-contract fixture.

## Acceptance criteria

1. Both full applications and all five registered consumer contracts build.
2. The component selector, inputs, outputs, integration types and package
   exports remain compatible.
3. The custom design system continues to own the Angular Material boundary.
4. A valid synthetic SSO session and approved MFA challenge are required before
   confirmation.
5. Cancel, close and rejected MFA create no transfer or analytics side effect.
6. Analytics emits only the allowlisted event and consumer channel. It contains
   no customer, account, routing or transfer identifier.
7. Provider responses remain deterministic and local. Runtime network access
   is prohibited.
8. CI records typecheck, lint, unit, contract, application-build and browser
   results.
9. The pull request remains in draft and stops at a human code-owner decision.

## Stop conditions

Stop and report if the change requires production access, credentials, an
external runtime call, a public-contract break, a different target version,
deployment, merge or bypass of a repository rule.
