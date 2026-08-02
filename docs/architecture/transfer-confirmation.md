# Transfer confirmation architecture

## Rollback boundary

The unit of change is the shared `SecureTransferConfirmation` component, its
public types, the Material design-system imports and proof that both consumers
remain compatible. Rolling back this unit must not require a different Retail
or Servicing release.

```text
Retail Banking ───────┐
                      ├── SecureTransferConfirmation ── Design system / Material
Customer Servicing ───┘                │
                                       ├── Local SSO + MFA gateways
                                       ├── Redacting proprietary-SDK adapter
                                       └── Composite of 3 local provider fixtures
```

The two applications provide their own fixture and outcome label. They do not
reach into the component implementation. The component accepts a typed
`TransferSummary`, a consumer channel and two outputs: `confirmed` and
`cancelled`.

## Contract that must remain stable

- The component selector, inputs and outputs.
- The `TransferSummary`, `ConsumerChannel` and adapter interfaces.
- MFA approval before confirmation.
- A single allowlisted analytics event after approval only.
- No analytics, confirmation or MFA side effect on cancel.
- Keyboard, form-label and status semantics.
- Compatible builds for both consumers.
- Compatible public types for all five registered downstream teams.

## Why this is a useful migration slice

Angular Material's MDC transition changes component implementation, DOM and
styling at the same boundary where a custom design system usually sits. It is
technical enough to expose real migration risk without asking the audience to
watch dependency installation or four major-version updates.
