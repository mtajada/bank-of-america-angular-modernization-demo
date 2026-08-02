#!/usr/bin/env bash
set -euo pipefail

BOA_DEMO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$BOA_DEMO_ROOT"

if [[ -x "$BOA_DEMO_ROOT/.tools/pnpm20/bin/npm" ]]; then
  export PATH="$BOA_DEMO_ROOT/.tools/pnpm20/bin:$PATH"
  BOA_NODE="$BOA_DEMO_ROOT/.tools/pnpm20/bin/node"
  BOA_NPM="$BOA_DEMO_ROOT/.tools/pnpm20/bin/npm"
  BOA_NPX="$BOA_DEMO_ROOT/.tools/pnpm20/bin/npx"
else
  # Node tooling is resolved lazily so the repository-state gate (diff) can run
  # before any dependency setup and independently of the active Node runtime.
  BOA_NODE="$(command -v node || true)"
  BOA_NPM="$(command -v npm || true)"
  BOA_NPX="$(command -v npx || true)"
fi

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
  unit|integration)
    "$BOA_NPM" run test
    ;;
  coverage)
    "$BOA_NPX" nx run-many --target=test --all --coverage --runInBand
    ;;
  e2e|e2e-trace)
    "$BOA_NPM" run test:e2e
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
    if rg -n --glob 'apps/**/*.ts' --glob 'apps/**/*.js' --glob 'libs/**/*.ts' --glob 'libs/**/*.js' \
      '(fetch[[:space:]]*\(|XMLHttpRequest|WebSocket[[:space:]]*\(|HttpClient|axios\.)' .; then
      printf '%s\n' 'External runtime network primitive found in application code.' >&2
      exit 1
    fi
    ;;
  diff)
    git diff --check
    git diff --exit-code
    git diff --cached --exit-code
    if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
      git status --short
      printf '%s\n' 'Working tree is not clean.' >&2
      exit 1
    fi
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
