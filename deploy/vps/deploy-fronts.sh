#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="${1:-/opt/portaltrevvos/deploy/vps/static-fronts.conf}"
NODE_IMAGE="${NODE_IMAGE:-node:22-bookworm-slim}"

DEPLOY_UID="$(id -u deploy 2>/dev/null || id -u)"
DEPLOY_GID="$(id -g deploy 2>/dev/null || id -g)"

publish_dir() {
  local source_dir="$1"
  local target_dir="$2"
  local tmp_dir="${target_dir}.new.$$"
  local old_dir="${target_dir}.old.$$"

  test -f "$source_dir/index.html"

  rm -rf "$tmp_dir" "$old_dir"
  mkdir -p "$(dirname "$target_dir")"
  mkdir -p "$tmp_dir"

  cp -a "$source_dir"/. "$tmp_dir"/

  if [ -d "$target_dir" ]; then
    mv "$target_dir" "$old_dir"
  fi

  mv "$tmp_dir" "$target_dir"
  rm -rf "$old_dir"
}

resolve_artifact_dir() {
  local pattern="$1"

  shopt -s nullglob
  local matches=( $pattern )
  shopt -u nullglob

  if [ "${#matches[@]}" -eq 0 ]; then
    echo "Artifact not found: $pattern" >&2
    exit 1
  fi

  echo "${matches[0]}"
}

while IFS='|' read -r name workdir build_cmd artifact_path target_dir || [ -n "${name:-}" ]; do
  [[ -z "${name:-}" || "${name:0:1}" == "#" ]] && continue

  echo "==> Building $name"

  docker run --rm \
    --user "$DEPLOY_UID:$DEPLOY_GID" \
    -e HOME=/tmp \
    -v "$workdir:/app" \
    -w /app \
    "$NODE_IMAGE" \
    sh -lc "$build_cmd"

  artifact_dir="$(resolve_artifact_dir "$workdir/$artifact_path")"

  echo "==> Publishing $name"
  publish_dir "$artifact_dir" "$target_dir"
done < "$CONFIG_FILE"

echo "==> Static fronts deployed"
