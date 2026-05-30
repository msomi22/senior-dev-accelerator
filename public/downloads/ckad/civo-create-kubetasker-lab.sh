#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kubetasker-ckad}"
NODE_SIZE="${CIVO_NODE_SIZE:-g4s.kube.small}"
NODE_COUNT="${CIVO_NODE_COUNT:-1}"
REGION="${CIVO_REGION:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cluster-name) CLUSTER_NAME="$2"; shift 2 ;;
    --size) NODE_SIZE="$2"; shift 2 ;;
    --node-count) NODE_COUNT="$2"; shift 2 ;;
    --region) REGION="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

REGION_ARG=()
if [[ -n "$REGION" ]]; then
  REGION_ARG=(--region "$REGION")
fi

echo "Creating Civo Kubernetes cluster: $CLUSTER_NAME"
echo "Node size: $NODE_SIZE"
echo "Node count: $NODE_COUNT"

civo kubernetes create "$CLUSTER_NAME" \
  --nodes "$NODE_COUNT" \
  --size "$NODE_SIZE" \
  --wait \
  "${REGION_ARG[@]}"

echo "Saving kubeconfig."
civo kubernetes config "$CLUSTER_NAME" --save "${REGION_ARG[@]}"

echo "Cluster created. Verify with:"
echo "  k get nodes"
echo "  k cluster-info"