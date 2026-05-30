#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kubetasker-ckad}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cluster-name) CLUSTER_NAME="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

echo "WARNING: this deletes the DigitalOcean Kubernetes cluster named $CLUSTER_NAME."
read -r -p "Type the cluster name to continue: " CONFIRM

if [[ "$CONFIRM" != "$CLUSTER_NAME" ]]; then
  echo "Confirmation did not match. Nothing deleted."
  exit 1
fi

doctl kubernetes cluster delete "$CLUSTER_NAME" --force

echo "Delete request submitted. Confirm cleanup in the DigitalOcean dashboard."