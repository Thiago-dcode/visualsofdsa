#!/usr/bin/env bash
# Seed the production database (db must already be migrated: run scripts/deploy.sh first).
# The seed is idempotent (upserts on `name`), so it is safe to re-run.
#
# Usage:
#   scripts/seed.sh                # pulls the tools image from GHCR, then seeds
#   scripts/seed.sh --skip-pull    # use the image already on the host
#
# GHCR_USER / GHCR_TOKEN: optional GHCR login, same as scripts/deploy.sh.
set -euo pipefail

cd "$(dirname "$0")/.."

COMPOSE=(docker compose -f compose.prod.yml --profile tools)

if [[ "${1:-}" != "--skip-pull" ]]; then
  if [[ -n "${GHCR_USER:-}" && -n "${GHCR_TOKEN:-}" ]]; then
    echo "==> Logging in to GHCR"
    printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
  fi
  echo "==> Pulling tools image"
  "${COMPOSE[@]}" pull seed
fi

echo "==> Starting database"
"${COMPOSE[@]}" up -d --wait db

echo "==> Seeding database"
"${COMPOSE[@]}" run --rm seed

echo "==> Done"
