#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "Restarting..."

echo "Pulling latest code..."
git pull --ff-only

if [ ! -s .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# pnpm, matching the lockfile in this repo — mixing in npm leaves two lockfiles
# fighting over node_modules. No --prod flag: the build needs typescript/vite
# from devDependencies.
echo "Installing dependencies..."
pnpm install

echo "Building..."
pnpm run build

pm2 restart ecosystem.config.cjs --update-env

PORT=$(grep '^PORT=' .env 2>/dev/null | cut -d= -f2)
echo "timer running at http://localhost:${PORT:-3301}"
