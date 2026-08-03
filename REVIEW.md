# Review policy

Review this repository as a shared consumer-banking component, not as a visual
demo alone.

Block the change when any of these conditions is true:

- Cancel, close or navigation can submit the transfer form.
- MFA can be bypassed or a rejected challenge causes a side effect.
- Analytics includes a customer, account, routing or transfer identifier.
- The public component contract changes without an explicit consumer plan.
- Retail Banking or Customer Servicing no longer builds or passes its tests.
- The Angular browser surface or its responsive test is presented as a native
  mobile application.
- The pull request introduces external traffic, credentials, deployment or an
  automatic merge path.

The browser recording is supporting evidence. It does not replace the unit,
contract and CI checks.

Write every review comment and analysis in English.
