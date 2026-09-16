#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "Setting up..."

# -s, not -f: an empty .env is as unconfigured as a missing one, and leaving it
# in place would silently hide PORT / BIND / PM2_NAME / HOST behind the defaults.
if [ ! -s .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example — set HOST to the public hostname before starting"
fi

# pnpm, matching the lockfile in this repo — mixing in npm leaves two lockfiles
# fighting over node_modules. corepack picks the version pinned in package.json.
if ! command -v pnpm &> /dev/null; then
  if command -v corepack &> /dev/null; then
    echo "Enabling pnpm via corepack..."
    corepack enable
  else
    echo "Installing pnpm..."
    npm install -g pnpm
  fi
fi

# Install pm2 globally if not present
if ! command -v pm2 &> /dev/null; then
  echo "Installing pm2..."
  npm install -g pm2
fi

# No --prod flag: the build needs typescript/vite from devDependencies.
echo "Installing dependencies..."
pnpm install

echo "Building..."
pnpm run build

echo ""
echo "Setup complete."
echo "Run ./start.sh to start the app"
