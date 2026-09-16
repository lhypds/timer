#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "Starting..."

# -s, not -f: an empty .env is as unconfigured as a missing one, and leaving it
# in place would silently hide PORT / PM2_NAME / HOST behind the defaults.
if [ ! -s .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

if [ ! -d dist ]; then
  echo "dist/ not found — run 'pnpm install && pnpm run build' first" >&2
  exit 1
fi

pm2 start ecosystem.config.cjs --update-env

PORT=$(grep '^PORT=' .env 2>/dev/null | cut -d= -f2)
echo "timer running at http://localhost:${PORT:-3301}"
