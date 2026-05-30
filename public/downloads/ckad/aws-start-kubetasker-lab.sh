#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-us-west-2}"
LAB_TAG="${LAB_TAG:-kubetasker-ckad}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --region) REGION="$2"; shift 2 ;;
    --lab-tag) LAB_TAG="$2"; shift 2 ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

echo "Finding stopped EC2 instances tagged Lab=$LAB_TAG in $REGION"
INSTANCE_IDS=$(aws ec2 describe-instances \
  --filters "Name=tag:Lab,Values=$LAB_TAG" "Name=instance-state-name,Values=stopped" \
  --query "Reservations[].Instances[].InstanceId" \
  --output text \
  --region "$REGION")

if [[ -z "$INSTANCE_IDS" || "$INSTANCE_IDS" == "None" ]]; then
  echo "No stopped lab instances found."
  exit 0
fi

echo "Starting lab instances: $INSTANCE_IDS"
aws ec2 start-instances --instance-ids $INSTANCE_IDS --region "$REGION"
echo "Start request submitted. After instances are running, SSH and verify with: k get nodes -o wide"