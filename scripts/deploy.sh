#!/usr/bin/env bash
# Deploy on the VPS: pull images from GHCR -> start db -> run migrations -> (re)start web.
# Images are built in GitHub Actions (.github/workflows/ci-cd.yml); nothing is built here.
#
# Usage:
#   scripts/deploy.sh                 # normal deploy: prisma db migrate
#   scripts/deploy.sh --init          # first deploy on an empty database: prisma db init
#   scripts/deploy.sh --dry           # preview only: prisma db migrate --show, no web restart
#   scripts/deploy.sh --skip-pull     # use the images already on the host
#   scripts/deploy.sh --skip-git      # do not git pull before deploying
#
# Environment:
#   GHCR_USER, GHCR_TOKEN   Optional. When both are set, docker logs in to ghcr.io before pulling
#                           (the token is piped, never passed as an argument). Not needed if the
#                           host is already logged in or the packages are public.
#
# Requires in .env (or the file named by VISUALSOFDSA_ENVFILE): DOCKER_IMAGE_OWNER.
# Optional: DOCKER_IMAGE_TAG (default: main).
set -euo pipefail

# The whole script is one { ... } block so bash parses it fully before running it. Step 1
# `git pull`s this very file; without the block bash keeps reading the rewritten file at its
# old byte offset and can execute garbage.
{

cd "$(dirname "$0")/.."

COMPOSE=(docker compose -f compose.prod.yml --profile tools)
MODE="migrate"
SKIP_PULL=false
SKIP_GIT=false

for arg in "$@"; do
  case "$arg" in
    --init) MODE="init" ;;
    --dry) MODE="dry" ;;
    --skip-pull) SKIP_PULL=true ;;
    --skip-git) SKIP_GIT=true ;;
    *)
      echo "Unknown option: $arg" >&2
      echo "Usage: $0 [--init|--dry] [--skip-pull] [--skip-git]" >&2
      exit 1
      ;;
  esac
done

# The reverse-proxy network lives outside this project; compose cannot create it.
if ! docker network inspect edge >/dev/null 2>&1; then
  echo "Docker network 'edge' not found. Create it or fix compose.prod.yml." >&2
  exit 1
fi

# Compose file and scripts live in the repo, so bring them up to date first.
if [[ "$SKIP_GIT" == false ]]; then
  echo "==> Updating repo (git pull --ff-only origin main)"
  git pull --ff-only origin main
fi

if [[ "$SKIP_PULL" == false ]]; then
  if [[ -n "${GHCR_USER:-}" && -n "${GHCR_TOKEN:-}" ]]; then
    echo "==> Logging in to GHCR"
    printf '%s' "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
  fi
  echo "==> Pulling images (web, tools)"
  "${COMPOSE[@]}" pull web migrate
else
  echo "==> Skipping pull (--skip-pull)"
fi

echo "==> Starting database"
"${COMPOSE[@]}" up -d --wait db

case "$MODE" in
  init)
    echo "==> Initialising database (prisma db init)"
    "${COMPOSE[@]}" run --rm migrate pnpm exec prisma db init
    ;;
  dry)
    echo "==> Previewing migrations (prisma db migrate --show)"
    "${COMPOSE[@]}" run --rm migrate pnpm exec prisma db migrate --show
    echo "Dry run: web not restarted."
    exit 0
    ;;
  migrate)
    echo "==> Applying migrations (prisma db migrate)"
    "${COMPOSE[@]}" run --rm migrate
    ;;
esac

echo "==> Starting web"
"${COMPOSE[@]}" up -d web

echo "==> Done"
"${COMPOSE[@]}" ps

exit 0
}
