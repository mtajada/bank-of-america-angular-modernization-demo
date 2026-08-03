# Shared design system

This synthetic design system supports the two consumers in the Angular
modernization demo. It is original work informed by current digital-banking
patterns; it does not contain official company marks, proprietary fonts or
copied application assets.

## Semantic tokens

`src/styles/_tokens.scss` owns the shared palette, typography, focus,
elevation, spacing and radius variables. Consumer applications may override
density and surface variables, but should not restyle the shared transfer
component through internal selectors.

- Navy carries navigation, trust and high-level hierarchy.
- Red marks identity and exceptional emphasis, not routine body copy.
- Action blue is reserved for links, focus and primary controls.
- Green and red state colors always appear with a text label or icon.
- Tabular numerals are used for balances and transfer amounts.
- All interactive controls retain a visible `:focus-visible` treatment.

Retail Banking uses wider spacing and softer elevation. Customer Servicing
uses the same semantic colors with a denser workspace rhythm. Both consumers
must preserve the shared component selector, inputs, outputs and automation
IDs across Angular 14 and Angular 18.

## Validation

Run `nx test shared-design-system` for the library test target, then run the
repository build, contract and browser gates before changing a shared token.
