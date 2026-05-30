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

echo "Listing EC2 instances tagged Lab=$LAB_TAG in $REGION"
aws ec2 describe-instances \
  --filters "Name=tag:Lab,Values=$LAB_TAG" \
  --query "Reservations[].Instances[].{Name:Tags[?Key=='Name']|[0].Value,Role:Tags[?Key=='Role']|[0].Value,PublicIP:PublicIpAddress,PrivateIP:PrivateIpAddress,State:State.Name}" \
  --output table \
  --region "$REGION"