#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="${CLUSTER_NAME:-kubetasker-ckad}"
REGION="${AWS_REGION:-eu-west-1}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --cluster-name) CLUSTER_NAME="$2"; shift 2 ;;
    --region) REGION="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

echo "WARNING: this deletes the EKS cluster named $CLUSTER_NAME in $REGION."
read -r -p "Type the cluster name to continue: " CONFIRM

if [[ "$CONFIRM" != "$CLUSTER_NAME" ]]; then
  echo "Confirmation did not match. Nothing deleted."
  exit 1
fi

eksctl delete cluster --name "$CLUSTER_NAME" --region "$REGION"

echo "Cluster deletion requested. Confirm cleanup in AWS."