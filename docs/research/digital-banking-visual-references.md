# Digital banking visual reference pack

Checked on August 2, 2026. These images are research references only. They are
not bundled into either application and are excluded from the public demo
history.

## Bank of America mobile banking

The current first-party application is information-rich and trust-led: white
work surfaces, restrained navigation color, blue actions, masked identifiers
and an explicit review step before a transfer is submitted. The official
Online Banking walkthrough is even quieter, relying on a white canvas, compact
rows, dividers and a small number of actions rather than a dashboard of cards.

- [Current App Store listing](https://apps.apple.com/us/app/bank-of-america-mobile-banking/id284847138)
- [Current account overview](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/5c/98/8c/5c988c59-a416-b689-7526-cdf5d363e1ab/iphone-CA-overview.png/600x1300bb.webp)
- [Current send-money presentation](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/f2/69/23/f26923d8-9901-2b07-7059-c73a6e35d87f/9bad6b78-493a-4474-9e62-0e1dff4ee56f_iphone-CA-send-money.png/600x1300bb.webp)
- [Official online transfer walkthrough](https://info.bankofamerica.com/en/digital-banking/how-to/online-banking-transfer-demo)
- [Official online review screen](https://info.bankofamerica.com/content/dam/consumer-info/en/digital-banking/how-to/transfer-money/9-online-banking-transfer.jpg)
- [Official online confirmation screen](https://info.bankofamerica.com/content/dam/consumer-info/en/digital-banking/how-to/transfer-money/10-online-banking-transfer.jpg)

## Revolut mobile banking

Revolut contributes hierarchy rather than brand: one dominant amount or action,
generous breathing room, short labels, a clear transfer direction and a
trackable post-transfer state. Its black presentation treatment is not carried
into the Bank of America-inspired product palette.

- [Current App Store listing](https://apps.apple.com/us/app/revolut-send-spend-and-save/id932493382)
- [Current savings presentation](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/0a/9f/1f/0a9f1f65-3a95-97b0-714c-495baea1c9cc/Screen_2_1242x2208.jpg/600x1300bb.webp)
- [Current send-money presentation](https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/b1/12/3a/b1123ade-6cc7-d7fb-d1f7-81ef15023d01/Screen_3_1242x2208.jpg/600x1300bb.webp)

## shadcn composition principles

shadcn is used as a design reference, not as a React dependency. The Angular
implementation applies its product-interface conventions: semantic tokens,
quiet neutral surfaces, one accent for routine actions, consistent radius and
density, accessible states, and cards only when the card itself is the
interaction.

- [shadcn components](https://ui.shadcn.com/docs/components)
- [shadcn theming](https://ui.shadcn.com/docs/theming)

## Applied direction

The Retail application adopts Bank of America's trust model and explicit
review flow, then uses fintech-style focus around the amount, route and primary
action. Customer Servicing uses the same design tokens but becomes a compact
employee workspace built from records, dividers and one control rail. The
shared confirmation component stays recognizably consistent across both
consumers.

The implementation uses original CSS, a text-only simulation identity,
synthetic customer data and local-only adapters. It does not copy logos,
screenshots, merchant marks, proprietary fonts or named assistant artwork.
