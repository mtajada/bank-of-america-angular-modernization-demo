# Security boundary

## Allowed

- Read and edit this repository on a feature branch.
- Install the locked development dependencies.
- Run builds, tests and local servers.
- Use the synthetic fixture values committed to the repository.
- Open a draft pull request and request human review after approval to publish.

## Prohibited

- Production or corporate-network access.
- Production credentials, secrets, customer data, systems, official logos or
  confidential Bank of America design assets.
- External runtime calls from the applications or tests.
- Analytics payloads containing account, routing, transfer or customer IDs.
- Calls from the SSO, MFA, analytics or provider ports to real services.
- Deployment, merge, auto-merge or bypass of a branch rule.

## Control model

`AGENTS.md` and `REVIEW.md` express the intent. CI, repository permissions,
branch protection and a human code owner enforce the real boundary. The demo
does not treat an instruction file as a security control by itself.

The browser recording is a short sanity check. It does not prove the absence
of defects and does not replace the unit, contract or CI evidence.
