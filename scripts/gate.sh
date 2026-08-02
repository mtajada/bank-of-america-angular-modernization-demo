#!/usr/bin/env bash
set -euo pipefail

BOA_DEMO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$BOA_DEMO_ROOT"

if [[ -x "$BOA_DEMO_ROOT/.tools/pnpm16/bin/npm" ]]; then
  export PATH="$BOA_DEMO_ROOT/.tools/pnpm16/bin:$PATH"
  BOA_NPM="$BOA_DEMO_ROOT/.tools/pnpm16/bin/npm"
  BOA_NPX="$BOA_DEMO_ROOT/.tools/pnpm16/bin/npx"
else
  BOA_NPM="$(command -v npm)"
  BOA_NPX="$(command -v npx)"
fi
BOA_NODE="$(command -v node)"

case "${1:-all}" in
  start-state)
    "$BOA_NODE" "$BOA_DEMO_ROOT/scripts/validate-demo-start.mjs"
    ;;
  build)
    "$BOA_NPM" run build
    ;;
  typecheck)
    "$BOA_NPX" tsc --noEmit -p apps/retail-banking/tsconfig.app.json
    "$BOA_NPX" tsc --noEmit -p apps/customer-servicing/tsconfig.app.json
    ;;
  lint)
    "$BOA_NPM" run lint
    ;;
  lint-fix)
    "$BOA_NPX" nx run-many --target=lint --all --fix
    ;;
  unit|integration|coverage)
    "$BOA_NPM" run test
    ;;
  e2e|e2e-trace)
    printf '%s\n' 'Playwright is added on the Angular 18 demo branch.'
    ;;
  security)
    if rg -n --hidden --glob '!.git/**' --glob '!node_modules/**' --glob '!.tools/**' \
      '(AKIA[0-9A-Z]{16}|-----BEGIN (RSA|EC|OPENSSH) PRIVATE KEY-----|ghp_[A-Za-z0-9]{20,})' .; then
      printf '%s\n' 'Potential secret material found.' >&2
      exit 1
    fi
    if rg -n --glob 'apps/**' --glob 'libs/**' '(bankofamerica\.com|Bank of America logo)' .; then
      printf '%s\n' 'Forbidden production identifier found in runtime code.' >&2
      exit 1
    fi
    ;;
  diff)
    git diff --check
    git status --short
    ;;
  all)
    "$0" start-state
    "$0" typecheck
    "$0" lint
    "$0" unit
    "$0" build
    "$0" security
    ;;
  *)
    printf 'Unknown gate: %s\n' "$1" >&2
    exit 2
    ;;
esac
