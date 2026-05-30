#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kubetasker-ckad}"
REGION="${CIVO_REGION:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cluster-name) CLUSTER_NAME="$2"; shift 2 ;;
    --region) REGION="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

REGION_ARG=()
if [[ -n "$REGION" ]]; then
  REGION_ARG=(--region "$REGION")
fi

echo "WARNING: this deletes the Civo Kubernetes cluster named $CLUSTER_NAME."
read -r -p "Type the cluster name to continue: " CONFIRM

if [[ "$CONFIRM" != "$CLUSTER_NAME" ]]; then
  echo "Confirmation did not match. Nothing deleted."
  exit 1
fi

civo kubernetes remove "$CLUSTER_NAME" --yes "${REGION_ARG[@]}"

echo "Delete request submitted. Confirm cleanup in the Civo dashboard."