# AWS CloudFormation CKAD lab

This is the preferred preparation path for learners who want a small Linux VM running Kubernetes through kubeadm.

## What it creates

The downloadable CloudFormation template creates:

- one Ubuntu EC2 instance;
- security group rules for SSH and Kubernetes API access from the learner IP range;
- kubeadm-based single-node Kubernetes;
- containerd runtime;
- Flannel networking;
- an instance tag named `LabName=kubetasker-ckad`.

## Create

```bash
./aws-create-kubetasker-lab.sh \
  --key-name YOUR_EC2_KEY_PAIR \
  --ssh-location YOUR_PUBLIC_IP/32 \
  --region us-west-2
```

Optional flags:

```bash
--stack-name kubetasker-ckad
--instance-type t3.medium
--kubernetes-version 1.30
```

## Status

```bash
./aws-status-kubetasker-lab.sh --region us-west-2
```

The status script prints CloudFormation stack status, stack outputs, and EC2 instances filtered by the lab tag.

## SSH

```bash
ssh ubuntu@PUBLIC_IP
```

Then verify:

```bash
k get nodes -o wide
k get pods -A
```

## Stop and start

Pause compute cost when you want to keep the instance but stop practicing:

```bash
./aws-stop-kubetasker-lab.sh --region us-west-2
./aws-start-kubetasker-lab.sh --region us-west-2
```

After a start, SSH again and verify the node is healthy.

## Delete

Prefer delete when you are done:

```bash
./aws-delete-kubetasker-lab.sh --region us-west-2
```

## Notes

This path is intentionally simple. It is for CKAD command practice, not for production Kubernetes operations.