#!/usr/bin/env bash
set -euo pipefail

BOA_DEMO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BOA_APP="${1:?application name required}"
BOA_PORT="${2:?port required}"

cd "$BOA_DEMO_ROOT"

if [[ -x "$BOA_DEMO_ROOT/.tools/pnpm20/bin/npx" ]]; then
  export PATH="$BOA_DEMO_ROOT/.tools/pnpm20/bin:$PATH"
fi

exec npx nx serve "$BOA_APP" --host=127.0.0.1 --port="$BOA_PORT"
