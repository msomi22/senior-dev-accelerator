#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kubetasker-ckad}"
REGION="${AWS_REGION:-eu-west-1}"
NODE_TYPE="${EKS_NODE_TYPE:-t3.small}"
NODES="${EKS_NODES:-1}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cluster-name) CLUSTER_NAME="$2"; shift 2 ;;
    --region) REGION="$2"; shift 2 ;;
    --node-type) NODE_TYPE="$2"; shift 2 ;;
    --nodes) NODES="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

echo "EKS is optional and can cost more than the simple lab paths."
echo "Creating EKS cluster: $CLUSTER_NAME in $REGION"

eksctl create cluster \
  --name "$CLUSTER_NAME" \
  --region "$REGION" \
  --nodes "$NODES" \
  --node-type "$NODE_TYPE" \
  --managed

echo "Cluster created. Verify with:"
echo "  k get nodes"
echo "  k cluster-info"