#!/bin/bash

ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "Stopping..."

PM2_NAME=$(grep '^PM2_NAME=' .env 2>/dev/null | cut -d= -f2)
PM2_NAME="${PM2_NAME:-timer}"

pm2 stop "$PM2_NAME" 2>/dev/null || echo "$PM2_NAME was not running"

echo "Stopped."
