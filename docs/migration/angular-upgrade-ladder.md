# Angular upgrade ladder

## Baseline

`baseline/angular-14` uses Angular 14.2, Angular Material 14.2 and Nx 15.0.4 on
Node 16.20.2. Material modules still point to the pre-MDC implementations even
though their Angular 14 import names do not contain `legacy`.

## Prepared sequence

1. Update Angular and Material major by major.
2. At the Angular 15 checkpoint, preserve behaviour with the generated legacy
   imports while the workspace stabilises.
3. Migrate `SecureTransferConfirmation` to the MDC modules and repair its
   custom styles.
4. Continue the framework and Nx updates to the Angular 18 checkpoint named in
   the pre-read.
5. Re-run both consumer builds, shared tests and browser flows.

The live session starts from a prepared checkpoint after mechanical dependency
work. It does not spend the customer meeting downloading packages.

## Destination decision

Angular 18 is treated as the contractual or intermediate checkpoint from the
brief. The audience can rebaseline the final destination to a supported version
without invalidating this component slice: legacy Material removal, public
contract protection and downstream validation remain necessary.

## Rollback

The Angular 14 baseline is the last known green rollback state. Each pull-request
head records its own Review and CI evidence in normal commit history. A human
code owner controls the final decision.
